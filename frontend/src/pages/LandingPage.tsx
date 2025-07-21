import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Hero from '../components/sections/Hero'
import Features from '../components/sections/Features'
import HowItWorks from '../components/sections/HowItWorks'
import Stats from '../components/sections/Stats'
import Testimonials from '../components/sections/Testimonials'
import CTA from '../components/sections/CTA'
import Footer from '../components/layout/Footer'

const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </motion.div>
  )
}

export default LandingPage
