import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { getCyberBlue } from '../../utils/colors'

interface InteractiveButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  glowEffect?: boolean
  rippleEffect?: boolean
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
}: InteractiveButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

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

  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 shadow-neon hover:shadow-neon-lg',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-500 hover:to-secondary-600 shadow-neon-purple',
    outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300 hover:shadow-neon',
    ghost: 'text-neutral-400 hover:bg-dark-surface hover:text-neutral-200',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center font-medium rounded-lg 
        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-offset-dark-bg focus:ring-primary-500 overflow-hidden
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      animate={glowEffect && !disabled ? {
        boxShadow: [
          `0 0 5px ${getCyberBlue(0.3)}`,
          `0 0 20px ${getCyberBlue(0.5)}`,
          `0 0 5px ${getCyberBlue(0.3)}`,
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Content */}
      <span className="relative z-10">{children}</span>

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
          transition={{ duration: 0.6 }}
        />
      ))}

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

export default InteractiveButton
