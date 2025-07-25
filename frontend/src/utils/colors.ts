/**
 * Color utility functions for consistent color usage across the application
 * Uses CSS custom properties that reference Tailwind colors for consistency
 */

// Get CSS custom property value
const getCSSVar = (property: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim()
  }
  return ''
}

// Color constants that reference Tailwind CSS variables
export const COLORS = {
  // Cyber colors (from tailwind.config.js)
  CYBER_BLUE: 'rgb(var(--color-cyber-blue) / <alpha-value>)',
  CYBER_PURPLE: 'rgb(var(--color-cyber-purple) / <alpha-value>)',
  CYBER_GREEN: 'rgb(var(--color-cyber-green) / <alpha-value>)',
  CYBER_PINK: 'rgb(var(--color-cyber-pink) / <alpha-value>)',
  CYBER_ORANGE: 'rgb(var(--color-cyber-orange) / <alpha-value>)',
  
  // Fallback hex values for SVG and direct usage
  CYBER_BLUE_HEX: '#00d4ff',
  CYBER_PURPLE_HEX: '#8b5cf6',
  CYBER_GREEN_HEX: '#00ff88',
  CYBER_PINK_HEX: '#ff0080',
  CYBER_ORANGE_HEX: '#ff8c00',
  
  // Theme colors (reference Tailwind colors)
  DARK_BG: 'rgb(var(--color-dark-bg) / <alpha-value>)',
  DARK_SURFACE: 'rgb(var(--color-dark-surface) / <alpha-value>)',
  DARK_ELEVATED: 'rgb(var(--color-dark-elevated) / <alpha-value>)',
  DARK_BORDER: 'rgb(var(--color-dark-border) / <alpha-value>)',
  
  // Fallback hex values
  DARK_BG_HEX: '#0a0a0f',
  DARK_SURFACE_HEX: '#1a1a2e',
  DARK_ELEVATED_HEX: '#16213e',
  DARK_BORDER_HEX: '#2a2a3e',
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
 * Default cyber color palette for components
 */
export const CYBER_COLORS = [
  COLORS.CYBER_BLUE_HEX,
  COLORS.CYBER_PURPLE_HEX,
  COLORS.CYBER_GREEN_HEX,
  COLORS.CYBER_PINK_HEX,
] as const