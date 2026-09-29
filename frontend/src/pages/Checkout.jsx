import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, Plus, MapPin } from 'lucide-react';
import AddressModal from '../components/checkout/AddressModal';

export default function Checkout() {
  const { items, clearCart, total, removeFromCart } = useCart();
  const { user } = useAuth();
  const { addresses, selectedAddress, selectAddress } = useAddress();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load Razorpay Checkout SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      // Already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');

      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

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

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select delivery address');
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------------
      // 1. LOAD RAZORPAY
      // --------------------------------------------------

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // 2. CREATE RAZORPAY ORDER ON BACKEND
      // --------------------------------------------------

      const { data } = await api.post(
        '/orders/create-razorpay-order',
        {
          amount: total,

          items: items.map((item) => ({
            cartItemId: item.id,

            service: item.service?._id || null,

            amount:
              item.service?.price ||
              item.orderDraft?.amount ||
              50,

            occasion:
              item.orderDraft?.occasion ||
              'Custom',

            theme:
              item.orderDraft?.theme ||
              'Default',

            message:
              item.orderDraft?.message ||
              '',

            specialInstructions:
              item.orderDraft?.specialInstructions ||
              '',

            customOccasionName:
              item.orderDraft?.customOccasionName ||
              '',

            customColorPreset:
              item.orderDraft?.customColorPreset ||
              '',

            customColorPrimary:
              item.orderDraft?.customColorPrimary ||
              '',

            customColorSecondary:
              item.orderDraft?.customColorSecondary ||
              '',

            photos:
              item.orderDraft?.photos ||
              [],
          })),

          deliveryAddress: selectedAddress,
        }
      );

      // Check backend response
      if (!data || !data.success) {
        throw new Error(
          data?.message ||
          'Unable to create payment order'
        );
      }

      console.log(
        'Razorpay Order ID:',
        data.razorpayOrderId
      );

      console.log(
        'MongoDB Order ID:',
        data.orderId
      );

      // --------------------------------------------------
      // 3. OPEN RAZORPAY CHECKOUT
      // --------------------------------------------------

      const options = {
        key: data.key,

        amount: data.amount,

        currency: 'INR',

        name: 'Memory Nest',

        description:
          `${items.length} Design${items.length > 1 ? 's' : ''}`,

        order_id: data.razorpayOrderId,

        prefill: {
          name: selectedAddress.name || '',
          email: user?.email || '',
          contact: selectedAddress.phone || '',
        },

        theme: {
          color: '#f43f5e',
        },

        // ------------------------------------------------
        // 4. PAYMENT SUCCESS
        // ------------------------------------------------

        handler: async function (response) {
          console.log(
            '========== RAZORPAY PAYMENT SUCCESS =========='
          );

          console.log(
            'Razorpay Order ID:',
            response.razorpay_order_id
          );

          console.log(
            'Razorpay Payment ID:',
            response.razorpay_payment_id
          );

          console.log(
            'Razorpay Signature:',
            response.razorpay_signature
          );

          console.log(
            'MongoDB Order ID:',
            data.orderId
          );

          try {
            // --------------------------------------------
            // 5. VERIFY PAYMENT ON BACKEND
            // --------------------------------------------

            const verifyResponse = await api.post(
              '/orders/verify-payment',
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                // VERY IMPORTANT
                // This is your MongoDB Order _id
                orderId: data.orderId,
              }
            );

            console.log(
              'Verification response:',
              verifyResponse.data
            );

            // --------------------------------------------
            // 6. CHECK VERIFICATION RESULT
            // --------------------------------------------

            if (
              verifyResponse.data &&
              verifyResponse.data.success
            ) {
              toast.success(
                'Payment successful! 🎉'
              );

              // Clear cart only after
              // successful verification
              clearCart();

              // Go to My Orders
              navigate('/orders');
            } else {
              toast.error(
                verifyResponse.data?.message ||
                'Payment verification failed'
              );
            }

          } catch (error) {
            console.error(
              '========== PAYMENT VERIFICATION ERROR =========='
            );

            console.error(
              error.response?.data ||
              error.message ||
              error
            );

            toast.error(
              error.response?.data?.message ||
              'Payment verification failed'
            );
          }
        },
      };

      // --------------------------------------------------
      // 7. CREATE RAZORPAY INSTANCE
      // --------------------------------------------------

      const paymentObject =
        new window.Razorpay(options);

      // --------------------------------------------------
      // 8. PAYMENT FAILED
      // --------------------------------------------------

      paymentObject.on(
        'payment.failed',
        function (response) {
          console.error(
            'Razorpay Payment Failed:',
            response
          );

          toast.error(
            response.error?.description ||
            'Payment failed'
          );
        }
      );

      // --------------------------------------------------
      // 9. OPEN CHECKOUT
      // --------------------------------------------------

      paymentObject.open();

    } catch (error) {
      console.error(
        '========== PAYMENT ERROR =========='
      );

      console.error(
        error.response?.data ||
        error.message ||
        error
      );

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Payment failed'
      );

    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------
  // EMPTY CART
  // ------------------------------------------------------

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Cart is Empty
        </h1>

        <button
          onClick={() => navigate('/designs')}
          className="bg-rose-500 text-white px-6 py-2 rounded-xl"
        >
          Browse Designs
        </button>
      </div>
    );
  }

  // ------------------------------------------------------
  // CHECKOUT PAGE
  // ------------------------------------------------------

  return (
    <div className="mx-auto max-w-2xl p-6">

      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {/* ================= ADDRESS ================= */}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">

        <div className="mb-4 flex items-center justify-between">

          <h2 className="font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Address
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-sm font-semibold text-rose"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>

        </div>

        {addresses.length === 0 ? (

          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">

            <p className="text-sm text-gray-500 mb-2">
              No address added yet
            </p>

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
                  checked={
                    selectedAddress?.id === addr.id
                  }
                  onChange={() =>
                    selectAddress(addr.id)
                  }
                  className="mt-1"
                />

                <div className="flex-1">

                  <div className="flex items-center gap-2">

                    <p className="font-semibold">
                      {addr.name}
                    </p>

                    {addr.isDefault && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        Default
                      </span>
                    )}

                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {addr.address}, {addr.city},{' '}
                    {addr.state} - {addr.pincode}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phone: {addr.phone}
                  </p>

                </div>

              </label>

            ))}

          </div>

        )}

      </div>

      {/* ================= ORDER ITEMS ================= */}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">

        <h2 className="mb-3 font-semibold">
          Order Items
        </h2>

        {items.map((item) => (

          <div
            key={item.id}
            className="border-b py-4 flex justify-between items-center last:border-0"
          >

            <div>

              <p className="font-semibold">
                {item.service?.title ||
                  item.orderDraft?.title ||
                  'Custom Design'}
              </p>

              <p className="text-sm text-gray-600">
                {item.orderDraft?.occasion ||
                  item.service?.category ||
                  'Custom'}
              </p>

            </div>

            <div className="flex items-center gap-4">

              <p className="font-bold">
                ₹
                {item.service?.price ||
                  item.orderDraft?.amount ||
                  50}
              </p>

              <button
                onClick={() =>
                  removeFromCart(item.id)
                }
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={20} />
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ================= TOTAL ================= */}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">

        <div className="flex justify-between text-xl font-bold">

          <span>
            Total Amount:
          </span>

          <span>
            ₹{total}
          </span>

        </div>

      </div>

      {/* ================= PAYMENT BUTTON ================= */}

      <button
        onClick={handlePayment}
        disabled={
          loading ||
          !selectedAddress
        }
        className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >

        {loading
          ? 'Processing...'
          : !selectedAddress
          ? 'Select Address to Continue'
          : `Pay ₹${total} with Razorpay`}

      </button>

      {/* ================= ADDRESS MODAL ================= */}

      <AddressModal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
      />

    </div>
  );
}