import { OCCASION_LIST } from '../../config/occasionThemes';

/**
 * Clickable occasion cards — updates parent selection without page reload.
 */
export default function OccasionSelector({ selectedId, onSelect }) {
  return (
    <section className="occasion-surface rounded-2xl p-4 md:p-6" aria-label="Choose your occasion">
      <h2 className="font-display text-lg font-bold md:text-xl" style={{ color: 'var(--occ-text)' }}>
        What are we celebrating?
      </h2>
      <p className="occasion-vibe mt-1 text-sm">Tap an occasion — your page theme updates instantly</p>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-4">
        {OCCASION_LIST.map((occ) => {
          const selected = selectedId === occ.id;
          return (
            <button
              key={occ.id}
              type="button"
              onClick={() => onSelect(occ.id)}
              className={`occasion-card flex min-w-[140px] shrink-0 flex-col items-center rounded-2xl p-4 text-center transition-all duration-300 md:min-w-0 ${
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
                className="mt-2 text-sm font-bold leading-tight"
                style={{ color: selected ? occ.primary : 'var(--occ-text)' }}
              >
                {occ.label}
              </span>
              <div className="mt-3 flex gap-1">
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ background: occ.primary }}
                  title="Primary"
                />
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ background: occ.secondary }}
                  title="Secondary"
                />
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ background: occ.accent }}
                  title="Accent"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
