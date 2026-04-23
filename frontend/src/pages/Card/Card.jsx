import React, { useState, useEffect } from "react";
import './Card.css';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useOfflineCard } from "../../hooks/useOfflineCard";
import { SOC, CARD_THEMES as TH, sanitizeUrl } from '../../constants/cardConstants';
import SEO from '../../components/SEO/SEO';

const I = {
  email: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  phone: "M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  web: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  loc: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  office: "M19 2H5a2 2 0 00-2 2v14a2 2 0 002 2h4l3 3 3-3h4a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3.3L14.5 8H17v2h-3.36l-1.64.55V14H10v-3.45L7.67 10H5V8h3.2L12 5.3z",
  share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z",
  download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
  user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
};

export default function Card() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hashId = searchParams.get("hashId");

    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userTheme, setUserTheme] = useState(null);
    const [shared, setShared] = useState(false);
    const { cacheCard, getCachedCard } = useOfflineCard();

    useEffect(() => {
        const fetchCard = async () => {
            if (!hashId) { setError("No card ID provided."); setLoading(false); return; }
            try {
                const docRef = doc(db, "cards", hashId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCardData(data);
                    cacheCard(hashId, data);
                    const uid = user?.uid || user?.accountId;
                    if (!uid || uid !== data.userId) {
                        updateDoc(docRef, { scans: increment(1) }).catch(() => {});
                    }
                } else { setError("Card not found."); }
            } catch (err) {
                console.error(err);
                // Try offline cache
                const cached = await getCachedCard(hashId);
                if (cached) { setCardData(cached); }
                else { setError("Error loading card. You may be offline."); }
            }
            finally { setLoading(false); }
        };
        fetchCard();
    }, [hashId, user, cacheCard, getCachedCard]);

    const handleSaveContact = () => {
        if (!cardData) return;
        const c = cardData;
        const fn = [c.prefix, c.name, c.suffix].filter(Boolean).join(" ");
        const cph = c.phoneNum ? (c.phoneCode + " " + c.phoneNum) : "";
        const coph = c.officePhoneNum ? (c.officePhoneCode + " " + c.officePhoneNum) : "";
        const web = c.website ? (c.website.match(/^https?:\/\//) ? c.website : "https://" + c.website) : "";
        // Build social media note lines for broad compatibility
        const socLines = [];
        if (c.socials) {
            SOC.forEach(s => {
                if (c.socials[s.key]) {
                    const fullUrl = s.base + c.socials[s.key];
                    socLines.push(`${s.lbl}: ${fullUrl}`);
                    // X-SOCIALPROFILE for Apple/iOS
                    socLines.push(`X-SOCIALPROFILE;TYPE=${s.key}:${fullUrl}`);
                }
            });
        }
        // Extract base64 photo if available
        let photoLine = "";
        if (c.images?.profile) {
            const match = c.images.profile.match(/^data:image\/(jpeg|png|webp);base64,(.+)$/);
            if (match) {
                const type = match[1].toUpperCase() === "PNG" ? "PNG" : "JPEG";
                photoLine = `PHOTO;ENCODING=b;TYPE=${type}:${match[2]}`;
            }
        }
        const noteItems = [c.bio, ...(c.socials ? SOC.filter(s => c.socials[s.key]).map(s => `${s.lbl}: ${s.base}${c.socials[s.key]}`) : [])].filter(Boolean);
        const l = ["BEGIN:VCARD", "VERSION:3.0", `FN:${fn}`, photoLine, `TITLE:${c.title || ''}`,
            `ORG:${c.company || ''}${c.department ? ";" + c.department : ""}`,
            cph ? `TEL;TYPE=CELL:${cph}` : "", coph ? `TEL;TYPE=WORK:${coph}` : "",
            c.email ? `EMAIL;TYPE=WORK:${c.email}` : "", web ? `URL:${web}` : "",
            c.location ? `ADR;TYPE=WORK:;;${c.location}` : "",
            noteItems.length ? `NOTE:${noteItems.join("\\n")}` : "",
            `URL;TYPE=CARD:${window.location.href}`,
            `REV:${new Date().toISOString()}`];
        if (c.socials) {
            SOC.forEach(s => { if (c.socials[s.key]) l.push(`X-SOCIALPROFILE;TYPE=${s.key}:${s.base}${c.socials[s.key]}`); });
        }
        l.push("END:VCARD");
        const blob = new Blob([l.filter(Boolean).join("\n")], { type: "text/vcard" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `${c.name.replace(/\s+/g, "_") || "contact"}.vcf`; a.click();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: cardData?.name || "Digital Card", url: window.location.href }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    if (loading) return <div className="sc-loading"><div className="sc-spinner" /><span style={{ fontSize: '.85rem', opacity: .6 }}>Loading...</span></div>;
    if (error) return <div className="sc-loading"><div style={{ color: '#e63946', fontFamily: 'var(--f)', fontSize: '1.4rem', fontWeight: 500 }}>{error}</div></div>;
    if (!cardData) return null;

    const activeThemeKey = userTheme || cardData.theme || "dark";
    const th = TH[activeThemeKey] || TH.dark;
    const ac = cardData.accentColor || "#C5A467";
    const ph = cardData.phoneNum ? `${cardData.phoneCode || ''} ${cardData.phoneNum}` : null;
    const oph = cardData.officePhoneNum ? `${cardData.officePhoneCode || ''} ${cardData.officePhoneNum}` : null;
    const uid = user?.uid || user?.accountId;
    const isOwner = uid && uid === cardData.userId;
    const activeSocials = SOC.filter(s => cardData.socials && cardData.socials[s.key]);
    const cardUrl = window.location.href;
    const qrBg = th.isDark ? '111116' : 'ffffff';
    const qrFg = th.isDark ? 'fafaf8' : '1a1a1f';


    const toggleTheme = () => {
        setUserTheme(activeThemeKey === "dark" ? "light" : activeThemeKey === "light" ? "brand" : "dark");
    };

    document.body.style.background = th.bg;
    document.body.style.transition = "background .4s";

    return (
        <div className="sc-page" style={{ background: th.bg }}>
            <SEO title="Digital Business Card" description="View and share your digital NFC business card with contact info, social links, and QR code." path="/card" />


            {/* ══════ LEFT: DIGITAL CARD ══════ */}
            <div className="sc-wrap" style={{ background: th.bg }}>
                {/* Cover */}
                <div className="sc-cover" style={{
                    backgroundImage: cardData.images?.cover
                        ? `url(${cardData.images.cover})`
                        : `linear-gradient(145deg, ${ac}30, ${th.card} 60%, ${th.bg})`,
                }}>
                    <div className="sc-cover-grad" style={{ background: `linear-gradient(to bottom, transparent 30%, ${th.card} 100%)` }} />
                    <div className="sc-cover-noise" />

                    <div className="sc-top">
                        <button className="sc-top-btn" onClick={toggleTheme} title="Switch theme">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {th.isDark
                                    ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
                                    : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                }
                            </svg>
                        </button>
                        <button className="sc-top-btn" onClick={handleShare} title="Share">
                            {shared
                                ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4ecdc4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                : <svg viewBox="0 0 24 24" width="16" height="16"><path d={I.share} fill="currentColor" /></svg>
                            }
                        </button>
                    </div>

                    <div className="sc-avatar-area">
                        <div className="sc-avatar" style={{
                            backgroundImage: cardData.images?.profile ? `url(${cardData.images.profile})` : "none",
                            borderColor: th.card,
                            backgroundColor: cardData.images?.profile ? "transparent" : ac,
                        }}>
                            {!cardData.images?.profile && <span className="sc-avatar-letter">{(cardData.name || "?").charAt(0).toUpperCase()}</span>}
                        </div>
                    </div>

                    {cardData.images?.logo && (
                        <div className="sc-logo-area">
                            <div className="sc-logo" style={{ borderColor: th.card, background: th.card, padding: (cardData.logoFit === 'cover') ? 0 : undefined }}>
                                <img src={cardData.images.logo} alt="" style={{ objectFit: cardData.logoFit || 'contain' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="sc-body" style={{ background: th.card, color: th.text }}>
                    <div className="sc-hdr sc-anim">
                        {cardData.prefix && <div className="sc-pre" style={{ color: ac }}>{cardData.prefix}</div>}
                        <div className="sc-name">{cardData.name}{cardData.suffix ? `, ${cardData.suffix}` : ""}</div>
                        {cardData.title && <div className="sc-title" style={{ color: ac }}>{cardData.title}</div>}
                        {cardData.company && (
                            <div className="sc-company" style={{ color: th.sub }}>
                                {cardData.company}{cardData.department ? ` \u2022 ${cardData.department}` : ""}
                            </div>
                        )}
                        {cardData.bio && <div className="sc-bio" style={{ color: th.sub }}>{cardData.bio}</div>}
                    </div>

                    {(cardData.licenseNo || cardData.languages) && (
                        <div className="sc-tags sc-anim sc-anim-d1">
                            {cardData.licenseNo && <span className="sc-tag" style={{ background: `${ac}15`, color: ac, border: `1px solid ${ac}20` }}>Lic: {cardData.licenseNo}</span>}
                            {cardData.languages && cardData.languages.split(",").map((l, i) =>
                                <span key={i} className="sc-tag" style={{ background: th.rowBg, color: th.sub, border: `1px solid ${th.brd}` }}>{l.trim()}</span>
                            )}
                        </div>
                    )}

                    <div className="sc-cta sc-anim sc-anim-d1">
                        <button className="sc-cta-btn" style={{ background: ac, color: '#fff', boxShadow: `0 8px 24px ${ac}40` }} onClick={handleSaveContact}>
                            <svg viewBox="0 0 24 24"><path d={I.download} /></svg>
                            Save to Contacts
                        </button>
                    </div>

                    {(ph || oph || cardData.email || cardData.website || cardData.location) && (
                        <div className="sc-sec sc-anim sc-anim-d2">
                            <div className="sc-sec-title" style={{ color: th.muted }}>
                                Contact<span style={{ height: '1px', flex: 1, background: th.brd, display: 'block' }} />
                            </div>
                            <div className="sc-rows">
                                {ph && <a href={`tel:${ph.replace(/\s/g, '')}`} className="sc-row" style={{ background: th.rowBg, borderColor: th.brd }}><div className="sc-row-icon" style={{ background: `${ac}12`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.phone} /></svg></div><div className="sc-row-text"><span className="sc-row-lbl" style={{ color: th.muted }}>Mobile</span><span className="sc-row-val" style={{ color: th.text }}>{ph}</span></div></a>}
                                {oph && <a href={`tel:${oph.replace(/\s/g, '')}`} className="sc-row" style={{ background: th.rowBg, borderColor: th.brd }}><div className="sc-row-icon" style={{ background: `${ac}12`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.office} /></svg></div><div className="sc-row-text"><span className="sc-row-lbl" style={{ color: th.muted }}>Office</span><span className="sc-row-val" style={{ color: th.text }}>{oph}</span></div></a>}
                                {cardData.email && <a href={`mailto:${cardData.email}`} className="sc-row" style={{ background: th.rowBg, borderColor: th.brd }}><div className="sc-row-icon" style={{ background: `${ac}12`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.email} /></svg></div><div className="sc-row-text"><span className="sc-row-lbl" style={{ color: th.muted }}>Email</span><span className="sc-row-val" style={{ color: th.text }}>{cardData.email}</span></div></a>}
                                {cardData.website && <a href={cardData.website.startsWith('http') ? cardData.website : `https://${cardData.website}`} target="_blank" rel="noreferrer" className="sc-row" style={{ background: th.rowBg, borderColor: th.brd }}><div className="sc-row-icon" style={{ background: `${ac}12`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.web} /></svg></div><div className="sc-row-text"><span className="sc-row-lbl" style={{ color: th.muted }}>Website</span><span className="sc-row-val" style={{ color: th.text }}>{cardData.website.replace(/^https?:\/\//, '')}</span></div></a>}
                                {cardData.location && <div className="sc-row" style={{ background: th.rowBg, borderColor: th.brd }}><div className="sc-row-icon" style={{ background: `${ac}12`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.loc} /></svg></div><div className="sc-row-text"><span className="sc-row-lbl" style={{ color: th.muted }}>Location</span><span className="sc-row-val" style={{ color: th.text }}>{cardData.location}</span></div></div>}
                            </div>
                        </div>
                    )}

                    {activeSocials.length > 0 && (
                        <div className="sc-sec sc-anim sc-anim-d3">
                            <div className="sc-sec-title" style={{ color: th.muted }}>
                                Connect<span style={{ height: '1px', flex: 1, background: th.brd, display: 'block' }} />
                            </div>
                            <div className="sc-socs">
                                {activeSocials.map(s => (
                                    <a key={s.key} href={sanitizeUrl(s.base + cardData.socials[s.key])} target="_blank" rel="noreferrer" className="sc-soc" style={{ background: `${ac}10`, color: ac, borderColor: `${ac}15` }} title={s.lbl}>
                                        <svg viewBox="0 0 24 24"><path d={s.icon} /></svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════ RIGHT: QR CODE PANEL ══════ */}
            <div className="sc-qr-side" style={{ background: th.card, borderColor: th.brd, color: th.text }}>
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cardUrl)}&bgcolor=${qrBg}&color=${qrFg}&margin=10`}
                    alt="QR Code"
                    width={200}
                    height={200}
                />

                <div>
                    <div className="sc-qr-name" style={{ color: th.text }}>{cardData.name}</div>
                    {cardData.title && <div className="sc-qr-title" style={{ color: ac }}>{cardData.title}</div>}
                </div>

                <div className="sc-qr-divider" style={{ background: th.brd }} />

                <div className="sc-qr-hint" style={{ color: th.muted }}>Scan to view card &amp; save contact</div>

                <div className="sc-qr-url" style={{ background: th.rowBg, color: th.muted }}>
                    {cardUrl}
                </div>

                <div className="sc-qr-actions">
                    <button className="sc-qr-btn" style={{ background: ac, color: '#fff', boxShadow: `0 6px 20px ${ac}35` }} onClick={handleSaveContact}>
                        <svg viewBox="0 0 24 24"><path d={I.download} /></svg>
                        Save Contact
                    </button>
                    <button className="sc-qr-btn-outline" style={{ border: `1px solid ${th.brd}`, color: th.sub }} onClick={handleShare}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        {shared ? 'Copied!' : 'Share Link'}
                    </button>
                </div>

                <div className="sc-qr-powered">
                    <img src="/assets/images/logo.png" alt="DynamicNFC" style={{ filter: th.isDark ? 'none' : 'invert(1)', opacity: .5 }} />
                    <span style={{ color: th.muted }}>Powered by DynamicNFC</span>
                </div>
            </div>

            {/* ── OWNER DOCK ── */}
            {isOwner && (
                <div className="sc-dock">
                    <div className="sc-dock-badge"><div className="sc-dock-dot" />Owner</div>
                    <button className="sc-dock-btn" onClick={() => navigate('/dashboard')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Dashboard
                    </button>
                    <button className="sc-dock-btn" onClick={() => navigate(`/edit-card?hashId=${hashId}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
}
