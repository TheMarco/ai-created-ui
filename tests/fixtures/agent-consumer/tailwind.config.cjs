const aiCreatedPreset = require('@ai-created/ui/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [aiCreatedPreset],
  content: ['./app/**/*.{ts,tsx}'],
};
