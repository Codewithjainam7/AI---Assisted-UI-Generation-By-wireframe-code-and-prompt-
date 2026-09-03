/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'SF Pro Display'", '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        '3xl': '64px',
      },
      colors: {
        glass: {
          white: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.12)',
        },
      },
      boxShadow: {
        'glow-red': '0 0 40px rgba(239,68,68,0.35)',
        'glow-sm': '0 0 20px rgba(239,68,68,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
};
