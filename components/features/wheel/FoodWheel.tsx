'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FOOD_SECTIONS } from '@/lib/constants/foodData'
import { FoodItem } from '@/types/food'
import '@/styles/wheel.css'
import { NearbyRestaurants } from '../restaurants/NearbyRestaurants'

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

export const FoodWheel = () => {
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [debugInfo, setDebugInfo] = useState<string>('')
    const [showOverlay, setShowOverlay] = useState(false)
    const wheelRef = useRef<HTMLUListElement>(null)
    const previousEndDegree = useRef(0)

    useEffect(() => {
        if (wheelRef.current) {
            // Set the number of items dynamically
            wheelRef.current.style.setProperty('--_items', FOOD_SECTIONS.length.toString())
        }
    }, [])

    useEffect(() => {
        // Prevent body scrolling when overlay is open
        if (showOverlay) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [showOverlay])

    const getSelectedSection = (rotation: number) => {
        const sectionAngle = 360 / FOOD_SECTIONS.length

        // 1. Normalize the rotation to 0-360
        let normalizedRotation = (rotation % 360 + 360) % 360

        // 2. Reverse the direction since our wheel rotates clockwise
        // but sections are numbered counting clockwise from the top
        normalizedRotation = (360 - normalizedRotation) % 360

        // 3. Account for the offset between the pointer (at top) and section alignment
        // sectionAngle / 2 aligns with center of section
        // sectionAngle * (sectionsCount / 4) provides dynamic adjustment based on number of sections
        const sectionOffset = sectionAngle / 2 + sectionAngle * (FOOD_SECTIONS.length / 4)
        console.log("sectionOffset", sectionOffset)
        normalizedRotation = (normalizedRotation + sectionOffset) % 360

        // 4. Calculate index based on the adjusted rotation
        const index = Math.floor(normalizedRotation / sectionAngle)

        return index
    }

    const spinWheel = () => {
        if (isSpinning || !wheelRef.current) return

        setIsSpinning(true)
        setSelectedFood(null)
        setSelectedCategory('')
        setDebugInfo('')
        setShowOverlay(false)

        // Random rotation between 5 and 10 full spins plus a random section
        const spins = 5 + Math.random() * 5
        const randomAdditionalDegrees = spins * 360 + Math.random() * 360
        const newEndDegree = previousEndDegree.current + randomAdditionalDegrees

        // Apply the animation using the Web Animations API with a more gradual easing
        const animation = wheelRef.current.animate([
            { transform: `rotate(${previousEndDegree.current}deg)` },
            { transform: `rotate(${newEndDegree}deg)` }
        ], {
            duration: 7000, // Increased duration for more suspense
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // More gradual easing for consistent slowdown
            fill: 'forwards',
            iterations: 1
        })

        // Store the new end degree for the next spin
        previousEndDegree.current = newEndDegree

        // Use the animation's finished promise for reliable timing
        animation.finished.then(() => {
            // Add a suspenseful pause before revealing results
            setTimeout(() => {
                // Get the final rotation (0-360 degrees)
                const finalRotation = newEndDegree % 360
                const sectionAngle = 360 / FOOD_SECTIONS.length

                // Get the selected section index
                const selectedIndex = getSelectedSection(finalRotation)

                // Get the section and a random food item from it
                const section = FOOD_SECTIONS[selectedIndex]
                const randomFood = section.items[Math.floor(Math.random() * section.items.length)]

                // Debug information
                const normalizedRotation = (finalRotation % 360 + 360) % 360
                const reversedRotation = (360 - normalizedRotation) % 360
                const offset = sectionAngle / 2 + sectionAngle
                const withOffset = (reversedRotation + offset) % 360
                const debug = `Final Rotation: ${finalRotation.toFixed(1)}°, Normalized: ${normalizedRotation.toFixed(1)}°, Reversed: ${reversedRotation.toFixed(1)}°, With Offset: ${withOffset.toFixed(1)}°, Section Angle: ${sectionAngle}°, Index: ${selectedIndex}, Section: ${section.label}`
                if (DEBUG_MODE) {
                    setDebugInfo(debug)
                    console.log(debug)
                }

                setSelectedFood(randomFood)
                setSelectedCategory(section.label)
                setShowOverlay(true)
                setIsSpinning(false)
            }, 1000) // 1 second pause for suspense
        }).catch(error => {
            console.error("Animation error:", error);
            setIsSpinning(false);
        });
    }

    return (
        <div className="flex flex-col items-center gap-8 p-8">
            <div className="relative w-full max-w-[500px]">
                <fieldset className="ui-wheel-of-fortune">
                    <ul ref={wheelRef}>
                        {FOOD_SECTIONS.map((section) => (
                            <li key={section.category} className="py-10">{section.label}</li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={spinWheel}
                        disabled={isSpinning}
                    >
                        SPIN
                    </button>
                </fieldset>
                <div className="wheel-pointer" />
            </div>

            {DEBUG_MODE && debugInfo && (
                <div className="debug-info">
                    {debugInfo}
                </div>
            )}

            <AnimatePresence>
                {selectedFood && showOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 w-screen h-screen overflow-hidden"
                        onClick={() => setShowOverlay(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-4xl bg-white/95 p-8 rounded-lg shadow-2xl mx-4 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowOverlay(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="text-center">
                                <h2 className="text-5xl font-bold mb-8 text-gray-800">{selectedCategory}</h2>
                                <div className="recommendation-box bg-gray-50 p-6 rounded-lg mb-6">
                                    <h3 className="text-3xl font-semibold mb-4 text-gray-700">Recommended Dish</h3>
                                    <h4 className="text-2xl font-medium mb-3 text-gray-800">{selectedFood.name}</h4>
                                    <p className="text-gray-600 text-lg mb-4">{selectedFood.description}</p>
                                    <div className="health-rating flex items-center justify-center gap-2 mb-4">
                                        <span className="text-gray-700 text-lg">Health Rating:</span>
                                        <div className="health-rating-dots flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`health-rating-dot ${i < selectedFood.healthRating ? 'active' : 'inactive'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {selectedFood.culturalInfo && (
                                        <p className="cultural-info italic text-gray-600 text-lg">{selectedFood.culturalInfo}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedFood && !showOverlay && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="food-result-card w-full max-w-4xl"
                    >
                        <div className="category-badge">
                            {selectedCategory}
                        </div>
                        <h3>{selectedFood.name}</h3>
                        <p>{selectedFood.description}</p>
                        <div className="health-rating">
                            <span>Health Rating:</span>
                            <div className="health-rating-dots">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`health-rating-dot ${i < selectedFood.healthRating ? 'active' : 'inactive'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        {selectedFood.culturalInfo && (
                            <p className="cultural-info">{selectedFood.culturalInfo}</p>
                        )}
                        <NearbyRestaurants
                            cuisine={selectedFood.cuisine || selectedCategory.toLowerCase()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
} 