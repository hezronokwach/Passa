import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const EventsPage = () => {
  const sampleEvents = [
    { id: 1, title: 'Digital Art Showcase', category: 'Art', date: 'Dec 15, 2025', price: '25 USDC' },
    { id: 2, title: 'Music Festival Live', category: 'Music', date: 'Dec 20, 2025', price: '50 USDC' },
    { id: 3, title: 'Tech Creator Summit', category: 'Technology', date: 'Jan 5, 2025', price: '75 USDC' },
    { id: 4, title: 'Photography Workshop', category: 'Education', date: 'Jan 12, 2025', price: '30 USDC' },
    { id: 5, title: 'Gaming Tournament', category: 'Gaming', date: 'Jan 18, 2025', price: '40 USDC' },
    { id: 6, title: 'Creator Networking', category: 'Networking', date: 'Jan 25, 2025', price: 'Free' },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center mb-16">
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-6">
                <span className="text-primary-400 font-medium">Discover Events</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-6">
                Amazing Events
                <br />
                <span className="gradient-text">Powered by Blockchain</span>
              </h1>
              <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover incredible events from creators worldwide. Secure tickets, instant payments, and authentic experiences guaranteed.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 bg-dark-bg">
          <div className="container-max section-padding">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleEvents.map((event, index) => (
                <ScrollReveal
                  key={event.id}
                  direction="up"
                  delay={index * 0.1}
                >
                  <GlowingCard
                    glowColor={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'green'}
                    className="group cursor-pointer h-full"
                    animated={false}
                  >
                    <div className="p-6 h-full flex flex-col">
                      <div className="h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl mb-6 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all duration-300">
                        <div className="text-6xl opacity-50 group-hover:opacity-70 transition-opacity">
                          {event.category === 'Art' && '🎨'}
                          {event.category === 'Music' && '🎵'}
                          {event.category === 'Technology' && '💻'}
                          {event.category === 'Education' && '📚'}
                          {event.category === 'Gaming' && '🎮'}
                          {event.category === 'Networking' && '🤝'}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
                            {event.category}
                          </span>
                          <span className="text-sm text-neutral-400">{event.date}</span>
                        </div>

                        <h3 className="text-xl font-bold text-neutral-50 mb-3 group-hover:text-primary-400 transition-colors">
                          {event.title}
                        </h3>

                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-lg font-bold text-accent-400">{event.price}</span>
                          <motion.button
                            className="btn-primary px-6 py-2 text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Get Ticket
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </GlowingCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default EventsPage
