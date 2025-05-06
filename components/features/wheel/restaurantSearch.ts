import { Restaurant } from '@/types/restaurant';

const ESSENTIAL_FIELDS = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.rating',
    'places.types',
    'places.priceLevel',
    'places.photos.name',
    'places.photos.widthPx',
    'places.photos.heightPx',
    'places.currentOpeningHours.weekdayDescriptions',
    'places.googleMapsUri'
];

const determineIfOpenNow = (currentOpeningHours: any): boolean => {
    if (!currentOpeningHours) {
        return false;
    }

    if (typeof currentOpeningHours.openNow === 'boolean') {
        return currentOpeningHours.openNow;
    }

    try {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentTime = now.getHours() * 100 + now.getMinutes();

        const todayHours = currentOpeningHours.weekdayDescriptions?.[dayOfWeek];
        if (!todayHours) {
            return false;
        }

        const hoursMatch = todayHours.split(': ')[1];
        if (hoursMatch === 'Closed') {
            return false;
        }

        const timeRanges = hoursMatch.split(', ');
        for (const range of timeRanges) {
            const parts = range.includes('–') ? range.split('–') : range.split('-');
            if (parts.length !== 2) continue;

            const start = parts[0].trim();
            const end = parts[1].trim();
            const startTime = convertTimeStringToNumber(start);
            const endTime = convertTimeStringToNumber(end);

            if (isTimeInRange(currentTime, startTime, endTime)) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error parsing opening hours:', error);
        return false;
    }
};

const convertTimeStringToNumber = (timeString: string): number => {
    try {
        if (!timeString.includes('AM') && !timeString.includes('PM')) {
            if (timeString.includes(':')) {
                const [hourStr, minuteStr] = timeString.split(':');
                const hour = parseInt(hourStr, 10);
                const minutes = parseInt(minuteStr, 10);
                return hour < 12 ? (hour + 12) * 100 + minutes : hour * 100 + minutes;
            }
            return 0;
        }

        if (timeString.includes(':')) {
            let hour, minutes;
            let isPM = timeString.includes('PM');

            const timePart = timeString.replace(isPM ? 'PM' : 'AM', '').trim();
            const [hourStr, minuteStr] = timePart.split(':');
            hour = parseInt(hourStr, 10);
            minutes = parseInt(minuteStr, 10);

            if (isPM && hour < 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;

            return hour * 100 + minutes;
        }

        return 0;
    } catch (error) {
        console.error(`Error parsing time string: ${timeString}`, error);
        return 0;
    }
};

const isTimeInRange = (time: number, start: number, end: number): boolean => {
    if (isNaN(time) || isNaN(start) || isNaN(end)) {
        return false;
    }

    if (start > 1000 && end < 1000) {
        const correctedEnd = end + 1200;
        return time >= start && time <= correctedEnd;
    }

    if (start >= 2000 && end < 1200) {
        return time >= start || time <= end;
    }

    return time >= start && time <= end;
};

const convertToRestaurant = (place: any): Restaurant => {
    const photosWithGetUrl = place.photos?.map((photo: any) => ({
        getUrl: (options: { maxWidth: number; maxHeight: number }) =>
            `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}&maxHeightPx=${options.maxHeight}&maxWidthPx=${options.maxWidth}`
    })) || [];

    return {
        id: place.id,
        name: place.displayName?.text || '',
        description: place.formattedAddress || '',
        imageUrl: photosWithGetUrl[0]?.getUrl({ maxWidth: 400, maxHeight: 400 }) || '',
        rating: place.rating || 0,
        priceRange: place.priceLevel ? '$'.repeat(place.priceLevel) : '',
        cuisine: (place.types?.[0] || '').replace(/_/g, ' ') || 'Restaurant',
        location: place.formattedAddress || '',
        openingHours: place.currentOpeningHours?.weekdayDescriptions?.[new Date().getDay()] || '',
        contact: '',
        vicinity: place.formattedAddress || '',
        types: place.types || [],
        place_id: place.id,
        photos: photosWithGetUrl,
        price_level: place.priceLevel,
        opening_hours: {
            weekday_text: place.currentOpeningHours?.weekdayDescriptions,
            open_now: determineIfOpenNow(place.currentOpeningHours)
        },
        geometry: {
            location: {
                lat: place.location?.latitude || 0,
                lng: place.location?.longitude || 0
            }
        }
    };
};

export const searchRestaurantsByCuisine = async (
    cuisine: string,
    userLocation: { lat: number; lng: number },
    apiKey: string,
    pageToken?: string
): Promise<{ restaurants: Restaurant[]; nextPageToken?: string }> => {
    try {
        console.log('🔍 Starting Places API search:', {
            timestamp: new Date().toISOString(),
            cuisine,
            location: userLocation,
            pageToken: pageToken || 'initial'
        });

        const textSearchUrl = new URL('https://places.googleapis.com/v1/places:searchText');
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
            maxResultCount: 10,
            languageCode: 'en',
            ...(pageToken && { pageToken })
        };

        console.log('📤 Places API request:', {
            url: textSearchUrl.toString(),
            body: textSearchBody,
            fields: ESSENTIAL_FIELDS
        });

        const textSearchResponse = await fetch(textSearchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': [...ESSENTIAL_FIELDS, 'nextPageToken'].join(',')
            },
            body: JSON.stringify(textSearchBody)
        });

        if (!textSearchResponse.ok) {
            const errorText = await textSearchResponse.text();
            console.error('❌ Places API error:', {
                status: textSearchResponse.status,
                statusText: textSearchResponse.statusText,
                error: errorText
            });
            throw new Error(`Error fetching restaurants: ${textSearchResponse.status} - ${errorText}`);
        }

        const textSearchData = await textSearchResponse.json();
        console.log('📥 Places API response:', {
            timestamp: new Date().toISOString(),
            rawData: textSearchData,
            placeCount: textSearchData.places?.length || 0,
            hasNextPage: !!textSearchData.nextPageToken
        });

        const restaurants = textSearchData.places?.map((place: any) => {
            const restaurant = convertToRestaurant(place);
            console.log('🏪 Converted restaurant:', {
                name: restaurant.name,
                cuisine: restaurant.cuisine,
                location: restaurant.location,
                isOpen: restaurant.opening_hours?.open_now
            });
            return restaurant;
        }) || [];

        console.log('✅ Search completed:', {
            timestamp: new Date().toISOString(),
            restaurantCount: restaurants.length,
            nextPageAvailable: !!textSearchData.nextPageToken
        });

        return {
            restaurants,
            nextPageToken: textSearchData.nextPageToken
        };
    } catch (error) {
        console.error('❌ Search error:', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return { restaurants: [] };
    }
}; 