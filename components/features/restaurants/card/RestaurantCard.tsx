import { Restaurant } from '@/types/restaurant';
import { RestaurantImage } from './RestaurantImage';
import { RestaurantDetails } from './RestaurantDetails';

interface RestaurantCardProps {
    restaurant: Restaurant;
    userLocation: { lat: number; lng: number } | null;
    onImageClick: (photo: { getUrl: (options: { maxWidth: number; maxHeight: number }) => string }) => void;
    onCardClick: (restaurant: Restaurant) => void;
}

export const RestaurantCard = ({ restaurant, userLocation, onImageClick, onCardClick }: RestaurantCardProps) => {
    return (
        <div className="flex flex-col md:flex-row items-start pb-6 border-b border-gray-200 last:border-0 p-2 rounded-lg">
            <RestaurantImage
                photos={restaurant.photos}
                name={restaurant.name}
                onImageClick={onImageClick}
            />
            <div className="hidden md:block h-32 w-px bg-gray-200 mx-4" />
            <RestaurantDetails
                restaurant={restaurant}
                userLocation={userLocation}
                onCardClick={onCardClick}
            />
        </div>
    );
}; 