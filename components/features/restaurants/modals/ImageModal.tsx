interface ImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
    if (!imageUrl) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img
                    src={imageUrl}
                    alt="Restaurant"
                    className="w-full h-auto rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}; 