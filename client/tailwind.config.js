/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#121212',
          light: '#f8f9fa'
        },
        secondary: {
          DEFAULT: '#1e1e1e',
          light: '#e9ecef'
        },
        accent: '#60a5fa',
        'accent-light': '#93c5fd',
        'text-primary': {
          DEFAULT: '#f3f4f6',
          light: '#212529'
        },
        'text-secondary': {
          DEFAULT: '#9ca3af',
          light: '#6c757d'
        },
        dark: {
          100: '#171717',
          200: '#1e1e1e',
          300: '#262626',
          400: '#2e2e2e',
          500: '#363636',
          600: '#3e3e3e',
          700: '#464646',
          800: '#4e4e4e',
          900: '#565656'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.accent"), 0 0 20px theme("colors.accent")',
      },
    },
  },
  plugins: [],
}
