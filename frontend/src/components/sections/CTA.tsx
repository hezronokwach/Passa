import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { ScrollReveal } from '../ui/ScrollReveal'
import ParticleField from '../ui/ParticleField'
import SectionHeader from '../ui/SectionHeader'

const CTA = () => {
  return (
    <section className="relative py-20 lg:py-32 bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
        <ParticleField className="opacity-15" particleCount={15} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container-max section-padding">
        <ScrollReveal direction="up" className="text-center">
          <SectionHeader
            badge="Join the Movement"
            badgeColor="accent"
            title="Ready to Start Your"
            subtitle="Creative Journey?"
            description="Join thousands of creators worldwide who are building their future with ConnectSphere. Start earning, connecting, and growing today."
            className="mb-12"
          />

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-neon hover:shadow-neon-lg group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Start Creating Today
                <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300 px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 backdrop-blur-sm hover:shadow-neon"
            >
              Explore Platform
            </motion.button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-text-secondary">Live & Ready</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-text-secondary">Stellar Blockchain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-text-secondary">Global Community</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default CTA
