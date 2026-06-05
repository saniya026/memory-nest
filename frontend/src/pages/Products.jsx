import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Sparkles } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
// LANDING_SERVICES hata de, zarurat nahi

export default function Products() {
  const [designs, setDesigns] = useState([]); // Khali array, LANDING_SERVICES nahi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/designs')
      .then((r) => {
        const fromApi = Array.isArray(r.data) ? r.data : [];
        setDesigns(fromApi);
      })
      .catch(() => setDesigns([])) // Error pe khali array
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl dark:text-white">Memory Designs</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Open a design to choose occasion themes or create your own event
      </p>

      <div className="mt-6 rounded-2xl border border-lavender/50 bg-gradient-to-r from-blush/40 to-lavender/30 p-5 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700">
        <div className="flex flex-wrap items-start gap-4">
          <Palette className="h-10 w-10 shrink-0 text-rose" />
          <div className="flex-1">
            <h2 className="font-display font-bold dark:text-white">Design studio</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Tap <strong>Customize & Design</strong> on any product — pick Birthday, Wedding, etc., or{' '}
              <strong>Add Your Own Occasion</strong> with custom colors.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              {['🎂 Birthday', '💍 Wedding', '💑 Anniversary', '🎓 Graduation', '✨ Custom'].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white/80 px-3 py-1 dark:bg-gray-900/50"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <Sparkles className="hidden h-8 w-8 text-nest-purple sm:block" />
        </div>
      </div>

      {loading && (
        <p className="mt-8 text-center text-gray-500">Loading designs…</p>
      )}
      {!loading && designs.length === 0 && ( // designs likha, services nahi
        <p className="mt-8 text-center text-gray-500">
          No designs found. Add one from admin panel.
        </p>
      )}

      <div className="mt-6 space-y-4 md:hidden">
        {designs.map((s) => ( // designs.map, services nahi
          <ProductCard key={s._id} service={s} listView />
        ))}
      </div>

      <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {designs.map((s) => ( // designs.map, services nahi
          <ProductCard key={s._id} service={s} />
        ))}
      </div>
    </div>
  );
}