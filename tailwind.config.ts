import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          default: "#633CFF",
          hover: "#BEADFF",
          disabled: "#EFEBFF",
        },
        grey: {
          dark: "#333333",
          medium: "#737373",
          light: "#D9D9D9",
        },
        white: {
          default: "#FFFFFF",
          border: "#FAFAFA",
        },
        red: "#FF3939",
        secondary: "#9333EA",
      },
      fontFamily: {
        sans: ['"Instrument Sans"', "sans-serif"],
      },
      boxShadow: {
        input: "0 0 30px -15px #633CFF",
      },
    },
  },
  plugins: [],
};
export default config;
