/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0d2545",
        brand: {
          DEFAULT: "#1a56db",
          dark: "#123f9e",
          tint: "#eaf2fd",
          tint2: "#dbe9fb",
        },
        gold: "#c9a15a",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 14px rgba(13,37,69,.06)",
        elevated: "0 10px 30px rgba(13,37,69,.08)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};
