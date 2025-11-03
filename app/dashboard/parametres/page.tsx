"use client";

import { useState, useEffect, useRef } from 'react';
import { User, Vehicle, VehicleStatus, Role, UserStatus } from '@/types/interfaces';
import { Save, User as UserIcon, Phone, Mail, Car, Edit, X, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import rideImage from '@/public/ride.png';
import { getUserById, updateUser, updatePassword, uploadUserImage } from '@/app/services/userServices';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const ParametresPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Charger les données utilisateur
    const loadUserData = async () => {
        try {
            setLoading(true);
            const response = await getUserById();
            if (response && response.data) {
                const userData = response.data;
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                });

                // Extraire les véhicules de la réponse
                if (userData.vehicles) {
                    setVehicles(userData.vehicles);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    // Gérer les changements du formulaire principal
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Gérer les changements du formulaire mot de passe
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Sauvegarder les modifications des informations personnelles
    const handleSave = async () => {
        if (!user) return;

        try {
            setSaving(true);
            // Créer FormData pour l'envoi
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);

            const response = await updateUser(user.id, formDataToSend);
            if (response && response.data) {
                setUser(response.data);
                setIsEditing(false);
                // Optionnel: Afficher un toast de succès
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        } finally {
            setSaving(false);
        }
    };

    // Sauvegarder le nouveau mot de passe
    const handleSavePassword = async () => {
        if (!user) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        try {
            setSaving(true);
            const response = await updatePassword(user.id, passwordData.newPassword);
            if (response && response.data) {
                setIsEditingPassword(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                alert("Mot de passe modifié avec succès");
            }
        } catch (error) {
            console.error('Erreur lors de la modification du mot de passe:', error);
            alert("Erreur lors de la modification du mot de passe");
        } finally {
            setSaving(false);
        }
    };

    // Gérer l'upload de photo
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        // Validation du type de fichier
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image valide');
            return;
        }

        // Validation de la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('L\'image ne doit pas dépasser 5MB');
            return;
        }

        try {
            setUploadingImage(true);
            const response = await uploadUserImage(user.id, file);
            if (response && response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Erreur lors de l\'upload de l\'image:', error);
            alert('Erreur lors de l\'upload de l\'image');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Déclencher l'input file
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Annuler l'édition
    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
        setIsEditing(false);
    };

    // Annuler la modification du mot de passe
    const handleCancelPassword = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setIsEditingPassword(false);
    };

    // Obtenir le statut du véhicule en français avec couleur
    const getVehicleStatusInfo = (status: VehicleStatus) => {
        const statusMap = {
            [VehicleStatus.AVAILABLE]: { label: 'Disponible', color: 'bg-green-100 text-green-800' },
            [VehicleStatus.MAINTENANCE]: { label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
            [VehicleStatus.OUT_OF_SERVICE]: { label: 'Hors service', color: 'bg-red-100 text-red-800' },
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    // Obtenir la première image de l'utilisateur
    const getUserImage = () => {
        if (user?.images && user.images.length > 0) {
            return user.images[0];
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Erreur lors du chargement des données utilisateur</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* En-tête */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Paramètres du compte</h1>
                        <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos véhicules</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne de gauche - Informations personnelles */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Carte Photo de profil */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {getUserImage() ? (
                                                    <Image
                                                        src={getUserImage() as string}
                                                        alt="Photo de profil"
                                                        width={96}
                                                        height={96}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="w-12 h-12 text-gray-400" />
                                                )}
                                            </div>
                                            <button
                                                onClick={triggerFileInput}
                                                disabled={uploadingImage}
                                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                            >
                                                {uploadingImage ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                                ) : (
                                                    <Camera className="w-4 h-4" />
                                                )}
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                                            <p className="text-gray-600">{user.email}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Cliquez sur l'icône pour changer votre photo
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Carte Informations personnelles */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <UserIcon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Informations personnelles
                                            </h2>
                                        </div>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Modifier</span>
                                            </button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Annuler</span>
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Champ Nom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom complet
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Votre nom complet"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{user.name}</p>
                                        )}
                                    </div>

                                    {/* Champ Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4" />
                                                <span>Adresse email</span>
                                            </div>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Votre adresse email"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{user.email}</p>
                                        )}
                                    </div>

                                    {/* Champ Téléphone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4" />
                                                <span>Numéro de téléphone</span>
                                            </div>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Votre numéro de téléphone"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{user.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Carte Mot de passe */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <Lock className="w-5 h-5 text-red-600" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Mot de passe
                                            </h2>
                                        </div>
                                        {!isEditingPassword ? (
                                            <button
                                                onClick={() => setIsEditingPassword(true)}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Modifier</span>
                                            </button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleCancelPassword}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Annuler</span>
                                                </button>
                                                <button
                                                    onClick={handleSavePassword}
                                                    disabled={saving}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {isEditingPassword ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Mot de passe actuel
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                        placeholder="Votre mot de passe actuel"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nouveau mot de passe
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                        placeholder="Votre nouveau mot de passe"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirmer le mot de passe
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                        placeholder="Confirmez votre nouveau mot de passe"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-600">
                                            Votre mot de passe n'a pas été modifié récemment.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Colonne de droite - Véhicules et Informations compte */}
                        <div className="space-y-6">
                            {/* Carte Mes véhicules */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Car className="w-5 h-5 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Mes véhicules
                                        </h2>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {vehicles.length} véhicule(s) assigné(s)
                                    </p>
                                </div>

                                <div className="p-6">
                                    {vehicles.length > 0 ? (
                                        <div className="space-y-4">
                                            {vehicles.map((vehicle) => {
                                                const statusInfo = getVehicleStatusInfo(vehicle.status);
                                                return (
                                                    <div
                                                        key={vehicle.id}
                                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <Image
                                                                    src={rideImage}
                                                                    alt="Véhicule"
                                                                    width={32}
                                                                    height={32}
                                                                    className="opacity-70"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                                        {vehicle.marque} {vehicle.models}
                                                                    </h3>
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                                        {statusInfo.label}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                    <p className="flex items-center space-x-1">
                                                                        <span className="font-medium">Immatriculation:</span>
                                                                        <span>{vehicle.registration}</span>
                                                                    </p>
                                                                    <p className="flex items-center space-x-1">
                                                                        <span className="font-medium">Année:</span>
                                                                        <span>{vehicle.year}</span>
                                                                    </p>
                                                                    {vehicle.color && (
                                                                        <p className="flex items-center space-x-1">
                                                                            <span className="font-medium">Couleur:</span>
                                                                            <span>{vehicle.color}</span>
                                                                        </p>
                                                                    )}
                                                                    {vehicle.seats && (
                                                                        <p className="flex items-center space-x-1">
                                                                            <span className="font-medium">Places:</span>
                                                                            <span>{vehicle.seats}</span>
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Car className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 mb-2">Aucun véhicule assigné</p>
                                            <p className="text-sm text-gray-400">
                                                Contactez votre administrateur pour vous assigner un véhicule
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Carte Informations compte */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Informations du compte
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Rôle</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' :
                                                user.role === Role.PARTENAIRE ? 'bg-blue-100 text-blue-800' :
                                                    user.role === Role.DRIVER ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Statut</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                                                user.status === UserStatus.INACTIVE ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Membre depuis</span>
                                            <span className="text-gray-900">
                                                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dernière mise à jour</span>
                                            <span className="text-gray-900">
                                                {new Date(user.updatedAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">ID utilisateur</span>
                                            <span className="text-gray-900 font-mono text-xs">
                                                {user.id.slice(0, 8)}...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default ParametresPage;