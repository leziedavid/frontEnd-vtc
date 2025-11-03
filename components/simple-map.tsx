"use client"

import { JSX, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface SimpleMapProps {
  userLocation?: { lat: number; lng: number } | null
  destination?: { lat: number; lng: number } | null
  onLocationChange?: (location: { lat: number; lng: number }) => void
  showNearbyDrivers?: boolean
}

export function SimpleMap({ userLocation, destination, onLocationChange, showNearbyDrivers = true }: SimpleMapProps) {
  const [mapUrl, setMapUrl] = useState("")
  const [driverDots, setDriverDots] = useState<JSX.Element[]>([])

  // Update map URL when locations change
  useEffect(() => {
    if (userLocation) {
      // Create OpenStreetMap URL
      const zoom = 15
      const baseUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${ userLocation.lng - 0.01 }%2C${userLocation.lat - 0.01}%2C${userLocation.lng + 0.01}%2C${ userLocation.lat + 0.01 }&amp;layer=mapnik&amp;marker=${userLocation.lat}%2C${userLocation.lng}`

      setMapUrl(baseUrl)

      // Generate random driver dots if enabled
      if (showNearbyDrivers) {
        const numDrivers = Math.floor(Math.random() * 4) + 5
        const newDrivers = []

        for (let i = 0; i < numDrivers; i++) {
          // Random offset from user location (within ~1km)
          const latOffset = (Math.random() - 0.5) * 0.01
          const lngOffset = (Math.random() - 0.5) * 0.01

          const left = ((lngOffset + 0.01) / 0.02) * 100
          const top = (1 - (latOffset + 0.01) / 0.02) * 100

          newDrivers.push(
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${top}%`,
                width: "12px",
                height: "12px",
                backgroundColor: "#ffd700",
                borderRadius: "50%",
                border: "2px solid white",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              title="Driver nearby"
            />,
          )
        }

        setDriverDots(newDrivers)
      } else {
        setDriverDots([])
      }
    }
  }, [userLocation, destination, showNearbyDrivers])

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

  return (
    <div className="relative w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
      {mapUrl ? (
        <>
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            style={{ border: 0 }}
            title="Map"
          ></iframe>

          {/* User location marker */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "16px",
              height: "16px",
              backgroundColor: "#3887be",
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
            title="Your location"
          />

          {/* Destination marker */}
          {destination && (
            <div
              style={{
                position: "absolute",
                left: `${50 + ((destination.lng - (userLocation?.lng || 0)) / 0.02) * 100}%`,
                top: `${50 - ((destination.lat - (userLocation?.lat || 0)) / 0.02) * 100}%`,
                width: "16px",
                height: "16px",
                backgroundColor: "#e74c3c",
                borderRadius: "50%",
                border: "3px solid white",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              title="Destination"
            />
          )}

          {/* Driver markers */}
          {driverDots}

          {/* Route line */}
          {destination && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${Math.sqrt(
                  Math.pow(((destination.lng - (userLocation?.lng || 0)) / 0.02) * 100, 2) +
                    Math.pow(((destination.lat - (userLocation?.lat || 0)) / 0.02) * 100, 2),
                )}%`,
                height: "4px",
                backgroundColor: "#3887be",
                borderRadius: "2px",
                transform: `translate(-50%, -50%) rotate(${
                  Math.atan2(
                    -((destination.lat - (userLocation?.lat || 0)) / 0.02) * 100,
                    ((destination.lng - (userLocation?.lng || 0)) / 0.02) * 100,
                  ) *
                  (180 / Math.PI)
                }deg)`,
                transformOrigin: "left center",
                opacity: 0.7,
                zIndex: 5,
              }}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Location button */}
      <Button
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
      </Button>
    </div>
  )
}
