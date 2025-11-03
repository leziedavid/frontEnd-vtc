
import { secureFetch } from './securityService';
import { Message } from '@/types/MessagesResponse'
import { getBaseUrl } from './baseUrl'
import { BaseResponse } from './BaseResponse'
import { Pagination } from './pagination'

// Messages API
// Créer un message (texte et/ou image)
export const createMessage = async (payload: FormData): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages`, {
            method: 'POST',
            body: payload,
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la création du message :", error);
        throw error;
    }
};

// Mettre à jour un message
export const updateMessage = async (id: string, payload: FormData): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/${id}`, {
            method: 'PATCH',
            body: payload,
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du message :", error);
        throw error;
    }
};


// Supprimer un message
export const deleteMessage = async (id: string): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du message :", error);
        throw error;
    }
};

// Récupère tous les messages liés à une commande (lastOrderId)
export const getMessagesByOrderId = async (lastOrderId: string): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/order/${lastOrderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        throw error;
    }
};

// Récupère les messages liés à une commande avec pagination
export const getMessagesByOrderIdPaginated = async (lastOrderId: string, page: number, limit: number): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/order/${lastOrderId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        throw error;
    }
};

// Récupère les messages envoyés par un utilisateur avec pagination (userId)
export const getMessagesByUserIdPaginated = async (page: number, limit: number): Promise<BaseResponse<Pagination<Message>>> => {
    try {

        const response = await secureFetch(`${getBaseUrl()}/messages/user/messages?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        throw error;
    }
};

export const getMessagesBySenderIdPaginated = async (senderId: string, page: number, limit: number): Promise<BaseResponse<Pagination<Message>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/user/messages/senderId/${senderId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        throw error;
    }
};

/** Récupère tous les messages avec pagination */
export const getAllMessagesPaginated = async (page: number, limit: number): Promise<BaseResponse<Pagination<Message>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/user/messages/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        throw error;
    }
};

