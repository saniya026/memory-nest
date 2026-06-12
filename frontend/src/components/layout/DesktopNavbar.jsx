import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'My Designs' },
  { to: '/reviews', label: 'Reviews' },
];

export default function DesktopNavbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items?.length || 0;

  return (
    <header className="sticky top-0 z-50 hidden glass border-b border-lavender/30 md:block dark:border-gray-700">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-rose ${
                  isActive
            ? 'text-rose'
                    : 'text-gray-600 dark:text-gray-300 dark:hover:text-rose'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">

          {/* CART ICON + COUNT */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-rose" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <ThemeToggle />
          {isAuthenticated? (
            <>
              {isAdmin? (
                <Link to="/admin" className="text-sm font-semibold text-nest-purple">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Dashboard
                </Link>
              )}
              {/* ❌ DELETE KAR DIYA: Saved duplicate tha */}
              {/* <Link to="/wishlist" className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Saved
              </Link> */}
              <Link to="/profile" className="btn-secondary!py-2!px-4 text-sm">
                {user?.name?.split(' ')[0]}
              </Link>
              <button type="button" onClick={logout} className="text-sm text-gray-500 hover:text-rose">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Login
              </Link>
              <Link to="/signup" className="btn-primary!py-2!px-5 text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}