export default function Step1Identity({ className = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <rect x="24" y="26" width="132" height="168" rx="14" className="fmp-svg__muted" />
      <rect x="45" y="58" width="92" height="58" rx="8" className="fmp-svg__frame" />
      <circle cx="306" cy="85" r="22" className="fmp-svg__muted" />
      <path d="M262 146 C275 120 336 120 349 146 L349 170 L262 170 Z" className="fmp-svg__muted" />
      <path d="M146 88 Q194 88 238 102 Q274 113 292 132" className="fmp-svg__line fmp-svg__dash" />
      <path d="M136 84 Q188 70 246 72" className="fmp-svg__line fmp-svg__pulse" />
      <path d="M136 100 Q188 114 246 116" className="fmp-svg__line fmp-svg__pulse" />
    </svg>
  );
}
