import { motion } from 'framer-motion'

interface BlockchainGridProps {
  className?: string
  animated?: boolean
  opacity?: number
}

const BlockchainGrid = ({ 
  className = '', 
  animated = true, 
  opacity = 0.1 
}: BlockchainGridProps) => {
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{ opacity }}
    >
      <div 
        className={`w-full h-full ${animated ? 'animate-cyber-grid' : ''}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, ${opacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, ${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Intersection points */}
      {animated && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyber-blue rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BlockchainGrid
