'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FOOD_SECTIONS } from '@/lib/constants/foodData'
import { FoodItem } from '@/types/food'

export const FoodWheel = () => {
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
    const wheelRef = useRef<HTMLDivElement>(null)

    const spinWheel = () => {
        if (isSpinning) return
        setIsSpinning(true)
        setSelectedFood(null)

        // Random rotation between 5 and 10 full spins plus a random section
        const spins = 5 + Math.random() * 5
        const degrees = spins * 360 + Math.random() * 360

        if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${degrees}deg)`
        }

        // Calculate selected food after animation
        setTimeout(() => {
            const finalRotation = degrees % 360
            const sectionAngle = 360 / FOOD_SECTIONS.length
            const selectedIndex = Math.floor(finalRotation / sectionAngle)
            const section = FOOD_SECTIONS[selectedIndex]
            const randomFood = section.items[Math.floor(Math.random() * section.items.length)]

            setSelectedFood(randomFood)
            setIsSpinning(false)
        }, 3000)
    }

    return (
        <div className="flex flex-col items-center gap-8 p-8">
            {/* Debug border to see container */}
            <div className="relative w-[400px] h-[400px] border-2 border-red-500">
                {/* Outer decorative ring */}
                <div
                    className="absolute w-full h-full rounded-full border-8 border-gray-800 bg-gray-900"
                    style={{
                        transform: 'scale(1.05)',
                        zIndex: 1
                    }}
                >
                    {/* Decorative dots */}
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 bg-white rounded-full"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `rotate(${(360 / 40) * i}deg) translateY(-195px)`,
                            }}
                        />
                    ))}
                </div>

                {/* Main wheel */}
                <motion.div
                    ref={wheelRef}
                    className="absolute inset-0"
                    style={{
                        zIndex: 2,
                    }}
                    transition={{ duration: 3, ease: "cubic-bezier(0.440, -0.205, 0.000, 1.130)" }}
                >
                    <div className="wheel-container">
                        {/* Decorative dots border */}
                        <div className="wheel-dots" />

                        {/* Wheel sections */}
                        {FOOD_SECTIONS.map((section, index) => {
                            const angle = (360 / FOOD_SECTIONS.length) * index
                            return (
                                <div
                                    key={section.category}
                                    className="wheel-section"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                        backgroundColor: section.color === 'bg-hawker' ? '#FF6B35' :
                                            section.color === 'bg-healthy' ? '#4CAF50' :
                                                section.color === 'bg-quick' ? '#2196F3' :
                                                    section.color === 'bg-special' ? '#9C27B0' :
                                                        section.color === 'bg-veg' ? '#8BC34A' :
                                                            section.color === 'bg-halal' ? '#00BCD4' : '#gray-500',
                                    }}
                                >
                                    <span>{section.label}</span>
                                </div>
                            )
                        })}

                        {/* Center hub */}
                        <div className="wheel-hub" />

                        {/* Pointer */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                        >
                            <div className="w-6 h-6 bg-blue-600 transform rotate-45 -translate-y-1/2 shadow-lg">
                                <div className="absolute inset-0.5 bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg
                         hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all transform hover:scale-105 active:scale-95
                         shadow-lg hover:shadow-xl"
            >
                {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>

            <AnimatePresence>
                {selectedFood && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8 p-6 bg-white rounded-lg shadow-xl max-w-md border border-gray-200"
                    >
                        <h3 className="text-2xl font-bold mb-2">{selectedFood.name}</h3>
                        <p className="text-gray-600 mb-4">{selectedFood.description}</p>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-semibold">Health Rating:</span>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`w-4 h-4 rounded-full ${i < selectedFood.healthRating ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        {selectedFood.culturalInfo && (
                            <p className="text-gray-600 mb-4 italic">{selectedFood.culturalInfo}</p>
                        )}
                        {selectedFood.locations && (
                            <div>
                                <h4 className="font-semibold mb-2">Where to Try:</h4>
                                <ul className="list-disc list-inside text-gray-600">
                                    {selectedFood.locations.map((location) => (
                                        <li key={location}>{location}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
} 