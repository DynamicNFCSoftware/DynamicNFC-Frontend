export default function Step4Alert({ className = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <path d="M190 145 H290 L278 180 H202 Z" className="fmp-svg__muted" />
      <path d="M206 145 V115 C206 96 220 82 240 82 C260 82 274 96 274 115 V145" className="fmp-svg__frame" />
      <circle cx="275" cy="88" r="10" className="fmp-svg__alert fmp-svg__pulse" />
      <rect x="318" y="74" width="130" height="90" rx="10" className="fmp-svg__muted" />
      <rect x="332" y="92" width="96" height="8" rx="4" className="fmp-svg__frame" />
      <rect x="332" y="112" width="110" height="8" rx="4" className="fmp-svg__frame" />
      <rect x="332" y="132" width="86" height="8" rx="4" className="fmp-svg__frame" />
      <path d="M286 118 L318 118" className="fmp-svg__line fmp-svg__dash" />
    </svg>
  );
}
