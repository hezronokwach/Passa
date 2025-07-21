import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const ContactPage = () => {
  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      description: 'Get in touch with our team',
      contact: 'hezronokwach@gmail.com',
      color: 'blue'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: '24/7 support available',
      contact: 'Chat with us now',
      color: 'purple'
    },
    {
      icon: '🌍',
      title: 'Community',
      description: 'Join our global network',
      contact: 'Discord & Telegram',
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
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-6">
                <span className="text-primary-400 font-medium">Get in Touch</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-8">
                We'd Love to
                <br />
                <span className="gradient-text">Hear From You</span>
              </h1>
              <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Have questions about Passa? Want to join our creator community?
                Or need help getting started? We're here to help you succeed.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-dark-bg">
          <div className="container-max section-padding">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <ScrollReveal
                  key={method.title}
                  direction="up"
                  delay={index * 0.1}
                >
                  <GlowingCard
                    glowColor={method.color as 'blue' | 'purple' | 'green'}
                    className="text-center group cursor-pointer"
                    animated={false}
                  >
                    <div className="p-8">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {method.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-50 mb-4 group-hover:text-primary-400 transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-neutral-300 mb-4">
                        {method.description}
                      </p>
                      <p className="text-primary-400 font-semibold">
                        {method.contact}
                      </p>
                    </div>
                  </GlowingCard>
                </ScrollReveal>
              ))}
            </div>

            {/* Contact Form */}
            <ScrollReveal direction="up" className="max-w-2xl mx-auto">
              <GlowingCard glowColor="blue" className="p-8" animated={false}>
                <h2 className="text-3xl font-bold text-neutral-50 mb-8 text-center">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="input w-full"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Message
                    </label>
                    <textarea
                      className="input w-full h-32 resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                  <motion.button
                    type="submit"
                    className="btn-primary w-full py-4 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </GlowingCard>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
