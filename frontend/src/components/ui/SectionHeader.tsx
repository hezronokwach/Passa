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
        return 'bg-gradient-to-r from-stellar-electric/20 to-stellar-plasma/20 border-stellar-electric/30 text-stellar-electric'
      case 'secondary':
        return 'bg-gradient-to-r from-stellar-plasma/20 to-stellar-aurora/20 border-stellar-plasma/30 text-stellar-plasma'
      case 'accent':
        return 'bg-gradient-to-r from-stellar-aurora/20 to-stellar-electric/20 border-stellar-aurora/30 text-stellar-aurora'
      case 'cyber':
        return 'bg-gradient-to-r from-stellar-electric/20 to-stellar-plasma/20 border-stellar-electric/30 text-stellar-electric'
      default:
        return 'bg-gradient-to-r from-stellar-electric/20 to-stellar-plasma/20 border-stellar-electric/30 text-stellar-electric'
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
          <div className={`inline-block px-6 py-3 rounded-full ${getBadgeColors()} border mb-6 backdrop-blur-sm`}>
            <span className="font-medium">{badge}</span>
          </div>
        )}

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text mb-6 leading-tight">
          {title}
          {subtitle && (
            <span className="holographic-shift"> {subtitle}</span>
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