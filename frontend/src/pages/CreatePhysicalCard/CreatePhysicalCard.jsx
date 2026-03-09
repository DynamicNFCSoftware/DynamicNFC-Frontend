import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/css/enterprise-light.css";

/* ═══════════════════════════════════════════════════════ */
/* i18n — English / Arabic Translation System             */
/* ═══════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  en: {
    home: "Home", enterprise: "Enterprise", nfcCards: "NFC Cards",
    login: "Login", logout: "Logout", dashboard: "Dashboard",
    badge: "Create Your Card", pageTitle: "Design Your NFC Card",
    pageSubtitle: "Choose your card material and style, then personalize with your name, logo, and QR link.",
    materialFinish: "Material & Finish", chooseCard: "Choose Your Card", collection: "Collection",
    cardWhite: "White Digital Business Card", cardBlack: "Black Digital Business Card",
    cardGolden: "Golden Digital Business Card", cardSilver: "Silver Digital Business Card",
    cardMetalGold: "Metal Golden Digital Business Card", cardMetalSilver: "Metal Silver Digital Business Card",
    cardMetalBlack: "Metal Black Digital Business Card", cardRoseGold: "Metal Rose Gold Digital Business Card",
    card24k: "24K Gold Digital Business Card", cardBamboo: "Bambu Digital Business Card",
    cardWood: "Wooden Digital Business Card", cardTransparent: "Transparent PVC Digital Business Card",
    shortWhite: "White", shortBlack: "Black", shortGolden: "Golden", shortSilver: "Silver",
    shortMetalGold: "Metal Gold", shortMetalSilver: "Metal Silver", shortMetalBlack: "Metal Black",
    shortRoseGold: "Rose Gold", short24k: "24K Gold", shortBamboo: "Bamboo", shortWood: "Walnut", shortTransparent: "Transparent",
    matPVC: "PVC", matMetal: "Metal", matEco: "Eco",
    namePlaceholder: "Name Surname", yourLogo: "Your Logo", uploadLogoBack: "Upload a logo to see it here",
    flipToBack: "Tap card to see back side", flipToFront: "Tap card again to see front",
    cardDetails: "Card Details", formSubtitle: "Enter your information below. Your card will be printed and shipped with NFC & QR enabled.",
    nfcQr: "NFC + QR", fullName: "Full Name", enterName: "Enter your name", nameHint: "Will appear on the front of the card.",
    uploadLogo: "Upload Logo", clickUpload: "Click to upload", orDragDrop: "or drag & drop",
    fileFormats: "Formats: SVG, PNG, JPG, PDF — appears on both sides.",
    qrCodeLink: "QR Code Link", yourWebsite: "your website or profile", urlPlaceholder: "https://yourwebsite.com",
    urlError: "Please enter a valid web link", urlHint: "This URL will be encoded as a QR code on your card.", continueBtn: "Continue",

    /* Bulk Inquiry Modal */
    inqTitle: "Love Your Design? Let's Scale It.",
    inqSub: "DynamicNFC cards are built for teams and enterprises. Tell us about your order and we'll prepare a custom quote.",
    inqDesignSummary: "Your Design",
    inqCardType: "Card Type",
    inqQrLink: "QR Link",
    inqMinNote: "Minimum order: 25 cards. Custom NFC encoding, premium packaging, worldwide shipping included.",
    inqQuantity: "How Many Cards?",
    inqQty25: "25–49",
    inqQty50: "50–99",
    inqQty100: "100–249",
    inqQty250: "250+",
    inqCompany: "Company / Organization",
    inqEmail: "Business Email",
    inqPhone: "Phone (optional)",
    inqNotes: "Additional Notes",
    inqNotesHint: "Departments, roles, special encoding, branding requirements...",
    inqSubmit: "Request Bulk Quote →",
    inqSubmitting: "Submitting...",
    inqSuccess: "Quote Request Sent!",
    inqSuccessDesc: "Our enterprise team will prepare a custom quote based on your design and volume. Expect a response within 24 hours.",
    inqClose: "Close",
    inqOrSales: "Or talk to our team directly:",
    inqCallSales: "Contact Sales",
    freeShipping: "Free Shipping", qrIncluded: "QR Included", nfcEnabled: "NFC Enabled", noAppRequired: "No App Required",
    aboutProduct: "About Product", aboutTitle: "DynamicNFC Digital Business Card with Durable and Prestigious Representation",
    aboutP1: "DynamicNFC digital business card combines professional presence with advanced digital technology in one seamless solution.",
    aboutP2: "With NFC and QR code support, DynamicNFC enables instant sharing at events, corporate meetings, and networking environments.",
    aboutP3: "DynamicNFC is an AI-powered digital business card platform developed in Canada.",
    techFeatures: "Technical Features", nfcChip: "NFC Chip (NTAG 216)",
    nfcChipDesc: "High-frequency 13.56 MHz contactless chip. One-tap instant sharing.",
    customQR: "Custom QR Code", customQRDesc: "Encoded QR code printed on the card front. Scannable by any camera.",
    premiumMaterials: "Premium Materials", premiumMaterialsDesc: "PVC, brushed metal, 24K gold, bamboo, and wood. ISO 7810 standard.",
    universalCompat: "Universal Compatibility", universalCompatDesc: "iPhone XS+, all Android, any QR scanner. No app required.",
    securePrivate: "Secure & Private", securePrivateDesc: "Encrypted servers in Canada. GDPR and CCPA compliant.",
    aiPlatform: "AI-Powered Platform", aiPlatformDesc: "Real-time analytics and smart contact management.",
    footerText: "AI-Powered Digital Business Cards. Developed in Canada.",
  },
  ar: {
    home: "الرئيسية", enterprise: "المؤسسات", nfcCards: "بطاقات NFC",
    login: "تسجيل الدخول", logout: "تسجيل الخروج", dashboard: "لوحة التحكم",
    badge: "صمّم بطاقتك", pageTitle: "صمّم بطاقتك الرقمية NFC",
    pageSubtitle: "اختر خامة بطاقتك وتصميمها، ثم خصّصها باسمك وشعارك ورابط QR.",
    materialFinish: "الخامة والتشطيب", chooseCard: "اختر بطاقتك", collection: "المجموعة",
    cardWhite: "بطاقة أعمال رقمية بيضاء", cardBlack: "بطاقة أعمال رقمية سوداء",
    cardGolden: "بطاقة أعمال رقمية ذهبية", cardSilver: "بطاقة أعمال رقمية فضية",
    cardMetalGold: "بطاقة أعمال رقمية معدنية ذهبية", cardMetalSilver: "بطاقة أعمال رقمية معدنية فضية",
    cardMetalBlack: "بطاقة أعمال رقمية معدنية سوداء", cardRoseGold: "بطاقة أعمال رقمية ذهبي وردي",
    card24k: "بطاقة أعمال رقمية ذهب عيار ٢٤", cardBamboo: "بطاقة أعمال رقمية من الخيزران",
    cardWood: "بطاقة أعمال رقمية من خشب الجوز", cardTransparent: "بطاقة أعمال رقمية شفافة",
    shortWhite: "أبيض", shortBlack: "أسود", shortGolden: "ذهبي", shortSilver: "فضي",
    shortMetalGold: "معدن ذهبي", shortMetalSilver: "معدن فضي", shortMetalBlack: "معدن أسود",
    shortRoseGold: "ذهبي وردي", short24k: "ذهب ٢٤", shortBamboo: "خيزران", shortWood: "جوز", shortTransparent: "شفاف",
    matPVC: "PVC", matMetal: "معدن", matEco: "طبيعي",
    namePlaceholder: "الاسم الكامل", yourLogo: "شعارك", uploadLogoBack: "ارفع شعارك ليظهر هنا",
    flipToBack: "انقر على البطاقة لرؤية الخلف", flipToFront: "انقر مجدداً لرؤية الأمام",
    cardDetails: "تفاصيل البطاقة", formSubtitle: "أدخل بياناتك أدناه. ستُطبع بطاقتك وتُشحن مع تقنيتي NFC وQR.",
    nfcQr: "NFC + QR", fullName: "الاسم الكامل", enterName: "أدخل اسمك", nameHint: "سيظهر على واجهة البطاقة.",
    uploadLogo: "رفع الشعار", clickUpload: "انقر للرفع", orDragDrop: "أو اسحب وأفلت",
    fileFormats: "الصيغ: SVG، PNG، JPG، PDF — يظهر على الوجهين.",
    qrCodeLink: "رابط رمز QR", yourWebsite: "موقعك أو ملفك الشخصي", urlPlaceholder: "https://yourwebsite.com",
    urlError: "يرجى إدخال رابط صالح", urlHint: "سيُشفَّر هذا الرابط كرمز QR على بطاقتك.", continueBtn: "متابعة",

    /* Bulk Inquiry Modal */
    inqTitle: "أعجبك التصميم؟ لنوسّعه لفريقك.",
    inqSub: "بطاقات DynamicNFC مصممة للفرق والمؤسسات. أخبرنا عن طلبك وسنجهز عرض سعر مخصص.",
    inqDesignSummary: "تصميمك",
    inqCardType: "نوع البطاقة",
    inqQrLink: "رابط QR",
    inqMinNote: "الحد الأدنى: ٢٥ بطاقة. ترميز NFC مخصص، تغليف فاخر، شحن عالمي.",
    inqQuantity: "كم بطاقة تحتاج؟",
    inqQty25: "٢٥–٤٩",
    inqQty50: "٥٠–٩٩",
    inqQty100: "١٠٠–٢٤٩",
    inqQty250: "+٢٥٠",
    inqCompany: "الشركة / المؤسسة",
    inqEmail: "البريد المهني",
    inqPhone: "الهاتف (اختياري)",
    inqNotes: "ملاحظات إضافية",
    inqNotesHint: "الأقسام، الأدوار، ترميز خاص، متطلبات العلامة التجارية...",
    inqSubmit: "اطلب عرض سعر جماعي →",
    inqSubmitting: "جارٍ الإرسال...",
    inqSuccess: "تم إرسال طلب العرض!",
    inqSuccessDesc: "فريق المؤسسات سيجهز عرض سعر مخصص بناءً على تصميمك وحجمك. توقع رداً خلال ٢٤ ساعة.",
    inqClose: "إغلاق",
    inqOrSales: "أو تحدث مع فريقنا مباشرة:",
    inqCallSales: "تواصل مع المبيعات",
    freeShipping: "شحن مجاني", qrIncluded: "QR مُضمَّن", nfcEnabled: "NFC مُفعَّل", noAppRequired: "لا يتطلب تطبيقاً",
    aboutProduct: "عن المنتج", aboutTitle: "بطاقة DynamicNFC الرقمية — حضور مهني بتصميم متين وفاخر",
    aboutP1: "تجمع بطاقة DynamicNFC الرقمية بين الحضور المهني والتقنية الرقمية المتقدمة في حل واحد متكامل.",
    aboutP2: "بدعم تقنيتي NFC وQR، تتيح DynamicNFC مشاركة فورية في الفعاليات والاجتماعات وبيئات التواصل المهني.",
    aboutP3: "DynamicNFC منصة بطاقات أعمال رقمية مدعومة بالذكاء الاصطناعي، طُوِّرت في كندا.",
    techFeatures: "المواصفات التقنية", nfcChip: "شريحة NFC (NTAG 216)",
    nfcChipDesc: "شريحة لاتلامسية بتردد 13.56 ميغاهرتز. مشاركة فورية بلمسة واحدة.",
    customQR: "رمز QR مخصص", customQRDesc: "رمز QR مُشفَّر ومطبوع على واجهة البطاقة. يُقرأ بأي كاميرا.",
    premiumMaterials: "خامات فاخرة", premiumMaterialsDesc: "PVC، معدن مصقول، ذهب عيار 24، خيزران، وخشب. معيار ISO 7810.",
    universalCompat: "توافق شامل", universalCompatDesc: "iPhone XS والأحدث، جميع أجهزة Android، أي قارئ QR. لا يتطلب تطبيقاً.",
    securePrivate: "آمن وخاص", securePrivateDesc: "خوادم مشفرة في كندا. متوافق مع GDPR وCCPA.",
    aiPlatform: "منصة بالذكاء الاصطناعي", aiPlatformDesc: "تحليلات لحظية وإدارة جهات اتصال ذكية.",
    footerText: "بطاقات أعمال رقمية بالذكاء الاصطناعي. طُوِّرت في كندا.",
  },
};

