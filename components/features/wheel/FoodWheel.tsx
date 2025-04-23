'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FOOD_SECTIONS } from '@/lib/constants/foodData'
import { FoodItem } from '@/types/food'
import '@/styles/wheel.css'

export const FoodWheel = () => {
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [debugInfo, setDebugInfo] = useState<string>('')
    const wheelRef = useRef<HTMLUListElement>(null)
    const previousEndDegree = useRef(0)

    useEffect(() => {
        if (wheelRef.current) {
            // Set the number of items dynamically
            wheelRef.current.style.setProperty('--_items', FOOD_SECTIONS.length.toString())
        }
    }, [])

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

        // Random rotation between 5 and 10 full spins plus a random section
        const spins = 5 + Math.random() * 5
        const randomAdditionalDegrees = spins * 360 + Math.random() * 360
        const newEndDegree = previousEndDegree.current + randomAdditionalDegrees

        // Apply the animation using the Web Animations API
        const animation = wheelRef.current.animate([
            { transform: `rotate(${previousEndDegree.current}deg)` },
            { transform: `rotate(${newEndDegree}deg)` }
        ], {
            duration: 4000,
            easing: 'cubic-bezier(0.32, 0, 0.67, 1)',
            fill: 'forwards',
            iterations: 1
        })

        // Store the new end degree for the next spin
        previousEndDegree.current = newEndDegree

        // Use the animation's finished promise instead of setTimeout for reliable timing
        animation.finished.then(() => {
            // Get the final rotation (0-360 degrees)
            const finalRotation = newEndDegree % 360
            const sectionAngle = 360 / FOOD_SECTIONS.length

            // Get the selected section index
            const selectedIndex = getSelectedSection(finalRotation)

            // Get the section and a random food item from it
            const section = FOOD_SECTIONS[selectedIndex]
            const randomFood = section.items[Math.floor(Math.random() * section.items.length)]

            // Debug information - include more details to help diagnose issues
            const normalizedRotation = (finalRotation % 360 + 360) % 360
            const reversedRotation = (360 - normalizedRotation) % 360
            const offset = sectionAngle / 2 + sectionAngle
            const withOffset = (reversedRotation + offset) % 360
            const debug = `Final Rotation: ${finalRotation.toFixed(1)}°, Normalized: ${normalizedRotation.toFixed(1)}°, Reversed: ${reversedRotation.toFixed(1)}°, With Offset: ${withOffset.toFixed(1)}°, Section Angle: ${sectionAngle}°, Index: ${selectedIndex}, Section: ${section.label}`
            setDebugInfo(debug)
            console.log(debug)

            setSelectedFood(randomFood)
            setSelectedCategory(section.label)
            setIsSpinning(false)
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
                            <li key={section.category}>{section.label}</li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={spinWheel}
                        disabled={isSpinning}
                    >
                        {isSpinning ? 'SPINNING...' : 'SPIN'}
                    </button>
                </fieldset>
                <div className="wheel-pointer" />
            </div>

            {debugInfo && (
                <div className="debug-info">
                    {debugInfo}
                </div>
            )}

            <AnimatePresence>
                {selectedFood && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="food-result-card"
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
                        {selectedFood.locations && (
                            <div className="locations">
                                <h4>Where to Try:</h4>
                                <ul>
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