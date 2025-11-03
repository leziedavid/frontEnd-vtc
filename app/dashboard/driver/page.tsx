"use client";

import { CommandeStatus, Role, Trajet, TrajetStatus, UserStatus, VehicleStatus } from '@/types/interfaces';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Users, FileText, TrendingUp, BarChart3 } from "lucide-react";
import { getTrajetsByDriver } from '@/app/services/trajetService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    status: TrajetStatus.PENDING,
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

const DashboardDriver = () => {
    const router = useRouter();

    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const [trajetSelectionne, setTrajetSelectionne] = useState<Trajet | null>(null);
    const [loading, setLoading] = useState(true);

    // Nouveau système de pagination
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;
    const [totalItems, setTotalItems] = useState(0);

    // Calculs basés sur la nouvelle pagination
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (currentPage - 1) * limit + 1;
    const endIndex = Math.min(currentPage * limit, totalItems);

    const paginer = (numeroPage: number) => setCurrentPage(numeroPage);

    const getPlacesReservees = (trajet: Trajet) => trajet.commandes?.filter(commande => commande.status === CommandeStatus.CONFIRMED || commande.status === CommandeStatus.PENDING).length || 0;
    const getNombreSieges = (trajet: Trajet): number => trajet.vehicle?.seats || trajet.nbplaces || 4;

    const demarrerTrajet = (trajet: Trajet, e: React.MouseEvent) => {
        localStorage.setItem('data', JSON.stringify(trajet));
        e.stopPropagation();
        router.push('/rap-read');
        return;
    };

    // Fake stats basées sur tes trajets

    const statsData = [
        {
            id: 1,
            title: "Trajets du jour",
            value: totalItems.toString(),
            icon: Users,
        },
        {
            id: 2,
            title: "Places réservées",
            value: trajets.reduce((total, trajet) => total + getPlacesReservees(trajet), 0).toString(),
            icon: FileText,
        },
        {
            id: 3,
            title: "Revenu estimé",
            value: trajets.reduce((total, trajet) => total + (trajet.price * getPlacesReservees(trajet)), 0) + " Fcfa",
            icon: TrendingUp,
        },
    ];

    const selecteTrajets = (trajet: Trajet, isClick: boolean) => {
        if (isClick) {
            // Si on clique sur le même trajet, on le désélectionne
            if (trajetSelectionne?.id === trajet.id) {
                setTrajetSelectionne(null);
            } else {
                // Sinon on sélectionne le nouveau trajet
                setTrajetSelectionne(trajet);
            }
        }
    };

    const fetchTrajets = async () => {
        try {
            setLoading(true);
            const res = await getTrajetsByDriver(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setTrajets(res.data.data);
                setTotalItems(res.data.total);
                setLoading(false);
            } else {
                toast.error(res.message || "Erreur lors de la récupération des trajets");
                setLoading(false);
            }
        } catch (err: any) {
            console.error(err);
            toast.error("Erreur lors de la récupération des trajets");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrajets();
    }, [currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-10 max-w-7xl mx-auto relative">
                {/* ====== Stats Grid ====== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map((stat) => (
                        <StatCard
                            key={stat.id}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                <div className="p-6 space-y-6 overflow-x-hidden">
                    {/* Liste des trajets */}
                    <div className="bg-white rounded-lg">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800">Trajets du jour</h2>
                            <p className="text-xs text-gray-600">
                                {totalItems} trajet(s) • {trajets.reduce((total, trajet) => total + getPlacesReservees(trajet), 0)} place(s) réservée(s)
                            </p>
                        </div>

{/* <pre>  {JSON.stringify(trajets, null, 2)}</pre> */}
                        <div className="p-3 space-y-2">
                            {trajets.map((t) => {
                                const placesReservees = getPlacesReservees(t);
                                const siegesTotaux = getNombreSieges(t);
                                const placesDisponibles = siegesTotaux - placesReservees;
                                const pourcentageReserve = siegesTotaux > 0 ? (placesReservees / siegesTotaux) * 100 : 0;

                                return (
                                    <div
                                        key={t.id}
                                        onClick={() => selecteTrajets(t, true)}
                                        className={`cursor-pointer rounded-lg border-2 p-3 hover:bg-blue-50 transition-all relative flex flex-col sm:flex-row gap-2 ${trajetSelectionne?.id === t.id
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        {/* Icône voiture */}
                                        <div className="absolute -top-1 -left-1 w-5 h-5 opacity-60">
                                            <Image src="/ride.png" alt="Car" width={80} height={80} />
                                        </div>

                                        {/* Partie gauche: infos principales */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <p className="font-semibold text-sm text-gray-800 truncate break-words">
                                                    {t.departure} → {t.destination}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === TrajetStatus.PENDING
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : t.status === TrajetStatus.STARTED
                                                        ? "bg-blue-100 text-blue-800"
                                                        : t.status === TrajetStatus.COMPLETED
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {t.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="text-gray-600 truncate">
                                                    <span className="font-medium">Départ:</span>{" "}
                                                    {new Date(t.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                                <span className="text-gray-600 truncate">
                                                    <span className="font-medium">Durée:</span> {t.estimatedDuration}
                                                </span>
                                                <span className="text-green-600 font-semibold truncate">{t.price} Fcfa</span>
                                                <span className="text-gray-500 truncate">{placesReservees}/{siegesTotaux} places</span>
                                            </div>
                                        </div>

                                        {/* Partie droite: véhicule + conducteur + bouton */}
                                        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:gap-1 mt-1 sm:mt-0 justify-end min-w-[120px]">
                                            {/* Infos véhicule + conducteur visibles seulement sur sm et plus */}
                                            <div className="hidden sm:flex flex-row items-center gap-1">
                                                <span className="truncate">{t.vehicle?.marque || "Inconnue"}</span>
                                                <span>/</span>
                                                <span className="truncate">{t.vehicle?.registration || "Immat."}</span>
                                                <span>/</span>
                                                <span className="truncate">{t.driver?.name?.split(" ")[0] ?? "Chauffeur"}</span>
                                            </div>

                                            {/* Bouton de statut toujours visible */}
                                            {(t.status === TrajetStatus.PENDING || t.status === TrajetStatus.STARTED) && (
                                                <button
                                                    onClick={(e) => demarrerTrajet(t, e)}
                                                    className={`mt-1 sm:mt-0 ${t.status === TrajetStatus.PENDING
                                                        ? "bg-green-500 hover:bg-green-600"
                                                        : "bg-blue-500 hover:bg-blue-600"
                                                        } text-white px-2 py-1.5 rounded text-xs font-medium transition-colors shadow-sm`}
                                                >
                                                    {t.status === TrajetStatus.PENDING ? "Démarrer" : "En cours"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <p className="text-xs text-gray-700">
                                        Page {currentPage}/{totalPages} • {startIndex}-{endIndex} sur {totalItems}
                                    </p>
                                    <div className="flex space-x-1 overflow-x-auto flex-nowrap py-2">
                                        <button
                                            onClick={() => paginer(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Précédent
                                        </button>

                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => paginer(index + 1)}
                                                className={`px-2 py-1 rounded text-xs ${currentPage === index + 1
                                                    ? "bg-blue-500 text-white"
                                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => paginer(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Détails du trajet sélectionné */}
                    {trajetSelectionne && (
                        <div className="bg-white rounded-lg shadow p-4 mt-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Détails du trajet sélectionné</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700">Informations principales</h4>
                                    <p><strong>Départ:</strong> {trajetSelectionne.departure}</p>
                                    <p><strong>Destination:</strong> {trajetSelectionne.destination}</p>
                                    <p><strong>Heure de départ:</strong> {new Date(trajetSelectionne.departureTime).toLocaleString()}</p>
                                    <p><strong>Durée estimée:</strong> {trajetSelectionne.estimatedDuration}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">Véhicule</h4>
                                    <p><strong>Marque/Modèle:</strong> {trajetSelectionne.vehicle?.marque || "Inconnue"} {trajetSelectionne.vehicle?.models || ""}</p>
                                    <p><strong>Immatriculation:</strong> {trajetSelectionne.vehicle?.registration || "Inconnue"}</p>
                                    <p><strong>Places totales:</strong> {getNombreSieges(trajetSelectionne)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardDriver;