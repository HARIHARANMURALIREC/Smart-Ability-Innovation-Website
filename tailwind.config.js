/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        slate: {
          900: '#000000',
          950: '#000000',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
        'hero-mesh':
          'radial-gradient(ellipse at top left, rgba(99,102,241,0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(124,58,237,0.15), transparent 50%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 16px 48px rgba(31, 38, 135, 0.18)',
        glow: '0 0 24px rgba(124, 58, 237, 0.45)',
        'glow-blue': '0 0 24px rgba(79, 70, 229, 0.45)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'heart-colors': {
          '0%, 100%': { color: '#f43f5e', fill: '#f43f5e' },
          '16%': { color: '#a855f7', fill: '#a855f7' },
          '33%': { color: '#3b82f6', fill: '#3b82f6' },
          '50%': { color: '#10b981', fill: '#10b981' },
          '66%': { color: '#f59e0b', fill: '#f59e0b' },
          '83%': { color: '#ec4899', fill: '#ec4899' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'heart-colors': 'heart-colors 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
