import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded-full p-2 transition hover:bg-blush/50 dark:hover:bg-gray-700 ${className}`}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-lavender-dark" />}
    </button>
  );
}
