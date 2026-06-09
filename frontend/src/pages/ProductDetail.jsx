import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import ReviewsSection from '../components/reviews/ReviewsSection';
import OccasionSelector from '../components/design/OccasionSelector';
import CustomEventModal from '../components/design/CustomEventModal';
import {
  DEFAULT_OCCASION_ID,
  OCCASION_ORDER_VALUES,
  getOccasionCssVars,
  getThemeById,
} from '../config/occasionThemes';
import '../styles/occasionThemes.css';

const VISUAL_THEMES = ['Pastel Pink', 'Lavender Dream', 'Cream Scrapbook', 'Mint Garden', 'Golden Vintage'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [occasionId, setOccasionId] = useState(DEFAULT_OCCASION_ID);
  const [customOccasions, setCustomOccasions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustom, setEditingCustom] = useState(null);
  const [form, setForm] = useState({
    theme: 'Pastel Pink',
    message: '',
    specialInstructions: '',
  });
  const [photos, setPhotos] = useState([]);
  const [captions, setCaptions] = useState([]);

  const resolveTheme = (oid) => {
    const custom = customOccasions.find((c) => c.id === oid);
    if (custom) return custom;
    return getThemeById(oid);
  };

  const occasionTheme = useMemo(() => resolveTheme(occasionId), [occasionId, customOccasions]);
  const cssVars = useMemo(() => getOccasionCssVars(occasionTheme), [occasionTheme]);

  const orderOccasion = useMemo(() => {
    if (occasionTheme.isCustom) return 'Custom';
    return OCCASION_ORDER_VALUES[occasionId] || 'Custom';
  }, [occasionId, occasionTheme]);

  const displayOccasionName = occasionTheme.isCustom
  ? occasionTheme.label
    : orderOccasion;

  // ✅ FINAL FIX: /designs + cache busting + loading state
  useEffect(() => {
    setLoading(true);
    api.get(`/designs/${id}?v=${Date.now()}`)
    .then((r) => {
        console.log('Design API Response:', r.data);
        if (r.data && r.data.design) {
          setService(r.data.design);
        } else {
          toast.error('Design data not found');
          setService(null);
        }
      })
    .catch((err) => {
        console.error('Design fetch error:', err);
        toast.error('Failed to load design');
        setService(null);
      })
    .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleOccasionSelect = (oid) => {
    setOccasionId(oid);
    const theme = resolveTheme(oid);
    if (oid!== DEFAULT_OCCASION_ID) {
      setForm((f) => ({
      ...f,
        theme: theme.isCustom
        ? `${theme.label} — ${theme.colorPresetLabel || 'Custom colors'}`
          : `${theme.label} — ${theme.vibe.split(',')[0]}`,
      }));
    }
  };

  const handleCustomConfirm = (theme) => {
    setCustomOccasions((prev) => {
      const exists = prev.findIndex((c) => c.id === theme.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = theme;
        return next;
      }
      return [...prev, theme];
    });
    setOccasionId(theme.id);
    setForm((f) => ({
    ...f,
      theme: `${theme.label} — ${theme.colorPresetLabel || 'Custom'}`,
    }));
    toast.success(`"${theme.label}" theme applied!`);
  };

  const handleRemoveCustom = (customId) => {
    setCustomOccasions((prev) => prev.filter((c) => c.id!== customId));
    if (occasionId === customId) setOccasionId(DEFAULT_OCCASION_ID);
    toast.success('Custom occasion removed');
  };

  const openAddModal = () => {
    setEditingCustom(null);
    setModalOpen(true);
  };

  const openEditModal = (occ) => {
    setEditingCustom({
      id: occ.id,
      label: occ.label,
      presetId: occ.presetId,
    });
    setModalOpen(true);
  };

  const onPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    setPhotos(files);
    setCaptions(files.map(() => ''));
  };

  const startOrder = () => {
    if (!service) return;
    if (occasionId === DEFAULT_OCCASION_ID) {
      toast.error('Please select an occasion first');
      return;
    }

    const draft = {
      occasion: orderOccasion,
    ...form,
      photos,
      captions,
      amount: service.price,
      serviceId: service._id,
      occasionThemeId: occasionId,
    };

    if (occasionTheme.isCustom) {
      draft.customOccasionName = occasionTheme.label;
      draft.customColorPreset = occasionTheme.colorPresetLabel || '';
      draft.customColorPrimary = occasionTheme.customColors?.primary || occasionTheme.primary;
      draft.customColorSecondary = occasionTheme.customColors?.secondary || occasionTheme.secondary;
    }

    addToCart(service, draft);
    toast.success('Added to cart — complete checkout to place order');
    navigate('/cart');
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading design...</div>;
  }

  if (!service) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Design not found</p>
        <Link to="/products" className="mt-4 inline-block text-rose hover:underline">
          ← Back to designs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div
        className="occasion-design-page"
        data-pattern={occasionTheme.pattern}
        style={cssVars}
      >
        <header className="occasion-design-header -mx-4 mb-6 rounded-t-2xl px-4 py-4 md:mx-0 md:rounded-2xl">
          <Link to="/products" className="occasion-link text-sm font-semibold hover:underline">
            ← Back to designs
          </Link>
          <p className="occasion-vibe mt-1 text-xs uppercase tracking-wider">Memory designing studio</p>
          <h1 className="font-display mt-2 text-2xl font-bold md:text-3xl">{service.title}</h1>
          {occasionId!== DEFAULT_OCCASION_ID && (
            <p
              className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
              style={{
                background: occasionTheme.secondary,
                color: occasionTheme.primary,
                border: `1px solid ${occasionTheme.border}`,
              }}
            >
              <span>{occasionTheme.icon}</span> {occasionTheme.label}
              {!occasionTheme.isCustom && ` · ${occasionTheme.vibe}`}
            </p>
          )}
        </header>

        <OccasionSelector
          selectedId={occasionId}
          onSelect={handleOccasionSelect}
          customOccasions={customOccasions}
          onAddCustom={openAddModal}
          onEditCustom={openEditModal}
          onRemoveCustom={handleRemoveCustom}
        />

        <CustomEventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleCustomConfirm}
          initialData={editingCustom}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div
            className="overflow-hidden rounded-sm p-3 shadow-polaroid transition-transform duration-300"
            style={{
              background: '#fff',
              border: `3px solid ${occasionTheme.border}`,
            }}
          >
            <img src={service.image} alt={service.title} className="w-full rounded-sm object-cover" />
          </div>

          <div>
            <p className="occasion-price text-2xl font-bold">₹{service.price}</p>
            <p className="occasion-vibe mt-4">{service.description}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {service.features?.map((f) => (
                <li key={f} style={{ color: 'var(--occ-text)' }}>
                  ✨ {f}
                </li>
              ))}
            </ul>

            <div className="occasion-surface mt-8 space-y-4 rounded-2xl p-6">
              <h2 className="font-display font-bold">Customize Your Memory</h2>

              <div>
                <label className="text-sm font-semibold">Upload Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onPhotos}
                  className="occasion-input mt-1 block w-full rounded-xl px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-1"
                />
                {photos.length > 0 && (
                  <p className="occasion-vibe mt-1 text-xs">{photos.length} photo(s) selected</p>
                )}
              </div>

              {photos.map((_, i) => (
                <input
                  key={i}
                  className="occasion-input w-full rounded-xl px-4 py-3 text-sm"
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
                <label className="text-sm font-semibold">Visual style (optional tweak)</label>
                <select
                  className="occasion-input mt-1 w-full rounded-xl px-4 py-3"
                  value={form.theme}
                  onChange={(e) => setForm({...form, theme: e.target.value })}
                >
                  {VISUAL_THEMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <textarea
                className="occasion-input w-full rounded-xl px-4 py-3"
                placeholder="Your message / story"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value })}
              />
              <textarea
                className="occasion-input w-full rounded-xl px-4 py-3"
                placeholder="Special instructions"
                rows={2}
                value={form.specialInstructions}
                onChange={(e) => setForm({...form, specialInstructions: e.target.value })}
              />

              <button
                type="button"
                onClick={startOrder}
                className="occasion-btn-primary w-full rounded-2xl px-6 py-3 font-semibold shadow-card"
              >
                Add to Cart & Continue
              </button>
            </div>
          </div>
        </div>

        <footer className="occasion-design-footer mt-8 rounded-b-2xl px-4 py-4 text-center text-sm">
          <p className="occasion-vibe">
            Occasion:{' '}
            <strong style={{ color: 'var(--occ-primary)' }}>{displayOccasionName}</strong>
            {occasionId === DEFAULT_OCCASION_ID && ' — select one above to personalize'}
          </p>
        </footer>
      </div>

      <div className="mt-12">
        <ReviewsSection serviceId={id} title="Reviews for this design" />
      </div>
    </div>
  );
}