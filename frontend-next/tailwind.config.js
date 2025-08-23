import { heroui } from "@heroui/theme";

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "custom-light-gradient": "linear-gradient(0deg, #fafafa, #f4f4f4)",
        "custom-dark-gradient": "linear-gradient(0deg, #000000, #080808)",
      },
      screens: {
        xs: "480px",
        "2xs": "320px",
        "3xs": "240px",
        "4xs": "160px",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
