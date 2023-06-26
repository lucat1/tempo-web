module.exports = {
  content: ["./index.html", './formkit.config.ts', "./src/**/*.vue"],
  daisyui: {
    themes: [
      {
        tempo: {
          "primary": "#94916d",
          "secondary": "#94916d",
          "accent": "#94916d",
          "neutral": "#1d2324",
          "base-100": "#1f2024",
        },
      },
    ]
  },
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
    require('@tailwindcss/typography'),
  ],
}
