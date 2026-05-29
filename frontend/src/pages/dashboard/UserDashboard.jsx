import { Link } from 'react-router-dom';
import { BookHeart, Heart, Package, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold dark:text-white">
        Hello, {user?.name?.split(' ')[0]} ✨
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to your memory nest</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/dashboard/orders"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card transition hover:scale-[1.02] dark:bg-gray-800"
        >
          <ShoppingBag className="h-10 w-10 text-rose" />
          <div>
            <h3 className="font-bold">My Orders</h3>
            <p className="text-sm text-gray-500">Track & download designs</p>
          </div>
        </Link>
        <Link
          to="/dashboard/memories"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card transition hover:scale-[1.02] dark:bg-gray-800"
        >
          <BookHeart className="h-10 w-10 text-nest-purple" />
          <div>
            <h3 className="font-bold">Memory Journal</h3>
            <p className="text-sm text-gray-500">Your private photo collection</p>
          </div>
        </Link>
        <Link
          to="/wishlist"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card transition hover:scale-[1.02] dark:bg-gray-800"
        >
          <Heart className="h-10 w-10 text-rose" />
          <div>
            <h3 className="font-bold">Saved Designs</h3>
            <p className="text-sm text-gray-500">Wishlist for later</p>
          </div>
        </Link>
        <Link
          to="/products"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card transition hover:scale-[1.02] dark:bg-gray-800"
        >
          <Package className="h-10 w-10 text-nest-purple" />
          <div>
            <h3 className="font-bold">New Order</h3>
            <p className="text-sm text-gray-500">Create a memory page</p>
          </div>
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card transition hover:scale-[1.02] dark:bg-gray-800"
        >
          <User className="h-10 w-10 text-rose" />
          <div>
            <h3 className="font-bold">Edit Profile</h3>
            <p className="text-sm text-gray-500">Name, phone & account</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
