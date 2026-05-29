import { useEffect, useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function MyMemories() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [image, setImage] = useState(null);

  const load = () => {
    api
      .get('/memories/my')
      .then((r) => setMemories(r.data.memories || []))
      .catch(() => toast.error('Could not load memories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please choose a photo');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      if (form.date) fd.append('date', form.date);
      fd.append('image', image);
      await api.post('/memories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Memory saved!');
      setForm({ title: '', description: '', date: '' });
      setImage(null);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save memory');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    try {
      await api.delete(`/memories/${id}`);
      setMemories((prev) => prev.filter((m) => m._id !== id));
      toast.success('Memory removed');
    } catch {
      toast.error('Could not delete');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold dark:text-white">My Memory Journal</h1>
          <p className="mt-1 text-sm text-gray-500">Save photos and moments in your private nest</p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary !py-2 !px-4 text-sm">
          <Plus className="h-4 w-4" /> {showForm ? 'Cancel' : 'Add Memory'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mt-6 rounded-2xl bg-white p-6 shadow-card dark:bg-gray-800">
          <input
            className="input-field"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="input-field mt-3"
            placeholder="Description (optional)"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="date"
            className="input-field mt-3"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            className="mt-3 w-full text-sm"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
          />
          <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full">
            {submitting ? 'Saving...' : 'Save to Journal'}
          </button>
        </form>
      )}

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}
      {!loading && memories.length === 0 && (
        <div className="mt-12 text-center text-gray-500">
          <Heart className="mx-auto h-12 w-12 text-rose/40" />
          <p className="mt-3">No memories yet. Add your first photo above!</p>
        </div>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((m) => (
          <article key={m._id} className="group overflow-hidden rounded-2xl bg-white shadow-card dark:bg-gray-800">
            <div className="card-polaroid mx-3 mt-3 !rotate-0 !p-0 overflow-hidden">
              <img src={m.imageUrl} alt={m.title} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold dark:text-white">{m.title}</h3>
                  {m.date && (
                    <p className="text-xs text-gray-500">
                      {new Date(m.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(m._id)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  aria-label="Delete memory"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {m.description && (
                <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{m.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
