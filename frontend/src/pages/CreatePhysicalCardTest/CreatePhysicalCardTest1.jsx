import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/css/enterprise-light.css";
import "../../assets/css/enterprise-light.css";

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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Particles effect (no library)
  useEffect(() => {
    const container = document.getElementById("particles");
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
      {/* ── Ambient layers ── */}
      <div className="bg-mesh" />
      <div className="particles" id="particles" />

      {/* ── Navbar ── */}
      <nav className="nav-bar">
        <div className="nav-container">
          <Link to="/" className="logo">
            DynamicNFC
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/enterprise">Enterprise</Link>
            <Link to="/nfc-cards">NFC Cards</Link>

            {isAuthenticated && isAuthenticated() && (
              <Link to="/dashboard">Dashboard</Link>
            )}

            {isAuthenticated && isAuthenticated() ? (
              <button onClick={handleLogout} className="nav-btn">
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="enterprise-content">
        {/* Page Header */}
        <div className="page-header">
          <span className="badge">Create Your Card</span>
          <h1>Design Your NFC Card</h1>
          <p>
            Personalize your VIP Access Key with your name and logo.
            Changes update in real time on the preview.
          </p>
        </div>

        {/* Card Preview + Form */}
        <div className="card-preview-wrapper">
          {/* ── Left: Live Preview ── */}
          <div className="card-preview-section">
            <div className="card-preview">
              {card?.tertemiz && (
                <img
                  src={card.tertemiz}
                  alt={card?.title || "Card background"}
                  className="card-bg"
                />
              )}
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview" className="card-logo" />
              )}
              <div className="card-name">{fullName || "Name Surname"}</div>
            </div>
            <div className="preview-label">Live Preview</div>
          </div>

          {/* ── Right: Form ── */}
          <div className="card-form">
            <h2>Card Details</h2>
            <p className="form-subtitle">
              Enter your information below. Your card will be printed and shipped with NFC &amp; QR enabled.
            </p>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <hr className="form-divider" />

            <div className="form-group">
              <label>Upload Logo</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <svg
                  className="upload-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div className="upload-text">
                  <strong>Click to upload</strong> or drag &amp; drop
                </div>
              </div>
            </div>

            <button className="primary-btn" type="button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Continue
            </button>
          </div>
        </div>

        {/* ── Info Strip ── */}
        <div className="info-strip">
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="m16 8 5 3-5 3z" />
            </svg>
            Free Shipping
          </div>
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            QR Included
          </div>
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
              <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
              <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" />
            </svg>
            NFC Enabled
          </div>
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            No App Required
          </div>
        </div>
      </main>
    </div>
  );
}
