"use client"

import { useEffect, useState } from "react"
import { Trajet, TrajetStatus } from "@/types/interfaces"
import { toast } from "sonner"
import MapRead from "@/components/mapRead"
import { useRouter } from "next/navigation"

export default function Page() {
    const [trajet, setTrajet] = useState<Trajet | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleFinish = () => {
        alert('Course terminée !')
        // Nettoyer le localStorage
        localStorage.removeItem('data')
    }

    // Fonction pour parser et convertir les dates
    const parseTrajetWithDates = (trajetData: any): Trajet => {
        return {
            ...trajetData,
            departureTime: new Date(trajetData.departureTime),
            estimatedArrival: new Date(trajetData.estimatedArrival),
            createdAt: new Date(trajetData.createdAt),
            updatedAt: new Date(trajetData.updatedAt),
            stops: trajetData.stops?.map((stop: any) => ({
                ...stop,
                arrivalTime: stop.arrivalTime ? new Date(stop.arrivalTime) : undefined
            })) || [],
            driver: trajetData.driver ? {
                ...trajetData.driver,
                createdAt: new Date(trajetData.driver.createdAt),
                updatedAt: new Date(trajetData.driver.updatedAt)
            } : undefined,
            vehicle: trajetData.vehicle ? {
                ...trajetData.vehicle,
                createdAt: new Date(trajetData.vehicle.createdAt),
                updatedAt: new Date(trajetData.vehicle.updatedAt)
            } : undefined,
            partner: trajetData.partner ? {
                ...trajetData.partner,
                createdAt: new Date(trajetData.partner.createdAt),
                updatedAt: new Date(trajetData.partner.updatedAt)
            } : undefined
        }
    }

    // Récupérer le trajet depuis le localStorage
    useEffect(() => {
        const loadTrajetFromStorage = () => {
            try {
                const storedTrajet = localStorage.getItem('data')
                
                if (!storedTrajet) {
                    setError('Aucun trajet trouvé dans le stockage local')
                    return
                }

                const parsedTrajet = JSON.parse(storedTrajet)
                
                // Validation basique
                if (!parsedTrajet.id || !parsedTrajet.departure || !parsedTrajet.destination) {
                    setError('Données de trajet invalides')
                    return
                }

                const trajetWithDates = parseTrajetWithDates(parsedTrajet)
                setTrajet(trajetWithDates)
                
            } catch (error) {
                console.error('Erreur lors du chargement du trajet:', error)
                setError('Erreur lors du chargement du trajet')
            } finally {
                setLoading(false)
            }
        }

        loadTrajetFromStorage()
    }, [])

    // Redirection si erreur
    useEffect(() => {
        if (error) {
            toast.error(error)
            const timer = setTimeout(() => {
                router.push('/dashboard/driver')
            }, 3000)
            
            return () => clearTimeout(timer)
        }
    }, [error, router])

    if (loading) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du trajet...</p>
                </div>
            </div>
        )
    }


    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">

            {/* Carte */}
            {trajet && (
                <MapRead
                    trajetId={trajet.id}
                    trajetData={trajet}
                    onFinish={handleFinish}
                />
            )}
        </div>
    )
}