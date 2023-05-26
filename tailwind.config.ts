import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      main: [
        '"Inter"',
        "sans-serif",
      ],
      custom: ['"IBM Plex Sans"', "sans-serif"],
      headings: ['"Playfair Display"', "sans-serif"],
    },
    extend: {
      colors: {
        primary_text_color: "#e3f2fdff",
        secondary_text_color: "#cfcfcf",
        cta: "#cf5c36ff",
        dark: "#192338ff",
      },
      backgroundColor: {
       
        secondary: "#e3f2fdff",
        hover: "rgb(172, 184, 192)",
        cta: "#cf5c36ff",

      },
    },
  },
  plugins: [],
} satisfies Config

