'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';
import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from './card/RestaurantCard';
import { ImageModal } from './modals/ImageModal';
import { RestaurantModal } from './modals/RestaurantModal';
import { createDummyRestaurantsWithPhotos } from '@/lib/constants/dummyRestaurants';
import { searchRestaurantsByCuisine } from '../wheel/restaurantSearch';

// Define libraries array outside component to prevent re-renders
const libraries: Libraries = ['places'];

// Helper functions for determining if a restaurant is open
const determineIfOpenNow = (currentOpeningHours: any): boolean => {
    if (!currentOpeningHours) {
        console.log("No opening hours data available");
        return false;
    }

    console.log('===== Raw Opening Hours Data =====', currentOpeningHours);

    // If the API directly provides this information
    if (typeof currentOpeningHours.openNow === 'boolean') {
        console.log(`API directly provided open_now: ${currentOpeningHours.openNow}`);
        return currentOpeningHours.openNow;
    }

    // Otherwise, we need to calculate it from the opening hours data
    try {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const currentTime = now.getHours() * 100 + now.getMinutes(); // Format: 1430 for 2:30 PM

        console.log(`Current time: ${now.getHours()}:${now.getMinutes()} (${currentTime}), Day: ${dayOfWeek}`);

        // Get today's hours from weekday descriptions
        const todayHours = currentOpeningHours.weekdayDescriptions?.[dayOfWeek];
        if (!todayHours) {
            console.log("No hours available for today");
            return false;
        }

        console.log(`Today's hours: ${todayHours}`);

        // Parse the hours string (format usually like "Monday: 9:00 AM – 10:00 PM")
        const hoursMatch = todayHours.split(': ')[1];

        // Handle "Closed" case
        if (hoursMatch === 'Closed') {
            console.log("Restaurant is closed today");
            return false;
        }

        console.log(`Hours: ${hoursMatch}`);

        // Parse opening hours ranges (handle multiple ranges like "9:00 AM – 2:00 PM, 5:00 PM – 10:00 PM")
        const timeRanges = hoursMatch.split(', ');

        console.log(`Found ${timeRanges.length} time ranges`);

        for (const range of timeRanges) {
            console.log(`Checking range: ${range}`);
            // Handle both en dash (–) and regular hyphen (-) that might appear in time ranges
            const parts = range.includes('–') ? range.split('–') : range.split('-');
            if (parts.length !== 2) {
                console.log(`Invalid range format: ${range}`);
                continue;
            }

            const start = parts[0].trim();
            const end = parts[1].trim();

            console.log(`Start time: "${start}", End time: "${end}"`);

            // Convert time strings to numeric format (e.g., "9:00 AM" -> 900, "10:00 PM" -> 2200)
            const startTime = convertTimeStringToNumber(start);
            const endTime = convertTimeStringToNumber(end);

            console.log(`Checking if current time ${currentTime} is between ${startTime} and ${endTime}`);

            // Check if current time is within this range
            if (isTimeInRange(currentTime, startTime, endTime)) {
                console.log("Restaurant is currently open!");
                return true;
            }
        }

        console.log("Restaurant is currently closed - not within any time range");
        return false;
    } catch (error) {
        console.error('Error parsing opening hours:', error);
        return false;
    }
};

