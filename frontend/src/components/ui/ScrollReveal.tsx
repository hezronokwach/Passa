import { motion, useInView } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  threshold?: number
}

const ScrollReveal = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: `-${threshold * 100}%` })

  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance }
      case 'down':
        return { opacity: 0, y: -distance }
      case 'left':
        return { opacity: 0, x: distance }
      case 'right':
        return { opacity: 0, x: -distance }
      case 'scale':
        return { opacity: 0, scale: 0.8 }
      case 'fade':
        return { opacity: 0 }
      default:
        return { opacity: 0, y: distance }
    }
  }

  const getAnimateState = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 }
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 }
      case 'scale':
        return { opacity: 1, scale: 1 }
      case 'fade':
        return { opacity: 1 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialState()}
      animate={isInView ? getAnimateState() : getInitialState()}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredRevealProps {
  children: ReactNode[]
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
  staggerDelay?: number
  duration?: number
  distance?: number
  once?: boolean
}

const StaggeredReveal = ({
  children,
  className = '',
  direction = 'up',
  staggerDelay = 0.1,
  duration = 0.6,
  distance = 50,
  once = true,
}: StaggeredRevealProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once })

  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance }
      case 'down':
        return { opacity: 0, y: -distance }
      case 'left':
        return { opacity: 0, x: distance }
      case 'right':
        return { opacity: 0, x: -distance }
      case 'scale':
        return { opacity: 0, scale: 0.8 }
      case 'fade':
        return { opacity: 0 }
      default:
        return { opacity: 0, y: distance }
    }
  }

  const getAnimateState = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 }
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 }
      case 'scale':
        return { opacity: 1, scale: 1 }
      case 'fade':
        return { opacity: 1 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={getInitialState()}
          animate={isInView ? getAnimateState() : getInitialState()}
          transition={{
            duration,
            delay: index * staggerDelay,
            ease: 'easeOut',
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export { ScrollReveal, StaggeredReveal }
