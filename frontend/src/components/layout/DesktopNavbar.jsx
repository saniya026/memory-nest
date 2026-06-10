import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

// ✅ Anchor links hata diye, naye route add kiye
const links = [
  { to: '/#features', label: 'Features' },
  { to: '/services', label: 'Services' }, // ✅ Changed: /#services → /services
  { to: '/gallery', label: 'My Designs' }, // ✅ Changed: /#portfolio → /gallery
  { to: '/#reviews', label: 'Reviews' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/#contact', label: 'Contact' },
];

export default function DesktopNavbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 hidden glass border-b border-lavender/30 md:block dark:border-gray-700">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-8">
          {links.map((l) => (
            // ✅ NavLink use kar taaki active state dikhe
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
          {/* ✅ Purana /products wala "Designs" hata de agar nahi chahiye */}
          {/* <NavLink to="/products" className="text-sm font-semibold text-gray-600 hover:text-rose dark:text-gray-300">
            Designs
          </NavLink> */}
        </div>
        <div className="flex items-center gap-3">
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
              <Link to="/wishlist" className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Saved
              </Link>
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