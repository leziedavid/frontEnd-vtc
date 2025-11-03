// components/MapContainer.tsx
"use client"

import { GoogleMap, DirectionsRenderer, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api'
import { useState, useEffect, useCallback } from 'react'

const mapContainerStyle = {
    width: '100%',
    height: '100%'
}

const defaultCenter = {
    lat: 7.5399,
    lng: -5.5471
}

const mapStyles = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "gamma": 0.01 }, { "lightness": 20 }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{ "saturation": -31 }, { "lightness": -33 }, { "weight": 2 }, { "gamma": 0.8 }]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#c9c9c9" }]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "lightness": 30 }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "saturation": 20 }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "lightness": 20 }, { "saturation": -20 }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "lightness": 10 }, { "saturation": -30 }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "saturation": 25 }, { "lightness": 25 }]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{ "lightness": -20 }]
    }
]

interface MapContainerProps {
    trajetData: any
    driverPosition: { lat: number; lng: number }
    onProgressUpdate: (progress: number) => void
    onMapLoad: (map: any) => void
}

export default function MapContainer({ trajetData, driverPosition, onProgressUpdate, onMapLoad}: MapContainerProps) {
    const [map, setMap] = useState<any>(null)
    const [directions, setDirections] = useState<any>(null)
    const [completedPath, setCompletedPath] = useState<any[]>([])
    const [directionsService, setDirectionsService] = useState<any>(null)
    const [dashedPolyline, setDashedPolyline] = useState<any>(null)

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['geometry']
    })

    useEffect(() => {
        if (isLoaded && map) {
            setDirectionsService(new window.google.maps.DirectionsService())
            onMapLoad(map)
        }
    }, [isLoaded, map, onMapLoad])

    // Fonction pour créer une ligne pointillée
    const createDashedPolyline = useCallback((path: any[]) => {
        if (!map || !path.length) return null

        // Créer une ligne pointillée en utilisant un symbole
        return new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#bfdbfe',
            strokeOpacity: 0.8,
            strokeWeight: 6,
            icons: [{
                icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 0.8,
                    scale: 4
                },
                offset: '0',
                repeat: '10px'
            }],
            map: map
        })
    }, [map])

    // Calculer l'itinéraire
    useEffect(() => {
        if (!directionsService || !trajetData) return

        const waypoints = trajetData.stops?.map((stop: any) => ({
            location: { lat: stop.lat, lng: stop.lng },
            stopover: true
        })) || []

        directionsService.route({
            origin: trajetData.departureGPS,
            destination: trajetData.destinationGPS,
            waypoints: waypoints,
            travelMode: window.google.maps.TravelMode.DRIVING
        }, (result: any, status: any) => {
            if (status === 'OK') {
                setDirections(result)

                // Créer la ligne pointillée pour l'itinéraire complet
                const routePath = result.routes[0].overview_path
                const dashedLine = createDashedPolyline(routePath)
                setDashedPolyline(dashedLine)

                // Ajuster la vue pour montrer tout l'itinéraire
                const bounds = new window.google.maps.LatLngBounds()
                result.routes[0].legs.forEach((leg: any) => {
                    bounds.extend(leg.start_location)
                    bounds.extend(leg.end_location)
                })
                map.fitBounds(bounds)
            }
        })
    }, [directionsService, trajetData, map, createDashedPolyline])

    // Mettre à jour la progression
    useEffect(() => {
        if (!directions || !driverPosition) return

        const route = directions.routes[0]
        const path = route.overview_path

        // Trouver le point le plus proche sur l'itinéraire
        let closestIndex = 0
        let minDistance = Number.MAX_VALUE

        for (let i = 0; i < path.length; i++) {
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                driverPosition,
                path[i]
            )
            if (distance < minDistance) {
                minDistance = distance
                closestIndex = i
            }
        }

        // Calculer la distance parcourue
        let traveledDistance = 0
        for (let i = 0; i < closestIndex; i++) {
            traveledDistance += window.google.maps.geometry.spherical.computeDistanceBetween(
                path[i],
                path[i + 1]
            )
        }

        // Distance totale
        const totalDistance = route.legs.reduce((total: number, leg: any) => {
            return total + leg.distance.value
        }, 0)

        const newProgress = Math.min(100, (traveledDistance / totalDistance) * 100)
        onProgressUpdate(newProgress)

        // Mettre à jour la portion parcourue
        setCompletedPath(path.slice(0, closestIndex + 1))
    }, [driverPosition, directions, onProgressUpdate])

    // Nettoyer la ligne pointillée quand le composant est démonté
    useEffect(() => {
        return () => {
            if (dashedPolyline) {
                dashedPolyline.setMap(null)
            }
        }
    }, [dashedPolyline])

    const onLoad = useCallback((map: any) => {
        setMap(map)
    }, [])

    const onUnmount = useCallback(() => {
        setMap(null)
    }, [])

    if (!isLoaded) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de la carte...</p>
                </div>
            </div>
        )
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={8}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                styles: mapStyles,
                disableDefaultUI: false,
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}
        >
            {/* Itinéraire complet - Maintenant géré par la polyline pointillée externe */}
            {/* Le DirectionsRenderer est désactivé car nous gérons l'affichage nous-même */}
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        suppressMarkers: true,
                        suppressPolylines: true // On désactive la polyline par défaut
                    }}
                />
            )}

            {/* Portion parcourue */}
            {completedPath.length > 1 && (
                <Polyline
                    path={completedPath}
                    options={{
                        strokeColor: '#22c55e',
                        strokeOpacity: 1.0,
                        strokeWeight: 6,
                    }}
                />
            )}

            {/* Marqueur du conducteur */}
            {driverPosition && (
                <Marker
                    position={driverPosition}
                    icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#3b82f6',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                    }}
                    title="Conducteur"
                />
            )}

            {/* Marqueurs des points d'arrêt */}
            {trajetData && (
                <>
                    {/* Départ */}
                    <Marker
                        position={trajetData.departureGPS}
                        icon={{
                            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMyMmM1NWUiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNSIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
                            scaledSize: new window.google.maps.Size(24, 24),
                            anchor: new window.google.maps.Point(12, 12)
                        }}
                        title="Départ"
                    />

                    {/* Arrêts */}
                    {trajetData.stops?.map((stop: any, index: number) => (
                        <Marker
                            key={index}
                            position={{ lat: stop.lat, lng: stop.lng }}
                            icon={{
                                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0iI2Y1OWUwYiIvPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIzIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
                                scaledSize: new window.google.maps.Size(20, 20),
                                anchor: new window.google.maps.Point(10, 10)
                            }}
                            title={stop.name}
                        />
                    ))}

                    {/* Destination */}
                    <Marker
                        position={trajetData.destinationGPS}
                        icon={{
                            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNlZjQ0NDQiLz4KPHBhdGggZD0iTTEyIDZMMTIgMTgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNNiAxMkgxOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==',
                            scaledSize: new window.google.maps.Size(24, 24),
                            anchor: new window.google.maps.Point(12, 12)
                        }}
                        title="Destination"
                    />
                </>
            )}
        </GoogleMap>
    )
}