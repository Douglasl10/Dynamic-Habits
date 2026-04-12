/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'cursive'],
        'dm':    ['"DM Sans"', 'sans-serif'],
        'mono':  ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}