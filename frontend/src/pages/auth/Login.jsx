import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/layout/Logo'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    console.log('1. Login button clicked');
    console.log('2. Form data:', form);
    
    try {
      console.log('3. Calling login function...');
      const userData = await login(form.email, form.password);
      
      console.log('4. Login Success! UserData:', userData);
      console.log('5. Redirecting to home...');
      
      navigate('/'); 
    } catch (err) {
      console.log('6. LOGIN ERROR CAUGHT:', err);
      console.log('7. Error message:', err.message);
      console.log('8. Error response:', err.response?.data);
      setError(err.message)
    } finally {
      setLoading(false)
      console.log('9. Loading finished');
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p className="text-center text-sm text-gray-500">
          Don't have account? <Link to="/signup" className="font-semibold text-rose">Sign up</Link>
        </p>
      </form>
    </div>
  )
}