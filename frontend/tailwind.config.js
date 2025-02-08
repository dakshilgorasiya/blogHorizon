/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        priary: "#252422",
        secondary: "#403d39",
        accent: "#ccc5b9",
        background: "#fffcf2",
        highlight: "#eb5e28"
      }
    },
  },
  plugins: [],
}

