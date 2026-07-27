/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#070b18',
          900: '#0B1F3A',
          850: '#0f1830',
          800: '#131f3d',
          700: '#1a2b52',
          600: '#243a6b',
          500: '#324f8f',
        },
        gold: {
          50: '#fbf6e9',
          100: '#f5e9c6',
          200: '#eed99e',
          300: '#e2c374',
          400: '#d4af37',
          500: '#c9a227',
          600: '#a9821c',
          700: '#856418',
        },
        cream: {
          50: '#F5F7FA',
          100: '#faf7f0',
          200: '#f3ecdc',
        },
      },
      backgroundImage: {
        'justice-hero': "linear-gradient(180deg, rgba(7,11,24,0.55) 0%, rgba(7,11,24,0.85) 55%, rgba(7,11,24,1) 100%), url('/image/app_background.jpeg')",
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,0.35), 0 8px 30px -8px rgba(212,175,55,0.25)',
        card: '0 4px 24px -6px rgba(7,11,24,0.12)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'spin-reverse-slow': 'spin-reverse 24s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'grid-pan': 'gridPan 20s linear infinite',
        blob: 'blob 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gridPan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '64px 64px' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
    },
  },
  plugins: [],
}
