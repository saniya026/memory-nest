import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // ✅ useNavigate add kiya
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/layout/Logo'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('') // ✅ Error show karne ke liye
  const { login } = useAuth()
  const navigate = useNavigate() // ✅ Ye line add ki

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('') // Error reset kar do
    try {
      await login(form.email, form.password)
      navigate('/') // ✅ Login success ke baad home page pe redirect
      // navigate('/dashboard') bhi kar sakta hai agar dashboard hai
    } catch (err) {
      setError(err.message) // ✅ Error set kar diya
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <Logo className="justify-center text-2xl" />
        <h1 className="mt-4 font-display text-2xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-500">Login to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card">
        {/* ✅ Error message show karne ke liye */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value })}
          required
        />
        
        <div className="text-right">
          <Link 
            to="/forgot-password" 
            className="text-sm text-rose hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading? 'Logging in...' : 'Login'}
        </button>
        
        <p className="text-center text-sm text-gray-500">
          Don't have account? <Link to="/signup" className="font-semibold text-rose">Sign up</Link>
        </p>
      </form>
    </div>
  )
}