
import { getBaseUrl } from './baseUrl'


import { toast } from 'sonner'
import { BaseResponse } from './BaseResponse';
import { useAuthMiddleware } from '../middleware';
import { RefreshTokenResponse, UserAuth } from '@/types/Auth';
import { User } from '@/types/interfaces';


export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // ✅ Vérifie que la session est toujours valide (déconnexion gérée dedans)
    await useAuthMiddleware();
    // ✅ Récupère le token valide
    const token = localStorage.getItem('access_token') || '';
    // ✅ Ajoute automatiquement le header Authorization
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    return fetch(url, { ...options, headers });
};

// Connexion : accepte email OU phoneNumber
export const loginByPhoneCode = async (loginData: any): Promise<BaseResponse<UserAuth>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/login/by/code/or/phone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        })

        return await response.json()
    } catch (error) {
        toast.error("Erreur réseau ou serveur.");
        throw error
    }
}

export const refreshAccessToken = async (refreshToken: string): Promise<BaseResponse<RefreshTokenResponse>> => {

    try {

        const response = await fetch(`${getBaseUrl()}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        })

        return await response.json()

    } catch (error) {

        throw error
    }
}

// Inscription
export const signUp = async (registerData: FormData): Promise<BaseResponse<any>> => {
    try {

        const response = await fetch(`${getBaseUrl()}/auth/register`, {
            method: 'POST',
            body: registerData,
        })

        return await response.json()

    } catch (error) {
        toast.error("Erreur réseau ou serveur.");
        throw error
    }
}

export const updateUser = async (id: string, formData: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/update/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json()
    } catch (error) {
        toast.error("Erreur réseau ou serveur.");
        throw error
    }
}

// auth/userdata
export const getUserInfos = async (): Promise<BaseResponse<User>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/userdata`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
            },
        })

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        toast.error("Erreur réseau ou serveur.");
        throw error
    }
}

// @Patch('users/files/update')
export const updateFiles = async (formData: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/users/files/update`, {
            method: 'PATCH',
            body: formData,
        });

        return await response.json()
    } catch (error) {
        toast.error("Erreur réseau ou serveur.");
        throw error
    }
}

export const updateUserStatus = async (UserId: string, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'): Promise<BaseResponse<User>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/user/${UserId}/status/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        throw error;
    }
};

// updateProfile
export const updateProfile = async (data: any): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/users/profile/update/data`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // ✅ transforme bien l'objet en JSON
        });

        return await response.json()
    } catch (error) {
        toast.error("Erreur réseau ou serveur.");
        throw error
    }
}
// validateCompte
export const validateCompte = async (userId: string, status: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/validate/${userId}/${status}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await response.json()
    } catch (error) {
        toast.error("Erreur réseau ou serveur.");
        throw error
    }
}

// 🗑️ Suppression d'un utilisateur (avec CASCADE automatique)
export const deleteUser = async (userId: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (result.success) {
            toast.success("Utilisateur supprimé avec succès");
        }

        return result;

    } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression de l'utilisateur");
        throw error;
    }
}

// 🗑️ Suppression de son propre compte
export const deleteMyAccount = async (): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/delete/my/account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            toast.success("Votre compte a été supprimé avec succès");
            // Nettoyer le localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Rediriger vers la page de connexion si nécessaire
        }

        return result;

    } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression du compte");
        throw error;
    }
}

// 🗑️ Suppression multiple d'utilisateurs (par un admin)
export const deleteMultipleUsers = async (userIds: string[]): Promise<BaseResponse<any>> => {
    try {
        if (!userIds || userIds.length === 0) {
            throw new Error("Aucun utilisateur sélectionné");
        }

        const response = await fetch(`${getBaseUrl()}/auth/delete/multiple`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify({ userIds }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            toast.success(`${userIds.length} utilisateur(s) supprimé(s) avec succès`);
        }

        return result;

    } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression multiple");
        throw error;
    }
}
// Mot de passe oublié - Envoi du code
export const sendForgotPasswordCode = async (email: string): Promise<BaseResponse<{ code?: string }>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/forgot-password/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Erreur ${response.status}`);
        }

        toast.success("Code de réinitialisation envoyé");
        return result;
    } catch (error: any) {
        toast.error(error.message || "Erreur lors de l'envoi du code");
        throw error;
    }
};

// Mot de passe oublié - Vérification du code
export const verifyCode = async (email: string, code: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/forgot-password/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Erreur ${response.status}`);
        }

        toast.success("Code vérifié avec succès");
        return result;
    } catch (error: any) {
        toast.error(error.message || "Erreur lors de la vérification du code");
        throw error;
    }
};

// Mot de passe oublié - Réinitialisation
export const resetPassword = async (email: string, password: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/forgot-password/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Erreur ${response.status}`);
        }

        toast.success("Mot de passe réinitialisé avec succès");
        return result;
    } catch (error: any) {
        toast.error(error.message || "Erreur lors de la réinitialisation du mot de passe");
        throw error;
    }
};
