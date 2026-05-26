import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MobileDrawer({ open, onClose }) {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  if (!open) return null;

  const links = [
    { href: '/#services', label: 'Services' },
    { href: '/#portfolio', label: 'Portfolio' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/products', label: 'Designs', isRoute: true },
  ];

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="absolute right-0 top-0 h-full w-72 animate-fadeIn bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-blush/40">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {links.map((l) =>
            l.isRoute ? (
              <Link key={l.label} to={l.href} onClick={onClose} className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} onClick={onClose} className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {l.label}
              </a>
            )
          )}
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link to="/admin" onClick={onClose} className="text-lg font-semibold text-nest-purple">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" onClick={onClose} className="text-lg font-semibold text-rose">
                  My Orders
                </Link>
              )}
              <button type="button" onClick={() => { logout(); onClose(); }} className="text-left text-rose">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onClose} className="text-lg font-semibold">
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
