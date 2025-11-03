// utils/getVehicleTypeName.ts

/**
 * Retourne le nom du type de véhicule correspondant à un ID.
 * @param id - L'identifiant du type de véhicule
 * @param vehicleTypes - Le tableau contenant les types de véhicules ({ id, name })
 * @returns Le nom du type de véhicule ou "Type inconnu" si introuvable
 */
export function getVehicleTypeName(
    id: string | number,
    vehicleTypes: { id: string | number; name: string }[]
): string {
    const type = vehicleTypes.find((v) => v.id === id);
    return type ? type.name : "Type inconnu";
}
