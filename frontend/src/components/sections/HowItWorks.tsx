import { motion } from 'framer-motion'

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Create Event',
      description: 'Event organizers create events with automated revenue splits and invite creators to promote.',
      icon: '🎪'
    },
    {
      step: '02',
      title: 'Creators Promote',
      description: 'Content creators share events with unique attribution links to track their promotional impact.',
      icon: '📱'
    },
    {
      step: '03',
      title: 'Fans Purchase',
      description: 'Fans buy fraud-proof NFT tickets and earn SPHERE loyalty tokens for engagement.',
      icon: '🎫'
    },
    {
      step: '04',
      title: 'Instant Payouts',
      description: 'Smart contracts automatically distribute revenue to all stakeholders within seconds.',
      icon: '⚡'
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="container-max section-padding">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Simple, transparent, and automated - connecting all stakeholders in Kenya's entertainment ecosystem
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300 transform -translate-x-1/2 z-0" />
              )}
              
              {/* Step content */}
              <div className="relative z-10">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg mb-4">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="text-4xl mb-4">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-neutral-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
