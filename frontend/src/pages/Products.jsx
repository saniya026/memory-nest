import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data.services)).catch(() => {});
  }, []);

  const handleAdd = (service) => {
    addToCart(service);
    toast.success('Added to cart!');
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl dark:text-white">Memory Designs</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Pick your perfect scrapbook style</p>

      {/* Mobile: vertical list */}
      <div className="mt-6 space-y-4 md:hidden">
        {services.map((s) => (
          <ProductCard key={s._id} service={s} onAdd={handleAdd} listView />
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((s) => (
          <ProductCard key={s._id} service={s} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}
