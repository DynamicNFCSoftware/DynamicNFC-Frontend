import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// VIP PORTAL — Khalid Al-Rashid (Gulf Luxury + Full Functionality)
// ═══════════════════════════════════════════════════════════════
// Every user action is tracked → Dashboard reads these events
// Actions: view_unit, download_brochure, request_pricing,
//          book_viewing, explore_payment, compare_units,
//          view_floorplan, contact_advisor
// ═══════════════════════════════════════════════════════════════

// ─── Tracking Engine ────────────────────────────────────────────
const trackEvent = (eventType, data = {}) => {
  const event = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    vipId: "KR-001",
    vipName: "Khalid Al-Rashid",
    portalType: "vip",
    event: eventType,
    ...data,
  };
  const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
  events.push(event);
  localStorage.setItem("dnfc_events", JSON.stringify(events));
  console.log(`[TRACK] ${eventType}`, data);
  return event;
};

// ─── Property Data ──────────────────────────────────────────────
const UNITS = [
  {
    id: "SKY-PH-01",
    name: { en: "Sky Penthouse", ar: "بنتهاوس السماء" },
    floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤" },
    beds: { en: "4 Bedrooms", ar: "٤ غرف نوم" },
    baths: { en: "5 Bathrooms", ar: "٥ حمامات" },
    size: { en: "6,200 sq ft", ar: "٦,٢٠٠ قدم²" },
    price: 12500000,
    priceDisplay: { en: "AED 12,500,000", ar: "١٢,٥٠٠,٠٠٠ درهم" },
    perSqft: { en: "AED 2,016/sq ft", ar: "٢,٠١٦ درهم/قدم²" },
    feature: { en: "360° Panoramic Views", ar: "إطلالة بانورامية ٣٦٠°" },
    status: { en: "Available", ar: "متاح" },
    desc: {
      en: "A triple-height masterpiece crowning the tower. Private infinity pool, direct elevator access, Gaggenau kitchen, Italian marble throughout, and a wraparound terrace with unobstructed views of the Arabian Gulf.",
      ar: "تحفة معمارية بارتفاع ثلاثي تتوّج البرج. مسبح إنفينيتي خاص، مصعد مباشر، مطبخ غاغيناو، رخام إيطالي في كل مكان، وتراس محيطي بإطلالات خلابة على الخليج العربي.",
    },
    features: {
      en: ["Private Pool", "Smart Home", "Wine Cellar", "Staff Quarters", "Private Garage"],
      ar: ["مسبح خاص", "منزل ذكي", "قبو نبيذ", "غرف الخدم", "مرآب خاص"],
    },
    img: "/assets/images/vip-portal/sky-penthouse-card.jpg",
    gallery: [
      "/assets/images/vip-portal/sky-penthouse-1.jpg",
      "/assets/images/vip-portal/sky-penthouse-2.jpg",
      "/assets/images/vip-portal/sky-penthouse-3.jpg",
    ],
    payment: { down: 10, during: 50, handover: 40 },
  },
  {
    id: "GR-35-01",
    name: { en: "Grand Residence", ar: "الإقامة الكبرى" },
    floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨" },
    beds: { en: "3 Bedrooms", ar: "٣ غرف نوم" },
    baths: { en: "4 Bathrooms", ar: "٤ حمامات" },
    size: { en: "4,100 sq ft", ar: "٤,١٠٠ قدم²" },
    price: 7800000,
    priceDisplay: { en: "AED 7,800,000", ar: "٧,٨٠٠,٠٠٠ درهم" },
    perSqft: { en: "AED 1,902/sq ft", ar: "١,٩٠٢ درهم/قدم²" },
    feature: { en: "Marina & Sea View", ar: "إطلالة على المارينا والبحر" },
    status: { en: "Available", ar: "متاح" },
    desc: {
      en: "Expansive living with floor-to-ceiling glazing, Italian marble throughout, a private terrace overlooking the marina, and a chef's kitchen with Miele appliances.",
      ar: "مساحة واسعة مع زجاج من الأرض إلى السقف، رخام إيطالي، تراس خاص يطل على المارينا، ومطبخ الشيف بأجهزة ميلي.",
    },
    features: {
      en: ["Marina View", "Maid's Room", "Walk-in Closet", "Home Office", "Balcony"],
      ar: ["إطلالة المارينا", "غرفة الخادمة", "غرفة ملابس", "مكتب منزلي", "شرفة"],
    },
    img: "/assets/images/vip-portal/grand-residence-card.jpg",
    gallery: [
      "/assets/images/vip-portal/grand-residence-1.jpg",
      "/assets/images/vip-portal/grand-residence-2.jpg",
      "/assets/images/vip-portal/grand-residence-3.jpg",
    ],
    payment: { down: 10, during: 50, handover: 40 },
  },
  {
    id: "EX-25-01",
    name: { en: "Executive Suite", ar: "الجناح التنفيذي" },
    floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠" },
    beds: { en: "2 Bedrooms", ar: "غرفتا نوم" },
    baths: { en: "3 Bathrooms", ar: "٣ حمامات" },
    size: { en: "2,800 sq ft", ar: "٢,٨٠٠ قدم²" },
    price: 4200000,
    priceDisplay: { en: "AED 4,200,000", ar: "٤,٢٠٠,٠٠٠ درهم" },
    perSqft: { en: "AED 1,500/sq ft", ar: "١,٥٠٠ درهم/قدم²" },
    feature: { en: "City Skyline View", ar: "إطلالة على أفق المدينة" },
    status: { en: "Last 3 Units", ar: "آخر ٣ وحدات" },
    desc: {
      en: "Refined elegance for the modern executive. Featuring a dedicated home office, walk-in wardrobe, chef's kitchen with Bosch appliances, and floor-to-ceiling windows framing the city skyline.",
      ar: "أناقة راقية للتنفيذي العصري. يتميز بمكتب منزلي مخصص، غرفة ملابس، مطبخ الشيف بأجهزة بوش، ونوافذ من الأرض إلى السقف تؤطر أفق المدينة.",
    },
    features: {
      en: ["City View", "Home Office", "Gym Access", "Concierge", "Smart Lock"],
      ar: ["إطلالة المدينة", "مكتب منزلي", "صالة رياضة", "كونسيرج", "قفل ذكي"],
    },
    img: "/assets/images/vip-portal/exec-suite-card.jpg",
    gallery: [
      "/assets/images/vip-portal/exec-suite-1.jpg",
      "/assets/images/vip-portal/exec-suite-2.jpg",
      "/assets/images/vip-portal/exec-suite-3.jpg",
    ],
    payment: { down: 15, during: 45, handover: 40 },
  },
];

