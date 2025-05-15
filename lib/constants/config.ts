export const DEFAULT_LOCATION = {
    lat: 1.3345140561175468,
    lng: 103.96036592310388
} as const; // expo location

export const API_CONFIG = {
    WEATHER_ENABLED: true,
    DEFAULT_RADIUS_KM: 5
} as const;

export const FALLBACK_WEATHER = {
    temperature: '28.3°C',
    condition: 'cloudy'
} as const;

// Type definitions
export interface Location {
    lat: number;
    lng: number;
} 

// default timeout for API calls
export const DEFAULT_TIMEOUT_API_FUNFACTS = 15000; // 15 seconds

export const DEFAULT_TIMEOUT_API_RESTAURANTS = 15000; // 10 seconds
