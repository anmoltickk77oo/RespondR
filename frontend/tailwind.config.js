/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        surface: {
          50:  'rgba(255,255,255,0.04)',
          100: 'rgba(255,255,255,0.06)',
          200: 'rgba(255,255,255,0.08)',
          300: 'rgba(255,255,255,0.12)',
        },
      },
      boxShadow: {
        'glass':  '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'glow-red': '0 0 30px rgba(239, 68, 68, 0.25)',
        'glow-green': '0 0 30px rgba(34, 197, 94, 0.25)',
        'glow-amber': '0 0 30px rgba(245, 158, 11, 0.25)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fade-in-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
