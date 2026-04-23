import React, { useState, useEffect, useCallback } from "react";
import './CreateCard.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { jsPDF } from "jspdf";
import { SOC, CC, CARD_THEMES as TH } from '../../constants/cardConstants';
import SEO from '../../components/SEO/SEO';

const LOGO_L = "data:image/png;base64,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";
const LOGO_D = "data:image/png;base64,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3D5u2m524vF0+EVRPrpnmfQwUziCCfRHuIP66MJEgM0NRyN/WS7+ovUcMBPhBnfjUgR+547veeOyX7dLU5N5b/O3XnHr1qW5tZtuVB5zC1tlXn9AqQiQ+q0d+zBRWbvKxo/XBual3454EBICIGRA1AAN/UNIzd/S5yvSxmecfyvhjO278dhR0Thx+iAgn990RddtzR/4CsHb2/gmikDa3xTro3y8xdEB7JBmAEARjGjW8NNVn//loulpc9vnvZy/Ye+TQr5pzRy+8+gv57ftn/3GoMz+FiLzWYkkfiymstPrU7RcvCUAEEAAIIAAB4Pmg8+VsEQB6zKmh8BnJPgkGKJ94berp+6cPP5grTu743F1hq/bu4d8x8Hq2cfLcLxB5kv3h7SBlSQCARPRJpgdD6UcDI8C9tbmvThQe33rZA61aAnpUmH9rN96IOmkaxszACgBmXn4kPcLbdfuPnZFLXn/0553S8TUd4VxTSMdkphc80W3G8P45whtRYCQKACpx8udOo9N3xJB650wvuuXUsZ8Wxn/oDTGwZn6z21pORvuighCAEerl6cZzD86+/AdY39Hr/8hblvPwxREArewXLpnTf1/qdy+xdInWfN/Sd659fuq87txAAw000EADfWIXYCHEgMJAAAB42223DSicR7uuD6H/ADMVaLvfMGWiAAAAAElFTkSuQmCC";
const QR_CDN = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
let qrReady = false;
function loadQR() {
  return new Promise(res => {
    if (qrReady || window.qrcode) { qrReady = true; res(true); return; }
    const s = document.createElement("script"); s.src = QR_CDN;
    s.onload = () => { qrReady = true; res(true); };
    s.onerror = () => res(false);
    document.head.appendChild(s);
  });
}
function makeQR(text) {
  if (!window.qrcode) return null;
  try {
    const qr = window.qrcode(0, "M");
    qr.addData(text); qr.make();
    const n = qr.getModuleCount();
    const sc = Math.max(6, Math.floor(280 / n));
    const mg = sc * 2, sz = n * sc + mg * 2;
    const cv = document.createElement("canvas"); cv.width = sz; cv.height = sz;
    const cx = cv.getContext("2d");
    cx.fillStyle = "#fff"; cx.fillRect(0, 0, sz, sz);
    cx.fillStyle = "#1a1a1f";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) cx.fillRect(mg + c * sc, mg + r * sc, sc, sc);
    return cv.toDataURL();
  } catch { return null; }
}
function makeQRCanvas(text, size) {
  if (!window.qrcode) return null;
  try {
    const qr = window.qrcode(0, "M");
    qr.addData(text); qr.make();
    const n = qr.getModuleCount();
    const sc = Math.max(1, Math.floor(size / n));
    const mg = sc * 2, sz = n * sc + mg * 2;
    const cv = document.createElement("canvas"); cv.width = sz; cv.height = sz;
    const cx = cv.getContext("2d");
    cx.fillStyle = "#fff"; cx.fillRect(0, 0, sz, sz);
    cx.fillStyle = "#1a1a1f";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) cx.fillRect(mg + c * sc, mg + r * sc, sc, sc);
    return cv;
  } catch { return null; }
}
function makeQRSvg(text) {
  if (!window.qrcode) return null;
  try {
    const qr = window.qrcode(0, "M");
    qr.addData(text); qr.make();
    const n = qr.getModuleCount(), sc = 10, mg = 20, sz = n * sc + mg * 2;
    let rects = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) rects += `<rect x="${mg+c*sc}" y="${mg+r*sc}" width="${sc}" height="${sc}" fill="#1a1a1f"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}"><rect width="${sz}" height="${sz}" fill="#fff"/>${rects}</svg>`;
  } catch { return null; }
}
function qrFallbackUrl(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=1a1a1f&margin=16`;
}

function socUrl(s, handle) { if (!handle) return ""; return "https://" + s.base + handle; }

const TEMPLATES = [
  { id:"blank", label:"Blank", icon:"\u2795", desc:"Start from scratch", data:{} },
  { id:"realtor", label:"Real Estate", icon:"\u{1F3E0}", desc:"Agent / Broker", data:{ prefix:"", name:"Sarah Johnson", title:"Senior Property Advisor", company:"Vista Residences", department:"Luxury Sales", email:"sarah@vista.ae", phoneCode:"+971", location:"Dubai Marina, UAE", bio:"Helping clients find their dream home in Dubai since 2015.", licenseNo:"DLD-54321", languages:"English, Arabic", theme:"dark", accentColor:"#C5A467" } },
  { id:"auto", label:"Automotive", icon:"\u{1F697}", desc:"Sales / Showroom", data:{ name:"Khalid Al Rashid", title:"Sales Executive", company:"Prestige Motors", department:"Premium Vehicles", email:"khalid@prestige.ae", phoneCode:"+971", location:"Sheikh Zayed Rd, Dubai", bio:"Passionate about connecting clients with their perfect vehicle.", theme:"dark", accentColor:"#e63946" } },
  { id:"tech", label:"Tech / SaaS", icon:"\u{1F4BB}", desc:"Developer / PM", data:{ name:"Alex Chen", title:"Full Stack Developer", company:"NovaTech Solutions", department:"Engineering", email:"alex@novatech.io", website:"novatech.io", location:"San Francisco, CA", bio:"Building scalable web apps & cloud infrastructure.", languages:"English, Mandarin", theme:"brand", accentColor:"#6C63FF" } },
  { id:"creative", label:"Creative", icon:"\u{1F3A8}", desc:"Designer / Artist", data:{ name:"Mia Laurent", title:"Creative Director", company:"Studio Muse", department:"Design", email:"mia@studiomuse.co", website:"studiomuse.co", bio:"Award-winning brand & visual identity designer.", theme:"light", accentColor:"#FF6B6B" } },
  { id:"medical", label:"Medical", icon:"\u{2695}\u{FE0F}", desc:"Doctor / Clinic", data:{ prefix:"Dr.", name:"Ahmad Khaled", title:"Consultant Cardiologist", company:"City Medical Center", department:"Cardiology", email:"dr.ahmad@citymed.ae", phoneCode:"+971", location:"Healthcare City, Dubai", bio:"Board-certified cardiologist with 15+ years of experience.", licenseNo:"DHA-98765", languages:"English, Arabic", theme:"light", accentColor:"#2ec4b6" } },
  { id:"legal", label:"Legal", icon:"\u2696\u{FE0F}", desc:"Lawyer / Firm", data:{ name:"James Mitchell", suffix:"Esq.", title:"Managing Partner", company:"Mitchell & Associates", department:"Corporate Law", email:"james@mitchelllaw.com", website:"mitchelllaw.com", location:"DIFC, Dubai", bio:"Specializing in corporate M&A and international arbitration.", theme:"dark", accentColor:"#457b9d" } },
];

const DEFAULT = {
  name:"", prefix:"", suffix:"", title:"", company:"", department:"",
  email:"", phoneCode:"+1", phoneNum:"", officePhoneCode:"+1", officePhoneNum:"",
  website:"", location:"", bio:"", licenseNo:"", languages:"",
  socials:{}, images:{ logo:null, profile:null, cover:null, company:null },
  logoFit:"contain", theme:"dark", accentColor:"#C5A467",
};

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
function webHref(v) { if (!v) return ""; return v.match(/^https?:\/\//) ? v : "https://" + v; }

const MAX_IMG = 1*1024*1024;
const IMG_OK = ["image/jpeg","image/png","image/webp"];
const resizeImg = (file, maxW) => new Promise((res, rej) => {
  if (!IMG_OK.includes(file.type)) return rej("Use JPG, PNG, or WebP.");
  if (file.size > 5*1024*1024) return rej("Image too large. Please use under 5MB.");
  const r = new FileReader(); r.onerror = () => rej("Read failed.");
  r.onload = e => { const img = new Image(); img.onload = () => { const ratio = Math.min(maxW/img.width, maxW/img.height, 1); const w = Math.round(img.width*ratio), h = Math.round(img.height*ratio); const c = document.createElement("canvas"); c.width=w; c.height=h; c.getContext("2d").drawImage(img,0,0,w,h); res(c.toDataURL("image/jpeg",.80)); }; img.onerror = () => rej("Bad image."); img.src = e.target.result; };
  r.readAsDataURL(file);
});

const I = {
  email:"M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  phone:"M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  web:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  loc:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  office:"M19 2H5a2 2 0 00-2 2v14a2 2 0 002 2h4l3 3 3-3h4a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3.3L14.5 8H17v2h-3.36l-1.64.55V14H10v-3.45L7.67 10H5V8h3.2L12 5.3z",
  user:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
};

/* ═══ MOBILE WIZARD STEPS ═══ */
const WIZARD_STEPS = [
  { id: 1, label: "Identity",   icon: "\u{1F464}" },
  { id: 2, label: "Contact",    icon: "\u{1F4DE}" },
  { id: 3, label: "Photos",     icon: "\u{1F4F7}" },
  { id: 4, label: "Social",     icon: "\u{1F517}" },
  { id: 5, label: "Appearance", icon: "\u{1F3A8}" },
];
const TOTAL_WIZARD = WIZARD_STEPS.length;

export default function CreateCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [card, setCard] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem("dnfc_card_draft")); if (d?.name !== undefined) return { ...DEFAULT, ...d }; } catch {}
    return { ...DEFAULT };
  });
  const [step, setStep] = useState(1);       // main step: 1=design, 2=preview, 3=share
  const [wizStep, setWizStep] = useState(1);  // mobile wizard sub-step within step 1
  const [toast, setToast] = useState(null);
  const [tType, setTT] = useState("ok");
  const [tExit, setTE] = useState(false);
  const [errs, setErrs] = useState({});
  const [touched, setTouched] = useState({});
  const [qrUrl, setQrUrl] = useState(null);
  const [savedCardId, setSavedCardId] = useState(null);
  const [qrLoading, setQL] = useState(false);
  const [qrSize, setQrSize] = useState(512);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { loadQR(); }, []);
  useEffect(() => { localStorage.setItem("dnfc_card_draft", JSON.stringify(card)); }, [card]);

  const upd = useCallback((k, v) => setCard(p => ({ ...p, [k]: v })), []);
  const updSoc = useCallback((k, v) => setCard(p => ({ ...p, socials: { ...p.socials, [k]: v } })), []);
  const updImg = useCallback((k, v) => setCard(p => ({ ...p, images: { ...p.images, [k]: v } })), []);
  const notify = useCallback((msg, t = "ok") => { setTT(t); setTE(false); setToast(msg); setTimeout(() => { setTE(true); setTimeout(() => setToast(null), 300); }, 3500); }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!VL.name(card.name)) e.name = EM.name;
    if (card.email && !VL.email(card.email)) e.email = EM.email;
    if (card.phoneNum && !VL.phone(card.phoneNum)) e.phone = EM.phone;
    if (card.officePhoneNum && !VL.phone(card.officePhoneNum)) e.oPhone = EM.phone;
    if (card.website && !VL.web(card.website)) e.web = EM.web;
    setErrs(e); return Object.keys(e).length === 0;
  }, [card]);

  const touch = useCallback(k => setTouched(p => ({ ...p, [k]: true })), []);
  useEffect(() => { if (Object.keys(touched).length > 0) validate(); }, [card, touched, validate]);

  const onImg = useCallback(t => async e => {
    const f = e.target.files?.[0]; if (!f) return;
    try { updImg(t, await resizeImg(f, t === "cover" ? 1000 : 400)); } catch (err) { notify(String(err), "err"); }
    e.target.value = "";
  }, [updImg, notify]);
  
  const rmImg = useCallback(t => e => { e.preventDefault(); e.stopPropagation(); updImg(t, null); }, [updImg]);
  const onPhNum = useCallback(k => e => { upd(k, e.target.value.replace(/\D/g, "").slice(0, 10)); }, [upd]);

  const saveAndGenQR = useCallback(async () => {
    if (!validate()) { notify("Fix errors first.", "err"); return; }
    if (!user) { notify("You must be logged in to save.", "err"); return; }
    setQL(true);
    try {
      const safeData = { ...card };
      Object.keys(safeData).forEach(key => { if (safeData[key] === undefined) delete safeData[key]; });
      safeData.userId = user?.uid || user?.accountId || "unknown_user";
      safeData.userEmail = user?.email || "no_email";
      safeData.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, "cards"), safeData);
      const newHashId = docRef.id;
      await loadQR();
      const url = `${window.location.origin}/card/?hashId=${newHashId}`;
      const img = makeQR(url) || qrFallbackUrl(url);
      setQrUrl(img); setSavedCardId(newHashId); setStep(3);
      notify("Card saved successfully!");
      localStorage.removeItem("dnfc_card_draft"); 
    } catch (error) {
      console.error("Firestore Save Error:", error);
      notify("Failed to save card.", "err");
    } finally { setQL(false); }
  }, [card, validate, notify, user]);

  const reset = useCallback(() => {
    setCard({ ...DEFAULT }); setErrs({}); setTouched({}); setQrUrl(null);
    localStorage.removeItem("dnfc_card_draft"); setStep(1); setWizStep(1); notify("Reset.");
  }, [notify]);

  const applyTemplate = useCallback((tpl) => {
    if (tpl.id === "blank") { reset(); return; }
    setCard({ ...DEFAULT, ...tpl.data, socials: { ...DEFAULT.socials }, images: { ...DEFAULT.images } });
    setErrs({}); setTouched({}); setStep(1); setWizStep(1);
    notify(`Template "${tpl.label}" applied!`);
  }, [reset, notify]);

  const downloadQR = useCallback((fmt) => {
    if (!savedCardId) return;
    const url = `${window.location.origin}/card/?hashId=${savedCardId}`;
    if (fmt === "svg") {
      const svg = makeQRSvg(url);
      if (!svg) { notify("SVG generation failed.", "err"); return; }
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "card-qr.svg"; a.click(); URL.revokeObjectURL(a.href);
      notify("SVG downloaded!");
    } else if (fmt === "pdf") {
      const cv = makeQRCanvas(url, qrSize);
      if (!cv) { notify("PDF generation failed.", "err"); return; }
      const imgData = cv.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [90, 90] });
      const margin = 5;
      const imgW = 80, imgH = 80;
      pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
      pdf.save(`card-qr-${qrSize}.pdf`);
      notify(`PDF (${qrSize}px) downloaded!`);
    } else {
      const cv = makeQRCanvas(url, qrSize);
      if (!cv) { if (qrUrl) { const a = document.createElement("a"); a.href = qrUrl; a.download = `card-qr-${qrSize}.png`; a.click(); } notify("QR saved!"); return; }
      const a = document.createElement("a"); a.href = cv.toDataURL("image/png"); a.download = `card-qr-${qrSize}.png`; a.click();
      notify(`PNG (${qrSize}px) downloaded!`);
    }
  }, [savedCardId, qrSize, qrUrl, notify]);

  const th = TH[card.theme] || TH.dark;
  const ac = card.accentColor || "#C5A467";
  const ph = fullPh(card.phoneCode, card.phoneNum);
  const oph = fullPh(card.officePhoneCode, card.officePhoneNum);
  const fe = k => touched[k] ? errs[k] : null;

  /* ═══ MOBILE WIZARD NAV ═══ */
  const wizNext = () => {
    if (wizStep === 1 && !card.name.trim()) { setTouched({ name: 1 }); notify("Name is required.", "err"); return; }
    if (wizStep < TOTAL_WIZARD) { setWizStep(wizStep + 1); window.scrollTo(0, 0); }
    else {
      if (validate()) { setStep(2); window.scrollTo(0, 0); }
      else { setTouched({ name:1, email:1, phone:1, web:1 }); notify("Fix errors.", "err"); }
    }
  };
  const wizBack = () => {
    if (wizStep > 1) { setWizStep(wizStep - 1); window.scrollTo(0, 0); }
    else navigate('/dashboard');
  };

  /* ═══ FORM SECTIONS (reusable for both mobile wizard & desktop) ═══ */
  const SectionIdentity = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">Who are you?</h2>}
      {isMobile && <p className="cb-wiz-desc">Start with the basics.</p>}
      {!isMobile && <div className="cb-lbl">Personal</div>}
      <div className="cb-g">
        <div className="cb-f"><label>Prefix</label><input value={card.prefix} onChange={e => upd("prefix", e.target.value)} placeholder="Dr., Eng." /></div>
        <div className={`cb-f${fe("name") ? " er" : ""}`}><label>Full Name <span className="rq">*</span></label><input value={card.name} onChange={e => upd("name", e.target.value)} onBlur={() => touch("name")} placeholder="John Smith" />{fe("name") && <div className="cb-em">{fe("name")}</div>}</div>
        <div className="cb-f"><label>Suffix</label><input value={card.suffix} onChange={e => upd("suffix", e.target.value)} placeholder="MBA, CPA" /></div>
        <div className="cb-f"><label>Job Title</label><input value={card.title} onChange={e => upd("title", e.target.value)} placeholder="Senior Agent" /></div>
        <div className="cb-f full"><label>Company</label><input value={card.company} onChange={e => upd("company", e.target.value)} placeholder="Vista Properties" /></div>
        <div className="cb-f"><label>Department</label><input value={card.department} onChange={e => upd("department", e.target.value)} placeholder="Sales" /></div>
        <div className="cb-f"><label>License / ID</label><input value={card.licenseNo} onChange={e => upd("licenseNo", e.target.value)} placeholder="DLD-12345" /></div>
        <div className="cb-f full"><label>Short Bio</label><textarea value={card.bio} onChange={e => upd("bio", e.target.value.slice(0, 200))} placeholder="A few words..." rows={2} />{card.bio.length > 160 && <div className="cb-cc">{card.bio.length}/200</div>}</div>
        <div className="cb-f full"><label>Languages</label><input value={card.languages} onChange={e => upd("languages", e.target.value)} placeholder="English, Arabic, Turkish" /></div>
      </div>
    </div>
  );

  const SectionContact = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">How to reach you?</h2>}
      {isMobile && <p className="cb-wiz-desc">Add your contact details.</p>}
      {!isMobile && <div className="cb-lbl">Contact</div>}
      <div className="cb-g">
        <div className={`cb-f${fe("email") ? " er" : ""}`}><label>Email</label><input type="email" value={card.email} onChange={e => upd("email", e.target.value)} onBlur={() => touch("email")} placeholder="john@company.com" />{fe("email") && <div className="cb-em">{fe("email")}</div>}</div>
        <div className={`cb-f${fe("phone") ? " er" : ""}`}><label>Mobile Phone</label>
          <div className="pw">
            <select value={card.phoneCode} onChange={e => upd("phoneCode", e.target.value)}>
              {CC.map((c, i) => <option key={i} value={c.c}>{c.f} {c.n} {c.c}</option>)}
            </select>
            <input type="tel" inputMode="numeric" value={fmtPh(card.phoneNum)} onChange={onPhNum("phoneNum")} onBlur={() => touch("phone")} placeholder="501 234 5678" maxLength={14} />
          </div>
          {fe("phone") && <div className="cb-em">{fe("phone")}</div>}
        </div>
        <div className={`cb-f${fe("oPhone") ? " er" : ""}`}><label>Office Phone</label>
          <div className="pw">
            <select value={card.officePhoneCode} onChange={e => upd("officePhoneCode", e.target.value)}>
              {CC.map((c, i) => <option key={i} value={c.c}>{c.f} {c.n} {c.c}</option>)}
            </select>
            <input type="tel" inputMode="numeric" value={fmtPh(card.officePhoneNum)} onChange={onPhNum("officePhoneNum")} onBlur={() => touch("oPhone")} placeholder="4 123 4567" maxLength={14} />
          </div>
          {fe("oPhone") && <div className="cb-em">{fe("oPhone")}</div>}
        </div>
        <div className={`cb-f full${fe("web") ? " er" : ""}`}><label>Website</label><input value={card.website} onChange={e => upd("website", e.target.value)} onBlur={() => touch("web")} placeholder="mysite.com" />{fe("web") && <div className="cb-em">{fe("web")}</div>}</div>
        <div className="cb-f full"><label>Location</label><input value={card.location} onChange={e => upd("location", e.target.value)} placeholder="Vancouver, Canada" /></div>
      </div>
    </div>
  );

  const SectionPhotos = () => (
    <div className="cb-sec">
      {isMobile && <h2 className="cb-wiz-title">Add your photos</h2>}
      {isMobile && <p className="cb-wiz-desc">Upload a profile photo, logo, and cover image.</p>}
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
      {isMobile && <p className="cb-wiz-desc">Add your profiles. Skip if you prefer.</p>}
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
      {isMobile && <h2 className="cb-wiz-title">Choose your style</h2>}
      {isMobile && <p className="cb-wiz-desc">Pick a theme and accent color.</p>}
      {!isMobile && <div className="cb-lbl">Appearance</div>}
      <div className="cb-thm">{[{ k:"dark", l:"Dark" }, { k:"light", l:"Light" }, { k:"brand", l:"Brand" }].map(t => <button key={t.k} className={`thb${card.theme === t.k ? " on" : ""}`} onClick={() => upd("theme", t.k)}>{t.l}</button>)}</div>
      <div className="cb-cls">{ACS.map(c => <div key={c} className={`ccl${card.accentColor === c ? " on" : ""}`} style={{ background: c }} onClick={() => upd("accentColor", c)} />)}</div>
    </div>
  );

  /* ═══ PHONE PREVIEW — shared between mobile & desktop ═══ */
  const PhonePreview = () => (
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
          {(card.licenseNo || card.languages) && (
            <div className="c-tags">
              {card.licenseNo && <span className="c-tag" style={{ background: `${ac}15`, color: ac }}>Lic: {card.licenseNo}</span>}
              {card.languages && card.languages.split(",").map((l, i) => <span key={i} className="c-tag" style={{ background: `${ac}10`, color: th.sub }}>{l.trim()}</span>)}
            </div>
          )}
          <div className="c-div" style={{ background: th.text }} />
          <div className="c-rows">
            {card.email && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.email} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Email</span><span className="c-rv" style={{ color: th.text }}>{card.email}</span></div></div>}
            {ph && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.phone} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Mobile</span><span className="c-rv" style={{ color: th.text }}>{ph}</span></div></div>}
            {oph && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.office} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Office</span><span className="c-rv" style={{ color: th.text }}>{oph}</span></div></div>}
            {card.website && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.web} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Website</span><span className="c-rv" style={{ color: th.text }}>{card.website}</span></div></div>}
            {card.location && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.loc} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Location</span><span className="c-rv" style={{ color: th.text }}>{card.location}</span></div></div>}
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
        <div className="c-ft" style={{ borderTop: `1px solid ${th.brd}`, display:"flex", alignItems:"center", justifyContent:"center", padding:".5rem 1rem" }}><img src={LOGO_D} alt="DynamicNFC" style={{ height: 18, opacity: 0.4 }} /></div>
      </div>
    </div>
  );

  /* ═══ RENDER ═══ */
  return (
    <div className="cb">
      <SEO title="Create Digital Card" description="Design your free digital NFC business card with contact info, social links, and custom branding." path="/create-card" />
      {/* ── DESKTOP: phone preview (left panel) ── */}
      <div className="cb-pv"><div className="cb-pvbg" />
        <PhonePreview />
      </div>

      {/* ── FORM PANEL (right on desktop, full on mobile) ── */}
      <div className="cb-b">
        <div className="cb-hdr">
          <span>Card Builder</span>
        </div>

        {/* ── MOBILE WIZARD PROGRESS BAR ── */}
        {isMobile && step === 1 && (
          <div className="cb-wiz-progress">
            <div className="cb-wiz-bar">
              <div className="cb-wiz-fill" style={{ width: `${(wizStep / TOTAL_WIZARD) * 100}%` }} />
            </div>
            <div className="cb-wiz-steps">
              {WIZARD_STEPS.map(ws => (
                <div key={ws.id} className={`cb-wiz-dot${wizStep >= ws.id ? ' active' : ''}`}>
                  <span>{wizStep > ws.id ? "\u2713" : ws.id}</span>
                </div>
              ))}
            </div>
            <div className="cb-wiz-step-label">
              Step {wizStep} of {TOTAL_WIZARD}: {WIZARD_STEPS[wizStep - 1]?.label}
            </div>
          </div>
        )}

        {/* ── DESKTOP STEP INDICATOR ── */}
        {!isMobile && (
          <div className="cb-st">
            {[{ n: 1, l: "Design" }, { n: 2, l: "Preview" }, { n: 3, l: "Share" }].map((s, i) => (
              <React.Fragment key={s.n}>{i > 0 && <div className="cb-sl" />}<div className={`cb-s ${step === s.n ? "on" : step > s.n ? "dn" : ""}`} onClick={() => { if(s.n < step || (s.n===2 && validate())) setStep(s.n); }}><div className="cb-sn">{step > s.n ? "\u2713" : s.n}</div>{s.l}</div></React.Fragment>
            ))}
          </div>
        )}

        {/* ═══ STEP 1: DESIGN ═══ */}
        {step === 1 && (<>
          {!isMobile && (<>
            <h2 className="cb-h">Design Your Card</h2>
            <p className="cb-p">Fill in details — preview updates live.</p>
          </>)}

          {/* ── Template Picker ── */}
          {(isMobile ? wizStep === 1 : true) && !savedCardId && (
            <div className="cb-tpl">
              <div className="cb-lbl">Quick Start Templates</div>
              <div className="cb-tpl-grid">
                {TEMPLATES.map(tpl => (
                  <button key={tpl.id} className="cb-tpl-btn" onClick={() => applyTemplate(tpl)} title={tpl.desc}>
                    <span className="cb-tpl-icon">{tpl.icon}</span>
                    <span className="cb-tpl-lbl">{tpl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile: show only current wizard step */}
          {isMobile ? (
            <>
              {wizStep === 1 && SectionIdentity()}
              {wizStep === 2 && SectionContact()}
              {wizStep === 3 && SectionPhotos()}
              {wizStep === 4 && SectionSocial()}
              {wizStep === 5 && SectionAppearance()}

              {/* Mobile wizard nav buttons */}
              <div className="cb-wiz-nav">
                <button className="btn bo" onClick={wizBack}>
                  {wizStep === 1 ? "Cancel" : "\u2190 Back"}
                </button>
                <button className="btn bp" onClick={wizNext}>
                  {wizStep < TOTAL_WIZARD ? `Next: ${WIZARD_STEPS[wizStep]?.label} \u2192` : "Preview \u2192"}
                </button>
              </div>
              {wizStep > 1 && wizStep < TOTAL_WIZARD && (
                <button className="cb-wiz-skip" onClick={() => { setWizStep(wizStep + 1); window.scrollTo(0, 0); }}>
                  Skip this step
                </button>
              )}
            </>
          ) : (
            /* Desktop: show ALL sections at once (original layout) */
            <>
              {SectionPhotos()}
              {SectionIdentity()}
              {SectionContact()}
              {SectionSocial()}
              {SectionAppearance()}
              <div className="cb-acts">
                <button className="btn bp" disabled={!card.name.trim()} onClick={() => { if (validate()) setStep(2); else { setTouched({ name:1, email:1, phone:1, web:1 }); notify("Fix errors.", "err"); } }}>Continue to Preview {"\u2192"}</button>
                <button className="btn bo" onClick={() => navigate('/dashboard')}>Cancel</button>
              </div>
            </>
          )}
        </>)}

        {/* ═══ STEP 2: PREVIEW ═══ */}
        {step === 2 && (<>
          <h2 className="cb-h">Preview Your Card</h2>
          <p className="cb-p">Review the preview. All good?</p>

          {/* Mobile: show inline card preview */}
          {isMobile && (
            <div className="cb-mobile-preview">
              <PhonePreview />
            </div>
          )}

          <div className="cb-sum"><h4>Summary</h4>
            <div className="cb-sum-g">
              {[["Name", [card.prefix, card.name, card.suffix].filter(Boolean).join(" ")], ["Title", card.title], ["Company", card.company], ["Email", card.email], ["Mobile", ph], ["Office", oph], ["Website", card.website], ["Location", card.location]].map(([l, v], i) => v ? <div key={i}><span>{l}</span><span>{v}</span></div> : null)}
            </div>
          </div>
          <div className="cb-acts">
            <button className="btn bp" disabled={qrLoading} onClick={saveAndGenQR}>{qrLoading ? "Saving..." : "Save Card & Generate QR \u2713"}</button>
            <button className="btn bo" onClick={() => { setStep(1); if (isMobile) setWizStep(1); }}>{"\u2190"} Edit</button>
          </div>
        </>)}

        {/* ═══ STEP 3: SHARE ═══ */}
        {step === 3 && (<>
          <h2 className="cb-h">Card Saved!</h2>
          <p className="cb-p">Your card is live. Share it via QR or direct link.</p>
          {qrUrl && (
            <div className="cb-qr"><div className="cb-qr-h">Scan to View Card</div>
              <img src={qrUrl} alt="QR" style={{ width: 240, height: 240, borderRadius: 8 }} />
              <div style={{ fontSize: ".58rem", color: "rgba(0,0,0,.28)", marginBottom: ".5rem" }}>Works with any phone camera.</div>
              {savedCardId && (
                <div style={{ fontSize: ".62rem", color: "rgba(0,0,0,.35)", marginBottom: ".6rem", wordBreak: "break-all", padding: "0 .5rem" }}>
                  {window.location.origin}/card/?hashId={savedCardId}
                </div>
              )}
              <div className="cb-qr-dl">
                <div className="cb-qr-sz">
                  <span style={{ fontSize: ".5rem", color: "rgba(0,0,0,.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>Size</span>
                  {[256, 512, 1024].map(s => (
                    <button key={s} className={`cb-sz-btn${qrSize === s ? " on" : ""}`} onClick={() => setQrSize(s)}>{s}px</button>
                  ))}
                </div>
                <div className="cb-qr-a">
                  <button className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem" }} onClick={() => downloadQR("png")}>{"\u2B07"} PNG</button>
                  <button className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem" }} onClick={() => downloadQR("svg")}>{"\u2B07"} SVG</button>
                  <button className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem" }} onClick={() => downloadQR("pdf")}>{"\u2B07"} PDF</button>
                  {savedCardId && <button className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem" }} onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/card/?hashId=${savedCardId}`); notify("Link copied!"); }}>{"\u{1F517}"} Copy Link</button>}
                  {savedCardId && <a href={`/card/?hashId=${savedCardId}`} target="_blank" rel="noreferrer" className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem", textDecoration: "none" }}>{"\u{1F441}"} View Card</a>}
                </div>
              </div>
              {savedCardId && (
                <div className="cb-share">
                  <div style={{ fontSize: ".7rem", color: "rgba(0,0,0,.4)", marginBottom: ".4rem", fontWeight: 600 }}>Share on</div>
                  <div className="cb-share-btns">
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Check out my digital card: ${window.location.origin}/card/?hashId=${savedCardId}`)}`} target="_blank" rel="noreferrer" className="cb-share-btn" style={{ background: "#25D366" }} title="WhatsApp">
                      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#fff"/></svg>
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/card/?hashId=${savedCardId}`)}`} target="_blank" rel="noreferrer" className="cb-share-btn" style={{ background: "#0077B5" }} title="LinkedIn">
                      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zM.02 24h4.96V7.99H.02V24zM8.18 7.99h4.76v2.18h.07c.66-1.26 2.28-2.58 4.69-2.58 5.02 0 5.94 3.3 5.94 7.59V24h-4.96v-7.82c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13V24H8.18V7.99z" fill="#fff"/></svg>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my digital card`)}&url=${encodeURIComponent(`${window.location.origin}/card/?hashId=${savedCardId}`)}`} target="_blank" rel="noreferrer" className="cb-share-btn" style={{ background: "#1DA1F2" }} title="Twitter">
                      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff"/></svg>
                    </a>
                    <button className="cb-share-btn" style={{ background: "#6b7280" }} title="Email" onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(`My Digital Card`)}&body=${encodeURIComponent(`Check out my digital card: ${window.location.origin}/card/?hashId=${savedCardId}`)}`; }}>
                      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#fff"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="cb-acts">
            <button className="btn bp" onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
            <button className="btn bo" onClick={reset}>Create Another Card</button>
          </div>
        </>)}
      </div>

      {toast && <div className={`tst${tType === "err" ? " te" : ""}${tExit ? " to" : ""}`}>{tType === "err" ? "\u26A0\uFE0F" : "\u2705"} {toast}</div>}
    </div>
  );
}

