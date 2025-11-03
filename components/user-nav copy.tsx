'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreditCard, LifeBuoy, LogOut, Settings, User } from "lucide-react"
import { logout, isSessionStillValid, getUserInfos } from '@/app/middleware'

export function UserNav() {
  const [user, setUser] = useState<{
    name: string | null
    email: string
    imageUrl?: string | null} | null>(null)

  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const sessionValid = await isSessionStillValid()
      if (sessionValid) {
        const infos = await getUserInfos()
        if (infos) {
          setUser({
            name: infos.name,
            email: infos.id, // ou tu peux mettre autre chose comme email si dispo
            imageUrl: infos.imageUrl,
          })
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  if (loading) return null // ou un petit spinner

  // Si pas connecté
  if (!user) {
    return (
      <Button className='bg-gray-100 text-black hover:bg-gray-200 rounded-lg text-sm px-6 py-2' onClick={() => localStorage.removeItem('access_token')}>
        Se connecter
      </Button>
    )
  }

  // Menu utilisateur si connecté
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl || "/placeholder-user.jpg"} alt={user.name || 'Utilisateur'} />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'Utilisateur'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Méthodes de paiement</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
