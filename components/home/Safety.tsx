'use client';

import { Shield, Mail, Phone, MapPin } from "lucide-react";

export function Safety() {
    const currentYear = new Date().getFullYear();

    return (

        <>
            {/* Main Content */}
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* City Rides Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                        <div className="relative h-40 md:h-48 bg-gradient-to-br from-lime-300 to-lime-400 p-6">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 200 150" className="w-full h-full">
                                    <path d="M40 80 L160 80 L150 100 L50 100 Z" fill="#000" opacity="0.8" />
                                    <ellipse cx="70" cy="100" rx="15" ry="15" fill="#000" />
                                    <ellipse cx="130" cy="100" rx="15" ry="15" fill="#000" />
                                    <circle cx="80" cy="60" r="20" fill="#000" />
                                    <rect x="70" y="75" width="20" height="25" fill="#000" rx="5" />
                                    <circle cx="120" cy="60" r="18" fill="#000" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-5 md:p-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Balades en ville</h2>
                            <p className="text-gray-600 mb-4 text-xs md:text-sm">Choisissez votre véhicule et obtenez une offre équitable</p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                                    Passagers
                                </button>
                                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                                    Conducteurs
                                </button>

                            </div>
                        </div>
                    </div>

                    {/* City to City Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                        <div className="relative h-40 md:h-48 bg-gradient-to-br from-lime-300 to-lime-400 p-6">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 200 150" className="w-full h-full">
                                    <path d="M60 60 L140 60 L140 40 L60 40 Z" fill="#000" opacity="0.8" />
                                    <path d="M60 60 L140 60 L150 100 L50 100 Z" fill="#000" opacity="0.8" />
                                    <ellipse cx="70" cy="100" rx="15" ry="15" fill="#000" />
                                    <ellipse cx="130" cy="100" rx="15" ry="15" fill="#000" />
                                    <circle cx="80" cy="80" r="15" fill="#000" />
                                    <rect x="72" y="90" width="16" height="20" fill="#000" rx="3" />
                                    <circle cx="120" cy="80" r="15" fill="#000" />
                                    <rect x="112" y="90" width="16" height="20" fill="#000" rx="3" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-5 md:p-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Balades en ville</h2>
                            <p className="text-gray-600 mb-4 text-xs md:text-sm">Trajets confortables vers d'autres villes</p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                                    Passagers
                                </button>
                                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                                    Conducteurs
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                        <div className="relative h-40 md:h-48 bg-gradient-to-br from-lime-300 to-lime-400 p-6">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 200 150" className="w-full h-full">
                                    <circle cx="100" cy="50" r="25" fill="#000" />
                                    <rect x="85" y="70" width="30" height="40" fill="#000" rx="5" />
                                    <rect x="90" y="80" width="20" height="30" fill="#fff" rx="3" />
                                    <rect x="92" y="82" width="16" height="24" fill="#000" rx="2" />
                                    <rect x="120" y="90" width="30" height="25" fill="#000" rx="3" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-5 md:p-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Livraison</h2>
                            <p className="text-gray-600 mb-4 text-xs md:text-sm">Services de livraison express *** Bientot disponible ***</p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                                    Clients
                                </button>
                                <button className="px-3 md:px-4 py-2 border-2 border-gray-900 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                                    Coursiers
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <section className="w-full bg-gray-100 text-white flex flex-col">

                {/* Section principale */}
                <div className="container px-4 md:px-6 py-8 md:py-10 lg:py-12 flex-1">
                    <div className="grid gap-4 lg:grid-cols-2 lg:gap-8 items-stretch">
                        {/* Colonne image */}
                        <div className="relative w-full rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/avatars/avatar.jpg')" }} />
                            <div className="absolute inset-0 bg-black/0" />
                        </div>

                        {/* Colonne texte */}
                        <div className="flex flex-col justify-center space-y-4 text-black">
                            {/* Icône en haut */}
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="h-6 w-6 text-black" />

                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    <span className="text-lime-400"> Sécurité </span> <span className="text-gray-900">avant tout</span>
                                </h2>
                            </div>

                            <p className="max-w-[600px] text-sm md:text-base">
                                Votre sécurité est notre priorité. Chaque course est suivie et tous les chauffeurs sont vérifiés.
                            </p>

                            <div className="flex flex-col gap-3">
                                {/* Vérifications */}
                                <div className="flex items-start gap-2">
                                    <Shield className="h-5 w-5 text-black mt-1" />
                                    <div>
                                        <h3 className="font-bold text-sm md:text-base">
                                            <span className="text-lime-400">Vérification</span> <span className="text-gray-900">des chauffeurs</span>
                                        </h3>
                                        <p className="text-xs md:text-sm">
                                            Tous les chauffeurs passent des vérifications approfondies
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Shield className="h-5 w-5 text-black mt-1" />
                                    <div>
                                        <h3 className="font-bold text-sm md:text-base">
                                            <span className="text-lime-400">Suivi</span> <span className="text-gray-900">du trajet</span>
                                        </h3>
                                        <p className="text-xs md:text-sm">
                                            Partagez les détails de votre trajet avec des contacts de confiance
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Shield className="h-5 w-5 text-black mt-1" />
                                    <div>
                                        <h3 className="font-bold text-sm md:text-base">
                                            <span className="text-lime-400">Assistance</span> <span className="text-gray-900"> 24/7</span>
                                        </h3>
                                        <p className="text-xs md:text-sm">
                                            L'aide est toujours disponible lorsque vous en avez besoin
                                        </p>
                                    </div>
                                </div>

                                {/* Contacts */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-black" />
                                        <span className="text-xs md:text-sm">contact@entreprise.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-black" />
                                        <span className="text-xs md:text-sm">+225 01 23 45 67 89</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-black" />
                                        <span className="text-xs md:text-sm">123 Rue Exemple, Abidjan, Côte d'Ivoire</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer minimaliste */}
                <footer className="w-full bg-black text-gray-300 py-3 text-center text-xs md:text-sm">
                    &copy; {currentYear} Covoitivoire.com, Tous droits réservés.
                </footer>

            </section>

        </>

    );
}
