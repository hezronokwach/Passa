import React from 'react'
import { motion } from 'framer-motion'
import { getStellarColor, getStellarGradient, STELLAR_DESIGN_TOKENS } from '../../utils/colors'

interface StellarButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'plasma' | 'aurora' | 'flare' | 'gold'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  glowEffect?: boolean
  shimmerEffect?: boolean
  pulseEffect?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const StellarButton: React.FC<StellarButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  icon,
  iconPosition = 'left',
  glowEffect = false,
  shimmerEffect = false,
  pulseEffect = false,
  type = 'button',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[2.25rem]',
    md: 'px-6 py-3 text-base min-h-[2.75rem]',
    lg: 'px-8 py-4 text-lg min-h-[3.25rem]',
    xl: 'px-10 py-5 text-xl min-h-[3.75rem]',
  }

  const variantClasses = {
    primary: 'btn-stellar-primary',
    ghost: 'btn-stellar-ghost',
    plasma: 'bg-gradient-to-r from-stellar-plasma to-stellar-electric text-white hover:shadow-neon-lg',
    aurora: 'bg-gradient-to-r from-stellar-aurora to-stellar-electric text-white hover:shadow-neon-green',
    flare: 'bg-gradient-to-r from-stellar-flare to-stellar-plasma text-white hover:shadow-neon-lg',
    gold: 'bg-gradient-to-r from-stellar-gold to-stellar-electric text-black hover:shadow-neon-lg',
  }

  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-300 ease-stellar
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stellar-electric
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
    transform hover:scale-105 active:scale-95
    ${disabled ? 'pointer-events-none' : ''}
    ${glowEffect ? 'stellar-pulse' : ''}
    ${shimmerEffect ? 'stellar-shimmer' : ''}
    ${pulseEffect ? 'stellar-breathe' : ''}
  `

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: parseFloat(STELLAR_DESIGN_TOKENS.timing.smooth),
        ease: 'easeOut'
      }}
    >
      {/* Shimmer effect overlay */}
      {shimmerEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[stellarShimmer_2s_infinite]" />
      )}

      {/* Electric surge effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              `0 0 0 0 ${getStellarColor('electric', 0.7)}`,
              `0 0 0 10px ${getStellarColor('electric', 0)}`,
              `0 0 0 0 ${getStellarColor('electric', 0.7)}`,
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>

      {/* Holographic border effect */}
      <div className="absolute inset-0 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  )
}

export default StellarButton