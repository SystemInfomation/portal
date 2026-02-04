import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#f8fafc',
        card: {
          DEFAULT: 'rgba(20, 24, 33, 0.7)',
          foreground: '#f8fafc',
        },
        primary: {
          DEFAULT: '#00eeff',
          foreground: '#050505',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          foreground: '#f8fafc',
        },
        accent: {
          DEFAULT: '#a855f7',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#1e2433',
          foreground: '#94a3b8',
        },
        border: 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cosmic': 'radial-gradient(ellipse at top, #1e1b4b 0%, #0a0a0a 50%, #050505 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 238, 255, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 238, 255, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
