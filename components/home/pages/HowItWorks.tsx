// components/HowItWorks.tsx
import { MapPin, DollarSign, Car, Star } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: MapPin,
            title: "Entrez votre destination",
            description: "Choisissez où vous voulez aller"
        },
        {
            icon: DollarSign,
            title: "Proposez votre prix",
            description: "Fixez un prix équitable pour votre trajet"
        },
        {
            icon: Car,
            title: "Choisissez votre conducteur",
            description: "Sélectionnez parmi les conducteurs disponibles"
        },
        {
            icon: Star,
            title: "Évaluez votre trajet",
            description: "Donnez votre avis sur l'expérience"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Comment ça marche ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <step.icon className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;