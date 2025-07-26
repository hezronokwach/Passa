import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Sign Up & Set Up',
      description: 'Join our platform and create your profile in minutes. Set up your payment details and start connecting with your audience.',
      icon: '🚀'
    },
    {
      step: '02',
      title: 'Share & Promote',
      description: 'Share your events and content with special links. Track how many people click and engage with what you share.',
      icon: '📢'
    },
    {
      step: '03',
      title: 'Fans Buy Tickets',
      description: 'Your fans discover your content and buy secure tickets. They also earn rewards for supporting you and staying engaged.',
      icon: '🎯'
    },
    {
      step: '04',
      title: 'Get Paid Instantly',
      description: 'Receive your money immediately when someone buys tickets or content. No waiting weeks - payments happen in seconds.',
      icon: '💰'
    }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-surface to-background">
      <div className="container-max section-padding">
        {/* Section header */}
        <SectionHeader
          badge="How It Works"
          badgeColor="secondary"
          title="Get Started in"
          subtitle="4 Easy Steps"
          description="Simple steps to start earning money from your content and connecting with your audience"
        />

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal
              key={step.step}
              direction="up"
              delay={index * 0.1}
              className="text-center relative group h-full"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-secondary-500/50 to-accent-500/50 transform -translate-x-1/2 z-0" />
              )}

              {/* Step content */}
              <div className="relative z-10 p-6 rounded-xl bg-surface/50 border border-border hover:border-secondary-500/40 transition-all duration-300 hover:bg-surface/80 h-full flex flex-col">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-stellar-plasma to-stellar-aurora text-text font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-text mb-4 group-hover:text-secondary-400 transition-colors duration-300">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed flex-grow">
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
