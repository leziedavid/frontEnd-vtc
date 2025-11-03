'use client';



import { updateUserStatus } from "@/app/services/userServices";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Partner, Vehicle, VehicleType, Trajet, Commande, Message, Wallet, FileManager, UserStatus, AssignedDriver } from "@/types/interfaces";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";


// ✅ Switch de statut pour utilisateur
const UserStatusSwitch: React.FC<{ user: User }> = ({ user }) => {

    const [checked, setChecked] = useState(user.status === UserStatus.ACTIVE);

    const handleToggle = async (value: boolean) => {
        setChecked(value);
        const newStatus = value ? UserStatus.ACTIVE : UserStatus.INACTIVE;
        try {
            const res = await updateUserStatus(user.id, newStatus);
            if (res.statusCode === 200) {
                toast.success("✅ Statut de l'utilisateur mis à jour avec succès");
            } else {
                toast.error("⚠️ Échec de la mise à jour du statut");
            }
        } catch (error) {
            toast.error("❌ Erreur lors de la mise à jour du statut");
            console.error(error);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch checked={checked} onCheckedChange={handleToggle} id={`user-${user.id}`} />
            <Label htmlFor={`user-${user.id}`} className="text-xs">
                {checked ? "Actif" : "Inactif"}
            </Label>
        </div>
    );
};

// ✅ Colonnes utilisateurs avec le switch de statut
export const UserColumns = (): any[] => [

    {
        key: "images",
        name: "Image",
        render: (item: User) => {
            const images = Array.isArray(item.images) ? item.images : item.images ? [item.images] : [];
            const imageSrc = images.length > 0 ? images[0] : "/avatars/avatar.jpg";
            return (
                <Image src={imageSrc} alt={item.name} width={40} height={40} className="object-cover rounded" unoptimized />
            );
        },
    },
    { key: "name", name: "Nom" },
    { key: "email", name: "Email" },
    { key: "phone", name: "Téléphone" },
    { key: "role", name: "Rôle", render: (item: User) => item.role },
    { key: "partner", name: "Partenaire", render: (item: User) => item.partner?.name ?? "-" },
    // 🆕 Colonne de gestion du statut
    { key: "status", name: "Statut", render: (item: User) => <UserStatusSwitch user={item} />, },
    { key: "createdAt", name: "Créé le", render: (item: User) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: User) => new Date(item.updatedAt).toLocaleDateString() },
];


// ✅ Colonnes utilisateurs avec le switch de statut
export const DriversColumns = (): any[] => [

    {
        key: "images",
        name: "Image",
        render: (item: User) => {
            const images = Array.isArray(item.images) ? item.images : item.images ? [item.images] : [];
            const imageSrc = images.length > 0 ? images[0] : "/avatars/avatar.jpg";
            return (
                <Image src={imageSrc} alt={item.name} width={40} height={40} className="object-cover rounded" unoptimized />
            );
        },
    },
    { key: "name", name: "Nom" },
    { key: "email", name: "Email" },
    { key: "phone", name: "Téléphone" },
    { key: "role", name: "Rôle", render: (item: User) => item.role },
    { key: "status", name: "Statut", render: (item: User) =>  item.status === "ACTIVE" ? "Disponible" : "Indisponible" },
    { key: "createdAt", name: "Créé le", render: (item: User) => new Date(item.createdAt).toLocaleDateString() },
];

// 🚗 Véhicules
export const VehicleColumns = (): any[] => [
    {
        key: "images",
        name: "Image",
        render: (item: Vehicle) => {
            const images = Array.isArray(item.images) ? item.images : item.images ? [item.images] : [];
            // ✅ Si aucune image, utiliser avatar générique
            const imageSrc = images.length > 0 ? images[0] : "/ride.png";
            return (
                <Image src={imageSrc} alt={item.registration} width={40} height={40} className="object-cover rounded" unoptimized />
            );
        },
    },
    { key: "registration", name: "Immatriculation" },
    { key: "type", name: "Type", render: (item: Vehicle) => item.type?.name ?? "-" },
    { key: "partner", name: "Partenaire", render: (item: Vehicle) => item.partner?.name ?? "-" },
    // ✅ Correction ici : afficher tous les conducteurs
    {
        key: "drivers",
        name: "Conducteur(s)",
        render: (item: Vehicle) => {
            if (!item.drivers || item.drivers.length === 0) return "-";
            return item.drivers.map((d) => d.name).join(", ");
        },
    },
    { key: "createdAt", name: "Créé le", render: (item: Vehicle) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: Vehicle) => new Date(item.updatedAt).toLocaleDateString() },
];

