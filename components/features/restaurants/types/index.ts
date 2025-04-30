export interface Restaurant {
    name: string;
    vicinity: string;
    rating?: number;
    types: string[];
    place_id: string;
    photos?: {
        getUrl: (options: { maxWidth: number; maxHeight: number }) => string;
    }[];
    price_level?: number;
    opening_hours?: {
        open_now?: boolean;
        weekday_text?: string[];
    };
    geometry?: {
        location: {
            lat: number;
            lng: number;
        };
    };
} 