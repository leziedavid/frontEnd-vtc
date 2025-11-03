'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { logout, isSessionStillValid, getUserInfos } from '@/app/middleware'
import { useRouter } from 'next/navigation'

// Texte multi-langues
const texts = {
  fr: {
    profile: "Profil",
    settings: "Paramètres",
    logout: "Se déconnecter",
    paymentMethods: "Méthodes de paiement",
    support: "Support",
    language: "Langue",
    french: "Français",
    english: "English",
  },
  en: {
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    paymentMethods: "Payment Methods",
    support: "Support",
    language: "Language",
    french: "Français",
    english: "English",
  },
}

export function UserNav({ lang, setLang }: { lang: 'fr' | 'en'; setLang: (l: 'fr' | 'en') => void }) {
  
  const router = useRouter();
  
  const [user, setUser] = useState<{
    name: string | null
    email: string
    imageUrl?: string | null } | null>(null)

  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const t = texts[lang]

  useEffect(() => {
    const fetchUser = async () => {
      const sessionValid = await isSessionStillValid()
      if (sessionValid) {
        const infos = await getUserInfos()
        if (infos) {
          setUser({
            name: infos.name,
            email: infos.id, // ou email si dispo
            imageUrl: infos.imageUrl,
          })
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])


  const handleLogout = () => {
    // Supprime le token
    localStorage.removeItem('access_token')
    // Appelle ta fonction logout si elle fait autre chose côté backend
    logout?.()
    // Redirige vers /auth/login
    router.push('/auth/login')
  }

  if (loading) return null

  // Si pas connecté
  if (!user) {
    return (
      <Button className='bg-gray-100 text-black hover:bg-gray-200 rounded-lg text-sm px-4 py-2' onClick={handleLogout} >
        Se connecter
      </Button>
    )
  }

  return (
    <div className="relative">
      <button  onClick={() => setIsOpen(!isOpen)}  className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition" >
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.imageUrl || "/placeholder-user.jpg"} alt={user.name || 'Utilisateur'} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <ChevronDown size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl z-50 overflow-hidden transition-transform transform origin-top">
            <div className="py-2 text-xs">
              <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-lime-50 transition">
                {t.profile}
              </Link>
              <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-lime-50 transition">
                {t.settings}
              </Link>
              <div className="border-t border-gray-200 my-2" />
              <button
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                onClick={logout}
              >
                {t.logout}
              </button>
              <div className="border-t border-gray-200 my-2" />
              <div className="px-4 py-2 text-gray-500 font-medium">{t.language}</div>
              <div className="flex flex-col px-4 space-y-1 pb-2">
                <button
                  onClick={() => setLang('fr')}
                  className={`text-left px-2 py-1 hover:bg-lime-50 rounded transition text-sm ${lang === 'fr' ? 'font-semibold' : ''}`}
                >
                  {t.french}
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`text-left px-2 py-1 hover:bg-lime-50 rounded transition text-sm ${lang === 'en' ? 'font-semibold' : ''}`}
                >
                  {t.english}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