const AMENITIES = [
  { icon: "🏊", en: "Infinity Pool", ar: "مسبح إنفينيتي", descEn: "60m rooftop pool with panoramic Gulf views", descAr: "مسبح على السطح بطول ٦٠ متر مع إطلالات بانورامية" },
  { icon: "🧖", en: "Spa & Wellness", ar: "سبا وعافية", descEn: "Full-service spa with hammam & cryo chamber", descAr: "سبا متكامل مع حمام تركي وغرفة تبريد" },
  { icon: "🍽️", en: "Private Dining", ar: "مطعم خاص", descEn: "Michelin-standard resident-only restaurant", descAr: "مطعم حصري للسكان بمعايير ميشلان" },
  { icon: "🏋️", en: "Fitness Atelier", ar: "صالة لياقة", descEn: "Technogym-equipped with personal trainers", descAr: "مجهزة بأحدث أجهزة تكنوجيم مع مدربين" },
  { icon: "🛥️", en: "Marina Access", ar: "مرسى خاص", descEn: "Private berths for yachts up to 60ft", descAr: "أرصفة خاصة لليخوت حتى ٦٠ قدم" },
  { icon: "🌿", en: "Sky Gardens", ar: "حدائق سماوية", descEn: "Landscaped terraces on every 10th floor", descAr: "شرفات منسقة كل ١٠ طوابق" },
  { icon: "👶", en: "Kids Club", ar: "نادي الأطفال", descEn: "Supervised play areas & learning center", descAr: "مناطق لعب مراقبة ومركز تعليمي" },
  { icon: "🚗", en: "Valet Parking", ar: "خدمة صف السيارات", descEn: "24/7 valet with EV charging stations", descAr: "خدمة صف ٢٤/٧ مع محطات شحن كهربائية" },
];

// ─── Styles ─────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
:root {
  --gold:#C5A467;--gold-lt:#D4B97A;--gold-glow:rgba(197,164,103,.12);
  --gold-bdr:rgba(197,164,103,.25);--ch:#0D0D0F;--ch2:#141416;
  --sl:#1C1C20;--t1:#FAFAF8;--t2:rgba(250,250,248,.85);--t3:rgba(250,250,248,.58);
  --gl:rgba(255,255,255,.04);--glb:rgba(255,255,255,.08);
  --se:'Cormorant Garamond',Georgia,serif;--sa:'Outfit',system-ui,sans-serif;
  --red:#C1121F;--green:#2A9D5C;
}
*{margin:0;padding:0;box-sizing:border-box}