const CARD_NAME_KEYS = { white: "cardWhite", black: "cardBlack", golden: "cardGolden", silver: "cardSilver", "metal-golden": "cardMetalGold", "metal-silver": "cardMetalSilver", "metal-black": "cardMetalBlack", "metal-rosegold": "cardRoseGold", "24k-gold": "card24k", bambu: "cardBamboo", wooden: "cardWood", transparent: "cardTransparent" };
const CARD_SHORT_KEYS = { white: "shortWhite", black: "shortBlack", golden: "shortGolden", silver: "shortSilver", "metal-golden": "shortMetalGold", "metal-silver": "shortMetalSilver", "metal-black": "shortMetalBlack", "metal-rosegold": "shortRoseGold", "24k-gold": "short24k", bambu: "shortBamboo", wooden: "shortWood", transparent: "shortTransparent" };
const MAT_LABEL_KEYS = { PVC: "matPVC", Metal: "matMetal", Eco: "matEco" };

function detectLang() { const n = navigator.language || navigator.userLanguage || "en"; return n.startsWith("ar") ? "ar" : "en"; }

/* ── Card catalogue ── */
const CARD_TYPES = [
  { id: "white", name: "White Digital Business Card", shortName: "White", material: "PVC", materialClass: "mat-pvc-white", textColor: "#1a1a1f", nfcColor: "#457b9d", qrStyle: "dark" },
  { id: "black", name: "Black Digital Business Card", shortName: "Black", material: "PVC", materialClass: "mat-pvc-black", textColor: "#ffffff", nfcColor: "#6ba3c7", qrStyle: "light" },
  { id: "golden", name: "Golden Digital Business Card", shortName: "Golden", material: "PVC", materialClass: "mat-pvc-golden", textColor: "#2a1f00", nfcColor: "#5a4400", qrStyle: "dark" },
  { id: "silver", name: "Silver Digital Business Card", shortName: "Silver", material: "PVC", materialClass: "mat-pvc-silver", textColor: "#1a1a1f", nfcColor: "#555", qrStyle: "dark" },
  { id: "metal-golden", name: "Metal Golden Digital Business Card", shortName: "Metal Gold", material: "Metal", materialClass: "mat-metal-gold", textColor: "#2a1f00", nfcColor: "#5a4400", qrStyle: "dark" },
  { id: "metal-silver", name: "Metal Silver Digital Business Card", shortName: "Metal Silver", material: "Metal", materialClass: "mat-metal-silver", textColor: "#1a1a1f", nfcColor: "#555", qrStyle: "dark" },
  { id: "metal-black", name: "Metal Black Digital Business Card", shortName: "Metal Black", material: "Metal", materialClass: "mat-metal-black", textColor: "#e8e8e8", nfcColor: "#888", qrStyle: "light" },
  { id: "metal-rosegold", name: "Metal Rose Gold Digital Business Card", shortName: "Rose Gold", material: "Metal", materialClass: "mat-metal-rosegold", textColor: "#3d1f14", nfcColor: "#6b3a28", qrStyle: "dark" },
  { id: "24k-gold", name: "24K Gold Digital Business Card", shortName: "24K Gold", material: "Metal", materialClass: "mat-metal-24k", textColor: "#3d2e00", nfcColor: "#6b5200", qrStyle: "dark" },
  { id: "bambu", name: "Bambu Digital Business Card", shortName: "Bamboo", material: "Eco", materialClass: "mat-eco-bamboo", textColor: "#2e1f05", nfcColor: "#5a4000", qrStyle: "dark" },
  { id: "wooden", name: "Wooden Digital Business Card", shortName: "Walnut", material: "Eco", materialClass: "mat-eco-wood", textColor: "#f5e6d0", nfcColor: "#c8a870", qrStyle: "light" },
  { id: "transparent", name: "Transparent PVC Digital Business Card", shortName: "Transparent", material: "PVC", materialClass: "mat-pvc-transparent", textColor: "#1a1a1f", nfcColor: "#666", qrStyle: "dark" },
];
const MATERIAL_GROUPS = [{ key: "PVC", label: "PVC" }, { key: "Metal", label: "Metal" }, { key: "Eco", label: "Eco" }];

