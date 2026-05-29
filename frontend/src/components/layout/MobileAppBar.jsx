import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export default function MobileAppBar({ onMenuClick, title }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 glass border-b border-lavender/30 md:hidden dark:border-gray-700">
      <div className="flex h-14 items-center justify-between px-4">
        {title ? (
          <h1 className="font-display text-lg font-bold">{title}</h1>
        ) : (
          <Logo className="text-lg" />
        )}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-full p-2 hover:bg-blush/40 dark:hover:bg-gray-700"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
