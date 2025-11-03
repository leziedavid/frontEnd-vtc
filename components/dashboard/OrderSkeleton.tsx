import { ClipboardList } from "lucide-react";

export function OrderSkeleton() {
    return (
        <div className="rounded-lg bg-gray-50 animate-pulse">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    {/* Icône */}
                    <ClipboardList className="w-6 h-6 text-gray-300" />

                    <div>
                        <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-28 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
