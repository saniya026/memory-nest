import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // ✅ Ye add kar
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ useLocation add kar

export default function Checkout() {
  const { items, clearCart, total } = useCart();
  const { user } = useAuth(); // ✅ User check karne ke liye
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Current path save karne ke liye

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
    // ✅ Sabse pehle login check
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: location } }); // ✅ Checkout ka path save karke bhejo
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
      const item = items[0];
      const orderData = item.orderDraft || {
        serviceId: item.service._id,
        amount: item.service.price,
        occasion: 'Custom',
        theme: 'Default',
        message: '',
      };

      const { data } = await api.post('/orders/create-razorpay-order', {
        amount: orderData.amount,
        serviceId: orderData.serviceId,
        occasion: orderData.occasion,
        theme: orderData.theme,
        message: orderData.message,
        specialInstructions: orderData.specialInstructions,
        customOccasionName: orderData.customOccasionName,
        customColorPreset: orderData.customColorPreset,
        customColorPrimary: orderData.customColorPrimary,
        customColorSecondary: orderData.customColorSecondary,
        photos: orderData.photos || [],
        captions: orderData.captions || [],
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: 'INR',
        name: 'Memory Nest',
        description: item.service?.title || 'Custom Memory Design',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          await api.post('/orders/verify-payment', {
         ...response,
            orderId: data.orderId
          });
          toast.success('Payment successful! 🎉');
          clearCart();
          navigate('/orders');
        },
        prefill: {
          name: user?.name || 'Customer', // ✅ User ka naam use kar
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
      toast.error(err.response?.data?.message || 'Payment failed');
      console.error(err);
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
      {items.map((item, i) => (
        <div key={i} className="border-b py-4 flex justify-between">
          <div>
            <p className="font-semibold">{item.service?.title || 'Custom Design'}</p>
            <p className="text-sm text-gray-600">{item.orderDraft?.occasion || 'Custom'}</p>
          </div>
          <p className="font-bold">₹{item.service?.price || item.orderDraft?.amount}</p>
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
        {loading? 'Processing...' : `Pay ₹${total} with Razorpay`}
      </button>
    </div>
  );
}