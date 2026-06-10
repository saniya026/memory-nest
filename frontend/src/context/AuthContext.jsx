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

  const sendOTP = async (emailOrPhone) => {
    await new Promise(r => setTimeout(r, 1000))
    toast.success(`OTP sent: Use 123456`)
    localStorage.setItem('tempAuth', emailOrPhone)
    return true
  }

  const verifyOTP = async (otp) => {
    const emailOrPhone = localStorage.getItem('tempAuth')
    if (otp === '123456') {
      const userData = {
        id: Date.now(),
        email: emailOrPhone,
        name: emailOrPhone.split('@')[0] || 'User'
      }
      localStorage.setItem('memoryNestUser', JSON.stringify(userData))
      localStorage.removeItem('tempAuth')
      setUser(userData)
      toast.success('Welcome!')
      navigate('/home')
      return true
    }
    toast.error('Wrong OTP. Use 123456')
    return false
  }

  const register = async (name, email, password, phone) => {
    await new Promise(r => setTimeout(r, 1000))
    const userData = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone
    }
    localStorage.setItem('memoryNestUser', JSON.stringify(userData))
    setUser(userData)
    toast.success('Welcome to your memory nest!')
    return userData
  }

  const resetPassword = async (newPass) => {
    toast.success('Password updated! Login again')
    navigate('/login')
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
      isAdmin: user?.email === 'admin@memorynest.com',
      loading,
      sendOTP,
      verifyOTP,
      resetPassword,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)