/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    {
      pattern: /(bg|text|border|ring)-(slate|zinc|gray|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /(grid-cols)-(1|2|3|4|5|6|7|8|9|10|11|12)/,
    },
    {
      pattern: /(col-span)-(1|2|3|4|5|6|7|8|9|10|11|12)/,
    },
    {
      pattern: /(w|h)-(16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)/,
    },
    {
      pattern: /(rounded)-(none|sm|md|lg|xl|2xl|3xl|full)/,
    },
  ],
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
