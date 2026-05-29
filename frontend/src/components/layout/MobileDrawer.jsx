import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MobileDrawer({ open, onClose }) {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  if (!open) return null;

  const anchorLinks = [
    { href: '/#features', label: 'All Features' },
    { href: '/#services', label: 'Services' },
    { href: '/#portfolio', label: 'Portfolio' },
    { href: '/#reviews', label: 'Reviews' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="absolute right-0 top-0 h-full w-72 animate-fadeIn overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-blush/40">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-3">
          <Link to="/products" onClick={onClose} className="text-lg font-bold text-rose">
            🎨 Design Studio (Occasions)
          </Link>
          {anchorLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={onClose}
              className="text-base font-semibold text-gray-700 dark:text-gray-200"
            >
              {l.label}
            </a>
          ))}

          <hr className="my-2 border-lavender/40 dark:border-gray-700" />

          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin" onClick={onClose} className="font-semibold text-nest-purple">
                    Admin Panel
                  </Link>
                  <Link to="/admin/reviews" onClick={onClose} className="text-gray-700 dark:text-gray-200">
                    Moderate Reviews
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={onClose} className="font-semibold text-rose">
                    Dashboard
                  </Link>
                  <Link to="/dashboard/orders" onClick={onClose} className="text-gray-700 dark:text-gray-200">
                    My Orders
                  </Link>
                  <Link to="/dashboard/memories" onClick={onClose} className="text-gray-700 dark:text-gray-200">
                    Memory Journal
                  </Link>
                  <Link to="/wishlist" onClick={onClose} className="text-gray-700 dark:text-gray-200">
                    Saved Designs
                  </Link>
                </>
              )}
              <Link to="/cart" onClick={onClose} className="text-gray-700 dark:text-gray-200">
                Cart
              </Link>
              <Link to="/profile" onClick={onClose} className="text-gray-700 dark:text-gray-200">
                Edit Profile
              </Link>
              <button type="button" onClick={() => { logout(); onClose(); }} className="text-left text-rose">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onClose} className="font-semibold">
                Login
              </Link>
              <Link to="/signup" onClick={onClose} className="btn-primary text-center">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
