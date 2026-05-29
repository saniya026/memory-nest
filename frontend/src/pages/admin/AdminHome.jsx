import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminHome() {
  const [stats, setStats] = useState({ users: 0, orders: 0, pending: 0 });

  useEffect(() => {
    Promise.all([api.get('/admin/users'), api.get('/orders')]).then(([u, o]) => {
      setStats({
        users: u.data.users?.length || 0,
        orders: o.data.orders?.length || 0,
        pending: o.data.orders?.filter((x) => x.status === 'paid').length || 0,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">Admin Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Users', value: stats.users },
          { label: 'Orders', value: stats.orders },
          { label: 'Awaiting Design', value: stats.pending },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-rose">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
