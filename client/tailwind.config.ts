import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: "#8B0000",
        obsidian: "#0B0B0B",
        velvet: "#6B1839",
        brass: "#B5A642",
        ivory: "#FFFFF0",
      },
      fontFamily: {
        gothic: ['"Cinzel"', "serif"],
        body: ['"Crimson Text"', "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
