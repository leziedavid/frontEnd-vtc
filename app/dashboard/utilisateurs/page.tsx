'use client';

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useEffect, useState } from "react"
import { Role, User } from "@/types/interfaces"
import fakeUsers from "@/data/fakeUsersData"
import { Table } from "@/components/table/tables/table";
import { UserColumns } from "@/components/table/columns/tableColumns";
import Signup, { UserFormValues } from "@/components/home/Signup";
import { toast } from "sonner";
import {deleteUser, getPaginatedUsers } from "@/app/services/userServices";


export default function Page() {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10 // Nombre d’éléments par page
    const [totalItems, setTotalItems] = useState(0) //
    const [editValue, setEditValue] = useState<UserFormValues | undefined>(undefined);
    const [role, setRole] = useState<Role>(Role.DRIVER);
    const [isReady, setIsReady] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const storedRole = localStorage.getItem('role') as Role | null;
        if (storedRole && Object.values(Role).includes(storedRole)) {
            setRole(storedRole);
        }
        setIsReady(true);
    }, []);

    // 🔹 Récupération des véhicules existants
    const fetchUsers = async () => {
        try {
            const res = await getPaginatedUsers(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setUsers(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur serveur");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleSignup = async (formData: FormData) => {
        try {
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création de l’utilisateur');
            }
            toast.success('Utilisateur créé avec succès !');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Erreur lors de la création de l’utilisateur');
        }
    };

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleDelete = async (item: User) => {

        const res = await deleteUser(item.id);
        if (res.statusCode === 200) {
            toast.success( res.message || "Utilisateur supprimé avec succès");
            fetchUsers();
        }else {
            toast.error(res.message || "Erreur lors de la suppression de l’utilisateur");
        }
    }

    const handleUpdate = (user: User) => {
        console.log("✏️ Modifier utilisateur:", user);
        const normalizedImages: (string | File | null)[] = Array.isArray(user.images) ? user.images.map(img => typeof img === "string" ? img : (img as any)?.src ?? null) : [];

        // ✅ Tous les champs requis (pas de Partial)
        const editData: UserFormValues = {
            name: user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            password: "", // jamais exposé
            confirmPassword: "",
            images: normalizedImages,
        };

        // ✅ Injection dans ton formulaire
        setEditValue(editData);
        setDrawerOpen(true);
    };

    const handleDeleteMultiple = (user: User[]) => {
        console.log("🧹 Supprimer plusieurs:", user)
    }

    if (!isReady) return null;


    return (
        <DashboardLayout>

            <div className="p-6 lg:p-10 max-w-7xl mx-auto relative">
                <h1 className="text-3xl font-bold mb-6">Gestion des comptes</h1>
                {/* Bouton pour ouvrir le drawer */}

                <button onClick={() => { setDrawerOpen(true); setEditValue(undefined); }}
                    className="mb-4 bg-[#C89A7C] hover:bg-[#B07B5E] text-white px-4 py-2 rounded"  >
                    Ajouter un compte
                </button>

                <div className="w-full p-4">
                    <Table<User>
                        data={users.slice((currentPage - 1) * limit, currentPage * limit)}
                        columns={UserColumns()}
                        enableMultiple={true}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        onDeleteMultiple={handleDeleteMultiple}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={limit}
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                    />
                </div>
            </div>


            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)}></div>

                    {/* Drawer */}
                    <div className=" relative bg-white w-full sm:w-full md:w-2/3 lg:w-1/2 xl:w-2/5 h-full sm:h-3/4 md:h-full sm:rounded-t-lg md:rounded-l-lg overflow-auto  transform  animate-slide-in "  >
                        <div className="p-6 flex flex-col h-full">
                            <button className="mb-4 self-end text-gray-500 hover:text-gray-700" onClick={() => setDrawerOpen(false)} >
                                Fermer
                            </button>
                            <div className="flex-1 overflow-auto">
                                <Signup role={role} onSubmit={handleSignup} initialValue={editValue} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}
