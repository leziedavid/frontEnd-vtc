import { getBaseUrl } from './baseUrl';
import { toast } from 'sonner';
import { BaseResponse } from './BaseResponse';
import { secureFetch } from './securityService';
import { Pagination } from './pagination';
import { PaginationParams } from './paginationParam';
import { PaymentMethodes } from '@/types/interfaces';

/** --------------------- Création d'une méthode de paiement --------------------- */
export const createPaymentMethodes = async (formData: FormData): Promise<BaseResponse<PaymentMethodes>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la création de la méthode de paiement');
        throw error;
    }
}

/** --------------------- Mise à jour d'une méthode de paiement --------------------- */
export const updatePaymentMethodes = async (id: string, formData: FormData): Promise<BaseResponse<PaymentMethodes>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour de la méthode de paiement');
        throw error;
    }
}

/** --------------------- Suppression d'une méthode de paiement --------------------- */
export const deletePaymentMethodes = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression de la méthode de paiement');
        throw error;
    }
}

/** --------------------- Récupération d'une méthode par ID --------------------- */
export const getPaymentMethodesById = async (id: string): Promise<BaseResponse<PaymentMethodes>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode/${id}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération de la méthode de paiement');
        throw error;
    }
}

/** --------------------- Liste paginée des méthodes de paiement --------------------- */
export const getAllPaymentMethodes = async (params: PaginationParams = { page: 1, limit: 10 }): Promise<BaseResponse<Pagination<PaymentMethodes>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode?page=${params.page}&limit=${params.limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des méthodes de paiement');
        throw error;
    }
}

/** --------------------- Liste des méthodes de paiement pour la page d'accueil (sans pagination) --------------------- */
export const getAllPaymentMethodesHome = async (): Promise<BaseResponse<PaymentMethodes[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode/home`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des méthodes de paiement pour l’accueil');
        throw error;
    }
}
