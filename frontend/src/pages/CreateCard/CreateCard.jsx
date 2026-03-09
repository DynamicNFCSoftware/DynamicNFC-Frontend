import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const LOGO_L = "data:image/png;base64,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";
const LOGO_D = "data:image/png;base64,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D5u2m524vF0+EVRPrpnmfQwUziCCfRHuIP66MJEgM0NRyN/WS7+ovUcMBPhBnfjUgR+547veeOyX7dLU5N5b/O3XnHr1qW5tZtuVB5zC1tlXn9AqQiQ+q0d+zBRWbvKxo/XBual3454EBICIGRA1AAN/UNIzd/S5yvSxmecfyvhjO278dhR0Thx+iAgn990RddtzR/4CsHb2/gmikDa3xTro3y8xdEB7JBmAEARjGjW8NNVn//loulpc9vnvZy/Ye+TQr5pzRy+8+gv57ftn/3GoMz+FiLzWYkkfiymstPrU7RcvCUAEEAAIIAAB4Pmg8+VsEQB6zKmh8BnJPgkGKJ94berp+6cPP5grTu743F1hq/bu4d8x8Hq2cfLcLxB5kv3h7SBlSQCARPRJpgdD6UcDI8C9tbmvThQe33rZA61aAnpUmH9rN96IOmkaxszACgBmXn4kPcLbdfuPnZFLXn/0553S8TUd4VxTSMdkphc80W3G8P45whtRYCQKACpx8udOo9N3xJB650wvuuXUsZ8Wxn/oDTGwZn6z21pORvuighCAEerl6cZzD86+/AdY39Hr/8hblvPwxREArewXLpnTf1/qdy+xdInWfN/Sd659fuq87txAAw000EADfWIXYCHEgMJAAAB42223DSicR7uuD6H/ADMVaLvfMGWiAAAAAElFTkSuQmCC";
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
function qrFallbackUrl(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=1a1a1f&margin=16`;
}

const CC = [
  { c:"+971", f:"\u{1F1E6}\u{1F1EA}", n:"UAE" },    { c:"+966", f:"\u{1F1F8}\u{1F1E6}", n:"Saudi" },
  { c:"+974", f:"\u{1F1F6}\u{1F1E6}", n:"Qatar" },   { c:"+973", f:"\u{1F1E7}\u{1F1ED}", n:"Bahrain" },
  { c:"+968", f:"\u{1F1F4}\u{1F1F2}", n:"Oman" },    { c:"+965", f:"\u{1F1F0}\u{1F1FC}", n:"Kuwait" },
  { c:"+90",  f:"\u{1F1F9}\u{1F1F7}", n:"Turkey" },  { c:"+44",  f:"\u{1F1EC}\u{1F1E7}", n:"UK" },
  { c:"+1",   f:"\u{1F1FA}\u{1F1F8}", n:"US" },      { c:"+1",   f:"\u{1F1E8}\u{1F1E6}", n:"Canada" },
];

const SOC = [
  { key:"linkedin",  icon:"M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zM.02 24h4.96V7.99H.02V24zM8.18 7.99h4.76v2.18h.07c.66-1.26 2.28-2.58 4.69-2.58 5.02 0 5.94 3.3 5.94 7.59V24h-4.96v-7.82c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13V24H8.18V7.99z", lbl:"LinkedIn", base:"linkedin.com/in/", ph:"your-name" },
  { key:"facebook",  icon:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", lbl:"Facebook", base:"facebook.com/", ph:"yourpage" },
  { key:"instagram", icon:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", lbl:"Instagram", base:"instagram.com/", ph:"yourhandle" },
  { key:"twitter",   icon:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", lbl:"X / Twitter", base:"x.com/", ph:"handle" },
  { key:"whatsapp",  icon:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z", lbl:"WhatsApp", base:"wa.me/", ph:"971501234567" },
  { key:"telegram",  icon:"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z", lbl:"Telegram", base:"t.me/", ph:"username" },
  { key:"tiktok",    icon:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", lbl:"TikTok", base:"tiktok.com/@", ph:"username" },
  { key:"snapchat",  icon:"M12.017.512a6.452 6.452 0 0 1 4.863 2.028 7.153 7.153 0 0 1 1.681 4.986c-.03.518-.08 1.04-.15 1.57.45.198.903.31 1.354.31.227 0 .455-.032.68-.095.328-.09.515.15.46.477-.057.342-.376.69-.98.958-.148.065-.37.146-.65.235-.79.25-1.137.455-1.175.98-.013.177.03.368.118.57.65 1.498 1.628 2.632 2.933 3.37.22.124.437.224.65.3.46.163.576.5.303.87-.304.41-.913.656-1.565.76-.164.027-.274.163-.298.37-.026.22-.058.458-.094.71-.046.315-.258.42-.574.35a5.574 5.574 0 0 0-1.162-.148c-.4 0-.808.068-1.22.202-.537.175-.977.472-1.478.812-.87.59-1.854 1.258-3.488 1.3-.043 0-.087.002-.13.002-.044 0-.088-.002-.13-.002-1.634-.042-2.618-.71-3.488-1.3-.5-.34-.941-.637-1.478-.812a4.297 4.297 0 0 0-1.22-.202c-.413 0-.8.053-1.162.147-.316.07-.528-.034-.574-.35a21.46 21.46 0 0 0-.094-.71c-.024-.206-.134-.342-.298-.37-.652-.103-1.261-.35-1.565-.76-.273-.37-.157-.706.303-.87.213-.076.43-.176.65-.3 1.305-.738 2.283-1.872 2.933-3.37.088-.202.131-.393.118-.57-.038-.525-.385-.73-1.175-.98-.28-.089-.502-.17-.65-.235-.604-.268-.923-.616-.98-.958-.055-.327.132-.567.46-.477.225.063.453.095.68.095.45 0 .904-.112 1.353-.31a14.77 14.77 0 0 1-.15-1.57A7.153 7.153 0 0 1 7.154 2.54 6.452 6.452 0 0 1 12.017.512z", lbl:"Snapchat", base:"snapchat.com/add/", ph:"username" },
];

function socUrl(s, handle) { if (!handle) return ""; return "https://" + s.base + handle; }

const DEFAULT = {
  name:"", prefix:"", suffix:"", title:"", company:"", department:"",
  email:"", phoneCode:"+971", phoneNum:"", officePhoneCode:"+971", officePhoneNum:"",
  website:"", location:"", bio:"", licenseNo:"", languages:"",
  socials:{}, images:{ logo:null, profile:null, cover:null },
  logoFit:"contain", theme:"dark", accentColor:"#C5A467",
};

const TH = {
  dark:  { bg:"#0D0D0F", card:"#141416", text:"#FAFAF8", sub:"rgba(250,250,248,.6)", brd:"rgba(255,255,255,.08)" },
  light: { bg:"#F8F7F4", card:"#FFFFFF", text:"#1a1a1f", sub:"#666", brd:"rgba(0,0,0,.08)" },
  brand: { bg:"#0A1628", card:"#111827", text:"#F0F4F8", sub:"rgba(240,244,248,.6)", brd:"rgba(255,255,255,.1)" },
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

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@200;300;400;500;600;700&display=swap');
:root{--s:'Outfit',system-ui,sans-serif;--f:'Cormorant Garamond',Georgia,serif}
*{margin:0;padding:0;box-sizing:border-box}
.cb{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;font-family:var(--s)}
.cb-pv{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0D0D0F;overflow:hidden;padding:11rem 2rem 2rem}
.cb-pv-logo{position:absolute;top:2.5rem;left:50%;transform:translateX(-50%);width:60%;max-width:180px;z-index:20;pointer-events:none;filter:brightness(0) invert(1);opacity:.85}
.cb-pvbg{position:absolute;inset:0;opacity:.06;pointer-events:none}
.cb-pvbg::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 50%,rgba(197,164,103,.3),transparent 60%),radial-gradient(circle at 70% 30%,rgba(69,123,157,.2),transparent 50%)}
.cb-ph{position:relative;width:375px;border-radius:40px;background:#1C1C20;box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 2px rgba(255,255,255,.06);overflow:hidden;z-index:2}
.cb-phn{position:absolute;top:0;left:50%;transform:translateX(-50%);width:150px;height:28px;background:#1C1C20;border-radius:0 0 20px 20px;z-index:10}
.cb-phi{overflow-y:auto;max-height:700px;scrollbar-width:none}
.cb-phi::-webkit-scrollbar{display:none}
.c-cov{height:180px;background-size:cover;background-position:center;position:relative}
.c-cov-o{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 60%)}
.c-logo{position:absolute;bottom:12px;right:16px;width:64px;height:64px;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;z-index:10;border:2px solid;box-shadow:0 4px 10px rgba(0,0,0,0.2)}
.c-logo.ct{padding:6px}.c-logo.ct img{object-fit:contain!important}
.c-logo.cv img{object-fit:cover!important}
.c-logo img{width:100%;height:100%;object-fit:contain;display:block}
.c-logo-ph{font-size:.42rem;opacity:.2;letter-spacing:.05em;text-transform:uppercase}
.c-prof{position:absolute;bottom:-40px;left:20px;width:80px;height:80px;border-radius:50%;border:3px solid;background-size:cover;background-position:center;z-index:5;overflow:hidden;display:flex;align-items:center;justify-content:center}
.c-body{padding:3rem 1.25rem 1.5rem}
.c-nm{font-family:var(--f);font-size:1.5rem;font-weight:500;line-height:1.2;margin-bottom:.1rem}
.c-pre{font-size:.58rem;opacity:.45;margin-bottom:.05rem}
.c-ttl{font-size:.78rem;margin-bottom:.1rem}
.c-co{font-size:.68rem;opacity:.6;margin-bottom:.1rem}
.c-dept{font-size:.55rem;opacity:.38;margin-bottom:.2rem}
.c-bio{font-size:.66rem;line-height:1.5;opacity:.6;margin-bottom:.5rem}
.c-tags{display:flex;flex-wrap:wrap;gap:.25rem;margin-bottom:.6rem}
.c-tag{font-size:.48rem;padding:.1rem .4rem;border-radius:20px}
.c-div{height:1px;margin:.6rem 0;opacity:.1}
.c-rows{display:flex;flex-direction:column;gap:.35rem}
.c-row{display:flex;align-items:center;gap:.55rem;text-decoration:none;color:inherit;padding:.2rem .3rem;border-radius:7px;margin:0 -.3rem;transition:.15s}
.c-row:hover{background:rgba(255,255,255,.04)}
.c-ri{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.c-ri svg{width:11px;height:11px;fill:currentColor}
.c-rt{display:flex;flex-direction:column;min-width:0;justify-content:center;transform:translateY(-1.5px)}
.c-rl{font-size:.45rem;letter-spacing:.08em;text-transform:uppercase;opacity:.3;font-weight:500;line-height:1;margin-bottom:2px}
.c-rv{font-size:.7rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.1}
.c-socs{display:flex;gap:.3rem;margin-top:.6rem;flex-wrap:wrap}
.c-soc{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:.2s}
.c-soc:hover{transform:translateY(-2px)}
.c-soc svg{width:12px;height:12px;fill:currentColor}
.c-ft{padding:.4rem 1rem;text-align:center;font-size:.45rem;opacity:.18;letter-spacing:.04em}
.cb-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;padding-bottom:.8rem;border-bottom:1px solid rgba(0,0,0,.06)}
.cb-hdr img{height:28px; cursor:pointer}
.cb-hdr span{font-size:.52rem;color:rgba(0,0,0,.2);letter-spacing:.1em;text-transform:uppercase;font-weight:600}
.cb-b{background:#FAFAF8;color:#1a1a1f;overflow-y:auto;max-height:100vh;padding:2rem 2.5rem}
.cb-b::-webkit-scrollbar{width:4px}.cb-b::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:2px}
.cb-st{display:flex;gap:.65rem;margin-bottom:1.6rem;padding-bottom:1.1rem;border-bottom:1px solid rgba(0,0,0,.06)}
.cb-s{display:flex;align-items:center;gap:.35rem;font-size:.68rem;font-weight:500;color:rgba(0,0,0,.18);cursor:pointer;transition:.3s}
.cb-sn{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:600;border:2px solid rgba(0,0,0,.08);transition:.3s}
.cb-s.on{color:#1a1a1f}.cb-s.on .cb-sn{border-color:#e63946;background:#e63946;color:#fff}
.cb-s.dn{color:rgba(0,0,0,.38)}.cb-s.dn .cb-sn{border-color:#2ec4b6;background:#2ec4b6;color:#fff}
.cb-sl{flex:1;height:2px;background:rgba(0,0,0,.04)}
.cb-h{font-family:var(--f);font-size:1.45rem;font-weight:500;margin-bottom:.15rem}
.cb-p{font-size:.78rem;color:#888;font-weight:300;margin-bottom:1.4rem}
.cb-sec{margin-bottom:1.15rem}
.cb-lbl{display:flex;align-items:center;gap:.45rem;font-size:.52rem;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:rgba(0,0,0,.25);margin-bottom:.6rem}
.cb-lbl::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.06)}
.cb-ups{display:grid;grid-template-columns:repeat(3,1fr);gap:.45rem}
.cb-up{position:relative;border:2px dashed rgba(0,0,0,.1);border-radius:10px;padding:.65rem .35rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem;cursor:pointer;transition:.3s;text-align:center;min-height:70px;background:rgba(0,0,0,.008);overflow:hidden}
.cb-up:hover{border-color:#e63946;background:rgba(230,57,70,.03)}
.cb-up.has .upt{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:8px}
.cb-up.has .upo{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:.3s;border-radius:8px;color:#fff;font-size:.52rem}
.cb-up.has:hover .upo{opacity:1}
.upi{font-size:.95rem;opacity:.18}.upl{font-size:.52rem;color:rgba(0,0,0,.28);font-weight:500}
.cb-up input[type=file]{display:none}
.upr{position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:rgba(230,57,70,.9);color:#fff;border:none;font-size:.45rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:3;opacity:0;transition:.2s}
.cb-up:hover .upr{opacity:1}
.cb-g{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}
.cb-g .full{grid-column:span 2}
.cb-f{display:flex;flex-direction:column;gap:.12rem}
.cb-f label{font-size:.52rem;letter-spacing:.08em;text-transform:uppercase;font-weight:600;color:rgba(0,0,0,.3)}
.cb-f label .rq{color:#e63946;margin-left:2px}
.cb-f>input,.cb-f>textarea{width:100%;padding:.42rem .55rem;border:1px solid rgba(0,0,0,.1);border-radius:6px;font-family:var(--s);font-size:.74rem;color:#1a1a1f;background:#fff;transition:.2s;outline:none}
.cb-f>input:focus,.cb-f>textarea:focus{border-color:#457b9d;box-shadow:0 0 0 3px rgba(69,123,157,.08)}
.cb-f>textarea{resize:vertical;min-height:44px;font-size:.7rem}
.cb-f>input::placeholder,.cb-f>textarea::placeholder{color:rgba(0,0,0,.14)}
.cb-f.er>input,.cb-f.er>textarea,.cb-f.er .pw{border-color:#e63946!important;box-shadow:0 0 0 3px rgba(230,57,70,.06)!important}
.cb-em{font-size:.52rem;color:#e63946;margin-top:1px}
.cb-cc{font-size:.45rem;color:rgba(0,0,0,.15);text-align:right}
.pw{display:flex;align-items:stretch;border:1px solid rgba(0,0,0,.1);border-radius:6px;overflow:hidden;transition:.2s;background:#fff}
.pw:focus-within{border-color:#457b9d;box-shadow:0 0 0 3px rgba(69,123,157,.08)}
.pw>select{width:110px;flex:0 0 110px;border:none;background:#f5f4f2;padding:.42rem .2rem .42rem .4rem;font-family:var(--s);font-size:.68rem;color:#1a1a1f;cursor:pointer;outline:none;border-right:1px solid rgba(0,0,0,.06);-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23999'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 5px center;background-size:7px}
.pw>input{flex:1;min-width:0;border:none;padding:.42rem .55rem;font-family:var(--s);font-size:.76rem;color:#1a1a1f;outline:none;background:transparent;letter-spacing:.04em}
.pw>input::placeholder{color:rgba(0,0,0,.14)}
.cb-socs{display:flex;flex-direction:column;gap:.3rem}
.cb-srow{display:flex;align-items:center;gap:0}
.cb-si{width:24px;height:24px;border-radius:5px 0 0 5px;background:rgba(0,0,0,.03);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(0,0,0,.07);border-right:none}
.cb-si svg{width:11px;height:11px;fill:rgba(0,0,0,.2)}
.cb-sbase{font-size:.6rem;color:rgba(0,0,0,.3);white-space:nowrap;flex-shrink:0;padding:.35rem .15rem .35rem .3rem;background:rgba(0,0,0,.02);border:1px solid rgba(0,0,0,.07);border-left:none;border-right:none;font-family:var(--s)}
.cb-srow input{flex:1;min-width:0;padding:.35rem .45rem;border:1px solid rgba(0,0,0,.07);border-radius:0 5px 5px 0;font-family:var(--s);font-size:.72rem;outline:none;transition:.2s;border-left:none}
.cb-srow input:focus{border-color:#457b9d}
.cb-srow input::placeholder{color:rgba(0,0,0,.12)}
.cb-thm{display:flex;gap:.3rem;margin-bottom:.55rem}
.thb{flex:1;padding:.4rem;border:2px solid rgba(0,0,0,.05);border-radius:7px;font-size:.6rem;font-weight:500;cursor:pointer;text-align:center;transition:.3s;font-family:var(--s);background:#fff;color:#1a1a1f}
.thb.on{border-color:#e63946;background:rgba(230,57,70,.03)}
.cb-cls{display:flex;gap:.28rem;margin-bottom:.4rem}
.ccl{width:22px;height:22px;border-radius:50%;cursor:pointer;transition:.2s;border:3px solid transparent}
.ccl:hover{transform:scale(1.15)}.ccl.on{border-color:#1a1a1f;box-shadow:0 0 0 2px #fff,0 0 0 4px #1a1a1f}
.clf{display:flex;gap:.3rem;margin-top:.35rem;align-items:center}
.clf span{font-size:.52rem;color:rgba(0,0,0,.25)}
.clf button{padding:.22rem .45rem;font-size:.52rem;font-family:var(--s);border:1px solid rgba(0,0,0,.08);border-radius:4px;background:#fff;cursor:pointer;color:#1a1a1f}
.clf button.on{border-color:#e63946;background:rgba(230,57,70,.04);font-weight:600}
.cb-acts{display:flex;flex-direction:column;gap:.4rem;margin-top:1.15rem;padding-top:.9rem;border-top:1px solid rgba(0,0,0,.06)}
.btn{padding:.55rem 1rem;border:none;border-radius:7px;font-family:var(--s);font-size:.74rem;font-weight:600;cursor:pointer;transition:.3s;display:flex;align-items:center;justify-content:center;gap:.3rem;letter-spacing:.02em}
.btn:disabled{opacity:.3;cursor:not-allowed}
.bp{background:#e63946;color:#fff}.bp:not(:disabled):hover{background:#c1121f;transform:translateY(-1px);box-shadow:0 6px 20px rgba(230,57,70,.3)}
.bs{background:rgba(0,0,0,.04);color:#1a1a1f;border:1px solid rgba(0,0,0,.06)}.bs:hover{background:rgba(0,0,0,.07)}
.bo{background:transparent;color:#457b9d;border:1px solid rgba(69,123,157,.2)}.bo:hover{background:rgba(69,123,157,.04)}
.cb-qr{margin-top:.9rem;padding:1.1rem;background:rgba(0,0,0,.02);border:1px solid rgba(0,0,0,.06);border-radius:11px;text-align:center}
.cb-qr-h{font-size:.52rem;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:rgba(0,0,0,.25);margin-bottom:.7rem}
.cb-qr img{border-radius:6px;margin-bottom:.5rem}
.cb-qr-a{display:flex;gap:.3rem;justify-content:center;flex-wrap:wrap}
.cb-sum{padding:1rem;background:rgba(0,0,0,.02);border:1px solid rgba(0,0,0,.06);border-radius:11px;margin-bottom:.9rem}
.cb-sum h4{font-size:.52rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:rgba(0,0,0,.2);margin-bottom:.5rem}
.cb-sum-g{display:grid;grid-template-columns:1fr 1fr;gap:.35rem;font-size:.74rem}
.cb-sum-g>div>span:first-child{font-size:.48rem;color:rgba(0,0,0,.25);text-transform:uppercase;letter-spacing:.08em;display:block}
.cb-sum-g>div>span:last-child{font-weight:500}
.tst{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);padding:.55rem 1.2rem;background:#1a1a1f;color:#fff;border-radius:7px;font-size:.74rem;font-weight:500;z-index:100;animation:ti .3s;box-shadow:0 8px 30px rgba(0,0,0,.3);font-family:var(--s);display:flex;align-items:center;gap:.35rem}
.tst.te{background:#e63946}
@keyframes ti{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.tst.to{animation:tout .3s forwards}
@keyframes tout{to{opacity:0;transform:translateX(-50%) translateY(10px)}}
@media(max-width:1024px){.cb{grid-template-columns:1fr}.cb-pv{position:relative;height:auto;min-height:400px;order:1}.cb-b{order:2;max-height:none}.cb-ph{transform:scale(.8)}}
@media(max-width:600px){.cb-b{padding:1rem}.cb-g{grid-template-columns:1fr}.cb-g .full{grid-column:span 1}.cb-ups{grid-template-columns:1fr 1fr}.cb-ph{transform:scale(.65)}.cb-st{flex-wrap:wrap}.cb-sl{display:none}}
`;

export default function CreateCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [card, setCard] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem("dnfc_card_draft")); if (d?.name !== undefined) return { ...DEFAULT, ...d }; } catch {}
    return { ...DEFAULT };
  });
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [tType, setTT] = useState("ok");
  const [tExit, setTE] = useState(false);
  const [errs, setErrs] = useState({});
  const [touched, setTouched] = useState({});
  const [qrUrl, setQrUrl] = useState(null);
  const [savedCardId, setSavedCardId] = useState(null);
  const [qrLoading, setQL] = useState(false);

  useEffect(() => { const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); loadQR(); return () => document.head.removeChild(s); }, []);
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
      Object.keys(safeData).forEach(key => {
          if (safeData[key] === undefined) { delete safeData[key]; }
      });

      safeData.userId = user?.uid || user?.accountId || "unknown_user";
      safeData.userEmail = user?.email || "no_email";
      safeData.createdAt = serverTimestamp();

      const docRef = await addDoc(collection(db, "cards"), safeData);
      const newHashId = docRef.id;

      await loadQR();
      const url = `${window.location.origin}/card/?hashId=${newHashId}`;
      const img = makeQR(url) || qrFallbackUrl(url);

      setQrUrl(img);
      setSavedCardId(newHashId);
      setStep(3);
      notify("Card saved to Database successfully!");
      localStorage.removeItem("dnfc_card_draft"); 
    } catch (error) {
      console.error("Firestore Save Error:", error);
      notify("Failed to save card to database.", "err");
    } finally {
      setQL(false);
    }
  }, [card, validate, notify, user]);

  const dlVC = useCallback(() => {
    const fn = [card.prefix, card.name, card.suffix].filter(Boolean).join(" ");
    const ph = fullPh(card.phoneCode, card.phoneNum), op = fullPh(card.officePhoneCode, card.officePhoneNum);
    const l = ["BEGIN:VCARD","VERSION:3.0",`FN:${fn}`,`TITLE:${card.title}`,
      `ORG:${card.company}${card.department?";"+card.department:""}`,
      ph?`TEL;TYPE=CELL:${ph}`:"", op?`TEL;TYPE=WORK:${op}`:"",
      card.email?`EMAIL;TYPE=WORK:${card.email}`:"", card.website?`URL:${webHref(card.website)}`:"",
      card.location?`ADR;TYPE=WORK:;;${card.location}`:"", card.bio?`NOTE:${card.bio}`:"",
      card.licenseNo?`X-LICENSE:${card.licenseNo}`:"", card.languages?`X-LANGUAGES:${card.languages}`:"",
      `REV:${new Date().toISOString()}`];
    SOC.forEach(s => { if (card.socials[s.key]) l.push(`X-SOCIALPROFILE;TYPE=${s.key}:${socUrl(s, card.socials[s.key])}`); });
    l.push("END:VCARD");
    const blob = new Blob([l.filter(Boolean).join("\n")], { type: "text/vcard" });
    const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u;
    a.download = `${card.name.replace(/\s+/g,"_")||"card"}.vcf`; a.click(); URL.revokeObjectURL(u);
    notify("vCard downloaded!");
  }, [card, notify]);

  const reset = useCallback(() => {
    setCard({ ...DEFAULT }); setErrs({}); setTouched({}); setQrUrl(null);
    localStorage.removeItem("dnfc_card_draft"); setStep(1); notify("Reset.");
  }, [notify]);

  const th = TH[card.theme] || TH.dark;
  const ac = card.accentColor || "#C5A467";
  const ph = fullPh(card.phoneCode, card.phoneNum);
  const oph = fullPh(card.officePhoneCode, card.officePhoneNum);
  const fe = k => touched[k] ? errs[k] : null;

  return (
    <div className="cb">
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
              {(card.licenseNo || card.languages) && (
                <div className="c-tags">
                  {card.licenseNo && <span className="c-tag" style={{ background: `${ac}15`, color: ac }}>Lic: {card.licenseNo}</span>}
                  {card.languages && card.languages.split(",").map((l, i) => <span key={i} className="c-tag" style={{ background: `${ac}10`, color: th.sub }}>{l.trim()}</span>)}
                </div>
              )}
              <div className="c-div" style={{ background: th.text }} />
              <div className="c-rows">
                {card.email && <a href={`mailto:${card.email}`} className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.email} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Email</span><span className="c-rv" style={{ color: th.text }}>{card.email}</span></div></a>}
                {ph && <a href={`tel:${ph}`} className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.phone} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Mobile</span><span className="c-rv" style={{ color: th.text }}>{ph}</span></div></a>}
                {oph && <a href={`tel:${oph}`} className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.office} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Office</span><span className="c-rv" style={{ color: th.text }}>{oph}</span></div></a>}
                {card.website && <a href={webHref(card.website)} className="c-row" target="_blank" rel="noreferrer"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.web} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Website</span><span className="c-rv" style={{ color: th.text }}>{card.website}</span></div></a>}
                {card.location && <div className="c-row"><div className="c-ri" style={{ background: `${ac}18`, color: ac }}><svg viewBox="0 0 24 24"><path d={I.loc} fill="currentColor" /></svg></div><div className="c-rt"><span className="c-rl">Location</span><span className="c-rv" style={{ color: th.text }}>{card.location}</span></div></div>}
              </div>
              {SOC.filter(s => card.socials[s.key]).length > 0 && (
                <div className="c-socs">
                  {SOC.filter(s => card.socials[s.key]).map(s => (
                    <a key={s.key} href={socUrl(s, card.socials[s.key])} className="c-soc" style={{ background: `${ac}12`, color: ac }} target="_blank" rel="noreferrer" title={s.lbl}>
                      <svg viewBox="0 0 24 24"><path d={s.icon} fill="currentColor" /></svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="c-ft" style={{ borderTop: `1px solid ${th.brd}`, display:"flex", alignItems:"center", justifyContent:"center", padding:".5rem 1rem" }}><img src={LOGO_D} alt="DynamicNFC" style={{ height: 18, opacity: 0.4 }} /></div>
          </div>
        </div>
      </div>

      <div className="cb-b">
        <div className="cb-hdr">
          <img src={LOGO_L} alt="DynamicNFC" style={{cursor: 'pointer'}} onClick={() => navigate('/dashboard')} />
          <span>Card Builder</span>
        </div>
        <div className="cb-st">
          {[{ n: 1, l: "Design" }, { n: 2, l: "Preview" }, { n: 3, l: "Share" }].map((s, i) => (
            <React.Fragment key={s.n}>{i > 0 && <div className="cb-sl" />}<div className={`cb-s ${step === s.n ? "on" : step > s.n ? "dn" : ""}`} onClick={() => { if(s.n < step || (s.n===2 && validate())) setStep(s.n); }}><div className="cb-sn">{step > s.n ? "\u2713" : s.n}</div>{s.l}</div></React.Fragment>
          ))}
        </div>

        {step === 1 && (<>
          <h2 className="cb-h">Design Your Card</h2>
          <p className="cb-p">Fill in details \u2014 preview updates live.</p>

          <div className="cb-sec"><div className="cb-lbl">Images</div>
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

          <div className="cb-sec"><div className="cb-lbl">Personal</div>
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

          <div className="cb-sec"><div className="cb-lbl">Contact</div>
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
              <div className={`cb-f full${fe("web") ? " er" : ""}`}><label>Website</label><input value={card.website} onChange={e => upd("website", e.target.value)} onBlur={() => touch("web")} placeholder="mysite.com or dynamicnfc.ca" />{fe("web") && <div className="cb-em">{fe("web")}</div>}</div>
              <div className="cb-f full"><label>Location</label><input value={card.location} onChange={e => upd("location", e.target.value)} placeholder="Dubai, UAE" /></div>
            </div>
          </div>

          <div className="cb-sec"><div className="cb-lbl">Social ({SOC.filter(s => card.socials[s.key]).length} active)</div>
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

          <div className="cb-sec"><div className="cb-lbl">Appearance</div>
            <div className="cb-thm">{[{ k:"dark", l:"Dark" }, { k:"light", l:"Light" }, { k:"brand", l:"Brand" }].map(t => <button key={t.k} className={`thb${card.theme === t.k ? " on" : ""}`} onClick={() => upd("theme", t.k)}>{t.l}</button>)}</div>
            <div className="cb-cls">{ACS.map(c => <div key={c} className={`ccl${card.accentColor === c ? " on" : ""}`} style={{ background: c }} onClick={() => upd("accentColor", c)} />)}</div>
          </div>

          <div className="cb-acts">
            <button className="btn bp" disabled={!card.name.trim()} onClick={() => { if (validate()) setStep(2); else { setTouched({ name:1, email:1, phone:1, web:1 }); notify("Fix errors.", "err"); } }}>Continue to Preview \u2192</button>
            <button className="btn bo" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </>)}

        {step === 2 && (<>
          <h2 className="cb-h">Preview Your Card</h2>
          <p className="cb-p">Review the preview. All good?</p>
          <div className="cb-sum"><h4>Summary</h4>
            <div className="cb-sum-g">
              {[["Name", [card.prefix, card.name, card.suffix].filter(Boolean).join(" ")], ["Title", card.title], ["Company", card.company], ["Email", card.email], ["Mobile", ph], ["Office", oph], ["Website", card.website], ["Location", card.location]].map(([l, v], i) => v ? <div key={i}><span>{l}</span><span>{v}</span></div> : null)}
            </div>
          </div>
          <div className="cb-acts">
            <button className="btn bp" disabled={qrLoading} onClick={saveAndGenQR}>{qrLoading ? "Saving to Database..." : "Save Card & Generate QR \u2713"}</button>
            <button className="btn bo" onClick={() => setStep(1)}>{"\u2190"} Edit</button>
          </div>
        </>)}

        {step === 3 && (<>
          <h2 className="cb-h">Card Saved Successfully!</h2>
          <p className="cb-p">Your card is now live. Share it via QR or direct link.</p>
          {qrUrl && (
            <div className="cb-qr"><div className="cb-qr-h">Scan to View Card</div>
              <img src={qrUrl} alt="QR" style={{ width: 240, height: 240, borderRadius: 8 }} />
              <div style={{ fontSize: ".58rem", color: "rgba(0,0,0,.28)", marginBottom: ".5rem" }}>Works with any phone camera.</div>
              {savedCardId && (
                <div style={{ fontSize: ".62rem", color: "rgba(0,0,0,.35)", marginBottom: ".6rem", wordBreak: "break-all", padding: "0 .5rem" }}>
                  {window.location.origin}/card/?hashId={savedCardId}
                </div>
              )}
              <div className="cb-qr-a">
                <button className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem" }} onClick={() => { if (qrUrl.startsWith("data:")) { const a = document.createElement("a"); a.href = qrUrl; a.download = "card-qr.png"; a.click(); } else { window.open(qrUrl, "_blank"); } notify("QR saved!"); }}>{"\u2B07"} Save QR</button>
                {savedCardId && <button className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem" }} onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/card/?hashId=${savedCardId}`); notify("Link copied!"); }}>{"\u{1F517}"} Copy Link</button>}
                {savedCardId && <a href={`/card/?hashId=${savedCardId}`} target="_blank" rel="noreferrer" className="btn bs" style={{ fontSize: ".62rem", padding: ".3rem .65rem", textDecoration: "none" }}>{"\u{1F441}"} View Card</a>}
              </div>
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