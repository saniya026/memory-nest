import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      toast.success(data.message)
      setEmail('')
    } catch (error) {
      console.log('Error:', error)
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-pink-500 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-pink-500">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword