module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--background-main)",
        auth: "var(--background-auth)",
        input: "var(--input)",
        txt: "var(--txt)",
        sun: "var(--sun)",
        moon: "var(--moon)",
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['light', 'dark']
  }
}
