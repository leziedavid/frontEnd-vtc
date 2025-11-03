// components/MapRead.tsx
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Clock, MapPin, Navigation, ChevronDown, ChevronUp } from "lucide-react"
import { Trajet } from "@/types/interfaces"
import MapContainer from "./mapContainer"

interface MapReadProps {
    trajetId: string
    trajetData: Trajet
    onFinish?: () => void
}

export default function MapRead({ trajetId, trajetData, onFinish }: MapReadProps) {
    const [driverPosition, setDriverPosition] = useState(trajetData.departureGPS)
    const [progress, setProgress] = useState(0)
    const [isPanelVisible, setIsPanelVisible] = useState(true)
    const [map, setMap] = useState<any>(null)
    const watchIdRef = useRef<number | null>(null)
    const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Simulation de fallback - déplacée en dehors du useCallback
    const startFallbackSimulation = () => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current)
        }

        let currentProgress = 0
        simulationIntervalRef.current = setInterval(() => {
            currentProgress += 0.5
            if (currentProgress >= 100) {
                if (simulationIntervalRef.current) {
                    clearInterval(simulationIntervalRef.current)
                }
                setProgress(100)
                return
            }
            setProgress(currentProgress)
        }, 1000)
    }

    // Géolocalisation en temps réel
    const startRealTimeTracking = useCallback(() => {
        if (!navigator.geolocation) {
            console.error("La géolocalisation n'est pas supportée")
            startFallbackSimulation()
            return
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }

        // Nettoyer tout watcher existant
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
        }

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                setDriverPosition(newPosition)
            },
            (error) => {
                console.error("Erreur de géolocalisation:", error)
                startFallbackSimulation()
            },
            options
        )

        watchIdRef.current = id
    }, []) // Dépendances vides car stable

    useEffect(() => {
        startRealTimeTracking()

        return () => {
            // Nettoyage
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
            }
            if (simulationIntervalRef.current) {
                clearInterval(simulationIntervalRef.current)
            }
        }
    }, [startRealTimeTracking]) // Seulement startRealTimeTracking comme dépendance

    const handleMapLoad = useCallback((mapInstance: any) => {
        setMap(mapInstance)
    }, [])

    const handleProgressUpdate = useCallback((newProgress: number) => {
        setProgress(newProgress)
    }, [])

    const centerOnDriver = useCallback(() => {
        if (map && driverPosition) {
            map.panTo(driverPosition)
            map.setZoom(15)
        }
    }, [map, driverPosition])

    const zoomIn = useCallback(() => {
        if (map) {
            map.setZoom(map.getZoom() + 1)
        }
    }, [map])

    const zoomOut = useCallback(() => {
        if (map) {
            map.setZoom(map.getZoom() - 1)
        }
    }, [map])

    // Format time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    // 🔹 Distance restante
    const remainingDistance = (((trajetData.totalDistance ?? 0) * (100 - progress)) / 100).toFixed(1);
    // 🔹 Heure d'arrivée estimée
    const estimatedArrivalTime = formatTime(
        trajetData.estimatedArrival instanceof Date
            ? trajetData.estimatedArrival.toISOString()
            : trajetData.estimatedArrival
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Map Container */}
            <div className="flex-1 relative bg-gray-100 overflow-hidden">
                <MapContainer
                    trajetData={trajetData}
                    driverPosition={driverPosition}
                    onProgressUpdate={handleProgressUpdate}
                    onMapLoad={handleMapLoad}
                />

                {/* Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {/* Zoom controls */}
                    <div className="flex flex-col gap-1 bg-white rounded-lg shadow-lg p-1">
                        <button
                            onClick={zoomIn}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <span className="text-xl font-bold">+</span>
                        </button>
                        <div className="h-px bg-gray-200"></div>
                        <button
                            onClick={zoomOut}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <span className="text-xl font-bold">−</span>
                        </button>
                    </div>

                    {/* Recenter button */}
                    <button
                        onClick={centerOnDriver}
                        className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-100 transition-colors"
                    >
                        <Navigation className="w-5 h-5 text-blue-600" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur rounded-lg shadow-md p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Départ</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">Arrêts</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">Destination</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Véhicule</span>
                    </div>
                </div>
            </div>

            {/* Toggle Panel Button */}
            <button
                onClick={() => setIsPanelVisible(!isPanelVisible)}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white rounded-full p-2 shadow-lg z-50 hover:bg-gray-100 transition-colors"
            >
                {isPanelVisible ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>

            {/* Bottom Info Panel - Collapsible */}
            <div
                className={`bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ${isPanelVisible ? 'p-6' : 'p-0 h-0 overflow-hidden'
                    }`}
            >
                <div className="space-y-4">
                    {/* Driver info compact */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Navigation className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{trajetData.driver.name}</p>
                                <p className="text-xs text-gray-500">{trajetData.vehicle.marque}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">{Math.round(progress)}%</div>
                        </div>
                    </div>

                    {/* Route Info */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-start gap-2 flex-1">
                            <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Départ</p>
                                <p className="text-sm font-medium text-gray-900">{trajetData.departure}</p>
                            </div>
                        </div>
                        <div className="px-3">
                            <div className="w-6 h-px bg-gray-300"></div>
                        </div>
                        <div className="flex items-start gap-2 flex-1">
                            <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Destination</p>
                                <p className="text-sm font-medium text-gray-900">{trajetData.destination}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                            <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Arrivée</p>
                            <p className="text-sm font-bold text-blue-900">{estimatedArrivalTime}</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-2 text-center">
                            <Navigation className="w-4 h-4 text-green-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Restant</p>
                            <p className="text-sm font-bold text-green-900">{remainingDistance} km</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                            <Clock className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Durée</p>
                            <p className="text-sm font-bold text-purple-900">{trajetData.estimatedDuration}</p>
                        </div>
                    </div>

                    {/* Stops Info */}
                    {trajetData.stops && trajetData.stops.length > 0 && (
                        <div className="bg-orange-50 rounded-xl p-3">
                            <p className="text-sm font-medium text-orange-900 mb-2">
                                {trajetData.stops.length} arrêt
                                {trajetData.stops.length > 1 ? 's' : ''} prévu
                                {trajetData.stops.length > 1 ? 's' : ''}
                            </p>

                            <div className="space-y-1">
                                {trajetData.stops.map((stop, index) => (
                                    <div key={index} className="flex justify-between text-xs text-orange-800">
                                        <span>• {stop.name}</span>
                                        <span>
                                            {stop.arrivalTime
                                                ? formatTime(
                                                    stop.arrivalTime instanceof Date
                                                        ? stop.arrivalTime.toISOString()
                                                        : stop.arrivalTime
                                                )
                                                : '--:--'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button onClick={onFinish} disabled={progress < 100} className={`w-full py-3 rounded-xl font-semibold transition-all ${progress >= 100  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed' }`}  >
                        {progress >= 100 ? '✓ Terminer la course' : 'Course en cours...'}
                    </button>
                </div>
            </div>
        </div>
    )
}