/**
 * Color utility functions for consistent color usage across the application
 * Supports both light and dark themes with CSS custom properties
 */

export type Theme = 'light' | 'dark'



// Stellar Events Design System Colors
export const STELLAR_COLORS = {
  // Primary Spectrum: "Stellar Pulse"
  void: '#0a0a0f',        // Deep space background
  midnight: '#1a1a2e',    // Primary dark
  nebula: '#16213e',      // Secondary dark
  cosmic: '#2d3748',      // Tertiary dark
  
  // Accent Colors: "Event Aura"
  electric: '#00d4ff',    // Primary electric blue
  plasma: '#7c3aed',      // Vivid purple
  aurora: '#06ffa5',      // Neon green
  flare: '#ff6b6b',       // Energetic coral
  gold: '#ffd700',        // Premium gold
} as const

// Theme-aware color system
export const THEME_COLORS = {
  // Stellar Events colors
  stellar: STELLAR_COLORS,
  
  // Cyber accent colors (consistent across themes)
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
  
  // Theme-specific colors
  dark: {
    bg: {
      primary: '#0a0a0f',
      secondary: '#1a1a2e', 
      elevated: '#16213e',
      overlay: '#0f0f23',
    },
    surface: {
      primary: '#1a1a2e',
      secondary: '#252545',
      elevated: '#2a2a4a',
      hover: '#323252',
    },
    border: {
      primary: '#2a2a3e',
      secondary: '#3a3a5e',
      accent: '#4a4a6e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      muted: '#94a3b8',
      disabled: '#64748b',
    }
  },
  
  light: {
    bg: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      elevated: '#f1f5f9',
      overlay: '#f8fafc',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      elevated: '#f1f5f9',
      hover: '#e2e8f0',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      accent: '#94a3b8',
    },
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b',
      disabled: '#94a3b8',
    }
  }
} as const

// Legacy color constants for backward compatibility
export const COLORS = {
  // Cyber colors
  CYBER_BLUE_HEX: THEME_COLORS.cyber.blue,
  CYBER_PURPLE_HEX: THEME_COLORS.cyber.purple,
  CYBER_GREEN_HEX: THEME_COLORS.cyber.green,
  CYBER_PINK_HEX: THEME_COLORS.cyber.pink,
  CYBER_ORANGE_HEX: THEME_COLORS.cyber.orange,
  
  // Dark theme fallbacks
  DARK_BG_HEX: THEME_COLORS.dark.bg.primary,
  DARK_SURFACE_HEX: THEME_COLORS.dark.surface.primary,
  DARK_ELEVATED_HEX: THEME_COLORS.dark.bg.elevated,
  DARK_BORDER_HEX: THEME_COLORS.dark.border.primary,
} as const

/**
 * Convert hex color to rgba with specified opacity
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Get cyber blue with opacity
 */
export const getCyberBlue = (opacity: number = 1): string => 
  hexToRgba(COLORS.CYBER_BLUE_HEX, opacity)

/**
 * Get cyber purple with opacity
 */
export const getCyberPurple = (opacity: number = 1): string => 
  hexToRgba(COLORS.CYBER_PURPLE_HEX, opacity)

/**
 * Get cyber green with opacity
 */
export const getCyberGreen = (opacity: number = 1): string => 
  hexToRgba(COLORS.CYBER_GREEN_HEX, opacity)

/**
 * Get cyber pink with opacity
 */
export const getCyberPink = (opacity: number = 1): string => 
  hexToRgba(COLORS.CYBER_PINK_HEX, opacity)

/**
 * Get cyber orange with opacity
 */
export const getCyberOrange = (opacity: number = 1): string => 
  hexToRgba(COLORS.CYBER_ORANGE_HEX, opacity)

/**
 * Get theme-aware background color
 */
export const getThemeBg = (theme: 'dark' | 'light'): string => 
  theme === 'dark' ? COLORS.DARK_BG_HEX : '#ffffff'

/**
 * Get theme-aware surface color
 */
export const getThemeSurface = (theme: 'dark' | 'light'): string => 
  theme === 'dark' ? COLORS.DARK_SURFACE_HEX : '#f8fafc'

/**
 * Get theme-aware colors
 */
export const getThemeColors = (theme: Theme) => THEME_COLORS[theme]

/**
 * Get theme-aware text color
 */
export const getThemeText = (theme: Theme, variant: keyof typeof THEME_COLORS.dark.text = 'primary') => 
  THEME_COLORS[theme].text[variant]

/**
 * Get theme-aware background color
 */
export const getThemeBackground = (theme: Theme, variant: keyof typeof THEME_COLORS.dark.bg = 'primary') => 
  THEME_COLORS[theme].bg[variant]

/**
 * Get theme-aware surface color
 */
export const getThemeSurfaceColor = (theme: Theme, variant: keyof typeof THEME_COLORS.dark.surface = 'primary') => 
  THEME_COLORS[theme].surface[variant]

/**
 * Get theme-aware border color
 */
export const getThemeBorder = (theme: Theme, variant: keyof typeof THEME_COLORS.dark.border = 'primary') => 
  THEME_COLORS[theme].border[variant]

/**
 * Get vibrant color with opacity
 */
export const getVibrantColor = (color: keyof typeof THEME_COLORS.vibrant, opacity: number = 1): string => 
  hexToRgba(THEME_COLORS.vibrant[color], opacity)

/**
 * Get cyber color with opacity
 */
export const getCyberColor = (color: keyof typeof THEME_COLORS.cyber, opacity: number = 1): string => 
  hexToRgba(THEME_COLORS.cyber[color], opacity)

/**
 * Default cyber color palette for components
 */
export const CYBER_COLORS = [
  THEME_COLORS.cyber.blue,
  THEME_COLORS.cyber.purple,
  THEME_COLORS.cyber.green,
  THEME_COLORS.cyber.pink,
] as const

/**
 * Vibrant event color palette
 */
export const VIBRANT_COLORS = [
  THEME_COLORS.vibrant.electric,
  THEME_COLORS.vibrant.neon,
  THEME_COLORS.vibrant.magenta,
  THEME_COLORS.vibrant.laser,
  THEME_COLORS.vibrant.plasma,
  THEME_COLORS.vibrant.hologram,
  THEME_COLORS.vibrant.aurora,
  THEME_COLORS.vibrant.cosmic,
] as const

/**
 * Generate gradient string for cyber effects
 */
export const getCyberGradient = (colors: string[], direction: string = '45deg'): string => 
  `linear-gradient(${direction}, ${colors.join(', ')})`

/**
 * Generate glow effect CSS
 */
export const getGlowEffect = (color: string, intensity: 'subtle' | 'medium' | 'strong' | 'intense' = 'medium'): string => {
  const intensityMap = {
    subtle: { blur: 5, spread: 2 },
    medium: { blur: 10, spread: 5 },
    strong: { blur: 20, spread: 10 },
    intense: { blur: 30, spread: 15 },
  }
  
  const { blur, spread } = intensityMap[intensity]
  return `0 0 ${blur}px ${color}, 0 0 ${spread}px ${color}`
}

/**
 * Stellar Events Color Utilities
 */

/**
 * Get stellar color with opacity
 */
export const getStellarColor = (color: keyof typeof STELLAR_COLORS, opacity: number = 1): string => 
  hexToRgba(STELLAR_COLORS[color], opacity)

/**
 * Stellar Events color palette for components
 */
export const STELLAR_PALETTE = [
  STELLAR_COLORS.electric,
  STELLAR_COLORS.plasma,
  STELLAR_COLORS.aurora,
  STELLAR_COLORS.flare,
  STELLAR_COLORS.gold,
] as const

/**
 * Generate Stellar Events gradient
 */
export const getStellarGradient = (
  colors: (keyof typeof STELLAR_COLORS)[] = ['electric', 'plasma'], 
  direction: string = '135deg'
): string => {
  const colorValues = colors.map(color => STELLAR_COLORS[color])
  return `linear-gradient(${direction}, ${colorValues.join(', ')})`
}

