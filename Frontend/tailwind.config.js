/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { poppins: ['Poppins', 'sans-serif'] },
      colors: {
        darkBg: { 700: '#2b3148', 800: '#21222e', 900: '#1a1c27' },
      },
    },
  },
  plugins: [],
};
