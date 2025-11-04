'use client';

import { createUser } from '@/app/services/userServices';
import Signup from '@/components/home/Signup';
import { Navbar } from '@/components/navbar';
import { Role } from '@/types/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SignupPage() {
    const router = useRouter();

    const [role, setRole] = useState<Role>(Role.DRIVER);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem('role') as Role | null;
        if (storedRole && Object.values(Role).includes(storedRole)) {
            setRole(storedRole);

        } else {

            setRole(Role.USER);
        }
        setIsReady(true);
    }, []);

    const handleSignup = async (formData: FormData) => {
        try {

            const res = await createUser(formData);
            if (res.statusCode === 201) {
                toast.success(res.message || 'Utilisateur créé avec succès');
                router.push('/auth/login');
            } else {
                toast.error( res.message || 'Une erreur est survenue lors de la création de l’utilisateur');
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Erreur lors de la création de l’utilisateur');
        }
    };

    if (!isReady) return null;

    // Mapping rôle → message
    const roleMessages: Record<Role, { title: string; subtitle: string }> = {
        [Role.ADMIN]: {
            title: "Bienvenue, Administrateur !",
            subtitle: "Gérez vos utilisateurs et vos contenus facilement."
        },
        [Role.PARTENAIRE]: {
            title: "Devenez notre partenaire !",
            subtitle: "Collaborez et développez votre activité avec nous."
        },
        [Role.DRIVER]: {
            title: "Conduisez avec nous !",
            subtitle: "Gagnez de l’argent en effectuant des trajets."
        },
        [Role.USER]: {
            title: "Rejoignez notre communauté !",
            subtitle: "Profitez de nos services et restez connecté."
        }
    };

    const { title, subtitle } = roleMessages[role];

    return (
        <>

            <Navbar />
            <div className="flex flex-col min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col lg:flex-row flex-1">
                    {/* Colonne gauche avec image de fond */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/avatars/avatar.jpg')" }} >
                        <div className="bg-black bg-opacity-30 p-6 rounded text-white text-center">
                            <h2 className="text-2xl font-bold mb-2">{title}</h2>
                            <p>{subtitle}</p>
                        </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="w-full lg:w-1/2 p-6 bg-background flex items-center justify-center">
                        <Signup role={role} onSubmit={handleSignup} />
                    </div>
                </div>
            </div>
        </>
    );
}
