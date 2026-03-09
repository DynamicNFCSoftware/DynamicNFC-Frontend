import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/css/enterprise-light.css";

/* ── Card catalogue with material texture classes ── */
const CARD_TYPES = [
  {
    id: "white",
    name: "White Digital Business Card",
    shortName: "White",
    material: "PVC",
    materialClass: "mat-pvc-white",
    textColor: "#1a1a1f",
    nfcColor: "#457b9d",
    qrStyle: "dark",
  },
  {
    id: "black",
    name: "Black Digital Business Card",
    shortName: "Black",
    material: "PVC",
    materialClass: "mat-pvc-black",
    textColor: "#ffffff",
    nfcColor: "#6ba3c7",
    qrStyle: "light",
  },
  {
    id: "golden",
    name: "Golden Digital Business Card",
    shortName: "Golden",
    material: "PVC",
    materialClass: "mat-pvc-golden",
    textColor: "#2a1f00",
    nfcColor: "#5a4400",
    qrStyle: "dark",
  },
  {
    id: "silver",
    name: "Silver Digital Business Card",
    shortName: "Silver",
    material: "PVC",
    materialClass: "mat-pvc-silver",
    textColor: "#1a1a1f",
    nfcColor: "#555",
    qrStyle: "dark",
  },
  {
    id: "metal-golden",
    name: "Metal Golden Digital Business Card",
    shortName: "Metal Gold",
    material: "Metal",
    materialClass: "mat-metal-gold",
    textColor: "#2a1f00",
    nfcColor: "#5a4400",
    qrStyle: "dark",
  },
  {
    id: "metal-silver",
    name: "Metal Silver Digital Business Card",
    shortName: "Metal Silver",
    material: "Metal",
    materialClass: "mat-metal-silver",
    textColor: "#1a1a1f",
    nfcColor: "#555",
    qrStyle: "dark",
  },
  {
    id: "metal-black",
    name: "Metal Black Digital Business Card",
    shortName: "Metal Black",
    material: "Metal",
    materialClass: "mat-metal-black",
    textColor: "#e8e8e8",
    nfcColor: "#888",
    qrStyle: "light",
  },
  {
    id: "metal-rosegold",
    name: "Metal Rose Gold Digital Business Card",
    shortName: "Rose Gold",
    material: "Metal",
    materialClass: "mat-metal-rosegold",
    textColor: "#3d1f14",
    nfcColor: "#6b3a28",
    qrStyle: "dark",
  },
  {
    id: "24k-gold",
    name: "24K Gold Digital Business Card",
    shortName: "24K Gold",
    material: "Metal",
    materialClass: "mat-metal-24k",
    textColor: "#3d2e00",
    nfcColor: "#6b5200",
    qrStyle: "dark",
  },
  {
    id: "bambu",
    name: "Bambu Digital Business Card",
    shortName: "Bamboo",
    material: "Eco",
    materialClass: "mat-eco-bamboo",
    textColor: "#2e1f05",
    nfcColor: "#5a4000",
    qrStyle: "dark",
  },
  {
    id: "wooden",
    name: "Wooden Digital Business Card",
    shortName: "Walnut",
    material: "Eco",
    materialClass: "mat-eco-wood",
    textColor: "#f5e6d0",
    nfcColor: "#c8a870",
    qrStyle: "light",
  },
  {
    id: "transparent",
    name: "Transparent PVC Digital Business Card",
    shortName: "Transparent",
    material: "PVC",
    materialClass: "mat-pvc-transparent",
    textColor: "#1a1a1f",
    nfcColor: "#666",
    qrStyle: "dark",
  },
];

/* Material groups for segmented display */
const MATERIAL_GROUPS = [
  { key: "PVC", label: "PVC" },
  { key: "Metal", label: "Metal" },
  { key: "Eco", label: "Eco" },
];

