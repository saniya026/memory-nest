import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react'; // npm i lucide-react

export default function DesignGallery() {
  const [designs, setDesigns] = useState([]);
  const [savedIds, setSavedIds] = useState([]); // Wishlist me jo save hai
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Saare designs fetch karo
    api.get('/designs?isGallery=true')
      .then(res => setDesigns(res.data))
      .catch(() => toast.error('Failed to load gallery'))
      .finally(() => setLoading(false));

    // 2. User ki wishlist fetch karo - konse save hai
    api.get('/wishlist')
      .then(res => setSavedIds(res.data.map(item => item.designId)))
      .catch(() => console.log('Not logged in or no wishlist'));
  }, []);

  const handleSave = async (design) => {
    try {
      await api.post('/wishlist', {
        designId: design._id,
        designName: design.title,
        designImage: design.thumbnail,
        price: design.price || 0, // Agar price hai to
        category: design.category
      });
      setSavedIds([...savedIds, design._id]); // UI update
      toast.success('Saved to Wishlist!');
    } catch (error) {
      if(error.response?.status === 400) {
        toast.error('Already saved');
      } else {
        toast.error('Please login first');
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading gallery...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">My Designs</h1>
      <p className="text-gray-600 mb-6">Browse designs and save your favorites</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {designs.map(design => {
          const isSaved = savedIds.includes(design._id);
          return (
            <div key={design._id} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
              <div className="relative">
                <img 
                  src={design.thumbnail} 
                  alt={design.title}
                  className="w-full h-64 object-cover"
                />
                {/* Save Heart Button - Top Right */}
                <button
                  onClick={() => handleSave(design)}
                  disabled={isSaved}
                  className={`absolute top-3 right-3 p-2 rounded-full ${isSaved ? 'bg-pink-500 text-white' : 'bg-white text-gray-700'} shadow-lg hover:scale-110 transition`}
                >
                  <Heart className={isSaved ? 'fill-current' : ''} size={20} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{design.title}</h3>
                <p className="text-gray-600 text-sm">{design.category}</p>
                {design.price && <p className="text-green-600 font-semibold mt-1">₹{design.price}</p>}
                
                <button
                  onClick={() => handleSave(design)}
                  disabled={isSaved}
                  className={`w-full mt-3 py-2 rounded-lg font-medium ${isSaved ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                >
                  {isSaved ? 'Saved to Wishlist' : 'Save for Later'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}