/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FFF8F0', dark: '#2A2520' },
        blush: { DEFAULT: '#F8D7DA', dark: '#4A3540' },
        lavender: { DEFAULT: '#E8D5F2', dark: '#3D3550' },
        rose: { DEFAULT: '#F4A6B8', dark: '#C97B8E' },
        nest: { pink: '#FFB6C1', purple: '#D4A5FF', mint: '#B8E8D4' },
      },
      fontFamily: {
        display: ['"Quicksand"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        polaroid: '4px 6px 20px rgba(0,0,0,0.12), 0 0 0 8px #fff',
        card: '0 4px 24px rgba(244, 166, 184, 0.2)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
