export default function Step5Close({ className = "", personaName = "" }) {
  const leftLabel = personaName ? `${personaName.toUpperCase()} · VIP` : "VIP · INVESTOR";

  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <defs>
        <symbol id="fmp-nfc-card-mark-step5" viewBox="0 0 24 16">
          <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" fill="#fff" stroke="var(--fmp-brand-blue)" strokeWidth="1" />
          <text x="2.8" y="10.8" fontFamily="monospace" fontSize="5.5" fill="var(--fmp-text-primary)">Dynamic</text>
          <text x="14" y="10.8" fontFamily="monospace" fontSize="5.8" fontWeight="700" fill="var(--fmp-brand-red)">NFC</text>
        </symbol>
      </defs>

      <g>
        <circle cx="98" cy="92" r="18" fill="rgba(0,0,0,0.04)" stroke="var(--fmp-text-muted)" strokeWidth="1.8" />
        <path d="M64 148 C70 124 126 124 132 148 L132 172 L64 172 Z" fill="rgba(0,0,0,0.04)" stroke="var(--fmp-text-muted)" strokeWidth="1.8" />
        <rect x="44" y="184" width="110" height="20" rx="10" fill="var(--fmp-accent)" fillOpacity="0.12" stroke="var(--fmp-accent)" />
        <text x="99" y="197" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fmp-text-primary)">{leftLabel}</text>
      </g>

      <g>
        <circle cx="382" cy="92" r="18" fill="rgba(0,0,0,0.04)" stroke="var(--fmp-brand-blue)" strokeWidth="1.8" />
        <path d="M348 148 C354 124 410 124 416 148 L416 172 L348 172 Z" fill="rgba(0,0,0,0.04)" stroke="var(--fmp-brand-blue)" strokeWidth="1.8" />
        <path d="M392 90 L401 80" stroke="var(--fmp-brand-blue)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="403.5" cy="78" r="2.5" fill="var(--fmp-brand-red)" />
        <rect x="342" y="184" width="80" height="20" rx="10" fill="#eef4fb" stroke="var(--fmp-brand-blue)" />
        <text x="382" y="197" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fmp-text-primary)">YOUR REP</text>
      </g>

      <path d="M134 124 C190 108 290 108 346 124" fill="none" stroke="var(--fmp-brand-blue)" strokeWidth="2.5" />

      <g>
        <rect x="214" y="98" width="52" height="52" rx="8" fill="#fff" stroke="var(--fmp-text-muted)" />
        <rect x="214" y="98" width="52" height="14" rx="8" fill="var(--fmp-brand-red)" />
        <text x="240" y="108" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff">MAY</text>
        <text x="240" y="134" textAnchor="middle" fontSize="22" fill="var(--fmp-text-primary)">07</text>
        <circle cx="227" cy="143" r="4" fill="none" stroke="var(--fmp-brand-blue)" strokeWidth="1.2" />
        <path d="M227 143 L227 140 M227 143 L230 144.5" stroke="var(--fmp-brand-blue)" strokeWidth="1.1" strokeLinecap="round" />
        <text x="236" y="146" fontFamily="monospace" fontSize="8" fill="var(--fmp-text-muted)">14:00</text>
      </g>

      <rect x="160" y="206" width="160" height="24" rx="12" fill="var(--fmp-accent)" className="fmp-svg__pulse" />
      <text x="240" y="221" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#fff">BOOKED · TOMORROW 14:00</text>

      <circle cx="218" cy="78" r="4" fill="var(--fmp-accent)" />
      <rect x="245" y="72" width="7" height="7" fill="var(--fmp-brand-red)" transform="rotate(12 248.5 75.5)" />
      <path d="M270 82 L278 82 L274 74 Z" fill="var(--fmp-accent)" />

      <use href="#fmp-nfc-card-mark-step5" x="440" y="214" width="24" height="16" />
    </svg>
  );
}
