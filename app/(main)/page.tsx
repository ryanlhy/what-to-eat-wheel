import { FoodWheel } from '@/components/features/wheel/FoodWheel'

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-4">
                    What to Eat Wheel 🍜
                </h1>
                <p className="text-xl text-gray-600 text-center mb-12">
                    Let the wheel decide your next meal in Singapore!
                </p>
                <FoodWheel />
            </div>
        </main>
    )
} 