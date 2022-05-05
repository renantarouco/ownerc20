module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'own-blue': '#00a4db'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}