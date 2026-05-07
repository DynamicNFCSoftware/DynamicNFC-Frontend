export default function Step2Track({ className = "", personaName: _personaName = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <defs>
        <symbol id="fmp-nfc-card-mark-step2" viewBox="0 0 24 16">
          <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" fill="#fff" stroke="var(--fmp-brand-blue)" strokeWidth="1" />
          <text x="2.8" y="10.8" fontFamily="monospace" fontSize="5.5" fill="var(--fmp-text-primary)">Dynamic</text>
          <text x="14" y="10.8" fontFamily="monospace" fontSize="5.8" fontWeight="700" fill="var(--fmp-brand-red)">NFC</text>
        </symbol>
      </defs>

      <g>
        <rect x="56" y="54" width="72" height="130" rx="16" fill="#fff" stroke="var(--fmp-text-muted)" strokeWidth="1.8" />
        <rect x="84" y="62" width="16" height="4" rx="2" fill="var(--fmp-text-muted)" />
        <rect x="68" y="84" width="48" height="4" rx="2" fill="var(--fmp-accent)" />
        <text x="68" y="100" fontFamily="monospace" fontSize="8" fill="var(--fmp-text-muted)">FLOOR PLAN</text>
        <rect x="68" y="114" width="38" height="4" rx="2" fill="var(--fmp-accent)" fillOpacity="0.6" />
        <text x="68" y="130" fontFamily="monospace" fontSize="8" fill="var(--fmp-text-muted)">BROCHURE</text>
        <rect x="68" y="144" width="44" height="4" rx="2" fill="var(--fmp-accent)" fillOpacity="0.6" />
        <text x="68" y="160" fontFamily="monospace" fontSize="8" fill="var(--fmp-text-muted)">PAYMENT PLAN</text>
      </g>

      <g fill="none" strokeWidth="2.2" strokeLinecap="round">
        <path d="M132 86 C172 72 205 72 240 86" stroke="var(--fmp-brand-blue)" className="fmp-svg__pulse-flow" />
        <path d="M132 118 C176 112 210 112 240 118" stroke="var(--fmp-accent)" className="fmp-svg__pulse-flow" />
        <path d="M132 150 C178 154 210 154 240 150" stroke="var(--fmp-brand-red)" className="fmp-svg__pulse-flow" />
      </g>

      <g>
        <rect x="240" y="44" width="210" height="150" rx="14" fill="#fff" stroke="var(--fmp-brand-blue)" strokeWidth="1.8" />
        <rect x="256" y="74" width="178" height="30" rx="8" fill="rgba(0,0,0,0.02)" stroke="var(--fmp-accent)" strokeWidth="1" />
        <rect x="256" y="112" width="178" height="30" rx="8" fill="rgba(0,0,0,0.02)" stroke="var(--fmp-accent)" strokeWidth="1" />
        <rect x="256" y="150" width="178" height="30" rx="8" fill="rgba(0,0,0,0.02)" stroke="var(--fmp-accent)" strokeWidth="1" />

        <circle cx="270" cy="89" r="4" fill="var(--fmp-brand-blue)" className="fmp-svg__pulse" />
        <text x="282" y="92" fontFamily="monospace" fontSize="9" fill="var(--fmp-text-primary)">VIEW · 2s ago</text>
        <circle cx="270" cy="127" r="4" fill="var(--fmp-accent)" className="fmp-svg__pulse" />
        <text x="282" y="130" fontFamily="monospace" fontSize="9" fill="var(--fmp-text-primary)">DOWNLOAD · 14s</text>
        <circle cx="270" cy="165" r="4" fill="var(--fmp-brand-red)" className="fmp-svg__pulse" />
        <text x="282" y="168" fontFamily="monospace" fontSize="9" fill="var(--fmp-text-primary)">CLICK · just now</text>
      </g>

      <use href="#fmp-nfc-card-mark-step2" x="414" y="52" width="24" height="16" />
    </svg>
  );
}
