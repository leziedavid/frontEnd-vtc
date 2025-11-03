"use client";
// components/AppDownload.tsx
import { Apple, Store, QrCode } from 'lucide-react';
import Image from 'next/image';

const AppDownload = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl text-lime-400 font-bold mb-6">
                            Téléchargez l'application inDrive
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Disponible sur iOS et Android. Commandez un trajet en quelques secondes,
                            où que vous soyez.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button className="bg-lime-400 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition">
                                <Apple className="mr-2" size={20} />
                                App Store
                            </button>
                            <button className="bg-lime-400 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition">
                                <Store className="mr-2" size={20} />
                                Google Play
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <QrCode size={80} className="text-gray-600" />
                            <p className="text-gray-600">Scannez le code QR pour télécharger</p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-80 h-96 bg-[url('/chauffeurTaxi.jpg')] bg-cover rounded-3xl shadow-2xl transform rotate-3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownload;