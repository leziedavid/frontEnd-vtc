import React, { useState } from 'react';
import { Menu, Globe, X, ChevronDown } from 'lucide-react';

// Menu Navigation Component
function MenuNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Dropdown */}
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
            <nav className="py-2">
              <a
                href="/rides"
                className="block px-6 py-3 text-gray-800 hover:bg-lime-50 transition font-medium"
              >
                Déplacez-vous avec nous
              </a>
              <a
                href="/city-to-city"
                className="block px-6 py-3 text-gray-800 hover:bg-lime-50 transition font-medium"
              >
                Trajets intercités
              </a>
              <a
                href="/delivery"
                className="block px-6 py-3 text-gray-800 hover:bg-lime-50 transition font-medium"
              >
                Livraison
              </a>
              <div className="border-t border-gray-200 my-2" />
              <a
                href="/history"
                className="block px-6 py-3 text-gray-800 hover:bg-lime-50 transition font-medium"
              >
                Historique des trajets
              </a>
              <a
                href="/aide-assistance"
                className="block px-6 py-3 text-gray-800 hover:bg-lime-50 transition font-medium"
              >
                Aide et assistance
              </a>
              <div className="border-t border-gray-200 my-2" />
              <a
                href="/driver"
                className="block px-6 py-3 text-gray-800 hover:bg-lime-50 transition font-medium"
              >
                Devenir conducteur
              </a>
              <a
                href="/business"
                className="block px-6 py-3 text-gray-800 hover:bg-lime-50 transition font-medium"
              >
                Pour les entreprises
              </a>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

// User Navigation Component
function UserNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
          U
        </div>
        <ChevronDown size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="py-2">
              <a href="/profile" className="block px-4 py-3 text-gray-800 hover:bg-lime-50 transition">
                Mon profil
              </a>
              <a href="/settings" className="block px-4 py-3 text-gray-800 hover:bg-lime-50 transition">
                Paramètres
              </a>
              <div className="border-t border-gray-200 my-2" />
              <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition">
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Mobile Navigation Component
function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-gray-900"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-1">
                <a href="/rides" className="block px-4 py-3 text-gray-800 hover:bg-lime-50 rounded-lg transition font-medium">
                  Déplacez-vous avec nous
                </a>
                <a href="/city-to-city" className="block px-4 py-3 text-gray-800 hover:bg-lime-50 rounded-lg transition font-medium">
                  Trajets intercités
                </a>
                <a href="/delivery" className="block px-4 py-3 text-gray-800 hover:bg-lime-50 rounded-lg transition font-medium">
                  Livraison
                </a>
                <a href="/history" className="block px-4 py-3 text-gray-800 hover:bg-lime-50 rounded-lg transition font-medium">
                  Historique des trajets
                </a>
                <a href="/aide-assistance" className="block px-4 py-3 text-gray-800 hover:bg-lime-50 rounded-lg transition font-medium">
                  Aide et assistance
                </a>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function InDriveInterface() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-lime-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">iD</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">inDrive</span>
            </a>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-6 mx-8 flex-1">
              <a href="/rides" className="text-gray-700 hover:text-gray-900 font-medium transition">
                Trajets en ville
              </a>
              <a href="/city-to-city" className="text-gray-700 hover:text-gray-900 font-medium transition">
                Intercités
              </a>
              <a href="/delivery" className="text-gray-700 hover:text-gray-900 font-medium transition">
                Livraison
              </a>
            </nav>

            {/* Right Menu */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="hidden sm:block px-4 md:px-6 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-500 transition text-sm md:text-base">
                Download the app
              </button>
              <button className="hidden md:flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <Globe size={20} />
                <span>En</span>
              </button>
              <MobileNav />
              <MenuNav />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* City Rides Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="relative h-40 md:h-48 bg-gradient-to-br from-lime-300 to-lime-400 p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-full h-full">
                  <path d="M40 80 L160 80 L150 100 L50 100 Z" fill="#000" opacity="0.8"/>
                  <ellipse cx="70" cy="100" rx="15" ry="15" fill="#000"/>
                  <ellipse cx="130" cy="100" rx="15" ry="15" fill="#000"/>
                  <circle cx="80" cy="60" r="20" fill="#000"/>
                  <rect x="70" y="75" width="20" height="25" fill="#000" rx="5"/>
                  <circle cx="120" cy="60" r="18" fill="#000"/>
                </svg>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">City rides</h2>
              <p className="text-gray-600 mb-4 text-xs md:text-sm">Choose your ride, get a fair deal</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                  Passengers
                </button>
                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                  Drivers
                </button>
              </div>
            </div>
          </div>

          {/* City to City Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="relative h-40 md:h-48 bg-gradient-to-br from-lime-300 to-lime-400 p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-full h-full">
                  <path d="M60 60 L140 60 L140 40 L60 40 Z" fill="#000" opacity="0.8"/>
                  <path d="M60 60 L140 60 L150 100 L50 100 Z" fill="#000" opacity="0.8"/>
                  <ellipse cx="70" cy="100" rx="15" ry="15" fill="#000"/>
                  <ellipse cx="130" cy="100" rx="15" ry="15" fill="#000"/>
                  <circle cx="80" cy="80" r="15" fill="#000"/>
                  <rect x="72" y="90" width="16" height="20" fill="#000" rx="3"/>
                  <circle cx="120" cy="80" r="15" fill="#000"/>
                  <rect x="112" y="90" width="16" height="20" fill="#000" rx="3"/>
                </svg>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">City to City</h2>
              <p className="text-gray-600 mb-4 text-xs md:text-sm">Comfortable rides to other cities</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                  Passengers
                </button>
                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                  Drivers
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="relative h-40 md:h-48 bg-gradient-to-br from-lime-300 to-lime-400 p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-full h-full">
                  <circle cx="100" cy="50" r="25" fill="#000"/>
                  <rect x="85" y="70" width="30" height="40" fill="#000" rx="5"/>
                  <rect x="90" y="80" width="20" height="30" fill="#fff" rx="3"/>
                  <rect x="92" y="82" width="16" height="24" fill="#000" rx="2"/>
                  <rect x="120" y="90" width="30" height="25" fill="#000" rx="3"/>
                </svg>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Delivery</h2>
              <p className="text-gray-600 mb-4 text-xs md:text-sm">Express delivery services</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                  Clients
                </button>
                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                  Couriers
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}