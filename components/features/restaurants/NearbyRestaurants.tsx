'use client'

import { useState, useEffect } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';
import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from './card/RestaurantCard';
import { ImageModal } from './modals/ImageModal';
import { RestaurantModal } from './modals/RestaurantModal';

// Define libraries array outside component to prevent re-renders
const libraries: Libraries = ['places'];

interface NearbyRestaurantsProps {
    cuisine: string;
}

export const NearbyRestaurants = ({ cuisine }: NearbyRestaurantsProps) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

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

    useEffect(() => {
        const searchRestaurants = async () => {
            if (!isLoaded || !userLocation) return;

            try {
                let places: any[] = [];
                console.log(`Searching for: ${cuisine ? `${cuisine} restaurants` : 'nearby restaurants'}`);

                // If cuisine is provided, use Text Search API instead of Nearby Search
                if (cuisine) {
                    // Use Text Search (New) API
                    const textSearchUrl = new URL('https://places.googleapis.com/v1/places:searchText');

                    // Build a more specific query with cuisine type and "restaurant"
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
                        // Note: Text Search API doesn't support includedTypes parameter
                        // We include "restaurant" directly in the textQuery instead
                        maxResultCount: 5,
                        languageCode: 'en'
                    };

                    console.log('Text Search Request:', JSON.stringify(textSearchBody));

                    const textSearchResponse = await fetch(textSearchUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                            'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress,places.rating,places.priceLevel,places.types'
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
                        maxResultCount: 10,
                        languageCode: 'en'
                    };

                    console.log('Nearby Search Request:', JSON.stringify(nearbySearchBody));

                    const nearbyResponse = await fetch(nearbySearchUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                            'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress,places.rating,places.priceLevel,places.types'
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

                console.log(`Found ${places.length} places`);

                // Step 2: Fetch detailed information for each place
                const detailedRestaurants = await Promise.all(
                    places.map(async (place: any) => {
                        // Use Place Details (New) API
                        const detailsUrl = new URL(`https://places.googleapis.com/v1/places/${place.id}`);

                        const detailsResponse = await fetch(detailsUrl, {
                            method: 'GET',
                            headers: {
                                'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                                'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,photos,priceLevel,rating,types,websiteUri,googleMapsUri,currentOpeningHours'
                            }
                        });

                        if (!detailsResponse.ok) {
                            throw new Error(`Error fetching place details: ${detailsResponse.statusText}`);
                        }

                        const details = await detailsResponse.json();

                        // Create a photo accessor function that mimics the legacy API
                        const photosWithGetUrl = details.photos?.map((photo: any) => ({
                            getUrl: (options: { maxWidth: number; maxHeight: number }) =>
                                `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}&maxHeightPx=${options.maxHeight}&maxWidthPx=${options.maxWidth}`
                        })) || [];

                        // Convert the new API format to match your existing Restaurant type
                        return {
                            id: details.id,
                            name: details.displayName?.text || '',
                            description: details.formattedAddress || '',
                            imageUrl: photosWithGetUrl[0]?.getUrl({ maxWidth: 400, maxHeight: 400 }) || '',
                            rating: details.rating || 0,
                            priceRange: details.priceLevel ? '$'.repeat(details.priceLevel) : '',
                            cuisine: details.types?.[0]?.replace(/_/g, ' ') || 'Restaurant',
                            location: details.formattedAddress || '',
                            openingHours: details.currentOpeningHours?.weekdayDescriptions?.[new Date().getDay()] || '',
                            contact: '',
                            // Google Places API specific fields
                            vicinity: details.formattedAddress || '',
                            types: details.types || [],
                            place_id: details.id,
                            photos: photosWithGetUrl,
                            price_level: details.priceLevel,
                            opening_hours: {
                                weekday_text: details.currentOpeningHours?.weekdayDescriptions
                            },
                            geometry: {
                                location: {
                                    lat: details.location?.latitude || 0,
                                    lng: details.location?.longitude || 0
                                }
                            }
                        } as Restaurant;
                    })
                );

                setRestaurants(detailedRestaurants);
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
    }, [isLoaded, userLocation, cuisine]);

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

    if (isLoading) return (
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
                    {restaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.place_id}
                            restaurant={restaurant}
                            userLocation={userLocation}
                            onImageClick={handleImageClick}
                            onCardClick={setSelectedRestaurant}
                        />
                    ))}
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