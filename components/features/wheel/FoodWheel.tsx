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
import { CloudIcon, SunIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { DEFAULT_LOCATION, Location } from '@/lib/constants/config'
import { FALLBACK_FUN_FACTS } from '@/lib/constants/foodData'
import { DEFAULT_TIMEOUT_API_FUNFACTS } from '@/lib/constants/config'

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

interface WeatherData {
    weather?: string;
    funFact: string;
    recommendedDishes?: {
        dish: string;
        nutrition: string[];
        suggestedRestaurants: string[];
    }[];
}

export const FoodWheel = () => {
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [debugInfo, setDebugInfo] = useState<string>('')
    const [showOverlay, setShowOverlay] = useState(false)
    const [userLocation, setUserLocation] = useState<Location | null>(null)
    const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([])
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false)
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined)
    const [showWeightControls, setShowWeightControls] = useState(false)
    const [sectionWeights, setSectionWeights] = useState<Record<string, number>>(() =>
        // Initialize with default weights (these won't affect the actual selection)
        Object.fromEntries(FOOD_SECTIONS.map(section => [section.category, 1]))
    )
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const wheelRef = useRef<HTMLUListElement>(null)
    const previousEndDegree = useRef(0)
    const [expandedDishes, setExpandedDishes] = useState<Record<number, boolean>>({});
    const [isLoadingWeatherData, setIsLoadingWeatherData] = useState(false);
    const [showWeatherSection, setShowWeatherSection] = useState(true);

    // Load saved weights from localStorage on client side only (for UI persistence only)
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
        normalizedRotation = (normalizedRotation + sectionOffset) % 360

        // 4. Calculate index based on the adjusted rotation
        const index = Math.floor(normalizedRotation / sectionAngle)

        return index
    }

    // Add a function to handle API timeout
    const fetchWithTimeout = async (promise: Promise<Response>, timeout: number) => {
        let timeoutId: NodeJS.Timeout;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error('Request timed out'));
            }, timeout);
        });

        try {
            const result = await Promise.race([promise, timeoutPromise]);
            clearTimeout(timeoutId!);
            return result;
        } catch (error) {
            clearTimeout(timeoutId!);
            throw error;
        }
    };

    const spinWheel = async () => {
        if (isSpinning || !wheelRef.current) return;

        setIsSpinning(true);
        setSelectedFood(null);
        setSelectedCategory('');
        setDebugInfo('');
        setWeatherData(null);
        setIsLoadingWeatherData(true);
        setShowWeatherSection(true);
        setShowOverlay(false);

        // Calculate wheel spin animation...
        const spins = 5 + Math.random() * 5;
        const randomAdditionalDegrees = spins * 360 + Math.random() * 360;
        const newEndDegree = previousEndDegree.current + randomAdditionalDegrees;

        // Calculate selected section
        const finalRotation = newEndDegree % 360;
        const selectedIndex = getSelectedSection(finalRotation);
        const section = FOOD_SECTIONS[selectedIndex];

        // Start the API request with timeout
        const weatherDataPromise = (async () => {
            try {
                const requestLocation = userLocation || DEFAULT_LOCATION;
                const fetchPromise = fetch('/api/recommendations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cuisine: section.label,
                        lat: requestLocation.lat,
                        lng: requestLocation.lng,
                        current_weather: true
                    })
                });

                const response = await fetchWithTimeout(fetchPromise, DEFAULT_TIMEOUT_API_FUNFACTS); // 3 second timeout

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                return data;
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                // Return fallback data on error
                return {
                    funFact: FALLBACK_FUN_FACTS[section.category.toLowerCase()]
                };
            }
        })();

        const animation = wheelRef.current.animate([
            { transform: `rotate(${previousEndDegree.current}deg)` },
            { transform: `rotate(${newEndDegree}deg)` }
        ], {
            duration: 7000,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fill: 'forwards',
            iterations: 1
        });

        previousEndDegree.current = newEndDegree;

        // Wait for animation to finish
        await animation.finished;

        // Show modal immediately after spin ends
        const randomFood = section.items[Math.floor(Math.random() * section.items.length)];
        setSelectedFood(randomFood);
        setSelectedCategory(section.label);
        setShowOverlay(true);
        setIsSpinning(false);

        // Set a timeout for the loading state
        const loadingTimeout = setTimeout(() => {
            if (isLoadingWeatherData) {
                setShowWeatherSection(false);
                setIsLoadingWeatherData(false);
                // Use fallback data
                setWeatherData({
                    funFact: FALLBACK_FUN_FACTS[section.category.toLowerCase()]
                });
            }
        }, 3000);

        // Get the weather data result
        const weatherData = await weatherDataPromise;
        clearTimeout(loadingTimeout);

        if (weatherData) {
            setWeatherData(weatherData);
            setShowWeatherSection(!!weatherData.weather);
        }
        setIsLoadingWeatherData(false);
    };

    // Add toggle function
    const toggleDish = (index: number) => {
        setExpandedDishes(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
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
                        <h4 className="text-xl font-medium mb-2">Recommended Dishes</h4>

                        {/* API Recommended Dishes */}
                        {weatherData?.recommendedDishes && weatherData.recommendedDishes.length > 0 ? (
                            <div className="space-y-4">
                                {weatherData.recommendedDishes.map((recommendation, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <button
                                            onClick={() => toggleDish(index)}
                                            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <h4 className="text-xl font-medium text-left">{recommendation.dish}</h4>
                                            {expandedDishes[index] ? (
                                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {expandedDishes[index] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-6">
                                                        <div className="mb-4">
                                                            <h5 className="font-medium text-gray-700 mb-2">Nutrition Information:</h5>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {recommendation.nutrition.map((fact, i) => (
                                                                    <li key={i} className="text-gray-600">{fact}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        {/* {recommendation.suggestedRestaurants && recommendation.suggestedRestaurants.length > 0 && (
                                                            <div>
                                                                <h5 className="font-medium text-gray-700 mb-2">Suggested Restaurants:</h5>
                                                                <ul className="list-disc list-inside space-y-1">
                                                                    {recommendation.suggestedRestaurants.map((restaurant, i) => (
                                                                        <li key={i} className="text-gray-600">{restaurant}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Fallback to original recommendation */
                            <>
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
                            </>
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

            <AnimatePresence>
                {showOverlay && selectedCategory && (
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
                            className="w-full max-w-4xl bg-white/95 p-8 rounded-lg shadow-2xl mx-4 relative min-h-[400px]"
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
                            <div className="text-center space-y-6">
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-5xl font-bold mb-8 text-gray-800"
                                >
                                    {selectedCategory}
                                </motion.h2>

                                {isLoadingWeatherData ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center space-y-4 min-h-[200px]"
                                    >
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                                        <p className="text-gray-600">Loading weather information...</p>
                                    </motion.div>
                                ) : weatherData && (
                                    <div className="space-y-6">
                                        {showWeatherSection && weatherData.weather && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="mb-6 p-4 bg-blue-50 rounded-lg transform-gpu"
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    {weatherData.weather.includes('overcast') ? (
                                                        <CloudIcon className="h-6 w-6 text-gray-600" />
                                                    ) : (
                                                        <SunIcon className="h-6 w-6 text-yellow-500" />
                                                    )}
                                                    <span className="text-lg font-medium">{weatherData.weather}</span>
                                                </div>
                                            </motion.div>
                                        )}

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="mb-6 p-4 bg-yellow-50 rounded-lg transform-gpu"
                                        >
                                            <p className="text-lg italic text-gray-700">{weatherData.funFact}</p>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
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