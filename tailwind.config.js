/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ['"Palatino Linotype"', '"Book Antiqua"', 'Palatino', 'serif'],
        sans: ['"Palatino Linotype"', '"Book Antiqua"', 'Palatino', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#1e3a8a",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f8fafc", // Light gray background
          foreground: "#374151", // Dark gray text
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
      },
    },
  },
  plugins: [],
};