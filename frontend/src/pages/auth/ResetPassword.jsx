import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'https://memory-nest-backend.onrender.com';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`${API_URL}/api/auth/reset-password/${token}`, { password });

      // FIX: AuthContext ke format me save karo
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin || false,
        token: data.token
      };

      localStorage.setItem('userInfo', JSON.stringify(userData));
      toast.success('Password updated!');

      setTimeout(() => {
        window.location.replace('/');
      }, 300);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-8 shadow-card dark:bg-gray-800">
        <h1 className="font-display text-xl font-bold">Set New Password</h1>
        <input
          type="password"
          className="input-field"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading? 'Updating...' : 'Update Password'}
        </button>
        <Link to="/login" className="block text-center text-sm text-rose">
          Login
        </Link>
      </form>
    </div>
  );
}