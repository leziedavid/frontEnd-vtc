// app/aide-assistance/page.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import Chat from "@/components/chat/Chat";
import { Navbar } from "@/components/navbar";

export default function AideAssistancePage() {

    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [lastOrderId] = useState(''); // Simuler un ID de commande
    const [openChate, setOpenChate] = useState(false);
    const handleQuestionSelect = (question: string) => {
        setSelectedQuestion(question);
        setOpenChate(true);
    };

    const assistanceItems = [
        {
            icon: <User className="w-8 h-8 text-lime-600" />,
            text: "Pour toute question, contactez notre support client disponible 24h/24 et 7j/7.",
            label: "Support client",
        },
        {
            icon: <ShoppingCart className="w-8 h-8 text-lime-600" />,
            text: "Assistance pour le suivi de vos commandes et de vos paiements.",
            label: "Assistance client",
        },
    ];


    return (
        <>
            <Navbar />

            <div className="min-h-[calc(100vh_-_56px)] py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">   Assistance </h1>
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                        {assistanceItems.map((item, index) => (
                            <div key={index} onClick={() => handleQuestionSelect(item.label)} className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-lime-600/20 cursor-pointer" >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 bg-lime-600/10 p-4 rounded-lg group-hover:bg-lime-600/20 transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-lime-600 transition-colors duration-300">
                                            {item.label}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {openChate && (
                <Chat onClose={() => setOpenChate(false)} isOpen={openChate} question={selectedQuestion} lastOrderId={lastOrderId} />
            )}
        </>
    );


}