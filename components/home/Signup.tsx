'use client';

import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Role } from "@/types/interfaces";
import { Eye, EyeOff } from "lucide-react"; // <-- import des icônes

// ================= VALIDATION ZOD =================
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const phoneRegex = /^\+?\d{8,15}$/;

const userSchema = z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    phone: z.string()
        .regex(phoneRegex, "Numéro de téléphone invalide (8 à 15 chiffres, optionnel +)")
        .optional()
        .or(z.literal('')),
    password: z.string()
        .regex(passwordRegex, "Le mot de passe doit contenir 8 caractères minimum, avec une majuscule, un chiffre et un symbole"),
    confirmPassword: z.string(),
    images: z.array(z.union([z.instanceof(File), z.string(), z.null()]))
        .min(0)
        .max(4, "Maximum 4 fichiers autorisés"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userSchema>;

interface SignupProps {
    role: Role;
    initialValue?: Partial<UserFormValues>;
    onSubmit?: (data: FormData) => Promise<void>;
}

const roleFR: Record<Role, string> = {
    USER: "Utilisateur",
    ADMIN: "Administrateur",
    DRIVER: "Chauffeur",
    PARTENAIRE: "Partenaire",
};

export default function Signup({ role, initialValue, onSubmit }: SignupProps) {

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            images: [],
            ...initialValue,
        },
    });

    const [images, setImages] = useState<(File | string | null)[]>(() => {
        const init = initialValue?.images || [];
        const count = role === "USER" || role === "ADMIN" ? 1 : 4;
        return [...init, ...Array(count - init.length).fill(null)];
    });

    // State pour afficher/cacher le mot de passe
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleImageChange = (index: number, file: File | null) => {
        const updated = [...images];
        updated[index] = file;
        setImages(updated);
        setValue("images", updated);
    };

    const submitHandler: SubmitHandler<UserFormValues> = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            if (data.phone) formData.append("phone", data.phone);
            formData.append("password", data.password);
            formData.append("role", role);

            if (Array.isArray(data.images)) {
                data.images.forEach((file) => {
                    if (file instanceof File) formData.append("images", file);
                });
            }

            if (onSubmit) await onSubmit(formData);
            toast.success("Utilisateur créé avec succès !");
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la création de l'utilisateur");
        }
    };

    const fileLabels = role === "USER" || role === "ADMIN" ? ["Photo de profil (optionnelle)"] : ["Photo de profil", "Carte CNI", "Permis de conduire", "Autre document"];

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="text-slate-600 flex flex-col w-full max-w-3xl mx-auto p-6 lg:p-10 gap-6" >
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-800 uppercase"> Crée un compte {roleFR[role]} </h1>

            {/* NOM */}
            <label className="flex flex-col gap-2">
                Nom complet
                <input type="text" {...register("name")} placeholder="Entrez le nom complet" className="p-3 border border-slate-300 rounded outline-none" />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </label>

            {/* EMAIL */}
            <label className="flex flex-col gap-2">
                Adresse email
                <input type="email" {...register("email")} placeholder="Entrez l’adresse email" className="p-3 border border-slate-300 rounded outline-none" />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </label>

            {/* PHONE */}
            <label className="flex flex-col gap-2">
                Téléphone
                <input type="tel" {...register("phone")} placeholder="+225 0123456789" className="p-3 border border-slate-300 rounded outline-none" />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
            </label>

            {/* PASSWORD */}
            <label className="flex flex-col gap-2 relative">
                Mot de passe
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="••••••••"
                        className="p-3 border border-slate-300 rounded outline-none w-full pr-10"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </label>

            {/* CONFIRM PASSWORD */}
            <label className="flex flex-col gap-2 relative">
                Confirmer le mot de passe
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="••••••••"
                        className="p-3 border border-slate-300 rounded outline-none w-full pr-10"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
            </label>


            {/* IMAGES */}
            <div>
                <p className="font-medium mb-2">Documents / photos</p>
                <div className={`grid ${role === "USER" || role === "ADMIN" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-4"} gap-3`}>
                    {fileLabels.map((labelText, index) => {
                        const img = images[index] || null;
                        return (
                            <label key={index} htmlFor={`image${index}`}>
                                <Image width={300} height={300} className="h-32 w-full border border-slate-200 rounded object-cover cursor-pointer"
                                    src={img ? (typeof img === "string" ? img : URL.createObjectURL(img)) : "/upload_area.svg"}
                                    alt={labelText} />
                                <p className="text-center text-sm mt-1">{labelText}</p>
                                <input type="file" accept="image/*" id={`image${index}`} onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)} hidden />
                            </label>
                        );
                    })}
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message as string}</p>}
            </div>

            {/* SUBMIT */}
            <button type="submit" disabled={isSubmitting} className="bg-lime-500 hover:bg-lime-500 text-white py-3 px-6 rounded transition">
                {isSubmitting ? "Création..." : "Créer l’utilisateur"}
            </button>
        </form>
    );
    
}
