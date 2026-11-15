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
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'ios': '1.75rem',
        'ios-sm': '1.125rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'liquid': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'liquid-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), 0 0 35px rgba(59, 130, 246, 0.35)',
        'glow-blue': '0 0 40px rgba(59, 130, 246, 0.35)',
        'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
};
