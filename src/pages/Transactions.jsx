import React, { useState, useEffect } from 'react'
import { transactionsAPI, accountsAPI } from '../services/api'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  Filter, 
  Search,
  Download,
  Calendar,
  IndianRupee,
  MoreVertical,
  TrendingUp,
  Wallet,
  RefreshCw,
  Eye
} from 'lucide-react'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [transactionsRes, accountsRes] = await Promise.all([
        transactionsAPI.getAll(),
        accountsAPI.getAll()
      ])
      setTransactions(transactionsRes.data)
      setAccounts(accountsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />
      case 'withdraw':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case 'transfer':
        return <ArrowRightLeft className="h-5 w-5 text-blue-500" />
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'withdraw':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'transfer':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTransactionBadge = (type) => {
    switch (type) {
      case 'deposit':
        return { label: 'Deposit', color: 'green' }
      case 'withdraw':
        return { label: 'Withdrawal', color: 'red' }
      case 'transfer':
        return { label: 'Transfer', color: 'blue' }
      default:
        return { label: 'Transaction', color: 'gray' }
    }
  }

  const formatAmount = (amount, type) => {
    const sign = type === 'deposit' ? '+' : '-'
    return `${sign}₹${amount.toLocaleString()}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.type !== filter) return false
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesDescription = transaction.description?.toLowerCase().includes(searchLower)
      const matchesAmount = transaction.amount.toString().includes(searchTerm)
      const matchesAccount = transaction.fromAccount?.name?.toLowerCase().includes(searchLower) || 
                           transaction.toAccount?.name?.toLowerCase().includes(searchLower)
      
      if (!matchesDescription && !matchesAmount && !matchesAccount) return false
    }
    
    return true
  })

  // Calculate summary statistics
  const summary = {
    total: filteredTransactions.length,
    deposits: filteredTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
    withdrawals: filteredTransactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0),
    transfers: filteredTransactions.filter(t => t.type === 'transfer').length
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track and manage all your financial activities</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deposits</p>
              <p className="text-2xl font-bold text-gray-900 flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {summary.deposits.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {summary.withdrawals.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transfers</p>
              <p className="text-2xl font-bold text-gray-900">{summary.transfers}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdraw">Withdrawals</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Wallet className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Transactions will appear here once you start using your accounts'
            }
          </p>
          {(searchTerm || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilter('all')
                setDateRange('all')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const badge = getTransactionBadge(transaction.type)
                
                return (
                  <div 
                    key={transaction._id} 
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-3 rounded-xl ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {transaction.description || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${badge.color}-100 text-${badge.color}-700`}>
                            {badge.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(transaction.createdAt)}</span>
                          <span>•</span>
                          <span className="truncate">
                            {transaction.type === 'transfer' 
                              ? `From ${transaction.fromAccount?.name} to ${transaction.toAccount?.name}`
                              : transaction.fromAccount 
                                ? `From ${transaction.fromAccount.name}`
                                : transaction.toAccount 
                                  ? `To ${transaction.toAccount.name}`
                                  : 'Account'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`text-right ${getTransactionColor(transaction.type).split(' ')[0]}`}>
                        <p className="font-bold text-lg">
                          {formatAmount(transaction.amount, transaction.type)}
                        </p>
                        <p className="text-sm text-gray-500">Balance update</p>
                      </div>
                      
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Load More */}
          {filteredTransactions.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                Load More Transactions
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount</span>
                <span className={`text-lg font-bold ${
                  selectedTransaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatAmount(selectedTransaction.amount, selectedTransaction.type)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Type</span>
                <span className="capitalize font-medium">{selectedTransaction.type}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Date</span>
                <span>{new Date(selectedTransaction.createdAt).toLocaleString()}</span>
              </div>
              
              {selectedTransaction.description && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Description</span>
                  <span className="text-right">{selectedTransaction.description}</span>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Account Details</p>
                {selectedTransaction.fromAccount && (
                  <div className="flex justify-between text-sm">
                    <span>From:</span>
                    <span>{selectedTransaction.fromAccount.name}</span>
                  </div>
                )}
                {selectedTransaction.toAccount && (
                  <div className="flex justify-between text-sm">
                    <span>To:</span>
                    <span>{selectedTransaction.toAccount.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions