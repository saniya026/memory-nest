import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { CUSTOM_COLOR_PRESETS } from '../../config/customColorPresets';
import { buildCustomOccasionTheme } from '../../config/occasionThemes';
import '../../styles/customEventModal.css';

const MAX_NAME_LENGTH = 30;

/**
 * Modal: custom event name + color preset + live preview.
 * onConfirm(themeObject) — parent adds card and applies theme.
 */
export default function CustomEventModal({ open, onClose, onConfirm, initialData }) {
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState('');
  const [presetId, setPresetId] = useState(CUSTOM_COLOR_PRESETS[0].id);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (open) {
      setClosing(false);
      setName(initialData?.label?.slice(0, MAX_NAME_LENGTH) || '');
      setPresetId(initialData?.presetId || CUSTOM_COLOR_PRESETS[0].id);
      setShowPreview(false);
    }
  }, [open, initialData]);

  const preset = CUSTOM_COLOR_PRESETS.find((p) => p.id === presetId) || CUSTOM_COLOR_PRESETS[0];

  const previewTheme = buildCustomOccasionTheme({
    id: initialData?.id || 'custom-preview',
    name: name.trim() || 'Your Event',
    primary: preset.primary,
    secondary: preset.secondary,
    presetLabel: preset.label,
  });

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 280);
  };

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const theme = buildCustomOccasionTheme({
      id: initialData?.id || `custom-${Date.now()}`,
      name: trimmed,
      primary: preset.primary,
      secondary: preset.secondary,
      presetLabel: preset.label,
    });
    theme.presetId = preset.id;
    onConfirm(theme);
    handleClose();
  };

  if (!open && !closing) return null;

  return (
    <div
      className={`custom-event-backdrop fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center ${closing ? 'closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-event-title"
      onClick={handleClose}
    >
      <div
        className={`custom-event-panel max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 ${closing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="custom-event-title" className="font-display text-xl font-bold dark:text-white">
            {initialData ? 'Edit your occasion' : 'Add your own occasion'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            What&apos;s the occasion?
          </label>
          <input
            type="text"
            maxLength={MAX_NAME_LENGTH}
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
            placeholder="e.g. Retirement Party, Farewell, House Warming..."
            className="input-field mt-2"
          />
          <p className="mt-1 text-right text-xs text-gray-400">{name.length}/{MAX_NAME_LENGTH}</p>
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Color theme</label>
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {CUSTOM_COLOR_PRESETS.map((p) => {
              const selected = presetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  title={p.label}
                  onClick={() => setPresetId(p.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={`color-swatch relative flex overflow-hidden ${selected ? 'selected' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${p.primary} 50%, ${p.secondary} 50%)`,
                    }}
                  >
                    {selected && (
                      <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" strokeWidth={3} />
                    )}
                  </span>
                  <span className="max-w-[52px] truncate text-[10px] text-gray-500">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {showPreview && (
          <div
            className="mt-5 rounded-xl border-2 p-4 transition-all duration-300"
            style={{
              background: previewTheme.bg,
              borderColor: previewTheme.primary,
              color: previewTheme.text,
            }}
          >
            <p className="text-xs font-semibold uppercase opacity-70">Live preview</p>
            <p className="mt-2 font-display text-lg font-bold" style={{ color: previewTheme.primary }}>
              {previewTheme.icon} {previewTheme.label}
            </p>
            <p className="mt-1 text-sm opacity-80">MemoryNest designing page</p>
            <button
              type="button"
              className="mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: previewTheme.primary }}
            >
              Sample button
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="btn-secondary flex-1 !py-2.5 text-sm"
          >
            Preview
          </button>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleConfirm}
            className="btn-primary flex-1 !py-2.5 text-sm disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
