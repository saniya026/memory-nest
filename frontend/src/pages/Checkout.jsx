import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, clearCart, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    try {
      for (const item of items) {
        const draft = item.orderDraft || {};
        const fd = new FormData();
        fd.append('serviceId', item.service._id);
        fd.append('occasion', draft.occasion || 'Custom');
        fd.append('theme', draft.theme || 'Pastel Pink');
        fd.append('message', draft.message || '');
        fd.append('specialInstructions', draft.specialInstructions || '');
        fd.append('amount', item.service.price);
        fd.append('captions', JSON.stringify(draft.captions || []));
        (draft.photos || []).forEach((file) => fd.append('photos', file));

        await api.post('/orders', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Order placed! Scan the QR to complete payment.');
      clearCart();
      navigate('/dashboard/orders', { state: { success: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold dark:text-white">Checkout</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-700"
          >
            <span>{item.service?.title}</span>
            <span className="font-semibold">₹{item.service?.price}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-rose">₹{total}</span>
        </div>

        <div className="my-6 rounded-xl border border-lavender/40 bg-blush/20 p-5 text-center dark:border-gray-600 dark:bg-gray-700/50">
          <h3 className="font-semibold dark:text-white">Scan & Pay via UPI</h3>
          <img
            src="/paytm-qr.png"
            width={220}
            alt="Paytm QR Code"
            className="mx-auto my-4 rounded-lg"
          />
          <p className="font-bold">UPI ID: 7991400787@ptsbi</p>
          <p className="mt-1 text-sm text-gray-500">
            After payment, send a screenshot on WhatsApp to confirm.
          </p>
        </div>

        <button type="button" disabled={loading} onClick={placeOrder} className="btn-primary w-full">
          {loading ? 'Processing...' : 'Place Order'}
        </button>
        <p className="mt-3 text-center text-xs text-gray-500">
          Place your order first, then pay via QR and share proof.
        </p>
      </div>
    </div>
  );
}
