import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  ChartBarIcon, 
  GiftIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const Features = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Fraud-Proof Ticketing',
      description: 'NFT-based tickets on Stellar blockchain eliminate counterfeiting and ensure authentic event access.',
      color: 'text-primary-600'
    },
    {
      icon: BoltIcon,
      title: 'Instant Payments',
      description: 'Automated revenue distribution via smart contracts with 5-second settlement times.',
      color: 'text-secondary-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Transparent Analytics',
      description: 'Real-time ROI tracking and attribution for creators and brand campaigns.',
      color: 'text-accent-600'
    },
    {
      icon: GiftIcon,
      title: 'Loyalty Rewards',
      description: 'SPHERE tokens reward fan engagement and event attendance across the platform.',
      color: 'text-primary-600'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Multi-Revenue Streams',
      description: 'Creators earn from ticket sales, brand partnerships, and fan engagement.',
      color: 'text-secondary-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Connect artists, creators, brands, and fans in one unified ecosystem.',
      color: 'text-accent-600'
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
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
            Why Choose ConnectSphere?
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Built on Stellar blockchain with cutting-edge features designed for Kenya's entertainment ecosystem
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className={`inline-flex p-3 rounded-lg bg-neutral-100 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
