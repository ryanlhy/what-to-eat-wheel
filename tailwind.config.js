/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Food category colors with proper opacity
        'hawker': '#FF6B35',    // Orange for local hawker favorites
        'healthy': '#4CAF50',   // Green for healthy options
        'quick': '#2196F3',     // Blue for quick meals
        'special': '#9C27B0',   // Purple for special treats
        'veg': '#8BC34A',       // Light green for vegetarian
        'halal': '#00BCD4',     // Cyan for halal options
        'italian': '#E91E63',   // Pink for Italian cuisine
        'mexican': '#FF9800',
        'spanish': '#FFC107',
        'american': '#795548',
        'korean': '#3F51B5',
        'vietnamese': '#009688',
        'french': '#673AB7',
        'mediterranean': '#CDDC39',
        'japanese': '#607D8B',
        'indian': '#FF5722',
        'chinese': '#F44336',
        'thai': '#FFEB3B',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
} 