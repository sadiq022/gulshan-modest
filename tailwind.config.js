/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F0",
        "cream-deep": "#F3EADC",
        "cream-line": "#E6DAC4",
        ink: "#211D19",
        emerald: {
          DEFAULT: "#1E3B2E",
          soft: "#2E5642",
          deep: "#142A20",
        },
        gold: {
          DEFAULT: "#B9893F",
          light: "#E3BC7E",
          pale: "#F1DDB2",
        },
        rose: {
          DEFAULT: "#C0816C",
          soft: "#DCAE9C",
        },
        orange: {
          50: "#F1EBE1",   // Creamy pale
          100: "#E6DAC4",  // cream line
          200: "#F1DDB2",  // Gold pale
          400: "#B9893F",  // Gold DEFAULT
          500: "#1E3B2E",  // Emerald DEFAULT
          600: "#142A20",  // Emerald deep
          700: "#0D1E16",  // Dark forest
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      maxWidth: {
        wrap: "1400px",
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(33, 29, 25, 0.25)",
        card: "0 14px 34px -16px rgba(30, 59, 46, 0.28)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1400" },
          "100%": { strokeDashoffset: "0" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(.22,1,.36,1) forwards",
        drawLine: "drawLine 2.6s cubic-bezier(.22,1,.36,1) forwards",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        shimmer: "shimmer 6s ease-in-out infinite alternate",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
