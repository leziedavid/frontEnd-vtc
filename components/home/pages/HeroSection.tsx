"use client";
// components/HeroSection.tsx
import { ArrowRight, Smartphone, Shield, Award } from 'lucide-react';
import Link from "next/link"

const HeroSection = () => {
    return (
        <section className="relative bg-[url('/chauffeurvoiture.jpg')] bg-cover bg-center bg-no-repeat min-h-screen py-16 md:py-32 flex items-center">
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white">
                            Voyagez autrement avec
                            <span className="block text-lime-400 mt-1 md:mt-2">Covoitivoire.</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white max-w-2xl mx-auto lg:mx-0">
                            Profitez de trajets sécurisés, abordables et confortables à travers toute la Côte d’Ivoire.
                            Choisissez votre style : Économique, Standard ou Premium — et partez sereinement !
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                            {/* href="/ride" */}
                            <Link href="/ride">
                                <button onClick={() => { localStorage.setItem('page', 'ride')}}  className="bg-lime-400 text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold flex items-center justify-center hover:bg-orange-700 hover:text-white transition transform hover:scale-105 text-sm sm:text-base">
                                    Réserver une course
                                    <ArrowRight className="ml-2" size={18} />
                                </button>
                            </Link>
                            <Link href="/auth/signup" onClick={() => localStorage.setItem('role', 'PARTENAIRE')}>
                                <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-orange-700 hover:text-white transition transform hover:scale-105 text-sm sm:text-base">
                                    Devenir conducteur
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative mt-8 lg:mt-0">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20">
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="bg-lime-400/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                                        <Smartphone className="text-lime-400 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg md:text-lg text-white">Application intuitive</h3>
                                        <p className="text-white/80 mt-1 text-sm sm:text-base">Commandez un trajet en quelques clics</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="bg-lime-400/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                                        <Shield className="text-lime-400 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg md:text-lg text-white">Sécurité garantie</h3>
                                        <p className="text-white/80 mt-1 text-sm sm:text-base">Voyagez en toute tranquillité</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="bg-lime-400/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                                        <Award className="text-lime-400 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg md:text-lg text-white">Prix équitables</h3>
                                        <p className="text-white/80 mt-1 text-sm sm:text-base">Vous proposez, le conducteur accepte</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;