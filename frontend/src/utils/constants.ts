/**
 * Design system constants for consistent styling
 * Web3/Futuristic event app design tokens
 */

// Animation durations (in milliseconds)
export const ANIMATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 800,
  CYBER_PULSE: 2000,
  MATRIX_SCROLL: 20000,
  GLOW_CYCLE: 3000,
} as const

// Spacing scale (using rem for scalability)
export const SPACING = {
  NONE: '0',
  XS: '0.25rem',   // 4px
  SM: '0.5rem',    // 8px
  MD: '1rem',      // 16px
  LG: '1.5rem',    // 24px
  XL: '2rem',      // 32px
  '2XL': '3rem',   // 48px
  '3XL': '4rem',   // 64px
  '4XL': '6rem',   // 96px
  '5XL': '8rem',   // 128px
  '6XL': '12rem',  // 192px
  '7XL': '16rem',  // 256px
} as const

// Border radius scale
export const RADIUS = {
  NONE: '0',
  XS: '0.125rem',  // 2px
  SM: '0.25rem',   // 4px
  MD: '0.5rem',    // 8px
  LG: '0.75rem',   // 12px
  XL: '1rem',      // 16px
  '2XL': '1.5rem', // 24px
  '3XL': '2rem',   // 32px
  FULL: '9999px',
  CYBER: '0.375rem', // 6px - signature cyber look
} as const

// Typography scale (Web3 focused)
export const FONT_SIZE = {
  XS: '0.75rem',     // 12px
  SM: '0.875rem',    // 14px
  BASE: '1rem',      // 16px
  LG: '1.125rem',    // 18px
  XL: '1.25rem',     // 20px
  '2XL': '1.5rem',   // 24px
  '3XL': '1.875rem', // 30px
  '4XL': '2.25rem',  // 36px
  '5XL': '3rem',     // 48px
  '6XL': '3.75rem',  // 60px
  '7XL': '4.5rem',   // 72px
  '8XL': '6rem',     // 96px
  '9XL': '8rem',     // 128px
} as const

// Font weights
export const FONT_WEIGHT = {
  THIN: '100',
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
  BLACK: '900',
} as const

// Line heights
export const LINE_HEIGHT = {
  NONE: '1',
  TIGHT: '1.25',
  SNUG: '1.375',
  NORMAL: '1.5',
  RELAXED: '1.625',
  LOOSE: '2',
} as const

// Z-index scale (Web3 app specific)
export const Z_INDEX = {
  BACKGROUND: -1,
  DEFAULT: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  CYBER_OVERLAY: 1090,
  MATRIX_EFFECT: 1100,
} as const

// Responsive breakpoints
export const BREAKPOINTS = {
  XS: '475px',
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
  '3XL': '1920px',
} as const

// Component size variants
export const COMPONENT_SIZES = {
  BUTTON: {
    XS: { 
      padding: `${SPACING.XS} ${SPACING.SM}`, 
      fontSize: FONT_SIZE.XS,
      minHeight: '2rem',
    },
    SM: { 
      padding: `${SPACING.SM} ${SPACING.MD}`, 
      fontSize: FONT_SIZE.SM,
      minHeight: '2.25rem',
    },
    MD: { 
      padding: `${SPACING.MD} ${SPACING.LG}`, 
      fontSize: FONT_SIZE.BASE,
      minHeight: '2.5rem',
    },
    LG: { 
      padding: `${SPACING.LG} ${SPACING.XL}`, 
      fontSize: FONT_SIZE.LG,
      minHeight: '3rem',
    },
    XL: { 
      padding: `${SPACING.XL} ${SPACING['2XL']}`, 
      fontSize: FONT_SIZE.XL,
      minHeight: '3.5rem',
    },
  },
  INPUT: {
    SM: { 
      padding: `${SPACING.SM} ${SPACING.MD}`, 
      fontSize: FONT_SIZE.SM,
      minHeight: '2.25rem',
    },
    MD: { 
      padding: `${SPACING.MD} ${SPACING.LG}`, 
      fontSize: FONT_SIZE.BASE,
      minHeight: '2.5rem',
    },
    LG: { 
      padding: `${SPACING.LG} ${SPACING.XL}`, 
      fontSize: FONT_SIZE.LG,
      minHeight: '3rem',
    },
  },
  CARD: {
    SM: { 
      padding: SPACING.LG,
      borderRadius: RADIUS.LG,
    },
    MD: { 
      padding: SPACING.XL,
      borderRadius: RADIUS.XL,
    },
    LG: { 
      padding: SPACING['2XL'],
      borderRadius: RADIUS['2XL'],
    },
  },
} as const

// Glow effects for Web3/Cyber aesthetic
export const GLOW_EFFECTS = {
  NONE: { blur: '0px', spread: '0px' },
  SUBTLE: { blur: '4px', spread: '1px' },
  SOFT: { blur: '8px', spread: '2px' },
  MEDIUM: { blur: '12px', spread: '4px' },
  STRONG: { blur: '20px', spread: '8px' },
  INTENSE: { blur: '32px', spread: '12px' },
  CYBER: { blur: '16px', spread: '6px' },
  NEON: { blur: '24px', spread: '10px' },
} as const

// Shadow depths
export const SHADOWS = {
  NONE: 'none',
  SM: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`,
  DEFAULT: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`,
  MD: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
  LG: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
  XL: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
  '2XL': `0 25px 50px -12px rgba(0, 0, 0, 0.25)`,
  INNER: `inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)`,
  CYBER: `0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)`,
} as const

// Transition easings
export const EASING = {
  LINEAR: 'linear',
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  CYBER: 'cubic-bezier(0.4, 0, 0.2, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const

// Grid system
export const GRID = {
  COLUMNS: 12,
  GAP: {
    SM: SPACING.SM,
    MD: SPACING.MD,
    LG: SPACING.LG,
    XL: SPACING.XL,
  },
  CONTAINER: {
    SM: '640px',
    MD: '768px', 
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
} as const

// Cyber/Web3 specific constants
export const CYBER_EFFECTS = {
  MATRIX_CHARS: '01',
  GLITCH_INTENSITY: {
    LOW: '2px',
    MEDIUM: '4px',
    HIGH: '8px',
  },
  SCAN_LINE_HEIGHT: '2px',
  HOLOGRAM_OPACITY: 0.8,
  NEON_FLICKER_DURATION: '1.5s',
} as const