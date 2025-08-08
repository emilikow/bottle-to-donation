/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base44green: "#2ECC71", // Adjust hex if you have the exact Base44 green
      },
    },
  },
  plugins: [],
};