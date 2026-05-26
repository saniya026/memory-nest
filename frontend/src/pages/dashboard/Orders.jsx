import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const statusColors = {
  pending: 'bg-gray-200 text-gray-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.success) toast.success('Order confirmed!');
    api.get('/orders/my').then((r) => setOrders(r.data.orders)).catch(() => {});
  }, [location.state]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">My Orders</h1>
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
                <h3 className="font-semibold">{order.service?.title || 'Custom Memory'}</h3>
                <p className="text-sm text-gray-500">
                  {order.occasion} · {order.theme}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {order.message || 'No message'}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-rose">₹{order.amount}</span>
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
