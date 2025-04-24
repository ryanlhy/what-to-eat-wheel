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
    photos?: string[];
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
                                { placeId: place.place_id as string, fields: ['photos', 'price_level', 'opening_hours'] },
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
                            name: place.name || '',
                            vicinity: place.vicinity || '',
                            rating: place.rating,
                            types: place.types || [],
                            place_id: place.place_id as string,
                            photos: details.photos?.map(photo => {
                                console.log('Photo object:', photo);
                                try {
                                    const url = photo.getUrl({ maxWidth: 400 });
                                    console.log('Photo URL:', url);
                                    return url;
                                } catch (error) {
                                    console.error('Error getting photo URL:', error);
                                    return '';
                                }
                            }).filter(url => url !== '') || [],
                            price_level: details.price_level,
                            opening_hours: details.opening_hours
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
                            className="flex items-start pb-6 border-b border-gray-200 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            {/* Restaurant Details - 2/3 width */}
                            <div className="w-2/3 pr-4">
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

                            {/* Vertical Divider */}
                            <div className="h-32 w-px bg-gray-200 mx-4" />

                            {/* Restaurant Image - 1/3 width */}
                            <div className="w-1/3">
                                {restaurant.photos?.[0] && restaurant.photos[0].includes('PhotoService.GetPhoto') ? (
                                    <div className="w-full aspect-square relative rounded-lg overflow-hidden">
                                        <img
                                            src={restaurant.photos[0].replace(/&amp;/g, '&')}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.log('Image failed to load for restaurant:', restaurant.name);
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement?.classList.add('bg-gray-200');
                                                target.parentElement?.classList.add('flex');
                                                target.parentElement?.classList.add('items-center');
                                                target.parentElement?.classList.add('justify-center');
                                                const noImageText = document.createElement('span');
                                                noImageText.className = 'text-gray-400 text-sm';
                                                noImageText.textContent = 'No Image';
                                                target.parentElement?.appendChild(noImageText);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 