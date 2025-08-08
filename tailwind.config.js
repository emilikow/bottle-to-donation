/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f7fafc' // Light background instead of dark
      },
      boxShadow: {
        glow: '0 8px 24px -12px rgba(34,197,94,.45)'
      }
    },
  },
  plugins: [],
}