// types/paymentMethodes.ts

import { PaymentMethodes, Status } from "@/types/interfaces";

// Fake data de paiement
export const fakePaymentMethods: PaymentMethodes[] = [
    {
        id: "1",
        name: "WAVE",
        logo: "/wave2.png",
        status: Status.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "ORANGE_MONEY",
        logo: "/orange.png",
        status: Status.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "3",
        name: "MTN_MONEY",
        logo: "/mtn.jpeg",
        status: Status.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // moove money
    {
        id: "4",
        name: "MOOVE_MONEY",
        logo: "/moov.png",
        status: Status.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
    },


];

// simulate API call
export const fetchPaymentMethods = async (): Promise<PaymentMethodes[]> => {
    try {
        // Simuler un fetch réel
        const res = await fetch("/api/payment-methods");
        if (!res.ok) throw new Error("API failed");
        const data: PaymentMethodes[] = await res.json();
        if (!data || data.length === 0) return fakePaymentMethods;
        return data;
    } catch (err) {
        console.warn("Fetch payment methods failed, using fake data.", err);
        return fakePaymentMethods;
    }
};
