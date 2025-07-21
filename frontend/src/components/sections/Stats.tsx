import { ScrollReveal } from '../ui/ScrollReveal'

const Stats = () => {
  const stats = [
    { value: '$500B+', label: 'Global Market', description: 'Creator economy worldwide' },
    { value: '50M+', label: 'Active Creators', description: 'Content creators globally' },
    { value: '<5 sec', label: 'Instant Payments', description: 'Lightning-fast settlements' },
    { value: '24/7', label: 'Always Available', description: 'Global platform access' }
  ]

  return (
    <section className="py-20 lg:py-32 bg-dark-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container-max section-padding">
        <ScrollReveal direction="up" className="text-center mb-20">
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-6">
            <span className="text-primary-400 font-medium">Platform Impact</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-6">
            Passa by the Numbers
          </h2>
          <p className="text-xl text-neutral-300 max-w-4xl mx-auto leading-relaxed">
            Join thousands of creators who are already building their future with Passa's innovative platform
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              direction="up"
              delay={index * 0.1}
              className="text-center group"
            >
              <div className="relative p-8 rounded-2xl bg-dark-surface/50 backdrop-blur-sm border border-primary-500/20 hover:border-primary-500/40 hover:bg-dark-surface/70 transition-all duration-300 group-hover:scale-105">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-4">
                    {stat.value}
                  </div>
                  <div className="text-xl font-bold text-neutral-50 mb-3">
                    {stat.label}
                  </div>
                  <div className="text-neutral-400 leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
