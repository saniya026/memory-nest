import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/layout/Logo'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const { sendOTP, verifyOTP, register } = useAuth()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendOTP(form.phone)
      setStep(2)
    } catch (err) {
      toast.error('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const isValid = await verifyOTP(otp)
      if (isValid) {
        await register(form.name, form.email, form.password, form.phone)
      }
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h- max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <Logo className="justify-center text-2xl" />
        <h1 className="mt-4 font-display text-2xl font-bold">
          {step === 1? 'Create your account' : 'Verify Phone'}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {step === 1? 'Enter your details' : `Enter OTP sent to ${form.phone}`}
        </p>
      </div>

      {step === 1? (
        <form onSubmit={handleSendOTP} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card">
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
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value })}
            minLength={6}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading? 'Sending...' : 'Send OTP'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have account? <Link to="/login" className="font-semibold text-rose">Login</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndSignup} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card">
          <input
            type="text"
            className="input-field text-center text-2xl tracking-widest"
            placeholder="------"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading? 'Verifying...' : 'Verify & Create Account'}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500">
            Change number
          </button>
        </form>
      )}
    </div>
  )
}