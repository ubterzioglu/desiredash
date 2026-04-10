/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Windows XP accent colours
        xp: {
          blue: '#1A6DC2',
          'blue-light': '#3D8BDB',
          'blue-dark': '#0F4C8A',
          green: '#4CAF50',
          red: '#CC3300',
          yellow: '#F5A500',
        },
        // Pure black canvas surfaces
        canvas: {
          base: '#000000',
          surface: '#0A0A0A',
          elevated: '#111111',
          border: '#1F1F1F',
        },
        // White text
        ink: {
          primary: '#FFFFFF',
          muted: '#888888',
        },
      },
    },
  },
  plugins: [],
}
