import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container-max section-padding py-16 text-center">
          <div className="text-8xl mb-8">🔍</div>
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage
