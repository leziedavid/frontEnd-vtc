"use client"

import { useEffect, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet"

// Fix Leaflet icon issue in Next.js
useEffect(() => {
  // Only run on client side
  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }
}, [])

// Custom marker icons
const createCustomIcon = (color: string, type: "user" | "destination" | "driver") => {
  return L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${
          type === "driver"
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#000000" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11 2 11.3V16c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`
            : ""
        }
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

// Component to update map view when props change
function MapUpdater({
  center,
  zoom,
}: {
  center?: [number, number]
  zoom?: number
}) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])

  return null
}

interface MapProps {
  userLocation?: { lat: number; lng: number } | null
  destination?: { lat: number; lng: number } | null
  onLocationChange?: (location: { lat: number; lng: number }) => void
  showNearbyDrivers?: boolean
}

export function Map({ userLocation, destination, onLocationChange, showNearbyDrivers = true }: MapProps) {
  const [driverLocations, setDriverLocations] = useState<{ lat: number; lng: number }[]>([])
  const [routePoints, setRoutePoints] = useState<[number, number][]>([])

  const [numDrivers, setNumDrivers] = useState(Math.floor(Math.random() * 4) + 5)

  // Generate random drivers around user location
  useEffect(() => {
    if (userLocation && showNearbyDrivers) {
      const newDrivers = []

      for (let i = 0; i < numDrivers; i++) {
        // Random offset from user location (within ~1km)
        const latOffset = (Math.random() - 0.5) * 0.01
        const lngOffset = (Math.random() - 0.5) * 0.01

        newDrivers.push({
          lat: userLocation.lat + latOffset,
          lng: userLocation.lng + lngOffset,
        })
      }

      setDriverLocations(newDrivers)
    }
  }, [userLocation, showNearbyDrivers, numDrivers])

  // Generate route between user and destination
  useEffect(() => {
    if (userLocation && destination) {
      // In a real app, you would use a routing API
      // For this demo, we'll create a simple route with intermediate points
      const points: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [
          userLocation.lat + (destination.lat - userLocation.lat) * 0.25,
          userLocation.lng + (destination.lng - userLocation.lng) * 0.25,
        ],
        [
          userLocation.lat + (destination.lat - userLocation.lat) * 0.5,
          userLocation.lng + (destination.lng - userLocation.lng) * 0.5 + 0.002,
        ],
        [
          userLocation.lat + (destination.lat - userLocation.lat) * 0.75,
          userLocation.lng + (destination.lng - userLocation.lng) * 0.75,
        ],
        [destination.lat, destination.lng],
      ]

      setRoutePoints(points)
    }
  }, [userLocation, destination])

  // Handle location button click
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          if (onLocationChange) {
            onLocationChange(newLocation)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  // Default center if no user location
  const defaultCenter: [number, number] = [37.7749, -122.4194] // San Francisco
  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map view when center changes */}
        <MapUpdater center={center} />

        {/* User marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createCustomIcon("#3887be", "user")}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={createCustomIcon("#e74c3c", "destination")}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Driver markers */}
        {showNearbyDrivers &&
          driverLocations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lng]} icon={createCustomIcon("#ffd700", "driver")}>
              <Popup>Driver nearby</Popup>
            </Marker>
          ))}

        {/* Route line */}
        {routePoints.length > 0 && <Polyline positions={routePoints} color="#3887be" weight={5} opacity={0.7} />}
      </MapContainer>

      {/* Location button */}
      <button
        className="absolute bottom-4 right-4 z-[1000] bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
        onClick={handleLocationClick}
      >
        <span className="sr-only">Get current location</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="1" />
          <line x1="12" y1="8" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="16" />
          <line x1="8" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="16" y2="12" />
        </svg>
      </button>
    </div>
  )
}
