import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { getCyberBlue, getCyberColor, getVibrantColor } from '../../utils/colors'
import { ANIMATION, COMPONENT_SIZES } from '../../utils/constants'

interface InteractiveButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent' | 'cyber' | 'vibrant' | 'outline' | 'ghost' | 'glass'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  disabled?: boolean
  glowEffect?: boolean
  rippleEffect?: boolean
  pulseEffect?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const InteractiveButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  glowEffect = true,
  rippleEffect = true,
  pulseEffect = false,
  loading = false,
  icon,
  iconPosition = 'left',
}: InteractiveButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    if (rippleEffect) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }
      
      setRipples(prev => [...prev, newRipple])
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }

    onClick?.()
  }

  const getVariantClasses = () => {
    const baseClasses = 'btn'
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} btn-primary`
      case 'secondary':
        return `${baseClasses} btn-secondary`
      case 'accent':
        return `${baseClasses} btn-accent`
      case 'cyber':
        return `${baseClasses} btn-cyber`
      case 'vibrant':
        return `${baseClasses} btn-vibrant`
      case 'outline':
        return `${baseClasses} btn-outline`
      case 'ghost':
        return `${baseClasses} btn-ghost`
      case 'glass':
        return `${baseClasses} btn-glass`
      default:
        return `${baseClasses} btn-primary`
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'btn-xs'
      case 'sm':
        return 'btn-sm'
      case 'md':
        return 'btn-md'
      case 'lg':
        return 'btn-lg'
      case 'xl':
        return 'btn-xl'
      default:
        return 'btn-md'
    }
  }

  const getGlowAnimation = () => {
    if (!glowEffect || disabled || loading) return {}
    
    switch (variant) {
      case 'cyber':
        return {
          boxShadow: [
            `0 0 5px ${getCyberColor('blue', 0.3)}`,
            `0 0 20px ${getCyberColor('blue', 0.6)}`,
            `0 0 5px ${getCyberColor('blue', 0.3)}`,
          ]
        }
      case 'vibrant':
        return {
          boxShadow: [
            `0 0 5px ${getVibrantColor('electric', 0.3)}`,
            `0 0 20px ${getVibrantColor('electric', 0.6)}`,
            `0 0 5px ${getVibrantColor('electric', 0.3)}`,
          ]
        }
      default:
        return {
          boxShadow: [
            `0 0 5px ${getCyberBlue(0.3)}`,
            `0 0 20px ${getCyberBlue(0.5)}`,
            `0 0 5px ${getCyberBlue(0.3)}`,
          ]
        }
    }
  }

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2 flex-shrink-0">{icon}</span>
      )}
      
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        children
      )}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2 flex-shrink-0">{icon}</span>
      )}
    </>
  )

  return (
    <motion.button
      className={`
        ${getVariantClasses()} ${getSizeClasses()} ${className}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${pulseEffect ? 'animate-pulse-glow' : ''}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.05 }}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
      animate={getGlowAnimation()}
      transition={{ 
        duration: ANIMATION.GLOW_CYCLE / 1000, 
        repeat: glowEffect ? Infinity : 0,
        ease: 'easeInOut'
      }}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {renderContent()}
      </span>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 rounded-cyber"
        whileHover={{ opacity: disabled || loading ? 0 : 1 }}
        transition={{ duration: ANIMATION.FAST / 1000 }}
      />

      {/* Scan line effect for cyber variant */}
      {variant === 'cyber' && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-blue/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'linear'
          }}
        />
      )}
    </motion.button>
  )
}

export default InteractiveButton
