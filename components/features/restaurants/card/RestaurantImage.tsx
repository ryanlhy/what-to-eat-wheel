interface RestaurantImageProps {
    photos?: {
        getUrl: (options: { maxWidth: number; maxHeight: number }) => string;
    }[];
    name: string;
    onImageClick: (photo: { getUrl: (options: { maxWidth: number; maxHeight: number }) => string }) => void;
}

export const RestaurantImage = ({ photos, name, onImageClick }: RestaurantImageProps) => {
    return (
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
            {photos?.[0] ? (
                <div
                    className="w-full aspect-square relative rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => onImageClick(photos[0])}
                >
                    <img
                        src={photos[0].getUrl({ maxWidth: 400, maxHeight: 400 })}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.log('Image failed to load for restaurant:', name);
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
    );
}; 