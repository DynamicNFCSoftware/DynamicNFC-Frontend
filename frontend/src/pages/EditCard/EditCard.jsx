import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import '../CreateCard/CreateCard.css';
import './EditCard.css';
import { SOC, CC, CARD_THEMES as TH } from '../../constants/cardConstants';
import SEO from '../../components/SEO/SEO';

const LOGO_L = "data:image/png;base64,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";

const ACS = ["#C5A467","#e63946","#457b9d","#2ec4b6","#6C63FF","#FF6B6B","#4ECDC4","#1a1a1f"];

const VL = {
  name: v => !!v && v.trim().length >= 2,
  email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: v => !v || /^\d{7,10}$/.test(v.replace(/\s/g, "")),
  web: v => !v || /^.+\.[a-z]{2,}/.test(v.replace(/^https?:\/\//, "")),
};
const EM = { name:"Required (min 2 chars)", email:"Invalid email", phone:"Enter 7-10 digits", web:"Need a domain (mysite.com)" };

function fmtPh(raw) { const d = raw.replace(/\D/g, ""); if (d.length <= 3) return d; if (d.length <= 6) return d.slice(0,3)+" "+d.slice(3); return d.slice(0,3)+" "+d.slice(3,6)+" "+d.slice(6,10); }
function fullPh(code, num) { return num ? code + " " + fmtPh(num) : ""; }

const I = {
  email:"M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  phone:"M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  web:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  loc:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  office:"M19 2H5a2 2 0 00-2 2v14a2 2 0 002 2h4l3 3 3-3h4a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3.3L14.5 8H17v2h-3.36l-1.64.55V14H10v-3.45L7.67 10H5V8h3.2L12 5.3z",
  user:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
};

const MAX_IMG = 5*1024*1024;
const IMG_OK = ["image/jpeg","image/png","image/webp"];
const resizeImg = (file, maxW) => new Promise((res, rej) => {
  if (!IMG_OK.includes(file.type)) return rej("Use JPG, PNG, or WebP.");
  if (file.size > MAX_IMG) return rej("Image too large. Please use under 5MB.");
  const r = new FileReader(); r.onerror = () => rej("Read failed.");
  r.onload = e => { const img = new Image(); img.onload = () => { const ratio = Math.min(maxW/img.width, maxW/img.height, 1); const w = Math.round(img.width*ratio), h = Math.round(img.height*ratio); const c = document.createElement("canvas"); c.width=w; c.height=h; c.getContext("2d").drawImage(img,0,0,w,h); res(c.toDataURL("image/jpeg",.80)); }; img.onerror = () => rej("Bad image."); img.src = e.target.result; };
  r.readAsDataURL(file);
});

/* ═══ MOBILE WIZARD STEPS ═══ */
const WIZARD_STEPS = [
  { id: 1, label: "Identity" },
  { id: 2, label: "Contact" },
  { id: 3, label: "Photos" },
  { id: 4, label: "Social" },
  { id: 5, label: "Appearance" },
];
const TOTAL_WIZARD = WIZARD_STEPS.length;

export default function EditCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hashId = searchParams.get("hashId");

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wizStep, setWizStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [tType, setTT] = useState("ok");
  const [tExit, setTE] = useState(false);
  const [errs, setErrs] = useState({});
  const [touched, setTouched] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const notify = useCallback((msg, t = "ok") => { setTT(t); setTE(false); setToast(msg); setTimeout(() => { setTE(true); setTimeout(() => setToast(null), 300); }, 3500); }, []);

  useEffect(() => {
    if (!hashId) { setLoading(false); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "cards", hashId));
        if (snap.exists()) {
          const data = snap.data();
          setCard({
            name: data.name || "", prefix: data.prefix || "", suffix: data.suffix || "",
            title: data.title || "", company: data.company || "", department: data.department || "",
            email: data.email || "", phoneCode: data.phoneCode || "+1", phoneNum: data.phoneNum || "",
            officePhoneCode: data.officePhoneCode || "+1", officePhoneNum: data.officePhoneNum || "",
            website: data.website || "", location: data.location || "", bio: data.bio || "",
            licenseNo: data.licenseNo || "", languages: data.languages || "",
            socials: data.socials || {}, images: data.images || { logo: null, profile: null, cover: null },
            logoFit: data.logoFit || "contain", theme: data.theme || "dark", accentColor: data.accentColor || "#C5A467",
          });
        } else { notify("Card not found.", "err"); }
      } catch (err) { console.error(err); notify("Error loading card.", "err"); }
      finally { setLoading(false); }
    };
    load();
  }, [hashId, notify]);

  const upd = useCallback((k, v) => setCard(p => ({ ...p, [k]: v })), []);
  const updSoc = useCallback((k, v) => setCard(p => ({ ...p, socials: { ...p.socials, [k]: v } })), []);
  const updImg = useCallback((k, v) => setCard(p => ({ ...p, images: { ...p.images, [k]: v } })), []);

  const validate = useCallback(() => {
    if (!card) return false;
    const e = {};
    if (!VL.name(card.name)) e.name = EM.name;
    if (card.email && !VL.email(card.email)) e.email = EM.email;
    if (card.phoneNum && !VL.phone(card.phoneNum)) e.phone = EM.phone;
    if (card.officePhoneNum && !VL.phone(card.officePhoneNum)) e.oPhone = EM.phone;
    if (card.website && !VL.web(card.website)) e.web = EM.web;
    setErrs(e); return Object.keys(e).length === 0;
  }, [card]);

  const touch = useCallback(k => setTouched(p => ({ ...p, [k]: true })), []);
  useEffect(() => { if (card && Object.keys(touched).length > 0) validate(); }, [card, touched, validate]);

  const onImg = useCallback(t => async e => {
    const f = e.target.files?.[0]; if (!f) return;
    try { updImg(t, await resizeImg(f, t === "cover" ? 1000 : 400)); } catch (err) { notify(String(err), "err"); }
    e.target.value = "";
  }, [updImg, notify]);

  const rmImg = useCallback(t => e => { e.preventDefault(); e.stopPropagation(); updImg(t, null); }, [updImg]);
  const onPhNum = useCallback(k => e => { upd(k, e.target.value.replace(/\D/g, "").slice(0, 10)); }, [upd]);

  const handleSave = useCallback(async () => {
    if (!validate()) { notify("Fix errors first.", "err"); return; }
    if (!user || !hashId) { notify("Cannot save.", "err"); return; }
    setSaving(true);
    try {
      const safeData = { ...card };
      Object.keys(safeData).forEach(key => { if (safeData[key] === undefined) delete safeData[key]; });
      safeData.updatedAt = serverTimestamp();
      await updateDoc(doc(db, "cards", hashId), safeData);
      notify("Card updated successfully!");
      if (isMobile) setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error("Update Error:", err);
      notify("Failed to update card.", "err");
    } finally { setSaving(false); }
  }, [card, validate, notify, user, hashId, isMobile, navigate]);

  const fe = k => touched[k] ? errs[k] : null;

  /* ═══ MOBILE WIZARD NAV ═══ */
  const wizNext = () => {
    if (wizStep === 1 && card && !card.name.trim()) { setTouched({ name: 1 }); notify("Name is required.", "err"); return; }
    if (wizStep < TOTAL_WIZARD) { setWizStep(wizStep + 1); window.scrollTo(0, 0); }
    else {
      if (validate()) handleSave();
      else { setTouched({ name:1, email:1, phone:1, web:1 }); notify("Fix errors.", "err"); }
    }
  };
  const wizBack = () => {
    if (wizStep > 1) { setWizStep(wizStep - 1); window.scrollTo(0, 0); }
    else navigate('/dashboard');
  };

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF8', fontFamily:"'Outfit',sans-serif", color:'#1a1a1f' }}>Loading card...</div>;
  if (!card) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF8', fontFamily:"'Outfit',sans-serif", color:'#e63946' }}>Card not found</div>;

  const th = TH[card.theme] || TH.dark;
  const ac = card.accentColor || "#C5A467";
  const ph = fullPh(card.phoneCode, card.phoneNum);
  const oph = fullPh(card.officePhoneCode, card.officePhoneNum);

  /* ═══ FORM SECTIONS ═══ */
  const SectionIdentity = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">Edit identity</h2>}
      {isMobile && <p className="cb-wiz-desc">Update your name and title.</p>}
      {!isMobile && <div className="cb-lbl">Personal</div>}
      <div className="cb-g">
        <div className="cb-f"><label>Prefix</label><input value={card.prefix} onChange={e => upd("prefix", e.target.value)} placeholder="Dr., Eng." /></div>
        <div className={`cb-f${fe("name") ? " er" : ""}`}><label>Full Name <span className="rq">*</span></label><input value={card.name} onChange={e => upd("name", e.target.value)} onBlur={() => touch("name")} placeholder="Full Name" />{fe("name") && <div className="cb-em">{fe("name")}</div>}</div>
        <div className="cb-f"><label>Suffix</label><input value={card.suffix} onChange={e => upd("suffix", e.target.value)} placeholder="MBA, CPA" /></div>
        <div className="cb-f"><label>Job Title</label><input value={card.title} onChange={e => upd("title", e.target.value)} placeholder="Senior Agent" /></div>
        <div className="cb-f full"><label>Company</label><input value={card.company} onChange={e => upd("company", e.target.value)} placeholder="Company Name" /></div>
        <div className="cb-f"><label>Department</label><input value={card.department} onChange={e => upd("department", e.target.value)} placeholder="Sales" /></div>
        <div className="cb-f"><label>License / ID</label><input value={card.licenseNo} onChange={e => upd("licenseNo", e.target.value)} placeholder="DLD-12345" /></div>
        <div className="cb-f full"><label>Short Bio</label><textarea value={card.bio} onChange={e => upd("bio", e.target.value.slice(0, 200))} placeholder="A few words..." rows={2} />{card.bio.length > 160 && <div className="cb-cc">{card.bio.length}/200</div>}</div>
        <div className="cb-f full"><label>Languages</label><input value={card.languages} onChange={e => upd("languages", e.target.value)} placeholder="English, Arabic, Turkish" /></div>
      </div>
    </div>
  );

  const SectionContact = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">Edit contact</h2>}
      {isMobile && <p className="cb-wiz-desc">Update your contact details.</p>}
      {!isMobile && <div className="cb-lbl">Contact</div>}
      <div className="cb-g">
        <div className={`cb-f${fe("email") ? " er" : ""}`}><label>Email</label><input type="email" value={card.email} onChange={e => upd("email", e.target.value)} onBlur={() => touch("email")} placeholder="email@company.com" />{fe("email") && <div className="cb-em">{fe("email")}</div>}</div>
        <div className={`cb-f${fe("phone") ? " er" : ""}`}><label>Mobile Phone</label>
          <div className="pw"><select value={card.phoneCode} onChange={e => upd("phoneCode", e.target.value)}>{CC.map((c, i) => <option key={i} value={c.c}>{c.f} {c.n} {c.c}</option>)}</select>
          <input type="tel" inputMode="numeric" value={fmtPh(card.phoneNum)} onChange={onPhNum("phoneNum")} onBlur={() => touch("phone")} placeholder="501 234 5678" maxLength={14} /></div>
          {fe("phone") && <div className="cb-em">{fe("phone")}</div>}
        </div>
        <div className={`cb-f${fe("oPhone") ? " er" : ""}`}><label>Office Phone</label>
          <div className="pw"><select value={card.officePhoneCode} onChange={e => upd("officePhoneCode", e.target.value)}>{CC.map((c, i) => <option key={i} value={c.c}>{c.f} {c.n} {c.c}</option>)}</select>
          <input type="tel" inputMode="numeric" value={fmtPh(card.officePhoneNum)} onChange={onPhNum("officePhoneNum")} onBlur={() => touch("oPhone")} placeholder="4 123 4567" maxLength={14} /></div>
          {fe("oPhone") && <div className="cb-em">{fe("oPhone")}</div>}
        </div>
        <div className={`cb-f full${fe("web") ? " er" : ""}`}><label>Website</label><input value={card.website} onChange={e => upd("website", e.target.value)} onBlur={() => touch("web")} placeholder="mysite.com" />{fe("web") && <div className="cb-em">{fe("web")}</div>}</div>
        <div className="cb-f full"><label>Location</label><input value={card.location} onChange={e => upd("location", e.target.value)} placeholder="Vancouver, Canada" /></div>
      </div>
    </div>
  );

  const SectionPhotos = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">Update photos</h2>}
      {isMobile && <p className="cb-wiz-desc">Change your profile photo, logo, or cover.</p>}
      {!isMobile && <div className="cb-lbl">Images</div>}
      <div className="cb-ups">
        {[{ t:"logo", l:"Logo", i:"\u{1F3E2}" }, { t:"profile", l:"Photo", i:"\u{1F464}" }, { t:"cover", l:"Cover", i:"\u{1F5BC}" }].map(u => (
          <label key={u.t} className={`cb-up${card.images[u.t] ? " has" : ""}`}>
            {card.images[u.t] && <><img className="upt" src={card.images[u.t]} alt="" /><div className="upo">Change</div><button className="upr" onClick={rmImg(u.t)}>{"\u2715"}</button></>}
            <span className="upi">{u.i}</span><span className="upl">{u.l}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onImg(u.t)} />
          </label>
        ))}
      </div>
      {card.images.logo && <div className="clf"><span>Logo fit:</span><button className={card.logoFit === "contain" ? "on" : ""} onClick={() => upd("logoFit", "contain")}>Contain</button><button className={card.logoFit === "cover" ? "on" : ""} onClick={() => upd("logoFit", "cover")}>Cover</button></div>}
    </div>
  );

  const SectionSocial = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">Social media</h2>}
      {isMobile && <p className="cb-wiz-desc">Update your profiles.</p>}
      {!isMobile && <div className="cb-lbl">Social ({SOC.filter(s => card.socials[s.key]).length} active)</div>}
      <div className="cb-socs">
        {SOC.map(s => (
          <div key={s.key} className="cb-srow">
            <div className="cb-si"><svg viewBox="0 0 24 24"><path d={s.icon} fill="currentColor" /></svg></div>
            <span className="cb-sbase">{s.base}</span>
            <input value={card.socials[s.key] || ""} onChange={e => updSoc(s.key, e.target.value)} placeholder={s.ph} />
          </div>
        ))}
      </div>
    </div>
  );

  const SectionAppearance = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">Style</h2>}
      {isMobile && <p className="cb-wiz-desc">Pick theme and accent color.</p>}
      {!isMobile && <div className="cb-lbl">Appearance</div>}
      <div className="cb-thm">{[{ k:"dark", l:"Dark" }, { k:"light", l:"Light" }, { k:"brand", l:"Brand" }].map(t => <button key={t.k} className={`thb${card.theme === t.k ? " on" : ""}`} onClick={() => upd("theme", t.k)}>{t.l}</button>)}</div>
      <div className="cb-cls">{ACS.map(c => <div key={c} className={`ccl${card.accentColor === c ? " on" : ""}`} style={{ background: c }} onClick={() => upd("accentColor", c)} />)}</div>
    </div>
  );

  return (
    <div className="cb">
      <SEO title="Edit Card" description="Edit your digital NFC business card details and design." path="/edit-card" />
      {/* ── DESKTOP: phone preview ── */}
      <div className="cb-pv"><div className="cb-pvbg" /><img src="/assets/images/logo.png" alt="DynamicNFC" className="cb-pv-logo" />
        <div className="cb-ph"><div className="cb-phn" />
          <div className="cb-phi" style={{ background: th.card }}>
            <div className="c-cov" style={{ backgroundImage: card.images.cover ? `url(${card.images.cover})` : "linear-gradient(135deg,#1C1C20,#2d2d35)" }}>
              <div className="c-cov-o" />
              <div className={`c-logo ${card.logoFit === "contain" ? "ct" : "cv"}`} style={{ borderColor: ac, background: th.card }}>
                {card.images.logo ? <img src={card.images.logo} alt="" /> : <span className="c-logo-ph">LOGO</span>}
              </div>
              <div className="c-prof" style={{ backgroundImage: card.images.profile ? `url(${card.images.profile})` : "none", borderColor: ac, backgroundColor: card.images.profile ? "transparent" : th.bg }}>
                {!card.images.profile && <svg viewBox="0 0 24 24" width="26" height="26"><path d={I.user} fill={th.sub} /></svg>}
              </div>
            </div>
            <div className="c-body">
              {card.prefix && <div className="c-pre" style={{ color: th.sub }}>{card.prefix}</div>}
              <div className="c-nm" style={{ color: th.text }}>{card.name || "Your Name"}{card.suffix ? `, ${card.suffix}` : ""}</div>
              <div className="c-ttl" style={{ color: ac }}>{card.title || "Job Title"}</div>
              <div className="c-co" style={{ color: th.sub }}>{card.company || "Company"}</div>
              {card.department && <div className="c-dept" style={{ color: th.sub }}>{card.department}</div>}
              {card.bio && <div className="c-bio" style={{ color: th.sub }}>{card.bio}</div>}
              <div className="c-div" style={{ background: th.text }} />
              <div className="c-rows">
                {card.email && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.email} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Email</span><span className="c-rv" style={{ color: th.text }}>{card.email}</span></div></div>}
                {ph && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.phone} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Mobile</span><span className="c-rv" style={{ color: th.text }}>{ph}</span></div></div>}
                {oph && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.office} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Office</span><span className="c-rv" style={{ color: th.text }}>{oph}</span></div></div>}
              </div>
              {SOC.filter(s => card.socials[s.key]).length > 0 && (
                <div className="c-socs">
                  {SOC.filter(s => card.socials[s.key]).map(s => (
                    <span key={s.key} className="c-soc" style={{ background: `${ac}12`, color: ac }} title={s.lbl}>
                      <svg viewBox="0 0 24 24"><path d={s.icon} fill="currentColor" /></svg>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── EDIT FORM ── */}
      <div className="cb-b">
        <div className="cb-hdr">
          <img src="/assets/images/logo.png" alt="DynamicNFC" style={{cursor:'pointer'}} onClick={() => navigate('/dashboard')} />
          <span>Edit Card</span>
        </div>

        {/* ── MOBILE WIZARD PROGRESS ── */}
        {isMobile && (
          <div className="cb-wiz-progress">
            <div className="cb-wiz-bar">
              <div className="cb-wiz-fill" style={{ width: `${(wizStep / TOTAL_WIZARD) * 100}%` }} />
            </div>
            <div className="cb-wiz-steps">
              {WIZARD_STEPS.map(ws => (
                <div key={ws.id} className={`cb-wiz-dot${wizStep >= ws.id ? ' active' : ''}`} onClick={() => setWizStep(ws.id)}>
                  <span>{wizStep > ws.id ? "\u2713" : ws.id}</span>
                </div>
              ))}
            </div>
            <div className="cb-wiz-step-label">
              Step {wizStep} of {TOTAL_WIZARD}: {WIZARD_STEPS[wizStep - 1]?.label}
            </div>
          </div>
        )}

        {/* ── DESKTOP: title + all sections ── */}
        {!isMobile && (<>
          <h2 className="cb-h">Edit Your Card</h2>
          <p className="cb-p">Update details below. Preview updates live.</p>
          {SectionPhotos()}
          {SectionIdentity()}
          {SectionContact()}
          {SectionSocial()}
          {SectionAppearance()}
          <div className="cb-acts">
            <button className="btn bp" disabled={saving || !card.name.trim()} onClick={() => { if (validate()) handleSave(); else { setTouched({ name:1, email:1, phone:1, web:1 }); notify("Fix errors.", "err"); } }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <a href={`/card/?hashId=${hashId}`} target="_blank" rel="noreferrer" className="btn bs" style={{ textDecoration: "none", textAlign: "center" }}>Preview Live Card</a>
            <button className="btn bo" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </>)}

        {/* ── MOBILE: wizard steps ── */}
        {isMobile && (<>
          {wizStep === 1 && SectionIdentity()}
          {wizStep === 2 && SectionContact()}
          {wizStep === 3 && SectionPhotos()}
          {wizStep === 4 && SectionSocial()}
          {wizStep === 5 && SectionAppearance()}

          <div className="cb-wiz-nav">
            <button className="btn bo" onClick={wizBack}>
              {wizStep === 1 ? "\u2190 Back" : "\u2190 Back"}
            </button>
            <button className="btn bp" disabled={saving} onClick={wizNext}>
              {wizStep < TOTAL_WIZARD
                ? `Next: ${WIZARD_STEPS[wizStep]?.label} \u2192`
                : saving ? "Saving..." : "Save Changes \u2713"
              }
            </button>
          </div>
          {wizStep > 1 && wizStep < TOTAL_WIZARD && (
            <button className="cb-wiz-skip" onClick={() => { setWizStep(wizStep + 1); window.scrollTo(0, 0); }}>
              Skip this step
            </button>
          )}
        </>)}
      </div>

      {toast && <div className={`tst${tType === "err" ? " te" : ""}${tExit ? " to" : ""}`}>{tType === "err" ? "\u26A0\uFE0F" : "\u2705"} {toast}</div>}
    </div>
  );
}
