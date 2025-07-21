import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated">
          <div className="container-max section-padding">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-secondary-500/20 to-accent-500/20 border border-secondary-500/30 mb-6">
                    <span className="text-secondary-400 font-medium">Privacy</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-6">
                    Privacy Policy
                  </h1>
                  <p className="text-xl text-neutral-300">
                    Last updated: January 2025
                  </p>
                </div>

                <div className="bg-dark-surface/50 backdrop-blur-sm rounded-2xl border border-secondary-500/20 p-8 space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">1. Information We Collect</h2>
                    <p className="text-neutral-300 leading-relaxed mb-4">
                      We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                    </p>
                    <ul className="list-disc list-inside text-neutral-300 space-y-2 ml-4">
                      <li>Account information (name, email, password)</li>
                      <li>Profile information and content you create</li>
                      <li>Payment and transaction information</li>
                      <li>Communications with us</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">2. How We Use Your Information</h2>
                    <p className="text-neutral-300 leading-relaxed mb-4">
                      We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside text-neutral-300 space-y-2 ml-4">
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process transactions and send related information</li>
                      <li>Send you technical notices and support messages</li>
                      <li>Communicate with you about products, services, and events</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">3. Information Sharing</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">4. Data Security</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">5. Blockchain Data</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      Some data may be stored on blockchain networks, which are decentralized and immutable. This data cannot be modified or deleted once recorded.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">6. Your Rights</h2>
                    <p className="text-neutral-300 leading-relaxed mb-4">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-neutral-300 space-y-2 ml-4">
                      <li>Access and update your personal information</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt out of marketing communications</li>
                      <li>Request a copy of your data</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">7. Contact Us</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      If you have any questions about this Privacy Policy, please contact us at privacy@passa.io
                    </p>
                  </section>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPage
