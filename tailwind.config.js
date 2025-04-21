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
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
} 