// 🏢 Partenaires
export const PartnerColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "name", name: "Nom" },
    { key: "users", name: "Utilisateurs", render: (item: Partner) => item.users?.length ?? 0 },
    { key: "fleet", name: "Véhicules", render: (item: Partner) => item.fleet?.length ?? 0 },
    { key: "createdAt", name: "Créé le", render: (item: Partner) => new Date(item.createdAt).toLocaleDateString() },
];

// 🚘 Trajets
export const TrajetColumns = (): any[] => [
    // { key: "id", name: "ID" },
    { key: "driver", name: "Conducteur", render: (item: Trajet) => item.driver?.name ?? "-" },
    { key: "vehicle", name: "Véhicule", render: (item: Trajet) => item.vehicle?.registration ?? "-" },
    { key: "departure", name: "Départ" },
    { key: "destination", name: "Destination" },
    { key: "departureTime", name: "Départ le", render: (item: Trajet) => new Date(item.departureTime).toLocaleString() },
    { key: "estimatedArrival", name: "Arrivée estimée", render: (item: Trajet) => new Date(item.estimatedArrival).toLocaleString() },
];

// 📦 Commandes
export const CommandeColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "user", name: "Client", render: (item: Commande) => item.user?.name ?? "-" },
    { key: "trajet", name: "Trajet", render: (item: Commande) => `${item.trajet?.departure} → ${item.trajet?.destination}` },
    { key: "price", name: "Prix", render: (item: Commande) => `${item.price.toLocaleString()} F` },
    { key: "status", name: "Statut" },
    { key: "createdAt", name: "Créé le", render: (item: Commande) => new Date(item.createdAt).toLocaleDateString() },
];

// 💬 Messages
export const MessageColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "content", name: "Message", render: (item: Message) => item.content },
    { key: "sender", name: "De", render: (item: Message) => item.sender?.name ?? "-" },
    { key: "receiver", name: "À", render: (item: Message) => item.receiver?.name ?? "-" },
    { key: "createdAt", name: "Envoyé le", render: (item: Message) => new Date(item.createdAt).toLocaleString() },
];

// 💰 Wallets
export const WalletColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "user", name: "Utilisateur", render: (item: Wallet) => item.user?.name ?? "-" },
    { key: "balance", name: "Solde", render: (item: Wallet) => `${item.balance.toLocaleString()} F` },
    { key: "paymentMethod", name: "Méthode", render: (item: Wallet) => item.paymentMethod },
];



// 🚘 Types de véhicules
export const VehicleTypeColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "name", name: "Nom" },
    { key: "description", name: "Description", render: (item: VehicleType) => item.description ?? "-" },
    { key: "price", name: "Prix", render: (item: VehicleType) => `${item.price.toLocaleString()} F` },
    { key: "createdAt", name: "Créé le", render: (item: VehicleType) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: VehicleType) => new Date(item.updatedAt).toLocaleDateString() },
];


// 🗂️ Fichiers
export const FileManagerColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "fileName", name: "Nom du fichier" },
    { key: "fileType", name: "Type" },
    {
        key: "fileUrl",
        name: "Lien",
        render: (item: FileManager) => (
            <a
                href={item.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
            >
                Voir
            </a>
        ),
    },
    {
        key: "createdAt",
        name: "Créé le",
        render: (item: FileManager) => new Date(item.createdAt).toLocaleDateString(),
    },
];


// 🧑‍✈️ Colonnes pour les drivers assignés à un véhicule
export const AssignedDriversColumns = (): any[] => [
    {
        key: "image",
        name: "Photo",
        render: (item: AssignedDriver) => {  const src = item.image ?? "/avatars/avatar.jpg"; return <Image src={src} alt={item.name} width={40} height={40} className="object-cover rounded" unoptimized />; },
    },
    { key: "name", name: "Nom" },
    { key: "email", name: "Email" },
    { key: "phone", name: "Téléphone" },
    { key: "role", name: "Rôle", render: (item: AssignedDriver) => item.role },
    {
        key: "vehicles",
        name: "Véhicules assignés",
        render: (item: AssignedDriver) => item.vehicles.length > 0  ? item.vehicles.map(v => `${v.registration} (${v.type?.name ?? "-"})`).join(", ") : "-",
    },
    { key: "createdAt", name: "Créé le", render: (item: AssignedDriver) => new Date(item.createdAt).toLocaleDateString() },
];
