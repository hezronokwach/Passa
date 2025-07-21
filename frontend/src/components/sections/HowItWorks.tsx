import { ScrollReveal } from '../ui/ScrollReveal'

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Create & Connect',
      description: 'Creators and event organizers join the platform and set up their profiles with automated revenue sharing.',
      icon: '🚀'
    },
    {
      step: '02',
      title: 'Promote & Share',
      description: 'Content creators promote events and experiences with trackable links to measure their impact.',
      icon: '📢'
    },
    {
      step: '03',
      title: 'Engage & Purchase',
      description: 'Fans discover content, buy secure digital tickets, and earn rewards for their engagement.',
      icon: '🎯'
    },
    {
      step: '04',
      title: 'Earn Instantly',
      description: 'Everyone gets paid automatically and instantly when transactions happen - no delays, no hassle.',
      icon: '💰'
    }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-dark-surface to-dark-bg">
      <div className="container-max section-padding">
        {/* Section header */}
        <ScrollReveal direction="up" className="text-center mb-20">
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-secondary-500/20 to-accent-500/20 border border-secondary-500/30 mb-6">
            <span className="text-secondary-400 font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-6">
            How Passa Works
          </h2>
          <p className="text-xl text-neutral-300 max-w-4xl mx-auto leading-relaxed">
            Four simple steps to revolutionize how creators connect with their audiences and monetize their content
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal
              key={step.step}
              direction="up"
              delay={index * 0.1}
              className="text-center relative group"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-secondary-500/50 to-accent-500/50 transform -translate-x-1/2 z-0" />
              )}

              {/* Step content */}
              <div className="relative z-10 p-6 rounded-xl bg-dark-surface/30 border border-secondary-500/20 hover:border-secondary-500/40 transition-all duration-300 hover:bg-dark-surface/50">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-secondary-500 to-accent-500 text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-neutral-50 mb-4 group-hover:text-secondary-400 transition-colors duration-300">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
