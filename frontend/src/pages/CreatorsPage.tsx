import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const CreatorsPage = () => {
  const creatorFeatures = [
    {
      icon: '💰',
      title: 'Instant Earnings',
      description: 'Get paid immediately when fans buy your content or tickets. No waiting for payments.',
      color: 'blue'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track your performance with easy-to-understand reports and grow your audience.',
      color: 'purple'
    },
    {
      icon: '🎯',
      title: 'Direct Connection',
      description: 'Connect directly with your fans without middlemen taking large cuts.',
      color: 'green'
    },
    {
      icon: '🛡️',
      title: 'Secure Platform',
      description: 'Your content and earnings are protected by advanced blockchain security.',
      color: 'blue'
    },
    {
      icon: '🌍',
      title: 'Global Reach',
      description: 'Reach fans worldwide and build an international audience for your work.',
      color: 'purple'
    },
    {
      icon: '🚀',
      title: 'Easy to Use',
      description: 'Simple tools that help you focus on creating, not managing complicated systems.',
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
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-secondary-500/20 to-accent-500/20 border border-secondary-500/30 mb-6">
                <span className="text-secondary-400 font-medium">For Creators</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-6">
                Turn Your Creativity
                <br />
                <span className="gradient-text">Into Income</span>
              </h1>
              <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands of creators who are building sustainable businesses with Passa.
                Get paid instantly, connect with fans, and grow your audience worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  className="btn-primary px-8 py-4 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Creating
                </motion.button>
                <motion.button
                  className="btn-outline px-8 py-4 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-dark-bg">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                Powerful tools designed to help creators like you build, grow, and monetize your passion.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creatorFeatures.map((feature, index) => (
                <ScrollReveal
                  key={feature.title}
                  direction="up"
                  delay={index * 0.1}
                >
                  <GlowingCard
                    glowColor={feature.color as 'blue' | 'purple' | 'green'}
                    className="h-full group"
                    animated={false}
                  >
                    <div className="p-8 h-full flex flex-col">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-50 mb-4 group-hover:text-primary-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-300 leading-relaxed flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </GlowingCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/10 to-secondary-500/10">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                Ready to Start Your Creator Journey?
              </h2>
              <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
                Join Passa today and start building the creative business you've always dreamed of.
              </p>
              <motion.button
                className="btn-primary px-10 py-5 text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
              </motion.button>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default CreatorsPage
