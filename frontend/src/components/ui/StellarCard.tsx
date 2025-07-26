import React from 'react'
import { motion } from 'framer-motion'
import { getStellarColor, STELLAR_DESIGN_TOKENS } from '../../utils/colors'

interface StellarCardProps {
  children: React.ReactNode
  variant?: 'default' | 'event' | 'glass' | 'cyber' | 'vibrant'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  hover?: boolean
  glow?: boolean
  pulse?: boolean
  borderGlow?: boolean
  onClick?: () => void
}

const StellarCard: React.FC<StellarCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  hover = true,
  glow = false,
  pulse = false,
  borderGlow = false,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'p-4 rounded-lg',
    md: 'p-6 rounded-xl',
    lg: 'p-8 rounded-2xl',
  }

  const variantClasses = {
    default: 'bg-surface border border-border backdrop-blur-sm',
    event: 'event-card',
    glass: 'glass-panel',
    cyber: 'card-cyber',
    vibrant: 'card-vibrant',
  }

  const baseClasses = `
    transition-all duration-500 ease-stellar
    ${hover ? 'hover:scale-[1.02] hover:-translate-y-2' : ''}
    ${glow ? 'stellar-pulse' : ''}
    ${pulse ? 'stellar-breathe' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `

  return (
    <motion.div
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: parseFloat(STELLAR_DESIGN_TOKENS.timing.dramatic),
        ease: 'easeOut'
      }}
      whileHover={hover ? { 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Border glow effect */}
      {borderGlow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-stellar-electric via-stellar-plasma to-stellar-aurora opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
      )}

      {/* Holographic top border */}
      {variant === 'event' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stellar-electric via-stellar-plasma to-stellar-aurora opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Floating particles effect */}
      {glow && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-stellar-electric rounded-full opacity-60"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default StellarCard