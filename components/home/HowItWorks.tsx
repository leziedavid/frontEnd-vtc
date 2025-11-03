'use client';

import { Car, Clock, Star } from "lucide-react"

export function HowItWorks() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            <span className="text-lime-400"> Comment </span> <span className="text-gray-900"> ça fonctionne</span>
                        </h2>

                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Obtenez une course en quelques minutes. Ou devenez chauffeur et gagnez de l'argent selon votre emploi du temps.
                        </p>
                    </div>
                </div>

                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-white">
                            <Car className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Demander une course</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Choisissez votre point de départ et votre destination, puis demandez une course.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-white">
                            <Clock className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Être pris en charge</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Votre chauffeur arrivera en quelques minutes. Vous verrez ses informations et pourrez suivre son arrivée.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-white">
                            <Star className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Profiter de la course</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Détendez-vous. Le paiement est automatique via l'application lorsque vous atteignez votre destination.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
