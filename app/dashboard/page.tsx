'use client';

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import UsersTable from "@/components/dashboard/UsersTable";
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            {/* ====== Stats Grid ====== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Utilisateurs Total"
                    value="2,847"
                    icon={Users}
                />
                <StatCard
                    title="Revenus"
                    value="$48,352"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Commandes"
                    value="1,234"
                    icon={FileText}
                />
                <StatCard
                    title="Taux de Conversion"
                    value="3.2%"
                    icon={BarChart3}
                />
            </div>
            {/* ====== Users Table ====== */}
            <UsersTable />
        </DashboardLayout>
    );
}
