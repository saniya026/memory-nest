import { Pencil, Plus, Trash2 } from 'lucide-react';
import { OCCASION_LIST } from '../../config/occasionThemes';

/**
 * Preset occasion cards + customer custom occasions + "Add your own" card.
 */
export default function OccasionSelector({
  selectedId,
  onSelect,
  customOccasions = [],
  onAddCustom,
  onEditCustom,
  onRemoveCustom,
}) {
  return (
    <section className="occasion-surface rounded-2xl p-4 md:p-6" aria-label="Choose your occasion">
      <h2 className="font-display text-lg font-bold md:text-xl" style={{ color: 'var(--occ-text)' }}>
        What are we celebrating?
      </h2>
      <p className="occasion-vibe mt-1 text-sm">Tap an occasion — your page theme updates instantly</p>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-4">
        {OCCASION_LIST.map((occ) => (
          <OccasionCard key={occ.id} occ={occ} selected={selectedId === occ.id} onSelect={() => onSelect(occ.id)} />
        ))}

        {customOccasions.map((occ) => (
          <div key={occ.id} className="relative shrink-0 md:min-w-0">
            <OccasionCard occ={occ} selected={selectedId === occ.id} onSelect={() => onSelect(occ.id)} isCustom />
            {selectedId === occ.id && (
              <div className="mt-1 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onEditCustom?.(occ)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-white/80 dark:text-gray-300"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveCustom?.(occ.id)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={onAddCustom}
          className="occasion-card flex min-w-[140px] shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all duration-300 hover:scale-[1.01] md:min-w-0"
          style={{
            borderColor: 'var(--occ-primary)',
            color: 'var(--occ-primary)',
            background: 'var(--occ-surface)',
          }}
        >
          <Plus className="h-8 w-8" strokeWidth={2.5} />
          <span className="mt-2 text-sm font-bold leading-tight">Add Your Own Occasion</span>
        </button>
      </div>
    </section>
  );
}

function OccasionCard({ occ, selected, onSelect, isCustom }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`occasion-card flex min-w-[140px] flex-col items-center rounded-2xl p-4 text-center transition-all duration-300 md:min-w-0 ${
        selected ? 'scale-[1.02] shadow-lg' : 'opacity-90 hover:scale-[1.01] hover:opacity-100'
      }`}
      style={{
        background: selected ? occ.secondary : 'var(--occ-surface)',
        border: selected ? `3px solid ${occ.primary}` : '2px solid var(--occ-border)',
        boxShadow: selected ? `0 8px 24px ${occ.primary}33` : undefined,
      }}
      aria-pressed={selected}
    >
      <span className="text-3xl" role="img" aria-hidden>
        {occ.icon}
      </span>
      <span
        className="mt-2 line-clamp-2 text-sm font-bold leading-tight"
        style={{ color: selected ? occ.primary : 'var(--occ-text)' }}
      >
        {occ.label}
      </span>
      {isCustom && (
        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-70">Custom</span>
      )}
      <div className="mt-3 flex gap-1">
        <span
          className="h-3 w-3 rounded-full ring-1 ring-black/10"
          style={{ background: occ.primary }}
        />
        <span
          className="h-3 w-3 rounded-full ring-1 ring-black/10"
          style={{ background: occ.secondary }}
        />
        <span
          className="h-3 w-3 rounded-full ring-1 ring-black/10"
          style={{ background: occ.accent }}
        />
      </div>
    </button>
  );
}