/* URL validator */
function isValidUrl(str) {
  if (!str || !str.trim()) return false;
  try {
    const url = new URL(str.startsWith("http") ? str : `https://${str}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export default function CreatePhysicalCard() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const card = state?.card;
  const [fullName, setFullName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [qrTouched, setQrTouched] = useState(false);
  const [selectedCard, setSelectedCard] = useState(CARD_TYPES[0]);
  const [activeMaterial, setActiveMaterial] = useState("PVC");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const urlValid = isValidUrl(qrUrl);
  const showUrlError = qrTouched && qrUrl.trim().length > 0 && !urlValid;

  const normalizedUrl =
    urlValid && qrUrl.trim()
      ? qrUrl.trim().startsWith("http")
        ? qrUrl.trim()
        : `https://${qrUrl.trim()}`
      : null;

  const qrImageUrl = normalizedUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=${
        selectedCard.qrStyle === "light" ? "fff" : "000"
      }&bgcolor=${
        selectedCard.qrStyle === "light" ? "00000000" : "ffffff00"
      }&data=${encodeURIComponent(normalizedUrl)}`
    : null;
<span className="qr-leaf">
  <span className="qr-leaf-bg">
    <svg viewBox="0 0 24 24" className="qr-leaf-icon">
      <path
        d="M12 2l1.2 3.8 3.6-1.4-2 3.4 3.8.3-2.9 2.3 2.7 1.4-3.5.9 1 3.6-3-2L12 22l-1.9-4.1-3 2 1-3.6-3.5-.9 2.7-1.4-2.9-2.3 3.8-.3-2-3.4 3.6 1.4L12 2z"
        fill="#c1121f"
      />
    </svg>
  </span>
</span>

  /* When selecting a card, also update the active material tab */
  const handleSelectCard = (ct) => {
    setSelectedCard(ct);
    setActiveMaterial(ct.material);
  };

  /* Filtered cards by active material */
  const filteredCards = CARD_TYPES.filter((c) => c.material === activeMaterial);

  // Particles
  useEffect(() => {
    const container = document.getElementById("el-particles");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement("div");
      dot.className = "particle";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.top = Math.random() * 100 + "%";
      dot.style.animationDelay = Math.random() * 12 + "s";
      dot.style.animationDuration = 14 + Math.random() * 8 + "s";
      container.appendChild(dot);
    }
  }, []);

  return (
    <div className="enterprise-light">
      <div className="bg-mesh" />
      <div className="particles" id="el-particles" />

      {/* ── Navbar ── */}
      <nav className="nav-bar">
        <div className="nav-container">
          <Link to="/" className="logo">DynamicNFC</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/enterprise">Enterprise</Link>
            <Link to="/nfc-cards">NFC Cards</Link>
            {isAuthenticated && isAuthenticated() && (
              <Link to="/dashboard">Dashboard</Link>
            )}
            {isAuthenticated && isAuthenticated() ? (
              <button onClick={handleLogout} className="nav-btn">Logout</button>
            ) : (
              <Link to="/login" className="nav-btn">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="enterprise-content">
        {/* ── Header ── */}
        <div className="page-header">
          <span className="badge">Create Your Card</span>
          <h1>Design Your NFC Card</h1>
          <p>Choose your card material and style, then personalize with your name, logo, and QR link.</p>
        </div>

        {/* ═══ LUXURY CARD SELECTOR ═══ */}
        <section className="lux-selector">
          {/* Section title */}
          <div className="lux-selector-header">
            <div className="lux-line" />
            <h2 className="lux-title">Choose Your Card</h2>
            <div className="lux-line" />
          </div>

          {/* Material tabs */}
          <div className="lux-material-tabs">
            {MATERIAL_GROUPS.map((g) => (
              <button
                key={g.key}
                type="button"
                className={`lux-mat-tab${activeMaterial === g.key ? " active" : ""}`}
                onClick={() => setActiveMaterial(g.key)}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Card chips for active material */}
          <div className="lux-card-options">
            {filteredCards.map((ct) => (
              <button
                key={ct.id}
                type="button"
                className={`lux-card-chip${selectedCard.id === ct.id ? " selected" : ""}`}
                onClick={() => handleSelectCard(ct)}
              >
                <span className={`lux-swatch ${ct.materialClass}`} />
                <span className="lux-chip-name">{ct.shortName}</span>
                {ct.material !== "PVC" && (
                  <span className={`lux-chip-badge ${ct.material === "Metal" ? "badge-metal" : "badge-eco"}`}>
                    {ct.material}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Selected name */}
          <div className="lux-selected-name">{selectedCard.name}</div>
        </section>

        {/* ═══ CARD PREVIEW — hover to flip ═══ */}
        <div className="card-showcase">
          <div className="card-flipper-hover">
            {/* FRONT */}
            <div className={`card-face card-front ${selectedCard.materialClass}`}>
              {card?.tertemiz && (
                <img src={card.tertemiz} alt={card?.title || ""} className="card-bg" />
              )}

              {/* Logo — top-left */}
              <div className="card-logo-area">
                {logoPreview ? (
                  <img src={logoPreview} alt="Your logo" className="card-logo" />
                ) : (
                  <div
                    className="card-logo-placeholder"
                    style={{
                      borderColor: selectedCard.textColor + "30",
                      color: selectedCard.textColor + "80",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span>Your Logo</span>
                  </div>
                )}
              </div>

              {/* NFC */}
              <div className="card-nfc-icon" style={{ color: selectedCard.nfcColor }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
                  <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                  <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                  <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" />
                </svg>
              </div>

              {/* Bottom bar */}
              <div className="card-bottom-bar">
                <div className="card-name" style={{ color: selectedCard.textColor }}>
                  {fullName || "Name Surname"}
                </div>
                {qrImageUrl ? (
                  <img src={qrImageUrl} alt="QR Code" className="card-qr" />
                ) : (
                  <div
                    className="card-qr-placeholder"
                    style={{
                      borderColor: selectedCard.textColor + "25",
                      color: selectedCard.textColor + "30",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="34" height="34">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="3" height="3" />
                      <rect x="18" y="14" width="3" height="3" />
                      <rect x="14" y="18" width="3" height="3" />
                      <rect x="18" y="18" width="3" height="3" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* BACK — same material, user logo */}
            <div className={`card-face card-back ${selectedCard.materialClass}`}>
              <div className="card-back-content">
                {logoPreview ? (
                  <img src={logoPreview} alt="Your logo" className="card-back-user-logo" />
                ) : (
                  <div className="card-back-empty" style={{ color: selectedCard.textColor + "50" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="44" height="44">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span>Upload a logo to see it here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="preview-label">Hover over card to see back side</div>
        </div>

        {/* ═══ Form ═══ */}
        <div className="card-form-centered">
          <div className="card-form">
            <h2>Card Details</h2>
            <p className="form-subtitle">
              Enter your information below. Your card will be printed and shipped with NFC &amp; QR enabled.
            </p>

            {/* Selected card info */}
            <div className="selected-info-row">
              <span className={`info-swatch ${selectedCard.materialClass}`} />
              <div>
                <strong>{selectedCard.name}</strong>
                <span className="info-material">{selectedCard.material} • NFC + QR</span>
              </div>
            </div>

            <hr className="form-divider" />

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
              />
              <span className="form-hint">Will appear on the front of the card.</span>
            </div>

            <hr className="form-divider" />

            {/* Logo */}
            <div className="form-group">
              <label>Upload Logo</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,application/pdf"
                  onChange={handleLogoChange}
                />
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div className="upload-text">
                  <strong>Click to upload</strong> or drag &amp; drop
                </div>
              </div>
              <span className="form-hint">Formats: SVG, PNG, JPG, PDF — appears on both sides.</span>
            </div>

            <hr className="form-divider" />

            {/* QR URL */}
            <div className="form-group">
              <label htmlFor="qrUrl">
                QR Code Link
                <span className="label-optional"> (your website or profile)</span>
              </label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <input
                  id="qrUrl"
                  type="text"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  onBlur={() => setQrTouched(true)}
                  placeholder="https://yourwebsite.com"
                  className={`has-icon${showUrlError ? " input-error" : ""}${urlValid ? " input-valid" : ""}`}
                />
                {qrUrl.trim().length > 0 && (
                  <span className={`input-status ${urlValid ? "valid" : "invalid"}`}>
                    {urlValid ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </span>
                )}
              </div>
              {showUrlError ? (
                <span className="form-hint form-error">Please enter a valid web link (e.g. https://yourwebsite.com)</span>
              ) : (
                <span className="form-hint">This URL will be encoded as a QR code on your card.</span>
              )}
            </div>

            <button className="primary-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Continue
            </button>
          </div>
        </div>

        {/* ═══ Info Strip ═══ */}
        <div className="info-strip">
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            Free Shipping
          </div>
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            QR Included
          </div>
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8"/></svg>
            NFC Enabled
          </div>
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            No App Required
          </div>
        </div>

        {/* ═══ About Product ═══ */}
        <section className="about-product">
          <div className="section-divider"><span>About Product</span></div>
          <h2 className="about-title">DynamicNFC Digital Business Card with Durable and Prestigious Representation</h2>
          <div className="about-content">
            <p>DynamicNFC digital business card combines professional presence with advanced digital technology in one seamless solution. Designed for long-term use and modern networking, it bridges physical interaction with powerful digital connectivity.</p>
            <p>With NFC and QR code support, DynamicNFC enables instant sharing at events, corporate meetings, trade shows, and networking environments. It offers both premium presentation and digital flexibility in a single smart business tool.</p>
            <p>DynamicNFC is an AI-powered digital business card platform developed in Canada. Built for professionals and enterprises, it provides a refined, high-end solution for modern corporate representation.</p>
          </div>
        </section>

        {/* ═══ Technical Features ═══ */}
        <section className="tech-features">
          <div className="section-divider"><span>Technical Features</span></div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8"/><path d="M16.37 2a18.97 18.97 0 0 1 0 20"/></svg></div>
              <h4>NFC Chip (NTAG 216)</h4>
              <p>High-frequency 13.56 MHz contactless chip with 888 bytes of memory. Compatible with all NFC-enabled smartphones. One-tap instant sharing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg></div>
              <h4>Custom QR Code</h4>
              <p>Encoded QR code printed on the card front. Scannable by any camera app. Links to your personalized web profile or any URL you choose.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg></div>
              <h4>Premium Materials</h4>
              <p>Available in PVC, brushed metal, 24K gold, bamboo, and wood. ISO 7810 standard (85.6 × 53.98 mm). Built to last with premium finish.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
              <h4>Universal Compatibility</h4>
              <p>Works with iPhone (XS and later), all modern Android devices, and any QR scanner. No app download required — instant browser-based access.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
              <h4>Secure &amp; Private</h4>
              <p>Your data is hosted securely on encrypted servers in Canada. GDPR and CCPA compliant. You control what information is shared at all times.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/><path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg></div>
              <h4>AI-Powered Platform</h4>
              <p>Manage your card, update content, and track engagement through the DynamicNFC dashboard. Real-time analytics and smart contact management.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="el-footer">
        <p>© {new Date().getFullYear()} <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">DynamicNFC</a> — AI-Powered Digital Business Cards. Developed in Canada.</p>
      </footer>
    </div>
  );
}
