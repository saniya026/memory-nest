import { useState } from 'react';
import api from '../../axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddDesign() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    title: '', 
    image: '', 
    category: 'Birthday', 
    price: '', 
    description: '',
    type: 'service' // ✅ Default service
  });

  if (user?.role !== 'admin') return <div className="p-6">Admin access only</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gallery type ke liye price 0 kar de
      const payload = {
        ...form,
        price: form.type === 'gallery' ? 0 : Number(form.price)
      };
      
      await api.post('/designs', payload);
      toast.success('Design uploaded successfully!');
      navigate('/admin/services'); // Ya jaha dikhana hai
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error uploading design');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Design</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ✅ Design Type - Sabse Important */}
        <div>
          <label className="block text-sm font-medium mb-1">Design Type *</label>
          <select 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
            value={form.type}
            onChange={e => setForm({...form, type: e.target.value})} 
            required
          >
            <option value="service">Service - Customer Buy Kar Sakta Hai</option>
            <option value="gallery">Gallery - Sirf Showcase Ke Liye</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {form.type === 'service' 
              ? '⚠️ /services page pe dikhega, Buy Now button hoga' 
              : '⚠️ /gallery page pe dikhega, Buy button nahi hoga'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Design Title *</label>
          <input 
            className="w-full p-2 border rounded-lg" 
            placeholder="e.g. Wedding Invitation Card"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL *</label>
          <input 
            className="w-full p-2 border rounded-lg" 
            placeholder="https://..." 
            value={form.image}
            onChange={e => setForm({...form, image: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select 
            className="w-full p-2 border rounded-lg"
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            required
          >
            <option>Birthday</option>
            <option>Wedding</option>
            <option>Anniversary</option>
            <option>Graduation</option>
            <option>Love</option>
            <option>Custom</option>
          </select>
        </div>

        {/* ✅ Price sirf service type me dikhega */}
        {form.type === 'service' && (
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹) *</label>
            <input 
              className="w-full p-2 border rounded-lg" 
              placeholder="2999" 
              type="number"
              min="0"
              value={form.price}
              onChange={e => setForm({...form, price: e.target.value})}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            className="w-full p-2 border rounded-lg" 
            placeholder="Design ke baare me likho..." 
            rows="3"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} 
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-lg font-semibold"
        >
          Upload Design
        </button>
      </form>
    </div>
  );
}