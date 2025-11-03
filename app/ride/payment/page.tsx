"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createPaymentIntent } from "@/app/actions/payment"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Load Stripe.js (use your publishable key from environment variables in real app)
const stripePromise = loadStripe("pk_test_your_key_here")

function CheckoutForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/ride/status",
        },
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "An error occurred")
      } else {
        // Payment succeeded
        onSuccess()
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      setErrorMessage("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {errorMessage && <div className="text-destructive text-sm mt-2">{errorMessage}</div>}

      <Button type="submit" className="w-full" disabled={!stripe || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  )
}

export default function PaymentPage() {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [amount] = useState(18.75) // In a real app, get this from previous page or context

  // Get a payment intent from the server
  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        const result = await createPaymentIntent({
          amount,
          currency: "usd",
          description: "Ride payment",
        })

        if (result.success && result.clientSecret) {
          setClientSecret(result.clientSecret)
        } else {
          console.error("Failed to create payment intent")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getPaymentIntent()
  }, [amount])

  const handlePaymentSuccess = () => {
    router.push("/ride/status")
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Complete your ride payment</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ride fare:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>

            <div className="pt-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "stripe" },
                  }}
                >
                  <CheckoutForm amount={amount} onSuccess={handlePaymentSuccess} />
                </Elements>
              ) : (
                <div className="text-center py-8 text-destructive">Failed to initialize payment. Please try again.</div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.back()}>
            Go Back
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>This is a test payment. No actual charges will be made.</p>
        <p className="mt-1">You can use the test card number: 4242 4242 4242 4242</p>
        <p className="mt-1">with any future expiration date and any CVC.</p>
      </div>
    </div>
  )
}
