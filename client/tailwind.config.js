import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}', // ✅ Required for feature-based styling
    './shared/**/*.{js,ts,jsx,tsx,mdx}', // ✅ Shared components/styles
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [heroui()],
};

export default config;
