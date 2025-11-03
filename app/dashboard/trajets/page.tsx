'use client';

import { useEffect, useState } from "react";
import { Role, Trajet } from "@/types/interfaces";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Table } from "@/components/table/tables/table";
import { TrajetColumns } from "@/components/table/columns/tableColumns";
import TrajetForm, { TrajetFormValues } from "@/components/forms/FormTrajet";
import { createTrajet, deleteTrajet, getTrajetsByDriver, updateTrajet } from "@/app/services/trajetService";
import { getUserRole } from "@/app/middleware";

export default function TrajetPage() {
    // const [trajets, setTrajets] = useState<Trajet[]>(fakeTrajets);
    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editValue, setEditValue] = useState<TrajetFormValues | undefined>(undefined);
    const [roles, setRoles] = useState<Role>(Role.USER);

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;
    const [totalItems, setTotalItems] = useState(0);


    const fetchRoles = async () => {
        const res = await getUserRole();
        if (res) {
            setRoles(res)
        }
    }

    useEffect(() => {
        fetchRoles();
    }, [])


    // 🔹 Récupération des véhicules existants
    const fetchTrajets = async () => {
        try {
            const res = await getTrajetsByDriver(currentPage);
            if (res.statusCode === 200 && res.data) {
                setTrajets(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur serveur");
        }
    };

    useEffect(() => {
        if (!roles) return;
        fetchTrajets();
    }, [roles, currentPage]);


    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (trajet: Trajet) => {

        const res = await deleteTrajet(trajet.id);
        if (res.statusCode === 200) {
            toast.success(res.message || "Trajet supprimé avec succès");
            fetchTrajets();
        } else {
            toast.error(res.message || "Erreur lors de la suppression du trajet");
        }
    };

    const handleUpdate = (trajet: Trajet) => {
        console.log("✏️ Modifier trajet:", trajet);

        // ✅ Normalisation des stops pour le formulaire
        const normalizedStops: TrajetFormValues['stops'] = Array.isArray(trajet.stops) ? trajet.stops.map((stop) => ({
            location: stop.name ?? "",
            latitude: stop.lat ?? 0,
            longitude: stop.lng ?? 0,
            arrivalTime: trajet.departureTime, // valeur par défaut, car Trajet n'a pas arrivalTime
            id: undefined, // si tu n'as pas d'id côté client
        }))
            : [];


        // ✅ Préparer l'objet à injecter dans le formulaire
        const editData: TrajetFormValues = {
            driverId: trajet.driverId,
            vehicleId: trajet.vehicleId,
            departure: trajet.departure,
            departureLatitude: trajet.departureGPS.lat,
            departureLongitude: trajet.departureGPS.lng,
            destination: trajet.destination,
            arrivalLatitude: trajet.destinationGPS.lat,
            arrivalLongitude: trajet.destinationGPS.lng,
            departureTime: trajet.departureTime ? new Date(trajet.departureTime) : new Date(),
            estimatedArrival: trajet.estimatedArrival ? new Date(trajet.estimatedArrival) : new Date(),
            disposition: trajet.disposition ?? "",
            stops: normalizedStops,
            id: trajet.id, // optionnel
            price: trajet.price,
            nbplaces: trajet.nbplaces,
        };

        // ✅ Injection dans le drawer / formulaire
        setEditValue(editData);
        setDrawerOpen(true);
    };


    const handleDeleteMultiple = (selected: Trajet[]) => {
        console.log("🧹 Supprimer plusieurs trajets:", selected);
    };

    // 🔹 Soumission du formulaire
    const handleTrajet = async (data: TrajetFormValues) => {
        try {

            let res;

            if (data.id) {
                // 🟢 Mise à jour
                res = await updateTrajet(data.id, data);
                toast.success(res.message || "Véhicule mis à jour !");
            } else {
                // 🆕 Création
                res = await createTrajet(data);
                toast.success(res.message || "Véhicule ajouté !");
            }

            // 🔁 Gestion des retours
            if (res.statusCode === 201) {
                setDrawerOpen(false);
                setEditValue(undefined);
                fetchTrajets();
            } else if (res.statusCode === 200) {
                setDrawerOpen(false);
                setEditValue(undefined);
                fetchTrajets();
            } else {
                toast.error(res.message || "Erreur lors de l'enregistrement");
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur lors de la création du trajet");
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-10 max-w-7xl mx-auto relative">
                <h1 className="text-3xl font-bold mb-6">Gestion des trajets</h1>
                {/* Bouton pour ouvrir le drawer */}
                <button onClick={() => { setDrawerOpen(true); setEditValue(undefined); }}
                    className="mb-4 bg-[#C89A7C] hover:bg-[#B07B5E] text-white px-4 py-2 rounded"  >
                    Ajouter un trajet
                </button>

                {/* Tableau des trajets */}
                <div className="overflow-x-auto">
                    <div className="w-full p-4">
                        <Table<Trajet>
                            data={trajets.slice((currentPage - 1) * limit, currentPage * limit)}
                            columns={TrajetColumns()}
                            enableMultiple={true}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onDeleteMultiple={handleDeleteMultiple}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={limit}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        />
                    </div>
                </div>

                {/* Drawer d'édition */}
                {drawerOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} ></div>

                        {/* Drawer */}
                        <div className="relative bg-white w-full sm:w-full md:w-2/3 lg:w-1/2 xl:w-2/5 h-full sm:h-3/4 md:h-full sm:rounded-t-lg md:rounded-l-lg overflow-auto transform animate-slide-in">
                            <div className="p-6 flex flex-col h-full">
                                <button className="mb-4 self-end text-gray-500 hover:text-gray-700" onClick={() => setDrawerOpen(false)} >
                                    Fermer
                                </button>
                                <div className="flex-1 overflow-auto">
                                    <TrajetForm onSubmit={handleTrajet} initialValue={editValue} />
                                    {/* <pre>{JSON.stringify(editValue, null, 2)}</pre> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
