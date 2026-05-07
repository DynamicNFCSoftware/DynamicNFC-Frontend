export default function Step4Alert({ className = "", personaName = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <defs>
        <filter id="fmp-card-shadow-step4" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(26,26,31,0.2)" />
        </filter>
        <symbol id="fmp-nfc-card-mark-step4" viewBox="0 0 24 16">
          <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" fill="#fff" stroke="var(--fmp-brand-blue)" strokeWidth="1" />
          <text x="2.8" y="10.8" fontFamily="monospace" fontSize="5.5" fill="var(--fmp-text-primary)">Dynamic</text>
          <text x="14" y="10.8" fontFamily="monospace" fontSize="5.8" fontWeight="700" fill="var(--fmp-brand-red)">NFC</text>
        </symbol>
      </defs>

      <g>
        <path d="M116 174 H164 C173 174 180 167 180 158 C180 149 173 142 164 142 H116 C107 142 100 149 100 158 C100 167 107 174 116 174 Z" fill="var(--fmp-accent)" fillOpacity="0.12" stroke="var(--fmp-accent)" strokeWidth="2" />
        <path d="M110 142 V114 C110 90 124 74 140 74 C156 74 170 90 170 114 V142" fill="rgba(0,0,0,0.03)" stroke="var(--fmp-accent)" strokeWidth="2" />
        <circle cx="140" cy="182" r="6" fill="var(--fmp-accent)" />
        <circle cx="174" cy="78" r="8" fill="var(--fmp-brand-red)" className="fmp-svg__pulse" />
        <circle cx="174" cy="78" r="14" fill="none" stroke="var(--fmp-brand-red)" strokeOpacity="0.3" className="fmp-svg__pulse" />
      </g>

      <path d="M186 124 C212 120 226 118 240 118" fill="none" stroke="var(--fmp-accent)" strokeWidth="2" className="fmp-svg__pulse-flow" />

      <g filter="url(#fmp-card-shadow-step4)">
        <rect x="240" y="58" width="220" height="120" rx="12" fill="#fff" stroke="var(--fmp-accent)" strokeWidth="1.5" />
        <rect x="252" y="70" width="196" height="18" rx="6" fill="var(--fmp-accent)" className="fmp-svg__pulse" />
        <path d="M260 79 C260 76 262 74 265 74 C268 74 270 76 270 79 V83 H260 Z" fill="none" stroke="#fff" strokeWidth="1.2" />
        <circle cx="265" cy="84.5" r="1.8" fill="#fff" />
        <text x="276" y="82.5" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#fff">HOT LEAD</text>
        <text x="254" y="107" fontSize="12" fontWeight="600" fill="var(--fmp-text-primary)">{personaName || "Khalid Al-Rashid"}</text>
        <text x="254" y="128" fontSize="10" fill="var(--fmp-text-muted)">viewed Penthouse 4B</text>
        <path d="M254 134 H446" stroke="var(--fmp-accent)" strokeOpacity="0.25" />
        <text x="438" y="145" textAnchor="end" fontFamily="monospace" fontSize="9" fill="var(--fmp-text-muted)">2 min ago</text>
      </g>

      <use href="#fmp-nfc-card-mark-step4" x="430" y="158" width="20" height="12" />
    </svg>
  );
}
