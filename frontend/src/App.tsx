import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import EventsPage from './pages/EventsPage'
import CreatorsPage from './pages/CreatorsPage'
import BrandsPage from './pages/BrandsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Routes>
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage />
            </motion.div>
          } 
        />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/creators" element={<CreatorsPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
