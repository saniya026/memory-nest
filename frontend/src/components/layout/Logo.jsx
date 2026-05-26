import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-display font-bold ${className}`}>
      <span className="text-2xl">✨</span>
      <span className="bg-gradient-to-r from-rose to-nest-purple bg-clip-text text-transparent">
        MemoryNest
      </span>
    </Link>
  );
}
