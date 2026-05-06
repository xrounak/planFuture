/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff', // indigo-50
          100: '#e0e7ff', // indigo-100
          200: '#c7d2fe', // indigo-200
          300: '#a5b4fc', // indigo-300
          400: '#818cf8', // indigo-400
          500: '#6366f1', // indigo-500
          600: '#4f46e5', // indigo-600
          700: '#4338ca', // indigo-700
          800: '#3730a3', // indigo-800
          900: '#312e81', // indigo-900
          950: '#1e1b4b', // indigo-950
        },
        score: {
          0: '#ef4444',
          1: '#f97316',
          2: '#eab308',
          3: '#84cc16',
          4: '#22c55e',
          5: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
