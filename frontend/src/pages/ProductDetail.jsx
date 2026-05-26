import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const OCCASIONS = ['Birthday', 'Friendship', 'Anniversary', 'Farewell', 'Custom'];
const THEMES = ['Pastel Pink', 'Lavender Dream', 'Cream Scrapbook', 'Mint Garden', 'Golden Vintage'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({
    occasion: 'Birthday',
    theme: 'Pastel Pink',
    message: '',
    specialInstructions: '',
  });
  const [photos, setPhotos] = useState([]);
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    api.get(`/services/${id}`).then((r) => setService(r.data.service)).catch(() => {});
  }, [id]);

  const onPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    setPhotos(files);
    setCaptions(files.map(() => ''));
  };

  const startOrder = () => {
    if (!service) return;
    addToCart(service, {
      ...form,
      photos,
      captions,
      amount: service.price,
      serviceId: service._id,
    });
    toast.success('Added to cart — complete checkout to place order');
    navigate('/cart');
  };

  if (!service) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/products" className="text-sm text-rose hover:underline">
        ← Back to products
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="card-polaroid !rotate-0 overflow-hidden">
          <img src={service.image} alt={service.title} className="w-full object-cover" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold dark:text-white">{service.title}</h1>
          <p className="mt-2 text-2xl font-bold text-rose">₹{service.price}</p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{service.description}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {service.features?.map((f) => (
              <li key={f}>✨ {f}</li>
            ))}
          </ul>

          <div className="mt-8 space-y-4 rounded-2xl bg-white/80 p-6 shadow-card dark:bg-gray-800">
            <h2 className="font-display font-bold">Customize Your Memory</h2>
            <div>
              <label className="text-sm font-semibold">Upload Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onPhotos}
                className="mt-1 block w-full text-sm"
              />
              {photos.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">{photos.length} photo(s) selected</p>
              )}
            </div>
            {photos.map((_, i) => (
              <input
                key={i}
                className="input-field text-sm"
                placeholder={`Caption for photo ${i + 1}`}
                value={captions[i] || ''}
                onChange={(e) => {
                  const c = [...captions];
                  c[i] = e.target.value;
                  setCaptions(c);
                }}
              />
            ))}
            <div>
              <label className="text-sm font-semibold">Occasion</label>
              <select
                className="input-field mt-1"
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              >
                {OCCASIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Theme</label>
              <select
                className="input-field mt-1"
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
              >
                {THEMES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <textarea
              className="input-field"
              placeholder="Your message / story"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <textarea
              className="input-field"
              placeholder="Special instructions"
              value={form.specialInstructions}
              onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
            />
            <button type="button" onClick={startOrder} className="btn-primary w-full">
              Add to Cart & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