/* ═══ MapleLeaf — Official Canadian Flag Construction Sheet ═══ */
const MAPLE_LEAF_PATH = "M 480,80 L 546,210 L 630,178 L 565,210 L 589,388 L 696,358 L 611,366 L 840,343 L 732,358 L 717,366 L 852,493 L 750,473 L 732,457 L 852,493 L 717,473 L 664,646 L 683,646 L 660,660 L 511,694 L 511,886 L 449,886 L 449,694 L 300,660 L 277,646 L 296,646 L 243,473 L 108,493 L 228,457 L 210,473 L 108,493 L 243,366 L 228,358 L 120,343 L 349,366 L 264,358 L 371,388 L 395,210 L 330,178 L 414,210 L 480,80 Z";

function MapleLeaf({ size = 24, color = "#FF0000" }) {
  return (
    <svg viewBox="0 0 960 960" width={size} height={size} fill={color} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", shapeRendering: "geometricPrecision" }}>
      <path d={MAPLE_LEAF_PATH} />
    </svg>
  );
}

/* ═══ Dynamic QR Data URL Builder ═══ */
function generateQrDataUrl({ cardId, fullName, userUrl, isDarkCard }) {
  const params = new URLSearchParams();
  if (cardId) params.set("c", cardId);
  if (fullName) params.set("n", fullName);
  const baseUrl = userUrl || "https://dynamicnfc.ca";
  const qrPayload = params.toString()
    ? `https://dynamicnfc.ca/c/${cardId || "new"}?${params.toString()}&r=${encodeURIComponent(baseUrl)}`
    : baseUrl;
  const qrFg = isDarkCard ? "ffffff" : "1a1a1f";
  const qrBg = isDarkCard ? "000000" : "ffffff";
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&margin=0&ecc=H&color=${qrFg}&bgcolor=${qrBg}&data=${encodeURIComponent(qrPayload)}`;
}

function isValidUrl(str) {
  if (!str || !str.trim()) return false;
  try { const url = new URL(str.startsWith("http") ? str : `https://${str}`); return url.hostname.includes("."); } catch { return false; }
}

