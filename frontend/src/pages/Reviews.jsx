import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    const { data } = await api.get('/reviews');
    setReviews(data.reviews);
  };

  const fetchMyCompletedOrders = async () => {
    if (!user) return;
    const { data } = await api.get('/orders/my');
    const completed = data.orders.filter(o => o.status === 'completed');
    setMyOrders(completed);
  };

  useEffect(() => {
    fetchReviews();
    fetchMyCompletedOrders();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { orderId: selectedOrder, rating, comment });
      toast.success('Review added!');
      setShowForm(false);
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Reviews</h1>
        {user && myOrders.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-rose-500 text-white px-4 py-2 rounded-xl"
          >
            Write Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-xl bg-gray-50">
          <select
            value={selectedOrder}
            onChange={e => setSelectedOrder(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          >
            <option value="">Select Completed Order</option>
            {myOrders.map(o => (
              <option key={o._id} value={o._id}>
                Order #{o._id.slice(-6)} - ₹{o.totalAmount}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mb-4">
            {[1,2,3,4,5].map(star => (
              <Star
                key={star}
                className={`cursor-pointer ${star <= rating? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full p-3 border rounded mb-4"
            rows={4}
            required
            maxLength={500}
          />
          <button type="submit" className="bg-rose-500 text-white px-6 py-2 rounded-xl">
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review._id} className="border p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold">{review.user.name}</p>
              <div className="flex">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>

            {review.adminReply?.text && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Admin Reply:
                </p>
                <p className="text-sm text-gray-700">{review.adminReply.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}