import { getBaseUrl } from './baseUrl';
import { toast } from 'sonner';
import { BaseResponse } from './BaseResponse';
import { secureFetch } from './securityService';
import { Pagination } from './pagination';
import { Commande, CommandeStatus } from '@/types/interfaces';

/** --------------------- Créer une commande --------------------- */
export const createCommande = async (dto: any): Promise<BaseResponse<Commande>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/commande`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        const data = await response.json();
        if (data.statusCode === 201) toast.success('Commande créée avec succès');
        else toast.error(data.message || 'Erreur lors de la création de la commande');
        return data;
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la création de la commande');
        throw error;
    }
};

/** --------------------- Liste paginée des commandes --------------------- */
export const getAllCommandes = async (page: number = 1,limit: number = 10,): Promise<BaseResponse<Pagination<Commande>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/commande?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des commandes');
        throw error;
    }
};

/** --------------------- Valider une commande --------------------- */
export const validateCommande = async (commandeId: string,status: CommandeStatus): Promise<BaseResponse<Commande>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/commande/${commandeId}/validate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.statusCode === 200) toast.success('Commande validée avec succès');
        else toast.error(data.message || 'Erreur lors de la validation');
        return data;
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la validation de la commande');
        throw error;
    }
};

/** --------------------- Annuler une commande --------------------- */
export const cancelCommande = async ( commandeId: string, role: 'USER' | 'DRIVER',): Promise<BaseResponse<Commande>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/commande/${commandeId}/cancel`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
        });
        const data = await response.json();
        if (data.statusCode === 200) toast.success('Commande annulée avec succès');
        else toast.error(data.message || 'Erreur lors de l’annulation');
        return data;
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de l’annulation de la commande');
        throw error;
    }
};

/** --------------------- Démarrer une commande --------------------- */
export const startCommande = async (commandeId: string): Promise<BaseResponse<Commande>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/commande/${commandeId}/start`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.statusCode === 200) toast.success('Commande démarrée');
        else toast.error(data.message || 'Erreur lors du démarrage');
        return data;
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors du démarrage de la commande');
        throw error;
    }
};

/** --------------------- Terminer une commande --------------------- */
export const completeCommande = async (commandeId: string): Promise<BaseResponse<Commande>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/commande/${commandeId}/complete`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.statusCode === 200) toast.success('Commande terminée avec succès');
        else toast.error(data.message || 'Erreur lors de la finalisation');
        return data;
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la finalisation de la commande');
        throw error;
    }
};

/** --------------------- Liste des statuts disponibles --------------------- */
export const getCommandeStatusList = async (): Promise<BaseResponse<CommandeStatus[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/commande/status/list`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des statuts de commande');
        throw error;
    }
};
