import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Globe, X, ChevronDown } from 'lucide-react';
import { UserNav } from './user-nav';

// Texte multi-langues
const texts = {
  fr: {
    menu: "Menu",
    profile: "Mon profil",
    settings: "Paramètres",
    logout: "Se déconnecter",
    language: "Langue",
    downloadApp: "Téléchargez l'application.",
    rides: "Déplacez-vous avec nous",
    cityToCity: "Trajets intercités",
    delivery: "Livraison",
    history: "Historique des trajets",
    help: "Aide et assistance",
  },
  en: {
    menu: "Menu",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    language: "Language",
    downloadApp: "Download the app",
    rides: "Ride with us",
    cityToCity: "City-to-city trips",
    delivery: "Delivery",
    history: "Ride history",
    help: "Help & Support",
  },
};

// Mobile Navigation Component
function MobileNav({ lang }: { lang: 'fr' | 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = texts[lang];

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 hover:text-gray-900">
        <Menu size={24} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white z-50 shadow-2xl overflow-y-auto transition-transform transform duration-300 ease-in-out">
            <div className="p-3 sm:p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold">{t.menu}</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-1 text-sm">
                <Link onClick={() => { localStorage.setItem('page', 'ride'); }} href="/ride" className="block px-2 py-2 text-gray-800 hover:bg-lime-50 rounded-md transition  font-bold">
                  {t.rides}
                </Link>
                <Link href="/history" className="block px-2 py-2 text-gray-800 hover:bg-lime-50 rounded-md transition  font-bold">
                  {t.history}
                </Link>
                <Link href="/aide-assistance" className="block px-2 py-2 text-gray-800 hover:bg-lime-50 rounded-md transition  font-bold">
                  {t.help}
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Navbar() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const t = texts[lang];

  return (
    <div className="bg-gradient-to-br from-lime-50 to-lime-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo avec Image Next.js */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-32 h-10 sm:w-40 sm:h-12">
                <Image src="/logo.png" alt="Ovoitivoire" fill className="object-contain" priority />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 mx-4 flex-1 text-sm">
              <Link href="/ride" onClick={() => { localStorage.setItem('page', 'ride'); }} className="text-gray-700 hover:text-gray-900  font-bold transition">
                {t.rides}
              </Link>
              <Link href="/history" className="text-gray-700 hover:text-gray-900  font-bold transition">
                {t.history}
              </Link>
              <Link href="/aide-assistance" className="text-gray-700 hover:text-gray-900  font-bold transition">
                {t.help}
              </Link>
            </nav>

            {/* Right Menu */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* <button className="hidden sm:block px-4 md:px-6 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-500 transition text-sm md:text-base"> {t.downloadApp}</button> */}
              <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="hidden md:flex items-center space-x-1 px-2 py-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-sm">
                <Globe size={18} />
                <span>{lang.toUpperCase()}</span>
              </button>
              <MobileNav lang={lang} />
              <UserNav lang={lang} setLang={setLang} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}