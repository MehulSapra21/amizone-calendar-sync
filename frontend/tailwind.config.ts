import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000", 
        foreground: "#ffffff", 
        ocean: {
          DEFAULT: "#006994", 
          light: "#008cba",
          dark: "#004b6b",
        },
      },
    },
  },
  plugins: [],
};
export default config;