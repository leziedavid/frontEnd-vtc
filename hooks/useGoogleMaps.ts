// /hooks/useGoogleMaps.ts
"use client";

import { loadGoogleMapsScript } from "@/app/services/googleMaps";
import { useEffect, useState } from "react";

export function useGoogleMaps() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        loadGoogleMapsScript()
            .then(() => {
                if (isMounted) setIsLoaded(true);
            })
            .catch((err) => {
                console.error("❌ Erreur Google Maps:", err);
                if (isMounted) setError(err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { isLoaded, error };
}
