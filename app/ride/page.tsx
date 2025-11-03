'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Car, SquareMousePointer } from "lucide-react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog"
import { SearchTrajetParams, searchTrajets } from "../services/trajetService"
import { ModelPagination } from "@/components/modelPagination"
import { getAllVehicleTypesList } from "../services/VehicleTypeServices"
import { VehicleType } from "@/types/interfaces"
import { getVehicleTypeName } from "@/types/getVehicleTypeName"
import { createCommande } from "@/app/services/commandeService"
import { getUserInfos } from "../middleware"

const LocationInput = dynamic( () => import("@/components/forms/LocationInput").then(mod => mod.LocationInput), { ssr: false })
const MapContainer = dynamic( () => import("@/components/mapContainer").then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    )
  }
)

export default function PageTrajet() {
  const [depart, setDepart] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [heure, setHeure] = useState("")
  const [typeTrajet, setTypeTrajet] = useState("standard")
  const [localisationUtilisateur, setLocalisationUtilisateur] = useState<{ lat: number; lng: number } | null>(null)
  const [localisationDestination, setLocalisationDestination] = useState<{ lat: number; lng: number } | null>(null)
  const [trajets, setTrajets] = useState<any[]>([])
  const [trajetSelectionne, setTrajetSelectionne] = useState<any | null>(null)
  const [places, setPlaces] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tarif, setTarif] = useState(0)

  const [mapChargee, setMapChargee] = useState(false)
  const [driverPosition, setDriverPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [progress, setProgress] = useState(0)

  const [openConfirm, setOpenConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [userId, setUserId] = useState<string>("");

  // Fonction pour demander la géolocalisation
  const demanderGeolocalisation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocalisationUtilisateur(location)
          setDriverPosition(location)
          setDepart("Position actuelle")
          setMapChargee(true)
          // Sauvegarder la préférence dans localStorage
          localStorage.setItem('locationPermissionGranted', 'true')
          // Simulation d'une destination
          setTimeout(() => {
            setLocalisationDestination({
              lat: location.lat + 0.01,
              lng: location.lng + 0.01,
            })
          }, 1000)
        },
        (error) => {
          console.error("Erreur de localisation :", error)
          let errorMessage = "Impossible d'obtenir votre position"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permission refusée. Activez la géolocalisation dans les paramètres de votre navigateur."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Position indisponible. Vérifiez votre connexion GPS/Internet."
              break
            case error.TIMEOUT:
              errorMessage = "La demande de localisation a expiré."
              break
          }
          console.log("Message d'erreur:", errorMessage)
          utiliserLocalisationParDefaut()
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      utiliserLocalisationParDefaut()
    }
  }

  // Fonction pour utiliser une localisation par défaut
  const utiliserLocalisationParDefaut = () => {
    setMapChargee(true)
    const defaultLocation = {
      lat: 5.3600,
      lng: -4.0083,
    }
    setLocalisationUtilisateur(defaultLocation)
    setDriverPosition(defaultLocation)
    setDepart("Abidjan, Côte d'Ivoire")
  }

  const fetchUsersId = async () => {
    const res = await getUserInfos();
    if (res) {
      setUserId(res.id)
    }
  }

  useEffect(() => {
    fetchUsersId();
  }, [])

  // Vérifier la permission au chargement
  useEffect(() => {
    const checkLocationPermission = async () => {
      const permissionGranted = localStorage.getItem('locationPermissionGranted')

      if (permissionGranted === 'true') {
        demanderGeolocalisation()
      } else {
        if (navigator.permissions) {
          try {
            const result = await navigator.permissions.query({ name: 'geolocation' })

            if (result.state === 'granted') {
              demanderGeolocalisation()
            } else if (result.state === 'prompt') {
              setMapChargee(true)
              utiliserLocalisationParDefaut()
            } else {
              setMapChargee(true)
              utiliserLocalisationParDefaut()
            }
          } catch (error) {
            setMapChargee(true)
            utiliserLocalisationParDefaut()
          }
        } else {
          setMapChargee(true)
          utiliserLocalisationParDefaut()
        }
      }
    }

    checkLocationPermission()
  }, [])

  const handleRechercher = async () => {
    if (!depart || !destination) return;

    setLoading(true);

    try {
      const queryParams: SearchTrajetParams = { depart, destination };

      if (localisationUtilisateur) {
        queryParams.departureLat = localisationUtilisateur.lat;
        queryParams.departureLng = localisationUtilisateur.lng;
      }

      if (localisationDestination) {
        queryParams.destinationLat = localisationDestination.lat;
        queryParams.destinationLng = localisationDestination.lng;
      }

      const res = await searchTrajets(queryParams, currentPage, limit);

      if (res.data) {
        setTrajets(res.data.data ?? []);
        setTotalItems(res.data.total);
      }

    } catch (error) {
      console.error(error);
      toast.error("❌ Impossible de récupérer les trajets");
    } finally {
      setLoading(false);
    }
  };

  const selecteTrajets = (val: any) => {
    setTrajetSelectionne(val)
    // Mettre à jour la position du driver avec la position de départ du trajet sélectionné
    if (val && val.departureGPS) {
      setDriverPosition(val.departureGPS)
    }
  }

  const listeAllVehicleTypes = async () => {
    try {
      const res = await getAllVehicleTypesList();
      if (res.statusCode === 200 && res.data) {
        setVehicleTypes(res.data);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    listeAllVehicleTypes();
  }, []);

  // 🔹 Recalcul automatique du tarif
  useEffect(() => {
    if (!trajetSelectionne) return
    const selectedType = vehicleTypes.find(t => t.id === typeTrajet)
    const prixType = selectedType ? selectedType.price : 0
    const tarifTotal = (trajetSelectionne.price + prixType) * places
    setTarif(tarifTotal)
  }, [trajetSelectionne, typeTrajet, places])

  const handleReserver = () => {
    setOpenConfirm(true)
  }

  // ✅ Envoie la commande au backend
  const handleConfirmerCommande = async () => {
    if (!trajetSelectionne) return
    setSubmitting(true)
    const selectedType = vehicleTypes.find(t => t.id === typeTrajet)
    const commandeDto = {
      userId: userId,
      trajetId: trajetSelectionne.id,
      typeId: selectedType?.id ?? "standard",
      price: (trajetSelectionne.price + (selectedType?.price ?? 0)) * places,
      status: "PENDING",
    }
    try {
      const response = await createCommande(commandeDto);

      if (response.statusCode === 201) {
        toast.success("✅ Réservation confirmée avec succès !")
        setOpenConfirm(false)
        setTrajetSelectionne(null)
        setPlaces(1)
      } else {
        toast.error(response.message || "Erreur lors de la réservation")
      }

    } finally {
      setSubmitting(false)
    }
  }

  const handleDestinationChange = (val: string) => {
    setDestination(val)
    if (val && localisationUtilisateur) {
      setLocalisationDestination({
        lat: localisationUtilisateur.lat + 0.05,
        lng: localisationUtilisateur.lng + 0.05,
      })
    }
  }

  // Fonction pour gérer le chargement de la carte
  const handleMapLoad = (map: any) => {
    console.log("Carte chargée avec succès")
  }

  // Fonction pour mettre à jour la progression
  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress)
  }

  // 🔹 Géolocalisation initiale simulée
  useEffect(() => {
    const defaultLocation = { lat: 5.36, lng: -4.0083 }
    setLocalisationUtilisateur(defaultLocation)
    setDriverPosition(defaultLocation)
  }, [])

  // 🔹 Recherche automatique quand la page change
  useEffect(() => {
    if (!depart || !destination) return;
    handleRechercher();
  }, [currentPage]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-[calc(100vh-4rem)] mt-4">
        <div className="flex flex-col lg:flex-row h-full">
          {/* 🌍 Carte */}
          <div className="w-full lg:w-2/3 h-[300px] lg:h-auto relative bg-gray-200 dark:bg-gray-800">
            {!mapChargee ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <MapContainer
                trajetData={trajetSelectionne || {
                  departureGPS: localisationUtilisateur || { lat: 5.36, lng: -4.0083 },
                  destinationGPS: localisationDestination || { lat: 5.37, lng: -4.0183 },
                  stops: [],
                  departure: depart || "Position actuelle",
                  destination: destination || "Destination",
                  estimatedDuration: "00:00",
                  price: 0,
                  driver: { name: "Non spécifié" },
                  vehicle: { marque: "Non spécifié", model: "" }
                }}
                driverPosition={driverPosition || localisationUtilisateur || { lat: 5.36, lng: -4.0083 }}
                onProgressUpdate={handleProgressUpdate}
                onMapLoad={handleMapLoad}
              />
            )}
          </div>

          {/* 🧭 Section de planification */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6 bg-background overflow-y-auto">
            <Card className="w-full">
              <CardHeader>
                <h3 className="text-lg font-bold leading-tight flex items-center gap-2">
                  Planifier un trajet
                  <span className="w-8 h-8 text-white rounded-full bg-lime-500 flex items-center justify-center font-medium">
                    1
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Indiquez vos informations</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Départ / Destination */}
                <div className="space-y-2">
                  <LocationInput placeholder="Lieu de départ" value={depart} onChange={setDepart} />
                  <LocationInput placeholder="Destination" value={destination} onChange={handleDestinationChange} />
                </div>

                {/* Date / Heure */}
                <div className="grid gap-2">
                  <Label htmlFor="date">Date (optionnelle)</Label>
                  <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Heure (optionnelle)</Label>
                  <Input type="time" id="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
                </div>

                <Separator />

                {/* Type de trajet */}
                <div className="pt-2">
                  <h3 className="font-medium mb-2">Choisissez un type de trajet</h3>
                  <RadioGroup defaultValue="standard" className="space-y-3" onValueChange={setTypeTrajet} >
                    {vehicleTypes.map((t) => (
                      <div key={t.id} className={`flex items-center justify-between space-x-2 rounded-md border p-4 ${typeTrajet === t.id ? "border-primary bg-muted" : ""}`}  >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={t.id} id={t.id} />
                          <Label htmlFor={t.id} className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{t.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {t.description}
                              </p>
                            </div>
                          </Label>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">
                            {t.price.toLocaleString()} Fcfa
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button className={`w-full text-white font-semibold ${depart && destination ? 'bg-lime-500 hover:bg-lime-600' : 'bg-gray-400 cursor-not-allowed'}`} size="lg" onClick={handleRechercher} disabled={!depart || !destination || loading} >
                  {loading ? "Recherche en cours..." : "Rechercher un trajet"}
                </Button>
              </CardFooter>
            </Card>

            {/* Résultats */}
            {trajets.length > 0 && (
              <>
                <div className="flex justify-center items-center mt-4">
                  <span className="w-8 h-8 text-white rounded-full bg-lime-500 flex items-center justify-center"> 2</span>
                </div>

                <div className="mt-2 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    Trajets disponibles
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      (Sélectionner le trajet) <SquareMousePointer className="h-4 w-4 text-lime-500" />
                    </span>
                  </h3>
                  {trajets.map((t) => (
                    <div key={t.id} onClick={() => selecteTrajets(t)} className={`cursor-pointer rounded-md border p-4 hover:bg-muted transition ${trajetSelectionne?.id === t.id ? "border-primary bg-muted" : ""}`}  >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{t.departure} → {t.destination}</p>
                          <p className="text-sm text-muted-foreground">{t.estimatedDuration} • {t.price} Fcfa</p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="font-medium">{t.vehicle.marque} {t.vehicle.model}</p>
                          <p className="text-xs text-muted-foreground">{t.driver?.name ?? "Chauffeur inconnu"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <ModelPagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={limit}
                  onPreviousPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalItems / limit)))} />
              </>
            )}

            {/* Réservation finale */}
            {trajetSelectionne && (
              <>
                <div className="flex justify-center items-center mt-4">
                  <span className="w-8 h-8 text-white rounded-full bg-lime-500 flex items-center justify-center"> 3</span>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Confirmer la réservation</CardTitle>
                    <CardDescription>{trajetSelectionne.departure} → {trajetSelectionne.destination}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-lime-500 hover:bg-lime-600" onClick={handleReserver}>
                      Réserver le trajet
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}

            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Confirmer la réservation</DialogTitle>
                  <DialogDescription>
                    Vous êtes sur le point de réserver un trajet <br />
                    <span className="font-semibold">{trajetSelectionne?.departure} → {trajetSelectionne?.destination}</span><br />
                    Type : <span className="capitalize"> {getVehicleTypeName(typeTrajet, vehicleTypes)}</span>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Durée estimée :</span>
                    <span>{trajetSelectionne?.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Prix estimé :</span>
                    <span className="font-medium text-lime-600">{tarif.toLocaleString()} Fcfa</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="places">Nombre de places</Label>
                    <Input id="places" type="number" min={1} value={places} onChange={(e) => setPlaces(Number(e.target.value))} />
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpenConfirm(false)} disabled={submitting} className="w-full sm:w-auto py-1.5 sm:py-2 text-sm sm:text-base" >
                    Annuler
                  </Button>

                  <Button className="bg-lime-500 hover:bg-lime-600 text-white w-full sm:w-auto py-1.5 sm:py-2 text-sm sm:text-base" onClick={handleConfirmerCommande} disabled={submitting} >
                    {submitting ? "Réservation..." : "Confirmer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}