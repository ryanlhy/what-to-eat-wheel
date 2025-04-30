export interface Restaurant {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    rating: number;
    priceRange: string;
    cuisine: string;
    location: string;
    openingHours: string;
    contact: string;
    website?: string;
    menuItems?: {
      name: string;
      description: string;
      price: number;
    }[];
    // Google Places API specific fields
    vicinity?: string;
    types?: string[];
    place_id?: string;
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