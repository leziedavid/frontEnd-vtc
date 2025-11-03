import { StaticImageData } from "next/image";

export enum Role {
    ADMIN = "ADMIN",
    PARTENAIRE = "PARTENAIRE",
    DRIVER = "DRIVER",
    USER = "USER",
}

export enum TrajetStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}


export enum UserStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

export enum VehicleStatus {
    AVAILABLE = "AVAILABLE",
    MAINTENANCE = "MAINTENANCE",
    OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

export enum CommandeStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
}

export const VehicleStatusOptions = [
    { label: "Disponible", value: VehicleStatus.AVAILABLE },
    { label: "Maintenance", value: VehicleStatus.MAINTENANCE },
    { label: "Hors service", value: VehicleStatus.OUT_OF_SERVICE },
];


export enum PaymentMethod {
    COD = "COD",
    STRIPE = "STRIPE",
    MOBILE_MONEY = "MOBILE_MONEY",
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}


export interface PaymentMethodes {
    id: string;
    name: string;
    logo?: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    role: Role;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    partnerId?: string;
    partner?: Partner;
    driverTrajets: Trajet[];
    commandes: Commande[];
    vehicles: Vehicle[];
    messagesSent: Message[];
    messagesReceived: Message[];
    wallet?: Wallet;
    images?: (string | StaticImageData)[];

}

export interface Partner {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    fleet: Vehicle[];
}

export interface VehicleType {
    id: string;
    name: string;
    description?: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    vehicles: Vehicle[];
}

/** ✅ Interface simplifiée pour affichage dans les Select ou dropdowns */
export interface VehicleTypeKeyValue {
    key: string;   // Correspond à l’ID du type de véhicule
    value: string; // Nom du type de véhicule
}

// ✅ Interface mise à jour
export interface Vehicle {
    id: string;
    registration: string;
    typeId: string;
    type: VehicleType;
    marque: string;
    models: string;
    year: number;
    color?: string;
    mileage?: number;
    seats?: number;
    status: VehicleStatus; // 🔥 ajouté pour gérer l'état du véhicule
    partnerId?: string;
    partner?: Partner;
    driverId?: string;
    drivers?: User[]; // ✅ plusieurs conducteurs assignés;
    createdAt: Date;
    updatedAt: Date;
    trajets: Trajet[];
    images?: (string | StaticImageData)[];
}


export interface Trajet {
    id: string;
    driverId: string;
    driver: User;
    vehicleId: string;
    vehicle: Vehicle;
    // 🔹 Nouveau : si tu veux relier à un partenaire (optionnel)
    partnerId?: string;
    partner?: Partner;
    departure: string;
    departureGPS: { lat: number; lng: number };
    destination: string;
    destinationGPS: { lat: number; lng: number };
    stops?: {
        name: string;
        lat: number;
        lng: number;
        arrivalTime?: string | Date;
        estimatedDuration?: string;
    }[];
    distance?: number | null;
    totalDistance?: number | null;
    price: number;
    nbplaces: number;
    status: TrajetStatus;  // 🔹 Typé avec l’enum TrajetStatus
    departureTime: Date;
    estimatedArrival: Date;
    estimatedDuration: string;
    disposition?: string;
    createdAt: Date;
    updatedAt: Date;
    commandes: Commande[];
}

export interface Commande {
    id: string;
    userId: string;
    user: User;
    trajetId: string;
    trajet: Trajet;
    typeId: string;
    typeCommande: VehicleType; // ajouté pour refléter ton retour JSON
    price: number;
    status: CommandeStatus; // PENDING | CONFIRMED | CANCELLED | STARTED | COMPLETED
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    sender: User;
    receiverId: string;
    receiver: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface FileManager {
    id: number;
    fileCode: string;
    fileName: string;
    fileMimeType: string;
    fileSize: number;
    fileUrl: string;
    fileType: string;
    targetId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Wallet {
    id: string;
    balance: number;
    userId: string;
    paymentMethod: PaymentMethod;
    rechargeType: string;
    user: User;
}



/** -------------------- Interface pour getAssignedDrivers -------------------- */
export interface AssignedDriver {
    id: string;                // ID du driver
    name: string;
    email: string;
    phone: string;
    role: Role;
    createdAt: Date;
    image?: string | StaticImageData | null; // photo du driver
    vehicles: AssignedDriverVehicle[];       // véhicules assignés à ce driver
}

/** Véhicules associés au driver */
export interface AssignedDriverVehicle {
    id: string;
    registration: string;
    marque: string;
    models: string;
    type?: { id: string; name: string } | null;
    status: VehicleStatus;
}


