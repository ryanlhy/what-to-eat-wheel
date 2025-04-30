'use client'

import { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from './card/RestaurantCard';
import { ImageModal } from './modals/ImageModal';
import { RestaurantModal } from './modals/RestaurantModal';

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
        libraries: ['places']
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
        const searchNearbyRestaurants = async () => {
            if (!isLoaded || !userLocation) return;

            const map = new google.maps.Map(document.createElement('div'));
            const service = new google.maps.places.PlacesService(map);

            const request = {
                location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                radius: 5000,
                type: 'restaurant',
                keyword: cuisine
            };

            try {
                const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
                    service.nearbySearch(request, (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                            resolve(results.slice(0, 10));
                        } else {
                            reject(new Error('Error finding nearby restaurants'));
                        }
                    });
                });

                const detailedRestaurants = await Promise.all(
                    results.map(async (place) => {
                        const details = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
                            service.getDetails(
                                {
                                    placeId: place.place_id as string,
                                    fields: [
                                        'photos',
                                        'price_level',
                                        'opening_hours',
                                        'formatted_address',
                                        'name',
                                        'rating',
                                        'types',
                                        'vicinity',
                                        'website',
                                        'url',
                                        'geometry'
                                    ]
                                },
                                (details, status) => {
                                    if (status === google.maps.places.PlacesServiceStatus.OK && details) {
                                        resolve(details);
                                    } else {
                                        reject(new Error('Error getting place details'));
                                    }
                                }
                            );
                        });

                        return {
                            id: place.place_id as string,
                            name: place.name || '',
                            description: place.vicinity || '',
                            imageUrl: details.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 400 }) || '',
                            rating: place.rating || 0,
                            priceRange: details.price_level ? '$'.repeat(details.price_level) : '',
                            cuisine: place.types?.[0]?.replace(/_/g, ' ') || 'Restaurant',
                            location: place.vicinity || '',
                            openingHours: details.opening_hours?.weekday_text?.[new Date().getDay()] || '',
                            contact: '',
                            // Google Places API specific fields
                            vicinity: place.vicinity || '',
                            types: place.types || [],
                            place_id: place.place_id as string,
                            photos: details.photos || [],
                            price_level: details.price_level,
                            opening_hours: details.opening_hours,
                            geometry: {
                                location: {
                                    lat: details.geometry?.location?.lat() || 0,
                                    lng: details.geometry?.location?.lng() || 0
                                }
                            }
                        } as Restaurant;
                    })
                );

                setRestaurants(detailedRestaurants);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error finding nearby restaurants');
            } finally {
                setIsLoading(false);
            }
        };

        if (userLocation) {
            searchNearbyRestaurants();
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