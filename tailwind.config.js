/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-bahnschrift)', 'sans-serif'],
      display: ['var(--font-bahnschrift)', 'sans-serif'],
      body: ['var(--font-bahnschrift)', 'sans-serif'],
      castelar: ['var(--font-castelar)', 'serif'],
    },
    extend: {
      colors: {
        white: '#FAFFFC',
        currentColor: '#ce0c00',
        darkBg: '#1A1B1E',
        darkText: '#C1C2C5',
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
        yellow: {
          100: '#fef7e3',
          200: '#fde7ac',
          300: '#fbd775',
          400: '#f9c73e',
          500: '#f8b707',
          600: '#c18e06',
          700: '#8a6504',
          800: '#533d02',
          900: '#1c1401',
          DEFAULT: '#f8b707',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
