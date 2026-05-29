import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (service) => {
    addToCart(service);
    removeFromWishlist(service._id);
    toast.success('Moved to cart');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold dark:text-white">Saved Designs</h1>
      <p className="mt-1 text-sm text-gray-500">Designs you&apos;ve hearted for later</p>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-rose/30" />
          <p className="mt-3 text-gray-500">No saved designs yet.</p>
          <Link to="/products" className="btn-primary mt-4 inline-flex">
            Browse Designs
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((s) => (
            <li
              key={s._id}
              className="flex gap-4 rounded-2xl bg-white p-4 shadow-card dark:bg-gray-800"
            >
              <img
                src={s.image || 'https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=200'}
                alt=""
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-bold dark:text-white">{s.title}</h3>
                  <p className="text-lg font-bold text-rose">₹{s.price}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link to={`/products/${s._id}`} className="btn-secondary !py-2 !px-3 text-sm">
                    View
                  </Link>
                  <button type="button" onClick={() => moveToCart(s)} className="btn-primary !py-2 !px-3 text-sm">
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(s._id)}
                    className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:text-red-500 dark:border-gray-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
