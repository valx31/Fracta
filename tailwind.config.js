const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", "sans-serif"],
      },
      colors: {
        primary: "#7ED957",
        secondary: "#154618",
        background: "#1B1B1D",
        text: "#4A4A4A",
        textSecondary: "#71717A",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
