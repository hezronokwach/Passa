import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated">
          <div className="container-max section-padding">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-6">
                    <span className="text-primary-400 font-medium">Legal</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-6">
                    Terms of Service
                  </h1>
                  <p className="text-xl text-neutral-300">
                    Last updated: January 2025
                  </p>
                </div>

                <div className="bg-dark-surface/50 backdrop-blur-sm rounded-2xl border border-primary-500/20 p-8 space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      By accessing and using Passa, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">2. Use License</h2>
                    <p className="text-neutral-300 leading-relaxed mb-4">
                      Permission is granted to temporarily use Passa for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside text-neutral-300 space-y-2 ml-4">
                      <li>modify or copy the materials</li>
                      <li>use the materials for any commercial purpose or for any public display</li>
                      <li>attempt to reverse engineer any software contained on the platform</li>
                      <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">3. User Accounts</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">4. Content Policy</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      Users are responsible for the content they create and share on Passa. Content must comply with applicable laws and our community guidelines.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">5. Payment Terms</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      All transactions on Passa are processed through blockchain technology. Users are responsible for understanding the implications of blockchain transactions.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">6. Limitation of Liability</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      Passa shall not be liable for any damages arising from the use or inability to use the platform, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-neutral-50 mb-4">7. Contact Information</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us at legal@passa.io
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

export default TermsPage
