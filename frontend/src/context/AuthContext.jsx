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
    const savedUser = localStorage.getItem('memoryNestUser')
    if (savedUser) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/users/register', { name, email, password, phone });
    localStorage.setItem('mn_token', data.token);
    localStorage.setItem('memoryNestUser', JSON.stringify(data));
    setUser(data);
    toast.success('Account created!');
    navigate('/home');
  }

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('mn_token', data.token);
    localStorage.setItem('memoryNestUser', JSON.stringify(data));
    setUser(data);
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

  // ✅ isAdmin yaha add kiya
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin, // ✅ Ye return karna zaroori hai
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