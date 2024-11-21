/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#67BEE8',    // Blue - R103 V190 B236
        secondary: '#D4D800',  // Yellow - R212 V216 B0
        accent1: '#7B62A8',    // Purple - R123 V98 B168
        accent2: '#B24794',    // Fuchsia - R178 V71 B148
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};