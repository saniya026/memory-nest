import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeFromCart, total } = useCart();
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
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold dark:text-white">Your Cart</h1>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card dark:bg-gray-800"
          >
            <img
              src={item.service?.image}
              alt=""
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.service?.title}</h3>
              {item.orderDraft?.occasion && (
                <p className="text-sm text-gray-500">
                  {item.orderDraft.occasion} · {item.orderDraft.theme}
                </p>
              )}
              <p className="font-bold text-rose">₹{item.service?.price}</p>
            </div>
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="rounded-full p-2 text-red-400 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-white/90 p-6 shadow-card dark:bg-gray-800">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-rose">₹{total}</span>
        </div>
        <button
          type="button"
          onClick={() => (isAuthenticated ? navigate('/checkout') : navigate('/login'))}
          className="btn-primary mt-6 w-full"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
