import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

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

const SOC = [
  { key:"linkedin",  icon:"M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zM.02 24h4.96V7.99H.02V24zM8.18 7.99h4.76v2.18h.07c.66-1.26 2.28-2.58 4.69-2.58 5.02 0 5.94 3.3 5.94 7.59V24h-4.96v-7.82c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13V24H8.18V7.99z", base:"https://linkedin.com/in/", lbl:"LinkedIn" },
  { key:"facebook",  icon:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", base:"https://facebook.com/", lbl:"Facebook" },
  { key:"instagram", icon:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", base:"https://instagram.com/", lbl:"Instagram" },
  { key:"twitter",   icon:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", base:"https://x.com/", lbl:"X" },
  { key:"whatsapp",  icon:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z", base:"https://wa.me/", lbl:"WhatsApp" },
  { key:"telegram",  icon:"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z", base:"https://t.me/", lbl:"Telegram" },
  { key:"tiktok",    icon:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", base:"https://tiktok.com/@", lbl:"TikTok" },
  { key:"snapchat",  icon:"M12.017.512a6.452 6.452 0 0 1 4.863 2.028 7.153 7.153 0 0 1 1.681 4.986c-.03.518-.08 1.04-.15 1.57.45.198.903.31 1.354.31.227 0 .455-.032.68-.095.328-.09.515.15.46.477-.057.342-.376.69-.98.958-.148.065-.37.146-.65.235-.79.25-1.137.455-1.175.98-.013.177.03.368.118.57.65 1.498 1.628 2.632 2.933 3.37.22.124.437.224.65.3.46.163.576.5.303.87-.304.41-.913.656-1.565.76-.164.027-.274.163-.298.37-.026.22-.058.458-.094.71-.046.315-.258.42-.574.35a5.574 5.574 0 0 0-1.162-.148c-.4 0-.808.068-1.22.202-.537.175-.977.472-1.478.812-.87.59-1.854 1.258-3.488 1.3-.043 0-.087.002-.13.002-.044 0-.088-.002-.13-.002-1.634-.042-2.618-.71-3.488-1.3-.5-.34-.941-.637-1.478-.812a4.297 4.297 0 0 0-1.22-.202c-.413 0-.8.053-1.162.147-.316.07-.528-.034-.574-.35a21.46 21.46 0 0 0-.094-.71c-.024-.206-.134-.342-.298-.37-.652-.103-1.261-.35-1.565-.76-.273-.37-.157-.706.303-.87.213-.076.43-.176.65-.3 1.305-.738 2.283-1.872 2.933-3.37.088-.202.131-.393.118-.57-.038-.525-.385-.73-1.175-.98-.28-.089-.502-.17-.65-.235-.604-.268-.923-.616-.98-.958-.055-.327.132-.567.46-.477.225.063.453.095.68.095.45 0 .904-.112 1.353-.31a14.77 14.77 0 0 1-.15-1.57A7.153 7.153 0 0 1 7.154 2.54 6.452 6.452 0 0 1 12.017.512z", base:"https://snapchat.com/add/", lbl:"Snapchat" },
];

const TH = {
  dark:  { bg:"#0B0B0F", card:"#111116", text:"#FAFAF8", sub:"rgba(250,250,248,.58)", muted:"rgba(250,250,248,.42)", brd:"rgba(255,255,255,.06)", rowBg:"rgba(255,255,255,.03)", isDark: true },
  light: { bg:"#F5F4F0", card:"#FFFFFF", text:"#1a1a1f", sub:"rgba(26,26,31,.65)", muted:"rgba(26,26,31,.42)", brd:"rgba(0,0,0,.06)", rowBg:"rgba(0,0,0,.025)", isDark: false },
  brand: { bg:"#080E1A", card:"#0E1525", text:"#F0F4F8", sub:"rgba(240,244,248,.58)", muted:"rgba(240,244,248,.42)", brd:"rgba(255,255,255,.08)", rowBg:"rgba(255,255,255,.03)", isDark: true },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@400;500;600;700&display=swap');
:root{--s:'Outfit',system-ui,sans-serif;--f:'Cormorant Garamond',Georgia,serif}
*{margin:0;padding:0;box-sizing:border-box}
body{margin:0;font-family:var(--s);min-height:100vh;transition:background .4s}

/* ── PAGE LAYOUT: card left, QR right ── */
.sc-page{display:flex;justify-content:center;align-items:flex-start;gap:1.5rem;min-height:100vh;padding:2rem 1rem;transition:background .4s}

/* ── CARD COLUMN ── */
.sc-wrap{width:100%;max-width:440px;display:flex;flex-direction:column;overflow:hidden;border-radius:28px;transition:background .4s;flex-shrink:0}

/* ── QR COLUMN (right side) ── */
.sc-qr-side{position:sticky;top:2rem;width:260px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:1.25rem;padding:2rem 1.5rem;border-radius:24px;border:1px solid;transition:background .4s, border-color .4s}
.sc-qr-side img{border-radius:14px}
.sc-qr-name{font-family:var(--f);font-size:1.25rem;font-weight:500;text-align:center;line-height:1.2}
.sc-qr-title{font-size:.78rem;font-weight:500;text-align:center;margin-top:.15rem}
.sc-qr-divider{width:40px;height:1px}
.sc-qr-hint{font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;text-align:center}
.sc-qr-url{font-size:.58rem;word-break:break-all;text-align:center;padding:.4rem .6rem;border-radius:8px;line-height:1.5;margin-top:.25rem}
.sc-qr-actions{display:flex;flex-direction:column;gap:.5rem;width:100%;margin-top:.25rem}
.sc-qr-btn{width:100%;padding:.65rem;border-radius:12px;border:none;font-family:var(--s);font-size:.78rem;font-weight:600;cursor:pointer;transition:.3s;display:flex;align-items:center;justify-content:center;gap:.4rem;position:relative;overflow:hidden}
.sc-qr-btn:hover{transform:translateY(-1px)}
.sc-qr-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 50%);pointer-events:none}
.sc-qr-btn svg{width:15px;height:15px;fill:currentColor}
.sc-qr-btn-outline{width:100%;padding:.55rem;border-radius:10px;font-family:var(--s);font-size:.7rem;font-weight:500;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:.35rem;background:transparent}
.sc-qr-btn-outline:hover{transform:translateY(-1px)}
.sc-qr-btn-outline svg{width:14px;height:14px}
.sc-qr-powered{display:flex;align-items:center;gap:.4rem;margin-top:.5rem}
.sc-qr-powered img{height:16px}
.sc-qr-powered span{font-size:.55rem;letter-spacing:.04em}

/* ── COVER ── */
.sc-cover{height:260px;background-size:cover;background-position:center;position:relative;flex-shrink:0;border-radius:28px 28px 0 0}
.sc-cover-grad{position:absolute;inset:0;pointer-events:none;border-radius:28px 28px 0 0}
.sc-cover-noise{position:absolute;inset:0;opacity:.03;border-radius:28px 28px 0 0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── TOP ACTIONS ── */
.sc-top{position:absolute;top:1.25rem;right:1.25rem;z-index:10;display:flex;gap:.5rem}
.sc-top-btn{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.25);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.12);cursor:pointer;color:#fff;transition:.3s}
.sc-top-btn:hover{background:rgba(0,0,0,.45);transform:scale(1.08)}

/* ── AVATAR & LOGO ── */
.sc-avatar-area{position:absolute;bottom:-48px;left:24px;z-index:10}
.sc-avatar{width:96px;height:96px;border-radius:50%;border:3px solid;background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(0,0,0,.3);overflow:hidden}
.sc-avatar-letter{font-family:var(--f);font-size:2.5rem;font-weight:500;color:#fff}
.sc-logo-area{position:absolute;bottom:-24px;right:24px;z-index:10}
.sc-logo{width:56px;height:56px;border-radius:14px;border:2px solid;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.2)}
.sc-logo img{width:100%;height:100%;display:block}

/* ── BODY ── */
.sc-body{flex:1;padding:3.75rem 1.5rem 2rem;position:relative;z-index:5;border-radius:0 0 28px 28px;transition:background .4s, color .4s}

/* ── HEADER ── */
.sc-hdr{margin-bottom:1.75rem}
.sc-pre{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;font-weight:600;margin-bottom:.35rem}
.sc-name{font-family:var(--f);font-size:2rem;font-weight:500;line-height:1.1;margin-bottom:.4rem;letter-spacing:-.01em}
.sc-title{font-size:1rem;font-weight:500;margin-bottom:.25rem}
.sc-company{font-size:.85rem;margin-bottom:.75rem}
.sc-bio{font-size:.82rem;line-height:1.65;margin-bottom:.5rem}

/* ── TAGS ── */
.sc-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.5rem}
.sc-tag{font-size:.6rem;padding:.3rem .7rem;border-radius:50px;font-weight:500;letter-spacing:.04em}

/* ── CTA ── */
.sc-cta{margin-bottom:2rem}
.sc-cta-btn{width:100%;padding:1rem;border-radius:14px;border:none;font-family:var(--s);font-size:.9rem;font-weight:600;cursor:pointer;transition:.3s;display:flex;align-items:center;justify-content:center;gap:.5rem;letter-spacing:.02em;position:relative;overflow:hidden}
.sc-cta-btn:hover{transform:translateY(-2px)}
.sc-cta-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 50%);pointer-events:none}
.sc-cta-btn svg{width:18px;height:18px;fill:currentColor}

/* ── SECTION ── */
.sc-sec{margin-bottom:1.75rem}
.sc-sec-title{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;margin-bottom:.75rem;display:flex;align-items:center;gap:.75rem}
.sc-sec-title::after{content:'';flex:1;height:1px}

/* ── CONTACT ROWS ── */
.sc-rows{display:flex;flex-direction:column;gap:.5rem}
.sc-row{display:flex;align-items:center;gap:.85rem;padding:.85rem 1rem;border-radius:14px;text-decoration:none;transition:.2s;border:1px solid transparent}
.sc-row:hover{transform:translateX(4px)}
.sc-row-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sc-row-icon svg{width:16px;height:16px;fill:currentColor}
.sc-row-text{display:flex;flex-direction:column;min-width:0}
.sc-row-lbl{font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;font-weight:600;margin-bottom:.15rem}
.sc-row-val{font-size:.88rem;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ── SOCIALS ── */
.sc-socs{display:flex;gap:.5rem;flex-wrap:wrap}
.sc-soc{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:.25s;border:1px solid transparent}
.sc-soc:hover{transform:translateY(-3px) scale(1.05)}
.sc-soc svg{width:18px;height:18px;fill:currentColor}

/* ── OWNER DOCK ── */
.sc-dock{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(17,17,22,.75);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.1);box-shadow:0 16px 48px rgba(0,0,0,.6);border-radius:50px;padding:.4rem .8rem;display:flex;align-items:center;gap:.75rem;z-index:9999;animation:dockIn .6s cubic-bezier(.16,1,.3,1) forwards}
@keyframes dockIn{from{bottom:-80px;opacity:0}to{bottom:24px;opacity:1}}
.sc-dock-badge{display:flex;align-items:center;gap:.35rem;font-size:.62rem;font-weight:600;letter-spacing:1.5px;color:#fff;text-transform:uppercase;border-right:1px solid rgba(255,255,255,.15);padding-right:.75rem}
.sc-dock-dot{width:6px;height:6px;border-radius:50%;background:#e63946;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(230,57,70,.5)}50%{box-shadow:0 0 0 6px rgba(230,57,70,0)}}
.sc-dock-btn{background:transparent;border:none;color:rgba(255,255,255,.8);font-family:var(--s);font-size:.78rem;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:.35rem;transition:.2s;padding:.45rem .65rem;border-radius:10px}
.sc-dock-btn:hover{background:rgba(255,255,255,.1);color:#fff}

/* ── LOADING ── */
.sc-loading{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:var(--s);background:#0B0B0F}
.sc-spinner{width:40px;height:40px;border:2px solid rgba(255,255,255,.08);border-top-color:#e63946;border-radius:50%;animation:spin .8s linear infinite;margin-bottom:1rem}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.sc-anim{animation:fadeUp .6s ease forwards}
.sc-anim-d1{animation-delay:.1s;opacity:0}
.sc-anim-d2{animation-delay:.2s;opacity:0}
.sc-anim-d3{animation-delay:.3s;opacity:0}

/* ── RESPONSIVE: phone stacks vertically ── */
@media(max-width:760px){
  .sc-page{flex-direction:column;align-items:center;padding:0;gap:0}
  .sc-wrap{border-radius:0;max-width:100%}
  .sc-cover{border-radius:0}
  .sc-body{border-radius:0}
  .sc-qr-side{position:relative;top:0;width:100%;max-width:100%;border-radius:0;border-left:none;border-right:none;padding:2rem 1.5rem}
}
`;

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

    useEffect(() => {
        const fetchCard = async () => {
            if (!hashId) { setError("No card ID provided."); setLoading(false); return; }
            try {
                const docRef = doc(db, "cards", hashId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCardData(data);
                    const uid = user?.uid || user?.accountId;
                    if (!uid || uid !== data.userId) {
                        updateDoc(docRef, { scans: increment(1) }).catch(() => {});
                    }
                } else { setError("Card not found."); }
            } catch (err) { console.error(err); setError("Error loading card."); }
            finally { setLoading(false); }
        };
        fetchCard();
    }, [hashId, user]);

    const handleSaveContact = () => {
        if (!cardData) return;
        const c = cardData;
        const fn = [c.prefix, c.name, c.suffix].filter(Boolean).join(" ");
        const cph = c.phoneNum ? (c.phoneCode + " " + c.phoneNum) : "";
        const coph = c.officePhoneNum ? (c.officePhoneCode + " " + c.officePhoneNum) : "";
        const web = c.website ? (c.website.match(/^https?:\/\//) ? c.website : "https://" + c.website) : "";
        const l = ["BEGIN:VCARD", "VERSION:3.0", `FN:${fn}`, `TITLE:${c.title || ''}`,
            `ORG:${c.company || ''}${c.department ? ";" + c.department : ""}`,
            cph ? `TEL;TYPE=CELL:${cph}` : "", coph ? `TEL;TYPE=WORK:${coph}` : "",
            c.email ? `EMAIL;TYPE=WORK:${c.email}` : "", web ? `URL:${web}` : "",
            c.location ? `ADR;TYPE=WORK:;;${c.location}` : "",
            c.bio ? `NOTE:${c.bio}` : "",
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

    if (loading) return <div className="sc-loading"><style>{CSS}</style><div className="sc-spinner" /><span style={{ fontSize: '.85rem', opacity: .6 }}>Loading...</span></div>;
    if (error) return <div className="sc-loading"><style>{CSS}</style><div style={{ color: '#e63946', fontFamily: 'var(--f)', fontSize: '1.4rem', fontWeight: 500 }}>{error}</div></div>;
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
            <style>{CSS}</style>

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
                            <div className="sc-logo" style={{ borderColor: th.card, background: th.card }}>
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
                                    <a key={s.key} href={s.base + cardData.socials[s.key]} target="_blank" rel="noreferrer" className="sc-soc" style={{ background: `${ac}10`, color: ac, borderColor: `${ac}15` }} title={s.lbl}>
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

                <div className="sc-qr-hint" style={{ color: th.muted }}>Scan to view this card</div>

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
