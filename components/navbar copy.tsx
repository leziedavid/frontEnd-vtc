import Link from "next/link"
import { Car } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-orange-700/95 text-white backdrop-blur supports-[backdrop-filter]:bg-orange-700/90">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6" />
          <span>Covoitivoire</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm ml-6">
          <Link href="/ride" className="font-medium transition-colors hover:text-white">
            Déplacez-vous avec nous
          </Link>
          <Link href="/history" className="font-medium transition-colors hover:text-white">
            Historique des trajets
          </Link>
          <Link href="/aide-assistance" className="font-medium transition-colors hover:text-white">
            Aide et assistance
          </Link>
        </nav>
        <div className="flex items-center ml-auto gap-2">
          <MobileNav />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
