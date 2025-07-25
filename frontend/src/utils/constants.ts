/**
 * Design system constants for consistent styling
 */

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 800,
} as const

// Spacing scale
export const SPACING = {
  XS: '0.25rem',   // 4px
  SM: '0.5rem',    // 8px
  MD: '1rem',      // 16px
  LG: '1.5rem',    // 24px
  XL: '2rem',      // 32px
  '2XL': '3rem',   // 48px
  '3XL': '4rem',   // 64px
  '4XL': '6rem',   // 96px
  '5XL': '8rem',   // 128px
} as const

// Border radius
export const RADIUS = {
  SM: '0.25rem',   // 4px
  MD: '0.5rem',    // 8px
  LG: '0.75rem',   // 12px
  XL: '1rem',      // 16px
  '2XL': '1.5rem', // 24px
  FULL: '9999px',
} as const

// Typography scale
export const FONT_SIZE = {
  XS: '0.75rem',   // 12px
  SM: '0.875rem',  // 14px
  BASE: '1rem',    // 16px
  LG: '1.125rem',  // 18px
  XL: '1.25rem',   // 20px
  '2XL': '1.5rem', // 24px
  '3XL': '1.875rem', // 30px
  '4XL': '2.25rem',  // 36px
  '5XL': '3rem',     // 48px
  '6XL': '3.75rem',  // 60px
  '7XL': '4.5rem',   // 72px
} as const

// Z-index scale
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const

// Component sizes
export const COMPONENT_SIZES = {
  BUTTON: {
    SM: { padding: '0.5rem 0.75rem', fontSize: FONT_SIZE.SM },
    MD: { padding: '0.75rem 1rem', fontSize: FONT_SIZE.BASE },
    LG: { padding: '1rem 1.5rem', fontSize: FONT_SIZE.LG },
  },
  INPUT: {
    SM: { padding: '0.5rem 0.75rem', fontSize: FONT_SIZE.SM },
    MD: { padding: '0.75rem 1rem', fontSize: FONT_SIZE.BASE },
    LG: { padding: '1rem 1.25rem', fontSize: FONT_SIZE.LG },
  },
} as const

// Glow effects
export const GLOW_EFFECTS = {
  SUBTLE: { blur: '5px', spread: '2px' },
  MEDIUM: { blur: '10px', spread: '5px' },
  STRONG: { blur: '20px', spread: '10px' },
  INTENSE: { blur: '30px', spread: '15px' },
} as const