import React, { useState, useEffect } from 'react'
import { accountsAPI } from '../services/api'
import { 
  Plus, 
  CreditCard, 
  IndianRupee, 
  TrendingUp, 
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  MoreVertical,
  Eye,
  PiggyBank,
  Building
} from 'lucide-react'

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    amount: '',
    description: ''
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAll()
      setAccounts(response.data)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    try {
      await accountsAPI.create({
        name: formData.name,
        type: formData.type
      })
      setShowCreateModal(false)
      setFormData({ name: '', type: 'checking', amount: '', description: '' })
      fetchAccounts()
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  const handleDeposit = async (e) => {
    e.preventDefault()
    try {
      await accountsAPI.deposit({
        accountId: selectedAccount._id,
        amount: parseFloat(formData.amount),
        description: formData.description
      })
      setShowDepositModal(false)
      setFormData({ name: '', type: 'checking', amount: '', description: '' })
      setSelectedAccount(null)
      fetchAccounts()
    } catch (error) {
      console.error('Failed to deposit:', error)
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    try {
      await accountsAPI.withdraw({
        accountId: selectedAccount._id,
        amount: parseFloat(formData.amount),
        description: formData.description
      })
      setShowWithdrawModal(false)
      setFormData({ name: '', type: 'checking', amount: '', description: '' })
      setSelectedAccount(null)
      fetchAccounts()
    } catch (error) {
      console.error('Failed to withdraw:', error)
    }
  }

  const openDepositModal = (account) => {
    setSelectedAccount(account)
    setFormData({ ...formData, amount: '', description: '' })
    setShowDepositModal(true)
  }

  const openWithdrawModal = (account) => {
    setSelectedAccount(account)
    setFormData({ ...formData, amount: '', description: '' })
    setShowWithdrawModal(true)
  }

  const getAccountIcon = (type) => {
    switch (type) {
      case 'savings':
        return <PiggyBank className="h-6 w-6" />
      case 'checking':
        return <Wallet className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
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

  const getAccountTypeLabel = (type) => {
    switch (type) {
      case 'savings':
        return 'Savings Account'
      case 'checking':
        return 'Checking Account'
      default:
        return type
    }
  }

  const filteredAccounts = activeTab === 'all' 
    ? accounts 
    : accounts.filter(account => account.type === activeTab)

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your bank accounts and transactions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>New Account</span>
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Balance</p>
            <p className="text-3xl font-bold mt-2 flex items-center">
              <IndianRupee className="h-7 w-7 mr-1" />
              {totalBalance.toLocaleString()}
            </p>
            <p className="text-blue-200 text-sm mt-2">Across all accounts</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <TrendingUp className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Account Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'all', label: 'All Accounts', count: accounts.length },
            { id: 'checking', label: 'Checking', count: accounts.filter(a => a.type === 'checking').length },
            { id: 'savings', label: 'Savings', count: accounts.filter(a => a.type === 'savings').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <CreditCard className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first account.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Account</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => (
            <div key={account._id} className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
              <div className="p-6">
                {/* Account Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getAccountColor(account.type)}`}>
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {account.name}
                      </h3>
                      <p className="text-sm text-gray-500">{getAccountTypeLabel(account.type)}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Balance */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900 flex items-center">
                    <IndianRupee className="h-7 w-7 mr-1" />
                    {account.balance.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Current balance</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => openDepositModal(account)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
                  >
                    <ArrowUpCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Deposit</span>
                  </button>
                  <button
                    onClick={() => openWithdrawModal(account)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
                  >
                    <ArrowDownCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>

              {/* Account Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Account ID: {account._id.slice(-8)}</span>
                  <span className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>View Details</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Account</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateAccount}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Personal Savings"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Deposit to {selectedAccount.name}
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleDeposit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
                >
                  Deposit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Withdraw from {selectedAccount.name}
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleWithdraw}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  {formData.amount > selectedAccount.balance && (
                    <p className="text-red-600 text-sm mt-2">
                      Insufficient balance. Available: ₹{selectedAccount.balance.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formData.amount > selectedAccount.balance}
                  className="px-6 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  Withdraw Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Accounts