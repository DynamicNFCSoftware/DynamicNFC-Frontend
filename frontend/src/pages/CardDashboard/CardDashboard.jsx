import React, { useState, useEffect } from "react";
import './CardDashboard.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import SEO from '../../components/SEO/SEO';

/* ═══════════════════════════════════════════════════════
   CardDashboard v2 — Mobile-first, Card-as-Hero
   Inspired by HiHello / Blinq: card IS the app.
   ═══════════════════════════════════════════════════════ */

export default function CardDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [qrCardId, setQrCardId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const uid = user?.uid || user?.accountId;
    if (!user || !uid) return;
    const q = query(collection(db, "cards"), where("userId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Firestore:", err));
    return () => unsub();
  }, [user]);

  const primaryCard = cards[0] || null;
  const otherCards = cards.slice(1);
  const totalScans = cards.reduce((s, c) => s + (Number(c.scans) || 0), 0);

  const handleDelete = async (cardId) => {
    if (!window.confirm("Delete this card?")) return;
    try {
      setDeleting(cardId);
      await deleteDoc(doc(db, "cards", cardId));
    } catch { alert("Delete failed."); }
    finally { setDeleting(null); }
  };

  const cardUrl = (id) => `${window.location.origin}/card/?hashId=${id}`;

  const handleShare = async (id) => {
    const url = cardUrl(id);
    const card = cards.find(c => c.id === id);
    if (navigator.share) {
      try { await navigator.share({ title: `${card?.name || 'My'} - DynamicNFC`, text: 'Check out my digital business card', url }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { prompt('Copy this link:', url); }
  };

  const handleQR = (id) => setQrCardId(id);

  /* ═══ NO CARDS — Empty state ═══ */
  if (cards.length === 0) {
    return (
      <div className="cd">
        <SEO title="My Cards" description="Manage your digital NFC business cards, view analytics, and create new cards." path="/card-dashboard" />
        <div className="cd-empty">
          <div className="cd-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <path d="M6 16h4" />
            </svg>
          </div>
          <h1>Create your first card</h1>
          <p>Your digital business card lives here. Share it with a tap, a QR code, or a link.</p>
          <div className="cd-empty-btns">
            <button className="cd-btn primary" onClick={() => navigate('/create-card')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round" /></svg>
              Create Digital Card
            </button>
            <button className="cd-btn secondary" onClick={() => navigate('/create-physical-card')}>
              Order Physical Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ HAS CARDS — Card-Hero layout ═══ */
  const pc = primaryCard;
  const ac = pc.accentColor || '#C5A467';

  return (
    <div className="cd">
      <SEO title="My Cards" description="Manage your digital NFC business cards, view analytics, and create new cards." path="/card-dashboard" />

      {/* ═══ CARD HERO — Above the fold ═══ */}
      <div className="cd-hero">
        {/* Cover */}
        <div className="cd-cover" style={{
          backgroundImage: pc.images?.cover
            ? `url(${pc.images.cover})`
            : `linear-gradient(145deg, ${ac}25, #1a1a1f 70%)`,
        }}>
          <div className="cd-cover-overlay" />
          {/* Scans badge */}
          <div className="cd-scans-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {pc.scans || 0} scans
          </div>
        </div>

        {/* Profile + Info */}
        <div className="cd-info">
          <div className="cd-avatar-row">
            <div className="cd-avatar" style={{ borderColor: ac }}>
              {pc.images?.profile
                ? <img src={pc.images.profile} alt="" />
                : <span>{(pc.name || 'U').charAt(0)}</span>
              }
            </div>
            {pc.images?.company && (
              <div className="cd-company-logo">
                <img src={pc.images.company} alt="" />
              </div>
            )}
          </div>
          <h1 className="cd-name">{pc.name || 'Untitled Card'}</h1>
          <div className="cd-title" style={{ color: ac }}>{pc.title || 'Card Holder'}</div>
          {pc.company && <div className="cd-company">{pc.company}</div>}
        </div>

        {/* Quick action row under card */}
        <div className="cd-quick-row">
          <Link to={`/card/?hashId=${pc.id}`} target="_blank" className="cd-quick-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </Link>
          <button className="cd-quick-btn" onClick={() => navigate(`/edit-card?hashId=${pc.id}`)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button className="cd-quick-btn danger" onClick={() => handleDelete(pc.id)} disabled={deleting === pc.id}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            {deleting === pc.id ? '...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* ═══ OTHER CARDS (if multiple) ═══ */}
      {otherCards.length > 0 && (
        <div className="cd-section">
          <div className="cd-divider">
            <span>Other Cards ({otherCards.length})</span>
          </div>
          <div className="cd-other-grid">
            {otherCards.map(card => (
              <div className="cd-other-card" key={card.id}>
                <div className="cd-other-cover" style={{
                  backgroundImage: card.images?.cover ? `url(${card.images.cover})` : 'none',
                  backgroundColor: !card.images?.cover ? (card.accentColor || '#1a1a1f') : 'transparent',
                }} />
                <div className="cd-other-body">
                  <div className="cd-other-name">{card.name || 'Untitled'}</div>
                  <div className="cd-other-title" style={{ color: card.accentColor || '#e63946' }}>{card.title || 'Card Holder'}</div>
                  <div className="cd-other-scans">{card.scans || 0} scans</div>
                </div>
                <div className="cd-other-actions">
                  <button className="cd-mini-btn" onClick={() => handleQR(card.id)} title="QR Code">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  </button>
                  <button className="cd-mini-btn" onClick={() => handleShare(card.id)} title="Share">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                  </button>
                  <button className="cd-mini-btn" onClick={() => navigate(`/edit-card?hashId=${card.id}`)} title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ CREATE NEW — Below the fold ═══ */}
      <div className="cd-section">
        <div className="cd-divider">
          <span>{cards.length > 0 ? 'Create another card' : 'Get started'}</span>
        </div>
        <div className="cd-create-grid">
          <button className="cd-create-card" onClick={() => navigate('/create-card')}>
            <div className="cd-create-icon digital">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="cd-create-text">
              <strong>Digital Profile</strong>
              <span>Free — share via link or QR</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="cd-create-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button className="cd-create-card" onClick={() => navigate('/create-physical-card')}>
            <div className="cd-create-icon physical">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><path d="M6 16h4" /></svg>
            </div>
            <div className="cd-create-text">
              <strong>Physical NFC Card</strong>
              <span>From $30 — PVC, Metal, Eco</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="cd-create-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* ═══ STICKY BOTTOM BAR ═══ */}
      <div className="cd-sticky-bar">
        <button className="cd-sticky-btn qr" onClick={() => handleQR(pc.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M18 18h3v3h-3z"/><path d="M14 18h.01"/><path d="M18 14h.01"/></svg>
          <span>QR Code</span>
        </button>
        <button className="cd-sticky-btn share" onClick={() => handleShare(pc.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>
        <button className="cd-sticky-btn edit" onClick={() => navigate(`/edit-card?hashId=${pc.id}`)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Edit</span>
        </button>
      </div>

      {/* ═══ QR OVERLAY ═══ */}
      {qrCardId && (
        <div className="cd-qr-overlay" onClick={() => setQrCardId(null)}>
          <div className="cd-qr-modal" onClick={e => e.stopPropagation()}>
            <button className="cd-qr-close" onClick={() => setQrCardId(null)}>✕</button>
            <div className="cd-qr-name">
              {cards.find(c => c.id === qrCardId)?.name || 'My Card'}
            </div>
            <div className="cd-qr-sub">Scan to view my digital card</div>
            <div className="cd-qr-frame">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(cardUrl(qrCardId))}&color=1a1a1f&bgcolor=ffffff&margin=8`}
                alt="QR Code"
                className="cd-qr-img"
              />
            </div>
            <div className="cd-qr-url">{cardUrl(qrCardId)}</div>
            <div className="cd-qr-actions">
              <button className="cd-qr-btn primary" onClick={() => handleShare(qrCardId)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                Share Link
              </button>
              <button className="cd-qr-btn secondary" onClick={async () => {
                try { await navigator.clipboard.writeText(cardUrl(qrCardId)); setCopied(true); setTimeout(() => setCopied(false), 2000); }
                catch { prompt('Copy:', cardUrl(qrCardId)); }
              }}>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <div className="cd-qr-powered">Powered by DynamicNFC</div>
          </div>
        </div>
      )}
    </div>
  );
}
