import { useState, useEffect, useRef } from "react";

// ─── Gulf Luxury VIP Portal ────────────────────────────────────
// Design inspired by: DAMAC, Omniyat, Emaar, Sobha Gulf websites
// Color: Warm gold/champagne on deep charcoal (NOT cold blue)
// Typography: Cinematic serif + refined sans-serif
// Layout: Full-bleed immersive hero, editorial magazine sections
// ────────────────────────────────────────────────────────────────

const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "VIP Access", lang: "العربية" },
    hero: {
      badge: "Private Invitation",
      greeting: "Welcome,",
      tagline: "Your Exclusive Residence Awaits",
      subtitle: "A curated selection of premium residences, handpicked for discerning investors who demand nothing less than extraordinary.",
      cta: "Explore Residences",
      ctaSecondary: "Schedule Private Viewing",
    },
    stats: {
      units: "Premium Units",
      floors: "Floors of Luxury",
      roi: "Projected ROI",
      completion: "Completion",
    },
    sections: {
      residences: "The Residences",
      residencesSub: "Where Vision Meets the Skyline",
      amenities: "The Lifestyle",
      amenitiesSub: "Curated Experiences Beyond the Ordinary",
      investment: "The Opportunity",
      investmentSub: "Strategic Value in Every Detail",
      contact: "Private Consultation",
      contactSub: "Your dedicated advisor awaits",
    },
    units: [
      {
        name: "Sky Penthouse",
        floor: "Floor 42–44",
        bed: "4 Bedrooms",
        size: "6,200 sq ft",
        price: "AED 12.5M",
        feature: "360° Panoramic Views",
        desc: "A triple-height masterpiece crowning the tower, with private infinity pool and direct elevator access.",
      },
      {
        name: "Grand Residence",
        floor: "Floor 35–38",
        bed: "3 Bedrooms",
        size: "4,100 sq ft",
        price: "AED 7.8M",
        feature: "Marina & Sea View",
        desc: "Expansive living with floor-to-ceiling glazing, Italian marble throughout, and a private terrace overlooking the marina.",
      },
      {
        name: "Executive Suite",
        floor: "Floor 25–30",
        bed: "2 Bedrooms",
        size: "2,800 sq ft",
        price: "AED 4.2M",
        feature: "City Skyline View",
        desc: "Refined elegance for the modern executive, featuring a home office, walk-in wardrobe, and chef's kitchen.",
      },
    ],
    amenityList: [
      { icon: "🏊", name: "Infinity Edge Pool", desc: "60m rooftop pool with panoramic views" },
      { icon: "🧖", name: "Spa & Wellness", desc: "Full-service spa with hammam & cryo chamber" },
      { icon: "🍽️", name: "Private Dining", desc: "Michelin-standard resident-only restaurant" },
      { icon: "🏋️", name: "Fitness Atelier", desc: "Technogym-equipped with personal trainers" },
      { icon: "🛥️", name: "Marina Access", desc: "Private berths for yachts up to 60ft" },
      { icon: "🌿", name: "Sky Gardens", desc: "Landscaped terraces on every 10th floor" },
    ],
    investment: {
      title: "Strategic Investment Highlights",
      items: [
        { label: "Rental Yield", value: "8.2%", note: "Above market average" },
        { label: "Capital Growth", value: "23%", note: "Projected 3-year appreciation" },
        { label: "Payment Plan", value: "60/40", note: "60% during construction" },
        { label: "Handover", value: "Q4 2027", note: "On schedule" },
      ],
    },
    booking: {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      preferred: "Preferred Residence",
      submit: "Request Private Viewing",
      note: "Your information is protected. We will contact you within 24 hours.",
    },
    footer: "This is a private portal. Content is personalized for your exclusive access.",
  },
  ar: {
    dir: "rtl",
    nav: { vip: "وصول VIP", lang: "English" },
    hero: {
      badge: "دعوة خاصة",
      greeting: "أهلاً وسهلاً،",
      tagline: "مسكنك الحصري بانتظارك",
      subtitle: "مجموعة مختارة من المساكن الفاخرة، مصممة خصيصاً للمستثمرين الذين لا يقبلون إلا بالاستثنائي.",
      cta: "استكشف المساكن",
      ctaSecondary: "حجز معاينة خاصة",
    },
    stats: {
      units: "وحدة فاخرة",
      floors: "طابقاً من الفخامة",
      roi: "عائد متوقع",
      completion: "التسليم",
    },
    sections: {
      residences: "المساكن",
      residencesSub: "حيث تلتقي الرؤية بالأفق",
      amenities: "أسلوب الحياة",
      amenitiesSub: "تجارب مُنتقاة تتجاوز المألوف",
      investment: "الفرصة الاستثمارية",
      investmentSub: "قيمة استراتيجية في كل تفصيل",
      contact: "استشارة خاصة",
      contactSub: "مستشارك المخصص بانتظارك",
    },
    units: [
      {
        name: "بنتهاوس السماء",
        floor: "الطابق ٤٢-٤٤",
        bed: "٤ غرف نوم",
        size: "٦,٢٠٠ قدم²",
        price: "١٢.٥ مليون درهم",
        feature: "إطلالة بانورامية ٣٦٠°",
        desc: "تحفة معمارية بارتفاع ثلاثي تتوّج البرج، مع مسبح إنفينيتي خاص ومصعد مباشر.",
      },
      {
        name: "الإقامة الكبرى",
        floor: "الطابق ٣٥-٣٨",
        bed: "٣ غرف نوم",
        size: "٤,١٠٠ قدم²",
        price: "٧.٨ مليون درهم",
        feature: "إطلالة على المارينا والبحر",
        desc: "مساحة واسعة مع زجاج من الأرض إلى السقف، رخام إيطالي، وتراس خاص يطل على المارينا.",
      },
      {
        name: "الجناح التنفيذي",
        floor: "الطابق ٢٥-٣٠",
        bed: "غرفتا نوم",
        size: "٢,٨٠٠ قدم²",
        price: "٤.٢ مليون درهم",
        feature: "إطلالة على أفق المدينة",
        desc: "أناقة راقية للتنفيذي العصري، مع مكتب منزلي وغرفة ملابس ومطبخ الشيف.",
      },
    ],
    amenityList: [
      { icon: "🏊", name: "مسبح إنفينيتي", desc: "مسبح على السطح بطول ٦٠ متر مع إطلالات بانورامية" },
      { icon: "🧖", name: "سبا وعافية", desc: "سبا متكامل مع حمام تركي وغرفة تبريد" },
      { icon: "🍽️", name: "مطعم خاص", desc: "مطعم حصري للسكان بمعايير ميشلان" },
      { icon: "🏋️", name: "صالة لياقة", desc: "مجهزة بأحدث أجهزة تكنوجيم مع مدربين شخصيين" },
      { icon: "🛥️", name: "مرسى خاص", desc: "أرصفة خاصة لليخوت حتى ٦٠ قدم" },
      { icon: "🌿", name: "حدائق سماوية", desc: "شرفات منسقة كل ١٠ طوابق" },
    ],
    investment: {
      title: "أبرز مزايا الاستثمار",
      items: [
        { label: "عائد الإيجار", value: "٨.٢٪", note: "أعلى من متوسط السوق" },
        { label: "نمو رأس المال", value: "٢٣٪", note: "ارتفاع متوقع خلال ٣ سنوات" },
        { label: "خطة الدفع", value: "٦٠/٤٠", note: "٦٠٪ خلال البناء" },
        { label: "التسليم", value: "Q4 2027", note: "في الموعد المحدد" },
      ],
    },
    booking: {
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      preferred: "المسكن المفضل",
      submit: "طلب معاينة خاصة",
      note: "معلوماتك محمية. سنتواصل معك خلال ٢٤ ساعة.",
    },
    footer: "هذه بوابة خاصة. المحتوى مخصص لوصولك الحصري.",
  },
};

