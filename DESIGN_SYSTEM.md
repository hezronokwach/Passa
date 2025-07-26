# Passa Design System

## Overview
A comprehensive design system for the Passa Web3 event platform, featuring a futuristic cyber aesthetic with full light/dark theme support and vibrant interactive elements.

## 🎨 Color System

### Theme Architecture
The design system uses CSS custom properties for seamless theme switching:

```css
/* Light theme (default) */
:root {
  --color-background: 255 255 255;
  --color-text: 15 23 42;
  /* ... */
}

/* Dark theme */
.dark {
  --color-background: 10 10 15;
  --color-text: 255 255 255;
  /* ... */
}
```

### Color Palettes

#### Cyber Colors (Consistent across themes)
- **Blue**: `#00d4ff` - Primary cyber accent
- **Purple**: `#8b5cf6` - Secondary cyber accent  
- **Green**: `#00ff88` - Success/accent color
- **Pink**: `#ff0080` - Highlight color
- **Orange**: `#ff8c00` - Warning color
- **Yellow**: `#ffd700` - Attention color
- **Red**: `#ff3366` - Error color
- **Teal**: `#00ffcc` - Info color

#### Vibrant Event Colors
- **Electric**: `#00ffff` - High energy
- **Neon**: `#39ff14` - Bright accent
- **Magenta**: `#ff00ff` - Bold highlight
- **Laser**: `#ff073a` - Intense red
- **Plasma**: `#bf00ff` - Deep purple
- **Hologram**: `#7df9ff` - Light blue
- **Aurora**: `#00ff7f` - Green accent
- **Cosmic**: `#9400d3` - Deep violet

#### Semantic Colors (Theme-aware)
- **Background**: Primary page background
- **Surface**: Card and component backgrounds
- **Border**: Component borders
- **Text**: Text colors with hierarchy

## 🎭 Theme System

### Usage
```tsx
import { useTheme } from './contexts/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme()
  
  return (
    <div className="bg-background text-text">
      <button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </button>
    </div>
  )
}
```

### Theme Toggle Component
```tsx
import ThemeToggle from './components/ui/ThemeToggle'

// Different variants
<ThemeToggle variant="switch" size="md" />
<ThemeToggle variant="button" />
<ThemeToggle variant="icon" />
```

## 🧩 Component System

### Buttons

#### Variants
- **Primary**: Main brand actions
- **Secondary**: Secondary actions
- **Accent**: Highlighted actions
- **Cyber**: Futuristic cyber aesthetic
- **Vibrant**: High-energy event actions
- **Outline**: Subtle actions
- **Ghost**: Minimal actions
- **Glass**: Glassmorphism effect

#### Sizes
- **xs**: Extra small (2rem height)
- **sm**: Small (2.25rem height)
- **md**: Medium (2.5rem height)
- **lg**: Large (3rem height)
- **xl**: Extra large (3.5rem height)

#### Usage
```tsx
import InteractiveButton from './components/ui/InteractiveButton'

<InteractiveButton 
  variant="cyber" 
  size="lg"
  glowEffect={true}
  rippleEffect={true}
  icon={<StarIcon />}
  iconPosition="left"
>
  Join Event
</InteractiveButton>
```

### Cards

#### Variants
- **Default**: Standard card
- **Glow**: Cyber glow effect
- **Glass**: Glassmorphism
- **Cyber**: Cyber border and effects
- **Vibrant**: Event-focused styling

#### Usage
```tsx
<div className="card card-glow card-md">
  <h3>Event Title</h3>
  <p>Event description...</p>
</div>
```

### Inputs

#### Variants
- **Default**: Standard input
- **Cyber**: Cyber-themed styling
- **Glass**: Glassmorphism effect

#### Usage
```tsx
<input 
  className="input input-cyber input-lg" 
  placeholder="Enter your email"
/>
```

## 🎬 Animation System

### Animation Classes
- **Glow Effects**: `.glow-effect`, `.pulse-glow`, `.cyber-pulse`
- **Movement**: `.floating-element`, `.floating-element-slow`
- **Energy**: `.energy-pulse`, `.quantum-shift`
- **Data**: `.data-stream`, `.matrix-effect`
- **Scan**: `.scan-effect`, `.hologram-effect`
- **Glitch**: `.glitch-effect`

### Custom Animations
```css
/* Cyber grid background */
.cyber-grid {
  background-image: 
    linear-gradient(rgb(var(--color-cyber-blue) / 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--color-cyber-blue) / 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: cyberGrid 4s linear infinite;
}

/* Matrix rain effect */
.matrix-bg {
  background-image: linear-gradient(180deg, 
    transparent 0%, 
    rgb(var(--color-cyber-green) / 0.05) 50%, 
    transparent 100%);
  animation: matrix 20s linear infinite;
}
```

## 📐 Layout System

### Spacing Scale
Using rem units for scalability:
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **2XL**: 3rem (48px)
- **3XL**: 4rem (64px)
- **4XL**: 6rem (96px)
- **5XL**: 8rem (128px)

