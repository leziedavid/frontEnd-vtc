'use client'

import type React from "react"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

// Import de Poppins depuis Google Fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // tu peux ajuster les poids nécessaires
  variable: "--font-poppins"
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
