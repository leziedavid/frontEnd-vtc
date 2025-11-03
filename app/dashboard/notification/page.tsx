"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatAdmin from "@/components/chat/ChatAdmin";
import { getAllMessagesPaginated } from "@/app/services/ChatServices";
import DashboardLayout from "@/components/dashboard/DashboardLayout";


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const res = await getAllMessagesPaginated(currentPage, limit);
                if (res.data) {
                    setNotifications(res.data.data);
                    setTotalItems(res.data.total);
                    setCurrentPage(res.data.page);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des notifications", err);
            }
        }

        fetchNotifications();
    }, []);

    const handleOpenChat = (notif: any) => {
        console.log(notif.senderId);
        setUserId(notif.senderId); // pour ChatAdmin
        setSelectedQuestion(notif.label); // pour ChatAdmin
        setIsOpen(true);
    };

    return (

        <>
            <DashboardLayout>

                <div className="w-full overflow-x-auto">

                    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                        Message au suppoort informatique
                    </div>

                    <div className="p-4 space-y-4">

                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className="rounded-lg bg-gray-50 cursor-pointer"
                                onClick={() => handleOpenChat(notif)}
                            >
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-6 h-6 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm">{notif.text || "Nouveau message"}</p>

                                            {/* Nom du sender */}
                                            {notif.senderUser?.name && (
                                                <p className="text-xs text-[#B07B5E]">
                                                    De : <span className="font-semibold">{notif.senderUser.name}</span>
                                                </p>
                                            )}

                                            <p className="text-xs text-gray-500">
                                                {new Date(notif.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={cn(
                                                "text-xs px-2 py-1 rounded-full",
                                                notif.read ? "bg-gray-300 text-white" : "bg-green-800 text-white"
                                            )}
                                        >
                                            {notif.read ? "Lu" : "Nouveau"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <ChatAdmin isOpen={isOpen} onClose={() => setIsOpen(false)} question={selectedQuestion} userId={userId} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
