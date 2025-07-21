import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const BrandsPage = () => {
  const brandBenefits = [
    {
      icon: '📊',
      title: 'Real-Time Analytics',
      description: 'See exactly how your campaigns perform with detailed, easy-to-understand reports and metrics.',
      color: 'blue'
    },
    {
      icon: '🎯',
      title: 'Authentic Audiences',
      description: 'Connect with real, engaged audiences through verified creators who truly care about your brand.',
      color: 'purple'
    },
    {
      icon: '💡',
      title: 'Smart Targeting',
      description: 'Reach the right people at the right time with intelligent audience matching and targeting tools.',
      color: 'green'
    },
    {
      icon: '🛡️',
      title: 'Fraud Protection',
      description: 'Advanced security ensures your campaigns reach real people, not bots or fake accounts.',
      color: 'blue'
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Track campaign performance in real-time and make adjustments on the fly for better results.',
      color: 'purple'
    },
    {
      icon: '🤝',
      title: 'Creator Partnerships',
      description: 'Build lasting relationships with creators who align with your brand values and audience.',
      color: 'green'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center mb-16">
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-500/30 mb-6">
                <span className="text-accent-400 font-medium">For Brands</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-6">
                Reach Authentic
                <br />
                <span className="gradient-text">Audiences</span>
              </h1>
              <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Partner with verified creators to reach real, engaged audiences.
                Get transparent results, protect your brand, and maximize your marketing ROI.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  className="btn-primary px-8 py-4 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Campaign
                </motion.button>
                <motion.button
                  className="btn-outline px-8 py-4 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Case Studies
                </motion.button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-dark-bg">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                Why Brands Choose Passa
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                Everything you need to run successful, transparent, and effective creator marketing campaigns.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brandBenefits.map((benefit, index) => (
                <ScrollReveal
                  key={benefit.title}
                  direction="up"
                  delay={index * 0.1}
                >
                  <GlowingCard
                    glowColor={benefit.color as 'blue' | 'purple' | 'green'}
                    className="h-full group"
                    animated={false}
                  >
                    <div className="p-8 h-full flex flex-col">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-50 mb-4 group-hover:text-primary-400 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-neutral-300 leading-relaxed flex-grow">
                        {benefit.description}
                      </p>
                    </div>
                  </GlowingCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/10 to-secondary-500/10">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                Trusted by Leading Brands
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">95%</div>
                <div className="text-neutral-300">Campaign Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary-400 mb-2">3.2x</div>
                <div className="text-neutral-300">Average ROI Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-400 mb-2">24h</div>
                <div className="text-neutral-300">Campaign Launch Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-dark-bg">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                Ready to Transform Your Marketing?
              </h2>
              <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
                Join leading brands who are already seeing incredible results with Passa's creator marketing platform.
              </p>
              <motion.button
                className="btn-primary px-10 py-5 text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Launch Your Campaign
              </motion.button>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default BrandsPage
