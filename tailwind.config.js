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
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
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
