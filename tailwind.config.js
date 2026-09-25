/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF7A45', // Primary orange color from the button
          teal: '#00B4A0',   // Teal from the header
          dark: '#1D2B36',   // Dark text color
          gray: '#F2F4F7',   // Background gray
          lightBorder: '#E5E7EB'
        }
      }
    },
  },
  plugins: [],
}
