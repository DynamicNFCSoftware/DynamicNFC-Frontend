export default function Step2Track({ className = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <rect x="30" y="82" width="82" height="52" rx="8" className="fmp-svg__frame" />
      <rect x="168" y="70" width="54" height="94" rx="8" className="fmp-svg__muted" />
      <rect x="276" y="52" width="162" height="132" rx="10" className="fmp-svg__muted" />
      <rect x="294" y="72" width="124" height="20" rx="4" className="fmp-svg__frame" />
      <rect x="294" y="102" width="124" height="20" rx="4" className="fmp-svg__frame" />
      <rect x="294" y="132" width="124" height="20" rx="4" className="fmp-svg__frame" />
      <path d="M112 108 L168 108" className="fmp-svg__line fmp-svg__dash" />
      <path d="M222 108 L276 108" className="fmp-svg__line fmp-svg__dash" />
    </svg>
  );
}
