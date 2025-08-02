import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import GlowingCard from '../components/ui/GlowingCard'

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert('Signin failed: ' + (errorData.error || 'Unknown error'))
        return
      }

      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Signin error:', error)
      alert('Signin failed: ' + error)
    }
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
                <div className="text-center mb-8">
                  <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-6">
                    <span className="text-primary-400 font-medium">Welcome Back</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-4">
                    Sign In to
                    <br />
                    <span className="gradient-text">Passa</span>
                  </h1>
                  <p className="text-lg text-neutral-300">
                    Continue your creative journey with us
                  </p>
                </div>

                <GlowingCard glowColor="blue" className="p-12 md:p-16" animated={false}>
                  <form onSubmit={handleSubmit} className="space-y-8">
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
                        placeholder="your@email.com"
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
                          placeholder="Enter your password"
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
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-neutral-300">Remember me</span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Sign In Button */}
                    <motion.button
                      type="submit"
                      className="btn-primary w-full py-5 text-lg mt-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </motion.button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dark-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-dark-surface text-neutral-400">Or continue with</span>
                      </div>
                    </div>

                    {/* Social Sign In */}
                    <div className="grid grid-cols-2 gap-6">
                      <motion.button
                        type="button"
                        className="flex items-center justify-center px-6 py-4 border border-dark-border rounded-lg bg-dark-surface hover:bg-dark-elevated text-neutral-300 hover:text-neutral-200 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-xl mr-3">🔗</span>
                        Wallet
                      </motion.button>
                      <motion.button
                        type="button"
                        className="flex items-center justify-center px-6 py-4 border border-dark-border rounded-lg bg-dark-surface hover:bg-dark-elevated text-neutral-300 hover:text-neutral-200 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-xl mr-3">🌐</span>
                        Google
                      </motion.button>
                    </div>
                  </form>
                </GlowingCard>

                {/* Sign Up Link */}
                <div className="text-center mt-8">
                  <p className="text-neutral-400">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                    >
                      Sign up for free
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

export default SignInPage
