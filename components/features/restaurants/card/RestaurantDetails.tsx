import { Restaurant } from '../../types';

interface RestaurantDetailsProps {
    restaurant: Restaurant;
    userLocation: { lat: number; lng: number } | null;
    onCardClick: (restaurant: Restaurant) => void;
}

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

    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
};

const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
};

export const RestaurantDetails = ({ restaurant, userLocation, onCardClick }: RestaurantDetailsProps) => {
    return (
        <div
            className="w-full md:w-3/4 md:pl-4 cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded-lg"
            onClick={() => onCardClick(restaurant)}
        >
            <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-base text-gray-900 hover:text-blue-600 transition-colors">
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
    );
}; 