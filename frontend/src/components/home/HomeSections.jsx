import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import ProductCard from '../ProductCard';

export function ServicesSection({ services }) {
  
  const list = Array.isArray(services) ? services : [];

  return (
    <section id="services" className="py-16">
      <h2 className="section-title text-center">Our Services</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-gray-600 dark:text-gray-400">
        Choose a style, then tap <strong>Customize & Design</strong> to pick your occasion theme
      </p>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          No designs yet.{' '}
          <a href="/products" className="font-semibold text-rose hover:underline">
            Browse all designs
          </a>
        </p>
      ) : (
        <>
          <div className="mt-10 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
            {list.slice(0, 4).map((s) => (
              <ProductCard key={s._id} service={s} />
            ))}
          </div>
          <div className="mt-10 space-y-4 md:hidden">
            {list.slice(0, 4).map((s) => (
              <ProductCard key={s._id} service={s} listView />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function PortfolioSection() {
  const images = [
    'https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=400',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  ];
  return (
    <section id="portfolio" className="py-16">
      <h2 className="section-title text-center">Portfolio</h2>
      <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="card-polaroid mb-4 break-inside-avoid"
            style={{ rotate: i % 2 ? '2deg' : '-2deg' }}
          >
            <img src={src} alt="" className="w-full rounded-sm" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  // ✅ LANDING_TESTIMONIALS hataya, empty array se start
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api
      .get('/testimonials')
      .then((r) => {
        if (r.data.testimonials?.length) setTestimonials(r.data.testimonials);
      })
      .catch(() => {});
  }, []);

  // ✅ Agar testimonials nahi hai to section hide kar de
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-16">
      <h2 className="section-title text-center">Happy Memories</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="rounded-2xl bg-white/80 p-6 shadow-card dark:bg-gray-800"
          >
            <div className="flex gap-1 text-amber-400">
              {[...Array(t.rating || 5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">&ldquo;{t.content}&rdquo;</p>
            <p className="mt-4 font-semibold">{t.name}</p>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const DEFAULT_PRICING = [
  {
    _id: 'default-basic',
    name: 'Basic',
    price: 100,
    description: 'Perfect to get started',
    features: ['1 custom memory page', 'Basic design', 'Delivery in 2 days'],
    isPopular: true,
  },
];

export function PricingSection() {
  const pricing = DEFAULT_PRICING;

  return (
    <section id="pricing" className="py-16">
      <h2 className="section-title text-center">Pricing</h2>
      <div className="mx-auto mt-10 grid max-w-md gap-6 md:max-w-lg">
        {pricing.map((p) => (
          <div
            key={p._id}
            className={`relative rounded-2xl p-8 ${
              p.isPopular
                ? 'bg-gradient-to-b from-rose/20 to-lavender/40 ring-2 ring-rose shadow-card'
                : 'bg-white/80 dark:bg-gray-800'
            }`}
          >
            {p.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rose px-4 py-1 text-xs font-bold text-white">
                Popular
              </span>
            )}
            <h3 className="font-display text-xl font-bold">{p.name}</h3>
            <p className="mt-2 text-3xl font-bold text-rose">₹{p.price}</p>
            <p className="text-sm text-gray-500">{p.description}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.features?.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We will reply soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16">
      <h2 className="section-title text-center">Contact Us</h2>
      <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white/80 p-8 shadow-card dark:bg-gray-800">
          <input
            className="input-field"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <textarea
            className="input-field"
            rows={4}
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button type="submit" disabled={sending} className="btn-primary w-full">
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        <div className="space-y-4 rounded-2xl bg-white/80 p-8 text-gray-600 shadow-card dark:bg-gray-800 dark:text-gray-300">
          <p className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-rose" />
            <a href="mailto:alisaniya026@gmail.com" className="hover:text-rose">
              alisaniya026@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-rose" />
            <a href="tel:+917991400787" className="hover:text-rose">
              +91 7991400787
            </a>
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-rose" /> Crafted with love, worldwide
          </p>
        </div>
      </div>
    </section>
  );
}