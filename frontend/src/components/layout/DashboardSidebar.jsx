import { LayoutDashboard, Package, Settings, Shield, ShoppingBag, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const customerLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders' },
  { to: '/products', icon: Package, label: 'Browse Designs' },
];

const adminLinks = [
  { to: '/admin', icon: Shield, label: 'Admin Home', end: true },
  { to: '/admin/orders', icon: ShoppingBag, label: 'All Orders' },
  { to: '/admin/users', icon: Users, label: 'Customers' },
  { to: '/admin/services', icon: Package, label: 'Services' },
  { to: '/admin/pricing', icon: Settings, label: 'Pricing' },
];

export default function DashboardSidebar({ admin = false }) {
  const links = admin ? adminLinks : customerLinks;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-lavender/30 bg-white/50 p-6 lg:block dark:border-gray-700 dark:bg-gray-900/50">
      <Logo className="mb-8" />
      <nav className="space-y-1">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-blush to-lavender text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:text-white'
                  : 'text-gray-600 hover:bg-blush/40 dark:text-gray-400 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
