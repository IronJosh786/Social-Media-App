/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "350px",
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif", "system-ui"],
        jetbrains: ["JetBrains Mono", "sans-serif", "system-ui"],
        poppins: ["Poppins", "sans-serif", "system-ui"],
        outfit: ["Outfit", "sans-serif", "system-ui"],
      },
    },
  },
  daisyui: {
    themes: ["corporate", "business"],
  },
  plugins: [require("daisyui")],
};
