export default function Step3Score({ className = "", personaName = "" }) {
  return (
    <svg className={`fmp-svg ${className}`} viewBox="0 0 480 240" role="img" aria-hidden="true">
      <g>
        <text x="60" y="44" fontFamily="monospace" fontSize="9" letterSpacing="1.4" fill="var(--fmp-text-muted)">VELOCITY</text>
        <rect x="70" y="52" width="16" height="130" rx="8" fill="#fff" stroke="var(--fmp-text-muted)" />
        <rect x="72.5" y="56" width="11" height="36" rx="5.5" fill="var(--fmp-brand-red)" />
        <rect x="72.5" y="94" width="11" height="40" rx="5.5" fill="var(--fmp-accent)" />
        <rect x="72.5" y="136" width="11" height="42" rx="5.5" fill="var(--fmp-text-muted)" fillOpacity="0.35" />
      </g>

      <g>
        <rect x="102" y="42" width="316" height="156" rx="14" fill="#fff" stroke="var(--fmp-brand-blue)" strokeWidth="1.8" />
        <path d="M114 62 H406" stroke="var(--fmp-accent)" strokeOpacity="0.35" strokeWidth="1.2" />
        <text x="390" y="58" textAnchor="end" fontFamily="monospace" fontSize="8" fill="var(--fmp-text-muted)">HOT / WARM / COLD</text>

        <rect x="120" y="68" width="280" height="34" rx="10" fill="rgba(230,57,70,0.08)" stroke="var(--fmp-accent)" />
        <circle cx="138" cy="85" r="6" fill="var(--fmp-brand-red)" />
        <text x="152" y="89" fontSize="11" fill="var(--fmp-text-primary)">{personaName || "Marc Patel"}</text>
        <rect x="354" y="74" width="34" height="22" rx="11" fill="var(--fmp-brand-red)" className="fmp-svg__pulse" />
        <text x="371" y="89" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#fff">82</text>

        <rect x="120" y="110" width="280" height="34" rx="10" fill="rgba(0,0,0,0.02)" stroke="var(--fmp-accent)" strokeOpacity="0.6" />
        <circle cx="138" cy="127" r="6" fill="#d9a441" />
        <text x="152" y="131" fontSize="11" fill="var(--fmp-text-primary)">Sarah Chen</text>
        <rect x="354" y="116" width="34" height="22" rx="11" fill="#e2c46d" />
        <text x="371" y="131" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#1a1a1f">54</text>

        <rect x="120" y="152" width="280" height="34" rx="10" fill="rgba(0,0,0,0.02)" stroke="var(--fmp-accent)" strokeOpacity="0.45" />
        <circle cx="138" cy="169" r="6" fill="#9ca3af" />
        <text x="152" y="173" fontSize="11" fill="var(--fmp-text-primary)">Tom Lee</text>
        <rect x="354" y="158" width="34" height="22" rx="11" fill="#d1d5db" />
        <text x="371" y="173" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#1a1a1f">38</text>
      </g>

      <path d="M98 126 L108 126 L108 118 L120 128 L108 138 L108 130 L98 130 Z" fill="var(--fmp-accent)" className="fmp-svg__pulse" />
      <path d="M330 70 L342 70" stroke="var(--fmp-brand-blue)" strokeWidth="1.5" />
      <path d="M330 182 L342 182" stroke="var(--fmp-brand-blue)" strokeWidth="1.5" />
    </svg>
  );
}
