import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        bg: "#F8F9FF",
        surfaceMuted: "#EEF1FA",
        line: "#D8DBE6",
        muted: "#5B5F73",
        accent: "#0051D5",
        accentHover: "#003FA8",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Helvetica", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        prose: "72ch",
      },
    },
  },
  plugins: [],
};

export default config;
