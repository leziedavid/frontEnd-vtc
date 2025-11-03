"use client"

import { useEffect, useState } from "react"
import { Role, CommandeStatus, Commande, Trajet, TrajetStatus, UserStatus, VehicleStatus } from "@/types/interfaces"
import { DriverCourses } from "@/components/dashboard/DriverCourses"
import { OrderSkeleton } from "@/components/dashboard/OrderSkeleton"
import { cancelCommande, validateCommande } from "@/app/services/commandeService"
import { getUserOrders } from "@/app/services/securityService"
import { toast } from "sonner"
import MapRead from "@/components/mapRead"

export default function Page() {

    const handleFinish = () => {
        alert('Course terminée !')
    }

    // Example usage

    const exampleTrajet: Trajet = {
        id: "50ccfa91-2c04-494d-822e-e76f3eb07805",
        driverId: "814d5f4d-4451-435e-b706-ec47eb69c503",
        partnerId: "814d5f4d-4451-435e-b706-ec47eb69c503",
        vehicleId: "10fac877-0008-45b2-a051-a093f8658cc0",

        departure: "Abidjan, Côte d'Ivoire",
        departureGPS: { lat: 5.3252258, lng: -4.019603 },
        destination: "Man, Côte d'Ivoire",
        destinationGPS: { lat: 7.406427499999999, lng: -7.557223100000001 },

        stops: [
            {
                name: "Yamoussoukro, Côte d'Ivoire",
                lat: 6.816274099999999,
                lng: -5.274362900000001,
                arrivalTime: new Date("2025-11-01T01:07:22.890Z"),
                estimatedDuration: "02:00",
            },
            {
                name: "Daloa, Côte d'Ivoire",
                lat: 6.8883341,
                lng: -6.4396888,
                arrivalTime: new Date("2025-11-01T02:17:07.410Z"),
                estimatedDuration: "01:10",
            },
        ],

        departureTime: new Date("2025-10-31T23:10:00.000Z"),
        estimatedArrival: new Date("2025-11-01T03:52:23.460Z"),
        estimatedDuration: "04:42",
        totalDistance: 564.782,
        distance: 564.782,
        disposition: "Ne pas être en retard",

        price: 2000,
        nbplaces: 2,
        status: TrajetStatus.PENDING,  // ✅ Typé avec l'enum

        createdAt: new Date("2025-10-31T23:11:01.961Z"),
        updatedAt: new Date("2025-11-01T00:32:34.499Z"),

        driver: {
            id: "814d5f4d-4451-435e-b706-ec47eb69c503",
            email: "admin@gmail.com",
            password: "",
            name: "Partner",
            phone: "0153686820",
            role: Role.PARTENAIRE,
            status: UserStatus.ACTIVE,
            createdAt: new Date("2025-10-27T02:46:21.091Z"),
            updatedAt: new Date("2025-10-27T02:53:35.176Z"),
            partnerId: "814d5f4d-4451-435e-b706-ec47eb69c503",
            driverTrajets: [],
            commandes: [],
            vehicles: [],
            messagesSent: [],
            messagesReceived: [],
        },

        partner: {
            id: "814d5f4d-4451-435e-b706-ec47eb69c503",
            name: "Partner",
            createdAt: new Date(),
            updatedAt: new Date(),
            users: [],
            fleet: [],
        },

        vehicle: {
            id: "10fac877-0008-45b2-a051-a093f8658cc0",
            registration: "123456789XYZ",
            typeId: "f1ccd2db-2815-4ee2-9ae3-b9f0dd6f07ed",
            type: {
                id: "f1ccd2db-2815-4ee2-9ae3-b9f0dd6f07ed",
                name: "Voiture standard",
                price: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                vehicles: [],
            },
            partnerId: "814d5f4d-4451-435e-b706-ec47eb69c503",
            marque: "SUZIKI ALTO",
            models: "",
            year: 2025,
            color: "ROUGE",
            mileage: 260,
            seats: 4,
            status: VehicleStatus.AVAILABLE,
            createdAt: new Date("2025-10-29T14:26:11.169Z"),
            updatedAt: new Date("2025-10-29T14:26:11.169Z"),
            trajets: [],
        },

        commandes: [],
    };


    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">

            <MapRead
                trajetId={exampleTrajet.id}
                trajetData={exampleTrajet}
                onFinish={handleFinish}
            />
        </div>
    )
}
