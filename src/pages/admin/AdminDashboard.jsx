import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  UserPlus,
  ArrowUp,
  ArrowDown,
  Shield,
  BarChart3,
  Calendar,
  MoreVertical
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return { value: 100, isPositive: true }
    const growth = ((current - previous) / previous) * 100
    return { value: Math.abs(growth).toFixed(1), isPositive: growth >= 0 }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  const adminStats = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      previous: 45, // Mock previous data
      icon: Users,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Total Accounts',
      value: stats?.totalAccounts || 0,
      previous: 52,
      icon: CreditCard,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions || 0,
      previous: 1240,
      icon: TrendingUp,
      color: 'purple',
      trend: 'up'
    },
    {
      title: 'Platform Balance',
      value: `₹${(stats?.totalBalance || 0).toLocaleString()}`,
      previous: 45000000,
      icon: DollarSign,
      color: 'yellow',
      trend: 'up'
    }
  ]

  const quickActions = [
    { icon: UserPlus, label: 'Add User', color: 'blue', action: () => {} },
    { icon: Shield, label: 'Security', color: 'green', action: () => {} },
    { icon: BarChart3, label: 'Reports', color: 'purple', action: () => {} },
    { icon: Calendar, label: 'Schedule', color: 'yellow', action: () => {} },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your platform</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className={`h-5 w-5 text-${action.color}-600`} />
            </div>
            <p className="text-sm font-medium text-gray-900">{action.label}</p>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
          const growth = getGrowthRate(stat.value, stat.previous)
          
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  growth.isPositive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {growth.isPositive ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span>{growth.value}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>vs previous period</span>
                  <span className="font-medium">{stat.previous?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
              <p className="text-sm text-gray-600 mt-1">Newly registered users</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            {stats?.recentUsers?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((user, index) => (
                  <div key={user._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No users found</p>
                <p className="text-sm text-gray-400 mt-1">Users will appear here once registered</p>
              </div>
            )}
            
            {stats?.recentUsers?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  View all users →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Platform Activity */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Platform Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Recent system events</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {[
                { type: 'user', action: 'registered', user: 'John Doe', time: '2 min ago' },
                { type: 'transaction', action: 'completed', amount: '₹5,000', time: '5 min ago' },
                { type: 'account', action: 'created', user: 'Sarah Wilson', time: '10 min ago' },
                { type: 'system', action: 'update', description: 'Security patch applied', time: '1 hour ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100' :
                    activity.type === 'transaction' ? 'bg-green-100' :
                    activity.type === 'account' ? 'bg-purple-100' : 'bg-yellow-100'
                  }`}>
                    <Activity className={`h-4 w-4 ${
                      activity.type === 'user' ? 'text-blue-600' :
                      activity.type === 'transaction' ? 'text-green-600' :
                      activity.type === 'account' ? 'text-purple-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {activity.type === 'user' && `${activity.user} ${activity.action}`}
                      {activity.type === 'transaction' && `Transaction ${activity.action}: ${activity.amount}`}
                      {activity.type === 'account' && `Account ${activity.action} for ${activity.user}`}
                      {activity.type === 'system' && activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard