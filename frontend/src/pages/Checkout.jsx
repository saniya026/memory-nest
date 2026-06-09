import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart = [], clearCart } = useCart(); // ✅ cart = [] default daal diya
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.amount, 0); // ✅ 0); fix

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
    if (cart.length === 0) return toast.error('Cart is empty');

    setLoading(true);
    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      setLoading(false);
      return;
    }

    try {
      const item = cart[0];

      const { data } = await api.post('/orders/create-razorpay-order', {
        amount: total,
        serviceId: item.serviceId,
        occasion: item.occasion,
        theme: item.theme,
        message: item.message,
        specialInstructions: item.specialInstructions,
        customOccasionName: item.customOccasionName,
        customColorPreset: item.customColorPreset,
        customColorPrimary: item.customColorPrimary,
        customColorSecondary: item.customColorSecondary,
        photos: item.photos?.map(p => p.url || p) || [],
        captions: item.captions || [],
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
          name: 'Customer',
        },
        theme: { color: '#f43f5e' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      paymentObject.open();
    } catch (err) {
      toast.error('Payment failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
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
      {cart.map((item, i) => (
        <div key={i} className="border-b py-4 flex justify-between">
          <div>
            <p className="font-semibold">{item.service?.title || 'Custom Design'}</p>
            <p className="text-sm text-gray-600">{item.occasion}</p>
          </div>
          <p className="font-bold">₹{item.amount}</p>
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