import { Restaurant } from '../../types';

interface RestaurantModalProps {
    restaurant: Restaurant | null;
    onClose: () => void;
}

const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
};

export const RestaurantModal = ({ restaurant, onClose }: RestaurantModalProps) => {
    if (!restaurant) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/80 rounded-full p-2"
                    onClick={onClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
                <p className="text-gray-700 mb-2">{restaurant.vicinity}</p>
                {restaurant.rating && (
                    <p className="mb-2">Rating: <span className="font-semibold">{restaurant.rating}</span></p>
                )}
                {restaurant.price_level && (
                    <p className="mb-2">Price: <span className="font-semibold">{getPriceLevel(restaurant.price_level)}</span></p>
                )}
                {restaurant.opening_hours?.weekday_text && (
                    <div className="mb-2">
                        <p className="font-semibold">Opening Hours:</p>
                        <ul className="text-sm text-gray-600">
                            {restaurant.opening_hours.weekday_text.map((line, idx) => (
                                <li key={idx}>{line}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex gap-4 mt-4">
                    <a
                        href={`https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        View on Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
}; 