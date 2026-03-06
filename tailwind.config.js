/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0B",
        card: "#111111",
        "card-hover": "#161616",
        border: "rgba(255,255,255,0.18)",
        primary: "#F5F5F5",
        secondary: "#9CA3AF",
        accent: "#ffffff",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        lg: "10px",
        md: "8px",
      },
      spacing: {
        "4.5": "18px",
        "7.5": "30px",
        "18": "72px",
        "sidebar": "256px",
      },
      maxWidth: {
        "container": "1200px",
        "chat": "880px",
      },
      height: {
        "tab": "48px",
        "input-chat": "64px",
        "input-field": "56px",
        "textarea": "120px",
      },
      width: {
        "sidebar": "256px",
        "project-card": "320px",
        "upload-card": "520px",
      },
      aspectRatio: {
        "video": "16 / 9",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
