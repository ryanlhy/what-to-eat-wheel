'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';
import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from './card/RestaurantCard';
import { ImageModal } from './modals/ImageModal';
import { RestaurantModal } from './modals/RestaurantModal';

// Define libraries array outside component to prevent re-renders
const libraries: Libraries = ['places'];

// Define fields that are considered "essential" (lower cost)
const ESSENTIAL_FIELDS = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.rating',
    'places.types',
    'places.priceLevel',
    // Include these fields to get everything we need in a single request
    'places.photos.name',
    'places.photos.widthPx',
    'places.photos.heightPx',
    'places.currentOpeningHours.weekdayDescriptions',
    'places.googleMapsUri'
];

// Define fields that may incur additional cost (Pro tier)
// We'll avoid using these fields directly to reduce costs
const ADDITIONAL_FIELDS = [
    'places.photos.authorAttributions',
    'places.websiteUri',
    'places.editorialSummary'
];

// Cache duration (24 hours in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface NearbyRestaurantsProps {
    cuisine: string;
}

export const NearbyRestaurants = ({ cuisine }: NearbyRestaurantsProps) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);

    // Local cache for restaurant details to reduce API calls
    const restaurantCache = useRef<Record<string, { data: Restaurant, timestamp: number }>>({});

    // Track previous search parameters to prevent redundant API calls
    const prevSearchParams = useRef<{ cuisine: string, lat?: number, lng?: number }>({ cuisine: '' });

    const itemsPerPage = 2; // Number of items to show initially and per "Load More" click

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    setError('Error getting location: ' + error.message);
                    setIsLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setIsLoading(false);
        }
    }, []);

    // Handle pagination - Load more results
    const loadMoreResults = useCallback(() => {
        const nextPage = page + 1;
        const endIndex = nextPage * itemsPerPage;

        setDisplayedRestaurants(restaurants.slice(0, endIndex));
        setPage(nextPage);
        setShowLoadMore(endIndex < restaurants.length);
    }, [page, restaurants, itemsPerPage]);

    // Memoized function to convert API data to Restaurant type
    const convertToRestaurant = useCallback((place: any, details?: any) => {
        // If we have separate details, use them, otherwise just use place data
        const data = details || place;

        // For photos, either use the photo data from details API or create minimal photo objects
        const photosWithGetUrl = data.photos?.map((photo: any) => ({
            getUrl: (options: { maxWidth: number; maxHeight: number }) =>
                `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}&maxHeightPx=${options.maxHeight}&maxWidthPx=${options.maxWidth}`
        })) || [];

        return {
            id: data.id || place.id,
            name: data.displayName?.text || place.displayName?.text || '',
            description: data.formattedAddress || place.formattedAddress || '',
            imageUrl: photosWithGetUrl[0]?.getUrl({ maxWidth: 400, maxHeight: 400 }) || '',
            rating: data.rating || place.rating || 0,
            priceRange: data.priceLevel ? '$'.repeat(data.priceLevel) : (place.priceLevel ? '$'.repeat(place.priceLevel) : ''),
            cuisine: (data.types?.[0] || place.types?.[0])?.replace(/_/g, ' ') || 'Restaurant',
            location: data.formattedAddress || place.formattedAddress || '',
            openingHours: data.currentOpeningHours?.weekdayDescriptions?.[new Date().getDay()] || '',
            contact: '',
            // Google Places API specific fields
            vicinity: data.formattedAddress || place.formattedAddress || '',
            types: data.types || place.types || [],
            place_id: data.id || place.id,
            photos: photosWithGetUrl,
            price_level: data.priceLevel || place.priceLevel,
            opening_hours: {
                weekday_text: data.currentOpeningHours?.weekdayDescriptions
            },
            geometry: {
                location: {
                    lat: (data.location?.latitude || place.location?.latitude || 0),
                    lng: (data.location?.longitude || place.location?.longitude || 0)
                }
            }
        } as Restaurant;
    }, []);

    // Check if we need to make a new API call based on changed parameters
    const shouldFetchNewData = useCallback((cuisine: string, userLocation: { lat: number; lng: number } | null) => {
        if (!userLocation) return false;

        const prevParams = prevSearchParams.current;
        const isSameCuisine = prevParams.cuisine === cuisine;
        const isSameLocation =
            prevParams.lat === userLocation.lat &&
            prevParams.lng === userLocation.lng;

        // If any parameter changed, we should fetch new data
        return !isSameCuisine || !isSameLocation || !hasSearched;
    }, [hasSearched]);

    useEffect(() => {
        const searchRestaurants = async () => {
            if (!isLoaded || !userLocation) return;

            // Skip if we've already searched with these exact parameters
            if (!shouldFetchNewData(cuisine, userLocation)) {
                return;
            }

            setIsLoading(true);

            // Update the previous search parameters
            prevSearchParams.current = {
                cuisine,
                lat: userLocation.lat,
                lng: userLocation.lng
            };

            try {
                let places: any[] = [];

                // Decide which fields to request based on what's needed initially
                // Request all essential fields in a single request
                const initialFieldMask = ESSENTIAL_FIELDS.join(',');

                // If cuisine is provided, use Text Search API instead of Nearby Search
                if (cuisine) {
                    // Use Text Search (New) API
                    const textSearchUrl = new URL('https://places.googleapis.com/v1/places:searchText');

                    // Build a specific query with cuisine type and "restaurant"
                    const queryText = cuisine.trim() ? `${cuisine} restaurant` : 'restaurant';

                    const textSearchBody = {
                        textQuery: queryText,
                        locationBias: {
                            circle: {
                                center: {
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng
                                },
                                radius: 5000
                            }
                        },
                        maxResultCount: 3, // Request more to enable pagination
                        languageCode: 'en'
                    };

                    const textSearchResponse = await fetch(textSearchUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                            'X-Goog-FieldMask': initialFieldMask
                        },
                        body: JSON.stringify(textSearchBody)
                    });

                    if (!textSearchResponse.ok) {
                        const errorText = await textSearchResponse.text();
                        throw new Error(`Error fetching restaurants: ${textSearchResponse.status} ${textSearchResponse.statusText} - ${errorText}`);
                    }

                    const textSearchData = await textSearchResponse.json();
                    places = textSearchData.places || [];
                } else {
                    // Use Nearby Search (New) API when no cuisine is provided
                    const nearbySearchUrl = new URL('https://places.googleapis.com/v1/places:searchNearby');

                    const nearbySearchBody = {
                        includedTypes: ['restaurant'],
                        locationRestriction: {
                            circle: {
                                center: {
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng
                                },
                                radius: 5000
                            }
                        },
                        rankPreference: 'DISTANCE',
                        maxResultCount: 10, // Request more to enable pagination
                        languageCode: 'en'
                    };

                    const nearbyResponse = await fetch(nearbySearchUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                            'X-Goog-FieldMask': initialFieldMask
                        },
                        body: JSON.stringify(nearbySearchBody)
                    });

                    if (!nearbyResponse.ok) {
                        const errorText = await nearbyResponse.text();
                        throw new Error(`Error fetching nearby restaurants: ${nearbyResponse.status} ${nearbyResponse.statusText} - ${errorText}`);
                    }

                    const nearbyData = await nearbyResponse.json();
                    places = nearbyData.places || [];
                }

                // Process places directly without additional API calls
                const processedRestaurants = places.map((place: any) => {
                    const placeId = place.id;
                    const now = Date.now();

                    // Check if we have a valid cached entry
                    if (
                        restaurantCache.current[placeId] &&
                        now - restaurantCache.current[placeId].timestamp < CACHE_DURATION
                    ) {
                        return restaurantCache.current[placeId].data;
                    }

                    // Convert to Restaurant type using only the data from the search API
                    const restaurant = convertToRestaurant(place);

                    // Cache the result
                    restaurantCache.current[placeId] = {
                        data: restaurant,
                        timestamp: now
                    };

                    return restaurant;
                });

                setRestaurants(processedRestaurants);

                // Set first page of results
                setDisplayedRestaurants(processedRestaurants.slice(0, itemsPerPage));
                setShowLoadMore(processedRestaurants.length > itemsPerPage);
                setPage(1);
                setHasSearched(true);
            } catch (err) {
                console.error('Error in search:', err);
                setError(err instanceof Error ? err.message : 'Error finding restaurants');
            } finally {
                setIsLoading(false);
            }
        };

        if (userLocation) {
            searchRestaurants();
        }
    }, [isLoaded, userLocation, cuisine, convertToRestaurant, shouldFetchNewData, itemsPerPage]);

    const handleImageClick = (photo: { getUrl: (options: { maxWidth: number; maxHeight: number }) => string }) => {
        const highResUrl = photo.getUrl({ maxWidth: 1200, maxHeight: 1200 });
        setSelectedImage(highResUrl);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    if (loadError) return (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            Error loading maps
        </div>
    );

    if (!isLoaded) return (
        <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
            Loading maps...
        </div>
    );

    if (isLoading && !hasSearched) return (
        <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
            Finding nearby restaurants...
        </div>
    );

    if (error) return (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            {error}
        </div>
    );

    return (
        <div className="w-full mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Nearby {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)} Restaurants
                </h3>

                <div className="space-y-6">
                    {displayedRestaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.place_id}
                            restaurant={restaurant}
                            userLocation={userLocation}
                            onImageClick={handleImageClick}
                            onCardClick={setSelectedRestaurant}
                        />
                    ))}

                    {isLoading && hasSearched && (
                        <div className="text-center p-4">
                            <div className="animate-pulse">Loading more restaurants...</div>
                        </div>
                    )}

                    {showLoadMore && !isLoading && (
                        <div className="text-center pt-4">
                            <button
                                onClick={loadMoreResults}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Load More
                            </button>
                        </div>
                    )}

                    {!isLoading && displayedRestaurants.length === 0 && (
                        <div className="text-center p-4 text-gray-500">
                            No restaurants found. Try a different cuisine or location.
                        </div>
                    )}
                </div>
            </div>

            <ImageModal
                imageUrl={selectedImage}
                onClose={handleCloseImage}
            />

            <RestaurantModal
                restaurant={selectedRestaurant}
                onClose={() => setSelectedRestaurant(null)}
            />
        </div>
    );
}; 