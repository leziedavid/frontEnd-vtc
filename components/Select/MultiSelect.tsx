'use client'

import { useState, useEffect } from "react";

export interface SelectOption {
    id: string | number;
    label: string;
}

interface SelectProps {
    data: SelectOption[];
    selected?: SelectOption | SelectOption[];
    multiple?: boolean;
    placeholder?: string;
    onChange?: (value: SelectOption | SelectOption[]) => void;
    resetSignal?: boolean; // reset depuis parent
    disabled?: boolean; // <-- ajouté
}

export const MultiSelect: React.FC<SelectProps> = ({
    data,
    selected,
    multiple = false,
    placeholder = "Sélectionnez...",
    onChange,
    resetSignal,
    disabled = false, // <-- ajouté
}) => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [selectedItems, setSelectedItems] = useState<SelectOption[]>(multiple ? [] : selected ? [selected as SelectOption] : []);

    const filteredData = data.filter(d => d.label.toLowerCase().includes(filter.toLowerCase()));

    const toggleSelect = (option: SelectOption) => {
        if (disabled) return; // <-- empêche la sélection si disabled

        if (multiple) {
            if (selectedItems.find(item => item.id === option.id)) {
                const newSel = selectedItems.filter(item => item.id !== option.id);
                setSelectedItems(newSel);
                onChange && onChange(newSel);
            } else {
                const newSel = [...selectedItems, option];
                setSelectedItems(newSel);
                onChange && onChange(newSel);
            }
        } else {
            setSelectedItems([option]);
            onChange && onChange(option);
            setOpen(false);
        }
    };

    const removeItem = (id: string | number) => {
        if (disabled) return; // <-- empêche suppression si disabled
        const newSel = selectedItems.filter(item => item.id !== id);
        setSelectedItems(newSel);
        onChange && onChange(newSel);
    }

    useEffect(() => {
        if (resetSignal) setSelectedItems([]);
    }, [resetSignal]);

    useEffect(() => {
        if (selected) {
            setSelectedItems(multiple ? (selected as SelectOption[]) : [selected as SelectOption]);
        }
    }, [selected, multiple]);

    return (
        <div className="relative w-full ">
            <div className={`border rounded p-2 flex items-center justify-between cursor-pointer bg-white ${disabled ? "opacity-50 pointer-events-none" : ""}`} onClick={() => setOpen(!open)} >
                <div className="flex flex-wrap gap-1">
                    {selectedItems.length > 0 ? (
                        selectedItems.map(item => (
                            <span key={item.id} className="bg-[#C89A7C] text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                                {item.label}
                                {/* Bouton de suppression */}
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="w-3 h-3 flex items-center justify-center rounded-full hover:bg-white hover:text-[#C89A7C]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2 h-2">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>
                <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {open && !disabled && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                    <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrer..." className="w-full p-2 border-b outline-none" />
                    {filteredData.length > 0 ? (
                        filteredData.map(option => {
                            const isSelected = selectedItems.some(item => item.id === option.id);
                            return (
                                <div key={option.id} onClick={() => toggleSelect(option)} className={`p-2 cursor-pointer hover:bg-[#F3E5D9] flex items-center justify-between ${isSelected ? "bg-[#C89A7C] text-white" : ""}`} >
                                    {option.label}
                                    {isSelected && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-2 text-gray-400">Aucun résultat</div>
                    )}
                </div>
            )}
        </div>
    );
};
