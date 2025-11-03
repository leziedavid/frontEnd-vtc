'use client'

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

export const ModelPagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPreviousPage,
    onNextPage,}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-4">
            <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                Page {currentPage} sur {totalPages}
            </div>

            <div className="flex justify-center sm:justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreviousPage}
                    disabled={currentPage <= 1}
                    className="text-xs sm:text-sm"
                >
                    <ChevronLeft className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Précédent</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={currentPage >= totalPages}
                    className="text-xs sm:text-sm"
                >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
            </div>
        </div>
    );
};
