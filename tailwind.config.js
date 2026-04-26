/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0706",     // deep charcoal bg
        soot: "#141110",    // card bg
        char: "#1d1917",    // elevated surface
        bone: "#f5ede0",    // primary text
        cream: "#ebe0cf",   // softer text
        amber: "#FFC72C",   // brand yellow
        ember: "#FF6B1A",   // brand orange
        crimson: "#E63946", // brand red
        lime: "#C4E26E",    // success accent
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-bricolage)", "system-ui", "sans-serif"],
      },
      animation: {
        "float-1": "float1 22s ease-in-out infinite",
        "float-2": "float2 28s ease-in-out infinite",
        breathe: "breathe 1.6s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        scroll: "scroll 40s linear infinite",
      },
      keyframes: {
        float1: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "50%": { transform: "translate(80px,40px) scale(1.08)" } },
        float2: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "50%": { transform: "translate(-60px,-80px) scale(0.95)" } },
        breathe: { "0%,100%": { opacity: "0.5", transform: "scale(0.98)" }, "50%": { opacity: "1", transform: "scale(1)" } },
        scroll: { to: { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};
