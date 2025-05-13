import React from 'react';

const TechStack = () => {
    const technologies = [
        {
            category: "Development Environment",
            items: [
                { name: "Cursor AI", description: "AI-powered IDE for enhanced development" }
            ]
        },
        {
            category: "Artificial Intelligence",
            items: [
                { name: "GPT-4", description: "Advanced language model for general assistance" },
                { name: "GPT-4o", description: "Optimized version of GPT-4" },
                { name: "Claude 3.7 Sonnet", description: "AI model for enhanced code generation and assistance" }
            ]
        },
        {
            category: "APIs & Services",
            items: [
                { name: "Gemini", description: "Food recommendation API for personalized suggestions" },
                { name: "Google Maps", description: "Restaurant location and information service" },
                { name: "Open-Meteo", description: "Weather data provider for contextual recommendations" }
            ]
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Tech Stack</h1>
                    <p className="text-xl text-gray-600">
                        Powered by cutting-edge technologies to provide the best food recommendation experience
                    </p>
                </div>

                <div className="grid gap-8 mt-12">
                    {technologies.map((category, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category.category}</h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {category.items.map((tech, techIdx) => (
                                    <div
                                        key={techIdx}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{tech.name}</h3>
                                        <p className="text-gray-600">{tech.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechStack; 