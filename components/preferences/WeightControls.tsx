import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { FOOD_SECTIONS } from '@/lib/constants/foodData';

interface WeightControlsProps {
    weights: Record<string, number>;
    onWeightChange: (category: string, weight: number) => void;
}

export const WeightControls = ({ weights, onWeightChange }: WeightControlsProps) => {
    const handleWeightChange = (category: string, increment: boolean) => {
        const currentWeight = weights[category];
        const newWeight = increment
            ? Math.min(currentWeight + 1, 5)  // Maximum weight is 5
            : Math.max(currentWeight - 1, 1); // Minimum weight is 1
        onWeightChange(category, newWeight);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {FOOD_SECTIONS.map((section) => (
                <div
                    key={section.category}
                    className="flex items-center justify-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-1 md:gap-2 max-w-[280px] w-full">
                        <div className={`w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-${section.category} shrink-0`} />
                        <button
                            onClick={() => handleWeightChange(section.category, false)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-30 weight-control-button shrink-0"
                            disabled={weights[section.category] <= 1}
                        >
                            <MinusIcon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                        </button>
                        <button
                            onClick={() => handleWeightChange(section.category, true)}
                            className="flex-1 min-w-0 px-2 py-0.5 md:py-1 rounded-lg hover:bg-gray-100 transition-colors text-center weight-control-button disabled:opacity-30"
                            disabled={weights[section.category] >= 5}
                        >
                            <span className="font-medium text-sm md:text-base truncate block">{section.label}</span>
                            <span className="ml-1.5 md:ml-2 text-xs md:text-sm text-gray-600">
                                {weights[section.category]}x
                            </span>
                        </button>
                        <button
                            onClick={() => handleWeightChange(section.category, true)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-30 weight-control-button shrink-0"
                            disabled={weights[section.category] >= 5}
                        >
                            <PlusIcon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                        </button>
                    </div>
                </div>
            ))}
            <div className="col-span-full text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
                Click on a cuisine name or the + button to increase its weight, and the - button to decrease.
                Higher weights (up to 5x) mean the cuisine is more likely to be chosen.
            </div>
        </div>
    );
}; 