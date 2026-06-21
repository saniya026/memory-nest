import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext'; // ✅ New
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, Plus, MapPin } from 'lucide-react';
import AddressModal from '../components/checkout/AddressModal'; // ✅ New

export default function Checkout() {
  const { items, clearCart, total, removeFromCart } = useCart();
  const { user } = useAuth();
  const { addresses, selectedAddress, selectAddress } = useAddress(); // ✅ New
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ New
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
    
    // ✅ Address check
    if (!selectedAddress) {
      toast.error('Please select delivery address');
      return;
    }

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
        })),
        deliveryAddress: selectedAddress 
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: 'INR',
        name: 'Memory Nest',
        description: `${items.length} Design${items.length > 1? 's' : ''}`,
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
          name: selectedAddress.name, // ✅ Address ka name
          email: user?.email || '',
          contact: selectedAddress.phone // ✅ Address ka phone
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

      {/* ✅ ADDRESS SECTION - Flipkart jaisa */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Delivery Address
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-sm font-semibold text-rose"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>

        {addresses.length === 0? (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-2">No address added yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm font-semibold text-rose"
            >
              + Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
                  selectedAddress?.id === addr.id
                   ? 'border-rose bg-rose/5'
                    : 'border-gray-200 hover:border-rose/50 dark:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  checked={selectedAddress?.id === addr.id}
                  onChange={() => selectAddress(addr.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{addr.name}</p>
                    {addr.isDefault && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {addr.phone}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <h2 className="mb-3 font-semibold">Order Items</h2>
        {items.map((item) => (
          <div key={item.id} className="border-b py-4 flex justify-between items-center last:border-0">
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
      </div>

      {/* Total */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <div className="flex justify-between text-xl font-bold">
          <span>Total Amount:</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading || !selectedAddress}
        className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading? 'Processing...' : !selectedAddress? 'Select Address to Continue' : `Pay ₹${total} with Razorpay`}
      </button>

      {/* ✅ Address Modal */}
      <AddressModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}