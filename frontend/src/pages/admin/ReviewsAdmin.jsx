import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});

  const fetchReviews = async () => {
    const { data } = await api.get('/reviews');
    setReviews(data.reviews);
  };

  useEffect(() => { fetchReviews() }, []);

  const handleReply = async (id) => {
    try {
      await api.patch(`/reviews/${id}/reply`, { text: replyText[id] });
      toast.success('Reply added');
      setReplyText({...replyText, [id]: '' });
      fetchReviews();
    } catch (err) {
      toast.error('Failed to reply');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
      {reviews.map(review => (
        <div key={review._id} className="border p-4 mb-4 rounded-xl">
          <p><b>{review.user.name}</b> - {review.rating}★</p>
          <p>{review.comment}</p>

          {review.adminReply?.text? (
            <p className="text-sm text-blue-600 mt-2">Replied: {review.adminReply.text}</p>
          ) : (
            <div className="mt-3 flex gap-2">
              <input
                value={replyText[review._id] || ''}
                onChange={e => setReplyText({...replyText, [review._id]: e.target.value})}
                placeholder="Write reply..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => handleReply(review._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}