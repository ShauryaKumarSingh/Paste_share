import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Main purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#3f0f5c',
        },
        accent: {
          50: '#cffafe',
          100: '#a5f3fc',
          200: '#67e8f9',
          300: '#06b6d4', // Neon cyan
          400: '#0891b2',
          500: '#0e7490',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827',
          950: '#030712',
        },
      },
      backgroundImage: {
        'gradient-indigo-purple': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        'gradient-mesh': `
          radial-gradient(at 20% 50%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
          radial-gradient(at 40% 80%, rgba(6, 182, 212, 0.05) 0px, transparent 50%)
        `,
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.4)',
        'neon': '0 0 10px rgba(6, 182, 212, 0.6), 0 0 20px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
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
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      fontSize: {
        code: ['0.875rem', { lineHeight: '1.5' }],
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Inter"', '"Manrope"', 'sans-serif'],
      },
      opacity: {
        '8': '0.08',
        '12': '0.12',
      },
      zIndex: {
        backdrop: '40',
        sticky: '50',
        fixed: '60',
        modal: '70',
        tooltip: '80',
      },
    },
  },
  plugins: [
    // Custom scrollbar styling
    function ({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(139, 92, 246, 0.05)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)',
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)',
            },
          },
        },
      });
    },
  ],
};

export default config;