const convertTimeStringToNumber = (timeString: string): number => {
    try {
        // For cases where the time doesn't have a meridiem specified
        if (!timeString.includes('AM') && !timeString.includes('PM')) {
            // Default to PM for times like "5:30" in "5:30 - 10:30 PM"
            if (timeString.includes(':')) {
                const [hourStr, minuteStr] = timeString.split(':');
                const hour = parseInt(hourStr, 10);
                const minutes = parseInt(minuteStr, 10);

                if (hour < 12) { // Assume PM for times without meridiem during evening hours
                    console.log(`Assuming PM for time without meridiem: ${timeString} → ${hour + 12}:${minutes}`);
                    return (hour + 12) * 100 + minutes;
                } else {
                    return hour * 100 + minutes;
                }
            }
            return 0;
        }

        // Normal handling for times with AM/PM
        if (timeString.includes(':')) {
            // Extract the time parts
            let hour, minutes;
            let isPM = false;

            if (timeString.includes('PM')) {
                isPM = true;
                const timePart = timeString.replace('PM', '').trim();
                const [hourStr, minuteStr] = timePart.split(':');
                hour = parseInt(hourStr, 10);
                minutes = parseInt(minuteStr, 10);
            } else { // AM
                const timePart = timeString.replace('AM', '').trim();
                const [hourStr, minuteStr] = timePart.split(':');
                hour = parseInt(hourStr, 10);
                minutes = parseInt(minuteStr, 10);
            }

            // Adjust for PM
            if (isPM && hour < 12) {
                hour += 12;
            }
            // Adjust for 12 AM
            if (!isPM && hour === 12) {
                hour = 0;
            }

            const result = hour * 100 + minutes;
            console.log(`Converted ${timeString} to ${hour}:${minutes} (${result})`);
            return result;
        }

        return 0;
    } catch (error) {
        console.error(`Error parsing time string: ${timeString}`, error);
        return 0;
    }
};

const isTimeInRange = (time: number, start: number, end: number): boolean => {
    // Handle invalid inputs
    if (isNaN(time) || isNaN(start) || isNaN(end)) {
        console.error(`Invalid time values: time=${time}, start=${start}, end=${end}`);
        return false;
    }

    // Afternoon hours where end appears numerically smaller than start
    // For example: 11:30 (1130) to 3:30 PM (1530)
    // But 1530 is stored as 330 if PM conversion fails
    if (start > 1000 && end < 1000) {
        // This is likely a PM time that wasn't converted properly
        // For afternoon hours (e.g., 11:30 AM to 3:30 PM), we should treat end as PM (1500+)
        const correctedEnd = end + 1200;
        console.log(`Correcting afternoon end time: ${end} → ${correctedEnd}`);

        const isOpen = time >= start && time <= correctedEnd;
        console.log(`Corrected afternoon hours: ${start}-${correctedEnd}, current=${time}, open=${isOpen}`);
        return isOpen;
    }

    // True overnight hours (e.g., 10:00 PM to 2:00 AM)
    // PM hours should be 2000+ and AM hours should be <1200
    if (start >= 2000 && end < 1200) {
        const isOpen = time >= start || time <= end;
        console.log(`Overnight hours: ${start}-${end}, current=${time}, open=${isOpen}`);
        return isOpen;
    }

    // Standard hours (e.g., 9:00 AM to 5:00 PM)
    const isOpen = time >= start && time <= end;
    console.log(`Standard hours: ${start}-${end}, current=${time}, open=${isOpen}`);
    return isOpen;
};

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
    prefetchedRestaurants?: Restaurant[];
    nextPageToken?: string;
    onNextPageTokenChange?: (token: string | undefined) => void;
}

