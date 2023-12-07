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
        'layout': '20rem 1fr 20rem',
      },
      gridTemplateRows: {
        'app': 'minmax(0, auto), 5.5rem',
      }
    }
  },
  plugins: [
    require("daisyui"),
    require('@formkit/tailwindcss').default,
    require('@tailwindcss/typography'),
  ],
}
