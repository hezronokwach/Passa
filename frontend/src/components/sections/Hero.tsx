import { motion } from 'framer-motion'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative container-max section-padding">
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
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
            >
              🚀 Powered by Stellar Blockchain
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6 leading-tight"
            >
              Transform Kenya's{' '}
              <span className="gradient-text">
                Creator Economy
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl text-balance"
            >
              ConnectSphere unifies Kenya's $123M events industry and creator economy with blockchain-powered transparency, instant payments, and fraud-proof ticketing.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button className="btn-primary btn-lg group">
                Get Started Today
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline btn-lg group">
                <PlayIcon className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-neutral-200"
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-neutral-900">$123M</div>
                <div className="text-sm text-neutral-600">Market Size</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-neutral-900">22M+</div>
                <div className="text-sm text-neutral-600">Internet Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-neutral-900">5sec</div>
                <div className="text-sm text-neutral-600">Settlement</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main illustration placeholder */}
            <div className="relative bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-white/30 rounded w-24"></div>
                    <div className="h-4 bg-white/30 rounded w-16"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/20 rounded w-full"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <div className="h-8 bg-white/30 rounded-lg flex-1"></div>
                    <div className="h-8 bg-white/30 rounded-lg flex-1"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-secondary-500 text-white p-3 rounded-xl shadow-lg"
            >
              🎫 Fraud-Free Tickets
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-primary-500 text-white p-3 rounded-xl shadow-lg"
            >
              ⚡ Instant Payments
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
