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
          50: '#b3d4ff',
          100: '#80b7ff',
          200: '#4d9aff',
          300: '#1a7dff',
          400: '#0064e6',
          500: '#004eb3',
          600: '#003780',
          700: '#00214d',
          800: '#000b1a',
          DEFAULT: '#ce0c00',
        },
        currentColor: '#003780',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
