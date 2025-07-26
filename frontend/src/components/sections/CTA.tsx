import { motion } from 'framer-motion'
import { ArrowRightIcon, TicketIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { ScrollReveal } from '../ui/ScrollReveal'
import { useState } from 'react'

const CTA = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Concert Stage Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-stellar-midnight to-stellar-void" />
        
        {/* Stage Lights Effect */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-full bg-gradient-to-b from-transparent via-stellar-electric/20 to-transparent"
              style={{
                left: `${10 + i * 12}%`,
                transform: `rotate(${-45 + i * 10}deg)`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Crowd Silhouette Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Floating Concert Elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${5 + i * 8}%`,
              bottom: `${10 + (i % 3) * 15}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              rotate: [0, 15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            {['🎤', '🎸', '🥁', '🎹'][i % 4]}
          </motion.div>
        ))}

        {/* Pulsing Stage Lights */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-stellar-electric/20 to-stellar-plasma/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-stellar-aurora/20 to-stellar-gold/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative container-max section-padding">
        <ScrollReveal direction="up" className="text-center">
          {/* Main CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-stellar-electric/20 to-stellar-plasma/20 border border-stellar-electric/30 text-stellar-electric text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <SparklesIcon className="mr-2 h-4 w-4" />
              The Future of Entertainment is Here
            </motion.div>

            {/* Main Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-display font-black text-text mb-6 leading-tight"
            >
              Ready to{' '}
              <span className="holographic-shift">
                Rock
              </span>{' '}
              the{' '}
              <span className="neon-glow-electric">
                Stage?
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Join the revolution of live entertainment. Create unforgettable events, connect with fans worldwide, and earn with every beat.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <motion.button
                onHoverStart={() => setHoveredButton('create')}
                onHoverEnd={() => setHoveredButton(null)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-r from-stellar-electric to-stellar-plasma text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 group overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <TicketIcon className="mr-3 h-6 w-6" />
                  Create Your Event
                  <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
                
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: hoveredButton === 'create' ? 1 : 0,
                    scale: hoveredButton === 'create' ? 1.1 : 0.8
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  animate={{ x: hoveredButton === 'create' ? '200%' : '-100%' }}
                  transition={{ duration: 0.8 }}
                />
              </motion.button>

              <motion.button
                onHoverStart={() => setHoveredButton('explore')}
                onHoverEnd={() => setHoveredButton(null)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative border-2 border-stellar-electric text-stellar-electric hover:bg-stellar-electric/10 px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 backdrop-blur-sm group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <PlayIcon className="mr-3 h-6 w-6" />
                  Watch Demo
                </span>
                
                {/* Border glow effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-stellar-electric rounded-2xl"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ 
                    opacity: hoveredButton === 'explore' ? 1 : 0,
                    scale: hoveredButton === 'explore' ? 1.05 : 1
                  }}
                  style={{
                    boxShadow: hoveredButton === 'explore' ? '0 0 30px rgba(0, 212, 255, 0.5)' : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: '🎪', number: '10K+', label: 'Events Created', color: 'stellar-electric' },
                { icon: '🎵', number: '500K+', label: 'Tickets Sold', color: 'stellar-plasma' },
                { icon: '🌟', number: '2M+', label: 'Happy Fans', color: 'stellar-aurora' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold neon-glow-${stat.color.split('-')[1]} mb-2 stellar-breathe`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stellar-void to-transparent" />
    </section>
  )
}

export default CTA
