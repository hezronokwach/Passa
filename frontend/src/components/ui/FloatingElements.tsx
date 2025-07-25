import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { COLORS } from '../../utils/colors'

interface FloatingElementProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'circular'
}

const FloatingElement = ({
  children,
  className = '',
  delay = 0,
  duration = 3,
  distance = 20,
  direction = 'up',
}: FloatingElementProps) => {
  const getAnimation = () => {
    switch (direction) {
      case 'up':
        return { y: [-distance, distance, -distance] }
      case 'down':
        return { y: [distance, -distance, distance] }
      case 'left':
        return { x: [-distance, distance, -distance] }
      case 'right':
        return { x: [distance, -distance, distance] }
      case 'circular':
        return {
          x: [0, distance, 0, -distance, 0],
          y: [0, -distance, 0, distance, 0],
        }
      default:
        return { y: [-distance, distance, -distance] }
    }
  }

  return (
    <motion.div
      className={className}
      animate={getAnimation()}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

interface PulsingElementProps {
  children: ReactNode
  className?: string
  scale?: [number, number]
  duration?: number
  delay?: number
}

const PulsingElement = ({
  children,
  className = '',
  scale = [1, 1.1],
  duration = 2,
  delay = 0,
}: PulsingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{ scale }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

interface RotatingElementProps {
  children: ReactNode
  className?: string
  duration?: number
  direction?: 'clockwise' | 'counterclockwise'
  continuous?: boolean
}

const RotatingElement = ({
  children,
  className = '',
  duration = 10,
  direction = 'clockwise',
  continuous = true,
}: RotatingElementProps) => {
  const rotation = direction === 'clockwise' ? 360 : -360

  return (
    <motion.div
      className={className}
      animate={{ rotate: continuous ? rotation : [0, rotation, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: continuous ? 'linear' : 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

interface GlowingElementProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: 'low' | 'medium' | 'high'
  duration?: number
}

const GlowingElement = ({
  children,
  className = '',
  glowColor = COLORS.CYBER_BLUE_HEX,
  intensity = 'medium',
  duration = 2,
}: GlowingElementProps) => {
  const intensityValues = {
    low: { blur: 5, spread: 2 },
    medium: { blur: 10, spread: 5 },
    high: { blur: 20, spread: 10 },
  }

  const { blur, spread } = intensityValues[intensity]

  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 ${blur}px ${glowColor}40, 0 0 ${spread}px ${glowColor}20`,
          `0 0 ${blur * 2}px ${glowColor}60, 0 0 ${spread * 2}px ${glowColor}40`,
          `0 0 ${blur}px ${glowColor}40, 0 0 ${spread}px ${glowColor}20`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export { FloatingElement, PulsingElement, RotatingElement, GlowingElement }
