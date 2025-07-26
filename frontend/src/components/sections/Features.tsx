import {
  TicketIcon,
  BoltIcon,
  ChartBarIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  PlayIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import GlowingCard from '../ui/GlowingCard'
import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'

const Features = () => {
  const features = [
    {
      icon: TicketIcon,
      title: 'NFT Event Tickets',
      description: 'Revolutionary blockchain tickets that can\'t be counterfeited. Own your ticket as a digital collectible with exclusive perks and resale value.',
      color: 'blue',
      gradient: 'from-stellar-electric to-stellar-plasma',
      bgPattern: '🎫'
    },
    {
      icon: BoltIcon,
      title: 'Instant Settlements',
      description: 'Get paid the moment someone buys your ticket or content. Lightning-fast blockchain payments with zero delays or hidden fees.',
      color: 'purple',
      gradient: 'from-stellar-plasma to-stellar-flare',
      bgPattern: '⚡'
    },
    {
      icon: MusicalNoteIcon,
      title: 'Live Streaming',
      description: 'Stream your events to global audiences with crystal-clear quality. Monetize virtual attendance and reach fans worldwide.',
      color: 'green',
      gradient: 'from-stellar-aurora to-stellar-electric',
      bgPattern: '🎵'
    },
    {
      icon: SparklesIcon,
      title: 'VIP Experiences',
      description: 'Create exclusive backstage access, meet & greets, and premium experiences. Turn your biggest fans into VIP members with special perks.',
      color: 'blue',
      gradient: 'from-stellar-gold to-stellar-electric',
      bgPattern: '✨'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-Time Analytics',
      description: 'Track ticket sales, audience engagement, and revenue in real-time. Make data-driven decisions to maximize your event success.',
      color: 'purple',
      gradient: 'from-stellar-plasma to-stellar-aurora',
      bgPattern: '📊'
    },
    {
      icon: UserGroupIcon,
      title: 'Fan Communities',
      description: 'Build dedicated fan communities around your events. Create lasting relationships with exclusive content, early access, and special rewards.',
      color: 'green',
      gradient: 'from-stellar-aurora to-stellar-gold',
      bgPattern: '👥'
    }
  ]

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stellar-void via-stellar-midnight to-stellar-nebula" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              rotate: [0, 360],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.5,
            }}
          >
            {['🎪', '🎭', '🎨', '🎬', '🎤', '🎸'][i]}
          </motion.div>
        ))}

        {/* Pulsing gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-stellar-electric/10 to-stellar-plasma/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-stellar-aurora/10 to-stellar-gold/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative container-max section-padding">
        {/* Section header */}
        <SectionHeader
          badge="Entertainment Platform"
          badgeColor="primary"
          title="Revolutionizing"
          subtitle="Live Entertainment"
          description="Experience the future of events with blockchain-powered tickets, instant payments, and immersive fan experiences that bring artists and audiences closer than ever before"
        />

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.title}
              direction="up"
              delay={index * 0.1}
              className="h-full"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <GlowingCard
                  glowColor={feature.color as 'blue' | 'purple' | 'green'}
                  className="h-full group cursor-pointer relative overflow-hidden"
                  animated={true}
                >
                  {/* Background pattern */}
                  <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    {feature.bgPattern}
                  </div>

                  <div className="p-8 h-full flex flex-col min-h-[360px] relative z-10">
                    {/* Icon with enhanced animation */}
                    <motion.div 
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 self-start relative`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <feature.icon className="h-8 w-8 text-white relative z-10" />
                      
                      {/* Icon glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-white/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>

                    {/* Title with holographic effect */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:holographic-shift transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors flex-grow">
                      {feature.description}
                    </p>

                    {/* Interactive bottom element */}
                    <div className="mt-6 flex items-center justify-between">
                      <motion.div 
                        className={`h-1 bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500 group-hover:w-full`}
                        initial={{ width: '30%' }}
                        whileHover={{ width: '100%' }}
                      />
                      
                      <motion.div
                        className="text-white/60 group-hover:text-white transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover overlay effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                </GlowingCard>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Call to action section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-stellar-electric/10 to-stellar-plasma/10 backdrop-blur-xl rounded-3xl border border-border/30 p-8 lg:p-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-text mb-4 holographic-shift">
              Ready to Transform Your Events?
            </h3>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already revolutionizing live entertainment with blockchain technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-stellar-primary px-8 py-4 text-lg font-semibold"
              >
                Start Creating Events
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-stellar-ghost px-8 py-4 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <PlayIcon className="h-5 w-5" />
                Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
