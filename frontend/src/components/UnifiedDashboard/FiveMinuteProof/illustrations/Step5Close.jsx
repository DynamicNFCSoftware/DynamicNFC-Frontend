export default function Step5Close({ className = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <circle cx="148" cy="88" r="18" className="fmp-svg__muted" />
      <path d="M115 145 C122 120 174 120 181 145 L181 165 L115 165 Z" className="fmp-svg__muted" />
      <circle cx="332" cy="88" r="18" className="fmp-svg__muted" />
      <path d="M299 145 C306 120 358 120 365 145 L365 165 L299 165 Z" className="fmp-svg__muted" />
      <path d="M182 118 H298" className="fmp-svg__line fmp-svg__dash" />
      <rect x="217" y="96" width="46" height="28" rx="6" className="fmp-svg__accent" />
      <path d="M228 111 L236 118 L251 102" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="198" y="148" width="84" height="28" rx="14" className="fmp-svg__muted" />
      <rect x="214" y="160" width="52" height="4" rx="2" className="fmp-svg__frame" />
    </svg>
  );
}
