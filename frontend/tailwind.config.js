/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Futuristic Neon Blue (Primary)
        primary: {
          50: '#0a0e1a',
          100: '#0f1629',
          200: '#1a2332',
          300: '#253047',
          400: '#304766',
          500: '#3b5998', // Main brand blue
          600: '#4a6bb3',
          700: '#5a7dce',
          800: '#6b8fe9',
          900: '#7ca1ff',
          950: '#8db3ff',
        },
        // Electric Purple (Secondary)
        secondary: {
          50: '#0d0a1a',
          100: '#1a0f29',
          200: '#2a1a3a',
          300: '#3a254b',
          400: '#4a305c',
          500: '#6a3b9d', // Main purple
          600: '#7a4bb8',
          700: '#8a5bd3',
          800: '#9a6bee',
          900: '#aa7bff',
          950: '#ba8bff',
        },
        // Neon Green (Accent)
        accent: {
          50: '#0a1a0f',
          100: '#0f291a',
          200: '#1a3a2a',
          300: '#254b3a',
          400: '#305c4a',
          500: '#3b9d6a', // Main green
          600: '#4bb87a',
          700: '#5bd38a',
          800: '#6bee9a',
          900: '#7bffaa',
          950: '#8bffba',
        },
        // Dark Theme Neutrals
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
        // Blockchain-inspired colors
        cyber: {
          blue: '#00d4ff',
          purple: '#8b5cf6',
          green: '#00ff88',
          pink: '#ff0080',
          orange: '#ff8c00',
        },
        // Dark theme backgrounds
        dark: {
          bg: '#0a0a0f',
          surface: '#1a1a2e',
          elevated: '#16213e',
          border: '#2a2a3e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'matrix': 'matrix 20s linear infinite',
        'scan': 'scan 2s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite alternate',
        'neon-flicker': 'neonFlicker 1.5s ease-in-out infinite alternate',
        'cyber-grid': 'cyberGrid 4s linear infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff' },
          '100%': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.6)',
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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(45deg, #00d4ff, #8b5cf6, #00ff88)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        'blockchain-pattern': 'radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
        'pattern': '60px 60px',
      },
      boxShadow: {
        'neon': '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff',
        'neon-lg': '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
        'neon-purple': '0 0 5px #8b5cf6, 0 0 10px #8b5cf6, 0 0 15px #8b5cf6',
        'neon-green': '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88',
        'cyber': '0 4px 20px rgba(0, 212, 255, 0.3)',
        'dark': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
