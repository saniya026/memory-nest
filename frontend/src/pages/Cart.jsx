import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <span className="text-6xl">🛒</span>
        <h2 className="mt-4 font-display text-xl font-bold">Your cart is empty</h2>
        <Link to="/products" className="btn-primary mt-6">
          Browse Designs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold dark:text-white">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card dark:bg-gray-800"
          >
            {/* ✅ FIX: Image puri dikhegi - object-contain */}
            <div className="h-20 w-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
              <img
                src={item.service?.image}
                alt={item.service?.title}
                className="h-full w-full object-contain rounded-xl"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.service?.title}</h3>
              {item.orderDraft?.occasion && (
                <p className="text-sm text-gray-500">
                  {item.orderDraft.occasion} · {item.orderDraft.theme}
                </p>
              )}
              <p className="font-bold text-rose text-lg">₹{item.service?.price || 50}</p>
            </div>

            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="rounded-full p-2 text-red-400 hover:bg-red-50 transition"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white/90 p-6 shadow-card dark:bg-gray-800">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total Amount</span>
          <span className="text-rose">₹{total}</span>
        </div>
        <button
          type="button"
          onClick={() => (isAuthenticated? navigate('/checkout') : navigate('/login'))}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}