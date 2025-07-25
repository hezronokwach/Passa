import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'

const Stats = () => {
  const stats = [
    { value: '$500B+', label: 'Creator Economy', description: 'Global market size worldwide' },
    { value: '50M+', label: 'Active Creators', description: 'Content creators globally' },
    { value: '<5 sec', label: 'Fast Payments', description: 'Lightning-fast money transfers' },
    { value: '24/7', label: 'Always Open', description: 'Global platform access' }
  ]

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container-max section-padding">
        <SectionHeader
          badge="Platform Impact"
          badgeColor="primary"
          title="ConnectSphere by the"
          subtitle="Numbers"
          description="Join thousands of creators who are already building their future with ConnectSphere's innovative platform"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              direction="up"
              delay={index * 0.1}
              className="text-center group h-full"
            >
              <div className="relative p-8 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border hover:border-primary-500/40 hover:bg-surface/70 transition-all duration-300 group-hover:scale-105 h-full flex flex-col justify-center min-h-[200px]">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-4">
                    {stat.value}
                  </div>
                  <div className="text-xl font-bold text-text mb-3">
                    {stat.label}
                  </div>
                  <div className="text-text-secondary leading-relaxed">
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
