import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated">
          <div className="container-max section-padding">
            <div className="max-w-md mx-auto">
              <ScrollReveal direction="up">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-500/30 mb-6">
                        <span className="text-accent-400 font-medium">Password Reset</span>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-4">
                        Forgot Your
                        <br />
                        <span className="gradient-text">Password?</span>
                      </h1>
                      <p className="text-lg text-neutral-300">
                        No worries! Enter your email and we'll send you reset instructions.
                      </p>
                    </div>

                    <GlowingCard glowColor="green" className="p-12 md:p-16" animated={false}>
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Field */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-300 mb-3">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input w-full"
                            placeholder="Enter your email address"
                            required
                          />
                          <p className="mt-2 text-sm text-neutral-400">
                            We'll send password reset instructions to this email.
                          </p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={isLoading}
                          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: isLoading ? 1 : 1.02 }}
                          whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Sending...
                            </div>
                          ) : (
                            'Send Reset Instructions'
                          )}
                        </motion.button>
                      </form>
                    </GlowingCard>

                    {/* Back to Sign In */}
                    <div className="text-center mt-8">
                      <Link
                        to="/signin"
                        className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors"
                      >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Sign In
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Success State */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500 rounded-full mb-6">
                        <CheckIcon className="h-8 w-8 text-white" />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-4">
                        Check Your
                        <br />
                        <span className="gradient-text">Email</span>
                      </h1>
                      <p className="text-lg text-neutral-300 mb-6">
                        We've sent password reset instructions to:
                      </p>
                      <p className="text-xl font-semibold text-primary-400 mb-8">
                        {email}
                      </p>
                    </div>

                    <GlowingCard glowColor="green" className="p-12 md:p-16" animated={false}>
                      <div className="space-y-8">
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-neutral-50 mb-4">
                            What's Next?
                          </h3>
                          <div className="space-y-4 text-left">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                                1
                              </div>
                              <p className="text-neutral-300">
                                Check your email inbox (and spam folder)
                              </p>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                                2
                              </div>
                              <p className="text-neutral-300">
                                Click the reset link in the email
                              </p>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                                3
                              </div>
                              <p className="text-neutral-300">
                                Create a new password and sign in
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-dark-border pt-6">
                          <p className="text-sm text-neutral-400 text-center mb-4">
                            Didn't receive the email?
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <motion.button
                              onClick={() => setIsSubmitted(false)}
                              className="btn-outline flex-1 py-3"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Try Different Email
                            </motion.button>
                            <motion.button
                              onClick={handleSubmit}
                              className="btn-ghost flex-1 py-3"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Resend Email
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </GlowingCard>

                    {/* Back to Sign In */}
                    <div className="text-center mt-8">
                      <Link
                        to="/signin"
                        className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors"
                      >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Sign In
                      </Link>
                    </div>
                  </>
                )}
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ForgotPasswordPage
