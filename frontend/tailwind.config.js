/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        priary: "#252422",
        secondary: "#403d39",
        accent: "#ccc5b9",
        background: "#fffcf2",
        highlight: "#eb5e28",
      },
      typography: {
        DEFAULT: {
          css: {
            ol: {
              listStyleType: "decimal",
            },
            li: {
              marginBottom: "0.5rem",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
  ],
};
