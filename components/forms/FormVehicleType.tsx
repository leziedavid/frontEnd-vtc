'use client';

import { useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createVehicleType, updateVehicleType } from "@/app/services/VehicleTypeServices";

// ================= VALIDATION ZOD =================
const vehicleTypeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Nom requis"),
    description: z.string().optional(),
    price: z.number().int().nonnegative("Le prix doit être positif"),
});

export type VehicleTypeFormValues = z.infer<typeof vehicleTypeSchema>;

interface VehicleTypeFormProps {
    onSubmit?: (data: VehicleTypeFormValues) => Promise<void>;
    initialValue?: Partial<VehicleTypeFormValues>;
}

export default function VehicleTypeForm({ onSubmit, initialValue }: VehicleTypeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<VehicleTypeFormValues>({
        resolver: zodResolver(vehicleTypeSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            ...initialValue,
        },
    });

    useEffect(() => {
        if (initialValue) reset(initialValue);
    }, [initialValue, reset]);

    // ---------------- Soumission ----------------
    const submitHandler: SubmitHandler<VehicleTypeFormValues> = async (data) => {

        try {
            if (onSubmit) await onSubmit(data);
            reset();
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de l’enregistrement du type de véhicule");
        }
    };

    // ---------------- Rendu ----------------
    return (
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col w-full max-w-lg mx-auto p-6 lg:p-8 gap-6 text-slate-700 border border-slate-200 rounded-lg bg-white shadow-sm" >
            
            <h1 className="text-2xl lg:text-3xl font-semibold uppercase">
                {initialValue?.id ? "Modifier un type de véhicule" : "Ajouter un type de véhicule"}
            </h1>

            {/* Nom */}
            <label className="flex flex-col gap-2">
                Nom du type
                <input
                    type="text"
                    {...register("name")}
                    placeholder="Économique, Luxe, etc."
                    className="p-3 border border-slate-300 rounded outline-none"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </label>

            {/* Description */}
            <label className="flex flex-col gap-2">
                Description
                <textarea
                    {...register("description")}
                    placeholder="Brève description du type de véhicule"
                    className="p-3 border border-slate-300 rounded outline-none min-h-[80px]"
                />
                {errors.description && (
                    <span className="text-red-500 text-sm">{errors.description.message}</span>
                )}
            </label>

            {/* Prix */}
            <label className="flex flex-col gap-2">
                Prix de base
                <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="1500"
                    className="p-3 border border-slate-300 rounded outline-none"
                />
                {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
            </label>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting}  className="bg-[#C89A7C] hover:bg-[#B07B5E] text-white py-3 px-6 rounded transition" >
                {isSubmitting ? "Enregistrement..."  : initialValue?.id ? "Mettre à jour" : "Créer"}
            </button>
        </form>
    );
}
