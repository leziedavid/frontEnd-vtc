'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Role, VehicleStatus, VehicleStatusOptions } from "@/types/interfaces";
import { MultiSelect, SelectOption } from "@/components/Select/MultiSelect";
import { getAllVehicleTypesForFront } from "@/app/services/VehicleTypeServices";
import { getUserInfos } from "@/app/middleware";
import { getDriversForMyPartners } from "@/app/services/userServices";

const currentYear = new Date().getFullYear();

// ================= VALIDATION ZOD =================
const vehicleSchema = z.object({
    id: z.string().optional(),
    registration: z.string().min(2, "Immatriculation requise"),
    typeId: z.string().min(1, "Type de véhicule requis"),
    marque: z.string().min(2, "Marque requise"),
    models: z.string().min(1, "Modèle requis"),
    year: z.number().int().min(1990, "Année invalide").max(currentYear, "Année invalide"),
    color: z.string().optional(),
    mileage: z.number().int().nonnegative().optional(),
    seats: z.number().int().positive().optional(),
    status: z.nativeEnum(VehicleStatus),
    partnerId: z.string().optional(),
    driverId: z.string().optional(),
    images: z.array(z.union([z.instanceof(File), z.string(), z.undefined()])).min(0).max(4, "Maximum 4 fichiers autorisés"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface AddVehicleProps {
    onSubmit?: (data: FormData) => Promise<void>;
    initialValue?: Partial<VehicleFormValues>;
}

export default function AddVehicle({ onSubmit, initialValue }: AddVehicleProps) {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            registration: "",
            typeId: "",
            marque: "",
            models: "",
            year: currentYear,
            color: "",
            mileage: 0,
            seats: 4,
            status: VehicleStatus.AVAILABLE,
            images: [],
            ...initialValue,
        },
    });

    // ---------------- Images ----------------
    const [images, setImages] = useState<(File | string | undefined)[]>(() => {
        const init = initialValue?.images || [];
        return [...init, ...Array(4 - init.length).fill(undefined)];
    });

    const handleImageChange = (index: number, file: File | undefined) => {
        const updated = [...images];
        updated[index] = file;
        setImages(updated);
        setValue("images", updated);
    };

    const fileLabels = ["Photo véhicule", "Carte grise", "Autre document"];

    // ---------------- Sélections dynamiques ----------------
    const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);
    const [conducteurOptions, setConducteurOptions] = useState<SelectOption[]>([]);
    const [selectedConducteur, setSelectedConducteur] = useState<SelectOption | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<SelectOption | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<SelectOption | undefined>(
        initialValue?.status ? VehicleStatusOptions.map(opt => ({ id: opt.value, label: opt.label })) .find(opt => opt.id === initialValue.status)  : undefined
        );


    const isCreateMode = !initialValue?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🔹 Charger les types de véhicules
                const typesRes = await getAllVehicleTypesForFront();
                const vehicleTypeOptions: SelectOption[] = typesRes.data?.map(t => ({ id: t.key, label: t.value })) || [];
                setVehicleTypes(vehicleTypeOptions);

                // Préselection type si initialValue
                if (initialValue?.typeId) {
                    const initType = vehicleTypeOptions.find(t => t.id === initialValue.typeId);
                    if (initType) setSelectedType(initType);
                }

                // 🔹 Infos utilisateur
                const user = await getUserInfos();
                if (!user) return;

                if (isCreateMode) {
                    // Préselection conducteur/partenaire en création
                    const option: SelectOption = { id: user.id, label: user.name || "Utilisateur" };
                    setConducteurOptions([option]);
                    setSelectedConducteur(option);

                    if (user.role === Role.PARTENAIRE) setValue("partnerId", user.id);
                    else if (user.role === Role.DRIVER) setValue("driverId", user.id);

                } else {
                    // Edition: récupérer tous les conducteurs
                    const driversRes = await getDriversForMyPartners(); // BaseResponse<User[]>
                    const allOptions: SelectOption[] = driversRes.data?.map(driver => ({
                        id: driver.id,
                        label: driver.name || driver.email || "Utilisateur"
                    })) || [];

                    setConducteurOptions(allOptions);

                    if (initialValue?.driverId) {
                        const initSel = allOptions.find(o => o.id === initialValue.driverId);
                        if (initSel) setSelectedConducteur(initSel);
                    }
                }


            } catch (err) {
                console.error("Erreur chargement des options", err);
                toast.error("Erreur lors du chargement des options");
            }
        };

        fetchData();
    }, []);

    // ---------------- Soumission ----------------
    const submitHandler: SubmitHandler<VehicleFormValues> = async (data) => {
        try {
            const formData = new FormData();
            formData.append("registration", data.registration);
            formData.append("typeId", data.typeId);
            formData.append("marque", data.marque);
            formData.append("models", data.models);
            formData.append("year", data.year.toString());
            if (data.color) formData.append("color", data.color);
            if (data.mileage !== undefined) formData.append("mileage", data.mileage.toString());
            if (data.seats !== undefined) formData.append("seats", data.seats.toString());
            if (data.id) formData.append("id", data.id);
            formData.append("status", data.status);
            if (data.partnerId) formData.append("partnerId", data.partnerId.toString());
            if (data.driverId) formData.append("driverId", data.driverId.toString());
            if (Array.isArray(data.images)) {
                data.images.forEach(file => file instanceof File && formData.append("images", file));
            }

            if (onSubmit) await onSubmit(formData);

        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de l'ajout du véhicule");
        }
    };

    // ---------------- Rendu ----------------
    return (
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col w-full max-w-3xl mx-auto p-6 lg:p-10 gap-6 text-slate-700">
            <h1 className="text-2xl lg:text-3xl font-semibold uppercase">Ajouter un véhicule</h1>


            {/* Immatriculation */}
            <label className="flex flex-col gap-2">
                Immatriculation
                <input type="text" {...register("registration")} placeholder="AB-123-CD" className="p-3 border border-slate-300 rounded outline-none" />
                {errors.registration && <span className="text-red-500 text-sm">{errors.registration.message}</span>}
            </label>

            {/* Type de véhicule */}
            <div className="w-full">
                <label className="block mb-1 font-medium">Type de véhicule</label>
                <MultiSelect
                    data={vehicleTypes}
                    selected={selectedType}
                    onChange={(val) => {
                        const sel = val as SelectOption;
                        setSelectedType(sel);
                        setValue("typeId", sel.id.toString());
                    }}
                    placeholder="Sélectionnez un type"
                />
                {errors.typeId && <p className="text-red-500 text-sm">{errors.typeId.message}</p>}
            </div>

            {/* Marque & Modèle */}
            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                    Marque
                    <input type="text" {...register("marque")} placeholder="Toyota" className="p-3 border border-slate-300 rounded outline-none" />
                    {errors.marque && <span className="text-red-500 text-sm">{errors.marque.message}</span>}
                </label>
                <label className="flex flex-col gap-2">
                    Modèle
                    <input type="text" {...register("models")} placeholder="Corolla" className="p-3 border border-slate-300 rounded outline-none" />
                    {errors.models && <span className="text-red-500 text-sm">{errors.models.message}</span>}
                </label>
            </div>

            {/* Année & Couleur */}
            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                    Année
                    <input type="number" {...register("year", { valueAsNumber: true })} placeholder="2022" className="p-3 border border-slate-300 rounded outline-none" />
                    {errors.year && <span className="text-red-500 text-sm">{errors.year.message}</span>}
                </label>
                <label className="flex flex-col gap-2">
                    Couleur
                    <input type="text" {...register("color")} placeholder="Noir" className="p-3 border border-slate-300 rounded outline-none" />
                </label>
            </div>

            {/* Kilométrage & Sièges */}
            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                    Kilométrage
                    <input type="number" {...register("mileage", { valueAsNumber: true })} placeholder="15000" className="p-3 border border-slate-300 rounded outline-none" />
                </label>
                <label className="flex flex-col gap-2">
                    Nombre de sièges
                    <input type="number" {...register("seats", { valueAsNumber: true })} placeholder="4" className="p-3 border border-slate-300 rounded outline-none" />
                </label>
            </div>

            {/* Conducteur */}
            <div className="w-full">
                <label className="block mb-1 font-medium">Conducteur</label>
                <MultiSelect
                    data={conducteurOptions}
                    selected={selectedConducteur}
                    onChange={(val) => { const sel = val as SelectOption; setSelectedConducteur(sel);
                        const userRole = initialValue?.id ? Role.ADMIN : sel?.id === selectedConducteur?.id ? Role.DRIVER : Role.PARTENAIRE;
                        setValue(userRole === Role.PARTENAIRE ? "partnerId" : "driverId", sel.id.toString());
                    }}
                    placeholder="Sélectionnez un conducteur"
                    disabled={isCreateMode} // readonly en création
                />
            </div>

            {/* Statut */}
            <div className="w-full">
                <label className="block mb-1 font-medium">Statut</label>
                <MultiSelect
                    data={VehicleStatusOptions.map(opt => ({ id: opt.value, label: opt.label }))}
                    selected={selectedStatus}
                    onChange={(val) => {
                        const sel = val as SelectOption;
                        setSelectedStatus(sel);
                        setValue("status", sel.id as VehicleStatus);
                    }}
                    placeholder="Sélectionnez un statut"  />
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

            {/* Images */}
            <div>
                <p className="font-medium mb-2">Documents / photos</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {fileLabels.map((labelText, index) => {
                        const img = images[index] || undefined;
                        return (
                            <label key={index} htmlFor={`image${index}`}>
                                <Image
                                    width={300}
                                    height={300}
                                    className="h-32 w-full border border-slate-200 rounded object-cover cursor-pointer"
                                    src={img ? (typeof img === "string" ? img : URL.createObjectURL(img)) : "/upload_area.svg"}
                                    alt={labelText}
                                />
                                <p className="text-center text-sm mt-1">{labelText}</p>
                                <input type="file" accept="image/*" id={`image${index}`} onChange={(e) => handleImageChange(index, e.target.files?.[0])} hidden />
                            </label>
                        );
                    })}
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message as string}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="bg-[#C89A7C] hover:bg-[#B07B5E] text-white py-3 px-6 rounded transition">
                {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
            </button>
        </form>
    );
}


