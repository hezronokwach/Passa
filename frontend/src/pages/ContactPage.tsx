import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container-max section-padding py-16">
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-8">
            Contact Us
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900">Email</h3>
                  <p className="text-neutral-600">hello@connectsphere.co.ke</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Phone</h3>
                  <p className="text-neutral-600">+254 700 000 000</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Address</h3>
                  <p className="text-neutral-600">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Send Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Name
                  </label>
                  <input type="text" className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  <input type="email" className="input" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Message
                  </label>
                  <textarea className="input h-32" placeholder="Your message"></textarea>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
