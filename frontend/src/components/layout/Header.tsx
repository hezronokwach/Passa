import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '../ui/Logo'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Events', href: '/events' },
    { name: 'Creators', href: '/creators' },
    { name: 'Brands', href: '/brands' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-xl border-b border-primary-500/20 shadow-cyber">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5"></div>
      <nav className="container-max section-padding relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              <Logo />
            </div>
            <span className="text-xl font-display font-bold gradient-text hover:animate-pulse">
              Passa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className="relative text-neutral-300 hover:text-cyber-blue transition-all duration-300 font-medium group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-primary-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyber-blue to-secondary-500 group-hover:w-full transition-all duration-300"></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signin">
              <motion.button
                className="btn-ghost hover:shadow-neon"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                className="btn-primary relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-secondary-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-dark-surface hover:shadow-neon text-neutral-300 hover:text-cyber-blue transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden py-6 border-t border-primary-500/20 mt-4 bg-dark-surface/50 backdrop-blur-sm rounded-lg mx-4"
          >
            <div className="flex flex-col space-y-4 px-4">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="block text-neutral-300 hover:text-cyber-blue transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-primary-500/10 hover:shadow-neon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-primary-500/20">
                <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    className="btn-ghost justify-start w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    className="btn-primary justify-start w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}

export default Header
