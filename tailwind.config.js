module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--background-main)"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['light', 'dark']
  }
}
