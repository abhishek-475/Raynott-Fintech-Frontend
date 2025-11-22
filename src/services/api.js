import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
}

export const accountsAPI = {
  getAll: () => API.get('/accounts'),
  create: (data) => API.post('/accounts', data),
  deposit: (data) => API.post('/accounts/deposit', data),
  withdraw: (data) => API.post('/accounts/withdraw', data),
  transfer: (data) => API.post('/accounts/transfer', data),
}

export const transactionsAPI = {
  getAll: () => API.get('/transactions'),
  getByAccount: (accountId) => API.get(`/transactions/account/${accountId}`),
  getSingle: (id) => API.get(`/transactions/${id}`),
}

export const dashboardAPI = {
  getData: () => API.get('/dashboard'),
}

export const usersAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/change-password', data),
}

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  getUserDetails: (userId) => API.get(`/admin/users/${userId}`),
  updateUserRole: (userId, data) => API.put(`/admin/users/${userId}/role`, data),
  deleteUser: (userId) => API.delete(`/admin/users/${userId}`),
  getAccounts: () => API.get('/admin/accounts'),
  getTransactions: () => API.get('/admin/transactions'),
}

export default API