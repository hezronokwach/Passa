import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'creator',
    agreeToTerms: false,
    subscribeNewsletter: true
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up:', formData)
  }

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'Contains number', met: /\d/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated">
          <div className="container-max section-padding">
            <div className="max-w-lg mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-8">
                  <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-secondary-500/20 to-accent-500/20 border border-secondary-500/30 mb-6">
                    <span className="text-secondary-400 font-medium">Join the Revolution</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-4">
                    Create Your
                    <br />
                    <span className="gradient-text">Passa Account</span>
                  </h1>
                  <p className="text-lg text-neutral-300">
                    Start building your creative future today
                  </p>
                </div>

                <GlowingCard glowColor="purple" className="p-12 md:p-16" animated={false}>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* User Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-4">
                        I am a...
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'creator', label: 'Creator', icon: '🎨' },
                          { value: 'brand', label: 'Brand', icon: '🏢' },
                          { value: 'fan', label: 'Fan', icon: '⭐' }
                        ].map((type) => (
                          <label key={type.value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="userType"
                              value={type.value}
                              checked={formData.userType === type.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`p-4 rounded-lg border text-center transition-all duration-300 ${
                              formData.userType === type.value
                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                : 'border-dark-border bg-dark-surface text-neutral-400 hover:border-primary-500/50'
                            }`}>
                              <div className="text-2xl mb-1">{type.icon}</div>
                              <div className="text-sm font-medium">{type.label}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-3">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="input w-full"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-3">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="input w-full"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="input w-full pr-12"
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      
                      {/* Password Requirements */}
                      {formData.password && (
                        <div className="mt-3 space-y-2">
                          {passwordRequirements.map((req, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                                req.met ? 'bg-accent-500' : 'bg-neutral-600'
                              }`}>
                                {req.met && <CheckIcon className="h-3 w-3 text-white" />}
                              </div>
                              <span className={req.met ? 'text-accent-400' : 'text-neutral-400'}>
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="input w-full pr-12"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-2 text-sm text-red-400">Passwords don't match</p>
                      )}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border rounded focus:ring-primary-500 focus:ring-2 mt-0.5"
                          required
                        />
                        <span className="ml-3 text-sm text-neutral-300">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="subscribeNewsletter"
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border rounded focus:ring-primary-500 focus:ring-2 mt-0.5"
                        />
                        <span className="ml-3 text-sm text-neutral-300">
                          Send me updates about new features and creator opportunities
                        </span>
                      </label>
                    </div>

                    {/* Sign Up Button */}
                    <motion.button
                      type="submit"
                      disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword}
                      className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: formData.agreeToTerms ? 1.02 : 1 }}
                      whileTap={{ scale: formData.agreeToTerms ? 0.98 : 1 }}
                    >
                      Create Account
                    </motion.button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dark-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-dark-surface text-neutral-400">Or sign up with</span>
                      </div>
                    </div>

                    {/* Social Sign Up */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        className="flex items-center justify-center px-4 py-3 border border-dark-border rounded-lg bg-dark-surface hover:bg-dark-elevated text-neutral-300 hover:text-neutral-200 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-xl mr-2">🔗</span>
                        Wallet
                      </motion.button>
                      <motion.button
                        type="button"
                        className="flex items-center justify-center px-4 py-3 border border-dark-border rounded-lg bg-dark-surface hover:bg-dark-elevated text-neutral-300 hover:text-neutral-200 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-xl mr-2">🌐</span>
                        Google
                      </motion.button>
                    </div>
                  </form>
                </GlowingCard>

                {/* Sign In Link */}
                <div className="text-center mt-8">
                  <p className="text-neutral-400">
                    Already have an account?{' '}
                    <Link
                      to="/signin"
                      className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
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

export default SignUpPage
