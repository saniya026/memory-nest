import { useEffect, useState } from 'react';
import { Download, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../api/axios';
import OrderStatusTimeline from '../../components/OrderStatusTimeline';
import LeaveReviewForm from '../../components/reviews/LeaveReviewForm';

const statusColors = {
  pending: 'bg-gray-200 text-gray-700',
  created: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const formatOrderId = (id) => {
  if (!id) return '#ORDER';
  return `#${String(id).slice(-8).toUpperCase()}`;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [eligibleIds, setEligibleIds] = useState(new Set());
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      console.log('Fetching My Orders...');

      const ordersRes = await api.get('/orders/my');

      console.log(
        'My Orders API Response:',
        ordersRes.data
      );

      const fetchedOrders =
        ordersRes.data?.orders || [];

      setOrders(fetchedOrders);

      // Reviews are optional.
      // If review API fails, orders should still show.
      try {
        const eligibleRes =
          await api.get('/reviews/eligible');

        const eligibleOrders =
          eligibleRes.data?.orders || [];

        setEligibleIds(
          new Set(
            eligibleOrders.map((order) => order._id)
          )
        );
      } catch (reviewError) {
        console.log(
          'Review eligibility could not be loaded:',
          reviewError.response?.data ||
            reviewError.message
        );

        setEligibleIds(new Set());
      }

    } catch (error) {
      console.error(
        '========== MY ORDERS ERROR =========='
      );

      console.error(
        error.response?.data ||
        error.message ||
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Unable to load your orders'
      );

      setOrders([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (location.state?.success) {
      toast.success('Order confirmed!');

      // Remove state from URL/history after showing toast
      window.history.replaceState({}, document.title);
    }

    fetchData();
  }, [location.state]);

  // =====================================================
  // REVIEW
  // =====================================================

  const canReview = (order) => {
    return (
      order.status === 'completed' &&
      eligibleIds.has(order._id)
    );
  };

  const onReviewSubmitted = (orderId) => {
    setReviewingOrderId(null);

    setEligibleIds((prev) => {
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold dark:text-white">
          My Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track your memory pages and reorder anytime
        </p>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
          <p className="text-gray-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">
        My Orders
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Track your memory pages and reorder anytime
      </p>

      {/* =================================================
          NO ORDERS
      ================================================= */}

      {orders.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
          <p className="text-gray-500">
            No orders yet. Start creating memories!
          </p>

          <button
            type="button"
            onClick={() => fetchData()}
            className="mt-4 btn-secondary !py-2 !px-4 text-sm"
          >
            Refresh Orders
          </button>
        </div>
      )}

      {/* =================================================
          ORDERS
      ================================================= */}

      <div className="mt-6 space-y-4">

        {orders.map((order) => {

          /*
           * Backend structure:
           *
           * Order
           * ├── _id
           * ├── totalAmount
           * ├── status
           * ├── paymentStatus
           * ├── createdAt
           * └── items[]
           *
           * So we use order.items instead of
           * order.service / order.amount.
           */

          const items = Array.isArray(order.items)
            ? order.items
            : [];

          const firstItem = items[0] || {};

          const service = firstItem.service;

          const itemTitle =
            service?.title ||
            'Custom Memory';

          const occasion =
            firstItem.customOccasionName ||
            firstItem.occasion ||
            'Custom';

          const theme =
            firstItem.theme ||
            'Default';

          const message =
            firstItem.message ||
            'No message';

          const totalAmount =
            order.totalAmount ??
            items.reduce(
              (sum, item) =>
                sum + Number(item.amount || 0),
              0
            );

          const allPhotos = items.flatMap(
            (item) =>
              Array.isArray(item.photos)
                ? item.photos
                : []
          );

          return (
            <div
              key={order._id}
              className="rounded-2xl bg-white p-5 shadow-card dark:bg-gray-800"
            >

              {/* =========================================
                  HEADER
              ========================================= */}

              <div className="flex flex-wrap items-start justify-between gap-2">

                <div>

                  <p className="font-mono text-xs text-gray-400">
                    {formatOrderId(order._id)}
                  </p>

                  <h3 className="font-semibold">
                    {itemTitle}

                    {items.length > 1 && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        + {items.length - 1} more
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {occasion} · {theme}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          undefined,
                          {
                            dateStyle: 'medium',
                          }
                        )
                      : ''}
                  </p>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    statusColors[order.status] ||
                    'bg-gray-200 text-gray-700'
                  }`}
                >
                  {order.status || 'created'}
                </span>

              </div>

              {/* =========================================
                  PAYMENT STATUS
              ========================================= */}

              <div className="mt-2">

                <span
                  className={`text-xs font-medium ${
                    order.paymentStatus === 'paid'
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  Payment:{' '}
                  {order.paymentStatus || 'created'}
                </span>

              </div>

              {/* =========================================
                  MESSAGE
              ========================================= */}

              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>

              {/* =========================================
                  STATUS TIMELINE
              ========================================= */}

              <OrderStatusTimeline
                status={order.status}
              />

              {/* =========================================
                  AMOUNT + BUTTONS
              ========================================= */}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">

                <span className="font-bold text-rose">
                  ₹{totalAmount}
                </span>

                <div className="flex flex-wrap gap-2">

                  {/* REORDER */}

                  {service?._id && (
                    <Link
                      to={`/products/${service._id}`}
                      className="btn-secondary !py-2 !px-4 text-sm"
                    >
                      Reorder
                    </Link>
                  )}

                  {/* REVIEW */}

                  {canReview(order) &&
                    reviewingOrderId !==
                      order._id && (
                      <button
                        type="button"
                        onClick={() =>
                          setReviewingOrderId(
                            order._id
                          )
                        }
                        className="btn-secondary !py-2 !px-4 text-sm"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Write Review
                      </button>
                    )}

                  {/* COMPLETED DESIGN */}

                  {order.completedDesign?.url && (
                    <a
                      href={
                        order.completedDesign.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary !py-2 !px-4 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  )}

                </div>
              </div>

              {/* =========================================
                  REVIEW FORM
              ========================================= */}

              {reviewingOrderId ===
                order._id && (
                <LeaveReviewForm
                  order={order}
                  onSuccess={() =>
                    onReviewSubmitted(
                      order._id
                    )
                  }
                />
              )}

              {/* =========================================
                  PHOTOS
              ========================================= */}

              {allPhotos.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">

                  {allPhotos
                    .slice(0, 4)
                    .map((photo, index) => (
                      <img
                        key={index}
                        src={photo.url}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ))}

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}