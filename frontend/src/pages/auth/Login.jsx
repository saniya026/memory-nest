import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/layout/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const flashMsg = location.state?.message;

  // ✅ Checkout ya jaha se aaya tha uska path
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (flashMsg) toast.error(flashMsg);
  }, [flashMsg]);

  // ✅ Ye useEffect hata do ya change kar do
  // Purana: hamesha /admin ya /dashboard bhej raha tha
  useEffect(() => {
    if (isAuthenticated) {
      // Agar 'from' hai to wahi bhejo, warna role ke hisaab se
      if (location.state?.from) {
        navigate(from, { replace: true });
      } else {
        navigate(isAdmin? '/admin' : '/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, from, location.state]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);

      // ✅ Sabse important: pehle 'from' check karo
      if (location.state?.from) {
        navigate(from, { replace: true });
      } else {
        navigate(data.user.role === 'admin'? '/admin' : '/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <Logo className="justify-center text-2xl" />
        <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">Customers & admin — sign in to continue</p>
      </div>

      {flashMsg && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          {flashMsg}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card dark:bg-gray-800">
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Link to="/forgot-password" className="block text-sm text-rose hover:underline">
          Forgot password?
        </Link>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading? 'Signing in...' : 'Login'}
        </button>
        <p className="text-center text-sm text-gray-500">
          New customer?{' '}
          <Link to="/signup" className="font-semibold text-rose">
            Create account
          </Link>
        </p>
        <p className="text-center text-sm">
          <Link to="/" className="text-gray-500 hover:text-rose">
            ← Back to homepage
          </Link>
        </p>
      </form>
    </div>
  );
}