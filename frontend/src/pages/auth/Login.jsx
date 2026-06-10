import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    const success = await sendOTP(input);
    setLoading(false);
    if (success) navigate('/verify-otp', { state: { type: 'login' } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose/5 to-lavender/5 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <h2 className="text-center text-3xl font-bold">Welcome Back</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">Login to continue</p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-rose focus:outline-none dark:border-gray-600 dark:bg-gray-700"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            New here? <Link to="/signup" className="font-semibold text-rose">Create account</Link>
          </p>
          <Link to="/forgot-password" className="mt-2 inline-block text-gray-500 hover:text-rose">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}