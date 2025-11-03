'use client';

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { MultiSelect, SelectOption } from "@/components/Select/MultiSelect";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { getUserInfos } from "@/app/middleware";
import { getVehiclesByOwner2 } from "@/app/services/vehicleServices";
import { Vehicle } from "@/types/interfaces";

// Composant dynamique
const LocationInput = dynamic(
    () => import("@/components/forms/LocationInput").then(mod => mod.LocationInput),
    { ssr: false }
);

// ---------------- Helpers ----------------
const DEFAULT_SPEED = 120; // km/h
const KM_TO_MS = 3600 * 1000 / DEFAULT_SPEED;

const toInputDatetimeLocal = (val: unknown) => {
    if (!val) return "";
    const d = val instanceof Date ? val : new Date(String(val));
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// ---------------- Schemas ----------------
const stopSchema = z.object({
    id: z.string().optional(),
    location: z.string().min(1, "Lieu requis"),
    latitude: z.preprocess(v => v === '' || v == null ? undefined : Number(v), z.number()),
    longitude: z.preprocess(v => v === '' || v == null ? undefined : Number(v), z.number()),
    arrivalTime: z.preprocess(v => v ? new Date(v as string | number | Date) : undefined, z.date()).optional(),
});

const trajetSchema = z.object({
    id: z.string().optional(),
    driverId: z.string().optional(), // par défaut optionnel
    vehicleId: z.string().min(1, "Véhicule requis"),
    departure: z.string().min(1, "Lieu de départ requis"),
    departureLatitude: z.preprocess(v => v === '' || v == null ? undefined : Number(v), z.number()),
    departureLongitude: z.preprocess(v => v === '' || v == null ? undefined : Number(v), z.number()),
    destination: z.string().min(1, "Destination requise"),
    arrivalLatitude: z.preprocess(v => v === '' || v == null ? undefined : Number(v), z.number()),
    arrivalLongitude: z.preprocess(v => v === '' || v == null ? undefined : Number(v), z.number()),
    departureTime: z.preprocess(v => v ? new Date(v as string | number | Date) : undefined, z.date()),
    estimatedArrival: z.preprocess(v => v ? new Date(v as string | number | Date) : undefined, z.date()).optional(),
    totalDistance: z.number().optional(),
    disposition: z.string().optional(),
    price: z.number().optional(),
    nbplaces: z.number().optional(),
    stops: z.array(stopSchema).optional(),
});

export type TrajetFormValues = z.infer<typeof trajetSchema>;

// ---------------- Component ----------------
interface TrajetProps {
    onSubmit?: (payload: any) => Promise<void>;
    initialValue?: Partial<TrajetFormValues>;
}

export default function TrajetForm({ onSubmit, initialValue }: TrajetProps) {
    const { isLoaded } = useGoogleMaps();

    const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
        useForm<TrajetFormValues>({
            resolver: zodResolver(trajetSchema),
            defaultValues: {
                driverId: "",
                vehicleId: "",
                departure: "",
                destination: "",
                stops: [],
                ...initialValue
            }
        });

    const { fields: stopsFields, append: appendStop, remove: removeStop } =
        useFieldArray({ control, name: "stops" });

    const [vehicles, setVehicles] = useState<SelectOption[]>([]);
    const [depart, setDepart] = useState(initialValue?.departure ?? "");
    const [destination, setDestination] = useState(initialValue?.destination ?? "");
    // const [selectedVehicle, setSelectedVehicle] = useState<SelectOption | undefined>(
    //     initialValue?.vehicleId ? { id: initialValue.vehicleId, label: initialValue.vehicleId } : undefined
    // );

    const [selectedVehicle, setSelectedVehicle] = useState<SelectOption | undefined>(undefined);

    // ---------------- Watchers ----------------
    const watchDepartureLat = watch("departureLatitude");
    const watchDepartureLng = watch("departureLongitude");
    const watchDepartureTime = watch("departureTime");
    const watchStops = watch("stops") ?? [];
    const watchArrivalLat = watch("arrivalLatitude");
    const watchArrivalLng = watch("arrivalLongitude");

    // ---------------- Auto Update (distances + arrivals) ----------------
    useEffect(() => {
        if (!isLoaded || !watchDepartureLat || !watchDepartureLng || !watchDepartureTime) return;
        if (!watchArrivalLat && !watchStops.length) return;

        const service = new google.maps.DistanceMatrixService();
        let totalDistanceKm = 0;
        let lastLat = watchDepartureLat;
        let lastLng = watchDepartureLng;
        let lastTime = new Date(watchDepartureTime);

        const segments: {
            origin: google.maps.LatLngLiteral;
            destination: google.maps.LatLngLiteral;
            stopIndex?: number;
        }[] = [];

        // Construire tous les segments : départ → stop1 → stop2 → destination
        watchStops.forEach((stop, idx) => {
            if (stop.latitude != null && stop.longitude != null) {
                segments.push({
                    origin: { lat: lastLat, lng: lastLng },
                    destination: { lat: stop.latitude, lng: stop.longitude },
                    stopIndex: idx
                });
                lastLat = stop.latitude;
                lastLng = stop.longitude;
            }
        });

        if (watchArrivalLat && watchArrivalLng) {
            segments.push({
                origin: { lat: lastLat, lng: lastLng },
                destination: { lat: watchArrivalLat, lng: watchArrivalLng }
            });
        }

        // Fonction récursive pour traiter chaque segment
        const processSegment = (i: number) => {
            if (i >= segments.length) {
                setValue("totalDistance", totalDistanceKm);
                return;
            }

            const seg = segments[i];
            service.getDistanceMatrix(
                {
                    origins: [seg.origin],
                    destinations: [seg.destination],
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (response, status) => {
                    if (status === "OK" && response?.rows?.[0]?.elements?.[0]?.status === "OK") {
                        const distMeters = response.rows[0].elements[0].distance.value;
                        const distKm = distMeters / 1000;
                        totalDistanceKm += distKm;

                        lastTime = new Date(lastTime.getTime() + distKm * KM_TO_MS);

                        if (typeof seg.stopIndex === "number") {
                            setValue(`stops.${seg.stopIndex}.arrivalTime`, lastTime);
                        } else {
                            setValue("estimatedArrival", lastTime);
                        }
                    }
                    processSegment(i + 1);
                }
            );
        };

        processSegment(0);
    }, [
        isLoaded,
        watchDepartureLat,
        watchDepartureLng,
        watchDepartureTime,
        watchArrivalLat,
        watchArrivalLng,
        watchStops.map(s => `${s.latitude}-${s.longitude}-${s.location}`).join("|")
    ]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await getVehiclesByOwner2();
                const vehiclesArray: Vehicle[] = Array.isArray(res?.data?.data) ? res.data.data : [];

                const options = vehiclesArray.map(v => ({
                    id: v.id,
                    label: v.marque ?? v.registration ?? String(v.id),
                }));
                setVehicles(options);

                // ✅ Si initialValue.vehicleId existe, le sélectionner automatiquement
                if (initialValue?.vehicleId) {
                    const selected = options.find(o => o.id === initialValue.vehicleId);
                    if (selected) {
                        setSelectedVehicle(selected);
                        setValue("vehicleId", selected.id); // met à jour le form
                    }
                }
            } catch (err) {
                console.error("Erreur chargement véhicules/conducteurs", err);
            }
        };

        fetchOptions();
    }, [initialValue, setValue]);




    // ---------------- Submit ----------------

    const submitHandler: SubmitHandler<TrajetFormValues> = async (data) => {
        try {
            const user = await getUserInfos();
            if (!user) {
                toast.error("Impossible de récupérer les informations de l'utilisateur");
                return;
            }

            const payload = {
                ...data,
                ...(data.id && { id: data.id }), // ajoute l'id seulement s'il existe
                driverId: user.id, // ✅ récupération directe depuis user.id
                departureLatitude: Number(data.departureLatitude),
                departureLongitude: Number(data.departureLongitude),
                arrivalLatitude: Number(data.arrivalLatitude),
                arrivalLongitude: Number(data.arrivalLongitude),
                totalDistance: Number(data.totalDistance ?? 0),
                stops: data.stops?.map((s) => ({
                    ...s,
                    latitude: Number(s.latitude),
                    longitude: Number(s.longitude),
                    arrivalTime: s.arrivalTime?.toISOString(),
                })),
                departureTime: data.departureTime?.toISOString(),
                estimatedArrival: data.estimatedArrival?.toISOString(),
            };

            if (onSubmit) await onSubmit(payload);

        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de l'enregistrement du trajet");
        }
    };

    // ---------------- Render ----------------
    return (
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col w-full max-w-3xl mx-auto p-6 lg:p-10 gap-6 text-slate-700">
            <h1 className="text-2xl lg:text-3xl font-semibold uppercase">Créer / Éditer un trajet</h1>

            {/* <pre>{JSON.stringify(initialValue, null, 2)}</pre> */}
            {/* Véhicule & Conducteur */}
            <div className="gap-4">
                <label className="block mb-1 font-medium">Véhicule</label>
                <MultiSelect
                    data={vehicles}
                    selected={selectedVehicle}
                    onChange={(val) => {
                        const sel = val as SelectOption;
                        setSelectedVehicle(sel);
                        setValue("vehicleId", sel.id.toString());
                    }}
                    placeholder="Sélectionnez un véhicule"
                />

                {errors.vehicleId && <p className="text-red-500 text-sm">{errors.vehicleId.message}</p>}
            </div>

            {/* Départ & Destination */}
            <div className="space-y-3">
                <LocationInput
                    placeholder="Lieu de départ"
                    value={depart}
                    onChange={(value) => {
                        setDepart(value);
                        setValue("departure", value);
                    }}
                    onCoordinates={(lat, lng) => {
                        setValue("departureLatitude", lat);
                        setValue("departureLongitude", lng);
                    }}
                />
                <LocationInput
                    placeholder="Destination"
                    value={destination}
                    onChange={(value) => {
                        setDestination(value);
                        setValue("destination", value);
                    }}
                    onCoordinates={(lat, lng) => {
                        setValue("arrivalLatitude", lat);
                        setValue("arrivalLongitude", lng);
                    }}
                />
            </div>

            {/* Price */}
            <label className="block mb-1 font-medium">Prix du trajets </label>
            <input type="number" {...register("price", { valueAsNumber: true })} placeholder="1500" className="p-3 border border-slate-300 rounded outline-none" />

            {/* nombre place disponible */}
            <label className="block mb-1 font-medium">Nombre de places disponibles </label>
            <input type="number" {...register("nbplaces", { valueAsNumber: true })} placeholder="1" className="p-3 border border-slate-300 rounded outline-none" />



            
            {/* Hidden coords + total distance */}
            <input type="hidden" {...register("departureLatitude", { valueAsNumber: true })} />
            <input type="hidden" {...register("departureLongitude", { valueAsNumber: true })} />
            <input type="hidden" {...register("arrivalLatitude", { valueAsNumber: true })} />
            <input type="hidden" {...register("arrivalLongitude", { valueAsNumber: true })} />
            <input type="hidden" {...register("totalDistance", { valueAsNumber: true })} />

            {/* Times */}
            <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col gap-2">
                    Départ - Date & heure
                    <Controller
                        control={control}
                        name="departureTime"
                        render={({ field }) => (
                            <input
                                type="datetime-local"
                                value={field.value ? toInputDatetimeLocal(field.value) : ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="p-3 border border-slate-300 rounded outline-none"
                            />
                        )}
                    />
                </label>

                <label className="flex flex-col gap-2">
                    Estimation d'arrivée
                    <Controller
                        control={control}
                        name="estimatedArrival"
                        render={({ field }) => (
                            <input
                                type="datetime-local"
                                value={field.value ? toInputDatetimeLocal(field.value) : ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="p-3 border border-slate-300 rounded outline-none"
                            />
                        )}
                    />
                </label>
            </div>

            {/* Disposition */}
            <label className="flex flex-col gap-2">
                Disposition (optionnel)
                <textarea {...register("disposition")} placeholder="Remarques, pauses prévues..." className="p-3 border border-slate-300 rounded outline-none" rows={3} />
            </label>

            {/* Stops */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Points d'arrêt (stops)</p>
                    <button
                        type="button"
                        onClick={() => appendStop({ location: "", latitude: 0, longitude: 0 })}
                        className="text-sm px-3 py-1 border rounded"
                    >
                        +
                    </button>
                </div>

                {stopsFields.map((stop, idx) => (
                    <div key={stop.id} className="p-3 border rounded mb-3">
                        <div className="flex justify-between items-center">
                            <p className="font-medium">Arrêt #{idx + 1}</p>
                            <button type="button" onClick={() => removeStop(idx)} className="text-sm text-red-600">✕</button>
                        </div>

                        <Controller
                            control={control}
                            name={`stops.${idx}.location`}
                            render={({ field }) => (
                                <LocationInput
                                    placeholder="Lieu d'arrêt"
                                    value={field.value ?? ""}
                                    onChange={(val) => field.onChange(val)}
                                    onCoordinates={(lat, lng) => {
                                        setValue(`stops.${idx}.latitude`, lat);
                                        setValue(`stops.${idx}.longitude`, lng);
                                    }}
                                />
                            )}
                        />


                        <input type="hidden" {...register(`stops.${idx}.latitude`)} />
                        <input type="hidden" {...register(`stops.${idx}.longitude`)} />

                        <label className="block mt-2 text-sm">Estimation d'arrivée</label>
                        <Controller
                            control={control}
                            name={`stops.${idx}.arrivalTime`}
                            render={({ field }) => (
                                <input
                                    type="datetime-local"
                                    value={field.value ? toInputDatetimeLocal(field.value) : ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="p-2 border border-slate-300 rounded outline-none w-full"
                                />
                            )}
                        />
                    </div>
                ))}
            </div>

            <button type="submit" disabled={isSubmitting} className="bg-[#C89A7C] hover:bg-[#B07B5E] text-white py-3 px-6 rounded transition" >
                {isSubmitting ? "Enregistrement..." : "Enregistrer le trajet"}
            </button>
        </form>
    );
}
