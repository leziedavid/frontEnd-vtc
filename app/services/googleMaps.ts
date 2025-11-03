// /services/maps.ts
export function loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Évite l’exécution côté serveur
        if (typeof window === "undefined") return resolve();

        // Si déjà chargé, résout directement
        if (document.getElementById("google-maps-script")) {
            if (typeof google !== "undefined" && google.maps) {
                return resolve();
            } else {
                // Attend un court instant si le script est encore en chargement
                const checkInterval = setInterval(() => {
                    if (typeof google !== "undefined" && google.maps) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 200);
                return;
            }
        }

        // Crée et injecte le script
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            console.log("✅ Google Maps API chargée");
            resolve();
        };

        script.onerror = () => {
            console.error("❌ Échec du chargement de Google Maps API");
            reject(new Error("Erreur chargement Google Maps API"));
        };

        document.body.appendChild(script);
    });
}
