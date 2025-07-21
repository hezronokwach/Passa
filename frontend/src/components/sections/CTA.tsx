import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { ScrollReveal } from '../ui/ScrollReveal'
import ParticleField from '../ui/ParticleField'

const CTA = () => {
  return (
    <section className="relative py-20 lg:py-32 bg-dark-bg overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
        <ParticleField className="opacity-15" particleCount={15} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container-max section-padding">
        <ScrollReveal direction="up" className="text-center">
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-500/30 mb-8">
            <span className="text-accent-400 font-medium">Join the Movement</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-8">
            Ready to Transform
            <br />
            <span className="gradient-text">Your Creative Journey?</span>
          </h2>

          <p className="text-xl md:text-2xl text-neutral-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of creators worldwide who are building their future with Passa.
            Start earning, connecting, and growing today.
          </p>

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
              <div className="text-neutral-400">Live & Ready</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-neutral-400">Stellar Blockchain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-neutral-400">Global Community</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default CTA
