import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then((r) => setUsers(r.data.users));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">Users</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-card dark:bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b dark:border-gray-700">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
