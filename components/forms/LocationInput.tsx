'use client'

import { useRef } from "react";
import { MapPin } from "lucide-react";
import ReactGoogleAutocomplete from "react-google-autocomplete";

interface LocationInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onCoordinates?: (lat: number, lng: number) => void; // callback optionnel pour récupérer lat/lng
}

export function LocationInput({ value, onChange, placeholder, onCoordinates }: LocationInputProps) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <ReactGoogleAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                onPlaceSelected={(place) => {
                    if (place.formatted_address) onChange(place.formatted_address);

                    if (place.geometry?.location && onCoordinates) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        onCoordinates(lat, lng);
                    }
                }}
                options={{ types: ["geocode"] }}
                placeholder={placeholder}
                className="pl-9 w-full p-3 border border-slate-300 rounded outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                ref={ref}
            />
        </div>
    );
}
