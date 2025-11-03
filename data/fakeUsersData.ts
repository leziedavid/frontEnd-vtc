import {
    User,
    Role,
    Vehicle,
    VehicleStatus,
    VehicleType,
    Partner,
    Trajet,
    Commande,
    Message,
    Wallet,
    PaymentMethod,
    UserStatus,
} from "@/types/interfaces";

// 🚗 Types de véhicules factices
export const fakeVehicleTypes: VehicleType[] = [
    {
        id: "economy",
        name: "Économique",
        description: "Trajets abordables du quotidien",
        price: 1000, // 💰 on peut choisir le prix minimum de la plage (ou moyen)
        createdAt: new Date(),
        updatedAt: new Date(),
        vehicles: [],
    },
    {
        id: "standard",
        name: "Standard",
        description: "Trajets confortables, plus d'espace",
        price: 2000, // 💰 moyenne entre 1800 et 2200
        createdAt: new Date(),
        updatedAt: new Date(),
        vehicles: [],
    },
    {
        id: "premium",
        name: "Premium",
        description: "Voitures haut de gamme",
        price: 2800, // 💰 moyenne entre 2500 et 3000
        createdAt: new Date(),
        updatedAt: new Date(),
        vehicles: [],
    },
]

// 🧩 Partenaires
export const fakePartners: Partner[] = [
    {
        id: "p-1",
        name: "Transco Express",
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        fleet: [],
    },
    {
        id: "p-2",
        name: "AgroTransport",
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        fleet: [],
    },
];

// 🪙 Wallets
export const fakeWallets: Wallet[] = [
    {
        id: "w-1",
        balance: 150_000,
        userId: "u-1",
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        rechargeType: "Orange Money",
        user: {} as User, // sera assigné plus bas
    },
    {
        id: "w-2",
        balance: 85_000,
        userId: "u-2",
        paymentMethod: PaymentMethod.COD,
        rechargeType: "Paiement à la livraison",
        user: {} as User,
    },
];

// 👥 Utilisateurs
export const fakeUsers: User[] = [
    {
        id: "u-1",
        name: "Alice Martin",
        email: "alice.martin@example.com",
        password: "********",
        phone: "+2250701122334",
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        partnerId: fakePartners[0].id,
        partner: fakePartners[0],
        driverTrajets: [],
        commandes: [],
        vehicles: [],
        messagesSent: [],
        messagesReceived: [],
        wallet: fakeWallets[0],
        images: [],
    },
    {
        id: "u-2",
        name: "Bob Dupont",
        email: "bob.dupont@example.com",
        password: "********",
        phone: "+2250509876543",
        role: Role.USER,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        driverTrajets: [],
        commandes: [],
        vehicles: [],
        messagesSent: [],
        messagesReceived: [],
        wallet: fakeWallets[1],
        images: [],
    },
    {
        id: "u-3",
        name: "Claire Bernard",
        email: "claire.bernard@example.com",
        password: "********",
        phone: "+2250704567890",
        role: Role.DRIVER,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        driverTrajets: [],
        commandes: [],
        vehicles: [],
        messagesSent: [],
        messagesReceived: [],
        images: [],
    },
    {
        id: "u-4",
        name: "David Leroy",
        email: "david.leroy@example.com",
        password: "********",
        phone: "+2250109871234",
        role: Role.PARTENAIRE,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        partnerId: fakePartners[1].id,
        partner: fakePartners[1],
        driverTrajets: [],
        commandes: [],
        vehicles: [],
        messagesSent: [],
        messagesReceived: [],
        images: [],
    },
    {
        id: "u-5",
        name: "Emma Petit",
        email: "emma.petit@example.com",
        password: "********",
        phone: "+2250509998877",
        role: Role.USER,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        driverTrajets: [],
        commandes: [],
        vehicles: [],
        messagesSent: [],
        messagesReceived: [],
        images: [],
    },
];

// 🔄 Relations croisées
fakeWallets[0].user = fakeUsers[0];
fakeWallets[1].user = fakeUsers[1];

fakePartners[0].users = [fakeUsers[0]];
fakePartners[1].users = [fakeUsers[3]];

// 🚗 Véhicules factices
export const fakeVehicles: Vehicle[] = [
    {
        id: "v-1",
        registration: "AB-123-CD",
        typeId: fakeVehicleTypes[0].id,
        type: fakeVehicleTypes[0],
        marque: "Mercedes",
        models: "Actros",
        year: 2021,
        color: "#FF0000",
        mileage: 15000,
        seats: 4,
        partnerId: fakePartners[1].id,
        partner: fakePartners[1],
        driverId: fakeUsers[2].id,
        drivers: fakeUsers[2],
        createdAt: new Date(),
        updatedAt: new Date(),
        trajets: [],
        images: [],
        status: VehicleStatus.AVAILABLE,
    },
    {
        id: "v-2",
        registration: "CD-456-EF",
        typeId: fakeVehicleTypes[1].id,
        type: fakeVehicleTypes[1],
        marque: "Toyota",
        models: "Corolla",
        year: 2022,
        color: "#00FF00",
        mileage: 10000,
        seats: 2,
        partnerId: fakePartners[0].id,
        partner: fakePartners[0],
        driverId: fakeUsers[3].id,
        drivers: fakeUsers[3],
        createdAt: new Date(),
        updatedAt: new Date(),
        trajets: [],
        images: ['/ride.png'],
        status: VehicleStatus.OUT_OF_SERVICE,
    },
];

// 🧩 Lier les véhicules aux types, partenaires et conducteurs
fakeVehicleTypes[0].vehicles.push(fakeVehicles[0]);
fakeVehicleTypes[1].vehicles.push(fakeVehicles[1]);

