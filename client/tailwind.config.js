/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      colors: {
        border: '#bbf7d0',
        input: '#bbf7d0',
        ring: '#22c55e',
        background: '#f0fdf4',
        foreground: '#14532d',
        primary: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#15803d',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#dcfce7',
          foreground: '#16a34a',
        },
        accent: {
          DEFAULT: '#f0fdf4',
          foreground: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
