"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, MessageSquare, Star, Car, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { SimpleMap } from "@/components/simple-map"

export default function RideStatusPage() {
  const [progress, setProgress] = useState(0)
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | null>(null)
  const [status, setStatus] = useState("Finding your driver")
  const [eta, setEta] = useState("5 min")
  const [driverFound, setDriverFound] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [destinationLocation, setDestinationLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Check payment status from URL on component mount
  useEffect(() => {
    const status = searchParams.get("payment_intent_status")
    if (status === "succeeded") {
      setPaymentStatus("success")
    } else if (status === "failed") {
      setPaymentStatus("failed")
    } else {
      // Default to success for demo purposes
      setPaymentStatus("success")
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)

          // Set a simulated destination
          setDestinationLocation({
            lat: location.lat + 0.01,
            lng: location.lng + 0.01,
          })
        },
        (error) => {
          console.error("Error getting location:", error)

          // Set default location for demo purposes
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194,
          })

          setDestinationLocation({
            lat: 37.7849,
            lng: -122.4094,
          })
        },
      )
    } else {
      // Set default location for demo purposes
      setUserLocation({
        lat: 37.7749,
        lng: -122.4194,
      })

      setDestinationLocation({
        lat: 37.7849,
        lng: -122.4094,
      })
    }
  }, [searchParams])

  // Simulate ride progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setDriverFound(true)
      setStatus("Driver is on the way")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (driverFound) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }

          // Update status based on progress
          if (prev >= 30 && prev < 60) {
            setStatus("Driver is arriving")
            setEta("2 min")
          } else if (prev >= 60 && prev < 90) {
            setStatus("On trip to destination")
            setEta("8 min")
          } else if (prev >= 90) {
            setStatus("Arriving at destination")
            setEta("1 min")
          }

          return prev + 1
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [driverFound])

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] lg:h-auto bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
          {userLocation && (
            <SimpleMap userLocation={userLocation} destination={destinationLocation} showNearbyDrivers={true} />
          )}
        </div>

        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{status}</CardTitle>
              <CardDescription>
                {driverFound ? "Your driver is on the way" : "Connecting you with a nearby driver"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!driverFound ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage src="/placeholder-user.jpg" alt="Driver" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">James Wilson</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>4.92 · 2,384 trips</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Toyota Camry · ABC 123</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Trip progress</span>
                      <span>ETA: {eta}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <p className="font-medium">Pickup</p>
                        <p className="text-sm text-muted-foreground">123 Main St, San Francisco, CA</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-2 w-2 rounded-full bg-destructive"></div>
                      </div>
                      <div>
                        <p className="font-medium">Destination</p>
                        <p className="text-sm text-muted-foreground">456 Market St, San Francisco, CA</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 pt-4">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Phone className="h-5 w-5" />
                      <span className="sr-only">Call driver</span>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <MessageSquare className="h-5 w-5" />
                      <span className="sr-only">Message driver</span>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button variant="outline" className="w-full">
                Cancel Ride
              </Button>
              <div className="text-xs text-center text-muted-foreground">You may be charged a cancellation fee</div>
            </CardFooter>
          </Card>

          {paymentStatus && (
            <Card className={`w-full mt-6 ${paymentStatus === "success" ? "border-green-500" : "border-red-500"}`}>
              <CardContent className="flex items-center gap-3 p-4">
                {paymentStatus === "success" ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium">Payment Successful</p>
                      <p className="text-sm text-muted-foreground">Your payment was processed successfully.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="font-medium">Payment Failed</p>
                      <p className="text-sm text-muted-foreground">
                        There was an issue with your payment. Please try again.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {progress >= 100 && (
        <Card className="w-full mt-6 border-green-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-500">Ride Completed</CardTitle>
            <CardDescription>You have arrived at your destination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Total Fare</p>
                <p className="text-2xl font-bold">$18.75</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Paid with</p>
                <p className="font-medium">•••• 4242</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="font-medium mb-2">Rate your trip</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button key={rating} variant="outline" size="icon" className="h-10 w-10">
                    <Star className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button className="w-full">Done</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
