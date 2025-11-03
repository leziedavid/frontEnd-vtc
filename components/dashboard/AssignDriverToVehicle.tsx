'use client';

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Table } from "@/components/table/tables/table";
import { MultiSelect, SelectOption } from "@/components/Select/MultiSelect";
import { Button } from "@/components/ui/button";
import { AssignedDriver } from "@/types/interfaces";
import { AssignedDriversColumns } from "../table/columns/tableColumns";
import { assignDriver, AssignDriverData, getAssignedDrivers } from "@/app/services/vehicleServices";
import { getDriversForMyPartners } from "@/app/services/userServices";

interface AssignDriverToVehicleProps {
    vehicleId: string;
}

export default function AssignDriverToVehicle({ vehicleId }: AssignDriverToVehicleProps) {

    const [drivers, setDrivers] = useState<SelectOption[]>([]);
    const [selectedDrivers, setSelectedDrivers] = useState<SelectOption[]>([]);
    const [assignedDrivers, setAssignedDrivers] = useState<AssignedDriver[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    /** 🔹 Charger les conducteurs assignés */
    const fetchAssignedDrivers = async () => {
        try {
            setLoading(true);
            const res = await getAssignedDrivers(vehicleId, currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setAssignedDrivers(res.data.data);
                setCurrentPage(res.data.page);
                setTotalItems(res.data.total);

            } else {
                toast.error(res.message || "Erreur lors du chargement des conducteurs assignés");
            }
        } catch (err: any) {
            toast.error(err.message || "Erreur lors du chargement des conducteurs");
        } finally {
            setLoading(false);
        }
    };

    /** 🔹 Charger la liste de tous les conducteurs disponibles */
    const fetchDrivers = async () => {
        try {
            const res = await getDriversForMyPartners();

            if (res.statusCode !== 200) {
                toast.error(res.message || "Erreur lors du chargement des conducteurs");
                return;

            } else {
                console.log("🚗 Conducteurs disponibles:", res.data);
                const data = res.data || [];
                setDrivers(data.map((d: any) => ({ id: d.id, label: d.name || `${d.firstName} ${d.lastName}` || "Conducteur", })));
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchDrivers();
        fetchAssignedDrivers();
    }, [currentPage]);



    const handleDelete = async (item: AssignedDriver) => {

        try {
            const data: AssignDriverData = {
                driverId: String(item.id), // 🔹 Conversion en string
                action: 'remove',
            };

            const res = await assignDriver(vehicleId, data);
            if (res.statusCode === 200) {

                toast.success(res.message || "Conducteur retiré avec succès");
                setSelectedDrivers([]);
                fetchAssignedDrivers();

            } else {
                toast.error(res.message);
            }

        } catch (err: any) {
            toast.error("Erreur lors de la suppression du conducteur");
        }

    }

    /** 🔹 Affecter un ou plusieurs conducteurs */
    const handleAssign = async () => {
        
        // 🔹 Vérifier que selectedDrivers existe et est un tableau
        if (!selectedDrivers || (Array.isArray(selectedDrivers) && selectedDrivers.length === 0)) {
            toast.warning("Veuillez sélectionner au moins un conducteur");
            return;
        }

        try {
            // 🔹 S'assurer que selectedDrivers est toujours un tableau
            const driversArray = Array.isArray(selectedDrivers) ? selectedDrivers : [selectedDrivers];

            const data: AssignDriverData = {
                driverId: driversArray.map(d => String(d.id)), // 🔹 Conversion en string
                action: 'assign', // 📝 mettre en minuscules pour correspondre à ton interface
            };

            console.log("🔹 Data:", data, vehicleId);

            const res = await assignDriver(vehicleId, data);
            if (res.statusCode === 200) {
                toast.success(res.message || "Conducteur(s) affecté(s) avec succès");
                setSelectedDrivers([]);
                fetchAssignedDrivers();
            } else {
                toast.error(res.message || "Erreur lors de l'affectation");
            }
        } catch (err: any) {
            console.error(err);
            toast.error("Erreur lors de l'affectation");
        }
    };

    /** 🔹 Retirer un conducteur */
    const handleRemove = async (driverId: string | number) => {
        try {
            const data: AssignDriverData = {
                driverId: String(driverId), // 🔹 Conversion en string
                action: 'remove',
            };

            const res = await assignDriver(vehicleId, data);
            if (res.statusCode === 200) {
                toast.success(res.message || "Conducteur retiré avec succès");
                fetchAssignedDrivers();
            } else {
                toast.error(res.message);
            }
        } catch (err: any) {
            toast.error("Erreur lors du retrait du conducteur");
        }
    };

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    return (
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Affecter un conducteur au véhicule</h2>

            {/* Sélection des conducteurs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <MultiSelect data={drivers} onChange={(val) => setSelectedDrivers(val as SelectOption[])} placeholder="Sélectionnez un ou plusieurs conducteurs" />
                <Button onClick={handleAssign} disabled={loading || selectedDrivers.length === 0} className="bg-[#C89A7C] hover:bg-[#B07B5E] text-white" >
                    {loading ? "Assignation..." : "Affecter"}
                </Button>
            </div>

            {/* Liste des conducteurs assignés */}
            <div className="overflow-x-auto">
                <Table<AssignedDriver>
                    data={assignedDrivers.slice((currentPage - 1) * limit, currentPage * limit)}
                    columns={AssignedDriversColumns()}
                    enableMultiple={true}
                    onDelete={handleDelete}
                    // onUpdate={handleUpdate}
                    // onAffecte={handleAffecte}
                    // onDeleteMultiple={handleDeleteMultiple}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                />
            </div>
        </div>
    );
}
