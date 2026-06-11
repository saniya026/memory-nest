import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/layout/Logo'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch (err) {
      // Error handled in login function
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h- max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <Logo className="justify-center text-2xl" />
        <h1 className="mt-4 font-display text-2xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-500">Login to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card">
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