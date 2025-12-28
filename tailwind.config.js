module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        bbh: ['"BBH Sans Bogle"', 'sans-serif'],
        Anton: ['"Anton"', 'sans-serif'], // 👈 new font class
        unbounded: ['"Unbounded"', 'sans-serif'], // optional (you loaded it too)
      },
      colors: {
        brand: '#96f507',
        homebg: '#212121',
        homeheadingtext : '#00f050'
      },
      fontSize: {
        '10xl': '10rem', // 160px
        '12xl': '12rem', // 192px
      },
    },
  },
  plugins: [],
};
