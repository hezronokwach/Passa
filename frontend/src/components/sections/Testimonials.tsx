import { motion } from 'framer-motion'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Kimani',
      role: 'Event Organizer',
      company: 'Nairobi Music Festival',
      content: 'ConnectSphere eliminated our ticket fraud issues completely. The automated revenue splits save us hours of manual work.',
      avatar: '👩🏾‍💼'
    },
    {
      name: 'David Mwangi',
      role: 'Content Creator',
      company: '@DavidCreates',
      content: 'Finally, a platform that pays creators instantly! I can track exactly how my promotions drive ticket sales.',
      avatar: '👨🏾‍🎨'
    },
    {
      name: 'Grace Wanjiku',
      role: 'Brand Manager',
      company: 'Safaricom',
      content: 'The ROI transparency is game-changing. We can see exactly how our campaigns perform in real-time.',
      avatar: '👩🏾‍💻'
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Trusted by Kenya's Best
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            See what event organizers, creators, and brands are saying about ConnectSphere
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
