// components/Footer.tsx
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-black text-white  py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="relative w-32 h-10 sm:w-40 sm:h-12">
                                <Image src="/logoHome.png" alt="Ovoitivoire" fill className="object-contain" priority />
                            </div>
                        </Link>
                        <p className="text-gray-400">
                            Covoitivoire est une plateforme de covoiturage moderne qui connecte les voyageurs à travers toute la Côte d’Ivoire.
                            Notre mission est de rendre chaque déplacement plus simple, économique et agréable.
                            Que vous voyagiez pour le travail, les études ou le plaisir, nous vous offrons des trajets sécurisés et flexibles dans différents types de véhicules
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Services</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>VTC</li>
                            <li>Livraison</li>
                            <li>Courses interurbaines</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Suivez-nous</h4>
                        <div className="flex space-x-4">
                            <Facebook className="text-gray-400 hover:text-white cursor-pointer" />
                            <Twitter className="text-gray-400 hover:text-white cursor-pointer" />
                            <Instagram className="text-gray-400 hover:text-white cursor-pointer" />
                            <Linkedin className="text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Covoitivoire. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;