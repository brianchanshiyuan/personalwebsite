/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors (Crypto.com inspired)
        crypto: {
          dark: {
            900: '#051734',
            800: '#062B57',
            700: '#083B75',
            600: '#0A4FA0',
            500: '#0C63C7',
            400: '#4A8DFF',
            300: '#8BB3FF',
            cyan: '#00E0FF',
            'light-blue': '#5AB4FF',
            purple: '#7A4FFF',
          },
          // Light theme colors (Fintech inspired)
          light: {
            bg: '#F7F9FC',
            surface: '#FFFFFF',
            text: {
              primary: '#0A2540',
              muted: '#475569'
            },
            border: 'rgba(0, 0, 0, 0.05)'
          }
        },
      },
      fontFamily: {
        sans: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #051734 0%, #062B57 40%, #0C63C7 100%)',
        'dark-glow-top': 'radial-gradient(circle at top right, rgba(90, 180, 255, 0.15), transparent 50%)',
        'dark-glow-bottom': 'radial-gradient(circle at bottom left, rgba(0, 224, 255, 0.10), transparent 50%)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'card': '0 25px 55px rgba(12, 99, 199, 0.25)',
        'card-dark': '0 35px 65px rgba(12, 99, 199, 0.3)'
      },
      backdropBlur: {
        'glass': '16px',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add any other plugins you might need
  ],
}
