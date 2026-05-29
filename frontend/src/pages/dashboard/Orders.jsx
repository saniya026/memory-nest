import { useEffect, useState } from 'react';
import { Download, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import OrderStatusTimeline from '../../components/OrderStatusTimeline';
import LeaveReviewForm from '../../components/reviews/LeaveReviewForm';

const statusColors = {
  pending: 'bg-gray-200 text-gray-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const formatOrderId = (id) => `#${String(id).slice(-8).toUpperCase()}`;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [eligibleIds, setEligibleIds] = useState(new Set());
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const location = useLocation();

  const fetchData = async () => {
    try {
      const [ordersRes, eligibleRes] = await Promise.all([
        api.get('/orders/my'),
        api.get('/reviews/eligible'),
      ]);
      setOrders(ordersRes.data.orders || []);
      setEligibleIds(new Set((eligibleRes.data.orders || []).map((o) => o._id)));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (location.state?.success) toast.success('Order confirmed!');
    fetchData();
  }, [location.state]);

  const canReview = (order) => order.status === 'completed' && eligibleIds.has(order._id);

  const onReviewSubmitted = (orderId) => {
    setReviewingOrderId(null);
    setEligibleIds((prev) => {
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">My Orders</h1>
      <p className="mt-1 text-sm text-gray-500">Track your memory pages and reorder anytime</p>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <p className="text-gray-500">No orders yet. Start creating memories!</p>
        )}
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl bg-white p-5 shadow-card dark:bg-gray-800"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-gray-400">{formatOrderId(order._id)}</p>
                <h3 className="font-semibold">{order.service?.title || 'Custom Memory'}</h3>
                <p className="text-sm text-gray-500">
                  {order.customOccasionName || order.occasion} · {order.theme}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    dateStyle: 'medium',
                  })}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {order.message || 'No message'}
            </p>
            <OrderStatusTimeline status={order.status} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-rose">₹{order.amount}</span>
              <div className="flex flex-wrap gap-2">
                {order.service?._id && (
                  <Link
                    to={`/products/${order.service._id}`}
                    className="btn-secondary !py-2 !px-4 text-sm"
                  >
                    Reorder
                  </Link>
                )}
                {canReview(order) && reviewingOrderId !== order._id && (
                  <button
                    type="button"
                    onClick={() => setReviewingOrderId(order._id)}
                    className="btn-secondary !py-2 !px-4 text-sm"
                  >
                    <MessageSquare className="h-4 w-4" /> Write Review
                  </button>
                )}
                {order.completedDesign?.url && (
                  <a
                    href={order.completedDesign.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary !py-2 !px-4 text-sm"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                )}
              </div>
            </div>
            {reviewingOrderId === order._id && (
              <LeaveReviewForm order={order} onSuccess={() => onReviewSubmitted(order._id)} />
            )}
            {order.photos?.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {order.photos.slice(0, 4).map((p, i) => (
                  <img key={i} src={p.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
