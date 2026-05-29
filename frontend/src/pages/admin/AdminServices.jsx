import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const empty = { title: '', description: '', price: 799, image: '', features: '', isActive: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/services').then((r) => setServices(r.data.services));

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
      if (editing) {
        await api.put(`/services/${editing}`, payload);
        toast.success('Updated');
      } else {
        await api.post('/services', payload);
        toast.success('Created');
      }
      setForm(empty);
      setEditing(null);
      load();
    } catch {
      toast.error('Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete service?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">Manage Services</h1>
      <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800 md:grid-cols-2">
        <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input-field" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input className="input-field md:col-span-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <textarea className="input-field md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className="input-field md:col-span-2" placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <button type="submit" className="btn-primary md:col-span-2">{editing ? 'Update' : 'Add'} Service</button>
      </form>
      <div className="mt-8 space-y-3">
        {services.map((s) => (
          <div key={s._id} className="flex items-center justify-between rounded-xl bg-white p-4 dark:bg-gray-800">
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-rose">₹{s.price}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary !py-1 !px-3 text-sm" onClick={() => { setEditing(s._id); setForm({ ...s, features: s.features?.join(', ') }); }}>Edit</button>
              <button type="button" className="text-sm text-red-500" onClick={() => remove(s._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
