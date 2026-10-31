import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0b0e",
        surface: {
          DEFAULT: "#13131a",
          secondary: "#1a1a24",
          border: "#262636",
          hover: "#222230"
        },
        gold: {
          DEFAULT: "#e8b23a",
          light: "#f5cd68",
          dark: "#b8860b",
          glow: "rgba(232, 178, 58, 0.25)"
        },
        neon: {
          purple: "#9d4edd",
          blue: "#3a86ff",
          emerald: "#10b981",
          rose: "#f43f5e"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        glow: "pulseGlow 3s ease-in-out infinite"
      }
    },
  },
  plugins: [],
};
export default config;
