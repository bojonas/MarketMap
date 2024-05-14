/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'selector',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-1000': 'rgb(6 40 70)',
        'slate-850': 'rgb(22 33 51)',
        'purple-custom': '#715DF2',
        'gray-custom': '#242424',
        'gray-button': '#303030',
        'gray-button-hover': '#353535',
        'darkgray-custom': '#171717',
        'black-custom': '#101010',
        'offwhite': '#f5f5f5',
        'darkoffwhite': '#d9d9d9',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing'
      }
    },
  },
  plugins: [],
}