/* ── GLOBAL OVERRIDE: Reset all inherited styles inside .vl ── */
.vl,.vl *{color:#FAFAF8;font-family:'Outfit',system-ui,sans-serif;line-height:1.5}
.vl h1,.vl h2,.vl h3,.vl h4,.vl h5,.vl h6{color:#FAFAF8 !important;font-family:'Cormorant Garamond',Georgia,serif !important;margin:0;padding:0}
.vl p,.vl span,.vl div,.vl label,.vl a{color:inherit}
.vl img{max-width:100%;display:block}
.vl button{font-family:'Outfit',system-ui,sans-serif}
html{scroll-behavior:smooth}
body{font-family:'Outfit',system-ui,sans-serif;background:var(--ch);color:#FAFAF8 !important;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.vl{min-height:100vh;background:var(--ch)}

/* ── NAV ── */
.vl-hd{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.1rem 3rem;display:flex;align-items:center;justify-content:space-between;transition:.5s}
.vl-hd.sc{background:rgba(13,13,15,.94);backdrop-filter:blur(20px);border-bottom:1px solid var(--glb);padding:.8rem 3rem}
.vl-logo{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.4rem;font-weight:400;letter-spacing:.15em;color:#C5A467 !important;text-transform:uppercase}
.vl-logo b{font-weight:600;color:#FAFAF8 !important}
.vl-nav{display:flex;align-items:center;gap:1.5rem}
.vl-badge{display:flex;align-items:center;gap:.5rem;padding:.45rem 1rem;border:1px solid var(--gold-bdr);border-radius:100px;font-size:.75rem;letter-spacing:.08em;color:#C5A467 !important;text-transform:uppercase}
.vl-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--gold);animation:gl 2s infinite}
@keyframes gl{0%,100%{opacity:1;box-shadow:0 0 4px var(--gold)}50%{opacity:.5;box-shadow:0 0 12px var(--gold)}}
.vl-lbtn{background:0;border:1px solid var(--glb);color:rgba(250,250,248,.85) !important;padding:.4rem .9rem;border-radius:6px;font-family:'Outfit',system-ui,sans-serif;font-size:.78rem;cursor:pointer;transition:.3s;letter-spacing:.04em}
.vl-lbtn:hover{border-color:var(--gold-bdr);color:#C5A467 !important}

/* ── HERO ── */
.vl-hero{position:relative;height:100vh;min-height:650px;display:flex;align-items:flex-end;overflow:hidden}
.vl-hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.05);animation:hz 20s ease-in-out infinite alternate}
@keyframes hz{from{transform:scale(1.05)}to{transform:scale(1.12)}}
.vl-hero-ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,13,15,.25) 0%,rgba(13,13,15,.5) 40%,rgba(13,13,15,.93) 85%,var(--ch) 100%)}
.vl-hero-ct{position:relative;z-index:2;padding:0 4rem 4.5rem;max-width:850px;animation:fu 1.2s ease-out}
@keyframes fu{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
.vl-pvt{display:inline-flex;align-items:center;gap:.6rem;padding:.5rem 1.3rem;border:1px solid var(--gold-bdr);border-radius:100px;margin-bottom:1.5rem;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#C5A467 !important;background:rgba(197,164,103,.07);backdrop-filter:blur(10px)}
.vl-pvt::before{content:'◆';font-size:.45rem}
.vl-greet{font-size:1.1rem;font-weight:400;color:rgba(250,250,248,.85) !important;margin-bottom:.4rem;letter-spacing:.04em;text-shadow:0 1px 8px rgba(0,0,0,0.4)}
.vl-greet span{color:#C5A467 !important;font-weight:500}
.vl-htitle{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2.5rem,5.5vw,5rem);font-weight:400;line-height:1.05;margin-bottom:1.2rem;color:#FAFAF8 !important;text-shadow:0 2px 20px rgba(0,0,0,0.5)}
.vl-htitle em{font-style:italic;color:#C5A467 !important}
.vl-hdesc{font-size:1.05rem;font-weight:400;line-height:1.7;color:rgba(250,250,248,.85) !important;max-width:580px;margin-bottom:2rem;text-shadow:0 1px 8px rgba(0,0,0,0.4)}
.vl-hacts{display:flex;gap:1rem;flex-wrap:wrap}

/* ── BUTTONS ── */
.vl .btn-g{display:inline-flex;align-items:center;gap:.6rem;padding:.9rem 2.2rem;background:linear-gradient(135deg,#C5A467,#D4B97A);color:#0D0D0F !important;font-family:'Outfit',system-ui,sans-serif;font-size:.82rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;border:none;border-radius:4px;cursor:pointer;transition:.4s cubic-bezier(.4,0,.2,1);white-space:nowrap}
.vl .btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(197,164,103,.35)}
.vl .btn-o{display:inline-flex;align-items:center;gap:.6rem;padding:.9rem 2.2rem;background:transparent;color:#C5A467 !important;font-family:'Outfit',system-ui,sans-serif;font-size:.82rem;font-weight:400;letter-spacing:.1em;text-transform:uppercase;border:1px solid rgba(197,164,103,.25);border-radius:4px;cursor:pointer;transition:.4s;white-space:nowrap}
.vl .btn-o:hover{background:rgba(197,164,103,.12);border-color:#C5A467}
.btn-sm{padding:.6rem 1.4rem;font-size:.75rem}
.btn-danger{background:var(--red);color:#fff;border:none}
.btn-danger:hover{opacity:.9;transform:translateY(-1px)}

/* ── STATS ── */
.vl-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--glb);border-bottom:1px solid var(--glb);background:var(--ch2)}
.vl-st{padding:2.2rem 1.5rem;text-align:center;border-right:1px solid var(--glb);transition:.3s;cursor:default}
[dir=rtl] .vl-st{border-right:none;border-left:1px solid var(--glb)}
.vl-st:last-child{border:none}
.vl-st:hover{background:var(--gl)}
.vl-stv{font-family:'Cormorant Garamond',Georgia,serif;font-size:2.2rem;font-weight:400;color:#C5A467 !important;line-height:1;margin-bottom:.4rem}
.vl-stl{font-size:.75rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(250,250,248,.58) !important}

/* ── SECTION ── */
.vl-sec{padding:5rem 4rem}
.vl-sh{text-align:center;margin-bottom:3.5rem}
.vl-sl{font-size:.78rem;letter-spacing:.25em;text-transform:uppercase;color:#C5A467 !important;margin-bottom:.8rem;display:block;font-weight:500}
.vl-st2{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,3rem);font-weight:400;color:#FFFFFF !important;margin-bottom:.6rem}
.vl-ss{font-size:1rem;font-weight:400;color:rgba(250,250,248,.85) !important}

/* ── UNIT CARDS ── */
.vl-units{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:1200px;margin:0 auto}
.vl-card{background:var(--ch2);border:1px solid var(--glb);border-radius:8px;overflow:hidden;cursor:pointer;transition:.5s;position:relative}
.vl-card:hover{border-color:var(--gold-bdr);transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.vl-card-img{position:relative;height:220px;overflow:hidden}
.vl-card-img img{width:100%;height:100%;object-fit:cover;transition:.6s}
.vl-card:hover .vl-card-img img{transform:scale(1.08)}
.vl-card-badge{position:absolute;top:1rem;left:1rem;padding:.35rem .8rem;background:rgba(13,13,15,.8);backdrop-filter:blur(8px);border:1px solid var(--gold-bdr);border-radius:4px;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:#C5A467 !important}
[dir=rtl] .vl-card-badge{left:auto;right:1rem}
.vl-card-status{position:absolute;top:1rem;right:1rem;padding:.3rem .7rem;border-radius:4px;font-size:.65rem;font-weight:500;letter-spacing:.05em}
[dir=rtl] .vl-card-status{right:auto;left:1rem}
.status-avail{background:#2A9D5C;color:#FFFFFF !important;border:none}
.status-last{background:#C1121F;color:#FFFFFF !important;border:none}
.vl-card-body{padding:1.5rem}
.vl-card-name{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.4rem;font-weight:500;margin-bottom:.3rem;color:#FFFFFF !important}
.vl .vl-card-floor{font-size:.75rem;color:#C5A467 !important;letter-spacing:.08em;text-transform:uppercase;margin-bottom:1rem}
.vl .vl-card-meta{display:flex;gap:1.5rem;margin-bottom:1rem;font-size:.88rem;color:rgba(250,250,248,.9) !important}
.vl .vl-card-meta span{display:flex;align-items:center;gap:.3rem;color:rgba(250,250,248,.9) !important}
.vl .vl-card-price{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.5rem;font-weight:600;color:#C5A467 !important;margin-bottom:.3rem}
.vl .vl-card-sqft{font-size:.8rem;color:rgba(250,250,248,.6) !important}
.vl-card-actions{display:flex;gap:.5rem;padding:1rem 1.5rem;border-top:1px solid var(--glb);flex-wrap:wrap}

/* ── MODAL (Unit Detail) ── */
.vl-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:2rem;animation:mfade .3s}
@keyframes mfade{from{opacity:0}to{opacity:1}}
.vl-modal{background:var(--ch2);border:1px solid var(--glb);border-radius:12px;max-width:1000px;width:100%;max-height:90vh;overflow-y:auto;position:relative;animation:mslide .4s ease-out}
@keyframes mslide{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
.vl-modal-close{position:absolute;top:1.2rem;right:1.2rem;width:36px;height:36px;border-radius:50%;background:var(--gl);border:1px solid var(--glb);color:rgba(250,250,248,.85) !important;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.3s;z-index:5}
[dir=rtl] .vl-modal-close{right:auto;left:1.2rem}
.vl-modal-close:hover{background:var(--gold-glow);color:#C5A467 !important;border-color:var(--gold-bdr)}
.vl-modal-gallery{display:flex;gap:2px;height:320px;overflow:hidden}
.vl-modal-gallery img{flex:1;min-width:0;object-fit:cover;cursor:pointer;transition:.4s}
.vl-modal-gallery img:hover{flex:1.5}
.vl-modal-body{padding:2.5rem}
.vl-modal-top{display:flex;justify-content:space-between;align-items:flex-start;gap:2rem;margin-bottom:2rem;flex-wrap:wrap}
.vl-modal-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:2rem;font-weight:400;margin-bottom:.3rem;color:#FAFAF8 !important}
.vl-modal-floor{font-size:.8rem;color:#C5A467 !important;letter-spacing:.1em;text-transform:uppercase}
.vl-modal-price-box{text-align:right}
[dir=rtl] .vl-modal-price-box{text-align:left}
.vl-modal-price{font-family:'Cormorant Garamond',Georgia,serif;font-size:2rem;font-weight:500;color:#C5A467 !important}
.vl-modal-sqft{font-size:.82rem;color:rgba(250,250,248,.6) !important}
.vl-modal-desc{font-size:1.05rem;font-weight:400;line-height:1.8;color:rgba(250,250,248,.85) !important;margin-bottom:2rem;max-width:700px}
.vl-modal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-bottom:2rem}
.vl-mg-item{padding:1rem;border:1px solid var(--glb);border-radius:6px;text-align:center}
.vl-mg-label{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(250,250,248,.6) !important;margin-bottom:.3rem}
.vl-mg-value{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.2rem;color:#FAFAF8 !important}
.vl-modal-features{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:2rem}
.vl-feat{padding:.4rem .9rem;background:var(--gold-glow);border:1px solid var(--gold-bdr);border-radius:4px;font-size:.78rem;color:#C5A467 !important}

/* ── Payment Plan Section ── */
.vl-payment{margin-top:2rem;padding:2rem;border:1px solid var(--glb);border-radius:8px;background:var(--gl)}
.vl-pay-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.3rem;margin-bottom:1.5rem;color:#FAFAF8 !important}
.vl-pay-bar{display:flex;height:8px;border-radius:4px;overflow:hidden;margin-bottom:1rem}
.vl-pay-seg{transition:.3s}
.vl-pay-legend{display:flex;gap:2rem;flex-wrap:wrap}
.vl-pay-item{display:flex;align-items:center;gap:.5rem;font-size:.82rem;.vl-pay-item color fix
.vl-pay-dot{width:10px;height:10px;border-radius:50%}
.vl-pay-amt{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.1rem;font-weight:500;color:#FAFAF8 !important}

/* ── Modal Actions ── */
.vl-modal-actions{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:2rem;padding-top:2rem;border-top:1px solid var(--glb)}

/* ── AMENITIES ── */
.vl-am-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;max-width:1100px;margin:0 auto;background:var(--glb)}
.vl-am{background:var(--ch);padding:2rem;text-align:center;transition:.4s;cursor:default}
.vl-am:hover{background:rgba(197,164,103,.04)}
.vl-am-icon{font-size:1.8rem;margin-bottom:.8rem}
.vl-am-name{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.15rem;font-weight:500;margin-bottom:.3rem;color:#FFFFFF !important}
.vl-am-desc{font-size:.82rem;color:rgba(250,250,248,.85) !important;line-height:1.6}

/* ── INVESTMENT ── */
.vl-inv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;max-width:1100px;margin:0 auto}
.vl-inv{text-align:center;padding:2.5rem 1.5rem;border:1px solid var(--glb);border-radius:4px;transition:.4s;background:var(--ch)}
.vl-inv:hover{border-color:var(--gold-bdr);background:var(--gold-glow)}
.vl-inv-val{font-family:'Cormorant Garamond',Georgia,serif;font-size:2.5rem;font-weight:400;color:#C5A467 !important;margin-bottom:.4rem}
.vl-inv-lbl{font-size:.88rem;font-weight:500;color:#FFFFFF !important;margin-bottom:.25rem}
.vl-inv-note{font-size:.78rem;color:rgba(250,250,248,.58) !important}

/* ── BOOKING FORM ── */
.vl-contact{background:var(--ch2)}
.vl-form{max-width:550px;margin:0 auto}
.vl-fg{margin-bottom:1.3rem}
.vl-flabel{display:block;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(250,250,248,.6) !important;margin-bottom:.5rem}
.vl-finput{width:100%;padding:.9rem 0;background:0;border:none;border-bottom:1px solid var(--glb);color:#FAFAF8 !important;font-family:'Outfit',system-ui,sans-serif;font-size:.95rem;font-weight:400;transition:.3s;outline:none}
.vl-finput:focus{border-bottom-color:#C5A467 !important}
.vl-fsel{width:100%;padding:.9rem 0;background:0;border:none;border-bottom:1px solid var(--glb);color:#FAFAF8 !important;font-family:'Outfit',system-ui,sans-serif;font-size:.95rem;outline:none;cursor:pointer;appearance:none}
.vl-fsel option{background:var(--ch);color:#FAFAF8 !important}
.vl-fnote{text-align:center;font-size:.78rem;color:rgba(250,250,248,.58) !important;margin-top:1.2rem}
.vl-fdate{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

/* ── TOAST ── */
.vl-toast{position:fixed;bottom:2rem;right:2rem;padding:1rem 2rem;background:var(--gold);color:#0D0D0F !important;font-family:'Outfit',system-ui,sans-serif;font-size:.85rem;font-weight:500;border-radius:8px;z-index:300;animation:toastIn .4s ease-out;box-shadow:0 8px 30px rgba(0,0,0,.4)}
[dir=rtl] .vl-toast{right:auto;left:2rem}
@keyframes toastIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

/* ── FOOTER ── */
.vl-ft{padding:2.5rem 4rem;text-align:center;border-top:1px solid var(--glb)}
.vl .vl-ft p{font-size:.82rem;color:rgba(250,250,248,.58) !important;font-weight:400}
.vl-ft span{font-family:'Cormorant Garamond',Georgia,serif;color:#C5A467 !important}

/* ── DIVIDER ── */
.vl-div{display:flex;align-items:center;padding:1.5rem 4rem}
.vl-div-l{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold-bdr),transparent)}
.vl-div-d{padding:0 1.5rem;color:#C5A467 !important;font-size:.45rem}

/* ── REVEAL ── */
.vl-rv{opacity:0;transform:translateY(25px);transition:.8s cubic-bezier(.4,0,.2,1)}
.vl-rv.vis{opacity:1;transform:translateY(0)}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .vl-units{grid-template-columns:repeat(2,1fr)}
  .vl-modal-grid{grid-template-columns:repeat(2,1fr)}
  .vl-am-grid{grid-template-columns:repeat(2,1fr)}
  .vl-inv-grid{grid-template-columns:repeat(2,1fr)}
  .vl-stats{grid-template-columns:repeat(2,1fr)}
  .vl-modal-gallery{height:240px}
}
@media(max-width:768px){
  .vl-hd{padding:1rem 1.5rem}
  .vl-hd.sc{padding:.7rem 1.5rem}
  .vl-hero-ct{padding:0 1.5rem 3rem}
  .vl-sec{padding:3.5rem 1.5rem}
  .vl-htitle{font-size:2.2rem}
  .vl-units{grid-template-columns:1fr}
  .vl-am-grid{grid-template-columns:1fr 1fr}
  .vl-inv-grid{grid-template-columns:1fr 1fr}
  .vl-badge{display:none}
  .vl-hacts{flex-direction:column}
  .btn-g,.btn-o{width:100%;justify-content:center}
  .vl-modal{margin:1rem;max-height:95vh}
  .vl-modal-gallery{height:180px;flex-direction:column}
  .vl-modal-gallery img{height:180px;flex:none}
  .vl-modal-body{padding:1.5rem}
  .vl-modal-top{flex-direction:column}
  .vl-modal-price-box{text-align:left}
  [dir=rtl] .vl-modal-price-box{text-align:right}
  .vl-fdate{grid-template-columns:1fr}
  .vl-ft{padding:2rem 1.5rem}
}
@media(max-width:480px){
  .vl-stats{grid-template-columns:1fr 1fr}
  .vl-inv-grid{grid-template-columns:1fr}
  .vl-modal-grid{grid-template-columns:1fr 1fr}
  .vl-modal-actions{flex-direction:column}
  .vl-modal-actions button{width:100%}
}
`;

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function VIPPortalFull() {
  const [lang, setLang] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [toast, setToast] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: "", email: "", phone: "", unit: "", date: "", time: "" });
  const L = lang;

  // Inject CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = S;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Scroll handler
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".vl-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, selectedUnit]);

  // Track page load
  useEffect(() => {
    trackEvent("portal_opened", { page: "vip_portal", language: lang });
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const vipName = L === "en" ? "Khalid Al-Rashid" : "خالد الراشد";
  const dir = L === "en" ? "ltr" : "rtl";

  // ─── Action Handlers ────────────────────────────────────────
  const handleViewUnit = (unit) => {
    trackEvent("view_unit", { unitId: unit.id, unitName: unit.name.en, price: unit.price });
    setSelectedUnit(unit);
  };

  const handleDownloadBrochure = (unit) => {
    trackEvent("download_brochure", { unitId: unit.id, unitName: unit.name.en });
    showToast(L === "en" ? `📄 Brochure for ${unit.name.en} — Download started` : `📄 كتيب ${unit.name.ar} — بدأ التحميل`);
  };

  const handleRequestPricing = (unit) => {
    trackEvent("request_pricing", { unitId: unit.id, unitName: unit.name.en, price: unit.price });
    showToast(L === "en" ? `💰 Pricing details for ${unit.name.en} sent to your email` : `💰 تفاصيل أسعار ${unit.name.ar} أُرسلت لبريدك`);
  };

  const handleViewFloorplan = (unit) => {
    trackEvent("view_floorplan", { unitId: unit.id, unitName: unit.name.en });
    showToast(L === "en" ? `📐 Floor plan for ${unit.name.en} — Opening...` : `📐 مخطط ${unit.name.ar} — جارٍ الفتح...`);
  };

  const handleBookViewing = (e) => {
    e.preventDefault();
    trackEvent("book_viewing", {
      unitId: bookingForm.unit || "general",
      name: bookingForm.name || vipName,
      date: bookingForm.date,
      time: bookingForm.time,
    });
    showToast(L === "en" ? "✅ Private viewing booked! Your advisor will confirm shortly." : "✅ تم حجز المعاينة الخاصة! مستشارك سيؤكد قريباً.");
  };

  const handleExplorePayment = (unit) => {
    trackEvent("explore_payment_plan", { unitId: unit.id, unitName: unit.name.en, price: unit.price });
  };

  const handleContactAdvisor = () => {
    trackEvent("contact_advisor", { vipName });
    showToast(L === "en" ? "📞 Your dedicated advisor has been notified" : "📞 تم إبلاغ مستشارك المخصص");
  };

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const formatAED = (n) => {
    if (L === "en") return `AED ${n.toLocaleString()}`;
    return `${n.toLocaleString()} درهم`;
  };

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <div className="vl" dir={dir}>
      {/* ── NAV ── */}
      <header className={`vl-hd ${scrolled ? "sc" : ""}`}>
        <div className="vl-logo">Vista <b>Residences</b></div>
        <div className="vl-nav">
          <div className="vl-badge">{L === "en" ? "VIP Access" : "وصول VIP"}</div>
          <button className="vl-lbtn" onClick={() => {
            const newLang = L === "en" ? "ar" : "en";
            setLang(newLang);
            trackEvent("language_switch", { from: L, to: newLang });
          }}>
            {L === "en" ? "العربية" : "English"}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="vl-hero">
        <div className="vl-hero-bg" style={{ backgroundImage: `url(/assets/images/vip-portal/hero.jpg)` }} />
        <div className="vl-hero-ov" />
        <div className="vl-hero-ct">
          <div className="vl-pvt">{L === "en" ? "Private Invitation" : "دعوة خاصة"}</div>
          <p className="vl-greet" style={{color:'rgba(250,250,248,.85)'}}>{L === "en" ? "Welcome," : "أهلاً وسهلاً،"} <span style={{color:'#C5A467'}}>{vipName}</span></p>
          <h1 className="vl-htitle" style={{color:'#FAFAF8',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
            {L === "en" ? (<>Your Exclusive<br /><em style={{color:'#C5A467'}}>Residence</em> Awaits</>) : (<>مسكنك<br /><em style={{color:'#C5A467'}}>الحصري</em> بانتظارك</>)}
          </h1>
          <p className="vl-hdesc" style={{color:'rgba(250,250,248,.85)'}}>
            {L === "en"
              ? "A curated selection of premium residences, handpicked for discerning investors who demand nothing less than extraordinary."
              : "مجموعة مختارة من المساكن الفاخرة، مصممة خصيصاً للمستثمرين الذين لا يقبلون إلا بالاستثنائي."}
          </p>
          <div className="vl-hacts">
            <button className="btn-g" onClick={() => {
              trackEvent("cta_explore_residences");
              document.getElementById("residences")?.scrollIntoView({ behavior: "smooth" });
            }}>{L === "en" ? "Explore Residences →" : "استكشف المساكن →"}</button>
            <button className="btn-o" onClick={() => {
              trackEvent("cta_schedule_viewing");
              scrollToBooking();
            }}>{L === "en" ? "Schedule Private Viewing" : "حجز معاينة خاصة"}</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="vl-stats">
        {[
          { v: "248", l: L === "en" ? "Premium Units" : "وحدة فاخرة" },
          { v: "44", l: L === "en" ? "Floors" : "طابقاً" },
          { v: "8.2%", l: L === "en" ? "Projected ROI" : "عائد متوقع" },
          { v: "Q4 '27", l: L === "en" ? "Completion" : "التسليم" },
        ].map((s, i) => (
          <div className="vl-st" key={i}>
            <div className="vl-stv" style={{color:"#C5A467",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2.2rem"}}>{s.v}</div>
            <div className="vl-stl" style={{color:"rgba(250,250,248,.65)",fontSize:".72rem",letterSpacing:".15em",textTransform:"uppercase"}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── RESIDENCES ── */}
      <section className="vl-sec" id="residences">
        <div className="vl-sh vl-rv">
          <span className="vl-sl" style={{color:"#C5A467"}}>◆ {L === "en" ? "The Residences" : "المساكن"}</span>
          <h2 className="vl-st2" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>{L === "en" ? "Where Vision Meets the Skyline" : "حيث تلتقي الرؤية بالأفق"}</h2>
          <p className="vl-ss" style={{color:"rgba(250,250,248,.9)"}}>{L === "en" ? "Click any residence to explore details, floor plans, and pricing" : "انقر على أي مسكن لاستكشاف التفاصيل والمخططات والأسعار"}</p>
        </div>

        <div className="vl-units">
          {UNITS.map((unit, i) => (
            <div className="vl-card vl-rv" key={unit.id} onClick={() => handleViewUnit(unit)}>
              <div className="vl-card-img">
                <img src={unit.img} alt={unit.name[L]} loading="lazy" />
                <div className="vl-card-badge" style={{color:'#C5A467',fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',fontWeight:500,background:'rgba(13,13,15,.88)',backdropFilter:'blur(10px)',padding:'.4rem 1rem',borderRadius:'4px',border:'1px solid rgba(197,164,103,.3)'}}>{unit.feature[L]}</div>
                <div className={`vl-card-status ${unit.id === "EX-25-01" ? "status-last" : "status-avail"}`}
                  style={{
                    color: '#FFFFFF',
                    fontSize:'.7rem',
                    fontWeight:600,
                    background: unit.id === "EX-25-01" ? '#C1121F' : '#2A9D5C',
                    padding:'.4rem .9rem',
                    borderRadius:'4px',
                    border:'none',
                  }}>
                  {unit.status[L]}
                </div>
              </div>
              <div className="vl-card-body" style={{background:'#141416'}}>
                <h3 className="vl-card-name" style={{color:'#FAFAF8',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.6rem',fontWeight:500,marginBottom:'.4rem'}}>{unit.name[L]}</h3>
                <p className="vl-card-floor" style={{color:'#C5A467',fontSize:'.75rem',letterSpacing:'.08em',textTransform:'uppercase'}}>{unit.floor[L]}</p>
                <div className="vl-card-meta" style={{color:'rgba(250,250,248,.9)',fontSize:'.85rem'}}>
                  <span style={{color:'rgba(250,250,248,.9)'}}>🛏 {unit.beds[L]}</span>
                  <span style={{color:'rgba(250,250,248,.9)'}}>📐 {unit.size[L]}</span>
                </div>
                <div className="vl-card-price" style={{color:'#C5A467',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.5rem',fontWeight:500}}>{unit.priceDisplay[L]}</div>
                <div className="vl-card-sqft" style={{color:'rgba(250,250,248,.65)',fontSize:'.78rem'}}>{unit.perSqft[L]}</div>
              </div>
              <div className="vl-card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-o btn-sm" onClick={() => handleViewUnit(unit)}>
                  {L === "en" ? "View Details" : "عرض التفاصيل"}
                </button>
                <button className="btn-o btn-sm" onClick={() => handleDownloadBrochure(unit)}>
                  {L === "en" ? "📄 Brochure" : "📄 كتيب"}
                </button>
                <button className="btn-g btn-sm" onClick={() => handleRequestPricing(unit)}>
                  {L === "en" ? "💰 Request Pricing" : "💰 طلب الأسعار"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="vl-div"><div className="vl-div-l" /><div className="vl-div-d">◆</div><div className="vl-div-l" /></div>

      {/* ── AMENITIES ── */}
      <section className="vl-sec">
        <div className="vl-sh vl-rv">
          <span className="vl-sl" style={{color:"#C5A467"}}>◆ {L === "en" ? "The Lifestyle" : "أسلوب الحياة"}</span>
          <h2 className="vl-st2" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>{L === "en" ? "Curated Experiences Beyond the Ordinary" : "تجارب مُنتقاة تتجاوز المألوف"}</h2>
        </div>
        <div className="vl-am-grid">
          {AMENITIES.map((a, i) => (
            <div className="vl-am vl-rv" key={i}>
              <div className="vl-am-icon">{a.icon}</div>
              <div className="vl-am-name" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.1rem"}}>{a[L]}</div>
              <div className="vl-am-desc" style={{color:"rgba(250,250,248,.85)",fontSize:".8rem"}}>{L === "en" ? a.descEn : a.descAr}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="vl-div"><div className="vl-div-l" /><div className="vl-div-d">◆</div><div className="vl-div-l" /></div>

      {/* ── INVESTMENT ── */}
      <section className="vl-sec">
        <div className="vl-sh vl-rv">
          <span className="vl-sl" style={{color:"#C5A467"}}>◆ {L === "en" ? "The Opportunity" : "الفرصة الاستثمارية"}</span>
          <h2 className="vl-st2" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>{L === "en" ? "Strategic Value in Every Detail" : "قيمة استراتيجية في كل تفصيل"}</h2>
        </div>
        <div className="vl-inv-grid">
          {[
            { v: "8.2%", l: L === "en" ? "Rental Yield" : "عائد الإيجار", n: L === "en" ? "Above market average" : "أعلى من السوق" },
            { v: "23%", l: L === "en" ? "Capital Growth" : "نمو رأس المال", n: L === "en" ? "3-year projection" : "توقعات ٣ سنوات" },
            { v: "60/40", l: L === "en" ? "Payment Plan" : "خطة الدفع", n: L === "en" ? "Flexible structure" : "هيكل مرن" },
            { v: "Q4 '27", l: L === "en" ? "Handover" : "التسليم", n: L === "en" ? "On schedule" : "في الموعد" },
          ].map((item, i) => (
            <div className="vl-inv vl-rv" key={i}>
              <div className="vl-inv-val" style={{color:"#C5A467",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2.5rem"}}>{item.v}</div>
              <div className="vl-inv-lbl" style={{color:"#FAFAF8",fontSize:".85rem"}}>{item.l}</div>
              <div className="vl-inv-note" style={{color:"rgba(250,250,248,.6)",fontSize:".75rem"}}>{item.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="vl-div"><div className="vl-div-l" /><div className="vl-div-d">◆</div><div className="vl-div-l" /></div>

      {/* ── BOOKING FORM ── */}
      <section className="vl-sec vl-contact" id="booking">
        <div className="vl-sh vl-rv">
          <span className="vl-sl" style={{color:"#C5A467"}}>◆ {L === "en" ? "Private Consultation" : "استشارة خاصة"}</span>
          <h2 className="vl-st2" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>{L === "en" ? "Schedule Your Private Viewing" : "احجز معاينتك الخاصة"}</h2>
          <p className="vl-ss" style={{color:"rgba(250,250,248,.9)"}}>{L === "en" ? "Your dedicated advisor will arrange an exclusive tour" : "مستشارك المخصص سيرتب جولة حصرية"}</p>
        </div>
        <form className="vl-form vl-rv" onSubmit={handleBookViewing}>
          <div className="vl-fg">
            <label className="vl-flabel">{L === "en" ? "Full Name" : "الاسم الكامل"}</label>
            <input className="vl-finput" type="text" defaultValue={vipName}
              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} />
          </div>
          <div className="vl-fg">
            <label className="vl-flabel">{L === "en" ? "Email Address" : "البريد الإلكتروني"}</label>
            <input className="vl-finput" type="email"
              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} />
          </div>
          <div className="vl-fg">
            <label className="vl-flabel">{L === "en" ? "Phone Number" : "رقم الهاتف"}</label>
            <input className="vl-finput" type="tel"
              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} />
          </div>
          <div className="vl-fg">
            <label className="vl-flabel">{L === "en" ? "Preferred Residence" : "المسكن المفضل"}</label>
            <select className="vl-fsel" onChange={(e) => setBookingForm({ ...bookingForm, unit: e.target.value })}>
              <option value="">{L === "en" ? "— Select a residence —" : "— اختر مسكناً —"}</option>
              {UNITS.map((u) => (
                <option key={u.id} value={u.id}>{u.name[L]} — {u.priceDisplay[L]}</option>
              ))}
            </select>
          </div>
          <div className="vl-fdate">
            <div className="vl-fg">
              <label className="vl-flabel">{L === "en" ? "Preferred Date" : "التاريخ المفضل"}</label>
              <input className="vl-finput" type="date"
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
            </div>
            <div className="vl-fg">
              <label className="vl-flabel">{L === "en" ? "Preferred Time" : "الوقت المفضل"}</label>
              <select className="vl-fsel" onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}>
                <option value="">—</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-g" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}>
            {L === "en" ? "Request Private Viewing →" : "طلب معاينة خاصة →"}
          </button>
          <p className="vl-fnote">{L === "en" ? "Your information is protected. We will contact you within 24 hours." : "معلوماتك محمية. سنتواصل معك خلال ٢٤ ساعة."}</p>
        </form>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vl-ft" style={{padding:'2.5rem 4rem',textAlign:'center',borderTop:'1px solid rgba(255,255,255,.08)'}}>
        <p style={{color:'rgba(250,250,248,.5)',fontSize:'.78rem',marginBottom:'1.2rem'}}>
          {L === "en"
            ? "This is a private portal. Content is personalized for your exclusive access."
            : "هذه بوابة خاصة. المحتوى مخصص لوصولك الحصري."}
        </p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.6rem',opacity:.7}}>
          <span style={{color:'rgba(250,250,248,.4)',fontSize:'.72rem',letterSpacing:'.08em',textTransform:'uppercase'}}>{L === "en" ? "Powered by" : "مدعوم من"}</span>
          <img src="/assets/images/dynamicnfc-logo-red.png" alt="Dynamic NFC" style={{height:'22px',objectFit:'contain'}} />
        </div>
      </footer>

      {/* ── UNIT DETAIL MODAL ── */}
      {selectedUnit && (
        <div className="vl-modal-overlay" onClick={() => setSelectedUnit(null)}>
          <div className="vl-modal" onClick={(e) => e.stopPropagation()}>
            <button className="vl-modal-close" onClick={() => setSelectedUnit(null)}>✕</button>

            {/* Gallery */}
            <div className="vl-modal-gallery">
              {selectedUnit.gallery.map((src, i) => (
                <img key={i} src={src} alt={`${selectedUnit.name[L]} view ${i + 1}`} loading="lazy" />
              ))}
            </div>

            <div className="vl-modal-body" style={{padding:'2.5rem',background:'#111114'}}>
              {/* Title + Price */}
              <div className="vl-modal-top">
                <div>
                  <h2 className="vl-modal-title" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2.5rem",fontWeight:500}}>{selectedUnit.name[L]}</h2>
                  <p className="vl-modal-floor" style={{color:"#C5A467",fontSize:".82rem",letterSpacing:".1em",textTransform:"uppercase"}}>{selectedUnit.floor[L]}</p>
                </div>
                <div className="vl-modal-price-box">
                  <div className="vl-modal-price" style={{color:"#C5A467",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2rem",fontWeight:500}}>{selectedUnit.priceDisplay[L]}</div>
                  <div className="vl-modal-sqft" style={{color:"rgba(250,250,248,.6)",fontSize:".82rem"}}>{selectedUnit.perSqft[L]}</div>
                </div>
              </div>

              {/* Description */}
              <p className="vl-modal-desc" style={{color:"rgba(250,250,248,.85)",fontSize:"1.1rem",lineHeight:"1.9",fontWeight:300}}>{selectedUnit.desc[L]}</p>

              {/* Specs Grid */}
              <div className="vl-modal-grid">
                <div className="vl-mg-item">
                  <div className="vl-mg-label" style={{color:"rgba(250,250,248,.6)",fontSize:".68rem",letterSpacing:".12em",textTransform:"uppercase"}}>{L === "en" ? "Bedrooms" : "غرف النوم"}</div>
                  <div className="vl-mg-value" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.2rem"}}>{selectedUnit.beds[L]}</div>
                </div>
                <div className="vl-mg-item">
                  <div className="vl-mg-label" style={{color:"rgba(250,250,248,.6)",fontSize:".68rem",letterSpacing:".12em",textTransform:"uppercase"}}>{L === "en" ? "Bathrooms" : "الحمامات"}</div>
                  <div className="vl-mg-value" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.2rem"}}>{selectedUnit.baths[L]}</div>
                </div>
                <div className="vl-mg-item">
                  <div className="vl-mg-label" style={{color:"rgba(250,250,248,.6)",fontSize:".68rem",letterSpacing:".12em",textTransform:"uppercase"}}>{L === "en" ? "Living Area" : "المساحة"}</div>
                  <div className="vl-mg-value" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.2rem"}}>{selectedUnit.size[L]}</div>
                </div>
                <div className="vl-mg-item">
                  <div className="vl-mg-label" style={{color:"rgba(250,250,248,.6)",fontSize:".68rem",letterSpacing:".12em",textTransform:"uppercase"}}>{L === "en" ? "Status" : "الحالة"}</div>
                  <div className="vl-mg-value" style={{
                    color: '#FFFFFF',
                    fontFamily:"'Cormorant Garamond',Georgia,serif",
                    fontSize:"1rem",
                    background: selectedUnit.id === "EX-25-01" ? '#C1121F' : '#2A9D5C',
                    display:'inline-block',
                    padding:'.3rem .8rem',
                    borderRadius:'4px'
                  }}>{selectedUnit.status[L]}</div>
                </div>
              </div>

              {/* Features */}
              <div className="vl-modal-features">
                {selectedUnit.features[L].map((f, i) => (
                  <span className="vl-feat" style={{color:"#C5A467",fontSize:".8rem"}} key={i}>{f}</span>
                ))}
              </div>

              {/* Payment Plan */}
              <div className="vl-payment">
                <h4 className="vl-pay-title" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.3rem"}}>{L === "en" ? "Payment Plan" : "خطة الدفع"}</h4>
                <div className="vl-pay-bar">
                  <div className="vl-pay-seg" style={{ flex: selectedUnit.payment.down, background: "var(--gold)" }} />
                  <div className="vl-pay-seg" style={{ flex: selectedUnit.payment.during, background: "var(--gold-lt)" }} />
                  <div className="vl-pay-seg" style={{ flex: selectedUnit.payment.handover, background: "rgba(197,164,103,.35)" }} />
                </div>
                <div className="vl-pay-legend">
                  <div className="vl-pay-item">
                    <div className="vl-pay-dot" style={{ background: "var(--gold)" }} />
                    <div>
                      <div style={{ fontSize: ".75rem", color: "rgba(250,250,248,.55)" }}>{L === "en" ? "Down Payment" : "الدفعة الأولى"} ({selectedUnit.payment.down}%)</div>
                      <div className="vl-pay-amt" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.1rem"}}>{formatAED(selectedUnit.price * selectedUnit.payment.down / 100)}</div>
                    </div>
                  </div>
                  <div className="vl-pay-item">
                    <div className="vl-pay-dot" style={{ background: "var(--gold-lt)" }} />
                    <div>
                      <div style={{ fontSize: ".75rem", color: "rgba(250,250,248,.55)" }}>{L === "en" ? "During Construction" : "خلال البناء"} ({selectedUnit.payment.during}%)</div>
                      <div className="vl-pay-amt" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.1rem"}}>{formatAED(selectedUnit.price * selectedUnit.payment.during / 100)}</div>
                    </div>
                  </div>
                  <div className="vl-pay-item">
                    <div className="vl-pay-dot" style={{ background: "rgba(197,164,103,.35)" }} />
                    <div>
                      <div style={{ fontSize: ".75rem", color: "rgba(250,250,248,.55)" }}>{L === "en" ? "On Handover" : "عند التسليم"} ({selectedUnit.payment.handover}%)</div>
                      <div className="vl-pay-amt" style={{color:"#FAFAF8",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.1rem"}}>{formatAED(selectedUnit.price * selectedUnit.payment.handover / 100)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="vl-modal-actions" style={{display:'flex',gap:'.8rem',flexWrap:'wrap',marginTop:'2rem',paddingTop:'2rem',borderTop:'1px solid rgba(255,255,255,.08)'}}>
                <button className="btn-g" style={{background:'linear-gradient(135deg,#C5A467,#D4B97A)',color:'#0D0D0F',fontWeight:600,padding:'.8rem 1.8rem',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'.82rem',letterSpacing:'.08em',textTransform:'uppercase'}} onClick={() => handleDownloadBrochure(selectedUnit)}>
                  📄 {L === "en" ? "Download Brochure" : "تحميل الكتيب"}
                </button>
                <button className="btn-o" style={{background:'transparent',color:'#C5A467',border:'1px solid rgba(197,164,103,.3)',padding:'.8rem 1.8rem',borderRadius:'4px',cursor:'pointer',fontSize:'.82rem',letterSpacing:'.08em',textTransform:'uppercase'}} onClick={() => handleViewFloorplan(selectedUnit)}>
                  📐 {L === "en" ? "View Floor Plan" : "عرض المخطط"}
                </button>
                <button className="btn-g" style={{background:'linear-gradient(135deg,#C5A467,#D4B97A)',color:'#0D0D0F',fontWeight:600,padding:'.8rem 1.8rem',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'.82rem',letterSpacing:'.08em',textTransform:'uppercase'}} onClick={() => handleRequestPricing(selectedUnit)}>
                  💰 {L === "en" ? "Request Pricing" : "طلب الأسعار"}
                </button>
                <button className="btn-o" style={{background:'transparent',color:'#C5A467',border:'1px solid rgba(197,164,103,.3)',padding:'.8rem 1.8rem',borderRadius:'4px',cursor:'pointer',fontSize:'.82rem',letterSpacing:'.08em',textTransform:'uppercase'}} onClick={() => {
                  handleExplorePayment(selectedUnit);
                  showToast(L === "en" ? "📊 Custom payment plan sent to your email" : "📊 خطة دفع مخصصة أُرسلت لبريدك");
                }}>
                  📊 {L === "en" ? "Custom Payment Plan" : "خطة دفع مخصصة"}
                </button>
                <button className="btn-o" style={{background:'transparent',color:'#C5A467',border:'1px solid rgba(197,164,103,.3)',padding:'.8rem 1.8rem',borderRadius:'4px',cursor:'pointer',fontSize:'.82rem',letterSpacing:'.08em',textTransform:'uppercase'}} onClick={() => {
                  setSelectedUnit(null);
                  setTimeout(scrollToBooking, 300);
                }}>
                  📅 {L === "en" ? "Book Viewing" : "حجز معاينة"}
                </button>
                <button className="btn-o" style={{background:'transparent',color:'#C5A467',border:'1px solid rgba(197,164,103,.3)',padding:'.8rem 1.8rem',borderRadius:'4px',cursor:'pointer',fontSize:'.82rem',letterSpacing:'.08em',textTransform:'uppercase'}} onClick={handleContactAdvisor}>
                  📞 {L === "en" ? "Call Advisor" : "اتصل بالمستشار"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div className="vl-toast">{toast}</div>}
    </div>
  );
}
