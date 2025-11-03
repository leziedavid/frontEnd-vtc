"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import the Map component dynamically with no SSR
const MapWithNoSSR = dynamic(() => import("./map-client").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ),
})

interface MapWrapperProps {
  userLocation?: { lat: number; lng: number } | null
  destination?: { lat: number; lng: number } | null
  onLocationChange?: (location: { lat: number; lng: number }) => void
  showNearbyDrivers?: boolean
}

export function MapWrapper(props: MapWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <MapWithNoSSR {...props} />
}
