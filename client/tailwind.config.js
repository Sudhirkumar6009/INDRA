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
      colors: {
        india: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          navy: '#000080',
        },
        border: '#e5e7eb',
        input: '#e5e7eb',
        ring: '#FF9933',
        background: '#ffffff',
        foreground: '#1f2937',
        primary: {
          DEFAULT: '#FF9933',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#138808',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#f9fafb',
          foreground: '#1f2937',
        },
      },
    },
  },
  plugins: [],
}
