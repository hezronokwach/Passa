import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../ui/Logo'
import BlockchainGrid from '../ui/BlockchainGrid'

const Footer = () => {
  const navigation = {
    platform: [
      { name: 'Events', href: '/events' },
      { name: 'Creators', href: '/creators' },
      { name: 'Brands', href: '/brands' },
      { name: 'How it Works', href: '/how-it-works' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Help Center', href: '/help' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  }

  return (
    <footer className="relative bg-dark-bg border-t border-primary-500/20 overflow-hidden">
      {/* Background elements */}
      <BlockchainGrid className="opacity-5" animated={true} />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-surface/30 to-transparent" />

      <div className="relative container-max section-padding py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <Logo />
                </div>
                <span className="text-2xl font-display font-bold gradient-text">
                  Passa
                </span>
              </Link>
              <p className="text-neutral-300 mb-8 max-w-sm leading-relaxed">
                Revolutionizing the global creator economy with cutting-edge blockchain technology,
                AI-powered insights, and seamless connectivity.
              </p>
              <div className="flex space-x-6">
                <motion.a
                  href="#"
                  className="text-neutral-400 hover:text-cyber-blue transition-all duration-300 text-2xl"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Twitter</span>
                  🐦
                </motion.a>
                <motion.a
                  href="#"
                  className="text-neutral-400 hover:text-secondary-400 transition-all duration-300 text-2xl"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">LinkedIn</span>
                  💼
                </motion.a>
                <motion.a
                  href="#"
                  className="text-neutral-400 hover:text-accent-400 transition-all duration-300 text-2xl"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Instagram</span>
                  📸
                </motion.a>
                <motion.a
                  href="#"
                  className="text-neutral-400 hover:text-cyber-pink transition-all duration-300 text-2xl"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Discord</span>
                  🎮
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Navigation sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-neutral-50 font-bold mb-6 text-lg">Platform</h3>
            <ul className="space-y-3">
              {navigation.platform.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={item.href}
                    className="text-neutral-400 hover:text-cyber-blue transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          className="border-t border-primary-500/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-neutral-400 text-sm">
            © 2025 Passa. All rights reserved. Built on{' '}
            <span className="text-cyber-blue font-medium">Stellar Blockchain</span>.
          </p>
          <p className="text-neutral-400 text-sm mt-4 md:mt-0">
            Made with <span className="text-red-400">❤️</span> for creators worldwide{' '}
            <span className="text-cyber-blue">🌍</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
