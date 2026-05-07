export default function Step1Identity({ className = "", personaName = "" }) {
  const personaLabel = personaName ? `${personaName.toUpperCase()} · VIP` : "";

  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="fmp-grad-card-step1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--fmp-brand-blue)" />
          <stop offset="100%" stopColor="var(--fmp-brand-red)" />
        </linearGradient>
        <symbol id="fmp-nfc-card-mark-step1" viewBox="0 0 24 16">
          <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" fill="#fff" stroke="var(--fmp-brand-blue)" strokeWidth="1" />
          <text x="2.8" y="10.8" fontFamily="monospace" fontSize="5.5" fill="var(--fmp-text-primary)">Dynamic</text>
          <text x="14" y="10.8" fontFamily="monospace" fontSize="5.8" fontWeight="700" fill="var(--fmp-brand-red)">NFC</text>
        </symbol>
      </defs>

      <g>
        <path d="M58 196 V64 H186 V196" fill="none" stroke="var(--fmp-accent)" strokeWidth="2" />
        <path d="M58 64 L122 36 L186 64" fill="none" stroke="var(--fmp-accent)" strokeWidth="2" />
        <path d="M122 36 V196" fill="none" stroke="var(--fmp-accent)" strokeWidth="1.5" opacity="0.45" />
      </g>

      <g>
        <rect x="88" y="82" width="92" height="56" rx="10" fill="#fff" stroke="url(#fmp-grad-card-step1)" strokeWidth="2" />
        <text x="98" y="105" fontFamily="monospace" fontSize="12" fill="var(--fmp-text-primary)">Dynamic</text>
        <text x="148" y="105" fontFamily="monospace" fontSize="12" fontWeight="700" fill="var(--fmp-brand-red)">NFC</text>
        <path d="M162 92 Q170 98 170 106" fill="none" stroke="var(--fmp-brand-blue)" strokeWidth="1.2" />
        <path d="M166 90 Q176 98 176 108" fill="none" stroke="var(--fmp-brand-blue)" strokeWidth="1.2" />
        <path d="M170 88 Q182 98 182 110" fill="none" stroke="var(--fmp-brand-blue)" strokeWidth="1.2" />
      </g>

      <g>
        <path d="M186 106 Q248 80 308 104" fill="none" stroke="var(--fmp-brand-blue)" strokeWidth="2" className="fmp-svg__pulse" />
        <path d="M186 112 Q252 96 314 118" fill="none" stroke="var(--fmp-accent)" strokeWidth="2" className="fmp-svg__pulse" />
        <path d="M186 118 Q254 112 320 134" fill="none" stroke="var(--fmp-brand-red)" strokeWidth="2" className="fmp-svg__pulse" />
      </g>

      <g>
        <path d="M176 74 C183 66 194 66 198 74 C193 76 188 80 184 84 C181 81 179 78 176 74 Z" fill="var(--fmp-accent)" opacity="0.3" />
        <path d="M198 74 C204 78 205 86 199 90 C195 87 190 84 184 84 C188 80 193 76 198 74 Z" fill="var(--fmp-accent)" opacity="0.45" />
        <circle cx="184" cy="84" r="4" fill="var(--fmp-accent)" className="fmp-svg__pulse" />
      </g>

      <g>
        <circle cx="368" cy="110" r="20" fill="rgba(0,0,0,0.04)" stroke="var(--fmp-text-muted)" strokeWidth="1.8" />
        <path d="M326 170 C334 140 402 140 410 170 L410 188 L326 188 Z" fill="rgba(0,0,0,0.04)" stroke="var(--fmp-text-muted)" strokeWidth="1.8" />
        {personaLabel && (
          <>
            <rect x="322" y="196" width="94" height="22" rx="11" fill="var(--fmp-accent)" fillOpacity="0.12" stroke="var(--fmp-accent)" />
            <text x="369" y="210" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="var(--fmp-text-primary)">
              {personaLabel}
            </text>
          </>
        )}
      </g>

      <use href="#fmp-nfc-card-mark-step1" x="150" y="154" width="24" height="16" />
    </svg>
  );
}