fakePartners[1].fleet.push(fakeVehicles[0]);
fakePartners[0].fleet.push(fakeVehicles[1]);

fakeUsers[2].vehicles.push(fakeVehicles[0]);
fakeUsers[3].vehicles.push(fakeVehicles[1]);

// ✅ Export principal
export default fakeUsers;


// 🚏 Stops factices typés
const fakeStops: { lat: number; lng: number; name: string }[] = [
    {
        name: "Yamoussoukro",
        lat: 6.817,
        lng: -5.276,
    },
    {
        name: "Bouaké",
        lat: 7.693,
        lng: -5.030,
    },
    {
        name: "San Pedro",
        lat: 4.748,
        lng: -6.641,
    },
];

// 🚚 Trajets factices typés
export const fakeTrajets: Trajet[] = [
    {
        id: "t-1",
        departure: "Abidjan, Côte d'Ivoire",
        departureGPS: { lat: 5.345, lng: -4.024 },
        destination: "Yamoussoukro, Côte d'Ivoire",
        destinationGPS: { lat: 6.817, lng: -5.276 },
        distance: 230,
        estimatedDuration: "3h30",
        price: 15000,
        departureTime: new Date("2025-10-22T07:00:00Z"),
        estimatedArrival: new Date("2025-10-22T10:30:00Z"),
        vehicleId: fakeVehicles[0].id,
        vehicle: fakeVehicles[0],
        driverId: fakeUsers[2].id,
        driver: fakeUsers[2],
        partnerId: fakePartners[1].id,
        partner: fakePartners[1],
        stops: [fakeStops[0]], // Yamoussoukro
        disposition: "Transport de marchandises agricoles",
        createdAt: new Date(),
        updatedAt: new Date(),
        commandes: [],
    },
    {
        id: "t-2",
        departure: "Bouaké",
        departureGPS: { lat: 7.693, lng: -5.030 },
        destination: "Korhogo",
        destinationGPS: { lat: 9.459, lng: -5.641 },
        distance: 350,
        estimatedDuration: "5h00",
        price: 20000,
        departureTime: new Date("2025-10-23T08:00:00Z"),
        estimatedArrival: new Date("2025-10-23T13:00:00Z"),
        vehicleId: fakeVehicles[1].id,
        vehicle: fakeVehicles[1],
        driverId: fakeUsers[3].id,
        driver: fakeUsers[3],
        partnerId: fakePartners[0].id,
        partner: fakePartners[0],
        stops: [fakeStops[1], fakeStops[2]], // Bouaké + San Pedro
        disposition: "Trajet mixte avec arrêts multiples",
        createdAt: new Date(),
        updatedAt: new Date(),
        commandes: [],
    },
];

// 🔗 Relier trajets ↔ véhicules ↔ conducteurs
fakeVehicles[0].trajets.push(fakeTrajets[0]);
fakeVehicles[1].trajets.push(fakeTrajets[1]);

fakeUsers[2].driverTrajets.push(fakeTrajets[0]);
fakeUsers[3].driverTrajets.push(fakeTrajets[1]);



// 💸 Commandes factices
export const fakeCommandes: Commande[] = [
    {
        id: "c-1",
        userId: fakeUsers[1].id, // Bob Dupont
        user: fakeUsers[1],
        trajetId: fakeTrajets[0].id, // Abidjan → Yamoussoukro
        trajet: fakeTrajets[0],
        price: 15000,
        status: "CONFIRMED",
        createdAt: new Date("2025-10-22T06:45:00Z"),
        updatedAt: new Date("2025-10-22T07:00:00Z"),
    },
    {
        id: "c-2",
        userId: fakeUsers[4].id, // Emma Petit
        user: fakeUsers[4],
        trajetId: fakeTrajets[0].id, // Même trajet
        trajet: fakeTrajets[0],
        price: 15000,
        status: "PENDING",
        createdAt: new Date("2025-10-22T06:50:00Z"),
        updatedAt: new Date("2025-10-22T06:55:00Z"),
    },
    {
        id: "c-3",
        userId: fakeUsers[1].id, // Bob Dupont encore
        user: fakeUsers[1],
        trajetId: fakeTrajets[1].id, // Bouaké → Korhogo
        trajet: fakeTrajets[1],
        price: 20000,
        status: "COMPLETED",
        createdAt: new Date("2025-10-21T08:10:00Z"),
        updatedAt: new Date("2025-10-21T13:15:00Z"),
    },
    {
        id: "c-4",
        userId: fakeUsers[4].id,
        user: fakeUsers[4],
        trajetId: fakeTrajets[1].id,
        trajet: fakeTrajets[1],
        price: 20000,
        status: "CANCELLED",
        createdAt: new Date("2025-10-21T08:30:00Z"),
        updatedAt: new Date("2025-10-21T09:00:00Z"),
    },
];

// 🔗 Relier les commandes aux trajets et aux utilisateurs
fakeTrajets[0].commandes = [fakeCommandes[0], fakeCommandes[1]];
fakeTrajets[1].commandes = [fakeCommandes[2], fakeCommandes[3]];

fakeUsers[1].commandes = [fakeCommandes[0], fakeCommandes[2]];
fakeUsers[4].commandes = [fakeCommandes[1], fakeCommandes[3]];

// ✅ Relier les commandes aux drivers indirectement via leurs trajets
fakeUsers[2].driverTrajets[0].commandes = [fakeCommandes[0], fakeCommandes[1]];
fakeUsers[3].driverTrajets[0].commandes = [fakeCommandes[2], fakeCommandes[3]];

