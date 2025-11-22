import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, CheckCircle, Shield, Lock, User, Mail } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Contains letters and numbers', met: /[a-zA-Z]/.test(formData.password) && /[0-9]/.test(formData.password) },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "256-bit encryption protects your data"
    },
    {
      icon: Lock,
      title: "Instant Access",
      description: "Start banking immediately after registration"
    },
    {
      icon: CheckCircle,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-blue-600/5"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 lg:py-12 xl:px-24">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  Raynott Fintech
                </h1>
                <p className="text-sm text-gray-600">Join the Future of Banking</p>
              </div>
            </div>

            <div className="space-y-2 mb-12">
              <h2 className="text-4xl font-bold text-gray-900">
                Start your financial
                <span className="block bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  journey today
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Create your account and unlock a world of smart banking features designed for modern life.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{benefit.title}</h3>
                    <p className="text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">50K+</div>
                  <div>Trusted Users</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">₹500Cr+</div>
                  <div>Secured</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">24/7</div>
                  <div>Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
                    Raynott Fintech
                  </h1>
                  <p className="text-sm text-gray-600">Join the Future of Banking</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Create Account
                </h2>
                <p className="mt-2 text-gray-600">
                  Join thousands already banking with Raynott
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-3 space-y-2">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle 
                              className={`h-4 w-4 ${
                                req.met ? 'text-green-500' : 'text-gray-300'
                              }`} 
                            />
                            <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Confirm your password"
                      />
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <div className="flex items-center space-x-2 mt-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Passwords match</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create your account'
                    )}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Sign in to your account
                    </Link>
                  </div>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  Your data is protected with bank-level security and 256-bit encryption
                </p>
              </div>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mt-8">
              <div className="grid grid-cols-3 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <benefit.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900">{benefit.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register