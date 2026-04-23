import React from 'react';

const FEATS = [
  { icon: 'nfc', k1: 'feat1', k2: 'feat1d' },
  { icon: 'material', k1: 'feat2', k2: 'feat2d' },
  { icon: 'maple', k1: 'feat3', k2: 'feat3d' },
  { icon: 'phone', k1: 'feat4', k2: 'feat4d' },
];

const icons = {
  nfc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
      <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" />
    </svg>
  ),
  material: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  maple: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  ),
};

export function FeatureGrid({ t }) {
  return (
    <section className="oc-features">
      {FEATS.map((f, i) => (
        <div
          className="oc-feat"
          key={i}
          style={{ animationDelay: `${0.85 + i * 0.1}s` }}
        >
          <div className={`oc-feat-icon oc-feat-icon-${f.icon}`}>
            {icons[f.icon]}
          </div>
          <h4>{t(f.k1)}</h4>
          <p>{t(f.k2)}</p>
        </div>
      ))}
    </section>
  );
}
