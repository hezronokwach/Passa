import { motion } from 'framer-motion'

interface HexagonPatternProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
  opacity?: number
}

const HexagonPattern = ({ 
  className = '', 
  size = 'medium',
  animated = true,
  opacity = 0.1
}: HexagonPatternProps) => {
  const sizes = {
    small: 30,
    medium: 50,
    large: 80,
  }

  const hexSize = sizes[size]

  const createHexagonPath = (centerX: number, centerY: number, radius: number) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return `M${points.join('L')}Z`
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="w-full h-full" style={{ opacity }}>
        <defs>
          <pattern
            id="hexagonPattern"
            x="0"
            y="0"
            width={hexSize * 1.5}
            height={hexSize * Math.sqrt(3)}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={createHexagonPath(hexSize * 0.75, hexSize * Math.sqrt(3) * 0.5, hexSize * 0.4)}
              fill="none"
              stroke="url(#hexGradient)"
              strokeWidth="1"
              className={animated ? 'animate-neon-flicker' : ''}
            />
          </pattern>
          
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#hexagonPattern)" />
        
        {/* Floating hexagons */}
        {animated && Array.from({ length: 8 }).map((_, i) => (
          <motion.path
            key={i}
            d={createHexagonPath(
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 10 + 5
            )}
            fill="none"
            stroke="url(#hexGradient)"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default HexagonPattern
