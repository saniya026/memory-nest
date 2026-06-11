import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// ✅ Ye interceptor add kar - Har request me token auto attach hoga
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mn_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mn_token')
      localStorage.removeItem('memoryNestUser')
      window.location.href = '/login'
      toast.error('Session expired. Please login again')
    }
    return Promise.reject(err)
  }
)

export default api