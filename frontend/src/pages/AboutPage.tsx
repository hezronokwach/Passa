import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container-max section-padding py-16">
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-8">
            About ConnectSphere
          </h1>
          <div className="max-w-4xl">
            <p className="text-lg text-neutral-600 mb-8">
              ConnectSphere is transforming Kenya's $123M events industry and growing creator economy 
              through blockchain-powered transparency, automated payments, and fraud-proof ticketing.
            </p>
            
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Our Mission</h2>
            <p className="text-neutral-600 mb-8">
              To create a unified ecosystem where event organizers, content creators, brand marketers, 
              and fans can connect, collaborate, and prosper through transparent value distribution.
            </p>
            
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Built on Stellar</h2>
            <p className="text-neutral-600 mb-8">
              We chose Stellar blockchain for its fast settlement times (5 seconds), low transaction 
              costs (sub-cent fees), and scalability (3,000+ TPS) - perfect for Kenya's growing 
              digital economy.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
