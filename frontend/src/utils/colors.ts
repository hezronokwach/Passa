/**
 * Color utility functions for consistent color usage across the application
 * Supports both light and dark themes with CSS custom properties
 */

export type Theme = 'light' | 'dark'

// Get CSS custom property value
const getCSSVar = (property: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim()
  }
  return ''
}

// Theme-aware color system
export const THEME_COLORS = {
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