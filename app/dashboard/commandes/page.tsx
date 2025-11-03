"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { Role, CommandeStatus, Commande } from "@/types/interfaces";
import { DriverCourses } from "@/components/dashboard/DriverCourses";
import { OrderSkeleton } from "@/components/dashboard/OrderSkeleton";
import { cancelCommande, validateCommande } from "@/app/services/commandeService";
import { getUserOrders } from "@/app/services/securityService";
import { toast } from "sonner";

export default function Page() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [role, setRole] = useState<Role>(Role.DRIVER);
    const [isReady, setIsReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
    // const [commandes, setCommandes] = useState(fakeCommandes);
    const [commandes, setCommandes] = useState<Commande[]>([]);



    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(5);

    // 🔹 Simule le chargement
    useEffect(() => {
        const storedRole = localStorage.getItem("role") as Role | null;
        if (storedRole && Object.values(Role).includes(storedRole)) {
            setRole(storedRole);
        }

        setIsReady(true);

        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    // 🔹 Fonction prête pour appel API futur
    const updateCommandeStatus = async (id: string, status: CommandeStatus) => {
        try {

            const res = await validateCommande(id, status);
            if (res.statusCode === 200) {
                setCommandes((prev: Commande[]) => prev.map((c) => c.id === id ? { ...c, status } : c));
                setSelectedCommande((prev: Commande | null) => prev ? { ...prev, status } : prev);
                toast.success(res.message || "Commande validée avec succès");
                setDrawerOpen(false);
                getDriversCommande();
            }
        } catch (error) {
            console.error("Erreur lors du changement de statut :", error);
        }
    };

    const handleValidate = () => {
        if (!selectedCommande) return;
        updateCommandeStatus(selectedCommande.id, CommandeStatus.CONFIRMED);
    };
    // 🔹 Annuler une commande
    const handleCancel = async () => {
        if (!selectedCommande) return;
        try {
            const data = await cancelCommande(selectedCommande.id, "USER");
            if (data.statusCode === 200) {
                setCommandes((prev: Commande[]) => prev.map((c) => c.id === selectedCommande.id ? { ...c, status: CommandeStatus.CANCELLED } : c));
                setSelectedCommande((prev: Commande | null) => prev ? { ...prev, status: CommandeStatus.CANCELLED } : prev);
                toast.success(data.message || "Commande annulée avec succès");
                setDrawerOpen(false);
                getDriversCommande();
            }
        } catch (error) {
            console.error("Erreur lors de l’annulation :", error);
        }
    };

    // 🔹 Couleurs du statut
    const getStatusColor = (status: CommandeStatus) => {
        switch (status) {
            case CommandeStatus.PENDING:
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case CommandeStatus.CONFIRMED:
                return "bg-lime-400 text-green-700 border-green-300";
            case CommandeStatus.CANCELLED:
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-gray-100 text-gray-600 border-gray-300";
        }
    };

    // 🔹 Traduction lisible du statut
    const getStatusLabel = (status: CommandeStatus) => {
        switch (status) {
            case CommandeStatus.PENDING:
                return "En attente";
            case CommandeStatus.CONFIRMED:
                return "Confirmée";
            case CommandeStatus.CANCELLED:
                return "Annulée";
            case CommandeStatus.STARTED:
                return "En cours";
            case CommandeStatus.COMPLETED:
                return "Terminée";
            default:
                return "Inconnu";
        }
    };

    const getDriversCommande = async () => {
        const res = await getUserOrders(currentPage, limit);
        if (res.statusCode === 200 && res.data) {
            setTotalItems(res.data.total);
            setCurrentPage(res.data.page);
            setCommandes(res.data.data);
        } else {
            toast.error(res.message || "Erreur lors de la récupération des commandes");
        }
    };

    useEffect(() => {
        getDriversCommande();
    }, [currentPage]);


    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }
    if (!isReady) return null;

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-10 max-w-7xl mx-auto relative">
                <h1 className="text-3xl font-bold mb-6">Gestion des commandes</h1>

                {loading ? (
                    <OrderSkeleton />
                ) : (
                    <DriverCourses
                        commande={commandes}
                        onSelect={(com) => { setSelectedCommande(com); setDrawerOpen(true); }}

                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={limit}
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                    />
                )}
            </div>

            {/* Drawer d’infos sur une commande */}
            {drawerOpen && selectedCommande && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    {/* Fond sombre */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} ></div>

                    {/* Contenu du ticket */}
                    <div className="relative bg-white w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 h-auto sm:rounded-lg overflow-auto transform animate-slide-in p-6 flex flex-col gap-4 shadow-lg">
                        {/* Bouton fermer */}
                        <button className="self-end text-gray-500 hover:text-gray-700 mb-2" onClick={() => setDrawerOpen(false)}>
                            Fermer
                        </button>

                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                            <h2 className="text-2xl font-bold mb-2 text-center">Ticket de trajet</h2>

                            {/* Infos client */}
                            <div className="mb-3">
                                <p><strong>Client :</strong> {selectedCommande.user.name}</p>
                                <p><strong>Téléphone :</strong> {selectedCommande.user.phone}</p>
                            </div>

                            {/* Trajet */}
                            <div className="mb-3">
                                <p className="font-semibold">Trajet :</p>
                                <p>{selectedCommande.trajet.departure} → {selectedCommande.trajet.destination}</p>
                                <p><strong>Départ :</strong> {new Date(selectedCommande.trajet.departureTime).toLocaleString()}</p>
                                <p><strong>Arrivée estimée :</strong> {new Date(selectedCommande.trajet.estimatedArrival).toLocaleString()}</p>

                                {/* Arrêts */}
                                {selectedCommande.trajet.stops && selectedCommande.trajet.stops.length > 0 && (
                                    <div className="mt-1">
                                        <p className="font-semibold">Arrêts :</p>
                                        <ul className="list-disc list-inside">
                                            {selectedCommande.trajet.stops.map((stop, idx) => (
                                                <li key={idx}>
                                                    {stop.name}{stop.arrivalTime ? ` à ${new Date(stop.arrivalTime).toLocaleTimeString()}` : ''}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Info véhicule */}
                            <div className="mb-3 border-t pt-2">
                                <p className="font-semibold">Véhicule :</p>
                                <p><strong>Marque :</strong> {selectedCommande.trajet.vehicle.marque}</p>
                                <p><strong>Immatriculation :</strong> {selectedCommande.trajet.vehicle.registration}</p>
                                <p><strong>Places :</strong> {selectedCommande.trajet.vehicle.seats || selectedCommande.trajet.nbplaces}</p>
                                <p><strong>Couleur :</strong> {selectedCommande.trajet.vehicle.color || '-'}</p>
                            </div>

                            {/* Prix & statut */}
                            <div className="mb-3 border-t pt-2 flex justify-between items-center">
                                <p><strong>Prix :</strong> {selectedCommande.price.toLocaleString()} XOF</p>
                                <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getStatusColor(selectedCommande.status)}`}>
                                    {getStatusLabel(selectedCommande.status)}↓
                                </span>
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end gap-2 mt-2">
                                {/* Bouton fermer */}
                                <button onClick={() => setDrawerOpen(false)} className="py-2 px-4 text-sm rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" >
                                    Fermer
                                </button>

                                {/* Bouton annuler la commande */}
                                <button onClick={handleCancel} disabled={selectedCommande.status === CommandeStatus.CANCELLED} className={`py-2 px-4 text-sm  rounded-md border transition-colors ${selectedCommande.status === CommandeStatus.CANCELLED ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed" : "border-red-500 bg-red-500 text-white hover:bg-red-600"}`} >
                                    Annuler
                                </button>

                                <button onClick={handleValidate} disabled={selectedCommande.status !== CommandeStatus.PENDING} className={`flex-1 py-2 text-sm  rounded-md border transition-colors ${selectedCommande.status !== CommandeStatus.PENDING ? "bg-gray-100 text-gray-400 cursor-not-allowed" : " bg-green-500 text-white hover:bg-lime-400"}`} >
                                    Valider
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}
