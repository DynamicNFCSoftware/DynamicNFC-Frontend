/**
 * Step 1 · Identity — Five-Minute Proof tutorial
 *
 * Composition (left → right):
 *   01·IDENTITY eyebrow · premium box with rising NFC card · concentric
 *   pulse rings · tap dot + ripple · dashed connection · editorial nameplate
 *   with persona name, role, location, timestamp, ACTIVE pip.
 *
 * Region accent flows through `--fmp-accent` (set on .fmp-card parent).
 * Card metal, gold rim, glow, particles, and brand red/blue are constant
 * across regions (brand DNA).
 *
 * Long personaNames (>14 chars, e.g. KHALID AL-RASHID, CARLOS RODRIGUEZ)
 * auto-shrink to fit the 100-wide nameplate without right-edge clipping.
 *
 * Animations are CSS-only (.fmp-s1-* classes in FiveMinuteProof.css), 7s
 * cycle, prefers-reduced-motion respected.
 */
export default function Step1Identity({
  className = "",
  personaName = "",
  projectLabel = "VISTA · 2026",
  locationLabel = "VANCOUVER · CANADA",
}) {
  const personaUpper = (personaName || "MARC PATEL").toUpperCase();
  const longName = personaUpper.length > 14;
  const nameFontSize = longName ? 11 : 13.5;
  const nameLetterSpacing = longName ? 0.6 : 1.3;

  return (
    <svg
      className={`fmp-svg fmp-s1-stage ${className}`}
      viewBox="0 0 480 240"
      role="img"
      aria-hidden="true"
      fontFamily="'Outfit', system-ui, sans-serif"
    >
      <defs>
        <linearGradient id="fmp-s1-bf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16243a" />
          <stop offset="1" stopColor="#0a1322" />
        </linearGradient>
        <linearGradient id="fmp-s1-bs" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a1322" />
          <stop offset="1" stopColor="#16243a" />
        </linearGradient>
        <pattern id="fmp-s1-linen" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="#16243a" />
          <line x1="0" y1="0" x2="3" y2="0" stroke="#0a1322" strokeWidth="0.32" />
          <line x1="0" y1="0" x2="0" y2="3" stroke="#0a1322" strokeWidth="0.32" />
          <circle cx="1.5" cy="1.5" r="0.18" fill="rgba(255,255,255,0.04)" />
        </pattern>
        <linearGradient id="fmp-s1-silk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5e8c8" />
          <stop offset="0.5" stopColor="#e9d5a8" />
          <stop offset="1" stopColor="#c8ad7c" />
        </linearGradient>
        <radialGradient id="fmp-s1-glow" cx="0.5" cy="0.4" r="0.55">
          <stop offset="0" stopColor="#fff5d6" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#f5d98a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff5d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fmp-s1-cb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2c33" />
          <stop offset="0.35" stopColor="#1a1a1f" />
          <stop offset="1" stopColor="#08080c" />
        </linearGradient>
        <radialGradient id="fmp-s1-cv" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0.55" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.45)" />
        </radialGradient>
        <pattern id="fmp-s1-brush" x="0" y="0" width="2" height="0.6" patternUnits="userSpaceOnUse">
          <rect width="2" height="0.6" fill="rgba(255,255,255,0.012)" />
          <line x1="0" y1="0" x2="2" y2="0" stroke="rgba(255,255,255,0.07)" strokeWidth="0.16" />
          <line x1="0" y1="0.3" x2="2" y2="0.3" stroke="rgba(0,0,0,0.20)" strokeWidth="0.15" />
        </pattern>
        <linearGradient id="fmp-s1-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="0.45" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="fmp-s1-holo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(197,164,103,0)" />
          <stop offset="0.3" stopColor="rgba(197,164,103,0.55)" />
          <stop offset="0.5" stopColor="rgba(245,217,138,0.85)" />
          <stop offset="0.7" stopColor="rgba(197,164,103,0.55)" />
          <stop offset="1" stopColor="rgba(197,164,103,0)" />
        </linearGradient>
        <pattern id="fmp-s1-qr" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="rgba(255,255,255,0.05)" />
          <rect x="0.2" y="0.2" width="0.7" height="0.7" fill="rgba(255,255,255,0.4)" />
          <rect x="1.1" y="1.1" width="0.7" height="0.7" fill="rgba(255,255,255,0.4)" />
          <rect x="1.1" y="0.2" width="0.5" height="0.5" fill="rgba(255,255,255,0.28)" />
        </pattern>
        <pattern id="fmp-s1-bg-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="var(--fmp-accent)" opacity="0.14" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="480" height="240" fill="transparent" />
      <rect width="480" height="240" fill="url(#fmp-s1-bg-dots)" />

      {/* Editorial corner label */}
      <g className="fmp-s1-corner" transform="translate(24, 26)">
        <line x1="0" y1="0" x2="14" y2="0" stroke="var(--fmp-brand-red)" strokeWidth="1.2" />
        <text x="0" y="14" fontSize="6" fontWeight="700" fill="var(--fmp-brand-red)" letterSpacing="2.5">
          01 · IDENTITY
        </text>
        <text x="0" y="24" fontSize="5" fontWeight="500" fill="var(--fmp-text-muted)" letterSpacing="1.5">
          FIVE-MINUTE PROOF
        </text>
      </g>

      {/* Glow + floor shadow */}
      <ellipse className="fmp-s1-glow" cx="232" cy="100" rx="138" ry="72" fill="url(#fmp-s1-glow)" />
      <ellipse cx="232" cy="222" rx="158" ry="6.5" fill="rgba(0,0,0,0.22)" />

      {/* Gold particles floating from inside box */}
      <g className="fmp-s1-particles" fill="#f5d98a" opacity="0.55">
        <circle cx="200" cy="86" r="0.8" />
        <circle cx="218" cy="74" r="0.6" />
        <circle cx="252" cy="80" r="0.7" />
        <circle cx="268" cy="90" r="0.5" />
        <circle cx="190" cy="106" r="0.5" />
        <circle cx="276" cy="108" r="0.6" />
        <circle cx="234" cy="68" r="0.4" />
        <circle cx="244" cy="118" r="0.5" />
      </g>

      {/* Box back lip + silk lining peek */}
      <path className="fmp-s1-box-back" d="M 142 158 L 322 158 L 316 152 L 148 152 Z" fill="#0a1322" />
      <path className="fmp-s1-box-lining" d="M 148 152 L 316 152 L 312 148 L 152 148 Z" fill="url(#fmp-s1-silk)" />

      {/* NFC Card — drawn BEFORE box front so card emerges from inside */}
      <g className="fmp-s1-card">
        {/* Multi-layer drop shadow */}
        <rect x="184" y="64" width="124" height="78" rx="9" fill="rgba(0,0,0,0.18)" />
        <rect x="182" y="62" width="124" height="78" rx="9" fill="rgba(0,0,0,0.22)" />

        {/* Card body — brushed black metal, credit-card aspect 1.59:1 */}
        <rect x="178" y="58" width="124" height="78" rx="9" fill="url(#fmp-s1-cb)" />
        <rect x="178" y="58" width="124" height="78" rx="9" fill="url(#fmp-s1-brush)" opacity="0.95" />
        <rect x="178" y="58" width="124" height="78" rx="9" fill="url(#fmp-s1-cv)" />
        <rect x="178" y="58" width="124" height="22" rx="9" fill="url(#fmp-s1-sheen)" />

        {/* Outer rim highlight + inner shadow */}
        <rect x="178.5" y="58.5" width="123" height="77" rx="8.5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
        <rect x="180" y="60" width="120" height="74" rx="7.5" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.3" />

        {/* Crimson edge accent (left) */}
        <rect x="178" y="60" width="2" height="74" rx="1" fill="rgba(230, 57, 70, 0.55)" />

        {/* Hologram metallic strip */}
        <rect x="186" y="88" width="108" height="0.9" fill="url(#fmp-s1-holo)" />

        {/* DynamicNFC wordmark — Comfortaa rounded sans, white */}
        <text x="190" y="80" fontFamily="'Comfortaa', 'Quicksand', sans-serif" fontWeight="700" fontSize="13" fill="#ffffff" letterSpacing="-0.4">
          DynamicNFC
        </text>

        {/* NFC wave glyph (top-right) */}
        <g transform="translate(284, 70)" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M 0 -4 Q 5 0, 0 4" />
          <path d="M 4 -7 Q 11 0, 4 7" opacity="0.85" />
          <path d="M 8 -10 Q 17 0, 8 10" opacity="0.6" />
        </g>

        {/* QR code (bottom-right) */}
        <g transform="translate(260, 96)">
          <rect x="0" y="0" width="34" height="34" rx="2.5" fill="rgba(255,255,255,0.04)" />
          <rect x="2" y="2" width="30" height="30" fill="url(#fmp-s1-qr)" />
          {/* Three position markers */}
          <rect x="2" y="2" width="7" height="7" rx="0.6" fill="#0c0c10" />
          <rect x="2.5" y="2.5" width="6" height="6" rx="0.5" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="0.9" />
          <rect x="4" y="4" width="3" height="3" fill="rgba(255,255,255,0.75)" />
          <rect x="25" y="2" width="7" height="7" rx="0.6" fill="#0c0c10" />
          <rect x="25.5" y="2.5" width="6" height="6" rx="0.5" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="0.9" />
          <rect x="27" y="4" width="3" height="3" fill="rgba(255,255,255,0.75)" />
          <rect x="2" y="25" width="7" height="7" rx="0.6" fill="#0c0c10" />
          <rect x="2.5" y="25.5" width="6" height="6" rx="0.5" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="0.9" />
          <rect x="4" y="27" width="3" height="3" fill="rgba(255,255,255,0.75)" />
          {/* Center NFC mini glyph */}
          <rect x="13" y="13" width="8" height="8" rx="1" fill="#0c0c10" />
          <g transform="translate(15.5, 17)" stroke="#ffffff" strokeWidth="0.5" fill="none" strokeLinecap="round">
            <path d="M 0 -1.5 Q 1.5 0, 0 1.5" />
            <path d="M 1.2 -2.5 Q 3.5 0, 1.2 2.5" />
          </g>
        </g>

        {/* Foil-stamp project + serial */}
        <text x="190" y="124" fontSize="4.6" fontWeight="600" fill="rgba(197, 164, 103, 0.9)" letterSpacing="2.8">
          {projectLabel}
        </text>
        <text x="190" y="131" fontFamily="'JetBrains Mono', monospace" fontSize="3.8" fontWeight="500" fill="rgba(197, 164, 103, 0.55)" letterSpacing="1.2">
          FIRST EDITION · 001
        </text>
      </g>

      {/* Box front + side (covers card bottom — emerging effect) */}
      <rect className="fmp-s1-box-front" x="142" y="158" width="180" height="60" fill="url(#fmp-s1-bf)" />
      <rect className="fmp-s1-box-front" x="142" y="158" width="180" height="60" fill="url(#fmp-s1-linen)" opacity="0.5" />
      <path className="fmp-s1-box-side" d="M 322 158 L 334 152 L 334 212 L 322 218 Z" fill="url(#fmp-s1-bs)" />

      {/* Gold rim (3-tone) */}
      <rect className="fmp-s1-box-rim" x="146" y="156" width="172" height="2.6" fill="#3a3a45" />
      <rect className="fmp-s1-box-rim" x="146" y="155.5" width="172" height="1.6" fill="#c5a467" />
      <rect className="fmp-s1-box-rim" x="146" y="155" width="172" height="0.6" fill="#f5d98a" />

      {/* Ribbon foil-stamp */}
      <line className="fmp-s1-box-mark" x1="146" y1="172" x2="318" y2="172" stroke="#c5a467" strokeWidth="0.4" opacity="0.55" />
      <line className="fmp-s1-box-mark" x1="146" y1="173.5" x2="318" y2="173.5" stroke="#9a8856" strokeWidth="0.25" opacity="0.4" />

      {/* Box mark — foil-stamp wave glyph + DynamicNFC + tagline */}
      <g className="fmp-s1-box-mark" transform="translate(232, 188)">
        <g stroke="#c5a467" strokeWidth="1.0" fill="none" strokeLinecap="round" opacity="0.9">
          <path d="M -3 -4 Q 3 0, -3 4" />
          <path d="M 1 -7 Q 8 0, 1 7" />
          <path d="M 5 -10 Q 14 0, 5 10" />
        </g>
        <text x="-8" y="20" textAnchor="middle" fontFamily="'Comfortaa', 'Quicksand', sans-serif" fontWeight="700" fontSize="6.5" fill="#c5a467" opacity="0.95" letterSpacing="0.3">
          DynamicNFC
        </text>
        <text x="-8" y="29" textAnchor="middle" fontSize="4.2" fontWeight="500" fill="#9a8856" letterSpacing="2.8" opacity="0.78">
          PREMIUM INVITATION
        </text>
      </g>

      {/* Concentric NFC pulse rings (replaces "mountain" wave arcs) */}
      <g transform="translate(294, 70)" fill="none" stroke="var(--fmp-brand-blue)" strokeWidth="1.0">
        <circle className="fmp-s1-pulse fmp-s1-pulse-1" cx="0" cy="0" r="14" />
        <circle className="fmp-s1-pulse fmp-s1-pulse-2" cx="0" cy="0" r="14" />
        <circle className="fmp-s1-pulse fmp-s1-pulse-3" cx="0" cy="0" r="14" />
      </g>

      {/* Tap dot + 2 ripple rings */}
      <circle className="fmp-s1-tap-dot" cx="290" cy="78" r="2.6" fill="var(--fmp-brand-red)" />
      <circle className="fmp-s1-tap-ring fmp-s1-tap-ring-1" cx="290" cy="78" r="5" fill="none" stroke="var(--fmp-brand-red)" strokeWidth="0.8" />
      <circle className="fmp-s1-tap-ring fmp-s1-tap-ring-2" cx="290" cy="78" r="5" fill="none" stroke="var(--fmp-brand-red)" strokeWidth="0.6" />

      {/* Connection: card NFC corner → nameplate */}
      <path
        className="fmp-s1-connect"
        d="M 312 80 Q 340 78, 354 92"
        fill="none"
        stroke="var(--fmp-accent)"
        strokeWidth="0.8"
        strokeDasharray="3 2.5"
        opacity="0.5"
      />

      {/* Nameplate — moved left (350) + lines extended to 120w for long-name fit */}
      <g transform="translate(348, 92)">
        <line className="fmp-s1-line-top" x1="0" y1="0" x2="120" y2="0" stroke="#1a1a1f" strokeWidth="0.9" />
        <text
          className="fmp-s1-name"
          x="60"
          y="20"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize={nameFontSize}
          fill="#1a1a1f"
          letterSpacing={nameLetterSpacing}
        >
          {personaUpper}
        </text>
        <text className="fmp-s1-role" x="60" y="34" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="var(--fmp-accent)" letterSpacing="2">
          VIP · INVESTOR
        </text>
        <line className="fmp-s1-line-bot" x1="0" y1="42" x2="120" y2="42" stroke="#1a1a1f" strokeWidth="0.9" />
        <text className="fmp-s1-loc" x="60" y="55" textAnchor="middle" fontSize="5.5" fontWeight="500" fill="var(--fmp-text-muted)" letterSpacing="1.5">
          {locationLabel}
        </text>

        {/* Editorial timestamp + ACTIVE pip */}
        <g transform="translate(8, 70)">
          <circle className="fmp-s1-pip" cx="3" cy="-2" r="2" fill="#10b981" />
          <text className="fmp-s1-ts" x="9" y="1" fontFamily="'JetBrains Mono', monospace" fontSize="5.2" fill="#5a5f68" letterSpacing="1">
            TAP REGISTERED · 00:00.4
          </text>
        </g>
      </g>
    </svg>
  );
}
