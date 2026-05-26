import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ service, onAdd, listView = false }) {
  if (listView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 rounded-2xl bg-white p-4 shadow-card dark:bg-gray-800"
      >
        <img
          src={service.image || 'https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=200'}
          alt={service.title}
          className="h-28 w-28 shrink-0 rounded-xl object-cover"
        />
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-gray-800 dark:text-white">{service.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{service.description}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-rose">₹{service.price}</span>
            <div className="flex gap-2">
              <Link to={`/products/${service._id}`} className="btn-secondary !py-2 !px-3 text-sm">
                View
              </Link>
              <button type="button" onClick={() => onAdd?.(service)} className="btn-primary !py-2 !px-3 text-sm">
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-card transition dark:bg-gray-800"
    >
      <Link to={`/products/${service._id}`}>
        <div className="card-polaroid mx-4 mt-4 !rotate-0 overflow-hidden !p-0">
          <img
            src={service.image || 'https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=400'}
            alt={service.title}
            className="aspect-[4/3] w-full object-cover transition group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold dark:text-white">{service.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{service.description}</p>
          <p className="mt-3 text-xl font-bold text-rose">₹{service.price}</p>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button type="button" onClick={() => onAdd?.(service)} className="btn-primary w-full !py-2.5 text-sm">
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
