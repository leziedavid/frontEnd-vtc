'use client';

import { useState, useEffect } from "react";
import AddVehicle, { VehicleFormValues } from "@/components/forms/FormVehicle";
import { Role, Vehicle, VehicleStatus } from "@/types/interfaces";
import { toast } from "sonner";
import { Table } from "@/components/table/tables/table";
import { VehicleColumns } from "@/components/table/columns/tableColumns";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createVehicle, getAllVehicles, updateVehicle } from "@/app/services/vehicleServices";
import { getUserRole } from "@/app/middleware";
import AssignDriverToVehicle from "@/components/dashboard/AssignDriverToVehicle";
import { CarFront, UserPen } from "lucide-react";
import DriversListe from "@/components/dashboard/DriversListe";



export default function VehiclePage() {

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [affecteOpen, setAffecteOpen] = useState(false);
    const [driversListeOpen, setDriversListeOpen] = useState(false);
    const [editValue, setEditValue] = useState<VehicleFormValues | undefined>(undefined);
    // initialisation obligatoire avec un rôle par défaut, par exemple USER
    const [roles, setRoles] = useState<Role>(Role.USER);

    const [vehicleId, setVehicleId] = useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleDelete = (item: Vehicle) => {
        console.log("🗑️ Supprimer utilisateur:", item)
    }

    const handleUpdate = (vehicle: Vehicle) => {
        console.log("✏️ Modifier véhicule:", vehicle);

        // ✅ Normalisation des images
        const normalizedImages: (string | File | undefined)[] = Array.isArray(vehicle.images) ? vehicle.images.map(img => typeof img === "string" ? img : (img as any).src ?? undefined) : [];
        // ✅ Normalisation des valeurs du formulaire
        const editData: VehicleFormValues = {
            id: vehicle.id ?? "",
            registration: vehicle.registration ?? "",
            typeId: vehicle.typeId ?? "",
            marque: vehicle.marque ?? "",
            models: vehicle.models ?? "",
            year: vehicle.year ?? new Date().getFullYear(),
            color: vehicle.color ?? "",
            mileage: vehicle.mileage ?? 0,
            seats: vehicle.seats ?? 0,
            status: vehicle.status ?? VehicleStatus.AVAILABLE,
            partnerId: vehicle.partnerId ?? "",
            driverId: vehicle.driverId ?? "",
            images: normalizedImages,
        };

        // ✅ Injection dans ton formulaire d’édition
        setEditValue(editData);
        setDrawerOpen(true);
    };

    const handleAffecte = async (vehicle: Vehicle) => {
        setVehicleId(vehicle.id);
        setAffecteOpen(true);
        // console.log("🧹 Affecter un conducteur:", vehicle)
    }


    const driversListe = async () => {
        setDriversListeOpen(true);
    }

    const handleDeleteMultiple = (vehicle: Vehicle[]) => {
        console.log("🧹 Supprimer plusieurs:", vehicle)
    }

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
    const fetchVehicles = async () => {
        try {
            const res = await getAllVehicles(currentPage);
            if (res.statusCode === 200 && res.data) {
                setVehicles(res.data.data);
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
        fetchVehicles();
    }, [roles, currentPage]);


    // 🔹 Soumission du formulaire
    const handleAddVehicle = async (formData: FormData) => {
        try {
            // Récupère l'id
            const id = formData.get("id") as string | null;
            let res;
            if (id) {
                formData.delete("id");
                res = await updateVehicle(id, formData);
                toast.success(res.message || "Véhicule mis à jour !");
                if (res.statusCode === 200) setDrawerOpen(false);
            } else {
                res = await createVehicle(formData);
                toast.success(res.message || "Véhicule ajouté !");
                if (res.statusCode === 201) setDrawerOpen(false);
            }

            if (res.statusCode === 201) {
                setDrawerOpen(false);
                fetchVehicles();
                setEditValue(undefined);

            } else if (res.statusCode === 200) {
                setDrawerOpen(false);
                fetchVehicles();
                setEditValue(undefined);
            } else {
                toast.error(res.message || "Erreur lors de l'enregistrement");
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur lors de l'ajout du véhicule");
        }
    };


    return (

        <DashboardLayout>
            <div className="p-6 lg:p-10 max-w-7xl mx-auto relative">
                <h1 className="text-3xl font-bold mb-6">Gestion des véhicules</h1>

                <div className="flex flex-nowrap gap-2 mb-4">
                    {/* Bouton pour ouvrir le drawer */}
                    <button
                        onClick={() => { setDrawerOpen(true); setEditValue(undefined); }}
                        className="flex items-center gap-2 bg-[#C89A7C] hover:bg-[#B07B5E] text-white px-4 py-2 rounded flex-shrink"
                    >
                        <CarFront className="w-4 h-4 text-gray-600" />
                        <span className="truncate">véhicule</span>
                    </button>

                    {/* Liste des conducteurs */}
                    <button
                        onClick={() => { driversListe(); }}
                        className="flex items-center gap-2 bg-[#C89A7C] hover:bg-[#B07B5E] text-white px-4 py-2 rounded flex-shrink"
                    >
                        <UserPen className="w-4 h-4 text-gray-600" />
                        <span className="truncate">chauffeur</span>
                    </button>
                </div>


                {/* Tableau des véhicules */}
                <div className="overflow-x-auto">
                    <div className="w-full p-4">
                        <Table<Vehicle>
                            data={vehicles.slice((currentPage - 1) * limit, currentPage * limit)}
                            columns={VehicleColumns()}
                            enableMultiple={true}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onAffecte={handleAffecte}
                            onDeleteMultiple={handleDeleteMultiple}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={limit}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        />
                    </div>
                </div>

                {drawerOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)}></div>

                        {/* Drawer */}
                        <div className=" relative bg-white w-full sm:w-full md:w-2/3 lg:w-1/2 xl:w-2/5 h-full sm:h-3/4 md:h-full sm:rounded-t-lg md:rounded-l-lg overflow-auto  transform  animate-slide-in "  >
                            <div className="p-6 flex flex-col h-full">
                                <button className="mb-4 self-end text-gray-500 hover:text-gray-700" onClick={() => setDrawerOpen(false)} >
                                    Fermer
                                </button>
                                <div className="flex-1 overflow-auto">
                                    <AddVehicle onSubmit={handleAddVehicle} initialValue={editValue} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {affecteOpen && (
                    <div className="fixed inset-0 z-50 flex justify-center items-center">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setAffecteOpen(false)}
                        ></div>

                        {/* Modal central plus grand */}
                        <div className="relative bg-white w-11/12 md:w-4/5 lg:w-3/4 h-5/6 rounded-lg overflow-auto transform animate-slide-in">
                            <div className="p-6 flex flex-col h-full">
                                <button
                                    className="mb-4 self-end text-gray-500 hover:text-gray-700"
                                    onClick={() => setAffecteOpen(false)}
                                >
                                    Fermer
                                </button>

                                <div className="flex-1 overflow-auto">
                                    <AssignDriverToVehicle vehicleId={vehicleId} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {driversListeOpen && (
                    <div className="fixed inset-0 z-50 flex justify-center items-center">
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50" onClick={() => setDriversListeOpen(false)} ></div>

                        {/* Modal central plus grand */}
                        <div className="relative bg-white w-11/12 md:w-4/5 lg:w-3/4 h-5/6 rounded-lg overflow-auto transform animate-slide-in">
                            <div className="p-6 flex flex-col h-full">
                                <button className="mb-4 self-end text-gray-500 hover:text-gray-700" onClick={() => setDriversListeOpen(false)}  >
                                    Fermer
                                </button>

                                <div className="flex-1 overflow-auto">
                                    <DriversListe isOpen={driversListeOpen} onClose={() => setDriversListeOpen(false)} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
