'use client'

import { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import Image from 'next/image';

interface Restaurant {
    name: string;
    vicinity: string;
    rating?: number;
    types: string[];
    place_id: string;
    photos?: google.maps.places.PlacePhoto[];
    price_level?: number;
    opening_hours?: {
        isOpen: (date?: Date) => boolean | undefined;
    };
}

interface NearbyRestaurantsProps {
    cuisine: string;
}

export const NearbyRestaurants = ({ cuisine }: NearbyRestaurantsProps) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

            const service = new google.maps.places.PlacesService(
                document.createElement('div')
            );

            const request = {
                location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                radius: 5000,
                type: 'restaurant',
                keyword: cuisine
            };

            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    // Get additional details for each restaurant
                    const detailedRestaurants = results.map(place => {
                        service.getDetails({ placeId: place.place_id as string, fields: ['photos', 'price_level', 'opening_hours'] },
                            (details, detailsStatus) => {
                                if (detailsStatus === google.maps.places.PlacesServiceStatus.OK) {
                                    const restaurant = restaurants.find(r => r.place_id === place.place_id);
                                    if (restaurant) {
                                        restaurant.photos = details?.photos;
                                        restaurant.price_level = details?.price_level;
                                        restaurant.opening_hours = details?.opening_hours;
                                    }
                                }
                            }
                        );
                        return place as Restaurant;
                    });
                    setRestaurants(detailedRestaurants);
                } else {
                    setError('Error finding nearby restaurants');
                }
                setIsLoading(false);
            });
        };

        if (userLocation) {
            searchNearbyRestaurants();
        }
    }, [isLoaded, userLocation, cuisine]);

    const getPriceLevel = (level?: number) => {
        if (!level) return '';
        return '$'.repeat(level);
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
                        <div
                            key={restaurant.place_id}
                            className="flex items-start gap-4 pb-6 border-b border-gray-200 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            {/* Restaurant Image */}
                            <div className="w-24 h-24 relative flex-shrink-0 rounded-lg overflow-hidden">
                                {restaurant.photos?.[0] ? (
                                    <Image
                                        src={restaurant.photos[0].getUrl({ maxWidth: 400 }) || ''}
                                        alt={restaurant.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Restaurant Details */}
                            <div className="flex-grow min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-medium text-base text-gray-900 truncate">
                                        {restaurant.name}
                                    </h4>
                                    {restaurant.opening_hours && (
                                        <span className={`text-sm flex-shrink-0 ${restaurant.opening_hours.isOpen() ? 'text-green-600' : 'text-red-600'}`}>
                                            {restaurant.opening_hours.isOpen() ? 'Open' : 'Closed'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    {restaurant.rating && (
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="text-gray-700">{restaurant.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    {restaurant.price_level && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">
                                                {getPriceLevel(restaurant.price_level)}
                                            </span>
                                        </>
                                    )}
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600 truncate">
                                        {restaurant.types[0]?.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mt-1 truncate">
                                    {restaurant.vicinity}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {restaurant.types?.slice(1, 3).map((type, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                        >
                                            {type.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 