import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const BrandsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container-max section-padding py-16">
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-8">
            For Brands
          </h1>
          <p className="text-lg text-neutral-600 mb-12">
            Reach authentic audiences with transparent ROI tracking and fraud-resistant campaigns.
          </p>
          
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Coming Soon</h2>
            <p className="text-neutral-600">Brand campaign management tools are under development.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default BrandsPage
