import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/layout/Logo';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      toast.success('Check your email for the 6-digit OTP');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetWithOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password-otp', { email, otp, password });
      setSession(data.token, data.user);
      toast.success('Password updated!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <Logo className="mb-6 justify-center" />
      <form
        onSubmit={step === 1 ? sendOtp : resetWithOtp}
        className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card dark:bg-gray-800"
      >
        <h1 className="font-display text-xl font-bold">Forgot Password</h1>
        <p className="text-sm text-gray-500">
          {step === 1
            ? 'We will email you a one-time code to reset your password.'
            : 'Enter the OTP from your email and choose a new password.'}
        </p>

        {step === 1 ? (
          <>
            <input
              type="email"
              className="input-field"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              className="input-field text-center text-lg tracking-widest"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="New password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-rose">
              Resend OTP
            </button>
          </>
        )}
        <Link to="/login" className="block text-center text-sm text-rose">
          Back to login
        </Link>
      </form>
    </div>
  );
}
