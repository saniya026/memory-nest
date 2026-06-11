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

  // 1. OTP Bhejo - Signup ke time
  const sendOTP = async (phone) => {
    const randomOTP = Math.floor(100000 + Math.random() * 900000)
    localStorage.setItem('currentOTP', randomOTP.toString())
    localStorage.setItem('tempPhone', phone)
    console.log(`OTP for ${phone}: ${randomOTP}`)
    toast.success(`OTP sent to ${phone}`)
    return true
  }

  // 2. OTP Verify Karo
  const verifyOTP = async (otp) => {
    const correctOTP = localStorage.getItem('currentOTP')
    if (otp === correctOTP) {
      localStorage.removeItem('currentOTP')
      return true
    }
    toast.error('Wrong OTP')
    return false
  }

  // 3. SIGNUP - Account Banao
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
    localStorage.removeItem('tempPhone')
    toast.success('Account created successfully!')
    navigate('/dashboard')
    return userData
  }

  // 4. LOGIN - Email Password Se
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
      sendOTP,
      verifyOTP,
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)