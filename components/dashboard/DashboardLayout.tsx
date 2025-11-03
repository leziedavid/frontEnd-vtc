import React, { ReactNode, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex flex-col h-screen">
            <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="flex flex-1 relative">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
                {/* Contenu principal */}
                <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};


export default DashboardLayout;
