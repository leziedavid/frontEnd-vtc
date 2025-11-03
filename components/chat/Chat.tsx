'use client';

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, X, CornerUpLeft, Edit2, Trash2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { MessageSkeleton } from "./MessageSkeleton";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Message } from "@/types/MessagesResponse";
import { createMessage, deleteMessage, getMessagesByUserIdPaginated, updateMessage } from "@/app/services/ChatServices";

interface ChatProps {
    onClose: () => void;
    isOpen: boolean;
    question: string;
    lastOrderId?: string;
}

export default function Chat({ onClose, isOpen, question, lastOrderId }: ChatProps) {

    const isMobile = useIsMobile();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const sortMessagesChronologically = (msgs: Message[]) =>
        [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const getAllMessagesByUser = async (page: number) => {
        setLoading(true);
        try {
            const res = await getMessagesByUserIdPaginated(page, limit);
            if (res.data) {
                const userMessages = res.data.data;
                const defaultSupportMessage: Message = {
                    id: `welcome-${Date.now()}`,
                    text: `Bonjour! Je vous aide concernant: ${question}`,
                    label: "support",
                    sender: "support",
                    senderId: "",
                    timestamp: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    repliedTo: null,
                    repliedToId: null,
                    lastOrderId: null,
                    imageUrl: null,
                    senderUser: { id: "", name: "support", email: "support@system.com" },
                };
                setMessages(userMessages.length > 0 ? sortMessagesChronologically(userMessages) : [defaultSupportMessage]);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des messages :", err);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const fetchMessages = async () => {
            await getAllMessagesByUser(currentPage);
        };
        fetchMessages();
    }, [currentPage, isOpen]);

    const handleFileSelect = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
    };

    const sendToAPI = async (
        text: string,
        orderId?: string,
        repliedToId?: string,
        file?: File,
        messageId?: string
    ) => {
        const formData = new FormData();
        formData.append("text", text);
        if (orderId) formData.append("lastOrderId", orderId);
        if (repliedToId) formData.append("repliedToId", repliedToId);
        if (question) formData.append("label", question);
        formData.append("sender", "user");
        if (file) formData.append("file", file);

        try {
            if (messageId) {
                await updateMessage(messageId, formData);
            } else {
                await createMessage(formData);
            }
            await getAllMessagesByUser(currentPage);
            setInputMessage("");
            setReplyingTo(null);
            setSelectedFile(null);
            setCurrentMessageId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() && !selectedFile) return;
        sendToAPI(inputMessage.trim(), lastOrderId, replyingTo?.id, selectedFile ?? undefined, currentMessageId ?? undefined);
    };

    const handleDeleteMessage = async (id: string) => {
        const res = await deleteMessage(id);
        if (res.statusCode === 200) getAllMessagesByUser(currentPage);
    };

    const handleReply = (message: Message) => setReplyingTo(message);

    const formatTime = (timestamp: string | Date) =>
        new Date(timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[90%]" : "w-[400px] max-h-screen"}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-medium">{question}</h2>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <MessageSkeleton key={i} />)
                        ) : (
                            messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === "user" ? "bg-green-10 text-black" : "bg-white text-gray-800 border"}`}>
                                        {message.repliedTo && (
                                            <div className="text-xs p-2 rounded mb-2 border-l-2 border-gray-300 bg-gray-100">
                                                <p className="font-medium opacity-75">{message.repliedTo.sender === "user" ? "Vous" : "support"}</p>
                                                <p className="text-xs opacity-75 truncate max-w-[200px]">{message.repliedTo.text || "Fichier"}</p>
                                            </div>
                                        )}
                                        {message.label && <div className="text-sm font-bold text-lime-600">{message.label}</div>}
                                        {message.text && <p className="text-sm whitespace-pre-line">{message.text}</p>}
                                        {message.imageUrl && (
                                            <div className="mt-2 relative w-full h-40">
                                                <Image src={message.imageUrl} alt="Pièce jointe" fill className="object-cover rounded-md" unoptimized />
                                            </div>
                                        )}
                                        <div className="flex justify-between mt-1 items-center text-xs text-gray-500 gap-2">
                                            <span>{formatTime(message.timestamp)}</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleReply(message)}><CornerUpLeft className="w-4 h-4" /></button>
                                                <button onClick={() => {
                                                    setInputMessage(message.text ?? '');
                                                    setCurrentMessageId(message.id);
                                                    setReplyingTo(null);
                                                    setSelectedFile(null);
                                                }}><Edit2 className="w-4 h-4 text-blue-500" /></button>
                                                <button onClick={() => handleDeleteMessage(message.id)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* Reply banner */}
                    {replyingTo && (
                        <div className="flex items-center justify-between bg-gray-100 border-t px-4 py-2">
                            <div className="flex-1">
                                <p className="text-xs text-gray-600">Réponse à {replyingTo.sender === "user" ? "Vous" : "support"}</p>
                                <p className="text-sm text-gray-800 truncate">{replyingTo.text || "Fichier"}</p>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="flex items-end gap-2 border-t p-4 bg-white">
                        <button onClick={handleFileSelect} className="p-2 text-gray-500 hover:text-gray-700"><Paperclip className="w-5 h-5" /></button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <Textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder="Tapez votre message..."
                            className="flex-1 resize-none rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={1}
                        />
                        <button onClick={handleSendMessage} disabled={!inputMessage.trim() && !selectedFile} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>

                    {selectedFile && (
                        <div className="relative p-4 bg-gray-50 flex items-center gap-2 h-20">
                            <Image src={URL.createObjectURL(selectedFile)} alt="preview" width={80} height={80} className="object-cover rounded-md" unoptimized />
                            <button onClick={() => setSelectedFile(null)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"><X className="w-4 h-4" /></button>
                        </div>
                    )}

                </div>
            </SheetContent>
        </Sheet>
    );
}
