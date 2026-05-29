import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ReviewCard from './ReviewCard';

export default function ReviewsSection({ serviceId, occasion, title = 'Love from Our Customers' }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: '6' });
    if (serviceId) params.set('serviceId', serviceId);
    if (occasion) params.set('occasion', occasion);

    api
      .get(`/reviews?${params}`)
      .then((r) => setReviews(r.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [serviceId, occasion]);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className={serviceId ? 'mt-12' : 'py-16'} id={serviceId ? undefined : 'reviews'}>
      <h2 className="section-title text-center">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-gray-600 dark:text-gray-400">
        Real stories from families who trusted MemoryNest
      </p>
      {loading ? (
        <p className="mt-10 text-center text-gray-500">Loading reviews...</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r._id} review={r} />
          ))}
        </div>
      )}
    </section>
  );
}
