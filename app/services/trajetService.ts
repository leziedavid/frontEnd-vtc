import { getBaseUrl } from './baseUrl';
import { toast } from 'sonner';
import { BaseResponse } from './BaseResponse';
import { secureFetch } from './securityService';
import { Pagination } from './pagination';
import { PaginationParams } from './paginationParam';
import { Trajet } from '@/types/interfaces';

export interface SearchTrajetParams {
    depart: string;
    destination: string;
    departureLat?: number;
    departureLng?: number;
    destinationLat?: number;
    destinationLng?: number;
}

/** --------------------- Création trajet --------------------- */
export const createTrajet = async (dto: any): Promise<BaseResponse<Trajet>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/trajet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la création du trajet');
        throw error;
    }
}

/** --------------------- Mise à jour trajet --------------------- */
export const updateTrajet = async (id: string, dto: any): Promise<BaseResponse<Trajet>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/trajet/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour du trajet');
        throw error;
    }
}

/** --------------------- Suppression trajet --------------------- */
export const deleteTrajet = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/trajet/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression du trajet');
        throw error;
    }
}

/** --------------------- Récupération trajet par ID --------------------- */
export const getTrajetById = async (id: string): Promise<BaseResponse<Trajet>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/trajet/${id}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération du trajet');
        throw error;
    }
}

/** --------------------- Liste paginée de tous les trajets --------------------- */
export const getAllTrajets = async ( page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Trajet>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/trajet?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des trajets');
        throw error;
    }
}

/** --------------------- Trajets par driver --------------------- */
export const getTrajetsByDriver = async ( page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Trajet>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/trajet/liste/trajets/driver?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des trajets du driver');
        throw error;
    }
}

/** --------------------- Trajets par véhicule --------------------- */
export const getTrajetsByVehicle = async (vehicleId: string,  page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Trajet>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/trajet/vehicle/${vehicleId}?page=${page}&limit=${limit}`, { method: 'GET' });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des trajets du véhicule');
        throw error;
    }
}

/** --------------------- Recherche trajet --------------------- */
export const searchTrajets = async (query: SearchTrajetParams,  page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Trajet>>> => {
    try {
        const urlParams = new URLSearchParams(query as any);
        const response = await fetch(
            `${getBaseUrl()}/trajet/search/trajet?${urlParams.toString()}&page=${page}&limit=${limit}`,
            { method: 'GET' }
        );
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la recherche des trajets');
        throw error;
    }
}
