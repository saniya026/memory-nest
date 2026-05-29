import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const statusBadge = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  hidden: 'bg-gray-200 text-gray-600',
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const load = () => {
    api.get('/reviews/admin/all').then((r) => setReviews(r.data.reviews || [])).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/reviews/admin/${id}`, { status });
      toast.success(`Review ${status}`);
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">Customer Reviews</h1>
      <p className="mt-1 text-sm text-gray-500">Approve reviews for the homepage and product pages</p>
      <div className="mt-6 space-y-4">
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="rounded-2xl bg-white p-5 shadow-card dark:bg-gray-800">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{r.customerName}</p>
                <p className="text-sm text-gray-500">
                  {r.user?.email} · {r.service?.title || r.occasion}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusBadge[r.status]}`}>
                {r.status}
              </span>
            </div>
            <div className="mt-2 flex gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= r.rating ? 'fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{r.content}</p>
            {r.photo?.url && (
              <img src={r.photo.url} alt="" className="mt-3 h-24 rounded-lg object-cover" />
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {r.status !== 'approved' && (
                <button type="button" onClick={() => setStatus(r._id, 'approved')} className="btn-primary !py-2 !px-4 text-sm">
                  Approve
                </button>
              )}
              {r.status !== 'hidden' && (
                <button type="button" onClick={() => setStatus(r._id, 'hidden')} className="btn-secondary !py-2 !px-4 text-sm">
                  Hide
                </button>
              )}
              {r.status !== 'pending' && (
                <button
                  type="button"
                  onClick={() => setStatus(r._id, 'pending')}
                  className="text-sm text-gray-500 hover:text-rose"
                >
                  Mark pending
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
