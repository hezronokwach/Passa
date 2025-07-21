import { ScrollReveal } from '../ui/ScrollReveal'
import GlowingCard from '../ui/GlowingCard'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Event Producer',
      company: 'Global Events Co.',
      content: 'Passa eliminated our fraud issues completely. The instant payments and transparent tracking have revolutionized our operations.',
      avatar: '👨‍💼',
      color: 'blue'
    },
    {
      name: 'Maya Rodriguez',
      role: 'Content Creator',
      company: '@MayaCreates',
      content: 'Finally, a platform that pays creators instantly! I can see exactly how my content drives engagement and sales.',
      avatar: '👩‍🎨',
      color: 'purple'
    },
    {
      name: 'Jordan Kim',
      role: 'Brand Director',
      company: 'TechCorp',
      content: 'The real-time analytics and ROI transparency are game-changing. We can optimize campaigns as they run.',
      avatar: '👨‍💻',
      color: 'green'
    }
  ]

  return (
    <section className="py-20 lg:py-32 bg-dark-bg">
      <div className="container-max section-padding">
        <ScrollReveal direction="up" className="text-center mb-20">
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-500/30 mb-6">
            <span className="text-accent-400 font-medium">Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-6">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-xl text-neutral-300 max-w-4xl mx-auto leading-relaxed">
            See what event organizers, creators, and brands are saying about their Passa experience
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.name}
              direction="up"
              delay={index * 0.1}
            >
              <GlowingCard
                glowColor={testimonial.color as 'blue' | 'purple' | 'green'}
                className="h-full group"
                animated={false}
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-50 text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-neutral-400">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-300 italic leading-relaxed text-lg flex-grow">
                    "{testimonial.content}"
                  </p>

                  {/* Rating stars */}
                  <div className="flex mt-6 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">⭐</span>
                    ))}
                  </div>
                </div>
              </GlowingCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
