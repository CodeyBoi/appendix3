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
        darkBg: '#1A1B1E',
        darkText: '#C1C2C5',
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
