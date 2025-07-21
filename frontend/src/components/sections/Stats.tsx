import { motion } from 'framer-motion'

const Stats = () => {
  const stats = [
    { value: '$123M', label: 'Total Market Size', description: 'Kenya events + creator economy' },
    { value: '22.17M', label: 'Internet Users', description: 'Potential platform users' },
    { value: '5 sec', label: 'Settlement Time', description: 'Stellar blockchain speed' },
    { value: '15x ROI', label: 'Projected Returns', description: 'Within 5 years' }
  ]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Platform by the Numbers
          </h2>
          <p className="text-lg text-primary-100 max-w-3xl mx-auto">
            ConnectSphere is positioned to capture significant value in Kenya's growing digital economy
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-primary-100 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-primary-200">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
