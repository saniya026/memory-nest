import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const loadRazorpay = () =>
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const { items, clearCart, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrdersAndPay = async () => {
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

        const { data: orderRes } = await api.post('/orders', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const order = orderRes.order;

        const { data: payData } = await api.post('/payments/create-order', {
          orderId: order._id,
        });

        if (payData.demo) {
          await api.post('/payments/verify', {
            orderId: order._id,
            demo: true,
          });
          toast.success('Order placed (demo payment)!');
          continue;
        }

        const loaded = await loadRazorpay();
        if (!loaded) throw new Error('Razorpay failed to load');

        await new Promise((resolve, reject) => {
          const options = {
            key: payData.key,
            amount: payData.amount * 100,
            currency: payData.currency,
            name: 'MemoryNest',
            description: item.service.title,
            order_id: payData.razorpayOrderId,
            handler: async (response) => {
              try {
                await api.post('/payments/verify', {
                  orderId: order._id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                resolve();
              } catch (e) {
                reject(e);
              }
            },
            prefill: { name: 'Customer' },
            theme: { color: '#F4A6B8' },
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', () => reject(new Error('Payment failed')));
          rzp.open();
        });
      }

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
          <div key={item.id} className="flex justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-700">
            <span>{item.service?.title}</span>
            <span className="font-semibold">₹{item.service?.price}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-rose">₹{total}</span>
        </div>
        <div style={{textAlign: 'center', margin: '20px 0', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '10px', backgroundColor: '#f9f9f9'}}>
  <h3>Scan & Pay via UPI</h3>
  <img 
    src="/paytm-qr.png" 
    width="220" 
    alt="Paytm QR Code"
    style={{margin: '15px 0', borderRadius: '8px'}} 
  />
  <p style={{fontWeight: 'bold', fontSize: '16px'}}>UPI ID:7991400787@ptsbi </p>
  <p style={{fontSize: '14px', color: '#666'}}>Payment ke baad screenshot WhatsApp kar dena</p>
</div>
        <button
          type="button"
          disabled={loading}
          onClick={placeOrdersAndPay}
          className="btn-primary mt-8 w-full"
        >
          {loading ? 'Processing...' : 'Pay with Razorpay'}
        </button>
        <p className="mt-3 text-center text-xs text-gray-500">
          Demo mode works without Razorpay keys. Configure keys in backend .env for live payments.
        </p>
      </div>
    </div>
  );
}
