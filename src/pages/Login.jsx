import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Shield, Smartphone, TrendingUp, Zap } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data is protected with enterprise-level encryption"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant transactions and real-time updates"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track your spending and grow your wealth"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Bank anywhere, anytime on any device"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 lg:py-12 xl:px-24">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Raynott Fintech
                </h1>
                <p className="text-sm text-gray-600">Next Generation Banking</p>
              </div>
            </div>

            <div className="space-y-2 mb-12">
              <h2 className="text-4xl font-bold text-gray-900">
                Welcome to the future of
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  digital banking
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Experience banking reimagined with cutting-edge technology and unparalleled security.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center space-x-8 text-sm text-gray-600">
              <div>
                <div className="font-semibold text-gray-900">50K+</div>
                <div>Happy Customers</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">₹500Cr+</div>
                <div>Transactions</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">99.9%</div>
                <div>Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    Raynott Fintech
                  </h1>
                  <p className="text-sm text-gray-600">Next Generation Banking</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-gray-600">
                  Sign in to your account to continue
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 pr-12"
                        placeholder="Enter your password"
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
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      'Sign in to your account'
                    )}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">New to Raynott?</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Create your Raynott account
                    </Link>
                  </div>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8">
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <feature.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900">{feature.title}</h3>
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

export default Login