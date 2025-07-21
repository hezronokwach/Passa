import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const EventsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container-max section-padding py-16">
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-8">
            Discover Events
          </h1>
          <p className="text-lg text-neutral-600 mb-12">
            Find amazing events happening across Kenya, powered by blockchain technology.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Sample Event {i}</h3>
                <p className="text-neutral-600 mb-4">Coming soon...</p>
                <button className="btn-primary w-full">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default EventsPage
