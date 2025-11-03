"use client";

import React from "react";
import { Menu, Search, Bell, ChevronLeft } from "lucide-react";
import { RechargeWalletModal } from "./RechargeWalletModal";
import { useRouter } from 'next/navigation';


interface HeaderProps {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
        const router = useRouter();

        const alerts = async () => {
            router.push('/dashboard/notification');
        }


    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition"  title={isSidebarOpen ? "Réduire le menu" : "Ouvrir le menu"}  >
                        {isSidebarOpen ? (
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-700" />
                        )}
                    </button>

                    <h1 className="text-xl font-bold text-gray-800 lg:hidden">MonApp</h1>
                    <h2 className="hidden lg:block text-2xl font-bold text-gray-800">Dashboard</h2>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                        <Search className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Rechercher...</span>
                    </button>

                    {/* Recharge Wallet icône */}
                    <RechargeWalletModal />

                    {/* Notifications */}
                    <button onClick={alerts} className="p-2 hover:bg-gray-100 rounded-lg relative transition">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