export const NearbyRestaurants = ({
    cuisine,
    prefetchedRestaurants,
    nextPageToken,
    onNextPageTokenChange
}: NearbyRestaurantsProps) => {
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
    const [usingDummyData, setUsingDummyData] = useState(false);
    const [dummyDataReason, setDummyDataReason] = useState<'timeout' | 'no-location' | 'api-error' | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Local cache for restaurant details to reduce API calls
    const restaurantCache = useRef<Record<string, { data: Restaurant, timestamp: number }>>({});

    // Track previous search parameters to prevent redundant API calls
    const prevSearchParams = useRef<{ cuisine: string, lat?: number, lng?: number }>({ cuisine: '' });

    const itemsPerPage = 2; // Number of items to show initially and per "Load More" click

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries
    });

    // Function to load dummy restaurant data
    const loadDummyRestaurants = useCallback(() => {
        setIsLoading(true);
        try {
            const dummyData = createDummyRestaurantsWithPhotos();

            // Filter by cuisine if provided
            const filteredData = cuisine
                ? dummyData.filter(restaurant =>
                    restaurant.cuisine.toLowerCase() === cuisine.toLowerCase() ||
                    restaurant.types?.some(type => type.toLowerCase().includes(cuisine.toLowerCase())))
                : dummyData;

            setRestaurants(filteredData);
            setDisplayedRestaurants(filteredData.slice(0, itemsPerPage));
            setShowLoadMore(filteredData.length > itemsPerPage);
            setPage(1);
            setHasSearched(true);
            setUsingDummyData(true);
        } catch (err) {
            console.error('Error loading dummy data:', err);
            setError('Failed to load restaurant data.');
        } finally {
            setIsLoading(false);
        }
    }, [cuisine, itemsPerPage]);

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
                    console.error('Geolocation error:', error.message);
                    setError(null);
                    setDummyDataReason('timeout');
                    loadDummyRestaurants();
                },
                { timeout: 5000, maximumAge: 0 }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setDummyDataReason('no-location');
            loadDummyRestaurants();
        }
    }, [loadDummyRestaurants]);

    // Handle pagination - Load more results
    const loadMoreResults = useCallback(async () => {
        if (!userLocation || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            if (restaurants.length > displayedRestaurants.length) {
                // If we have more restaurants in memory, just show more of them
                const nextPage = page + 1;
                const endIndex = nextPage * itemsPerPage;
                setDisplayedRestaurants(restaurants.slice(0, endIndex));
                setPage(nextPage);
                setShowLoadMore(endIndex < restaurants.length || !!nextPageToken);
            } else if (nextPageToken) {
                // If we need to fetch more restaurants
                console.log('🔄 Loading more restaurants:', {
                    timestamp: new Date().toISOString(),
                    pageToken: nextPageToken
                });

                const result = await searchRestaurantsByCuisine(
                    cuisine,
                    userLocation,
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                    nextPageToken
                );

                const newRestaurants = [...restaurants, ...result.restaurants];
                setRestaurants(newRestaurants);
                setDisplayedRestaurants(newRestaurants);
                onNextPageTokenChange?.(result.nextPageToken);
                setShowLoadMore(!!result.nextPageToken);

                console.log('✨ More restaurants loaded:', {
                    timestamp: new Date().toISOString(),
                    newCount: result.restaurants.length,
                    totalCount: newRestaurants.length,
                    hasMorePages: !!result.nextPageToken
                });
            }
        } catch (error) {
            console.error('❌ Error loading more restaurants:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [
        userLocation,
        isLoadingMore,
        restaurants,
        displayedRestaurants,
        page,
        itemsPerPage,
        nextPageToken,
        cuisine,
        onNextPageTokenChange
    ]);

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
                weekday_text: data.currentOpeningHours?.weekdayDescriptions,
                open_now: determineIfOpenNow(data.currentOpeningHours)
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
        if (prefetchedRestaurants?.length) {
            console.log('📦 Using prefetched restaurants:', {
                count: prefetchedRestaurants.length,
                hasNextPage: !!nextPageToken,
                isLoading,
                isLoadingMore
            });
            setIsLoading(false);
            setRestaurants(prefetchedRestaurants);
            setDisplayedRestaurants(prefetchedRestaurants.slice(0, itemsPerPage));
            setShowLoadMore(prefetchedRestaurants.length > itemsPerPage || !!nextPageToken);
            setPage(1);
            setHasSearched(true);
            setUsingDummyData(false);
            return;
        }

        // Only proceed with search if we don't have prefetched data
        const searchRestaurants = async () => {
            // Skip if we've already searched with these exact parameters
            // or if we have prefetched data
            if (!shouldFetchNewData(cuisine, userLocation) || prefetchedRestaurants?.length) {
                return;
            }

            if (!isLoaded || !userLocation) return;

            setIsLoading(true);
            console.log('🔍 Starting restaurant search:', {
                cuisine,
                location: userLocation,
                isLoading: true,
                isLoadingMore
            });

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
                    console.log('===== Places API Text Search Response =====', textSearchData);
                    places = textSearchData.places || [];
                }

                // Process places directly without additional API calls
                const processedRestaurants = places.map((place: any) => {
                    const placeId = place.id;
                    const now = Date.now();

                    console.log('===== Raw Place Data =====', {
                        id: place.id,
                        name: place.displayName?.text,
                        formattedAddress: place.formattedAddress,
                        location: place.location,
                        rating: place.rating,
                        types: place.types,
                        priceLevel: place.priceLevel,
                        currentOpeningHours: place.currentOpeningHours
                    });

                    // Check if we have a valid cached entry
                    if (
                        restaurantCache.current[placeId] &&
                        now - restaurantCache.current[placeId].timestamp < CACHE_DURATION
                    ) {
                        return restaurantCache.current[placeId].data;
                    }

                    // Convert to Restaurant type using only the data from the search API
                    const restaurant = convertToRestaurant(place);

                    console.log('===== Processed Restaurant Object =====', restaurant);

                    // Cache the result
                    restaurantCache.current[placeId] = {
                        data: restaurant,
                        timestamp: now
                    };

                    return restaurant;
                });

                if (processedRestaurants.length === 0) {
                    // If no restaurants found from API, use dummy data
                    loadDummyRestaurants();
                    return;
                }

                setRestaurants(processedRestaurants);

                // Set first page of results
                setDisplayedRestaurants(processedRestaurants.slice(0, itemsPerPage));
                setShowLoadMore(processedRestaurants.length > itemsPerPage || !!nextPageToken);
                setPage(1);
                setHasSearched(true);
                setUsingDummyData(false);
            } catch (err) {
                console.error('Error in search:', err);
                setError(err instanceof Error ? err.message : 'Error finding restaurants');
                setDummyDataReason('api-error');
                loadDummyRestaurants();
            } finally {
                setIsLoading(false);
            }

            console.log('✅ Search completed:', {
                isLoading: false,
                isLoadingMore,
                showLoadMore,
                restaurantCount: restaurants.length
            });
        };

        if (userLocation && !prefetchedRestaurants?.length) {
            searchRestaurants();
        }
    }, [isLoaded, userLocation, cuisine, prefetchedRestaurants, nextPageToken, convertToRestaurant, shouldFetchNewData, itemsPerPage, loadDummyRestaurants]);

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

                    {/* Loading states */}
                    {isLoading && !isLoadingMore && (
                        <div className="text-center p-4">
                            <div className="animate-pulse">Finding nearby restaurants...</div>
                        </div>
                    )}

                    {/* Load More button */}
                    {showLoadMore && !isLoading && !isLoadingMore && (
                        <div className="text-center pt-4">
                            <button
                                onClick={loadMoreResults}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Load More Restaurants
                            </button>
                        </div>
                    )}

                    {/* Loading more state */}
                    {isLoadingMore && (
                        <div className="text-center p-4">
                            <div className="animate-pulse">Loading more restaurants...</div>
                        </div>
                    )}

                    {/* No results state */}
                    {!isLoading && !isLoadingMore && displayedRestaurants.length === 0 && (
                        <div className="text-center p-4 text-gray-500">
                            No restaurants found. Try a different cuisine or location.
                        </div>
                    )}
                </div>

                {usingDummyData && (
                    <div className="mt-6 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200">
                        <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="flex-1">
                                {dummyDataReason === 'timeout' ? (
                                    <>Location request timed out. You are viewing sample restaurant data.</>
                                ) : dummyDataReason === 'no-location' ? (
                                    <>Location services are not available. You are viewing sample restaurant data.</>
                                ) : dummyDataReason === 'api-error' ? (
                                    <>Unable to fetch nearby restaurants. You are viewing sample restaurant data.</>
                                ) : (
                                    <>You are viewing sample restaurant data.</>
                                )}{' '}
                                <button
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                () => window.location.reload(),
                                                (error) => alert('Please enable location services in your browser settings.')
                                            );
                                        } else {
                                            alert('Geolocation is not supported by this browser.');
                                        }
                                    }}
                                    className="text-blue-600 hover:text-blue-800 underline font-medium focus:outline-none"
                                >
                                    Click here
                                </button>
                                {' '}to enable location services and see restaurants near you.
                            </span>
                        </p>
                    </div>
                )}
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