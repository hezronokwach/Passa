import {
  ShieldCheckIcon,
  BoltIcon,
  ChartBarIcon,
  GiftIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import GlowingCard from '../ui/GlowingCard'
import { ScrollReveal } from '../ui/ScrollReveal'
import BlockchainGrid from '../ui/BlockchainGrid'
import SectionHeader from '../ui/SectionHeader'

const Features = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Safe Digital Tickets',
      description: 'Your tickets are protected by advanced security. No more fake tickets or fraud - every purchase is guaranteed real and safe.',
      color: 'blue',
      gradient: 'from-cyber-blue to-primary-500'
    },
    {
      icon: BoltIcon,
      title: 'Get Paid Instantly',
      description: 'Receive money immediately when someone buys your content or tickets. No waiting weeks for payments - money comes in seconds.',
      color: 'purple',
      gradient: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Easy Reports',
      description: 'See exactly how your content performs with simple reports. Track your earnings, audience growth, and engagement in real-time.',
      color: 'green',
      gradient: 'from-accent-500 to-accent-600'
    },
    {
      icon: GiftIcon,
      title: 'Earn Rewards',
      description: 'Get rewards for being active on the platform. The more you create and engage, the more benefits you unlock for yourself and your fans.',
      color: 'blue',
      gradient: 'from-primary-500 to-cyber-blue'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Multiple Ways to Earn',
      description: 'Make money in different ways - sell tickets, create subscriptions, partner with brands, and offer exclusive content all in one place.',
      color: 'purple',
      gradient: 'from-secondary-600 to-secondary-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Global Community',
      description: 'Connect with creators, fans, and brands from around the world. Build your network and grow your audience on a global platform.',
      color: 'green',
      gradient: 'from-accent-600 to-accent-500'
    }
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-background overflow-hidden">
      {/* Background elements */}
      <BlockchainGrid className="opacity-10" animated={true} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />

      <div className="relative container-max section-padding">
        {/* Section header */}
        <SectionHeader
          badge="Platform Features"
          badgeColor="primary"
          title="Why Choose"
          subtitle="ConnectSphere?"
          description="Experience the future of creator economy with cutting-edge technology, easy-to-use tools, and seamless global connectivity"
        />

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.title}
              direction="up"
              delay={index * 0.1}
              className="h-full"
            >
              <GlowingCard
                glowColor={feature.color as 'blue' | 'purple' | 'green'}
                className="h-full group cursor-pointer"
                animated={false}
              >
                <div className="p-8 h-full flex flex-col min-h-[320px]">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 self-start`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-text mb-4 group-hover:text-cyber-blue transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed group-hover:text-text transition-colors flex-grow">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <div className={`h-1 bg-gradient-to-r ${feature.gradient} rounded-full mt-6 w-0 group-hover:w-full opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                </div>
              </GlowingCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
