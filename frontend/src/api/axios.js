import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://memory-nest-backend.onrender.com/api'
})

// Request interceptor - har API call me token auto attach hoga
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const token = JSON.parse(userInfo).token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor - 401 pe logout kar do
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
      toast.error('Session expired. Please login again')
    }
    return Promise.reject(err)
  }
)

export default api