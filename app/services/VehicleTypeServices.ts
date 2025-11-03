import { getBaseUrl } from './baseUrl';
import { toast } from 'sonner';
import { BaseResponse } from './BaseResponse';
import { secureFetch } from './securityService';
import { Pagination } from './pagination';
import { PaginationParams } from './paginationParam';
import { VehicleType, VehicleTypeKeyValue } from '@/types/interfaces';

/** --------------------- Création d’un type de véhicule --------------------- */
export const createVehicleType = async ( dto: Partial<VehicleType>): Promise<BaseResponse<VehicleType>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle-type`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la création du type de véhicule');
        throw error;
    }
};

/** --------------------- Mise à jour d’un type de véhicule --------------------- */
export const updateVehicleType = async (
    id: string,
    dto: Partial<VehicleType>
): Promise<BaseResponse<VehicleType>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle-type/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour du type de véhicule');
        throw error;
    }
};

/** --------------------- Suppression d’un type de véhicule --------------------- */
export const deleteVehicleType = async (
    id: string
): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle-type/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression du type de véhicule');
        throw error;
    }
};

/** --------------------- Récupération d’un type de véhicule par ID --------------------- */
export const getVehicleTypeById = async (
    id: string
): Promise<BaseResponse<VehicleType>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle-type/${id}`, {
            method: 'GET',
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération du type de véhicule');
        throw error;
    }
};

/** --------------------- Liste paginée des types de véhicules --------------------- */
export const getAllVehicleTypes = async ( params: PaginationParams = { page: 1, limit: 10 }): Promise<BaseResponse<Pagination<VehicleType>>> => {
    try {
        const response = await secureFetch(
            `${getBaseUrl()}/vehicle-type?page=${params.page}&limit=${params.limit}`,
            { method: 'GET' }
        );
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des types de véhicules');
        throw error;
    }
};

/** --------------------- Liste complète (non paginée) --------------------- */
export const getAllVehicleTypesList = async (): Promise<BaseResponse<VehicleType[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle-type/all/list`, {
            method: 'GET',
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération de la liste complète');
        throw error;
    }
};

/** --------------------- Liste key/value pour le front --------------------- */
export const getAllVehicleTypesForFront = async (): Promise<BaseResponse<VehicleTypeKeyValue[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/vehicle-type/front/all`, {
            method: 'GET',
        });
        return await response.json();
    } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la récupération des types pour le front');
        throw error;
    }
};