// Luxury property images (high-quality architectural photography)
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85",
  tower: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  penthouse: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  living: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  interior: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  pool: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
  marina: "https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=1200&q=80",
};

const unitImages = [IMAGES.penthouse, IMAGES.living, IMAGES.interior];

// ─── CSS ────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

:root {
  --gold: #C5A467;
  --gold-light: #D4B97A;
  --gold-glow: rgba(197, 164, 103, 0.15);
  --gold-border: rgba(197, 164, 103, 0.25);
  --charcoal: #0D0D0F;
  --charcoal-warm: #141416;
  --slate: #1C1C20;
  --cream: #F5F0E8;
  --cream-muted: #E8E2D6;
  --white: #FEFEFE;
  --text-primary: #FAFAF8;
  --text-secondary: rgba(250, 250, 248, 0.6);
  --text-tertiary: rgba(250, 250, 248, 0.35);
  --glass: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'Outfit', system-ui, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body, html { 
  font-family: var(--sans); 
  background: var(--charcoal); 
  color: var(--text-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.vp-luxury {
  min-height: 100vh;
  background: var(--charcoal);
}

/* ─── Header ─── */
.vp-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.25rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.5s ease;
  background: transparent;
}

.vp-header.scrolled {
  background: rgba(13, 13, 15, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 0.85rem 3rem;
}

.vp-logo {
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: var(--gold);
  text-transform: uppercase;
}

.vp-logo span {
  font-weight: 600;
  color: var(--text-primary);
}

.vp-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.vp-nav-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1.2rem;
  border: 1px solid var(--gold-border);
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--gold);
  text-transform: uppercase;
}

.vp-nav-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  animation: glow 2s infinite;
}

