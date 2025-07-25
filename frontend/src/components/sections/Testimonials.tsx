import { ScrollReveal } from '../ui/ScrollReveal'
import GlowingCard from '../ui/GlowingCard'
import SectionHeader from '../ui/SectionHeader'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Event Organizer',
      company: 'Global Events Co.',
      content: 'ConnectSphere solved our fake ticket problem completely. Getting paid instantly and seeing clear reports has changed how we run events.',
      avatar: '👨‍💼',
      color: 'blue'
    },
    {
      name: 'Maya Rodriguez',
      role: 'Content Creator',
      company: '@MayaCreates',
      content: 'Finally, a platform that pays me right away! I can see exactly how my posts help sell tickets and make money from my content.',
      avatar: '👩‍🎨',
      color: 'purple'
    },
    {
      name: 'Jordan Kim',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content: 'The live reports and clear profit tracking are amazing. We can see what works and change our campaigns while they are running.',
      avatar: '👨‍💻',
      color: 'green'
    }
  ]

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container-max section-padding">
        <SectionHeader
          badge="Success Stories"
          badgeColor="accent"
          title="Loved by Creators"
          subtitle="Worldwide"
          description="See what event organizers, content creators, and brands are saying about their ConnectSphere experience"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.name}
              direction="up"
              delay={index * 0.1}
              className="h-full"
            >
              <GlowingCard
                glowColor={testimonial.color as 'blue' | 'purple' | 'green'}
                className="h-full group"
                animated={false}
              >
                <div className="p-8 h-full flex flex-col min-h-[320px]">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-text text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-text-muted">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary italic leading-relaxed text-lg flex-grow">
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
