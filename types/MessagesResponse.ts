export interface MessagesResponse {
    statusCode: number;
    message: string;
    data: {
        status: boolean;
        total: number;
        page: number;
        limit: number;
        data: Message[];
    };
}

export interface Message {
    id: string;
    text: string | null;
    label: string | null;
    imageUrl: string | null;
    timestamp: string; // ISO date string
    sender: string; // ex: "user"
    senderId: string; // UUID
    repliedToId: number | null;
    lastOrderId: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    repliedTo: Message | null;
    senderUser: SenderUser;
}

export interface SenderUser {
    id: string; // UUID
    name: string;
    email: string;
}
