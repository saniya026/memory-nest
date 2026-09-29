import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const STATUSES = [
  'paid',
  'processing',
  'completed',
  'cancelled',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ONLY PAID ORDERS
  // ==========================================

  const load = async () => {
    try {
      setLoading(true);

      console.log('Fetching admin orders...');

      const response = await api.get('/orders');

      console.log(
        'Admin Orders Response:',
        response.data
      );

      const allOrders = response.data?.orders || [];

      // ONLY PAID ORDERS
      const paidOrders = allOrders.filter(
        (order) => order.paymentStatus === 'paid'
      );

      setOrders(paidOrders);

    } catch (error) {
      console.error(
        '========== ADMIN ORDERS ERROR =========='
      );

      console.error(
        error.response?.data ||
        error.message ||
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to load orders'
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/orders/${id}/status`,
        { status }
      );

      toast.success('Status updated');

      load();

    } catch (error) {
      console.error(
        'Status update error:',
        error.response?.data ||
        error.message ||
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to update status'
      );
    }
  };

  // ==========================================
  // UPLOAD COMPLETED DESIGN
  // ==========================================

  const uploadDesign = async (id, file) => {
    try {
      const fd = new FormData();

      fd.append('design', file);

      await api.post(
        `/orders/${id}/design`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(
        'Design uploaded successfully'
      );

      load();

    } catch (error) {
      console.error(
        'Design upload error:',
        error.response?.data ||
        error.message ||
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to upload design'
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold dark:text-white">
          Manage Orders
        </h1>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
          <p className="text-gray-500">
            Loading paid orders...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="font-display text-2xl font-bold dark:text-white">
            Manage Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {orders.length} paid order
            {orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="btn-secondary !py-2 !px-4 text-sm"
        >
          Refresh
        </button>

      </div>

      {/* NO PAID ORDERS */}

      {orders.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
          <p className="text-gray-500">
            No paid orders found.
          </p>
        </div>
      )}

      {/* ORDERS */}

      <div className="mt-6 space-y-4">

        {orders.map((order) => {

          const items = Array.isArray(order.items)
            ? order.items
            : [];

          return (
            <div
              key={order._id}
              className="rounded-2xl bg-white p-5 shadow-card dark:bg-gray-800"
            >

              {/* ======================================
                  USER
              ====================================== */}

              <div className="flex flex-wrap justify-between gap-4">

                <div>

                  <p className="font-semibold dark:text-white">
                    {order.user?.name ||
                      'Unknown Customer'}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.user?.email ||
                      'No email'}
                  </p>

                  <p className="mt-1 font-mono text-xs text-gray-400">
                    Order ID: {order._id}
                  </p>

                </div>

                {/* STATUS */}

                <select
                  value={order.status || 'paid'}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  className="input-field !w-auto !py-2"
                >
                  {STATUSES.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

              </div>

              {/* ======================================
                  PAYMENT
              ====================================== */}

              <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">

                <div className="flex flex-wrap justify-between gap-3">

                  {/* PAYMENT STATUS */}

                  <div>

                    <p className="text-xs text-gray-400">
                      Payment Status
                    </p>

                    <p className="font-semibold text-green-600">
                      PAID
                    </p>

                  </div>

                  {/* TOTAL */}

                  <div>

                    <p className="text-xs text-gray-400">
                      Total Amount
                    </p>

                    <p className="font-bold text-rose">
                      ₹{order.totalAmount || 0}
                    </p>

                  </div>

                  {/* DATE */}

                  <div>

                    <p className="text-xs text-gray-400">
                      Date
                    </p>

                    <p className="text-sm">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            undefined,
                            {
                              dateStyle: 'medium',
                            }
                          )
                        : '-'}
                    </p>

                  </div>

                </div>

                {/* RAZORPAY PAYMENT ID */}

                {order.razorpayPaymentId && (
                  <p className="mt-3 break-all text-xs text-gray-400">
                    Payment ID:{' '}
                    {order.razorpayPaymentId}
                  </p>
                )}

              </div>

              {/* ======================================
                  ORDER ITEMS
              ====================================== */}

              <div className="mt-4">

                <p className="mb-2 font-semibold">
                  Order Items
                </p>

                <div className="space-y-2">

                  {items.length === 0 ? (

                    <p className="text-sm text-gray-500">
                      No items found
                    </p>

                  ) : (

                    items.map((item, index) => (

                      <div
                        key={item._id || index}
                        className="rounded-xl border border-gray-100 p-3 dark:border-gray-700"
                      >

                        <div className="flex flex-wrap justify-between gap-2">

                          <div>

                            <p className="font-medium">
                              {item.service?.title ||
                                'Custom Memory'}
                            </p>

                            <p className="text-sm text-gray-500">
                              {item.customOccasionName ||
                                item.occasion ||
                                'Custom'}
                              {' · '}
                              {item.theme ||
                                'Default'}
                            </p>

                            {item.message && (
                              <p className="mt-1 text-xs text-gray-400">
                                {item.message}
                              </p>
                            )}

                          </div>

                          <p className="font-bold">
                            ₹{item.amount || 0}
                          </p>

                        </div>

                        {/* PHOTOS */}

                        {item.photos?.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">

                            {item.photos
                              .slice(0, 5)
                              .map(
                                (
                                  photo,
                                  photoIndex
                                ) => (
                                  <img
                                    key={photoIndex}
                                    src={photo.url}
                                    alt=""
                                    className="h-16 w-16 rounded-lg object-cover"
                                  />
                                )
                              )}

                          </div>
                        )}

                      </div>

                    ))
                  )}

                </div>

              </div>

              {/* ======================================
                  UPLOAD COMPLETED DESIGN
              ====================================== */}

              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600">

                Upload completed design

                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0];

                    if (file) {
                      uploadDesign(
                        order._id,
                        file
                      );
                    }

                    e.target.value = '';

                  }}
                />

              </label>

            </div>
          );
        })}

      </div>

    </div>
  );
}