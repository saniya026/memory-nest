import { useState } from 'react';
import api from '../../axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddDesign() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', image: '', category: '', price: '', description: '' });

  if (user?.role !== 'admin') return <div className="p-6">Admin access only</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/designs', form);
      alert('Design uploaded!');
      navigate('/designs');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Design</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Design Title" 
          onChange={e => setForm({...form, title: e.target.value})} required />
        <input className="w-full p-2 border rounded" placeholder="Image URL" 
          onChange={e => setForm({...form, image: e.target.value})} required />
        <input className="w-full p-2 border rounded" placeholder="Category" 
          onChange={e => setForm({...form, category: e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Price" type="number"
          onChange={e => setForm({...form, price: e.target.value})} />
        <textarea className="w-full p-2 border rounded" placeholder="Description" 
          onChange={e => setForm({...form, description: e.target.value})} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Upload Design</button>
      </form>
    </div>
  );
}