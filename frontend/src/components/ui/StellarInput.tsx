import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { getStellarColor, STELLAR_DESIGN_TOKENS } from '../../utils/colors'

interface StellarInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  variant?: 'default' | 'cyber' | 'glass' | 'stellar'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  required?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  label?: string
  error?: string
  success?: boolean
  glowEffect?: boolean
  name?: string
  id?: string
}

const StellarInput: React.FC<StellarInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  label,
  error,
  success = false,
  glowEffect = false,
  name,
  id,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[2.25rem]',
    md: 'px-4 py-3 text-base min-h-[2.75rem]',
    lg: 'px-5 py-4 text-lg min-h-[3.25rem]',
  }

  const variantClasses = {
    default: 'bg-surface border border-border focus:border-stellar-electric focus:ring-stellar-electric/50',
    cyber: 'input-cyber',
    glass: 'input-glass',
    stellar: 'bg-stellar-midnight/50 border border-stellar-electric/30 focus:border-stellar-electric focus:ring-stellar-electric/50 backdrop-blur-md',
  }

  const baseClasses = `
    block w-full rounded-xl text-text placeholder-text-muted
    transition-all duration-300 ease-stellar
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-stellar-flare focus:border-stellar-flare focus:ring-stellar-flare/50' : ''}
    ${success ? 'border-stellar-aurora focus:border-stellar-aurora focus:ring-stellar-aurora/50' : ''}
    ${glowEffect && isFocused ? 'stellar-pulse' : ''}
  `

  const iconClasses = `
    absolute top-1/2 transform -translate-y-1/2 text-text-muted
    ${iconPosition === 'left' ? 'left-3' : 'right-3'}
    ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
  `

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={id}
          className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
            isFocused ? 'text-stellar-electric' : 'text-text-secondary'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
          {required && <span className="text-stellar-flare ml-1">*</span>}
        </motion.label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}

        {/* Input field */}
        <motion.input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${baseClasses} 
            ${sizeClasses[size]} 
            ${variantClasses[variant]} 
            ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
            ${className}
          `}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: parseFloat(STELLAR_DESIGN_TOKENS.timing.smooth),
            ease: 'easeOut'
          }}
        />

        {/* Focus glow effect */}
        {glowEffect && isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              boxShadow: `0 0 20px ${getStellarColor('electric', 0.3)}`,
            }}
          />
        )}

        {/* Data stream effect */}
        {variant === 'stellar' && isFocused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stellar-electric/20 overflow-hidden rounded-b-xl">
            <motion.div
              className="h-full w-4 bg-gradient-to-r from-transparent via-stellar-electric to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          className="mt-2 text-sm text-stellar-flare flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="w-4 h-4">⚠️</span>
          {error}
        </motion.p>
      )}

      {/* Success message */}
      {success && !error && (
        <motion.p
          className="mt-2 text-sm text-stellar-aurora flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="w-4 h-4">✅</span>
          Input validated successfully
        </motion.p>
      )}
    </div>
  )
}

export default StellarInput