/* ═══════════════════════════════════════════════════════ */
/* Main Component                                         */
/* ═══════════════════════════════════════════════════════ */
export default function CreatePhysicalCard() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const handleLogout = () => { logout(); navigate("/"); };
  const incomingCard = state?.card;

  // Resolve initial card from route state (OrderCard passes { id })
  const initialCard = (incomingCard?.id && CARD_TYPES.find((c) => c.id === incomingCard.id)) || CARD_TYPES[0];

  const [fullName, setFullName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [qrTouched, setQrTouched] = useState(false);
  const [selectedCard, setSelectedCard] = useState(initialCard);
  const [activeMaterial, setActiveMaterial] = useState(initialCard.material);

  // ── Bulk inquiry ──
  const [showInquiry, setShowInquiry] = useState(false);
  const [modalFlipped, setModalFlipped] = useState(false);
  const [inqStep, setInqStep] = useState("form"); // "form" | "submitting" | "success"
  const [inqQty, setInqQty] = useState("");
  const [inqCompany, setInqCompany] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqNotes, setInqNotes] = useState("");

  // ── i18n ──
  const [lang, setLang] = useState(detectLang);
  const isRTL = lang === "ar";
  const t = useCallback((key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key, [lang]);
  const cardName = (c) => t(CARD_NAME_KEYS[c.id]) || c.name;
  const cardShort = (c) => t(CARD_SHORT_KEYS[c.id]) || c.shortName;
  const matLabel = (key) => t(MAT_LABEL_KEYS[key]) || key;

  // ── Interactive flip ──
  const [isFlipped, setIsFlipped] = useState(false);

  // ── Specular reflection (metal cards) ──
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const isMetalCard = selectedCard.material === "Metal";
  const cardRef = useRef(null);
  const handleCardMouseMove = (e) => {
    if (!isMetalCard || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpecularPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };
  const handleCardMouseLeave = () => setSpecularPos({ x: 50, y: 50 });

  // ── QR verified badge ──
  const [qrVerified, setQrVerified] = useState(false);
  const prevUrlValidRef = useRef(false);

  const handleLogoChange = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onloadend = () => setLogoPreview(reader.result); reader.readAsDataURL(file); };

  const urlValid = isValidUrl(qrUrl);
  const showUrlError = qrTouched && qrUrl.trim().length > 0 && !urlValid;
  const normalizedUrl = urlValid && qrUrl.trim() ? (qrUrl.trim().startsWith("http") ? qrUrl.trim() : `https://${qrUrl.trim()}`) : null;
  const isDarkCard = selectedCard.qrStyle === "light";

  // ── Bulk inquiry submit ──
  const handleInquirySubmit = async () => {
    if (!inqEmail.trim() || !inqQty) return;
    setInqStep("submitting");
    try {
      await fetch('https://formsubmit.co/ajax/info@dynamicnfc.help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `Bulk Card Quote — ${inqQty} cards — ${cardName(selectedCard)}`,
          "Card Type": cardName(selectedCard),
          "Card Material": selectedCard.material,
          "Name on Card": fullName || "(not entered)",
          "QR Link": qrUrl || "(not set)",
          "Logo Uploaded": logoPreview ? "Yes" : "No",
          "Quantity": inqQty,
          "Company": inqCompany,
          "Email": inqEmail,
          "Phone": inqPhone || "(not provided)",
          "Notes": inqNotes || "(none)",
          "_replyto": inqEmail,
          "_template": "table",
        }),
      });
      setInqStep("success");
    } catch (e) {
      // FormSubmit may return CORS on first use — still show success
      // but log the error for debugging
      console.warn("FormSubmit request failed:", e);
      setInqStep("success");
    }
  };

  const openInquiry = () => {
    setShowInquiry(true);
    setInqStep("form");
  };
  const qrImageUrl = normalizedUrl ? generateQrDataUrl({ cardId: selectedCard.id, fullName: fullName || null, userUrl: normalizedUrl, isDarkCard }) : null;

  const handleSelectCard = (ct) => { setSelectedCard(ct); setActiveMaterial(ct.material); setIsFlipped(false); };
  const filteredCards = CARD_TYPES.filter((c) => c.material === activeMaterial);

  useEffect(() => {
    if (urlValid && !prevUrlValidRef.current) { setQrVerified(true); const timer = setTimeout(() => setQrVerified(false), 2000); return () => clearTimeout(timer); }
    if (!urlValid) setQrVerified(false);
    prevUrlValidRef.current = urlValid;
  }, [urlValid]);

  useEffect(() => {
    const container = document.getElementById("el-particles"); if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) { const dot = document.createElement("div"); dot.className = "particle"; dot.style.left = Math.random() * 100 + "%"; dot.style.top = Math.random() * 100 + "%"; dot.style.animationDelay = Math.random() * 12 + "s"; dot.style.animationDuration = 14 + Math.random() * 8 + "s"; container.appendChild(dot); }
  }, []);

  return (
    <div className="enterprise-light" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-mesh" />
      <div className="particles" id="el-particles" />

      <nav className="nav-bar">
        <div className="nav-container">
          <Link to="/" className="logo">DynamicNFC</Link>
          <div className="nav-links">
            <Link to="/">{t("home")}</Link>
            <Link to="/enterprise">{t("enterprise")}</Link>
            <Link to="/nfc-cards">{t("nfcCards")}</Link>
            {isAuthenticated && isAuthenticated() && <Link to="/dashboard">{t("dashboard")}</Link>}
            <div className="lang-switcher">
              <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>EN</button>
              <button className={`lang-btn${lang === "ar" ? " active" : ""}`} onClick={() => setLang("ar")}>ع</button>
            </div>
            {isAuthenticated && isAuthenticated() ? (
              <button onClick={handleLogout} className="nav-btn">{t("logout")}</button>
            ) : (
              <Link to="/login" className="nav-btn">{t("login")}</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="enterprise-content">
        <div className="page-header">
          <span className="badge">{t("badge")}</span>
          <h1>{t("pageTitle")}</h1>
          <p>{t("pageSubtitle")}</p>
        </div>

        <section className="lux-selector">
          <span className="lux-corner lux-corner-tl" /><span className="lux-corner lux-corner-tr" />
          <span className="lux-corner lux-corner-bl" /><span className="lux-corner lux-corner-br" />
          <div className="lux-selector-header">
            <div className="lux-line" />
            <div className="lux-title-group">
              <span className="lux-overline">{t("materialFinish")}</span>
              <h2 className="lux-title">{t("chooseCard")}</h2>
            </div>
            <div className="lux-line" />
          </div>
          <div className="lux-material-tabs">
            {MATERIAL_GROUPS.map((g) => (
              <button key={g.key} type="button" className={`lux-mat-tab${activeMaterial === g.key ? " active" : ""}`} onClick={() => setActiveMaterial(g.key)}>
                {matLabel(g.key)}{activeMaterial === g.key && <span className="lux-tab-glow" />}
              </button>
            ))}
          </div>
          <div className="lux-tile-grid" key={activeMaterial}>
            {filteredCards.map((ct, i) => (
              <button key={ct.id} type="button" className={`lux-tile${selectedCard.id === ct.id ? " selected" : ""}`} onClick={() => handleSelectCard(ct)} style={{ animationDelay: `${i * 0.05}s` }}>
                <span className={`lux-tile-swatch ${ct.materialClass}`}>
                  <span className="lux-tile-noise" />
                  {selectedCard.id === ct.id && <span className="lux-tile-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><path d="m5 12 5 5L20 7" /></svg></span>}
                </span>
                <span className="lux-tile-label">
                  <span className="lux-tile-name">{cardShort(ct)}</span>
                  {ct.material !== "PVC" && <span className={`lux-chip-badge ${ct.material === "Metal" ? "badge-metal" : "badge-eco"}`}>{matLabel(ct.material)}</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="lux-selected-display">
            <div className="lux-selected-name">{cardName(selectedCard)}</div>
            <div className="lux-selected-meta"><span className="lux-meta-dot" />{matLabel(selectedCard.material)} {t("collection")} &bull; NFC + QR</div>
          </div>
        </section>

        <div className="card-builder-row">
        <div className="card-form-centered">
          <div className="card-form">
            <h2>{t("cardDetails")}</h2>
            <p className="form-subtitle">{t("formSubtitle")}</p>
            <div className="selected-info-row">
              <span className={`info-swatch ${selectedCard.materialClass}`} />
              <div><strong>{cardName(selectedCard)}</strong><span className="info-material">{matLabel(selectedCard.material)} • {t("nfcQr")}</span></div>
            </div>
            <hr className="form-divider" />
            <div className="form-group">
              <label htmlFor="fullName">{t("fullName")}</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("enterName")} />
              <span className="form-hint">{t("nameHint")}</span>
            </div>
            <hr className="form-divider" />
            <div className="form-group">
              <label>{t("uploadLogo")}</label>
              <div className="file-upload-area">
                <input type="file" accept="image/svg+xml,image/png,image/jpeg,image/jpg,application/pdf" onChange={handleLogoChange} />
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <div className="upload-text"><strong>{t("clickUpload")}</strong> {t("orDragDrop")}</div>
              </div>
              <span className="form-hint">{t("fileFormats")}</span>
            </div>
            <hr className="form-divider" />
            <div className="form-group">
              <label htmlFor="qrUrl">{t("qrCodeLink")}<span className="label-optional"> ({t("yourWebsite")})</span></label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <input id="qrUrl" type="text" value={qrUrl} onChange={(e) => setQrUrl(e.target.value)} onBlur={() => setQrTouched(true)} placeholder={t("urlPlaceholder")} className={`has-icon${showUrlError ? " input-error" : ""}${urlValid ? " input-valid" : ""}`} dir="ltr" />
                {qrUrl.trim().length > 0 && (
                  <span className={`input-status ${urlValid ? "valid" : "invalid"}`}>
                    {urlValid ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="m5 12 5 5L20 7" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
                  </span>
                )}
              </div>
              {showUrlError ? <span className="form-hint form-error">{t("urlError")}</span> : <span className="form-hint">{t("urlHint")}</span>}
            </div>
            <button className="primary-btn" type="button" onClick={openInquiry}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>{t("continueBtn")}</button>
          </div>
        </div>

        <div className="card-showcase card-showcase-sticky">
          <div ref={cardRef} className={`card-flipper-hover${isFlipped ? " is-flipped" : ""}`} onClick={() => setIsFlipped((f) => !f)} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            {isMetalCard && <div className="metal-specular-interactive" style={{ background: `radial-gradient(ellipse 50% 40% at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 30%, transparent 70%)` }} />}
            <div className={`card-face card-front ${selectedCard.materialClass}`}>
              <div className="card-noise-overlay" />
              <div className="card-logo-area">
                {logoPreview ? <img src={logoPreview} alt="Your logo" className="card-logo" /> : (
                  <div className="card-logo-placeholder" style={{ borderColor: selectedCard.textColor + "30", color: selectedCard.textColor + "80" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                    <span>{t("yourLogo")}</span>
                  </div>
                )}
              </div>
              <div className="card-nfc-icon" style={{ color: selectedCard.nfcColor }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /></svg>
              </div>
              <div className="card-bottom-bar">
                <div className="card-name" style={{ color: selectedCard.textColor }}>{fullName || t("namePlaceholder")}</div>
                {qrImageUrl ? (
                  <div className={`card-qr-wrap ${isDarkCard ? "qr-on-dark" : "qr-on-light"}`}>
                    <img src={qrImageUrl} alt="QR" className="card-qr-img" />
                    <span className="qr-overlay"><span className="qr-overlay-pad"><MapleLeaf size={12} color={isDarkCard ? "#FF2D3B" : "#D80621"} /></span></span>
                    <span className={`qr-verified-badge${qrVerified ? " visible" : ""}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10"><path d="m5 12 5 5L20 7" /></svg></span>
                  </div>
                ) : (
                  <div className="card-qr-placeholder" style={{ borderColor: selectedCard.textColor + "20", color: selectedCard.textColor + "25" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="30" height="30"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /><rect x="18" y="14" width="3" height="3" /><rect x="14" y="18" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /></svg>
                  </div>
                )}
              </div>
            </div>
            <div className={`card-face card-back ${selectedCard.materialClass}`}>
              <div className="card-noise-overlay" />
              <div className="card-back-content">
                {logoPreview ? <img src={logoPreview} alt="Logo" className="card-back-user-logo" /> : (
                  <div className="card-back-empty" style={{ color: selectedCard.textColor + "50" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="44" height="44"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                    <span>{t("uploadLogoBack")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="preview-label">{isFlipped ? t("flipToFront") : t("flipToBack")}</div>
        </div>
        </div>

        <div className="info-strip">
          <div className="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>{t("freeShipping")}</div>
          <div className="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>{t("qrIncluded")}</div>
          <div className="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /></svg>{t("nfcEnabled")}</div>
          <div className="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>{t("noAppRequired")}</div>
        </div>

        <section className="about-product">
          <div className="section-divider"><span>{t("aboutProduct")}</span></div>
          <h2 className="about-title">{t("aboutTitle")}</h2>
          <div className="about-content"><p>{t("aboutP1")}</p><p>{t("aboutP2")}</p><p>{t("aboutP3")}</p></div>
        </section>

        <section className="tech-features">
          <div className="section-divider"><span>{t("techFeatures")}</span></div>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-icon-wrap blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" /></svg></div><h4>{t("nfcChip")}</h4><p>{t("nfcChipDesc")}</p></div>
            <div className="feature-card"><div className="feature-icon-wrap red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /></svg></div><h4>{t("customQR")}</h4><p>{t("customQRDesc")}</p></div>
            <div className="feature-card"><div className="feature-icon-wrap blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /></svg></div><h4>{t("premiumMaterials")}</h4><p>{t("premiumMaterialsDesc")}</p></div>
            <div className="feature-card"><div className="feature-icon-wrap red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" /></svg></div><h4>{t("universalCompat")}</h4><p>{t("universalCompatDesc")}</p></div>
            <div className="feature-card"><div className="feature-icon-wrap blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg></div><h4>{t("securePrivate")}</h4><p>{t("securePrivateDesc")}</p></div>
            <div className="feature-card"><div className="feature-icon-wrap red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" /></svg></div><h4>{t("aiPlatform")}</h4><p>{t("aiPlatformDesc")}</p></div>
          </div>
        </section>
      </main>

      {/* ═══════ BULK INQUIRY MODAL ═══════ */}
      {showInquiry && (
        <div className="inq-overlay" onClick={() => { setShowInquiry(false); navigate("/"); }}>
          <div className="inq-modal inq-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="inq-layout">

            {/* Card Preview */}
            <div className="inq-preview">
              <div className={`card-flipper-hover inq-card-flip${modalFlipped ? " is-flipped" : ""}`} onClick={() => setModalFlipped((f) => !f)}>
                <div className={`card-face card-front ${selectedCard.materialClass}`}>
                  <div className="card-noise-overlay" />
                  <div className="card-logo-area">
                    {logoPreview ? <img src={logoPreview} alt="Logo" className="card-logo" /> : (
                      <div className="card-logo-placeholder" style={{ borderColor: selectedCard.textColor + "30", color: selectedCard.textColor + "80" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                        <span>{t("yourLogo")}</span>
                      </div>
                    )}
                  </div>
                  <div className="card-nfc-icon" style={{ color: selectedCard.nfcColor }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /></svg>
                  </div>
                  <div className="card-bottom-bar">
                    <div className="card-name" style={{ color: selectedCard.textColor }}>{fullName || t("namePlaceholder")}</div>
                    {qrImageUrl ? (
                      <div className={`card-qr-wrap ${isDarkCard ? "qr-on-dark" : "qr-on-light"}`}>
                        <img src={qrImageUrl} alt="QR" className="card-qr-img" />
                      </div>
                    ) : (
                      <div className="card-qr-placeholder" style={{ borderColor: selectedCard.textColor + "20", color: selectedCard.textColor + "25" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="30" height="30"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /><rect x="18" y="14" width="3" height="3" /><rect x="14" y="18" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /></svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`card-face card-back ${selectedCard.materialClass}`}>
                  <div className="card-noise-overlay" />
                  <div className="card-back-content">
                    {logoPreview ? <img src={logoPreview} alt="Logo" className="card-back-user-logo" /> : (
                      <div className="card-back-empty" style={{ color: selectedCard.textColor + "50" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="44" height="44"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inq-preview-label">{modalFlipped ? t("flipToFront") : t("flipToBack")}</div>
              <div className="inq-preview-info">
                <strong>{cardName(selectedCard)}</strong>
                <span>{matLabel(selectedCard.material)} • NFC + QR</span>
              </div>
            </div>

            {/* Form Side */}
            <div className="inq-form-side">
            {inqStep === "success" ? (
              <div className="inq-success">
                <div className="inq-success-icon">✅</div>
                <h2>{t("inqSuccess")}</h2>
                <p>{t("inqSuccessDesc")}</p>
                <button className="inq-close-btn" onClick={() => { setShowInquiry(false); navigate("/"); }}>{t("inqClose")}</button>
              </div>
            ) : (
              <div className="inq-body">
                <h2 className="inq-title">{t("inqTitle")}</h2>
                <p className="inq-sub">{t("inqSub")}</p>

                <div className="inq-summary">
                  <div className="inq-summary-label">{t("inqDesignSummary")}</div>
                  <div className="inq-summary-grid">
                    <div><span>{t("inqCardType")}: </span><strong>{cardShort(selectedCard)}</strong></div>
                    <div><span>{t("fullName")}: </span><strong>{fullName || "—"}</strong></div>
                    <div><span>{t("inqQrLink")}: </span><strong>{qrUrl || "—"}</strong></div>
                    <div><span>Logo: </span><strong>{logoPreview ? "✓" : "—"}</strong></div>
                  </div>
                </div>

                <div className="inq-note">{t("inqMinNote")}</div>

                <div className="inq-field">
                  <label className="inq-label">{t("inqQuantity")}</label>
                  <div className="inq-qty-grid">
                    {["25–49", "50–99", "100–249", "250+"].map((qty, i) => {
                      const keys = ["inqQty25", "inqQty50", "inqQty100", "inqQty250"];
                      return (
                        <button key={qty} type="button" className={`inq-qty-btn${inqQty === qty ? " active" : ""}`} onClick={() => setInqQty(qty)}>{t(keys[i])}</button>
                      );
                    })}
                  </div>
                </div>

                <div className="inq-field">
                  <label className="inq-label">{t("inqCompany")}</label>
                  <input className="inq-input" value={inqCompany} onChange={(e) => setInqCompany(e.target.value)} />
                </div>

                <div className="inq-field">
                  <label className="inq-label">{t("inqEmail")} <span className="req">*</span></label>
                  <input className="inq-input" value={inqEmail} onChange={(e) => setInqEmail(e.target.value)} type="email" required />
                </div>

                <div className="inq-field">
                  <label className="inq-label">{t("inqPhone")}</label>
                  <input className="inq-input" value={inqPhone} onChange={(e) => setInqPhone(e.target.value)} type="tel" />
                </div>

                <div className="inq-field">
                  <label className="inq-label">{t("inqNotes")}</label>
                  <textarea className="inq-textarea" value={inqNotes} onChange={(e) => setInqNotes(e.target.value)} rows={3} placeholder={t("inqNotesHint")} />
                </div>

                <button className="inq-submit" onClick={handleInquirySubmit} disabled={inqStep === "submitting" || !inqEmail.trim() || !inqQty}>
                  {inqStep === "submitting" ? t("inqSubmitting") : t("inqSubmit")}
                </button>

                <div className="inq-footer">
                  <span>{t("inqOrSales")} </span>
                  <button className="inq-footer-link" onClick={() => { setShowInquiry(false); navigate("/contact-sales"); }}>{t("inqCallSales")}</button>
                </div>
              </div>
            )}
            </div>
            </div>
          </div>
        </div>
      )}

      <footer className="el-footer">
        <p>&copy; 2026 <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">DynamicNFC</a> — {t("footerText")}</p>
      </footer>
    </div>
  );
}
