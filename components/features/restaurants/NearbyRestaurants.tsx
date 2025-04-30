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
                            console.log('Nearby Search Results:', results);
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
                                        console.log('Place Details:', details);
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

                // Log opening hours data for debugging
                console.log('Opening Hours Data:', detailedRestaurants.map(restaurant => ({
                    name: restaurant.name,
                    opening_hours: restaurant.opening_hours,
                    isOpen: restaurant.opening_hours?.open_now
                })));

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

    const handleImageClick = (photo: { getUrl: (options: { maxWidth: number; maxHeight: number }) => string }) => {
        const highResUrl = photo.getUrl({ maxWidth: 1200, maxHeight: 1200 });
        setSelectedImage(highResUrl);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        // Convert to meters if less than 1km
        if (distance < 1) {
            return `${Math.round(distance * 1000)}m`;
        }
        return `${distance.toFixed(1)}km`;
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
                            className="flex flex-col md:flex-row items-start pb-6 border-b border-gray-200 last:border-0 p-2 rounded-lg"
                        >
                            {/* Restaurant Image - Full width on mobile, 1/4 on desktop */}
                            <div className="w-full md:w-1/4 mb-4 md:mb-0">
                                {restaurant.photos?.[0] ? (
                                    <div
                                        className="w-full aspect-square relative rounded-lg overflow-hidden cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageClick(restaurant.photos![0]);
                                        }}
                                    >
                                        <img
                                            src={restaurant.photos[0].getUrl({ maxWidth: 400, maxHeight: 400 })}
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

                            {/* Vertical Divider - Only show on desktop */}
                            <div className="hidden md:block h-32 w-px bg-gray-200 mx-4" />

                            {/* Restaurant Details - Full width on mobile, 3/4 on desktop */}
                            <div
                                className="w-full md:w-3/4 md:pl-4 cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded-lg"
                                onClick={() => setSelectedRestaurant(restaurant)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <h4
                                        className="font-medium text-base text-gray-900 hover:text-blue-600 transition-colors"
                                    >
                                        {restaurant.name}
                                    </h4>
                                    {restaurant.opening_hours && (
                                        <span className={`text-sm flex-shrink-0 ${restaurant.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                                            {restaurant.opening_hours.open_now ? 'Open' : 'Closed'}
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
                                    {userLocation && restaurant.geometry && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">
                                                {calculateDistance(
                                                    userLocation.lat,
                                                    userLocation.lng,
                                                    restaurant.geometry.location.lat,
                                                    restaurant.geometry.location.lng
                                                )}
                                            </span>
                                        </>
                                    )}
                                    <span className="text-gray-400"> • </span>
                                    <span className="text-gray-600">
                                        {restaurant.types[0]?.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mt-1">
                                    {restaurant.vicinity}
                                </p>

                                {restaurant.opening_hours?.weekday_text && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Hours:</span>
                                        <span className="text-sm text-gray-600">
                                            {restaurant.opening_hours.weekday_text[new Date().getDay()].split(': ')[1]}
                                        </span>
                                    </div>
                                )}
                                <div className="mt-4">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.name}&destination_place_id=${restaurant.place_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseImage}
                >
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={handleCloseImage}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Restaurant"
                            className="w-full h-auto rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {/* Restaurant Details Modal */}
            {selectedRestaurant && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedRestaurant(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/80 rounded-full p-2"
                            onClick={() => setSelectedRestaurant(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h2>
                        <p className="text-gray-700 mb-2">{selectedRestaurant.vicinity}</p>
                        {selectedRestaurant.rating && (
                            <p className="mb-2">Rating: <span className="font-semibold">{selectedRestaurant.rating}</span></p>
                        )}
                        {selectedRestaurant.price_level && (
                            <p className="mb-2">Price: <span className="font-semibold">{getPriceLevel(selectedRestaurant.price_level)}</span></p>
                        )}
                        {selectedRestaurant.opening_hours?.weekday_text && (
                            <div className="mb-2">
                                <p className="font-semibold">Opening Hours:</p>
                                <ul className="text-sm text-gray-600">
                                    {selectedRestaurant.opening_hours.weekday_text.map((line, idx) => (
                                        <li key={idx}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="flex gap-4 mt-4">
                            <a
                                href={`https://www.google.com/maps/place/?q=place_id:${selectedRestaurant.place_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                View on Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 