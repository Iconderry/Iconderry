/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#121316',
        cardBg: '#18191f',
        cardBorder: '#22242c'
      }
    },
  },
  plugins: [],
}