'use client';

import { useState, useEffect } from "react";
import { Role, User } from "@/types/interfaces"
import { Table } from "@/components/table/tables/table";
import { DriversColumns } from "@/components/table/columns/tableColumns";
import SignupUsers, { UserFormValues } from "@/components/home/SignupUsers";
import { toast } from "sonner";
import { UserPen } from "lucide-react";
import { createUser, deleteUser, fetchAllDriversForPartnersPaginate, getDriversForMyPartners, updateUser } from "@/app/services/userServices";

interface DriversListeProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DriversListe({ isOpen, onClose }: DriversListeProps) {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 5 // Nombre d’éléments par page
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
            const res = await fetchAllDriversForPartnersPaginate(currentPage, limit);
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


    const handleSignupUsers = async (formData: FormData) => {
        try {

            // Récupère l'id
            const id = formData.get("id") as string | null;
            let res;

            if (id) {
                formData.delete("id");

                res = await updateUser(id, formData);
                res.statusCode === 200
                    ? (toast.success(res.message || "Utilisateur ajouté !"), setDrawerOpen(false), fetchUsers())
                    : toast.error(res.message || "Erreur lors de la création de l'utilisateur");

            } else {
                res = await createUser(formData);
                res.statusCode === 201
                    ? (toast.success(res.message || "Utilisateur ajouté !"), setDrawerOpen(false), fetchUsers())
                    : toast.error(res.message || "Erreur lors de la création de l'utilisateur");

            }

        } catch (err: any) {
            fetchUsers();
            toast.error(err.message || 'Erreur lors de la création de l’utilisateur');
        }
    };

    if (!isReady) return null;

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleDelete = async (item: User) => {

        const res = await deleteUser(item.id);
        if (res.statusCode === 200) {
            toast.success(res.message || "Utilisateur supprimé avec succès");
            fetchUsers();
        } else {
            toast.error(res.message || "Erreur lors de la suppression de l’utilisateur");
        }
    }

    const handleUpdate = (user: User) => {
        console.log("✏️ Modifier utilisateur:", user);
        const normalizedImages: (string | File | null)[] = Array.isArray(user.images) ? user.images.map(img => typeof img === "string" ? img : (img as any)?.src ?? null) : [];

        // ✅ Tous les champs requis (pas de Partial)
        const editData: UserFormValues = {
            id: user.id,
            name: user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            // password: "", // jamais exposé
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

    return (
        <>
            <div className="p-6 lg:p-10 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Mes chauffeur</h1>

                <button onClick={() => { setDrawerOpen(true); setEditValue(undefined); }} className="mb-4 bg-[#C89A7C] hover:bg-[#B07B5E] text-white px-4 py-2 rounded" >
                    <UserPen className="w-4 h-4 text-gray-600" />
                </button>

                <div className="w-full flex-1 p-4 overflow-auto">
                    <div className="w-full min-w-full">
                        <Table<User>
                            data={users.slice((currentPage - 1) * limit, currentPage * limit)}
                            columns={DriversColumns()}
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
            </div>



            {drawerOpen && (


                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} ></div>

                    {/* Modal central plus grand */}
                    <div className="relative bg-white w-11/12 md:w-4/5 lg:w-3/4 h-5/6 rounded-lg overflow-auto transform animate-slide-in">
                        <div className="p-6 flex flex-col h-full">
                            <button className="mb-4 self-end text-gray-500 hover:text-gray-700" onClick={() => setDrawerOpen(false)}  >
                                Fermer
                            </button>

                            <div className="flex-1 overflow-auto">
                                <SignupUsers role={role} onSubmit={handleSignupUsers} initialValue={editValue} />
                            </div>
                        </div>
                    </div>
                </div>

            )}

        </>
    );
}
