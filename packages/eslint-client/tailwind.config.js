import { fontFamily } from 'tailwindcss/defaultTheme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', ...fontFamily.sans],
        'source-code-pro': ['"Source Code Pro"', ...fontFamily.mono],
      }
    },
  },
  plugins: [],
}

