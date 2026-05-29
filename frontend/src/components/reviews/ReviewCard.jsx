import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <article className="rounded-2xl bg-white/80 p-6 shadow-card dark:bg-gray-800">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blush to-lavender text-lg font-bold text-gray-700">
          {review.customerName?.[0] || '✨'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold dark:text-white">{review.customerName}</p>
            {review.occasion && (
              <span className="rounded-full bg-blush/60 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {review.occasion}
              </span>
            )}
          </div>
          <div className="mt-1 flex gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-4 w-4 ${n <= review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-600'}`}
              />
            ))}
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">&ldquo;{review.content}&rdquo;</p>
          {review.photo?.url && (
            <img
              src={review.photo.url}
              alt=""
              className="mt-3 max-h-40 rounded-xl object-cover"
            />
          )}
          <p className="mt-2 text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>
      </div>
    </article>
  );
}
