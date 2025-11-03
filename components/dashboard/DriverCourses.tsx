"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Commande, CommandeStatus, Role } from "@/types/interfaces";
import { useEffect, useState } from "react";

// 🔹 Couleurs du statut
const getStatusColor = (status: CommandeStatus) => {
    switch (status) {
        case CommandeStatus.PENDING:
            return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case CommandeStatus.CONFIRMED:
            return "bg-lime-400 text-green-700 border-green-300";
        case CommandeStatus.CANCELLED:
            return "bg-red-100 text-red-700 border-red-300";
        case CommandeStatus.STARTED:
            return "bg-blue-100 text-blue-700 border-blue-300";
        case CommandeStatus.COMPLETED:
            return "bg-gray-100 text-gray-600 border-gray-300";
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

interface DriverCoursesProps {
    commande: Commande[];
    onSelect?: (commande: Commande) => void;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
}

export const DriverCourses = ({ commande, onSelect, currentPage, totalItems, itemsPerPage, onNextPage, onPreviousPage, }: DriverCoursesProps) => {
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role") as Role | null;
        if (storedRole && Object.values(Role).includes(storedRole)) {
            setRole(storedRole);
        }
    }, []);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (!commande || commande.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500 text-sm">
                🚗 Aucune course enregistrée pour ce chauffeur.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {commande.map((com) => {
                const trajet = com.trajet;
                const totalCommandes = trajet?.commandes?.length || 0;
                const totalRevenu =
                    trajet?.commandes?.reduce((sum, c) => sum + c.price, 0) || 0;

                return (
                    <div
                        key={com.id}
                        onClick={() => onSelect?.(com)}
                        className="rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer shadow-sm border border-gray-200"
                    >
                        {/* Ligne principale */}
                        <div className="flex items-center justify-between p-3 sm:p-4 flex-wrap">
                            <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white border border-gray-200 shadow-sm flex-shrink-0">
                                    <Image
                                        src="/ride.png"
                                        alt="ride"
                                        width={34}
                                        height={34}
                                        className="object-contain"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm sm:text-base truncate">
                                        {trajet?.departure} → {trajet?.destination}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                                        Départ :{" "}
                                        {trajet?.departureTime
                                            ? new Date(trajet.departureTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "--:--"}{" "}
                                        • Arrivée :{" "}
                                        {trajet?.estimatedArrival
                                            ? new Date(trajet.estimatedArrival).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "--:--"}
                                    </p>
                                </div>
                            </div>

                            {/* Prix + Statut à droite */}
                            <div className="text-right flex flex-col items-end gap-1 mt-1 sm:mt-0 min-w-[90px]">
                                <p
                                    className={cn(
                                        "font-bold text-sm sm:text-base",
                                        com.price === 0 ? "text-gray-400" : "text-black"
                                    )}
                                >
                                    {com.price.toLocaleString()} XOF
                                </p>

                                <span
                                    className={`text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(
                                        com.status
                                    )}`}
                                >
                                    {getStatusLabel(com.status)}
                                </span>

                                <p className="text-[11px] text-gray-500">
                                    {totalCommandes} commande{totalCommandes > 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        {/* Détails supplémentaires */}
                        <div className="px-3 sm:px-4 pb-2 text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row justify-between gap-1 sm:gap-2">
                            <span>
                                Véhicule :{" "}
                                <strong>
                                    {trajet?.vehicle?.marque} {trajet?.vehicle?.models}
                                </strong>
                            </span>
                            <span>Durée : {trajet?.estimatedDuration || "N/A"}</span>
                        </div>

                        {/* 🔹 Revenu total (admin, partenaire, chauffeur) */}
                        {(role === Role.ADMIN || role === Role.PARTENAIRE || role === Role.DRIVER) && (
                            <div className="px-3 sm:px-4 pb-3 text-xs sm:text-sm text-gray-500">  Revenu total :{" "}
                                <strong>{totalRevenu.toLocaleString()} XOF</strong>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-2 space-x-2 px-2">
                    <button
                        onClick={onPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 text-sm rounded-md border ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        ◀
                    </button>
                    <span className="text-sm text-gray-600">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-2 py-1 text-sm rounded-md border ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        ▶
                    </button>
                </div>
            )}

        </div>
    );
};
