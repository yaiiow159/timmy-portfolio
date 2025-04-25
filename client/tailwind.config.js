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
          DEFAULT: 'var(--bg-primary)',
          light: 'var(--bg-primary)'
        },
        secondary: {
          DEFAULT: 'var(--bg-secondary)',
          light: 'var(--bg-secondary)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)'
        },
        'text-primary': {
          DEFAULT: 'var(--text-primary)',
          light: 'var(--text-primary)'
        },
        'text-secondary': {
          DEFAULT: 'var(--text-secondary)',
          light: 'var(--text-secondary)'
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text-primary.DEFAULT'),
            a: {
              color: theme('colors.accent.DEFAULT'),
              '&:hover': {
                color: theme('colors.accent.light'),
              },
            },
            h1: {
              color: theme('colors.text-primary.DEFAULT'),
            },
            h2: {
              color: theme('colors.text-primary.DEFAULT'),
            },
            h3: {
              color: theme('colors.text-primary.DEFAULT'),
            },
            h4: {
              color: theme('colors.text-primary.DEFAULT'),
            },
            h5: {
              color: theme('colors.text-primary.DEFAULT'),
            },
            h6: {
              color: theme('colors.text-primary.DEFAULT'),
            },
            strong: {
              color: theme('colors.text-primary.DEFAULT'),
            },
            code: {
              color: theme('colors.accent.DEFAULT'),
              backgroundColor: theme('colors.secondary.DEFAULT'),
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: theme('colors.secondary.DEFAULT'),
              color: theme('colors.text-primary.DEFAULT'),
            },
            blockquote: {
              color: theme('colors.text-secondary.DEFAULT'),
              borderLeftColor: theme('colors.accent.DEFAULT'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.text-primary.light'),
            a: {
              color: theme('colors.accent.light'),
              '&:hover': {
                color: theme('colors.accent.DEFAULT'),
              },
            },
            h1: {
              color: theme('colors.text-primary.light'),
            },
            h2: {
              color: theme('colors.text-primary.light'),
            },
            h3: {
              color: theme('colors.text-primary.light'),
            },
            h4: {
              color: theme('colors.text-primary.light'),
            },
            h5: {
              color: theme('colors.text-primary.light'),
            },
            h6: {
              color: theme('colors.text-primary.light'),
            },
            strong: {
              color: theme('colors.text-primary.light'),
            },
            code: {
              color: theme('colors.accent.light'),
              backgroundColor: theme('colors.secondary.light'),
            },
            pre: {
              backgroundColor: theme('colors.secondary.light'),
              color: theme('colors.text-primary.light'),
            },
            blockquote: {
              color: theme('colors.text-secondary.light'),
              borderLeftColor: theme('colors.accent.light'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
