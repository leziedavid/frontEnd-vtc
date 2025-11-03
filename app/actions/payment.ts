"use server"

import { z } from "zod"
import Stripe from "stripe"

// Initialize Stripe (in a real app, use environment variables)
const stripe = new Stripe("sk_test_your_key_here", {
  apiVersion: "2023-10-16",
})

const paymentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default("usd"),
  description: z.string().optional(),
})

export async function createPaymentIntent(data: z.infer<typeof paymentSchema>) {
  try {
    const validatedData = paymentSchema.parse(data)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validatedData.amount * 100), // Convert to cents
      currency: validatedData.currency,
      description: validatedData.description,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return {
      success: false,
      error: "Failed to create payment intent",
    }
  }
}
