module.exports = {
  content: ["./index.html", './formkit.config.ts', "./src/**/*.vue"],
  theme: {
    extend: {
      gridTemplateColumns: {
        'layout-mobile': '',
        'layout': '22rem 1fr 22rem',
      },
      gridTemplateRows: {
        'layout-mobile': '',
        'layout': '1fr 6rem',
      }
    }
  },
  plugins: [
    require("daisyui"),
    require('@formkit/tailwindcss').default,
  ],
}
