/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../tailwind-preset')],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../src/**/*.{js,ts,jsx,tsx}',
  ],
};
