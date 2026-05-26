import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Logo from '../../components/layout/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Check your email for reset link');
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <Logo className="mb-6 justify-center" />
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card dark:bg-gray-800">
        <h1 className="font-display text-xl font-bold">Forgot Password</h1>
        {sent ? (
          <p className="text-gray-600">If your email is registered, you will receive a reset link shortly.</p>
        ) : (
          <>
            <input
              type="email"
              className="input-field"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">
              Send Reset Link
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
