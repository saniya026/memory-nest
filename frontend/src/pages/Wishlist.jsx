import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    } catch (error) {
      toast.error('Please login to see wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const handleOrder = (item) => {
    // Order page pe le jao with design data
    navigate('/checkout', { state: { design: item, fromWishlist: true } });
  };

  if (loading) return <div className="p-6 text-center">Loading wishlist...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">Saved Designs</h1>
      <p className="text-gray-600 mb-6">Your favorite designs - Order anytime</p>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No saved designs yet</p>
          <button 
            onClick={() => navigate('/gallery')}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg"
          >
            Explore Designs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item._id} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
              <img 
                src={item.designImage} 
                alt={item.designName}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">{item.designName}</h3>
                <p className="text-gray-600 text-sm">{item.category}</p>
                {item.price > 0 && <p className="text-green-600 font-semibold mt-1">₹{item.price}</p>}
                
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => handleRemove(item._id)} 
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-red-100"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                  <button 
                    onClick={() => handleOrder(item)} 
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}