import { getBaseUrl } from './baseUrl';
import { toast } from 'sonner';
import { BaseResponse } from './BaseResponse';
import { secureFetch } from './securityService';
import { Pagination } from './pagination';
import { AssignedDriver, Vehicle } from '@/types/interfaces';

// 🔹 Interface corrigée
export interface AssignDriverData {
    driverId: string | string[];
    action: 'assign' | 'remove'; // minuscule pour matcher le backend
}

/** --------------------- Création véhicule --------------------- */
export const createVehicle = async (formData: FormData): Promise<BaseResponse<Vehicle>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la création du véhicule');
        throw error;
    }
}

/** --------------------- Mise à jour véhicule --------------------- */
export const updateVehicle = async (id: string, formData: FormData): Promise<BaseResponse<Vehicle>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour du véhicule');
        throw error;
    }
}

/** --------------------- Suppression véhicule --------------------- */
export const deleteVehicle = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression du véhicule');
        throw error;
    }
}

/** --------------------- Récupération véhicule par ID --------------------- */
export const getVehicleById = async (id: string): Promise<BaseResponse<Vehicle>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle/${id}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération du véhicule');
        throw error;
    }
}

/** --------------------- Liste paginée des véhicules --------------------- */
export const getAllVehicles = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Vehicle>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des véhicules');
        throw error;
    }
}

/** --------------------- Véhicules de l’utilisateur connecté avec pagination --------------------- */
export const getVehiclesByOwner = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Vehicle>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle/owner/drivers?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des véhicules de l’utilisateur');
        throw error;
    }
}

export const getVehiclesByOwner2= async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Vehicle>>> => {
    try {
        // ⚡ plus besoin de page/limit
        const response = await secureFetch(`${getBaseUrl()}/vehicle/owner/drivers`, { method: 'GET' });
        return await response.json(); // attend maintenant { data: Vehicle[] }
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des véhicules de l’utilisateur');
        throw error;
    }
}


/** --------------------- Affecter ou retirer un driver --------------------- */
export const assignDriver = async (vehicleId: string, data: AssignDriverData): Promise<BaseResponse<Vehicle>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle/${vehicleId}/driver`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de l’affectation du driver');
        throw error;
    }
}

/** --------------------- Liste paginée des drivers assignés à un véhicule --------------------- */
export const getAssignedDrivers = async (vehicleId: string, page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<AssignedDriver>>> => {
    try {
        const query = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
        const response = await secureFetch(`${getBaseUrl()}/vehicle/${vehicleId}/drivers?${query}`, {
            method: 'GET',
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des drivers assignés');
        throw error;
    }
};
