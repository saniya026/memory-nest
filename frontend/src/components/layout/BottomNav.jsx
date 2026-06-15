import { Home, LayoutDashboard, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const { count } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const tabs = [
    { to: '/home', icon: Home, label: 'Home', end: true },
    // { to: '/products', icon: Package, label: 'Designs' }, // ❌ Ye hata diya
    {
      to: isAuthenticated? (isAdmin? '/admin' : '/dashboard/orders') : '/login',
      icon: LayoutDashboard,
      label: isAdmin? 'Admin' : 'Orders',
    },
    { to: isAuthenticated? '/cart' : '/login', icon: ShoppingCart, label: 'Cart' },
    { to: isAuthenticated? '/profile' : '/login', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-lavender/40 bg-white/95 pb-safe backdrop-blur-lg md:hidden dark:border-gray-700 dark:bg-gray-900/95">
      <div className="flex h-16 items-stretch justify-around">
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition ${
                isActive? 'text-rose font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <span className="relative">
              <Icon className="h-6 w-6" strokeWidth={2} />
              {label === 'Cart' && count > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[10px] text-white">
                  {count}
                </span>
              )}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}