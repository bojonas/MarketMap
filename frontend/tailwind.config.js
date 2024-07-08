/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'selector',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(calc(-100% + 100px))' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
      },
      colors: {
        'sky-1000': 'rgb(6 40 70)',
        'slate-850': 'rgb(22 33 51)',
        'purple-custom': '#715DF2',
        'gray-standard': '#4e4e4e',
        'gray-custom': '#242424',
        'gray-button': '#303030',
        'gray-button-hover': '#353535',
        'darkgray-custom': '#171717',
        'black-custom': '#101010',
        'offwhite': '#e1e1e1',
        'offwhite-hover': '#ffffff',
        'darkoffwhite': '#d0d0d0',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing'
      }
    },
  },
  plugins: [],
}