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
        ink: "var(--ink)",
        paper: "var(--paper)",
        "paper-card": "var(--paper-card)",
        "paper-warm": "var(--paper-warm)",
        reel: "var(--reel)",
        "reel-grey": "var(--reel)",
        line: "var(--line)",
        spotlight: "var(--spotlight)",

        // User custom brand palette
        "brand-blue": "#1D99DE",
        "brand-orange": "#F49924",
        "brand-magenta": "#D21871",

        blue: {
          DEFAULT: "#1D99DE",
          50: "#EDF8FD",
          100: "#D6EFFB",
          500: "#1D99DE",
          600: "#1482BE",
          700: "#0F6696",
        },
        orange: {
          DEFAULT: "#F49924",
          50: "#FEF7EC",
          100: "#FDECD4",
          500: "#F49924",
          600: "#D97F12",
          700: "#AA610A",
        },
        magenta: {
          DEFAULT: "#D21871",
          50: "#FDF0F6",
          100: "#FBDEED",
          500: "#D21871",
          600: "#B4115F",
          700: "#8C0A49",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-body)", "DM Sans", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(18, 17, 16, 0.05), 0 2px 6px -1px rgba(18, 17, 16, 0.03)",
        "warm-lg": "0 10px 30px -4px rgba(18, 17, 16, 0.08), 0 4px 12px -2px rgba(18, 17, 16, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
