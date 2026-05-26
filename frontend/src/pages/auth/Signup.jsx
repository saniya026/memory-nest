import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/layout/Logo';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <Logo className="justify-center text-2xl" />
        <h1 className="mt-4 font-display text-2xl font-bold">Create your nest</h1>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white/90 p-8 shadow-card dark:bg-gray-800">
        <input
          className="input-field"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={6}
          required
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
        <p className="text-center text-sm text-gray-500">
          Have an account? <Link to="/login" className="font-semibold text-rose">Login</Link>
        </p>
      </form>
    </div>
  );
}
