import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const CTA = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Ready to Transform Your
            <br />
            <span className="text-secondary-200">Entertainment Business?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join the future of Kenya's creator economy. Get started with ConnectSphere today and experience blockchain-powered transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors group"
            >
              Start Your Journey
              <ArrowRightIcon className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Schedule Demo
            </motion.button>
          </div>

          <div className="mt-12 pt-8 border-t border-primary-500">
            <p className="text-primary-200 text-sm">
              🚀 Launching Q2 2024 • Built on Stellar Blockchain • Made in Kenya 🇰🇪
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
