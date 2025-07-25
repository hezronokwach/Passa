import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'

interface SectionHeaderProps {
  badge?: string
  badgeColor?: 'primary' | 'secondary' | 'accent' | 'cyber'
  title: string
  subtitle?: string
  description?: string
  className?: string
  centered?: boolean
}

const SectionHeader = ({
  badge,
  badgeColor = 'primary',
  title,
  subtitle,
  description,
  className = '',
  centered = true
}: SectionHeaderProps) => {
  const getBadgeColors = () => {
    switch (badgeColor) {
      case 'primary':
        return 'bg-gradient-to-r from-primary-500/20 to-cyber-blue/20 border-primary-500/30 text-cyber-blue'
      case 'secondary':
        return 'bg-gradient-to-r from-secondary-500/20 to-accent-500/20 border-secondary-500/30 text-secondary-400'
      case 'accent':
        return 'bg-gradient-to-r from-accent-500/20 to-primary-500/20 border-accent-500/30 text-accent-400'
      case 'cyber':
        return 'bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border-cyber-blue/30 text-cyber-blue'
      default:
        return 'bg-gradient-to-r from-primary-500/20 to-cyber-blue/20 border-primary-500/30 text-cyber-blue'
    }
  }

  return (
    <ScrollReveal 
      direction="up" 
      className={`${centered ? 'text-center' : ''} mb-16 lg:mb-20 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {badge && (
          <div className={`inline-block px-6 py-3 rounded-full ${getBadgeColors()} border mb-6`}>
            <span className="font-medium">{badge}</span>
          </div>
        )}
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text mb-6 leading-tight">
          {title}
          {subtitle && (
            <span className="gradient-text"> {subtitle}</span>
          )}
        </h2>
        
        {description && (
          <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>
    </ScrollReveal>
  )
}

export default SectionHeader