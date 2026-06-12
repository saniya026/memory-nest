import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('mn_token')
    const savedUser = localStorage.getItem('memoryNestUser')
    if (token && savedUser) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('mn_token', data.token);
    localStorage.setItem('memoryNestUser', JSON.stringify(data.user)); // ✅ .user add kiya
    setUser(data.user); // ✅ .user add kiya
    toast.success('Account created!');
    navigate('/home');
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('mn_token', data.token);
    localStorage.setItem('memoryNestUser', JSON.stringify(data.user)); // ✅ .user add kiya
    setUser(data.user); // ✅ .user add kiya
    toast.success('Welcome back!');
    navigate('/home');
  }

  const logout = () => {
    localStorage.removeItem('mn_token');
    localStorage.removeItem('memoryNestUser');
    setUser(null);
    toast.success('Logged out');
    navigate('/login');
  }

  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin,
      loading,
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)