import { FoodWheel } from '@/components/features/wheel/FoodWheel'

export default function Home() {
    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-4 mt-10">
                    What to Eat Wheel 🍜
                </h1>
                <p className="text-xl text-gray-600 text-center mb-4">
                    Let the wheel decide your next meal in Singapore!
                </p>
                <FoodWheel />
            </div>
        </main>
    )
} 