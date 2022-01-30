module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        Josefin: ["Josefin Sans"],
        Salty: ["Custom", "sans-serif"]
      },
      fontSize: {
        "7xl": "7rem",
        "8xl": "8rem",
        "9xl": "9rem",

      }
    }
  },
  plugins: []
};
