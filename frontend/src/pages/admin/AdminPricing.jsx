import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const empty = { name: '', price: 499, description: '', features: '', isPopular: false, isActive: true };

export default function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/admin/pricing').then((r) => setPlans(r.data.pricing));

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editing) await api.put(`/admin/pricing/${editing}`, payload);
      else await api.post('/admin/pricing', payload);
      toast.success('Saved');
      setForm(empty);
      setEditing(null);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">Manage Pricing</h1>
      <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
        <input className="input-field" placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input-field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input-field" placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} />
          Popular plan
        </label>
        <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'} Plan</button>
      </form>
      <div className="mt-6 space-y-2">
        {plans.map((p) => (
          <div key={p._id} className="flex justify-between rounded-xl bg-white p-4 dark:bg-gray-800">
            <span>{p.name} — ₹{p.price}</span>
            <button type="button" className="text-rose text-sm" onClick={() => { setEditing(p._id); setForm({ ...p, features: p.features?.join(', ') }); }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
