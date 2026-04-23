import { useState, useEffect, useCallback } from "react";
import './LoginPortal.css';

// ═══════════════════════════════════════════════════════════════
// LOGIN PORTAL — Ahmed Al-Fahad (Registered User, NOT VIP)
// ═══════════════════════════════════════════════════════════════
// Same property content, same actions — but user self-registered.
// No NFC card was sent. No "private invitation."
// Dashboard sees: portalType: "registered" vs "vip"
// ═══════════════════════════════════════════════════════════════

const trackEvent = (eventType, data = {}) => {
  const event = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    userId: data.userId || "AF-001",
    userName: data.userName || "Ahmed Al-Fahad",
    portalType: "registered",
    event: eventType,
    ...data,
  };
  const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
  events.push(event);
  localStorage.setItem("dnfc_events", JSON.stringify(events));
  return event;
};

// ─── Property Data (Same units, different presentation) ─────────
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
    statusType: "avail",
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
    statusType: "avail",
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
    statusType: "last",
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

// ─── CSS ─────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function LoginPortal() {
  const [lang, setLang] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [toast, setToast] = useState(null);
  const [bookingForm, setBookingForm] = useState({ unit: "", date: "", time: "" });
  const L = lang;
  const dir = L === "en" ? "ltr" : "rtl";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".lp-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, loggedIn, selectedUnit]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.loginName.value || "Ahmed Al-Fahad";
    const email = form.loginEmail.value || "ahmed@example.com";
    setUser({ name, email });
    setLoggedIn(true);
    trackEvent("user_login", { userName: name, userEmail: email });
  };

  const handleViewUnit = (unit) => {
    trackEvent("view_unit", { unitId: unit.id, unitName: unit.name.en, price: unit.price, userName: user.name });
    setSelectedUnit(unit);
  };

  const handleDownload = (unit) => {
    trackEvent("download_brochure", { unitId: unit.id, unitName: unit.name.en, userName: user.name });
    showToast(L === "en" ? `📄 Brochure for ${unit.name.en} — Download started` : `📄 كتيب ${unit.name.ar} — بدأ التحميل`);
  };

  const handlePricing = (unit) => {
    trackEvent("request_pricing", { unitId: unit.id, unitName: unit.name.en, userName: user.name });
    showToast(L === "en" ? `💰 Pricing sent to ${user.email}` : `💰 الأسعار أُرسلت إلى بريدك`);
  };

  const handleFloorplan = (unit) => {
    trackEvent("view_floorplan", { unitId: unit.id, unitName: unit.name.en, userName: user.name });
    showToast(L === "en" ? `📐 Floor plan — Opening...` : `📐 المخطط — جارٍ الفتح...`);
  };

  const handlePayment = (unit) => {
    trackEvent("explore_payment_plan", { unitId: unit.id, userName: user.name });
    showToast(L === "en" ? "📊 Payment plan sent to your email" : "📊 خطة الدفع أُرسلت لبريدك");
  };

  const handleBooking = (e) => {
    e.preventDefault();
    trackEvent("book_viewing", { unitId: bookingForm.unit || "general", userName: user.name, date: bookingForm.date, time: bookingForm.time });
    showToast(L === "en" ? "✅ Viewing request submitted! We'll confirm within 48 hours." : "✅ تم إرسال طلب المعاينة! سنؤكد خلال ٤٨ ساعة.");
  };

  const handleContact = () => {
    trackEvent("contact_sales", { userName: user.name });
    showToast(L === "en" ? "📞 Sales team will contact you shortly" : "📞 سيتواصل معك فريق المبيعات قريباً");
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const formatAED = (n) => L === "en" ? `AED ${n.toLocaleString()}` : `${n.toLocaleString()} درهم`;

  const initials = user.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "AF";

  // ─── LOGIN SCREEN ──────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="lp" dir={dir}>
        <div className="lp-login">
          <div className="lp-login-bg" style={{ backgroundImage: `url(/assets/images/vip-portal/hero.jpg)` }} />
          <div className="lp-login-ov" />
          <div className="lp-login-ct">
            <div className="lp-login-box">
              <div className="lp-login-logo">
                <h2 style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>Vista <b>Residences</b></h2>
                <p style={{ color: "rgba(250,250,248,.45)" }}>{L === "en" ? "Member Access" : "وصول الأعضاء"}</p>
              </div>
              <div className="lp-login-divider" />
              <form onSubmit={handleLogin}>
                <div className="lp-fg">
                  <label className="lp-fl" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Full Name" : "الاسم الكامل"}</label>
                  <input className="lp-fi" name="loginName" type="text" placeholder={L === "en" ? "Enter your name" : "أدخل اسمك"} defaultValue="Ahmed Al-Fahad" style={{ color: "#FAFAF8" }} />
                </div>
                <div className="lp-fg">
                  <label className="lp-fl" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Email Address" : "البريد الإلكتروني"}</label>
                  <input className="lp-fi" name="loginEmail" type="email" placeholder={L === "en" ? "Enter your email" : "أدخل بريدك"} defaultValue="ahmed@email.com" style={{ color: "#FAFAF8" }} />
                </div>
                <div className="lp-fg">
                  <label className="lp-fl" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Password" : "كلمة المرور"}</label>
                  <input className="lp-fi" type="password" placeholder="••••••••" defaultValue="demo1234" style={{ color: "#FAFAF8" }} />
                </div>
                <button type="submit" className="lp-submit" style={{ color: "#0D0D0F", background: "#FAFAF8" }}>
                  {L === "en" ? "Sign In →" : "تسجيل الدخول →"}
                </button>
                <p className="lp-note" style={{ color: "rgba(250,250,248,.35)" }}>{L === "en" ? "By signing in you agree to our terms and privacy policy" : "بتسجيل الدخول فإنك توافق على الشروط وسياسة الخصوصية"}</p>
              </form>
              <p className="lp-register-hint" style={{ color: "rgba(250,250,248,.4)" }}>
                {L === "en" ? "Don't have an account? " : "ليس لديك حساب؟ "}
                <span style={{ color: "#FAFAF8" }}>{L === "en" ? "Register here" : "سجّل هنا"}</span>
              </p>
            </div>
            <button className="lp-btn-sm" style={{ marginTop: "1.5rem", color: "rgba(250,250,248,.5)", border: "1px solid rgba(255,255,255,.1)" }} onClick={() => setLang(L === "en" ? "ar" : "en")}>
              {L === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PORTAL (After Login) ─────────────────────────────────
  return (
    <div className="lp" dir={dir}>
      {/* NAV */}
      <header className={`lp-hd ${scrolled ? "sc" : ""}`}>
        <div className="lp-logo" style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>Vista <b>Residences</b></div>
        <div className="lp-nav">
          <div className="lp-user-badge" style={{ color: "rgba(250,250,248,.7)" }}>
            <div className="lp-avatar" style={{ color: "#FAFAF8", background: "rgba(255,255,255,.12)" }}>{initials}</div>
            <span style={{ color: "rgba(250,250,248,.7)" }}>{user.name}</span>
          </div>
          <button className="lp-btn-sm" style={{ color: "rgba(250,250,248,.7)", border: "1px solid rgba(255,255,255,.12)" }} onClick={() => setLang(L === "en" ? "ar" : "en")}>
            {L === "en" ? "العربية" : "English"}
          </button>
          <button className="lp-btn-sm" style={{ color: "rgba(250,250,248,.5)", border: "1px solid rgba(255,255,255,.08)" }} onClick={() => { setLoggedIn(false); trackEvent("user_logout"); }}>
            {L === "en" ? "Sign Out" : "خروج"}
          </button>
        </div>
      </header>

      {/* HERO — shorter, less exclusive than VIP */}
      <section className="lp-hero">
        <div className="lp-hero-bg" style={{ backgroundImage: `url(/assets/images/vip-portal/hero.jpg)` }} />
        <div className="lp-hero-ov" />
        <div className="lp-hero-ct">
          <div className="lp-tag" style={{ color: "rgba(250,250,248,.6)" }}>{L === "en" ? "Registered Member" : "عضو مسجّل"}</div>
          <p className="lp-hero-greet" style={{ color: "rgba(250,250,248,.7)" }}>
            {L === "en" ? "Welcome back," : "أهلاً بعودتك،"} <span style={{ color: "#FAFAF8" }}>{user.name}</span>
          </p>
          <h1 className="lp-htitle" style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
            {L === "en" ? (<>Explore Our<br />Collection</>) : (<>استكشف<br />مجموعتنا</>)}
          </h1>
          <p className="lp-hdesc" style={{ color: "rgba(250,250,248,.7)" }}>
            {L === "en"
              ? "Browse premium residences at Vista. Request pricing, download brochures, and schedule viewings."
              : "تصفح المساكن الفاخرة في فيستا. اطلب الأسعار، حمّل الكتيبات، واحجز معاينة."}
          </p>
          <div className="lp-hacts">
            <button className="btn-w" style={{ background: "#FAFAF8", color: "#0D0D0F", fontWeight: 500, padding: ".85rem 2rem", border: "none", borderRadius: "4px", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }} onClick={() => { trackEvent("cta_browse"); scrollTo("residences"); }}>
              {L === "en" ? "Browse Residences →" : "تصفح المساكن →"}
            </button>
            <button className="btn-o" style={{ background: "transparent", color: "rgba(250,250,248,.8)", border: "1px solid rgba(255,255,255,.15)", padding: ".85rem 2rem", borderRadius: "4px", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }} onClick={() => { trackEvent("cta_book"); scrollTo("booking"); }}>
              {L === "en" ? "Request Viewing" : "طلب معاينة"}
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="lp-stats">
        {[
          { v: "248", l: L === "en" ? "Premium Units" : "وحدة فاخرة" },
          { v: "44", l: L === "en" ? "Floors" : "طابقاً" },
          { v: "8.2%", l: L === "en" ? "Projected ROI" : "عائد متوقع" },
          { v: "Q4 '27", l: L === "en" ? "Completion" : "التسليم" },
        ].map((s, i) => (
          <div className="lp-st" key={i}>
            <div className="lp-stv" style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{s.v}</div>
            <div className="lp-stl" style={{ color: "rgba(250,250,248,.4)" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* RESIDENCES */}
      <section className="lp-sec" id="residences">
        <div className="lp-sh lp-rv">
          <span className="lp-sl" style={{ color: "rgba(250,250,248,.4)" }}>○ {L === "en" ? "Available Residences" : "المساكن المتاحة"}</span>
          <h2 className="lp-st2" style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{L === "en" ? "Discover Your Future Home" : "اكتشف منزل المستقبل"}</h2>
          <p className="lp-ss" style={{ color: "rgba(250,250,248,.6)" }}>{L === "en" ? "Select a residence to view full details and request information" : "اختر مسكناً لعرض التفاصيل وطلب المعلومات"}</p>
        </div>

        <div className="lp-units">
          {UNITS.map((unit) => (
            <div className="lp-card lp-rv" key={unit.id} onClick={() => handleViewUnit(unit)}>
              <div className="lp-card-img">
                <img src={unit.img} alt={unit.name[L]} loading="lazy" />
                <div style={{ position: "absolute", top: "1rem", left: L === "en" ? "1rem" : "auto", right: L === "ar" ? "1rem" : "auto", padding: ".4rem 1rem", background: "rgba(13,13,15,.88)", borderRadius: "4px", fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(250,250,248,.7)" }}>{unit.feature[L]}</div>
                <div style={{ position: "absolute", top: "1rem", right: L === "en" ? "1rem" : "auto", left: L === "ar" ? "1rem" : "auto", padding: ".4rem .9rem", borderRadius: "4px", fontSize: ".7rem", fontWeight: 600, color: "#FFFFFF", background: unit.statusType === "last" ? "#C1121F" : "#2A9D5C" }}>{unit.status[L]}</div>
              </div>
              <div style={{ padding: "1.5rem", background: "#141416" }}>
                <h3 style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.5rem", fontWeight: 500, marginBottom: ".3rem" }}>{unit.name[L]}</h3>
                <p style={{ color: "rgba(250,250,248,.5)", fontSize: ".75rem", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "1rem" }}>{unit.floor[L]}</p>
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", fontSize: ".85rem" }}>
                  <span style={{ color: "rgba(250,250,248,.7)" }}>🛏 {unit.beds[L]}</span>
                  <span style={{ color: "rgba(250,250,248,.7)" }}>📐 {unit.size[L]}</span>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.5rem", fontWeight: 500, color: "#FAFAF8", marginBottom: ".2rem" }}>{unit.priceDisplay[L]}</div>
                <div style={{ fontSize: ".78rem", color: "rgba(250,250,248,.45)" }}>{unit.perSqft[L]}</div>
              </div>
              <div className="lp-card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-o btn-sm" style={{ background: "transparent", color: "rgba(250,250,248,.7)", border: "1px solid rgba(255,255,255,.12)", padding: ".55rem 1.2rem", borderRadius: "4px", fontSize: ".75rem", cursor: "pointer" }} onClick={() => handleViewUnit(unit)}>
                  {L === "en" ? "View Details" : "التفاصيل"}
                </button>
                <button className="btn-o btn-sm" style={{ background: "transparent", color: "rgba(250,250,248,.7)", border: "1px solid rgba(255,255,255,.12)", padding: ".55rem 1.2rem", borderRadius: "4px", fontSize: ".75rem", cursor: "pointer" }} onClick={() => handleDownload(unit)}>
                  {L === "en" ? "📄 Brochure" : "📄 كتيب"}
                </button>
                <button className="btn-w btn-sm" style={{ background: "#FAFAF8", color: "#0D0D0F", fontWeight: 600, padding: ".55rem 1.2rem", border: "none", borderRadius: "4px", fontSize: ".75rem", cursor: "pointer" }} onClick={() => handlePricing(unit)}>
                  {L === "en" ? "💰 Request Pricing" : "💰 طلب الأسعار"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="lp-div"><div className="lp-div-l" /><div className="lp-div-d" style={{ color: "rgba(250,250,248,.15)" }}>○</div><div className="lp-div-l" /></div>

      {/* AMENITIES */}
      <section className="lp-sec">
        <div className="lp-sh lp-rv">
          <span className="lp-sl" style={{ color: "rgba(250,250,248,.4)" }}>○ {L === "en" ? "The Lifestyle" : "أسلوب الحياة"}</span>
          <h2 className="lp-st2" style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{L === "en" ? "World-Class Amenities" : "مرافق عالمية المستوى"}</h2>
        </div>
        <div className="lp-am-grid">
          {AMENITIES.map((a, i) => (
            <div className="lp-am lp-rv" key={i}>
              <div className="lp-am-icon">{a.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.05rem", color: "#FAFAF8", marginBottom: ".3rem" }}>{a[L]}</div>
              <div style={{ fontSize: ".78rem", color: "rgba(250,250,248,.55)", lineHeight: "1.5" }}>{L === "en" ? a.descEn : a.descAr}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="lp-div"><div className="lp-div-l" /><div className="lp-div-d" style={{ color: "rgba(250,250,248,.15)" }}>○</div><div className="lp-div-l" /></div>

      {/* INVESTMENT */}
      <section className="lp-sec">
        <div className="lp-sh lp-rv">
          <span className="lp-sl" style={{ color: "rgba(250,250,248,.4)" }}>○ {L === "en" ? "Investment Highlights" : "أبرز الاستثمارات"}</span>
          <h2 className="lp-st2" style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{L === "en" ? "Key Figures" : "الأرقام الرئيسية"}</h2>
        </div>
        <div className="lp-inv-grid">
          {[
            { v: "8.2%", l: L === "en" ? "Rental Yield" : "عائد الإيجار", n: L === "en" ? "Above market average" : "أعلى من السوق" },
            { v: "23%", l: L === "en" ? "Capital Growth" : "نمو رأس المال", n: L === "en" ? "3-year projection" : "توقعات ٣ سنوات" },
            { v: "60/40", l: L === "en" ? "Payment Plan" : "خطة الدفع", n: L === "en" ? "Flexible structure" : "هيكل مرن" },
            { v: "Q4 '27", l: L === "en" ? "Handover" : "التسليم", n: L === "en" ? "On schedule" : "في الموعد" },
          ].map((item, i) => (
            <div className="lp-inv lp-rv" key={i}>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2.2rem", fontWeight: 300, color: "#FAFAF8", marginBottom: ".4rem" }}>{item.v}</div>
              <div style={{ fontSize: ".82rem", color: "#FAFAF8", marginBottom: ".25rem" }}>{item.l}</div>
              <div style={{ fontSize: ".72rem", color: "rgba(250,250,248,.4)" }}>{item.n}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="lp-div"><div className="lp-div-l" /><div className="lp-div-d" style={{ color: "rgba(250,250,248,.15)" }}>○</div><div className="lp-div-l" /></div>

      {/* BOOKING */}
      <section className="lp-sec lp-contact" id="booking">
        <div className="lp-sh lp-rv">
          <span className="lp-sl" style={{ color: "rgba(250,250,248,.4)" }}>○ {L === "en" ? "Schedule a Visit" : "جدولة زيارة"}</span>
          <h2 className="lp-st2" style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{L === "en" ? "Request a Viewing" : "طلب معاينة"}</h2>
          <p className="lp-ss" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Our sales team will confirm your appointment within 48 hours" : "سيؤكد فريق المبيعات موعدك خلال ٤٨ ساعة"}</p>
        </div>
        <form className="lp-form lp-rv" onSubmit={handleBooking}>
          <div className="lp-fg">
            <label className="lp-fl" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Your Name" : "اسمك"}</label>
            <input className="lp-fi" type="text" defaultValue={user.name} style={{ color: "#FAFAF8" }} readOnly />
          </div>
          <div className="lp-fg">
            <label className="lp-fl" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Interested Residence" : "المسكن المطلوب"}</label>
            <select className="lp-fi" style={{ color: "#FAFAF8", background: "rgba(255,255,255,.04)", cursor: "pointer", appearance: "none" }} onChange={(e) => setBookingForm({ ...bookingForm, unit: e.target.value })}>
              <option value="" style={{ background: "#111", color: "#fff" }}>{L === "en" ? "— Select —" : "— اختر —"}</option>
              {UNITS.map((u) => <option key={u.id} value={u.id} style={{ background: "#111", color: "#fff" }}>{u.name[L]} — {u.priceDisplay[L]}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="lp-fg">
              <label className="lp-fl" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Preferred Date" : "التاريخ"}</label>
              <input className="lp-fi" type="date" style={{ color: "#FAFAF8" }} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
            </div>
            <div className="lp-fg">
              <label className="lp-fl" style={{ color: "rgba(250,250,248,.5)" }}>{L === "en" ? "Preferred Time" : "الوقت"}</label>
              <select className="lp-fi" style={{ color: "#FAFAF8", background: "rgba(255,255,255,.04)", cursor: "pointer", appearance: "none" }} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}>
                <option value="" style={{ background: "#111", color: "#fff" }}>—</option>
                <option value="10:00" style={{ background: "#111", color: "#fff" }}>10:00 AM</option>
                <option value="11:00" style={{ background: "#111", color: "#fff" }}>11:00 AM</option>
                <option value="14:00" style={{ background: "#111", color: "#fff" }}>2:00 PM</option>
                <option value="15:00" style={{ background: "#111", color: "#fff" }}>3:00 PM</option>
                <option value="16:00" style={{ background: "#111", color: "#fff" }}>4:00 PM</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ width: "100%", padding: ".95rem", background: "#FAFAF8", color: "#0D0D0F", fontWeight: 600, fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: ".5rem" }}>
            {L === "en" ? "Submit Viewing Request →" : "إرسال طلب المعاينة →"}
          </button>
          <p style={{ textAlign: "center", fontSize: ".72rem", color: "rgba(250,250,248,.35)", marginTop: "1rem" }}>{L === "en" ? "Viewings are subject to availability. Standard access applies." : "المعاينات حسب التوفر. تطبق شروط الوصول القياسية."}</p>
        </form>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "2.5rem 4rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <p style={{ color: "rgba(250,250,248,.4)", fontSize: ".78rem", marginBottom: "1.2rem" }}>
          {L === "en" ? "You are browsing as a registered member. For VIP access, contact our sales team." : "أنت تتصفح كعضو مسجّل. للوصول كـ VIP، تواصل مع فريق المبيعات."}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".6rem", opacity: .7 }}>
          <span style={{ color: "rgba(250,250,248,.4)", fontSize: ".72rem", letterSpacing: ".08em", textTransform: "uppercase" }}>{L === "en" ? "Powered by" : "مدعوم من"}</span>
          <img src="/assets/images/dynamicnfc-logo-red.png" alt="Dynamic NFC" style={{ height: "22px", objectFit: "contain" }} />
        </div>
      </footer>

      {/* MODAL */}
      {selectedUnit && (
        <div className="lp-modal-ov" onClick={() => setSelectedUnit(null)}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-modal-close" style={{ color: "rgba(250,250,248,.7)" }} onClick={() => setSelectedUnit(null)}>✕</button>
            <div className="lp-modal-gallery">
              {selectedUnit.gallery.map((src, i) => <img key={i} src={src} alt={`${selectedUnit.name[L]} ${i + 1}`} loading="lazy" />)}
            </div>
            <div style={{ padding: "2.5rem", background: "#111114" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ color: "#FAFAF8", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2.3rem", fontWeight: 500 }}>{selectedUnit.name[L]}</h2>
                  <p style={{ color: "rgba(250,250,248,.5)", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>{selectedUnit.floor[L]}</p>
                </div>
                <div style={{ textAlign: L === "en" ? "right" : "left" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2rem", fontWeight: 500, color: "#FAFAF8" }}>{selectedUnit.priceDisplay[L]}</div>
                  <div style={{ fontSize: ".82rem", color: "rgba(250,250,248,.45)" }}>{selectedUnit.perSqft[L]}</div>
                </div>
              </div>
              <p style={{ color: "rgba(250,250,248,.8)", fontSize: "1.05rem", lineHeight: "1.8", fontWeight: 300, marginBottom: "2rem", maxWidth: "700px" }}>{selectedUnit.desc[L]}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
                {[
                  { l: L === "en" ? "Bedrooms" : "غرف النوم", v: selectedUnit.beds[L] },
                  { l: L === "en" ? "Bathrooms" : "الحمامات", v: selectedUnit.baths[L] },
                  { l: L === "en" ? "Living Area" : "المساحة", v: selectedUnit.size[L] },
                  { l: L === "en" ? "Status" : "الحالة", v: selectedUnit.status[L], isStatus: true },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "1rem", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", textAlign: "center" }}>
                    <div style={{ fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(250,250,248,.45)", marginBottom: ".3rem" }}>{item.l}</div>
                    {item.isStatus
                      ? <div style={{ color: "#FFFFFF", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1rem", background: selectedUnit.statusType === "last" ? "#C1121F" : "#2A9D5C", display: "inline-block", padding: ".3rem .8rem", borderRadius: "4px" }}>{item.v}</div>
                      : <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.2rem", color: "#FAFAF8" }}>{item.v}</div>
                    }
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "2rem" }}>
                {selectedUnit.features[L].map((f, i) => (
                  <span key={i} style={{ padding: ".4rem .9rem", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "4px", fontSize: ".78rem", color: "rgba(250,250,248,.7)" }}>{f}</span>
                ))}
              </div>
              {/* Payment */}
              <div className="lp-payment">
                <h4 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.3rem", color: "#FAFAF8", marginBottom: "1.5rem" }}>{L === "en" ? "Payment Plan" : "خطة الدفع"}</h4>
                <div className="lp-pay-bar">
                  <div style={{ flex: selectedUnit.payment.down, background: "#FAFAF8" }} />
                  <div style={{ flex: selectedUnit.payment.during, background: "rgba(250,250,248,.5)" }} />
                  <div style={{ flex: selectedUnit.payment.handover, background: "rgba(250,250,248,.2)" }} />
                </div>
                <div className="lp-pay-legend">
                  {[
                    { label: L === "en" ? "Down Payment" : "الدفعة الأولى", pct: selectedUnit.payment.down, bg: "#FAFAF8" },
                    { label: L === "en" ? "During Construction" : "خلال البناء", pct: selectedUnit.payment.during, bg: "rgba(250,250,248,.5)" },
                    { label: L === "en" ? "On Handover" : "عند التسليم", pct: selectedUnit.payment.handover, bg: "rgba(250,250,248,.2)" },
                  ].map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <div className="lp-pay-dot" style={{ background: p.bg }} />
                      <div>
                        <div style={{ fontSize: ".75rem", color: "rgba(250,250,248,.5)" }}>{p.label} ({p.pct}%)</div>
                        <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.1rem", fontWeight: 500, color: "#FAFAF8" }}>{formatAED(selectedUnit.price * p.pct / 100)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap", marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                {[
                  { icon: "📄", label: L === "en" ? "Download Brochure" : "تحميل الكتيب", fn: () => handleDownload(selectedUnit), primary: true },
                  { icon: "📐", label: L === "en" ? "View Floor Plan" : "عرض المخطط", fn: () => handleFloorplan(selectedUnit) },
                  { icon: "💰", label: L === "en" ? "Request Pricing" : "طلب الأسعار", fn: () => handlePricing(selectedUnit), primary: true },
                  { icon: "📊", label: L === "en" ? "Payment Plan" : "خطة الدفع", fn: () => handlePayment(selectedUnit) },
                  { icon: "📅", label: L === "en" ? "Book Viewing" : "حجز معاينة", fn: () => { setSelectedUnit(null); setTimeout(() => scrollTo("booking"), 300); } },
                  { icon: "📞", label: L === "en" ? "Contact Sales" : "اتصل بالمبيعات", fn: handleContact },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.fn} style={{
                    background: btn.primary ? "#FAFAF8" : "transparent",
                    color: btn.primary ? "#0D0D0F" : "rgba(250,250,248,.7)",
                    border: btn.primary ? "none" : "1px solid rgba(255,255,255,.12)",
                    padding: ".8rem 1.6rem", borderRadius: "4px", cursor: "pointer",
                    fontSize: ".82rem", letterSpacing: ".08em", textTransform: "uppercase",
                    fontWeight: btn.primary ? 600 : 400,
                  }}>
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="lp-toast" style={{ color: "#0D0D0F", background: "#FAFAF8" }}>{toast}</div>}
    </div>
  );
}
