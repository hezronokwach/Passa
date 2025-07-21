import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const AboutPage = () => {
  const values = [
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'We use cutting-edge technology to solve real problems for creators and their audiences.'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Transparency and security are at the heart of everything we build and every relationship we foster.'
    },
    {
      icon: '🌍',
      title: 'Global Impact',
      description: 'We believe creativity has no borders and work to connect creators with audiences worldwide.'
    },
    {
      icon: '💡',
      title: 'Simplicity',
      description: 'Complex technology should be simple to use. We make powerful tools accessible to everyone.'
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
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-6">
                <span className="text-primary-400 font-medium">About Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-8">
                Building the Future of
                <br />
                <span className="gradient-text">Creator Economy</span>
              </h1>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
                  Passa is revolutionizing how creators connect with their audiences worldwide.
                  We're building a platform where creativity meets opportunity, powered by cutting-edge blockchain technology
                  that ensures instant payments, transparent transactions, and secure digital experiences.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-dark-bg">
          <div className="container-max section-padding">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-neutral-300 mb-6 leading-relaxed">
                  We believe every creator deserves to be fairly compensated for their work.
                  That's why we built Passa - to eliminate the barriers between creativity and income.
                </p>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  Using advanced blockchain technology, we ensure instant payments, transparent transactions,
                  and secure experiences for creators and their audiences worldwide.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-dark-surface/50 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-2xl font-bold text-neutral-50 mb-4">Our Goal</h3>
                      <p className="text-neutral-300">
                        Empower 1 million creators worldwide to build sustainable businesses by 2025
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/5 to-secondary-500/5">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                Our Values
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                The principles that guide everything we do and every decision we make.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <ScrollReveal
                  key={value.title}
                  direction="up"
                  delay={index * 0.1}
                >
                  <GlowingCard
                    glowColor={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'green'}
                    className="h-full text-center group"
                    animated={false}
                  >
                    <div className="p-8 h-full flex flex-col">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold text-neutral-50 mb-4 group-hover:text-primary-400 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-neutral-300 leading-relaxed flex-grow">
                        {value.description}
                      </p>
                    </div>
                  </GlowingCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-dark-bg">
          <div className="container-max section-padding">
            <ScrollReveal direction="up" className="text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-6">
                Join Our Mission
              </h2>
              <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
                Be part of the movement that's transforming how creators build their businesses and connect with audiences.
              </p>
              <motion.button
                className="btn-primary px-10 py-5 text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
              </motion.button>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
