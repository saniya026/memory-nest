import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const STATUSES = ['pending', 'paid', 'processing', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/orders').then((r) => setOrders(r.data.orders));
  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    toast.success('Status updated');
    load();
  };

  const uploadDesign = async (id, file) => {
    const fd = new FormData();
    fd.append('design', file);
    await api.post(`/orders/${id}/design`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Design uploaded');
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">Manage Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl bg-white p-5 shadow-card dark:bg-gray-800">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-semibold">{order.user?.name} — {order.user?.email}</p>
                <p className="text-sm text-gray-500">
                  {order.occasion} · ₹{order.amount}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="input-field !w-auto !py-2"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-rose">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadDesign(order._id, e.target.files[0])}
              />
              Upload completed design
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
