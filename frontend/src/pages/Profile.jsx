import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="mb-4">Please login to view profile</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  const save = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800 md:hidden">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush to-lavender text-2xl">
          {user?.name?.[0] || '✨'}
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-card dark:bg-gray-800">
        <h2 className="hidden font-display text-xl font-bold md:block">Edit Profile</h2>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
        />
        <input
          className="input-field"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
        />
        <input
          className="input-field"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          placeholder="Avatar URL"
        />
        <button type="submit" className="btn-primary w-full">Save Changes</button>
      </form>
      <div className="mt-6 grid gap-3 md:hidden">
        <Link to="/dashboard/orders" className="btn-secondary w-full text-center">My Orders</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="btn-secondary w-full text-center">Admin Panel</Link>
        )}
        <button type="button" onClick={logout} className="w-full py-3 text-rose font-semibold">
          Logout
        </button>
      </div>
    </div>
  );
}
