'use client'

import { useState } from "react"
import { User } from "@/types/interfaces"
import fakeUsers from "@/data/fakeUsersData"
import { Table } from "../table/tables/table"
import { UserColumns } from "../table/columns/tableColumns"

export default function UsersTable() {
    
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 5 // Nombre d’éléments par page
    const totalItems = fakeUsers.length

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleDelete = (item: User) => {
        console.log("🗑️ Supprimer utilisateur:", item)
    }

    const handleUpdate = (user: User) => {
        console.log("✏️ Modifier utilisateur:", user)
    }

    const handleDeleteMultiple = (user: User[]) => {
        console.log("🧹 Supprimer plusieurs:", user)
    }

    return (
        <div className="w-full p-4">
            <Table<User>
                data={fakeUsers.slice((currentPage - 1) * limit, currentPage * limit)}
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
    )
}
