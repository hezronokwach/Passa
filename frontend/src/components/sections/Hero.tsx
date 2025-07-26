import { motion } from 'framer-motion'
import { PlayIcon, SparklesIcon, TicketIcon, CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import StellarButton from '../ui/StellarButton'
import ThemeToggle from '../ui/ThemeToggle'

const Hero = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  // Featured events carousel data
  const featuredEvents = [
    {
      id: 1,
      title: "Stellar Nights Festival",
      date: "Dec 31, 2025",
      location: "Miami Beach",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&crop=center",
      genre: "Electronic",
      attendees: "50K+",
      price: "From $89"
    },
    {
      id: 2,
      title: "Cosmic Beats Arena",
      date: "Jan 15, 2025",
      location: "Los Angeles",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
      genre: "Hip-Hop",
      attendees: "25K+",
      price: "From $65"
    },
    {
      id: 3,
      title: "Neon Dreams Concert",
      date: "Feb 8, 2025",
      location: "New York",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop&crop=center",
      genre: "Pop",
      attendees: "35K+",
      price: "From $120"
    }
  ]

  // Auto-rotate events every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [featuredEvents.length])

  const currentEvent = featuredEvents[currentEventIndex]

  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle variant="icon" className="bg-surface/80 backdrop-blur-md border border-border/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" />
      </div>

      {/* Dynamic Background with Event Image */}
      <div className="absolute inset-0">
        <motion.div
          key={currentEvent.id}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentEvent.image})`,
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background-overlay/80 via-background-overlay/60 to-background-overlay/40" />
        {/* Stellar gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-stellar-electric/20 via-transparent to-stellar-plasma/20" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating music notes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-text/10 text-4xl"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              rotate: [0, 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          >
            ♪
          </motion.div>
        ))}

        {/* Pulsing circles */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border-2 border-stellar-electric/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/5 w-24 h-24 rounded-full border-2 border-stellar-plasma/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative container-max section-padding z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center w-full max-w-7xl mx-auto">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left space-y-8 lg:space-y-12"
          >
            {/* Live Event Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-stellar-flare/15 to-stellar-flare/20 border border-stellar-flare/30 text-stellar-flare text-xs font-semibold tracking-wider mb-12 backdrop-blur-md shadow-lg shadow-stellar-flare/10"
            >
              <div className="w-1.5 h-1.5 bg-stellar-flare rounded-full mr-2.5 animate-pulse" />
              LIVE EVENTS HAPPENING NOW
            </motion.div>

            {/* Main Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display font-black text-text mb-12 leading-[0.85] tracking-tight"
              style={{
                fontSize: 'clamp(3rem, 10vw, 7rem)',
                textShadow: '0 4px 20px rgb(var(--color-background-overlay) / 0.5)'
              }}
            >
              <span className="block">
                Experience{' '}
                <span className="relative inline-block">
                  <span className="holographic-shift">
                    Epic
                  </span>
                </span>
              </span>
              <span className="block mt-2">
                <span className="neon-glow-electric font-extrabold">
                  Entertainment
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl font-light text-text-secondary mb-12 max-w-2xl leading-relaxed tracking-wide"
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                lineHeight: '1.7'
              }}
            >
              Discover unforgettable concerts, festivals, and live events powered by{' '}
              <span className="neon-glow-electric font-medium text-stellar-electric">blockchain technology</span>.{' '}
              Secure tickets, exclusive access, and{' '}
              <span className="neon-glow-aurora font-medium text-stellar-aurora">transparent pricing</span> for the ultimate entertainment experience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-16"
            >
              <StellarButton
                variant="primary"
                size="xl"
                icon={<TicketIcon className="h-5 w-5" />}
                iconPosition="right"
                glowEffect={true}
                shimmerEffect={true}
                className="font-semibold tracking-wide"
              >
                Get Tickets Now
              </StellarButton>

              <StellarButton
                variant="ghost"
                size="xl"
                icon={<PlayIcon className="h-5 w-5" />}
                iconPosition="left"
                pulseEffect={true}
                className="font-medium tracking-wide border-2 border-border/40 hover:border-border-accent backdrop-blur-md"
              >
                Watch Trailer
              </StellarButton>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-10 lg:gap-12"
            >
              <motion.div
                className="text-center lg:text-left group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl lg:text-5xl font-black neon-glow-electric mb-3 stellar-breathe tracking-tight">500+</div>
                <div className="text-sm font-medium text-text-muted group-hover:text-text transition-colors tracking-wider uppercase">Live Events</div>
              </motion.div>
              <motion.div
                className="text-center lg:text-left group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl lg:text-5xl font-black neon-glow-plasma mb-3 stellar-breathe animation-delay-200 tracking-tight">2M+</div>
                <div className="text-sm font-medium text-text-muted group-hover:text-text transition-colors tracking-wider uppercase">Happy Fans</div>
              </motion.div>
              <motion.div
                className="text-center lg:text-left group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl lg:text-5xl font-black neon-glow-aurora mb-3 stellar-breathe animation-delay-400 tracking-tight">100%</div>
                <div className="text-sm font-medium text-text-muted group-hover:text-text transition-colors tracking-wider uppercase">Secure</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right column - Featured Event Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center"
          >
            {/* Main Event Card */}
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="group relative bg-surface/80 backdrop-blur-2xl rounded-[2rem] border border-border/30 overflow-hidden shadow-2xl hover:shadow-stellar-electric/15 transition-all duration-500"
              style={{
                perspective: '1000px'
              }}
            >
              {/* Event Image */}
              <div className="relative h-72 overflow-hidden rounded-t-[2rem]">
                <motion.img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-overlay/70 via-background-overlay/20 to-transparent" />

                {/* Genre Badge */}
                <div className="absolute top-5 left-5 px-4 py-2 bg-gradient-to-r from-stellar-electric/90 to-stellar-electric/80 text-text text-xs font-semibold rounded-2xl backdrop-blur-md shadow-lg border border-stellar-electric/30 tracking-wide">
                  {currentEvent.genre}
                </div>             
              </div>

              {/* Event Details */}
              <div className="p-8">
                <h3 className="text-2xl font-black text-text mb-5 tracking-tight leading-tight">
                  <span className="holographic-shift">
                    {currentEvent.title}
                  </span>
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-text-secondary group/item hover:text-text transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stellar-electric/10 border border-stellar-electric/20 mr-4 group-hover/item:bg-stellar-electric/20 transition-colors">
                      <CalendarDaysIcon className="h-5 w-5 text-stellar-electric" />
                    </div>
                    <span className="font-medium tracking-wide">{currentEvent.date}</span>
                  </div>
                  <div className="flex items-center text-text-secondary group/item hover:text-text transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stellar-plasma/10 border border-stellar-plasma/20 mr-4 group-hover/item:bg-stellar-plasma/20 transition-colors">
                      <SparklesIcon className="h-5 w-5 text-stellar-plasma" />
                    </div>
                    <span className="font-medium tracking-wide">{currentEvent.location}</span>
                  </div>
                  <div className="flex items-center text-text-secondary group/item hover:text-text transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stellar-aurora/10 border border-stellar-aurora/20 mr-4 group-hover/item:bg-stellar-aurora/20 transition-colors">
                      <UserGroupIcon className="h-5 w-5 text-stellar-aurora" />
                    </div>
                    <span className="font-medium tracking-wide">{currentEvent.attendees} Expected</span>
                  </div>
                </div>

                {/* Action Button */}
                <StellarButton
                  variant="primary"
                  size="lg"
                  className="w-full font-semibold tracking-wide"
                  glowEffect={true}
                  shimmerEffect={true}
                >
                  Book Now
                </StellarButton>
              </div>

              {/* Enhanced Glow Effect */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-stellar-electric/15 via-stellar-plasma/15 to-stellar-aurora/15 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
              <div className="absolute inset-0 rounded-[2rem] border border-stellar-electric/20 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
            </motion.div>

            {/* Event Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-4">
              {featuredEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEventIndex(index)}
                  className={`relative w-4 h-4 rounded-full transition-all duration-500 transform hover:scale-125 ${
                    index === currentEventIndex
                      ? 'bg-stellar-electric shadow-lg shadow-stellar-electric/50 scale-110'
                      : 'bg-border hover:bg-border-accent border border-border'
                  }`}
                >
                  {index === currentEventIndex && (
                    <div className="absolute inset-0 rounded-full bg-stellar-electric animate-ping opacity-30" />
                  )}
                </button>
              ))}
            </div>

            {/* Modern Floating Elements */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
                rotate: [0, 3, 0, -3, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 bg-gradient-to-br from-stellar-plasma/90 to-stellar-flare/90 text-text p-5 rounded-2xl backdrop-blur-xl border border-stellar-plasma/20 shadow-2xl shadow-stellar-plasma/20 hover:shadow-stellar-plasma/40 transition-all duration-500"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-surface/40 flex items-center justify-center">
                  <span className="text-lg">🎵</span>
                </div>
                <span className="font-semibold tracking-wide text-sm">Live Music</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [8, -8, 8],
                rotate: [0, -3, 0, 3, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-gradient-to-br from-stellar-electric/90 to-stellar-aurora/90 text-text p-5 rounded-2xl backdrop-blur-xl border border-stellar-electric/20 shadow-2xl shadow-stellar-electric/20 hover:shadow-stellar-electric/40 transition-all duration-500"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-surface/40 flex items-center justify-center">
                  <span className="text-lg">🎫</span>
                </div>
                <span className="font-semibold tracking-wide text-sm">NFT Tickets</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modern Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 group cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-12 border-2 border-border/50 rounded-2xl flex justify-center backdrop-blur-sm bg-surface/20 group-hover:border-stellar-electric/50 transition-all duration-300"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-4 bg-gradient-to-b from-stellar-electric to-stellar-aurora rounded-full mt-2 group-hover:shadow-lg group-hover:shadow-stellar-electric/50 transition-all duration-300"
          />
        </motion.div>
        <div className="text-xs text-text-muted text-center mt-3 font-medium tracking-wider uppercase">Scroll</div>
      </motion.div>
    </section>
  )
}

export default Hero
