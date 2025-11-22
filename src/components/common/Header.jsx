import React, { useState, useRef, useEffect } from 'react'
import { Menu, Bell, User, LogOut, Settings, HelpCircle, Shield, Moon, Sun } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you would update the theme context or localStorage here
  }

  const notifications = [
    {
      id: 1,
      title: 'Deposit Successful',
      message: '₹5,000 has been deposited to your Savings account',
      time: '2 minutes ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Security Alert',
      message: 'New login from Mumbai, India',
      time: '1 hour ago',
      read: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Weekly Report',
      message: 'Your weekly spending report is ready',
      time: '2 hours ago',
      read: true,
      type: 'info'
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '🟢'
      case 'warning':
        return '🟡'
      case 'info':
        return '🔵'
      default:
        return '⚪'
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Raynott Fintech
              </h1>
              <p className="text-xs text-gray-500">Welcome back, {user?.name?.split(' ')[0]}! 👋</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/80 backdrop-blur-sm z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                      Mark all as read
                    </span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </p>
                          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-semibold text-sm">
                  {getUserInitials(user?.name || 'User')}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {user?.role} Account
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/80 backdrop-blur-sm z-50">
                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-sm">
                        {getUserInitials(user?.name || 'User')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header