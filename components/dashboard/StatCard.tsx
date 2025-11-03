
'use client'


import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType; // Permet de passer n’importe quelle icône Lucide ou autre
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, }) => {

    return (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            {/* Haut de la carte : icône + évolution */}
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                    <Icon className="w-6 h-6 text-gray-700" />
                </div>
            </div>

            {/* Bas de la carte : titre + valeur */}
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default StatCard;