/**
 * Generate Stellar Events hero gradient
 */
export const getStellarHeroGradient = (): string => 
  `radial-gradient(ellipse at top, ${getStellarColor('electric', 0.15)} 0%, transparent 70%), linear-gradient(135deg, ${STELLAR_COLORS.void} 0%, ${STELLAR_COLORS.midnight} 50%, ${STELLAR_COLORS.nebula} 100%)`

/**
 * Generate Stellar Events card gradient
 */
export const getStellarCardGradient = (): string => 
  `linear-gradient(145deg, ${getStellarColor('plasma', 0.1)} 0%, ${getStellarColor('electric', 0.05)} 100%)`

/**
 * Generate Stellar Events button gradient
 */
export const getStellarButtonGradient = (): string => 
  getStellarGradient(['electric', 'plasma'])

/**
 * Generate Stellar Events event card hover gradient
 */
export const getStellarEventHoverGradient = (): string => 
  `linear-gradient(135deg, ${getStellarColor('flare', 0.2)} 0%, ${getStellarColor('plasma', 0.2)} 100%)`

/**
 * Generate Stellar Events blockchain glow
 */
export const getStellarBlockchainGlow = (): string => 
  `radial-gradient(circle, ${getStellarColor('aurora', 0.2)} 0%, transparent 70%)`

/**
 * Get Stellar Events neon text shadow
 */
export const getStellarNeonShadow = (color: keyof typeof STELLAR_COLORS = 'electric'): string => {
  const colorValue = STELLAR_COLORS[color]
  return `0 0 5px ${colorValue}, 0 0 10px ${colorValue}, 0 0 15px ${colorValue}, 0 0 20px ${colorValue}`
}

/**
 * Get Stellar Events transaction state colors
 */
export const getStellarTransactionColors = () => ({
  pending: {
    bg: getStellarColor('gold', 0.2),
    border: getStellarColor('gold', 0.5),
    text: STELLAR_COLORS.gold,
  },
  confirmed: {
    bg: getStellarColor('aurora', 0.2),
    border: STELLAR_COLORS.aurora,
    text: STELLAR_COLORS.aurora,
  },
  failed: {
    bg: getStellarColor('flare', 0.2),
    border: STELLAR_COLORS.flare,
    text: STELLAR_COLORS.flare,
  },
})

/**
 * Design token constants for Stellar Events
 */
export const STELLAR_DESIGN_TOKENS = {
  // Timing
  timing: {
    instant: '0.1s',
    quick: '0.2s',
    smooth: '0.3s',
    dramatic: '0.5s',
    epic: '0.8s',
  },
  
  // Easing
  easing: {
    stellar: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    electric: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Spacing (Beat Mapping)
  spacing: {
    quantum: '0.25rem',    // 4px
    pulse: '0.5rem',       // 8px
    beat: '1rem',          // 16px
    measure: '1.5rem',     // 24px
    verse: '2rem',         // 32px
    chorus: '3rem',        // 48px
    song: '4rem',          // 64px
    album: '6rem',         // 96px
    concert: '8rem',       // 128px
  },
  
  // Typography Scale
  typography: {
    hero: 'clamp(2.5rem, 8vw, 6rem)',
    section: 'clamp(1.5rem, 4vw, 3rem)',
    body: '1.125rem',
    caption: '0.875rem',
  },
  
  // Border Radius
  radius: {
    cyber: '0.375rem',
    card: '1.25rem',
    button: '0.75rem',
    panel: '1.5rem',
  },
  
  // Shadows
  shadows: {
    neon: `0 0 5px ${STELLAR_COLORS.electric}, 0 0 10px ${STELLAR_COLORS.electric}, 0 0 15px ${STELLAR_COLORS.electric}`,
    neonLg: `0 0 10px ${STELLAR_COLORS.electric}, 0 0 20px ${STELLAR_COLORS.electric}, 0 0 30px ${STELLAR_COLORS.electric}`,
    cyber: `0 4px 20px ${getStellarColor('electric', 0.3)}`,
    glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
} as const