import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
  direction: number
}

interface ParticleFieldProps {
  className?: string
  particleCount?: number
  colors?: string[]
}

const ParticleField = ({ 
  className = '', 
  particleCount = 50,
  colors = ['#00d4ff', '#8b5cf6', '#00ff88', '#ff0080']
}: ParticleFieldProps) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 0.5,
      direction: Math.random() * 360,
    }))
    setParticles(newParticles)
  }, [particleCount, colors])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
          }}
          animate={{
            x: [
              `${particle.x}%`,
              `${(particle.x + Math.cos(particle.direction) * 20) % 100}%`,
              `${particle.x}%`,
            ],
            y: [
              `${particle.y}%`,
              `${(particle.y + Math.sin(particle.direction) * 20) % 100}%`,
              `${particle.y}%`,
            ],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: particle.speed * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default ParticleField
