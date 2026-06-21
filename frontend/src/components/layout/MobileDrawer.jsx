import { X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MobileDrawer({ open, onClose }) {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!open) return null;

  const handleAnchorClick = (hash) => {
    onClose();
    
    if (location.pathname!== '/home' && location.pathname!== '/') {
      navigate('/home');
      
      setTimeout(() => {
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      
      const element = document.querySelector(hash);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-72 animate-fadeIn overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-blush/40 dark:hover:bg-gray-700"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {/* Public Links */}
          <button
            onClick={() => handleAnchorClick('#features')}
            className="rounded-lg px-3 py-2.5 text-left text-base font-semibold text-gray-700 transition hover:bg-rose/10 hover:text-rose dark:text-gray-200 dark:hover:bg-gray-700"
          >
            All Features
          </button>

          <Link
            to="/services"
            onClick={handleLinkClick}
            className="rounded-lg px-3 py-2.5 text-base font-semibold text-gray-700 transition hover:bg-rose/10 hover:text-rose dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Services
          </Link>

          <Link
            to="/gallery"
            onClick={handleLinkClick}
            className="rounded-lg px-3 py-2.5 text-base font-semibold text-gray-700 transition hover:bg-rose/10 hover:text-rose dark:text-gray-200 dark:hover:bg-gray-700"
          >
            My Designs
          </Link>

          <button
            onClick={() => handleAnchorClick('#reviews')}
            className="rounded-lg px-3 py-2.5 text-left text-base font-semibold text-gray-700 transition hover:bg-rose/10 hover:text-rose dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Reviews
          </button>

          <hr className="my-3 border-lavender/40 dark:border-gray-700" />

          {/* Auth Links */}
          {isAuthenticated? (
            <>
              {isAdmin? (
                <>
                  <Link
                    to="/admin"
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2.5 font-semibold text-nest-purple transition hover:bg-purple-50 dark:hover:bg-gray-700"
                  >
                    Admin Panel
                  </Link>
                  <Link
                    to="/admin/reviews"
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2.5 text-gray-700 transition hover:bg-rose/10 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Moderate Reviews
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2.5 font-semibold text-rose transition hover:bg-rose/10 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/orders"
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2.5 text-gray-700 transition hover:bg-rose/10 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/dashboard/memories"
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2.5 text-gray-700 transition hover:bg-rose/10 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Memory Journal
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2.5 text-gray-700 transition hover:bg-rose/10 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Saved Designs
                  </Link>
                </>
              )}

              <Link
                to="/cart"
                onClick={handleLinkClick}
                className="rounded-lg px-3 py-2.5 text-gray-700 transition hover:bg-rose/10 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cart
              </Link>

              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="rounded-lg px-3 py-2.5 text-gray-700 transition hover:bg-rose/10 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Edit Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-lg px-3 py-2.5 text-left font-semibold text-rose transition hover:bg-rose/10 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="rounded-lg px-3 py-2.5 font-semibold text-gray-700 transition hover:bg-rose/10 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={handleLinkClick}
                className="mt-2 rounded-full bg-rose px-3 py-2.5 text-center font-semibold text-white transition hover:bg-rose-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}