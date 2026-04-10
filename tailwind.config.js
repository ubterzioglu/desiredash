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
        // Dark canvas surfaces
        canvas: {
          base: '#0A1628',
          surface: '#0F1F38',
          elevated: '#162844',
          border: '#1E3A5F',
        },
        // Dark text
        ink: {
          primary: '#D6E8FF',
          muted: '#7BA8D4',
        },
      },
    },
  },
  plugins: [],
}
