"use client";

import React, { useEffect, useState } from "react";
import { LayoutDashboard, Users, BarChart3, FileText, Settings, X, ChevronDown, Car, Map, LogOut } from "lucide-react";
import Link from "next/link";
import { Role } from "@/types/interfaces";
import { getUserInfos, getUserRole, logout } from "@/app/middleware";

interface MenuItem {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
    roles: Role[]; // Rôles autorisés à voir cet élément
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [userRole, setUserRole] = useState<Role>(Role.DRIVER);
    const [userInfos, setUserInfos] = useState<any>(null);

    // Définition des éléments de menu avec les rôles autorisés
    const menuItems: MenuItem[] = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/dashboard",
            active: true,
            roles: [Role.ADMIN]
        },
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/dashboard/driver",
            active: true,
            roles: [Role.PARTENAIRE, Role.DRIVER]
        },
        {
            icon: Users,
            label: "Utilisateurs",
            href: "/dashboard/utilisateurs",
            roles: [Role.ADMIN]
        },
        {
            icon: Car,
            label: "Type de véhicule",
            href: "/dashboard/vehicleTypes",
            roles: [Role.ADMIN]
        },
        {
            icon: FileText,
            label: "Commandes",
            href: "/dashboard/commandes",
            roles: [Role.ADMIN, Role.PARTENAIRE, Role.DRIVER]
        },
        {
            icon: Car,
            label: "Ma flotte",
            href: "/dashboard/vehicules",
            roles: [Role.ADMIN, Role.PARTENAIRE]
        },
        {
            icon: Map,
            label: "Mes trajets",
            href: "/dashboard/trajets",
            roles: [Role.ADMIN, Role.PARTENAIRE, Role.DRIVER]
        },
        {
            icon: BarChart3,
            label: "Historique des transactions",
            href: "/dashboard/transactions",
            roles: [Role.ADMIN, Role.PARTENAIRE]
        },

        {
            icon: Settings,
            label: "Paramètres",
            href: "/dashboard/parametres",
            roles: [Role.ADMIN, Role.PARTENAIRE, Role.DRIVER, Role.USER]
        },
    ];

    // Fonction pour filtrer les éléments de menu selon le rôle
    const getFilteredMenuItems = (): MenuItem[] => {
        return menuItems.filter(item => item.roles.includes(userRole));
    };

    const fetchUserInfos = async () => {
        try {
            const res = await getUserInfos();
            if (res) {
                setUserInfos(res);
                setUserRole(res.role);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des infos utilisateur:", error);
        }
    };

    useEffect(() => {
        fetchUserInfos();
    }, []);

    // Fonction pour obtenir les initiales de l'utilisateur
    const getUserInitials = () => {
        if (!userInfos?.name) return "U";
        return userInfos.name
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Fonction pour obtenir le libellé du rôle
    const getRoleLabel = (role: Role): string => {
        const roleLabels = {
            [Role.ADMIN]: "Administrateur",
            [Role.PARTENAIRE]: "Partenaire",
            [Role.DRIVER]: "Chauffeur",
            [Role.USER]: "Client"
        };
        return roleLabels[role] || "Utilisateur";
    };

    const filteredMenuItems = getFilteredMenuItems();

    const logouts = async () => {
        logout();
    }

    return (
        <>
            {/* Overlay mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed lg:static inset-x-0 bottom-0 lg:top-0 bg-white border-t lg:border-t-0 lg:border-r border-gray-200 z-50 transition-transform duration-300 ease-out rounded-t-3xl lg:rounded-none ${isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
                    } lg:${isOpen ? "w-64" : "w-20"}`}
            >
                <div className="h-full flex flex-col">
                    {/* Header mobile */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Logo Desktop */}
                    <div className="hidden lg:flex items-center p-6 border-b border-gray-200">
                        <div className="flex items-center justify-center w-full">
                            {isOpen ? (
                                <div className="flex flex-col items-center">
                                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {getRoleLabel(userRole)}
                                    </span>
                                </div>
                            ) : (
                                <div className="w-5 h-5 bg-gray-900 text-white flex items-center justify-center rounded-lg font-bold">
                                    D
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {filteredMenuItems.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.href} onClick={onClose}>
                                        <button
                                            className={`w-full flex items-center ${isOpen
                                                ? "justify-start gap-3 px-4"
                                                : "justify-center px-0"
                                                } py-3 rounded-lg transition-colors duration-200 ${item.active
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {isOpen && (
                                                <span className="font-medium text-sm">{item.label}</span>
                                            )}
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-gray-200">
                        <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${!isOpen && "justify-center"}`}  >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {getUserInitials()}
                            </div>

                            {isOpen && userInfos && (
                                <>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                            {userInfos.name || "Utilisateur"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {userInfos.email || ""}
                                        </p>
                                        <p onClick={() => logouts()} className="text-xs text-blue-600 font-medium mt-1">
                                            {getRoleLabel(userRole)} <LogOut size={20} />
                                        </p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;