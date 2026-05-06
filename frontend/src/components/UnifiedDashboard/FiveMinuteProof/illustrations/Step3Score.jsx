export default function Step3Score({ className = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <rect x="92" y="46" width="286" height="150" rx="14" className="fmp-svg__muted" />
      <rect x="118" y="76" width="234" height="24" rx="5" className="fmp-svg__frame" />
      <rect x="118" y="108" width="234" height="24" rx="5" className="fmp-svg__frame" />
      <rect x="118" y="140" width="234" height="24" rx="5" fill="var(--fmp-accent)" opacity="0.2" />
      <rect x="302" y="136" width="58" height="30" rx="15" className="fmp-svg__accent fmp-svg__pulse" />
      <text x="331" y="156" textAnchor="middle" fontSize="13" fill="#fff">82</text>
    </svg>
  );
}
