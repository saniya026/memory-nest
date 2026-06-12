import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function CustomizeForm({ service }) {
  const [form, setForm] = useState({
    style: '',
    message: '',
    color: '#FF69B4',
    instructions: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) {
      toast.error('Please select at least 1 photo');
      return;
    }
    // ✅ Limit hata di - jitni marzi
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (files.length === 0) {
      toast.error('Please upload at least 1 photo');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('serviceId', service._id);
      formData.append('style', form.style || 'Default');
      formData.append('color', form.color);
      formData.append('message', form.message);
      formData.append('instructions', form.instructions);

      files.forEach((file) => {
        formData.append('photos', file);
      });

      const res = await api.post('/cart/add-custom', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success(`${files.length} photos added to cart!`);
        navigate('/cart');
      } else {
        toast.error(res.data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.log('Cart error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Customize Your Memory</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Photos * <span className="text-xs text-gray-500">(Select all at once)</span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded-lg p-2"
          required
        />
        {files.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-green-600 mb-1">{files.length} photo(s) selected</p>
            <div className="max-h-32 overflow-y-auto flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {file.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Visual Style</label>
        <select
          value={form.style}
          onChange={(e) => setForm({...form, style: e.target.value })}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Style</option>
          <option value="Classic">Classic</option>
          <option value="Modern">Modern</option>
          <option value="Vintage">Vintage</option>
          <option value="Minimal">Minimal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Frame/Theme Color</label>
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm({...form, color: e.target.value })}
          className="w-full h-10 border rounded-lg cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Message / Story</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value })}
          className="w-full border rounded-lg p-2"
          rows="3"
          placeholder="Write your message here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Special Instructions</label>
        <textarea
          value={form.instructions}
          onChange={(e) => setForm({...form, instructions: e.target.value })}
          className="w-full border rounded-lg p-2"
          rows="2"
          placeholder="Any special requests..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || files.length === 0}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading? 'Adding to Cart...' : `Add ${files.length || ''} Photos to Cart`}
      </button>
    </form>
  );
}