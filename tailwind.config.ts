import type { Config } from "tailwindcss";

// =============================================================================
// HADI COLLECTION — IVORY, GOLD, AND ESPRESSO
// Warm clothing-house palette. Serif display, quiet sans for UI.
// =============================================================================

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "80rem", // 1280px
      },
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#2C2118",
        espresso: "#2C2118",
        ivory: "#FFFFFF",
        surface: "#F5F5F5",
        border: "#E8E8E8",
        taupe: "#7A6858",
        secondary: "#7A6858",
        muted: "#7A6858",
        paper: "#FFFFFF",

        terracotta: {
          DEFAULT: "#A6843D",
          dark: "#7A5E2A",
          light: "#F3E6C8",
        },

        gold: "#A6843D",
        burgundy: "#6E2E3C",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Times New Roman", "serif"],
      },

      // 8px radius standard for images, buttons, and fields
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px", // For circular whatsapp / utility badge if needed
      },

      // No shadows
      boxShadow: {
        none: "none",
        card: "none",
        "card-hover": "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
      },

      letterSpacing: {
        widest: "0.15em",
        caps: "0.08em",
        bar: "0.1em",
        heading: "0.02em",
      },

      fontSize: {
        "nav": ["13px", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "500" }],
        "btn": ["13px", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "500" }],
        "bar": ["11px", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "500" }],
        "prod-name": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        "prod-price": ["14px", { lineHeight: "1.4", fontWeight: "400" }],
        "display-xl": ["3.5rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
        "display-lg": ["2.5rem", { lineHeight: "1.15", letterSpacing: "0.02em" }],
        "display-md": ["1.75rem", { lineHeight: "1.2", letterSpacing: "0.02em" }],
      },
    },
  },
  plugins: [],
};

export default config;