### Container Classes
- `.container-max`: Max-width container
- `.container-cyber`: Container with cyber padding
- `.section-padding`: Horizontal padding
- `.section-padding-y`: Vertical padding

## 🎯 Typography

### Font Families
- **Sans**: Inter (body text)
- **Display**: Poppins (headings)
- **Mono**: JetBrains Mono (code)

### Text Utilities
- `.gradient-text`: Cyber gradient text
- `.gradient-text-vibrant`: Vibrant gradient text
- `.neon-text`: Neon glow effect
- `.cyber-text`: Monospace cyber styling

## 🌟 Effects & Patterns

### Background Patterns
```tsx
{/* Cyber grid */}
<div className="cyber-grid opacity-30" />

{/* Matrix rain */}
<div className="matrix-bg opacity-20" />

{/* Hologram effect */}
<div className="hologram-bg" />
```

### Glow Effects
```tsx
{/* Neon shadows */}
<div className="shadow-neon" />
<div className="shadow-neon-lg" />
<div className="shadow-neon-purple" />
<div className="shadow-neon-green" />

{/* Cyber shadows */}
<div className="shadow-cyber" />
<div className="shadow-cyber-lg" />
```

## 🔧 Utility Functions

### Color Utilities
```tsx
import { 
  getCyberColor, 
  getVibrantColor, 
  getThemeColors,
  getCyberGradient,
  getGlowEffect 
} from './utils/colors'

// Get cyber color with opacity
const blueGlow = getCyberColor('blue', 0.5)

// Get vibrant color
const electricColor = getVibrantColor('electric', 0.8)

// Generate gradient
const cyberGradient = getCyberGradient(['#00d4ff', '#8b5cf6'], '45deg')

// Generate glow effect
const glowCSS = getGlowEffect('#00d4ff', 'strong')
```

### Design Token Usage
```tsx
import { SPACING, RADIUS, ANIMATION, GLOW_EFFECTS } from './utils/constants'

// Use design tokens
const styles = {
  padding: SPACING.LG,
  borderRadius: RADIUS.CYBER,
  animationDuration: `${ANIMATION.NORMAL}ms`,
  boxShadow: `0 0 ${GLOW_EFFECTS.MEDIUM.blur} #00d4ff`
}
```

## 📱 Responsive Design

### Breakpoints
- **XS**: 475px
- **SM**: 640px
- **MD**: 768px
- **LG**: 1024px
- **XL**: 1280px
- **2XL**: 1536px
- **3XL**: 1920px

### Usage
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🎨 Best Practices

### Color Usage
1. Use semantic color classes (`bg-background`, `text-text`)
2. Leverage cyber colors for accents and highlights
3. Use vibrant colors for event-related content
4. Maintain contrast ratios for accessibility

### Animation Guidelines
1. Use subtle animations for better UX
2. Provide reduced motion alternatives
3. Cyber effects should enhance, not distract
4. Layer animations for depth

### Component Composition
1. Use design tokens instead of hardcoded values
2. Compose utilities for consistent styling
3. Leverage theme-aware classes
4. Follow the component size system

### Performance
1. Use CSS custom properties for theme switching
2. Optimize animations with `transform` and `opacity`
3. Use `backdrop-blur` sparingly
4. Implement proper loading states

## 🚀 Implementation Examples

### Event Card Component
```tsx
function EventCard({ event }) {
  return (
    <motion.div 
      className="card card-cyber card-md hover:scale-[1.02]"
      whileHover={{ y: -4 }}
    >
      <div className="relative">
        <img 
          src={event.image} 
          className="w-full h-48 object-cover rounded-t-cyber"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold gradient-text mb-2">
          {event.title}
        </h3>
        <p className="text-text-secondary mb-4">
          {event.description}
        </p>
        
        <InteractiveButton 
          variant="vibrant" 
          size="sm"
          className="w-full"
        >
          Join Event
        </InteractiveButton>
      </div>
    </motion.div>
  )
}
```

### Hero Section
```tsx
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 matrix-bg opacity-10" />
      
      <div className="container-cyber text-center relative z-10">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold gradient-text mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Passa
        </motion.h1>
        
        <motion.p 
          className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The future of Web3 events is here
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <InteractiveButton variant="cyber" size="lg">
            Explore Events
          </InteractiveButton>
          <InteractiveButton variant="outline" size="lg">
            Learn More
          </InteractiveButton>
        </motion.div>
      </div>
    </section>
  )
}
```

## 🔄 Migration Guide

### From Old System
1. Replace hardcoded colors with design tokens
2. Update component classes to new system
3. Implement theme provider
4. Add theme toggle components
5. Test both light and dark themes

### Breaking Changes
- Button size classes changed (`btn-sm` → `btn-sm`)
- Color utilities now use design tokens
- Theme classes are now semantic (`bg-background` vs `bg-dark-bg`)

This design system provides a solid foundation for building a modern, accessible, and visually stunning Web3 event platform with proper theming support and consistent styling practices.