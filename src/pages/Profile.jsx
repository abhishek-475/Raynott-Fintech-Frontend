import React, { useState, useEffect } from 'react'
import { usersAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  Mail, 
  Save, 
  Shield, 
  Calendar,
  MapPin,
  Phone,
  Edit3,
  CheckCircle,
  AlertCircle,
  CreditCard,
  TrendingUp
} from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile()
      setProfile({
        ...response.data.user,
        joinDate: new Date(response.data.user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        phone: '+91 98765 43210', // Mock data
        address: '123 Financial District, Mumbai, Maharashtra 400001', // Mock data
        lastLogin: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    try {
      await usersAPI.updateProfile({ name: profile.name })
      setMessage('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    fetchProfile() // Reset to original data
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: CreditCard },
  ]

  const stats = [
    { label: 'Accounts', value: '3', icon: CreditCard },
    { label: 'Transactions', value: '47', icon: TrendingUp },
    { label: 'Member Since', value: '2024', icon: Calendar },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile and account preferences</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last login</p>
            <p className="text-sm font-medium text-gray-900">{profile?.lastLogin}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${
          message.includes('success') 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        } flex items-center space-x-2`}>
          {message.includes('success') ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* User Card */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                {profile?.role}
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600 text-sm mt-1">Update your personal details and contact information</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <div className="p-6">
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={profile?.name || ''}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={profile?.email || ''}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Email cannot be changed for security reasons</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={profile?.phone || ''}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ''}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 capitalize"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={profile?.joinDate || ''}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <textarea
                            value={profile?.address || ''}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                <p className="text-gray-600 text-sm mt-1">Manage your password and security preferences</p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Security Features</h3>
                  <p className="text-gray-500">Password management and security settings will be available soon.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Account Preferences</h2>
                <p className="text-gray-600 text-sm mt-1">Customize your banking experience</p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Preferences</h3>
                  <p className="text-gray-500">Notification and account preference settings will be available soon.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile