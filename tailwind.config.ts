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
        background: "#07070a",
        surface: {
          DEFAULT: "#0f0f16",
          secondary: "#14141f",
          tertiary: "#1a1a29",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "#1e1e2f"
        },
        gold: {
          DEFAULT: "#f3ba49",
          light: "#ffd875",
          dark: "#b8860b",
          glow: "rgba(243, 186, 73, 0.35)",
          muted: "rgba(243, 186, 73, 0.12)"
        },
        neon: {
          purple: "#a855f7",
          cyan: "#06b6d4",
          emerald: "#10b981",
          rose: "#f43f5e"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"]
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #ffd875 0%, #f3ba49 50%, #b8860b 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'mesh-glow': 'radial-gradient(at 50% 0%, rgba(243, 186, 73, 0.18) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.12) 0px, transparent 50%)',
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(243, 186, 73, 0.2)',
        'gold-lg': '0 0 35px rgba(243, 186, 73, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-box': '0 0 20px -5px rgba(243, 186, 73, 0.3)',
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.04)" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        },
        equalizer: {
          "0%, 100%": { height: "4px" },
          "50%": { height: "22px" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        glow: "pulseGlow 4s ease-in-out infinite",
        equalizer1: "equalizer 0.8s ease-in-out infinite 0.1s",
        equalizer2: "equalizer 0.8s ease-in-out infinite 0.3s",
        equalizer3: "equalizer 0.8s ease-in-out infinite 0.5s",
        equalizer4: "equalizer 0.8s ease-in-out infinite 0.2s",
      }
    },
  },
  plugins: [],
};
export default config;
