import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      localStorage.setItem('mn_token', data.token);
      toast.success('Password updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
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
        <button type="submit" className="btn-primary w-full">
          Update Password
        </button>
        <Link to="/login" className="block text-center text-sm text-rose">
          Login
        </Link>
      </form>
    </div>
  );
}
