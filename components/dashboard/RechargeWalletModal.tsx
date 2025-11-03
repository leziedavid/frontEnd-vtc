"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentMethodes } from "@/types/interfaces";
import { fetchPaymentMethods } from "@/data/fakePaymentMethods";
import { CreditCard } from "lucide-react";
import { getWalletBalance, rechargeWallet } from "@/app/services/securityService";
import { toast } from "sonner";

const rechargeWalletSchema = z.object({
    phoneNumber: z.string().min(8, "Numéro invalide"),
    amount: z.number().min(1, "Montant minimum 1")
});

type RechargeWalletForm = z.infer<typeof rechargeWalletSchema>;

export const RechargeWalletModal: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodes[]>([]);
    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [open, setOpen] = useState(false); // <-- état pour contrôler le modal
    const [balance, setBalance] = useState<number | null>(null); // 💰 État du solde


    // 🔹 Récupérer le solde au montage
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await getWalletBalance();
                if (res.statusCode === 200 && res.data) {
                    setBalance(res.data.balance);
                } else {
                    toast.error("Impossible de récupérer le solde du wallet.");
                }
            } catch (error: any) {
                toast.error("Erreur lors de la récupération du solde.");
            }
        };
        fetchBalance();
    }, []);

    useEffect(() => {
        fetchPaymentMethods().then(data => setPaymentMethods(data));
    }, []);

    const handleSelectNetwork = (id: string) => setSelectedNetwork(id);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RechargeWalletForm>({
        resolver: zodResolver(rechargeWalletSchema)
    });

    const onSubmit = async (data: RechargeWalletForm) => {
        if (!selectedNetwork) {
            alert("Veuillez sélectionner une méthode de paiement");
            return;
        }

        const res = await rechargeWallet(data);

        if (res.statusCode === 200) {
            toast.success("Recharge effectuée avec succès.");
            console.log("Recharge Data:", { ...data, paymentMethod: selectedNetwork });
            reset();
            setSelectedNetwork(null);
            setOpen(false); // <-- fermer automatiquement le modal
        } else {
            toast.error("Une erreur est survenue lors de la recharge.");
        }
    };

    return (

        <div className="relative flex items-center gap-2">

            {/* 💰 Solde affiché avant le bouton */}
            <span className="text-sm font-medium text-gray-700"> Solde :{" "} <span className="text-green-600 font-semibold"> {balance !== null ? `${balance.toLocaleString()} F` : "0 F"} </span> </span>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className="p-2 hover:bg-gray-100 rounded-lg relative transition">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                    </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Recharger Wallet</DialogTitle>
                        <DialogDescription>
                            Sélectionnez la méthode de paiement, saisissez votre numéro et le montant à recharger.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                        <div className="flex gap-4 flex-wrap">
                            {paymentMethods.map(({ id, name, logo, status }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => status === "ACTIVE" && handleSelectNetwork(id)}
                                    disabled={status !== "ACTIVE"}
                                    className={`relative flex flex-col items-center rounded-full border-2 p-2 transition
                                    ${selectedNetwork === id && status === "ACTIVE" ? "border-green-500 shadow-md" : "border-transparent"}
                                    ${status !== "ACTIVE" ? "cursor-not-allowed opacity-40" : "hover:border-gray-300"}`}
                                    style={{ width: 70, height: 70 }}
                                >
                                    {logo && (
                                        <Image
                                            src={logo}
                                            alt={name}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                            unoptimized
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <Input placeholder="Numéro de téléphone" {...register("phoneNumber")} />
                        {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>}

                        <Input type="number" placeholder="Montant à recharger" {...register("amount", { valueAsNumber: true })} />
                        {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}

                        <DialogFooter className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => { setSelectedNetwork(null); setOpen(false); }}>Annuler</Button>
                            <Button type="submit" className="bg-blue-500 text-white">Recharger</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>

    );
};
