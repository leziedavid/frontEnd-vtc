// global.d.ts
declare module "react-google-autocomplete" {
    import * as React from "react";

    interface ReactGoogleAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
        apiKey: string;
        onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
        options?: {
            types?: string[];
            componentRestrictions?: google.maps.places.ComponentRestrictions;
            bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        };
        placeholder?: string;
        className?: string;
        ref?: React.Ref<HTMLInputElement>;
        value?: string;
    }

    const ReactGoogleAutocomplete: React.ComponentType<ReactGoogleAutocompleteProps>;
    export default ReactGoogleAutocomplete;
}
