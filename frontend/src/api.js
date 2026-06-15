import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: 'https://memory-nest-backend.onrender.com/api', // ← /api add kiya
})

// Har request me token bhejo
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const { token } = JSON.parse(userInfo)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token expire ho to logout kar de
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('userInfo')
      window.location.replace('/login')
      toast.error('Session expired. Login again')
    }
    return Promise.reject(err)
  }
)

export default api