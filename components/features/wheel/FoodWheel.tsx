'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FOOD_SECTIONS } from '@/lib/constants/foodData'
import { FoodItem } from '@/types/food'
import { Restaurant } from '@/types/restaurant'
import '@/styles/wheel.css'
import { NearbyRestaurants } from '../restaurants/NearbyRestaurants'
import { searchRestaurantsByCuisine } from './restaurantSearch'
import { WeightControls } from '../../preferences/WeightControls'
import { Modal } from '@/components/preferences/PreferencesModal'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

export const FoodWheel = () => {
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [debugInfo, setDebugInfo] = useState<string>('')
    const [showOverlay, setShowOverlay] = useState(false)
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([])
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false)
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined)
    const [showWeightControls, setShowWeightControls] = useState(false)
    const [sectionWeights, setSectionWeights] = useState<Record<string, number>>(() =>
        // Initialize with default weights
        Object.fromEntries(FOOD_SECTIONS.map(section => [section.category, 1]))
    )
    const wheelRef = useRef<HTMLUListElement>(null)
    const previousEndDegree = useRef(0)

    // Load saved weights from localStorage on client side only
    useEffect(() => {
        const loadSavedWeights = () => {
            try {
                const savedWeights = localStorage.getItem('foodWheelWeights');
                if (savedWeights) {
                    const parsed = JSON.parse(savedWeights);
                    // Validate the saved weights
                    const isValid = FOOD_SECTIONS.every(section =>
                        typeof parsed[section.category] === 'number' &&
                        parsed[section.category] >= 1 &&
                        parsed[section.category] <= 5
                    );
                    if (isValid) {
                        setSectionWeights(parsed);
                    }
                }
            } catch (e) {
                console.error('Error loading saved weights:', e);
            }
        };

        loadSavedWeights();
    }, []);

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

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    }, []);

    const getWeightedRandomSection = () => {
        // Create an array where each section appears multiple times based on its weight
        const weightedSections = FOOD_SECTIONS.flatMap(section =>
            Array(sectionWeights[section.category]).fill(section)
        );

        return weightedSections[Math.floor(Math.random() * weightedSections.length)];
    };

    const handleWeightChange = (category: string, weight: number) => {
        setSectionWeights(prev => {
            const newWeights = {
                ...prev,
                [category]: weight
            };
            try {
                // Save to localStorage only on client side
                localStorage.setItem('foodWheelWeights', JSON.stringify(newWeights));
            } catch (e) {
                console.error('Error saving weights:', e);
            }
            return newWeights;
        });
    };

    const spinWheel = async () => {
        if (isSpinning || !wheelRef.current) return;

        console.log('🎡 Starting wheel spin:', {
            timestamp: new Date().toISOString()
        });

        setIsSpinning(true);
        setSelectedFood(null);
        setSelectedCategory('');
        setDebugInfo('');
        setShowOverlay(false);
        setNearbyRestaurants([]);

        // Get weighted random section
        const selectedSection = getWeightedRandomSection();

        // Calculate the target rotation to land on this section
        const sectionIndex = FOOD_SECTIONS.findIndex(s => s.category === selectedSection.category);
        const sectionAngle = 360 / FOOD_SECTIONS.length;

        // Add extra spins (5-10 full rotations) plus the target rotation
        const spins = 5 + Math.random() * 5;
        const baseRotation = sectionIndex * sectionAngle;
        // Adjust the rotation to account for the wheel's orientation and pointer position
        const adjustedRotation = (360 - baseRotation + sectionAngle * (FOOD_SECTIONS.length / 4)) % 360;
        const totalRotation = (spins * 360) + adjustedRotation;

        console.log('🎲 Wheel spin details:', {
            spins,
            totalDegrees: totalRotation,
            finalDegree: totalRotation,
            selectedSection: selectedSection.label
        });

        const animation = wheelRef.current.animate([
            { transform: `rotate(${previousEndDegree.current}deg)` },
            { transform: `rotate(${totalRotation}deg)` }
        ], {
            duration: 7000,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fill: 'forwards',
            iterations: 1
        });

        previousEndDegree.current = totalRotation;

        // Start searching for restaurants if we have user location
        if (userLocation) {
            console.log('🔄 Starting restaurant search during wheel spin:', {
                timestamp: new Date().toISOString(),
                cuisine: selectedSection.label,
                location: userLocation
            });

            setIsLoadingRestaurants(true);
            try {
                const result = await searchRestaurantsByCuisine(
                    selectedSection.label,
                    userLocation,
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
                );

                console.log('✨ Restaurant search completed:', {
                    timestamp: new Date().toISOString(),
                    foundCount: result.restaurants.length,
                    hasNextPage: !!result.nextPageToken
                });

                setNearbyRestaurants(result.restaurants);
                setNextPageToken(result.nextPageToken);
            } catch (error) {
                console.error('❌ Restaurant search error:', error);
            } finally {
                setIsLoadingRestaurants(false);
            }
        }

        animation.finished.then(() => {
            console.log('🎡 Wheel animation finished:', {
                timestamp: new Date().toISOString()
            });

            setTimeout(() => {
                const randomFood = selectedSection.items[Math.floor(Math.random() * selectedSection.items.length)];

                if (DEBUG_MODE) {
                    const debug = `Selected Section: ${selectedSection.label}, Final Rotation: ${totalRotation.toFixed(1)}°, Section Index: ${sectionIndex}`;
                    setDebugInfo(debug);
                    console.log('🔍 Debug info:', debug);
                }

                setSelectedFood(randomFood);
                setSelectedCategory(selectedSection.label);
                setShowOverlay(true);
                setIsSpinning(false);

                console.log('🏁 Wheel spin completed:', {
                    timestamp: new Date().toISOString(),
                    selectedFood: randomFood.name,
                    category: selectedSection.label
                });
            }, 1000);
        }).catch(error => {
            console.error("❌ Animation error:", error);
            setIsSpinning(false);
        });
    };

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

            <button
                onClick={() => setShowWeightControls(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors weight-control-button w-full max-w-[280px] sm:max-w-[320px]"
            >
                <AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Adjust Weights</span>
            </button>

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
                        <h4 className="text-xl font-medium mb-2">Recommended Dish</h4>
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
                            cuisine={selectedFood?.cuisine || selectedCategory.toLowerCase()}
                            prefetchedRestaurants={nearbyRestaurants}
                            nextPageToken={nextPageToken}
                            onNextPageTokenChange={setNextPageToken}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Modal
                isOpen={showWeightControls}
                onClose={() => setShowWeightControls(false)}
                title="Cuisine Preferences"
            >
                <WeightControls
                    weights={sectionWeights}
                    onWeightChange={(category, weight) => {
                        setSectionWeights(prev => {
                            const newWeights = {
                                ...prev,
                                [category]: weight
                            };
                            try {
                                localStorage.setItem('foodWheelWeights', JSON.stringify(newWeights));
                            } catch (e) {
                                console.error('Error saving weights:', e);
                            }
                            return newWeights;
                        });
                    }}
                />
            </Modal>
        </div>
    )
} 