import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  X, 
  LayoutDashboard, 
  CreditCard, 
  History, 
  User, 
  Settings, 
  Users, 
  BarChart3,
  Wallet,
  PiggyBank,
  ArrowRightLeft,
  Shield,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & analytics'
    },
    { 
      name: 'Accounts', 
      href: '/accounts', 
      icon: CreditCard,
      description: 'Manage your accounts'
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: History,
      description: 'Transaction history'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: User,
      description: 'Account settings'
    },
  ]

  const adminNavigation = [
    { 
      name: 'Admin Dashboard', 
      href: '/admin', 
      icon: Users,
      description: 'Platform management'
    },
  ]

  const secondaryNavigation = [
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      description: 'App preferences'
    },
    { 
      name: 'Help & Support', 
      href: '/support', 
      icon: HelpCircle,
      description: 'Get assistance'
    },
  ]

  const NavItem = ({ item, onClick }) => {
    const isActive = location.pathname === item.href
    
    return (
      <NavLink
        to={item.href}
        onClick={onClick}
        className={`
          group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 relative
          ${isActive 
            ? 'bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-200 shadow-sm' 
            : 'hover:bg-gray-50 hover:border-gray-200 border border-transparent'
          }
        `}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
        )}
        
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
          }
        `}>
          <item.icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`
            font-medium transition-colors
            ${isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}
          `}>
            {item.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {item.description}
          </p>
        </div>

        {/* Hover arrow */}
        <ArrowRightLeft className={`
          h-4 w-4 transition-all duration-200
          ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `} />
      </NavLink>
    )
  }

  const handleNavClick = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/60
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Raynott
              </h1>
              <p className="text-xs text-gray-500">Fintech Platform</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Banking
              </p>
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={handleNavClick} />
              ))}
            </div>

            {/* Admin Navigation */}
            {user?.role === 'admin' && (
              <div className="space-y-1 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Administration
                </p>
                {adminNavigation.map((item) => (
                  <NavItem key={item.name} item={item} onClick={handleNavClick} />
                ))}
              </div>
            )}

            {/* Secondary Navigation */}
            <div className="space-y-1 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Preferences
              </p>
              {secondaryNavigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={handleNavClick} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/60">
          <div className="space-y-3">
            {/* Security Badge */}
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs font-medium text-green-800">Protected</p>
                <p className="text-xs text-green-600">Bank-grade security</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>

          {/* Version */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">v2.1.0 • Raynott Fintech</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar