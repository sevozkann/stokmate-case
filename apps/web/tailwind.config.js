/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        navy: { DEFAULT: "#101c31", surface: "#1c2c47", muted: "#9cabc2" },
        brand: { DEFAULT: "#377de9", hover: "#286bd0", soft: "#edf4ff" },
        canvas: "#f5f7fb",
        line: "#e6ebf2",
        muted: "#6d7990",
        success: { DEFAULT: "#277662", soft: "#e3f6ef" },
        warning: { DEFAULT: "#ad7418", soft: "#fff2d8" },
        danger: { DEFAULT: "#c74a4a", soft: "#fff0ee" },
      },
      borderRadius: { panel: "14px", control: "10px" },
      boxShadow: { panel: "0 8px 24px rgb(38 54 77 / 0.05)" },
    },
  },
  plugins: [],
};
