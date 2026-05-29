import { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function LeaveReviewForm({ order, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please write your review');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('orderId', order._id);
      fd.append('rating', String(rating));
      fd.append('content', content.trim());
      if (photo) fd.append('photo', photo);
      await api.post('/reviews', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Review submitted! It will show after admin approval.');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setLoading(false);
    }
  };

  const orderLabel = order.service?.title || order.occasion || 'Your order';

  return (
    <form onSubmit={submit} className="mt-4 rounded-xl border border-lavender/40 bg-blush/20 p-4 dark:border-gray-600 dark:bg-gray-700/30">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        Share your experience — {orderLabel}
      </p>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className="p-1 text-amber-400 transition hover:scale-110"
            aria-label={`${n} stars`}
          >
            <Star className={`h-7 w-7 ${n <= rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
          </button>
        ))}
      </div>
      <textarea
        className="input-field mt-3"
        rows={3}
        placeholder="What did you love about your memory page?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        className="mt-2 w-full text-sm"
        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
      />
      <p className="mt-1 text-xs text-gray-500">Optional: add a photo of your finished design</p>
      <button type="submit" disabled={loading} className="btn-primary mt-3 w-full !py-2 text-sm">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
