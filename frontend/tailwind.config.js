/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware semantic colors
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
          secondary: 'rgb(var(--color-background-secondary) / <alpha-value>)',
          elevated: 'rgb(var(--color-background-elevated) / <alpha-value>)',
          overlay: 'rgb(var(--color-background-overlay) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          secondary: 'rgb(var(--color-surface-secondary) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          hover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          secondary: 'rgb(var(--color-border-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-border-accent) / <alpha-value>)',
        },
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
        },
        
        // Brand colors (consistent across themes)
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6', // Main brand blue
          600: '#005bb3',
          700: '#004280',
          800: '#002a4d',
          900: '#00111a',
          950: '#000508',
        },
        secondary: {
          50: '#f3e6ff',
          100: '#d9b3ff',
          200: '#bf80ff',
          300: '#a64dff',
          400: '#8c1aff',
          500: '#7300e6', // Main purple
          600: '#5b00b3',
          700: '#420080',
          800: '#2a004d',
          900: '#11001a',
          950: '#050008',
        },
        accent: {
          50: '#e6fff3',
          100: '#b3ffd9',
          200: '#80ffbf',
          300: '#4dffa6',
          400: '#1aff8c',
          500: '#00e673', // Main green
          600: '#00b35b',
          700: '#008042',
          800: '#004d2a',
          900: '#001a11',
          950: '#000805',
        },
        
        // Stellar Events Colors
        stellar: {
          void: '#0a0a0f',
          midnight: '#1a1a2e',
          nebula: '#16213e',
          cosmic: '#2d3748',
          electric: '#00d4ff',
          plasma: '#7c3aed',
          aurora: '#06ffa5',
          flare: '#ff6b6b',
          gold: '#ffd700',
        },
        
        // Cyber accent colors (legacy support)
        cyber: {
          blue: '#00d4ff',
          purple: '#8b5cf6',
          green: '#00ff88',
          pink: '#ff0080',
          orange: '#ff8c00',
          yellow: '#ffd700',
          red: '#ff3366',
          teal: '#00ffcc',
        },
        
        // Vibrant event colors
        vibrant: {
          electric: '#00ffff',
          neon: '#39ff14',
          magenta: '#ff00ff',
          laser: '#ff073a',
          plasma: '#bf00ff',
          hologram: '#7df9ff',
          aurora: '#00ff7f',
          cosmic: '#9400d3',
        },
        
        // Legacy support
        dark: {
          bg: '#0a0a0f',
          surface: '#1a1a2e',
          elevated: '#16213e',
          border: '#2a2a3e',
        },
        
        // Neutral grays
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      borderRadius: {
        'cyber': '0.375rem',
        '4xl': '2rem',
      },
      
      animation: {
        // Enhanced animations for Web3/Cyber aesthetic
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        
        // Cyber/Web3 specific animations
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'matrix': 'matrix 20s linear infinite',
        'matrix-slow': 'matrix 30s linear infinite',
        'scan': 'scan 2s linear infinite',
        'scan-slow': 'scan 4s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite alternate',
        'glitch-slow': 'glitch 1s ease-in-out infinite alternate',
        'neon-flicker': 'neonFlicker 1.5s ease-in-out infinite alternate',
        'cyber-grid': 'cyberGrid 4s linear infinite',
        'hologram': 'hologram 3s ease-in-out infinite',
        'data-stream': 'dataStream 2s linear infinite',
        'energy-pulse': 'energyPulse 1.5s ease-in-out infinite',
        'quantum-shift': 'quantumShift 4s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(var(--color-cyber-blue)), 0 0 10px rgb(var(--color-cyber-blue)), 0 0 15px rgb(var(--color-cyber-blue))' },
          '100%': { boxShadow: '0 0 10px rgb(var(--color-cyber-blue)), 0 0 20px rgb(var(--color-cyber-blue)), 0 0 30px rgb(var(--color-cyber-blue))' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgb(var(--color-cyber-blue) / 0.5)' },
          '50%': { boxShadow: '0 0 20px rgb(var(--color-cyber-blue) / 0.8), 0 0 30px rgb(var(--color-cyber-blue) / 0.6)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px rgb(var(--color-cyber-blue) / 0.5)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 20px rgb(var(--color-cyber-blue) / 0.8), 0 0 30px rgb(var(--color-cyber-blue) / 0.6)',
            transform: 'scale(1.05)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        neonFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        cyberGrid: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        hologram: {
          '0%, 100%': { opacity: '0.8', filter: 'hue-rotate(0deg)' },
          '50%': { opacity: '1', filter: 'hue-rotate(90deg)' },
        },
        dataStream: {
          '0%': { transform: 'translateY(-100%) scaleY(0)' },
          '50%': { transform: 'translateY(0%) scaleY(1)' },
          '100%': { transform: 'translateY(100%) scaleY(0)' },
        },
        energyPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        quantumShift: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(90deg) scale(1.1)' },
          '50%': { transform: 'rotate(180deg) scale(1)' },
          '75%': { transform: 'rotate(270deg) scale(1.1)' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(45deg, rgb(var(--color-cyber-blue)), rgb(var(--color-cyber-purple)), rgb(var(--color-cyber-green)))',
        'gradient-vibrant': 'linear-gradient(45deg, rgb(var(--color-vibrant-electric)), rgb(var(--color-vibrant-neon)), rgb(var(--color-vibrant-magenta)))',
        'cyber-grid': 'linear-gradient(rgb(var(--color-cyber-blue) / 0.1) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-cyber-blue) / 0.1) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(45deg, #00d4ff, #8b5cf6, #00ff88)',
        'dark-gradient': 'linear-gradient(135deg, rgb(var(--color-background)) 0%, rgb(var(--color-surface)) 50%, rgb(var(--color-background-elevated)) 100%)',
        'blockchain-pattern': 'radial-gradient(circle at 25% 25%, rgb(var(--color-cyber-blue) / 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgb(var(--color-cyber-purple) / 0.1) 0%, transparent 50%)',
        'matrix-rain': 'linear-gradient(180deg, transparent 0%, rgb(var(--color-cyber-green) / 0.1) 50%, transparent 100%)',
        'hologram-effect': 'linear-gradient(45deg, transparent 30%, rgb(var(--color-cyber-blue) / 0.1) 50%, transparent 70%)',
      },
      
      backgroundSize: {
        'grid': '40px 40px',
        'grid-sm': '20px 20px',
        'grid-lg': '60px 60px',
        'pattern': '60px 60px',
      },
      
      boxShadow: {
        'neon': '0 0 5px rgb(var(--color-cyber-blue)), 0 0 10px rgb(var(--color-cyber-blue)), 0 0 15px rgb(var(--color-cyber-blue))',
        'neon-sm': '0 0 3px rgb(var(--color-cyber-blue)), 0 0 6px rgb(var(--color-cyber-blue))',
        'neon-lg': '0 0 10px rgb(var(--color-cyber-blue)), 0 0 20px rgb(var(--color-cyber-blue)), 0 0 30px rgb(var(--color-cyber-blue))',
        'neon-xl': '0 0 15px rgb(var(--color-cyber-blue)), 0 0 30px rgb(var(--color-cyber-blue)), 0 0 45px rgb(var(--color-cyber-blue))',
        'neon-purple': '0 0 5px rgb(var(--color-cyber-purple)), 0 0 10px rgb(var(--color-cyber-purple)), 0 0 15px rgb(var(--color-cyber-purple))',
        'neon-green': '0 0 5px rgb(var(--color-cyber-green)), 0 0 10px rgb(var(--color-cyber-green)), 0 0 15px rgb(var(--color-cyber-green))',
        'neon-pink': '0 0 5px rgb(var(--color-cyber-pink)), 0 0 10px rgb(var(--color-cyber-pink)), 0 0 15px rgb(var(--color-cyber-pink))',
        'cyber': '0 4px 20px rgb(var(--color-cyber-blue) / 0.3)',
        'cyber-lg': '0 8px 40px rgb(var(--color-cyber-blue) / 0.4)',
        'dark': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.15)',
      },
      
      backdropBlur: {
        'xs': '2px',
      },
      
      transitionTimingFunction: {
        'cyber': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}