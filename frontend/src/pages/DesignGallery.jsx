import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function DesignGallery() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/designs?isGallery=true') // Backend me filter lagana padega
      .then(res => setDesigns(res.data))
      .catch(() => toast.error('Failed to load gallery'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading gallery...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">Design Gallery</h1>
      <p className="text-gray-600 mb-6">Browse our completed designs for inspiration</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {designs.map(design => (
          <div key={design._id} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
            <img 
              src={design.thumbnail} 
              alt={design.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold">{design.title}</h3>
              <p className="text-gray-600 text-sm">{design.category}</p>
              {/* ❌ Yaha Buy button nahi hai */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}