import { motion } from 'framer-motion'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'
import BlockchainGrid from '../ui/BlockchainGrid'
import ParticleField from '../ui/ParticleField'

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden min-h-screen flex items-center">
      {/* Dark futuristic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated" />

      {/* Blockchain grid overlay */}
      <BlockchainGrid className="opacity-20" animated={true} />

      {/* Particle field */}
      <ParticleField className="opacity-30" particleCount={30} />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-secondary-500/10" />



      <div className="relative container-max section-padding z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 text-cyber-blue text-sm font-medium mb-8 backdrop-blur-sm shadow-neon"
            >
              <span className="mr-2">⚡</span>
              Powered by Stellar Blockchain
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-8 leading-tight"
            >
              Transform the{' '}
              <span className="relative">
                <span className="gradient-text animate-pulse">
                  Creator Economy
                </span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-cyber-blue/20 to-secondary-500/20 rounded-lg blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl text-balance leading-relaxed"
            >
              Passa revolutionizes the global creator economy with{' '}
              <span className="text-cyber-blue font-semibold">blockchain-powered transparency</span>,{' '}
              <span className="text-accent-500 font-semibold">instant payments</span>, and{' '}
              <span className="text-secondary-500 font-semibold">fraud-proof systems</span>.
              Experience the future of digital creativity and monetization.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <motion.button
                className="btn-primary btn-lg group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Launch Your Journey
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyber-blue/30 to-secondary-500/30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.button>

              <motion.button
                className="btn-outline btn-lg group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Experience Demo</span>
                <div className="absolute inset-0 bg-primary-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-500/20"
            >
              <motion.div
                className="text-center lg:text-left group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold neon-text mb-2">$500B+</div>
                <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Global Market</div>
              </motion.div>
              <motion.div
                className="text-center lg:text-left group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-secondary-400 mb-2">50M+</div>
                <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Creators Worldwide</div>
              </motion.div>
              <motion.div
                className="text-center lg:text-left group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-accent-400 mb-2">&lt;5sec</div>
                <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Settlement Time</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Simplified visual showcase */}
            <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-elevated/80 backdrop-blur-sm rounded-2xl border border-primary-500/30 p-8 hover:border-primary-500/50 transition-all duration-300">
              {/* Main visual */}
              <div className="h-80 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-xl border border-primary-500/20 flex flex-col items-center justify-center mb-6">
                <div className="text-center space-y-6">
                  {/* Logo representation */}
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyber-blue to-secondary-500 rounded-2xl flex items-center justify-center shadow-neon">
                    <span className="text-3xl">🚀</span>
                  </div>

                  {/* Platform info */}
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-50 mb-2">Passa Creator Hub</h3>
                    <p className="text-neutral-400">Where creativity meets opportunity</p>
                  </div>

                  {/* Simple metrics */}
                  <div className="flex justify-center space-x-8 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyber-blue">50M+</div>
                      <div className="text-xs text-neutral-500">Creators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary-400">24/7</div>
                      <div className="text-xs text-neutral-500">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-400">&lt;5s</div>
                      <div className="text-xs text-neutral-500">Payments</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-center space-x-2 text-accent-400">
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Platform Live & Ready</span>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-4 rounded-xl shadow-neon-purple backdrop-blur-sm border border-secondary-400/30"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">🛡️</span>
                <span className="font-medium">Fraud-Proof</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [10, -10, 10],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-xl shadow-neon backdrop-blur-sm border border-primary-400/30"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚡</span>
                <span className="font-medium">Instant Settle</span>
              </div>
            </motion.div>

            
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
