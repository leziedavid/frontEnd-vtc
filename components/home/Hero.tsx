
'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
    return (
        <section className="relative w-full py-20 md:py-32 lg:py-40 min-h-[80vh]">
            {/* Image de fond */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/chauffeurvoiture.jpg"
                    alt="Chauffeur avec voiture"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="flex flex-col justify-center space-y-4 text-white">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                Votre course, à la demande
                            </h1>
                            <p className="max-w-[600px] md:text-xl text-gray-200">
                                Demandez une course et faites-vous récupérer par un chauffeur proche. Pas d'attente, pas de tracas.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link href="/ride">
                                <Button onClick={() => { localStorage.setItem('page', 'ride'); }} size="lg" className="bg-lime-400 text-white font-bold hover:bg-orange-700 hover:text-white">
                                    Réserver une course
                                </Button>
                            </Link>
                            <Link href="/auth/signup" onClick={() => localStorage.setItem('role', 'PARTENAIRE')}>
                                <Button  size="lg" variant="outline"  className="border-white  font-bold text-black hover:bg-orange-700 hover:text-white"  >
                                    S'inscrire pour conduire
                                </Button>
                            </Link>

                        </div>
                    </div>

                    {/* Image secondaire (si besoin) */}
                    {/* <div className="mx-auto lg:ml-auto hidden lg:block">
                        <div className="aspect-video overflow-hidden rounded-xl bg-gray-900 p-2">
                            <Image
                                src="/placeholder.svg?height=500&width=800"
                                alt="Interface de l'application de taxi"
                                width={800}
                                height={500}
                                className="mx-auto aspect-video overflow-hidden rounded-lg object-cover"
                            />
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    )
}
