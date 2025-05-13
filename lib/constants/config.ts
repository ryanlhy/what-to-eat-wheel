export const DEFAULT_LOCATION = {
    lat: 1.3063898620138694,
    lng: 103.79264781612267
} as const;

export const API_CONFIG = {
    WEATHER_ENABLED: true,
    DEFAULT_RADIUS_KM: 5
} as const;

// Type definitions
export interface Location {
    lat: number;
    lng: number;
} 

// default timeout for API calls
export const DEFAULT_TIMEOUT_API_FUNFACTS = 15000; // 15 seconds