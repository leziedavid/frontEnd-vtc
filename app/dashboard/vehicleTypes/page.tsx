'use client';

import { useState, useEffect } from "react";
import VehicleTypeForm, { VehicleTypeFormValues } from "@/components/forms/FormVehicleType";
import { VehicleType, VehicleTypeKeyValue } from "@/types/interfaces";
import { toast } from "sonner";
import { Table } from "@/components/table/tables/table";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { VehicleTypeColumns } from "@/components/table/columns/tableColumns";
import { createVehicleType, updateVehicleType, deleteVehicleType, getAllVehicleTypesList, } from "@/app/services/VehicleTypeServices";

export default function VehicleTypePage() {

    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editValue, setEditValue] = useState<VehicleTypeFormValues | undefined>(undefined);

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5; // éléments par page
    const totalItems = vehicleTypes.length;

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // 🔹 Fetch vehicle types
    const fetchVehicleTypes = async () => {
        try {
            const res = await getAllVehicleTypesList();
            if (!res.data) throw new Error(res.message || "Erreur lors du chargement");
            setVehicleTypes(res.data);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur serveur");
        }
    };

    useEffect(() => {
        fetchVehicleTypes();
    }, []);

    const handleDelete = async (item: VehicleType) => {
        try {
            await deleteVehicleType(item.id);
            toast.success("Type de véhicule supprimé !");
            fetchVehicleTypes();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur lors de la suppression");
        }
    };

    const handleUpdate = (item: VehicleType) => {
        const editData: VehicleTypeFormValues = {
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: item.price,
        };
        setEditValue(editData);
        setDrawerOpen(true);
    };

    const handleDeleteMultiple = (items: VehicleType[]) => {
        console.log("🧹 Supprimer plusieurs types :", items);
        // Implémentation réelle si nécessaire
    };

    const handleAddVehicleType = async (data: VehicleTypeFormValues) => {
        try {
            // console.log("Données soumises :", data.id);
            let res;
            if (data.id) {
                res = await updateVehicleType(data.id, data);
                toast.success(res.message || "Type de véhicule mis à jour !");
            } else {
                res = await createVehicleType(data);
                toast.success(res.message || "Type de véhicule créé !");
            }

            if (res.statusCode === 201) {
                setDrawerOpen(false);
                setEditValue(undefined);
                fetchVehicleTypes();

            } else if (res.statusCode === 200) {
                setDrawerOpen(false);
                setEditValue(undefined);
                fetchVehicleTypes();
                
            } else {
                toast.error(res.message || "Erreur lors de l'enregistrement");
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur lors de l'enregistrement");
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-10 max-w-7xl mx-auto relative">
                <h1 className="text-3xl font-bold mb-6">Gestion des types de véhicules</h1>

                {/* Bouton pour ouvrir le drawer */}
                <button onClick={() => { setDrawerOpen(true); setEditValue(undefined); }} className="mb-4 bg-[#C89A7C] hover:bg-[#B07B5E] text-white px-4 py-2 rounded" >
                    Ajouter un type de véhicule
                </button>

                {/* Tableau */}
                <div className="overflow-x-auto">
                    <div className="w-full p-4">
                        <Table<VehicleType>
                            data={vehicleTypes.slice((currentPage - 1) * limit, currentPage * limit)}
                            columns={VehicleTypeColumns()}
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

                {/* Drawer */}
                {drawerOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)}></div>
                        {/* Drawer */}
                        <div className="relative bg-white w-full sm:w-full md:w-2/3 lg:w-1/2 xl:w-2/5 h-full sm:h-3/4 md:h-full sm:rounded-t-lg md:rounded-l-lg overflow-auto transform animate-slide-in">
                            <div className="p-6 flex flex-col h-full">
                                <button className="mb-4 self-end text-gray-500 hover:text-gray-700" onClick={() => setDrawerOpen(false)}>
                                    Fermer
                                </button>
                                <div className="flex-1 overflow-auto">
                                    <VehicleTypeForm initialValue={editValue} onSubmit={handleAddVehicleType} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