@keyframes glow {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px var(--gold); }
  50% { opacity: 0.5; box-shadow: 0 0 12px var(--gold); }
}

.vp-lang-btn {
  background: none;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-family: var(--sans);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.05em;
}

.vp-lang-btn:hover {
  border-color: var(--gold-border);
  color: var(--gold);
}

/* ─── Hero ─── */
.vp-hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.vp-hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
  animation: heroZoom 20s ease-in-out infinite alternate;
}

@keyframes heroZoom {
  from { transform: scale(1.05); }
  to { transform: scale(1.12); }
}

.vp-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(13, 13, 15, 0.3) 0%,
    rgba(13, 13, 15, 0.5) 40%,
    rgba(13, 13, 15, 0.92) 85%,
    rgba(13, 13, 15, 1) 100%
  );
}

.vp-hero-content {
  position: relative;
  z-index: 2;
  padding: 0 4rem 5rem;
  max-width: 900px;
  animation: fadeUp 1.2s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.vp-hero-private {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1.5rem;
  border: 1px solid var(--gold-border);
  border-radius: 100px;
  margin-bottom: 2rem;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  background: rgba(197, 164, 103, 0.08);
  backdrop-filter: blur(10px);
}

.vp-hero-private::before {
  content: '◆';
  font-size: 0.5rem;
}

.vp-hero-greeting {
  font-family: var(--sans);
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.vp-hero-name {
  color: var(--gold);
  font-weight: 500;
}

.vp-hero-title {
  font-family: var(--serif);
  font-size: clamp(2.8rem, 6vw, 5.5rem);
  font-weight: 300;
  line-height: 1.05;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.vp-hero-title em {
  font-style: italic;
  color: var(--gold);
}

.vp-hero-desc {
  font-size: 1.05rem;
  font-weight: 300;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 600px;
  margin-bottom: 2.5rem;
}

.vp-hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.vp-btn-gold {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: var(--charcoal);
  font-family: var(--sans);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.vp-btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(197, 164, 103, 0.35);
}

.vp-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  background: transparent;
  color: var(--gold);
  font-family: var(--sans);
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid var(--gold-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.4s;
}

.vp-btn-outline:hover {
  background: var(--gold-glow);
  border-color: var(--gold);
}

/* ─── Stats Bar ─── */
.vp-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
  background: var(--charcoal-warm);
}

.vp-stat {
  padding: 2.5rem 2rem;
  text-align: center;
  border-right: 1px solid var(--glass-border);
  transition: background 0.3s;
}

[dir="rtl"] .vp-stat {
  border-right: none;
  border-left: 1px solid var(--glass-border);
}

.vp-stat:last-child { border: none; }

.vp-stat:hover { background: var(--glass); }

.vp-stat-value {
  font-family: var(--serif);
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--gold);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.vp-stat-label {
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

/* ─── Section Headers ─── */
.vp-section {
  padding: 6rem 4rem;
}

.vp-section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.vp-section-label {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1rem;
  display: block;
}

.vp-section-title {
  font-family: var(--serif);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.vp-section-subtitle {
  font-size: 1rem;
  font-weight: 300;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

/* ─── Residences ─── */
.vp-units {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-width: 1300px;
  margin: 0 auto;
  background: var(--glass-border);
}

.vp-unit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--charcoal);
  min-height: 500px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s;
}

.vp-unit:hover {
  background: var(--charcoal-warm);
}

.vp-unit:nth-child(even) {
  direction: rtl;
}

.vp-unit:nth-child(even) .vp-unit-info {
  direction: ltr;
}

[dir="rtl"] .vp-unit:nth-child(even) {
  direction: ltr;
}

[dir="rtl"] .vp-unit:nth-child(even) .vp-unit-info {
  direction: rtl;
}

.vp-unit-img {
  position: relative;
  overflow: hidden;
}

.vp-unit-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.vp-unit:hover .vp-unit-img img {
  transform: scale(1.06);
}

.vp-unit-img-badge {
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.5rem 1.2rem;
  background: rgba(13, 13, 15, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid var(--gold-border);
  border-radius: 4px;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
}

[dir="rtl"] .vp-unit-img-badge {
  left: auto;
  right: 2rem;
}

.vp-unit-info {
  padding: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vp-unit-name {
  font-family: var(--serif);
  font-size: 2.2rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.vp-unit-floor {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.5rem;
}

.vp-unit-desc {
  font-size: 0.95rem;
  font-weight: 300;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.vp-unit-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.vp-unit-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.vp-unit-detail-label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.vp-unit-detail-value {
  font-family: var(--serif);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text-primary);
}

.vp-unit-price {
  font-family: var(--serif);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gold);
  padding-top: 1.5rem;
  border-top: 1px solid var(--glass-border);
}

/* ─── Amenities ─── */
.vp-amenities-section {
  position: relative;
  overflow: hidden;
}

.vp-amenities-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.15;
}

.vp-amenities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  max-width: 1100px;
  margin: 0 auto;
  background: var(--glass-border);
  position: relative;
  z-index: 2;
}

.vp-amenity {
  background: rgba(13, 13, 15, 0.85);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s;
  cursor: default;
}

.vp-amenity:hover {
  background: rgba(197, 164, 103, 0.06);
}

.vp-amenity-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

.vp-amenity-name {
  font-family: var(--serif);
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.vp-amenity-desc {
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ─── Investment ─── */
.vp-investment-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.vp-invest-card {
  text-align: center;
  padding: 3rem 2rem;
  border: 1px solid var(--glass-border);
  border-radius: 2px;
  transition: all 0.4s;
  background: var(--charcoal);
}

.vp-invest-card:hover {
  border-color: var(--gold-border);
  background: var(--gold-glow);
}

.vp-invest-value {
  font-family: var(--serif);
  font-size: 2.8rem;
  font-weight: 300;
  color: var(--gold);
  margin-bottom: 0.5rem;
}

.vp-invest-label {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}

.vp-invest-note {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 300;
}

/* ─── Contact / Booking ─── */
.vp-contact-section {
  background: var(--charcoal-warm);
}

.vp-contact-inner {
  max-width: 600px;
  margin: 0 auto;
}

.vp-form-group {
  margin-bottom: 1.5rem;
}

.vp-form-label {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 0.6rem;
}

.vp-form-input {
  width: 100%;
  padding: 1rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 300;
  transition: border-color 0.3s;
  outline: none;
}

.vp-form-input:focus {
  border-bottom-color: var(--gold);
}

.vp-form-input::placeholder {
  color: var(--text-tertiary);
}

.vp-form-select {
  width: 100%;
  padding: 1rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 300;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.vp-form-select option {
  background: var(--charcoal);
  color: var(--text-primary);
}

.vp-form-submit {
  width: 100%;
  margin-top: 2rem;
}

.vp-form-note {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 1.5rem;
  font-weight: 300;
}

/* ─── Footer ─── */
.vp-footer {
  padding: 3rem 4rem;
  text-align: center;
  border-top: 1px solid var(--glass-border);
}

.vp-footer-text {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  font-weight: 300;
  letter-spacing: 0.03em;
}

.vp-footer-brand {
  font-family: var(--serif);
  color: var(--gold);
  font-weight: 400;
}

/* ─── Divider ─── */
.vp-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 4rem;
}

.vp-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-border), transparent);
}

.vp-divider-diamond {
  padding: 0 1.5rem;
  color: var(--gold);
  font-size: 0.5rem;
}

/* ─── Scroll Animation ─── */
.vp-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.vp-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .vp-unit {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .vp-unit:nth-child(even) { direction: ltr; }
  [dir="rtl"] .vp-unit:nth-child(even) { direction: rtl; }
  .vp-unit-img { height: 300px; }
  .vp-amenities-grid { grid-template-columns: repeat(2, 1fr); }
  .vp-investment-grid { grid-template-columns: repeat(2, 1fr); }
  .vp-stats { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .vp-header { padding: 1rem 1.5rem; }
  .vp-header.scrolled { padding: 0.75rem 1.5rem; }
  .vp-hero-content { padding: 0 1.5rem 3rem; }
  .vp-section { padding: 4rem 1.5rem; }
  .vp-hero-title { font-size: 2.5rem; }
  .vp-amenities-grid { grid-template-columns: 1fr; }
  .vp-investment-grid { grid-template-columns: 1fr 1fr; }
  .vp-unit-info { padding: 2rem; }
  .vp-nav-badge { display: none; }
  .vp-hero-actions { flex-direction: column; }
  .vp-btn-gold, .vp-btn-outline { width: 100%; justify-content: center; }
  .vp-footer { padding: 2rem 1.5rem; }
}

@media (max-width: 480px) {
  .vp-stats { grid-template-columns: 1fr 1fr; }
  .vp-investment-grid { grid-template-columns: 1fr; }
  .vp-unit-details { grid-template-columns: 1fr; }
}
`;

// ─── COMPONENT ──────────────────────────────────────────────────
export default function VIPPortalLuxury() {
  const [lang, setLang] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const t = LANG[lang];
  const heroRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".vp-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");
  const vipName = lang === "en" ? "Khalid Al-Rashid" : "خالد الراشد";

  return (
    <div className="vp-luxury" dir={t.dir}>
      {/* ── Header ── */}
      <header className={`vp-header ${scrolled ? "scrolled" : ""}`}>
        <div className="vp-logo">
          Vista <span>Residences</span>
        </div>
        <div className="vp-nav">
          <div className="vp-nav-badge">{t.nav.vip}</div>
          <button className="vp-lang-btn" onClick={toggleLang}>
            {t.nav.lang}
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="vp-hero" ref={heroRef}>
        <div
          className="vp-hero-bg"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        />
        <div className="vp-hero-overlay" />
        <div className="vp-hero-content">
          <div className="vp-hero-private">{t.hero.badge}</div>
          <p className="vp-hero-greeting">
            {t.hero.greeting}{" "}
            <span className="vp-hero-name">{vipName}</span>
          </p>
          <h1 className="vp-hero-title">
            {lang === "en" ? (
              <>
                Your Exclusive
                <br />
                <em>Residence</em> Awaits
              </>
            ) : (
              <>
                مسكنك
                <br />
                <em>الحصري</em> بانتظارك
              </>
            )}
          </h1>
          <p className="vp-hero-desc">{t.hero.subtitle}</p>
          <div className="vp-hero-actions">
            <button className="vp-btn-gold">{t.hero.cta} →</button>
            <button className="vp-btn-outline">{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="vp-stats">
        <div className="vp-stat">
          <div className="vp-stat-value">248</div>
          <div className="vp-stat-label">{t.stats.units}</div>
        </div>
        <div className="vp-stat">
          <div className="vp-stat-value">44</div>
          <div className="vp-stat-label">{t.stats.floors}</div>
        </div>
        <div className="vp-stat">
          <div className="vp-stat-value">8.2%</div>
          <div className="vp-stat-label">{t.stats.roi}</div>
        </div>
        <div className="vp-stat">
          <div className="vp-stat-value">Q4 '27</div>
          <div className="vp-stat-label">{t.stats.completion}</div>
        </div>
      </div>

      {/* ── Residences ── */}
      <section className="vp-section">
        <div className="vp-section-header vp-reveal">
          <span className="vp-section-label">◆ {t.sections.residences}</span>
          <h2 className="vp-section-title">{t.sections.residencesSub}</h2>
        </div>

        <div className="vp-units">
          {t.units.map((unit, i) => (
            <div className="vp-unit vp-reveal" key={i}>
              <div className="vp-unit-img">
                <img src={unitImages[i]} alt={unit.name} loading="lazy" />
                <div className="vp-unit-img-badge">{unit.feature}</div>
              </div>
              <div className="vp-unit-info">
                <h3 className="vp-unit-name">{unit.name}</h3>
                <p className="vp-unit-floor">{unit.floor}</p>
                <p className="vp-unit-desc">{unit.desc}</p>
                <div className="vp-unit-details">
                  <div className="vp-unit-detail">
                    <span className="vp-unit-detail-label">
                      {lang === "en" ? "Bedrooms" : "غرف النوم"}
                    </span>
                    <span className="vp-unit-detail-value">{unit.bed}</span>
                  </div>
                  <div className="vp-unit-detail">
                    <span className="vp-unit-detail-label">
                      {lang === "en" ? "Living Area" : "المساحة"}
                    </span>
                    <span className="vp-unit-detail-value">{unit.size}</span>
                  </div>
                </div>
                <div className="vp-unit-price">{unit.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="vp-divider">
        <div className="vp-divider-line" />
        <div className="vp-divider-diamond">◆</div>
        <div className="vp-divider-line" />
      </div>

      {/* ── Amenities ── */}
      <section className="vp-section vp-amenities-section">
        <div
          className="vp-amenities-bg"
          style={{ backgroundImage: `url(${IMAGES.pool})` }}
        />
        <div className="vp-section-header vp-reveal" style={{ position: "relative", zIndex: 2 }}>
          <span className="vp-section-label">◆ {t.sections.amenities}</span>
          <h2 className="vp-section-title">{t.sections.amenitiesSub}</h2>
        </div>
        <div className="vp-amenities-grid">
          {t.amenityList.map((a, i) => (
            <div className="vp-amenity vp-reveal" key={i}>
              <span className="vp-amenity-icon">{a.icon}</span>
              <h4 className="vp-amenity-name">{a.name}</h4>
              <p className="vp-amenity-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="vp-divider">
        <div className="vp-divider-line" />
        <div className="vp-divider-diamond">◆</div>
        <div className="vp-divider-line" />
      </div>

      {/* ── Investment ── */}
      <section className="vp-section">
        <div className="vp-section-header vp-reveal">
          <span className="vp-section-label">◆ {t.sections.investment}</span>
          <h2 className="vp-section-title">{t.sections.investmentSub}</h2>
        </div>
        <div className="vp-investment-grid">
          {t.investment.items.map((item, i) => (
            <div className="vp-invest-card vp-reveal" key={i}>
              <div className="vp-invest-value">{item.value}</div>
              <div className="vp-invest-label">{item.label}</div>
              <div className="vp-invest-note">{item.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking ── */}
      <section className="vp-section vp-contact-section">
        <div className="vp-section-header vp-reveal">
          <span className="vp-section-label">◆ {t.sections.contact}</span>
          <h2 className="vp-section-title">{t.sections.contactSub}</h2>
        </div>
        <div className="vp-contact-inner vp-reveal">
          <div className="vp-form-group">
            <label className="vp-form-label">{t.booking.name}</label>
            <input
              className="vp-form-input"
              type="text"
              defaultValue={vipName}
            />
          </div>
          <div className="vp-form-group">
            <label className="vp-form-label">{t.booking.email}</label>
            <input className="vp-form-input" type="email" placeholder="" />
          </div>
          <div className="vp-form-group">
            <label className="vp-form-label">{t.booking.phone}</label>
            <input className="vp-form-input" type="tel" placeholder="" />
          </div>
          <div className="vp-form-group">
            <label className="vp-form-label">{t.booking.preferred}</label>
            <select className="vp-form-select">
              {t.units.map((u, i) => (
                <option key={i}>{u.name} — {u.price}</option>
              ))}
            </select>
          </div>
          <button className="vp-btn-gold vp-form-submit">
            {t.booking.submit} →
          </button>
          <p className="vp-form-note">{t.booking.note}</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="vp-footer">
        <p className="vp-footer-text">
          {t.footer}
          <br />
          <span className="vp-footer-brand">
            {lang === "en"
              ? "Powered by Dynamic NFC"
              : "مدعوم من Dynamic NFC"}
          </span>
        </p>
      </footer>
    </div>
  );
}
