import { getBaseUrl } from './baseUrl';
import { toast } from 'sonner';
import { BaseResponse } from './BaseResponse';
import { User } from '@/types/interfaces';
import { secureFetch } from './securityService';
import { PaginationParams } from './paginationParam';
import { Pagination } from './pagination';

/** --------------------- Création utilisateur --------------------- */
export const createUser = async (formData: FormData): Promise<BaseResponse<User>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/user`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la création de l’utilisateur');
        throw error;
    }
}

/** --------------------- Mise à jour utilisateur --------------------- */
export const updateUser = async (id: string, formData: FormData): Promise<BaseResponse<User>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour de l’utilisateur');
        throw error;
    }
}

/** --------------------- Suppression utilisateur --------------------- */
export const deleteUser = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression de l’utilisateur');
        throw error;
    }
}

/** --------------------- Mise à jour du statut utilisateur --------------------- */
export const updateUserStatus = async (id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
): Promise<BaseResponse<User>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/${id}/status/update`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour du statut');
        throw error;
    }
}

/** --------------------- Récupération utilisateur par ID --------------------- */
export const getUserById = async (): Promise<BaseResponse<User>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/me`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération de l’utilisateur');
        throw error;
    }
}

/** --------------------- Liste complète --------------------- */
export const getAllUsers = async (): Promise<BaseResponse<User[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/liste/all`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des utilisateurs');
        throw error;
    }
}

/** --------------------- Liste paginée --------------------- */
export const getPaginatedUsers = async ( page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<User>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des utilisateurs paginés');
        throw error;
    }
}


/** --------------------- Récupération des drivers pour le partenaire connecté --------------------- */
export const getDriversForMyPartners = async (): Promise<BaseResponse<User[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/drivers/my-partners`, {
            method: 'GET',
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des drivers du partenaire');
        throw error;
    }
}

/** --------------------- Liste paginée des drivers --------------------- */
export const fetchAllDriversForPartnersPaginate = async ( page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<User>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/drivers/my-partners/pagine?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();

        
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des drivers');
        throw error;
    }
}
/** --------------------- Récupération des images d’un utilisateur --------------------- */
export const getUserImages = async (id: string): Promise<BaseResponse<string[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/${id}/images`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des images');
        throw error;
    }
}

// updatePassword

export const updatePassword = async (id: string, password: string): Promise<BaseResponse<User>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/${id}/password`, {
            method: 'PUT',
            body: JSON.stringify({ password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour du mot de passe');
        throw error;
    }
}

// uploadUserImage

export const uploadUserImage = async (id: string, file: File | string): Promise<BaseResponse<User>> => {
    try {
        const formData = new FormData();
        formData.append('images', file);

        const response = await secureFetch(`${getBaseUrl()}/user/${id}/images`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de l’upload de l’image');
        throw error;
    }
}
