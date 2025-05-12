import { FoodWheel } from '@/components/features/wheel/FoodWheel'
import { DragonIcon } from '@/components/svg/DragonIcon'

export default function Home() {
    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center gap-4 mb-4 mt-10">
                    <DragonIcon className="w-12 h-12" />
                    <h1 className="text-4xl font-bold text-center">
                        What to Eat Wheel
                    </h1>
                    <DragonIcon className="w-12 h-12 transform scale-x-[-1]" />
                </div>
                <p className="text-xl text-gray-600 text-center mb-4">
                    Let the wheel decide your next meal in Singapore! 🍜
                </p>
                <FoodWheel />
            </div>
        </main>
    )
} 