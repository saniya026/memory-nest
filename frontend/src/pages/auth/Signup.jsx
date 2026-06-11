import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/layout/Logo'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
    } catch (err) {
      // Error handled in register
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h- max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <Logo className="justify-center text-2xl" />
        <h1 className="mt-4 font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">Start saving your memories</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card">
        <input
          className="input-field"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value })}
          required
        />
        <input
          type="tel"
          className="input-field"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({...form, phone: e.target.value })}
          pattern="[0-9]{10}"
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value })}
          minLength={6}
          required
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have account? <Link to="/login" className="font-semibold text-rose">Login</Link>
        </p>
      </form>
    </div>
  )
}