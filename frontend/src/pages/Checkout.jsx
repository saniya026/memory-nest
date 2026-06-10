import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Checkout() {
  const { items, clearCart, total, removeFromCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (items.length === 0) return toast.error('Cart is empty');

    setLoading(true);
    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/orders/create-razorpay-order', {
        amount: total,
        items: items.map(item => ({
          cartItemId: item.id,
          service: item.service?._id || null,
          amount: item.service?.price || item.orderDraft?.amount || 50,
          occasion: item.orderDraft?.occasion || 'Custom',
          theme: item.orderDraft?.theme || 'Default',
          message: item.orderDraft?.message || '',
          specialInstructions: item.orderDraft?.specialInstructions,
          customOccasionName: item.orderDraft?.customOccasionName,
          customColorPreset: item.orderDraft?.customColorPreset,
          customColorPrimary: item.orderDraft?.customColorPrimary,
          customColorSecondary: item.orderDraft?.customColorSecondary,
          photos: item.orderDraft?.photos || [],
        }))
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: 'INR',
        name: 'Memory Nest',
        description: `${items.length} Design${items.length > 1 ? 's' : ''}`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post('/orders/verify-payment', {
              ...response,
              orderId: data.orderId
            });
            toast.success('Payment successful! 🎉');
            clearCart();
            navigate('/orders');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || '',
        },
        theme: { color: '#f43f5e' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      paymentObject.open();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Payment failed';
      toast.error(errorMsg);
      console.error('Payment Error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
        <button
          onClick={() => navigate('/designs')}
          className="bg-rose-500 text-white px-6 py-2 rounded-xl"
        >
          Browse Designs
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {items.map((item) => (
        <div key={item.id} className="border-b py-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">
              {item.service?.title || item.orderDraft?.title || 'Custom Design'}
            </p>
            <p className="text-sm text-gray-600">
              {item.orderDraft?.occasion || item.service?.category || 'Custom'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="font-bold">
              ₹{item.service?.price || item.orderDraft?.amount || 50}
            </p>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
      <div className="mt-6 flex justify-between text-xl font-bold">
        <span>Total:</span>
        <span>₹{total}</span>
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition"
      >
        {loading ? 'Processing...' : `Pay ₹${total} with Razorpay`}
      </button>
    </div>
  );
}