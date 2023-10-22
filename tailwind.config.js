/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      display: ['Bahnschrift', 'sans-serif'],
      body: ['Bahnschrift', 'sans-serif'],
    },
    extend: {
      colors: {
        red: {
          100: '#ffe3e0',
          200: '#ffb5b1',
          300: '#ff867f',
          400: '#ff564c',
          500: '#ff271a',
          600: '#ce0c00',
          700: '#b40700',
          800: '#810300',
          900: '#500000',
          DEFAULT: '#ce0c00',
        },
        white: '#FAFFFC',
        currentColor: '#ce0c00',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
