import React, { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownLeft,
  IndianRupee,
  Eye,
  RefreshCw,
  PiggyBank,
  Wallet,
  BarChart3,
  Calendar,
  Plus
} from 'lucide-react'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getData()
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case 'withdraw':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'transfer':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const getAccountIcon = (type) => {
    switch (type) {
      case 'savings':
        return <PiggyBank className="h-5 w-5" />
      case 'checking':
        return <Wallet className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getAccountColor = (type) => {
    switch (type) {
      case 'savings':
        return 'from-green-500 to-emerald-600'
      case 'checking':
        return 'from-blue-500 to-cyan-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Balance',
      value: `₹${data?.totalBalance?.toLocaleString() || 0}`,
      subtitle: 'Across all accounts',
      icon: DollarSign,
      color: 'blue',
      trend: '+2.5%',
      trendPositive: true
    },
    {
      title: 'Total Accounts',
      value: data?.accountsCount || 0,
      subtitle: 'Active accounts',
      icon: CreditCard,
      color: 'green',
      trend: '+1',
      trendPositive: true
    },
    {
      title: 'Transactions',
      value: data?.recentTransactions?.length || 0,
      subtitle: 'This month',
      icon: TrendingUp,
      color: 'purple',
      trend: '+12%',
      trendPositive: true
    }
  ]

  const quickActions = [
    { icon: Plus, label: 'Add Money', color: 'green', action: () => {} },
    { icon: ArrowUpRight, label: 'Send Money', color: 'blue', action: () => {} },
    { icon: BarChart3, label: 'Reports', color: 'purple', action: () => {} },
    { icon: Calendar, label: 'Schedule', color: 'yellow', action: () => {} },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                stat.trendPositive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <TrendingUp className="h-3 w-3" />
                <span>{stat.trend}</span>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <p className="text-sm text-gray-600 mt-1">Your latest account activity</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="p-6">
            {data?.recentTransactions?.length > 0 ? (
              <div className="space-y-4">
                {data.recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {transaction.description || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center space-x-2">
                          <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize">{transaction.type}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className={`text-right ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <p className="font-semibold flex items-center justify-end">
                        {transaction.type === 'deposit' ? (
                          <ArrowDownLeft className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        )}
                        ₹{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {transaction.fromAccount?.name || transaction.toAccount?.name || 'Account'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Accounts Summary */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Accounts</h2>
              <p className="text-sm text-gray-600 mt-1">All your banking accounts</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              Manage
            </button>
          </div>
          
          <div className="p-6">
            {data?.accounts?.length > 0 ? (
              <div className="space-y-4">
                {data.accounts.map((account) => (
                  <div key={account._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getAccountColor(account.type)}`}>
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {account.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{account.type} • {account.currency}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 flex items-center justify-end">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {account.balance.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>View Details</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No accounts yet</p>
                <p className="text-sm text-gray-400 mt-1">Create your first account to get started</p>
              </div>
            )}
            
            {/* Total Balance Summary */}
            {data?.accounts?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Across All Accounts</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {data?.totalBalance?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+2.5%</p>
                    <p className="text-xs text-gray-500">vs last month</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Financial Insights</h3>
            <p className="text-blue-100 opacity-90">
              Track your spending patterns and get personalized insights to help you save more.
            </p>
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              View Insights
            </button>
          </div>
          <div className="hidden md:block">
            <BarChart3 className="h-16 w-16 text-white opacity-80" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard