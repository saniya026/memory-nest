import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SERVICE_CATEGORIES = ['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Love', 'Custom'];

export default function Services() {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/designs?type=service')
      .then(res => setServices(res.data))
      .catch(() => toast.error('Failed to load services'));
  }, []);

  const handleBuyNow = (service) => {
    addToCart({ service, orderDraft: {} });
    navigate('/checkout');
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.filter(s => SERVICE_CATEGORIES.includes(s.category)).map(service => (
          <div key={service._id} className="border rounded-xl p-4 shadow hover:shadow-lg">
            <img src={service.thumbnail} alt={service.title} className="w-full h-48 object-cover rounded-lg mb-3"/>
            <h3 className="font-bold text-lg">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{service.category}</p>
            <p className="text-2xl font-bold text-rose-500 mb-4">₹{service.price}</p>
            
            {/* ✅ Payment button yaha dikhega */}
            <button
              onClick={() => handleBuyNow(service)}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-semibold"
            >
              Book Now - ₹{service.price}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}