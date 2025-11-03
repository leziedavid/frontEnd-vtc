import { getBaseUrl } from './baseUrl';
import { toast } from 'sonner';
import { BaseResponse } from './BaseResponse';
import { User, Commande, Wallet } from '@/types/interfaces';
import { useAuthMiddleware } from '../middleware';
import { PaginationParams } from './paginationParam';
import { Pagination } from './pagination';
import { UserAuth } from '@/types/Auth';

/** --------------------- Fetch sécurisé --------------------- */
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    await useAuthMiddleware();
    const token = localStorage.getItem('access_token') || '';
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };
    return fetch(url, { ...options, headers });
};

/** --------------------- 🛒 Commandes de l'utilisateur --------------------- */
export const getUserOrders = async ( page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Commande>>> => {
    try {
        const response = await secureFetch(
            `${getBaseUrl()}/security/listes/orders/user?page=${page}&limit=${limit}`
        );
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des commandes');
        throw error;
    }
}

/** --------------------- 🏬 Commandes d’un partenaire ou chauffeur --------------------- */
export const getOrdersByPartnerOrDriver = async ( role: 'PARTENAIRE' | 'DRIVER', page: number = 1, limit: number = 10
): Promise<BaseResponse<Pagination<Commande>>> => {
    try {
        const response = await secureFetch(
            `${getBaseUrl()}/security/orders/${role.toLowerCase()}?page=${page}&limit=${limit}`
        );
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || `Erreur lors de la récupération des commandes du ${role.toLowerCase()}`);
        throw error;
    }
}

/** --------------------- 🔑 Connexion via phone/email --------------------- */
export const loginByPhoneCode = async (loginData: { login: string; password: string }): Promise<BaseResponse<UserAuth>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/security/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });
        return await response.json();
    } catch (error) {
        toast.error('Erreur réseau ou serveur.');
        throw error;
    }
}

/** --------------------- 🔁 Rafraîchir token --------------------- */
export const refreshAccessToken = async (refreshToken: string): Promise<BaseResponse<{ access_token: string }>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/security/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/** --------------------- 👤 Infos utilisateur --------------------- */
export const getUserInfos = async (): Promise<BaseResponse<User>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/security/userdata`);
        return await response.json();
    } catch (error) {
        toast.error('Erreur lors de la récupération des infos utilisateur');
        throw error;
    }
}

/** --------------------- 💰 Recharger le wallet --------------------- */
export const rechargeWallet = async (dto: any): Promise<BaseResponse<null>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/wallet/recharge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur réseau ou serveur');
        throw error;
    }
}


/** --------------------- 💸 Solde du wallet --------------------- */
export const getWalletBalance = async (): Promise<BaseResponse<Wallet>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/wallet/me`);
        return await response.json();
    } catch (error: any) {
        toast.error('Erreur lors de la récupération du solde du wallet');
        throw error;
    }
}

/** --------------------- 🧾 Historique des transactions --------------------- */
export const getWalletTransactions = async (  page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<any>>> => {
    try {
        const response = await secureFetch( `${getBaseUrl()}/wallet/all/transactions?page=${page}&limit=${limit}` );
        return await response.json();
    } catch (error: any) {
        toast.error('Erreur lors de la récupération des transactions');
        throw error;
    }
}