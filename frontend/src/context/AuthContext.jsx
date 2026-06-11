import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

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

  // SIGNUP - Direct account banao
  const register = async (name, email, password, phone) => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    
    if (allUsers.find(u => u.email === email)) {
      toast.error('Email already registered')
      throw new Error('Email exists')
    }

    const userData = {
      id: Date.now(),
      name,
      email,
      phone,
      password
    }

    allUsers.push(userData)
    localStorage.setItem('allUsers', JSON.stringify(allUsers))
    localStorage.setItem('memoryNestUser', JSON.stringify(userData))
    setUser(userData)
    toast.success('Account created successfully!')
    navigate('/dashboard')
    return userData
  }

  // LOGIN - Email Password se
  const login = async (email, password) => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const foundUser = allUsers.find(u => u.email === email && u.password === password)

    if (foundUser) {
      localStorage.setItem('memoryNestUser', JSON.stringify(foundUser))
      setUser(foundUser)
      toast.success('Welcome back!')
      navigate('/dashboard')
      return true
    }
    toast.error('Invalid email or password')
    throw new Error('Invalid credentials')
  }

  const logout = () => {
    localStorage.removeItem('memoryNestUser')
    setUser(null)
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated:!!user,
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