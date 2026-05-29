import { Link } from 'react-router-dom';
import {
  BookHeart,
  Heart,
  LogIn,
  MessageSquare,
  Palette,
  ShoppingBag,
  Sparkles,
  Star,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const features = [
  {
    icon: Palette,
    title: 'Occasion themes',
    desc: 'Birthday, Wedding, Anniversary & more — page colors change instantly',
    to: '/products',
    public: true,
  },
  {
    icon: Sparkles,
    title: 'Custom occasion',
    desc: 'Name your event + pick from 12 color themes',
    to: '/products',
    public: true,
  },
  {
    icon: ShoppingBag,
    title: 'Design & order',
    desc: 'Upload photos, captions, and checkout with UPI',
    to: '/products',
    public: true,
  },
  {
    icon: UserPlus,
    title: 'Create account',
    desc: 'Signup with phone — track orders & save designs',
    to: '/signup',
    public: true,
    guestOnly: true,
  },
  {
    icon: LogIn,
    title: 'Login',
    desc: 'Email + password, OTP forgot password',
    to: '/login',
    public: true,
    guestOnly: true,
  },
  {
    icon: Heart,
    title: 'Saved designs',
    desc: 'Wishlist designs you love',
    to: '/wishlist',
    auth: true,
  },
  {
    icon: BookHeart,
    title: 'Memory journal',
    desc: 'Private photo collection in your nest',
    to: '/dashboard/memories',
    auth: true,
  },
  {
    icon: MessageSquare,
    title: 'My orders',
    desc: 'Track status, reorder, write reviews',
    to: '/dashboard/orders',
    auth: true,
  },
  {
    icon: Star,
    title: 'Customer reviews',
    desc: 'Real ratings from completed orders',
    to: '/#reviews',
    public: true,
  },
];

export default function HomeFeaturesSection() {
  const { isAuthenticated } = useAuth();

  const visible = features.filter((f) => {
    if (f.guestOnly && isAuthenticated) return false;
    if (f.auth && !isAuthenticated) return false;
    return true;
  });

  return (
    <section id="features" className="py-16">
      <h2 className="section-title text-center">Everything in MemoryNest</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-gray-600 dark:text-gray-400">
        Tap any card to open that feature — start with <strong>Designs</strong> to pick an occasion theme
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ icon: Icon, title, desc, to }) => (
          <Link
            key={title}
            to={to}
            className="group flex gap-4 rounded-2xl bg-white/90 p-5 shadow-card transition hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blush to-lavender text-rose-dark dark:from-gray-700 dark:to-gray-600">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display font-bold group-hover:text-rose dark:text-white">{title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
      {!isAuthenticated && (
        <p className="mt-8 text-center text-sm text-gray-500">
          <Link to="/signup" className="font-semibold text-rose hover:underline">
            Sign up free
          </Link>{' '}
          to unlock wishlist, memory journal, and order tracking
        </p>
      )}
    </section>
  );
}
