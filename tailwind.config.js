module.exports = {
  content: ["./index.html", './formkit.config.ts', "./src/**/*.vue"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require('@formkit/tailwindcss').default,
  ],
}
