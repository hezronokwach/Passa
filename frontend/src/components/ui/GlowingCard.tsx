import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { COLORS } from '../../utils/colors'

interface GlowingCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'pink'
  intensity?: 'low' | 'medium' | 'high'
  animated?: boolean
}

const GlowingCard = ({ 
  children, 
  className = '', 
  glowColor = 'blue',
  intensity = 'medium',
  animated = true
}: GlowingCardProps) => {
  const glowColors = {
    blue: COLORS.CYBER_BLUE_HEX,
    purple: COLORS.CYBER_PURPLE_HEX,
    green: COLORS.CYBER_GREEN_HEX,
    pink: COLORS.CYBER_PINK_HEX,
  }

  const intensityValues = {
    low: { blur: 10, spread: 5 },
    medium: { blur: 20, spread: 10 },
    high: { blur: 30, spread: 15 },
  }

  const color = glowColors[glowColor]
  const { blur, spread } = intensityValues[intensity]

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={animated ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-xl ${animated ? 'animate-pulse-glow' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${color}20, transparent)`,
          boxShadow: `0 0 ${blur}px ${color}40, 0 0 ${spread}px ${color}20`,
        }}
      />
      
      {/* Card content */}
      <div className="relative bg-surface/80 backdrop-blur-sm rounded-xl border border-border hover:border-primary-500/50 transition-all duration-300 overflow-hidden h-full">
        {/* Inner glow */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export default GlowingCard
