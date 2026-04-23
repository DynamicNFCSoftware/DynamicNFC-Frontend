import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/css/enterprise-light.css";
import IndustriesDropdown from "../../components/IndustriesDropdown";

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
    cardWhite: "White NFC Business Card", cardBlack: "Black NFC Business Card",
    cardGolden: "Golden NFC Business Card", cardSilver: "Silver NFC Business Card",
    cardMetalGold: "Metal Golden NFC Business Card", cardMetalSilver: "Metal Silver NFC Business Card",
    cardMetalBlack: "Metal Black NFC Business Card", cardRoseGold: "Metal Rose Gold NFC Business Card",
    card24k: "24K Gold NFC Business Card", cardBamboo: "Bamboo NFC Business Card",
    cardWood: "Walnut Wood NFC Business Card", cardTransparent: "Transparent PVC NFC Business Card",
    shortWhite: "White", shortBlack: "Black", shortGolden: "Golden", shortSilver: "Silver",
    shortMetalGold: "Metal Gold", shortMetalSilver: "Metal Silver", shortMetalBlack: "Metal Black",
    shortRoseGold: "Rose Gold", short24k: "24K Gold", shortBamboo: "Bamboo", shortWood: "Walnut", shortTransparent: "Transparent",
    matPVC: "PVC", matMetal: "Metal", matEco: "Eco",
    matPVCPrice: "$30 / card", matMetalPrice: "$50 / card", matEcoPrice: "$50 / card",
    matPVCDesc: "Classic, durable PVC — White, Black, Golden, Silver, or Transparent.",
    matMetalDesc: "Brushed metal — Gold, Silver, Black, Rose Gold, or luxurious 24K Gold.",
    matEcoDesc: "Sustainable bamboo or walnut wood — eco-friendly and unique.",
    minOrderNote: "Minimum order: 25 cards per design",
    namePlaceholder: "Name Surname", yourLogo: "Your Logo", uploadLogoBack: "Upload a logo to see it here",
    flipToBack: "Tap card to see back side", flipToFront: "Tap card again to see front",
    cardDetails: "Card Details", formSubtitle: "Enter your information below. Your card will be printed and shipped with NFC & QR enabled.",
    nfcQr: "NFC + QR", fullName: "Full Name", enterName: "Enter your name", nameHint: "Will appear on the front of the card.",
    uploadLogo: "Upload Logo", clickUpload: "Click to upload", orDragDrop: "or drag & drop",
    fileFormats: "Formats: SVG, PNG, JPG, PDF — appears on both sides.",
    qrCodeLink: "QR Code Link", yourWebsite: "your website or profile", urlPlaceholder: "https://yourwebsite.com",
    urlError: "Please enter a valid web link", urlHint: "This URL will be encoded as a QR code on your card.", continueBtn: "Continue",

    /* Card Form Fields */
    fieldCompany: "Company / Organization",
    fieldCompanyPh: "e.g. Al Noor Properties",
    fieldCompanyHint: "Appears at the top of the card with your logo.",
    fieldTitle: "Job Title",
    fieldTitlePh: "e.g. Senior Sales Director",
    fieldTitleHint: "Appears below your name on the front.",
    fieldPhone: "Phone Number",
    fieldPhonePh: "+971 50 123 4567",
    fieldPhoneHint: "Printed on the back of the card. Include country code.",
    fieldEmail: "Business Email",
    fieldEmailPh: "khalid@alnoorproperties.ae",
    fieldEmailHint: "Printed on the back of the card.",

    /* Card Preview Placeholders */
    phCompany: "Company Name",
    phName: "Your Name",
    phTitle: "Job Title",
    phPhone: "+1 672 200 8071",
    phEmail: "name@company.ae",
    phWebsite: "yourwebsite.com",
    tapToConnect: "Tap to connect",
    scanToConnect: "Scan to connect",
    previewHint: "Hover to see back side",

    /* Bulk Inquiry Modal */
    inqTitle: "Love Your Design? Let's Scale It.",
    inqSub: "DynamicNFC cards are built for teams and enterprises. Tell us about your order and we'll prepare a custom quote.",
    inqDesignSummary: "Your Design",
    inqCardType: "Card Type",
    inqQrLink: "QR Link",
    inqEditDesign: "Edit Design",
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
    inqNextRoster: "Next: Assign Team Members →",
    rosterTitle: "Assign Team Members",
    rosterAssigned: "assigned",
    rosterDesc: "Each card will be personalized with the team member's name and contact details. Add members manually or upload a CSV.",
    rosterCsvDrop: "Drop a CSV file here or",
    rosterCsvBrowse: "browse files",
    rosterCsvFormat: "Format: name, title, email, phone, company (one row per person)",
    rosterCsvTemplate: "Need help? Download our pre-filled template",
    rosterCsvDownload: "Download CSV Template",
    rosterName: "Full Name",
    rosterRole: "Title / Role",
    rosterEmail: "Email",
    rosterPhone: "Phone",
    rosterCompany: "Company",
    rosterNamePh: "e.g. Khalid Al-Mansouri",
    rosterRolePh: "e.g. Senior Sales Director",
    rosterEmailPh: "e.g. khalid@alnoor.ae",
    rosterPhonePh: "e.g. 50 123 4567",
    rosterCompanyPh: "e.g. Al Noor Properties",
    rosterAdd: "Add team member",
    rosterNote: "You can add up to the number of cards ordered. Unassigned cards will be printed with company branding only (no personal name). You can always update the roster after ordering.",
    rosterBack: "Back",
    rosterSubmit: "Review & Submit Order →",
    rosterSkip: "Skip — I'll assign team members later",
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
    badge: "أنشئ بطاقتك", pageTitle: "صمم بطاقة الاتصال قريب المدى الخاصة بك",
    pageSubtitle: "اختر مادة البطاقة ونمطها، ثم خصصها باسمك وشعارك ورابط QR.",
    materialFinish: "المادة والتشطيب", chooseCard: "اختر بطاقتك", collection: "المجموعة",
    cardWhite: "بطاقة أعمال رقمية بيضاء", cardBlack: "بطاقة أعمال رقمية سوداء",
    cardGolden: "بطاقة أعمال رقمية ذهبية", cardSilver: "بطاقة أعمال رقمية فضية",
    cardMetalGold: "بطاقة أعمال رقمية ذهبية معدنية", cardMetalSilver: "بطاقة أعمال رقمية فضية معدنية",
    cardMetalBlack: "بطاقة أعمال رقمية سوداء معدنية", cardRoseGold: "بطاقة أعمال رقمية من الذهب الوردي المعدني",
    card24k: "بطاقة أعمال رقمية من ذهب عيار 24", cardBamboo: "بطاقة أعمال رقمية من البامبو",
    cardWood: "بطاقة أعمال رقمية خشبية", cardTransparent: "بطاقة أعمال رقمية شفافة من PVC",
    shortWhite: "أبيض", shortBlack: "أسود", shortGolden: "ذهبي", shortSilver: "فضي",
    shortMetalGold: "ذهبي معدني", shortMetalSilver: "فضي معدني", shortMetalBlack: "أسود معدني",
    shortRoseGold: "ذهب وردي", short24k: "ذهب عيار 24", shortBamboo: "بامبو", shortWood: "خشب الجوز", shortTransparent: "شفاف",
    matPVC: "PVC", matMetal: "معدن", matEco: "صديق للبيئة",
    matPVCPrice: "٣٠$ / بطاقة", matMetalPrice: "٥٠$ / بطاقة", matEcoPrice: "٥٠$ / بطاقة",
    matPVCDesc: "PVC كلاسيكي ومتين — أبيض، أسود، ذهبي، فضي، أو شفاف.",
    matMetalDesc: "معدن مصقول — ذهبي، فضي، أسود، ذهبي وردي، أو ذهب عيار ٢٤.",
    matEcoDesc: "خيزران أو خشب جوز مستدام — صديق للبيئة وفريد.",
    minOrderNote: "الحد الأدنى للطلب: ٢٥ بطاقة لكل تصميم",
    namePlaceholder: "الاسم واللقب", yourLogo: "شعارك", uploadLogoBack: "قم بتحميل شعار لعرضه هنا",
    flipToBack: "اضغط على البطاقة لرؤية الجهة الخلفية", flipToFront: "اضغط على البطاقة مرة أخرى لرؤية الجهة الأمامية",
    cardDetails: "تفاصيل البطاقة", formSubtitle: "أدخل معلوماتك أدناه. سيتم طباعة بطاقتك وشحنها مع تفعيل الاتصال قريب المدى وQR.",
    nfcQr: "الاتصال قريب المدى + QR", fullName: "الاسم الكامل", enterName: "أدخل اسمك", nameHint: "سيظهر على الجهة الأمامية للبطاقة.",
    uploadLogo: "تحميل الشعار", clickUpload: "انقر للتحميل", orDragDrop: "أو اسحب وأفلت",
    fileFormats: "الصيغ: SVG ، PNG ، JPG ، PDF — يظهر على كلا الجانبين.",
    qrCodeLink: "رابط رمز QR", yourWebsite: "موقعك الإلكتروني أو ملفك الشخصي", urlPlaceholder: "https://yourwebsite.com",
    urlError: "يرجى إدخال رابط ويب صالح", urlHint: "سيتم ترميز هذا الرابط كرمز QR على بطاقتك.", continueBtn: "متابعة",

    /* Card Form Fields */
    fieldCompany: "الشركة / المؤسسة",
    fieldCompanyPh: "مثال: عقارات النور",
    fieldCompanyHint: "يظهر أعلى البطاقة مع شعارك.",
    fieldTitle: "المسمى الوظيفي",
    fieldTitlePh: "مثال: مدير المبيعات الأول",
    fieldTitleHint: "يظهر أسفل اسمك على الوجه الأمامي.",
    fieldPhone: "رقم الهاتف",
    fieldPhonePh: "+971 50 123 4567",
    fieldPhoneHint: "يُطبع على ظهر البطاقة. أضف رمز البلد.",
    fieldEmail: "البريد الإلكتروني للعمل",
    fieldEmailPh: "khalid@alnoorproperties.ae",
    fieldEmailHint: "يُطبع على ظهر البطاقة.",

    /* Card Preview Placeholders */
    phCompany: "اسم الشركة",
    phName: "اسمك",
    phTitle: "المسمى الوظيفي",
    phPhone: "+1 672 200 8071",
    phEmail: "name@company.ae",
    phWebsite: "yourwebsite.com",
    tapToConnect: "اضغط للتواصل",
    scanToConnect: "امسح للتواصل",
    previewHint: "مرر الماوس لرؤية الخلف",

    /* Bulk Inquiry Modal */
    inqTitle: "أعجبك تصميمك؟ لنوسّعه.",
    inqSub: "تم تصميم بطاقات DynamicNFC للفرق والمؤسسات. أخبرنا عن طلبك وسنقوم بإعداد عرض سعر مخصص.",
    inqDesignSummary: "تصميمك",
    inqCardType: "نوع البطاقة",
    inqQrLink: "رابط QR",
    inqEditDesign: "تعديل التصميم",
    inqMinNote: "الحد الأدنى للطلب: 25 بطاقة. يشمل ترميز الاتصال قريب المدى مخصص، وتغليف مميز، وشحن عالمي.",
    inqQuantity: "كم عدد البطاقات؟",
    inqQty25: "25–49",
    inqQty50: "50–99",
    inqQty100: "100–249",
    inqQty250: "250+",
    inqCompany: "الشركة / المؤسسة",
    inqEmail: "البريد الإلكتروني للعمل",
    inqPhone: "الهاتف (اختياري)",
    inqNotes: "ملاحظات إضافية",
    inqNotesHint: "الأقسام، الأدوار، الترميز الخاص، متطلبات العلامة التجارية...",
    inqSubmit: "طلب عرض سعر للكميات →",
    inqSubmitting: "جارٍ الإرسال...",
    inqSuccess: "تم إرسال طلب عرض السعر!",
    inqSuccessDesc: "سيقوم فريق المؤسسات لدينا بإعداد عرض سعر مخصص بناءً على تصميمك والكمية. توقع ردًا خلال 24 ساعة.",
    inqClose: "إغلاق",
    inqOrSales: "أو تحدث مع فريقنا مباشرة:",
    inqCallSales: "التواصل مع المبيعات",
    inqNextRoster: "التالي: تعيين أعضاء الفريق ←",
    rosterTitle: "تعيين أعضاء الفريق",
    rosterAssigned: "معيّن",
    rosterDesc: "سيتم تخصيص كل بطاقة باسم العضو وبيانات الاتصال. أضف الأعضاء يدوياً أو ارفع ملف CSV.",
    rosterCsvDrop: "اسحب ملف CSV هنا أو",
    rosterCsvBrowse: "تصفح الملفات",
    rosterCsvFormat: "الصيغة: الاسم، المسمى الوظيفي، البريد الإلكتروني، الهاتف، الشركة (سطر لكل شخص)",
    rosterCsvTemplate: "تحتاج مساعدة؟ حمّل النموذج الجاهز",
    rosterCsvDownload: "تحميل نموذج CSV",
    rosterName: "الاسم الكامل",
    rosterRole: "المسمى الوظيفي",
    rosterEmail: "البريد الإلكتروني",
    rosterPhone: "الهاتف",
    rosterCompany: "الشركة",
    rosterNamePh: "مثال: خالد المنصوري",
    rosterRolePh: "مثال: مدير المبيعات الأول",
    rosterEmailPh: "مثال: khalid@alnoor.ae",
    rosterPhonePh: "مثال: 50 123 4567",
    rosterCompanyPh: "مثال: عقارات النور",
    rosterAdd: "إضافة عضو",
    rosterNote: "يمكنك إضافة أعضاء حتى عدد البطاقات المطلوبة. البطاقات غير المعيّنة ستُطبع بشعار الشركة فقط. يمكنك تعديل القائمة لاحقاً.",
    rosterBack: "رجوع",
    rosterSubmit: "مراجعة وإرسال الطلب ←",
    rosterSkip: "تخطي — سأعيّن الأعضاء لاحقاً",
    freeShipping: "شحن مجاني", qrIncluded: "يتضمن رمز QR", nfcEnabled: "مفعّل بتقنية الاتصال قريب المدى", noAppRequired: "لا يتطلب تطبيق",
    aboutProduct: "حول المنتج", aboutTitle: "بطاقة الأعمال الرقمية DynamicNFC مع تمثيل متين ومرموق",
    aboutP1: "بطاقة الأعمال الرقمية DynamicNFC تجمع بين الحضور المهني والتكنولوجيا الرقمية المتقدمة في حل متكامل واحد.",
    aboutP2: "بفضل دعم تقنية الاتصال قريب المدى ورمز QR، تمكّن DynamicNFC من المشاركة الفورية في الفعاليات والاجتماعات المؤسسية وبيئات التواصل المهني.",
    aboutP3: "DynamicNFC هي منصة بطاقات أعمال رقمية مدعومة بالذكاء الاصطناعي تم تطويرها في كندا.",
    techFeatures: "المميزات التقنية", nfcChip: "شريحة الاتصال قريب المدى ‏(NTAG 216)",
    nfcChipDesc: "شريحة لاسلكية عالية التردد 13.56 ميغاهرتز. مشاركة فورية بلمسة واحدة.",
    customQR: "رمز QR مخصص", customQRDesc: "رمز QR مشفّر مطبوع على واجهة البطاقة. قابل للمسح بواسطة أي كاميرا.",
    premiumMaterials: "مواد مميزة", premiumMaterialsDesc: "PVC، معدن مصقول، ذهب عيار 24، بامبو، وخشب. معيار ISO 7810.",
    universalCompat: "توافق عالمي", universalCompatDesc: "iPhone XS وما بعده، جميع أجهزة أندرويد، أي ماسح QR. لا يتطلب تطبيق.",
    securePrivate: "آمن وخاص", securePrivateDesc: "خوادم مشفرة في كندا. متوافق مع GDPR و CCPA.",
    aiPlatform: "منصة مدعومة بالذكاء الاصطناعي", aiPlatformDesc: "تحليلات فورية وإدارة ذكية لجهات الاتصال.",
    footerText: "بطاقات أعمال رقمية مدعومة بالذكاء الاصطناعي. تم تطويرها في كندا.",
  },
};

const CARD_NAME_KEYS = { white: "cardWhite", black: "cardBlack", golden: "cardGolden", silver: "cardSilver", "metal-golden": "cardMetalGold", "metal-silver": "cardMetalSilver", "metal-black": "cardMetalBlack", "metal-rosegold": "cardRoseGold", "24k-gold": "card24k", bambu: "cardBamboo", wooden: "cardWood", transparent: "cardTransparent" };
const CARD_SHORT_KEYS = { white: "shortWhite", black: "shortBlack", golden: "shortGolden", silver: "shortSilver", "metal-golden": "shortMetalGold", "metal-silver": "shortMetalSilver", "metal-black": "shortMetalBlack", "metal-rosegold": "shortRoseGold", "24k-gold": "short24k", bambu: "shortBamboo", wooden: "shortWood", transparent: "shortTransparent" };
const MAT_LABEL_KEYS = { PVC: "matPVC", Metal: "matMetal", Eco: "matEco" };

function detectLang() { const n = navigator.language || navigator.userLanguage || "en"; return n.startsWith("ar") ? "ar" : "en"; }

/* ── Card catalogue ── */
const CARD_TYPES = [
  { id: "white", name: "White NFC Business Card", shortName: "White", material: "PVC", materialClass: "mat-pvc-white", textColor: "#1a1a1f", nfcColor: "#457b9d", qrStyle: "dark" },
  { id: "black", name: "Black NFC Business Card", shortName: "Black", material: "PVC", materialClass: "mat-pvc-black", textColor: "#ffffff", nfcColor: "#6ba3c7", qrStyle: "light" },
  { id: "golden", name: "Golden NFC Business Card", shortName: "Golden", material: "PVC", materialClass: "mat-pvc-golden", textColor: "#2a1f00", nfcColor: "#5a4400", qrStyle: "dark" },
  { id: "silver", name: "Silver NFC Business Card", shortName: "Silver", material: "PVC", materialClass: "mat-pvc-silver", textColor: "#1a1a1f", nfcColor: "#555", qrStyle: "dark" },
  { id: "metal-golden", name: "Metal Golden NFC Business Card", shortName: "Metal Gold", material: "Metal", materialClass: "mat-metal-gold", textColor: "#2a1f00", nfcColor: "#5a4400", qrStyle: "dark" },
  { id: "metal-silver", name: "Metal Silver NFC Business Card", shortName: "Metal Silver", material: "Metal", materialClass: "mat-metal-silver", textColor: "#1a1a1f", nfcColor: "#555", qrStyle: "dark" },
  { id: "metal-black", name: "Metal Black NFC Business Card", shortName: "Metal Black", material: "Metal", materialClass: "mat-metal-black", textColor: "#e8e8e8", nfcColor: "#888", qrStyle: "light" },
  { id: "metal-rosegold", name: "Metal Rose Gold NFC Business Card", shortName: "Rose Gold", material: "Metal", materialClass: "mat-metal-rosegold", textColor: "#3d1f14", nfcColor: "#6b3a28", qrStyle: "dark" },
  { id: "24k-gold", name: "24K Gold NFC Business Card", shortName: "24K Gold", material: "Metal", materialClass: "mat-metal-24k", textColor: "#3d2e00", nfcColor: "#6b5200", qrStyle: "dark" },
  { id: "bambu", name: "Bamboo NFC Business Card", shortName: "Bamboo", material: "Eco", materialClass: "mat-eco-bamboo", textColor: "#2e1f05", nfcColor: "#5a4000", qrStyle: "dark" },
  { id: "wooden", name: "Walnut Wood NFC Business Card", shortName: "Walnut", material: "Eco", materialClass: "mat-eco-wood", textColor: "#f5e6d0", nfcColor: "#c8a870", qrStyle: "light" },
  { id: "transparent", name: "Transparent PVC NFC Business Card", shortName: "Transparent", material: "PVC", materialClass: "mat-pvc-transparent", textColor: "#1a1a1f", nfcColor: "#666", qrStyle: "dark" },
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
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [emailAddress, setEmailAddress] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [qrTouched, setQrTouched] = useState(false);
  const [selectedCard, setSelectedCard] = useState(initialCard);
  const [activeMaterial, setActiveMaterial] = useState(initialCard.material);

  // ── Bulk inquiry ──
  const [showInquiry, setShowInquiry] = useState(false);
  const [modalFlipped, setModalFlipped] = useState(false);
  const [inqStep, setInqStep] = useState("form"); // "form" | "roster" | "submitting" | "success"
  const [inqQty, setInqQty] = useState("");
  const [inqCompany, setInqCompany] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqCountryCode, setInqCountryCode] = useState("+971");
  const [inqNotes, setInqNotes] = useState("");

  // ── Team roster ──
  const [teamMembers, setTeamMembers] = useState([]);
  const [csvError, setCsvError] = useState("");

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

  const formatPhone = (num) => {
    if (!num) return "";
    const digits = num.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.slice(0, 3) + " " + digits.slice(3);
    return digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6);
  };

  const urlValid = isValidUrl(qrUrl);
  const showUrlError = qrTouched && qrUrl.trim().length > 0 && !urlValid;
  const normalizedUrl = urlValid && qrUrl.trim() ? (qrUrl.trim().startsWith("http") ? qrUrl.trim() : `https://${qrUrl.trim()}`) : null;
  const isDarkCard = selectedCard.qrStyle === "light";

  // ── Team Roster Helpers ──
  const addTeamMember = () => {
    setTeamMembers(prev => [...prev, { id: Date.now(), name: "", title: "", email: "", phone: "", company: "" }]);
  };

  const updateTeamMember = (id, field, value) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const downloadCsvTemplate = () => {
    const csvContent = [
      "Full Name,Title / Role,Email,Phone,Company",
      "Khalid Al-Mansouri,Senior Sales Director,khalid@alnoor.ae,+971 50 123 4567,Al Noor Properties",
      "Fatima Al-Suwaidi,Investment Advisor,fatima@alnoor.ae,+971 55 234 5678,Al Noor Properties",
      "Sultan Al-Dhaheri,Regional Manager,sultan@dhaheri.ae,+971 52 345 6789,Dhaheri Group",
      "Noura Al-Ketbi,Marketing Director,noura@ketbi.ae,+971 56 456 7890,Ketbi Investments",
      "Ahmed Al-Hashimi,Client Relations,ahmed@hashimi.ae,+971 54 567 8901,Hashimi Holdings",
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dynamicnfc_team_roster_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvError("");
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const lines = evt.target.result.split("\n").filter(l => l.trim());
        const startIdx = lines[0].toLowerCase().includes("name") ? 1 : 0;
        const parsed = [];
        for (let i = startIdx; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
          if (cols[0]) {
            parsed.push({ id: Date.now() + i, name: cols[0] || "", title: cols[1] || "", email: cols[2] || "", phone: cols[3] || "", company: cols[4] || "" });
          }
        }
        if (parsed.length === 0) { setCsvError("No valid rows found. Format: name, title, email, phone, company"); return; }
        setTeamMembers(prev => [...prev, ...parsed]);
      } catch { setCsvError("Could not parse CSV file. Please check the format."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const getMaxMembers = () => {
    if (inqQty === "25–49" || inqQty === "25-49") return 49;
    if (inqQty === "50–99" || inqQty === "50-99") return 99;
    if (inqQty === "100–249" || inqQty === "100-249") return 249;
    if (inqQty === "250+") return 500;
    return 49;
  };

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
          "Company on Card": companyName || "(not entered)",
          "Job Title": jobTitle || "(not entered)",
          "Phone on Card": phoneNumber ? `${countryCode} ${formatPhone(phoneNumber)}` : "(not entered)",
          "Email on Card": emailAddress || "(not entered)",
          "QR Link": qrUrl || "(not set)",
          "Logo Uploaded": logoPreview ? "Yes" : "No",
          "Quantity": inqQty,
          "Company": inqCompany,
          "Email": inqEmail,
          "Phone": inqPhone ? `${inqCountryCode} ${formatPhone(inqPhone)}` : "(not provided)",
          "Notes": inqNotes || "(none)",
          "Team Size": teamMembers.filter(m => m.name.trim()).length + " members assigned",
          "Team Roster": teamMembers.filter(m => m.name.trim()).length > 0
            ? teamMembers.filter(m => m.name.trim()).map((m, i) => `${i+1}. ${m.name} | ${m.title || 'No title'} | ${m.email || 'No email'} | ${m.phone || 'No phone'} | ${m.company || 'No company'}`).join("\n")
            : "(No team members assigned — single purchaser order)",
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
    setTeamMembers([]);
    setCsvError("");
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
          <Link to="/" className="logo"><img src="/assets/images/logo.png" alt="DynamicNFC" style={{height:'52px',width:'auto'}} /></Link>
          <div className="nav-links">
            <Link to="/">{t("home")}</Link>
            <IndustriesDropdown lang={lang} triggerClassName="el-nav-dd-trigger" />
            <Link to="/nfc-cards">{t("nfcCards")}</Link>
            <Link to="/contact-sales">{t("inqCallSales") || "Contact Sales"}</Link>
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
            {MATERIAL_GROUPS.map((g) => {
              const priceKey = g.key === "PVC" ? "matPVCPrice" : g.key === "Metal" ? "matMetalPrice" : "matEcoPrice";
              const descKey = g.key === "PVC" ? "matPVCDesc" : g.key === "Metal" ? "matMetalDesc" : "matEcoDesc";
              return (
                <button key={g.key} type="button" className={`lux-mat-tab lux-mat-tab-enhanced${activeMaterial === g.key ? " active" : ""}`} onClick={() => setActiveMaterial(g.key)}>
                  <span className="lux-mat-tab-name">{matLabel(g.key)}</span>
                  <span className="lux-mat-tab-price">{t(priceKey)}</span>
                  {activeMaterial === g.key && <span className="lux-mat-tab-desc">{t(descKey)}</span>}
                  {activeMaterial === g.key && <span className="lux-tab-glow" />}
                </button>
              );
            })}
          </div>
          <div className="lux-min-order-note">{t("minOrderNote")}</div>
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
              <label htmlFor="companyName">{t("fieldCompany")}</label>
              <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={t("fieldCompanyPh")} />
              <span className="form-hint">{t("fieldCompanyHint")}</span>
            </div>
            <hr className="form-divider" />
            <div className="form-group">
              <label htmlFor="fullName">{t("fullName")}</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("enterName")} />
              <span className="form-hint">{t("nameHint")}</span>
            </div>
            <hr className="form-divider" />
            <div className="form-group">
              <label htmlFor="jobTitle">{t("fieldTitle")}</label>
              <input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder={t("fieldTitlePh")} />
              <span className="form-hint">{t("fieldTitleHint")}</span>
            </div>
            <hr className="form-divider" />
            <div className="form-group">
              <label htmlFor="phoneNumber">{t("fieldPhone")}</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ width: "120px", padding: "0 8px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: ".88rem", fontFamily: "inherit", color: "#1a1a1f", background: "#fff", cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: "28px" }}>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+974">🇶🇦 +974</option>
                  <option value="+973">🇧🇭 +973</option>
                  <option value="+968">🇴🇲 +968</option>
                  <option value="+965">🇰🇼 +965</option>
                  <option value="+962">🇯🇴 +962</option>
                  <option value="+961">🇱🇧 +961</option>
                  <option value="+20">🇪🇬 +20</option>
                  <option value="+90">🇹🇷 +90</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+1">🇨🇦 +1</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
                <input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="50 123 4567" style={{ flex: 1 }} />
              </div>
              <span className="form-hint">{t("fieldPhoneHint")}</span>
            </div>
            <hr className="form-divider" />
            <div className="form-group">
              <label htmlFor="emailAddress">{t("fieldEmail")}</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input id="emailAddress" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} placeholder={t("fieldEmailPh")} className="has-icon" />
              </div>
              <span className="form-hint">{t("fieldEmailHint")}</span>
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
            {/* FRONT SIDE */}
            <div className={`card-face card-front ${selectedCard.materialClass}`} style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="card-noise-overlay" />
              <div style={{ position: "absolute", top: "10%", left: "8%" }}>
                <span style={{ fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: selectedCard.textColor, opacity: 0.85, fontWeight: 800 }}>
                  {companyName || t("phCompany")}
                </span>
              </div>
              <div style={{ position: "absolute", bottom: "12%", left: "8%" }}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: selectedCard.textColor, letterSpacing: ".02em", marginBottom: "4px", fontFamily: "'Playfair Display', serif" }}>
                  {fullName || t("phName")}
                </div>
                <div style={{ fontSize: "11px", color: selectedCard.textColor, opacity: 0.8, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 400 }}>
                  {jobTitle || t("phTitle")}
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "8%", right: "8%", display: "flex", alignItems: "center", gap: "5px" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor} strokeWidth="1.5" width="14" height="14" opacity=".55"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8"/></svg>
                <span style={{ fontSize: "8px", letterSpacing: ".1em", textTransform: "uppercase", color: selectedCard.textColor, opacity: 0.5 }}>{t("tapToConnect")}</span>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, transparent 2%, #b8860b 15%, #d4a843 50%, #b8860b 85%, transparent 98%)", opacity: 1 }} />
            </div>
            {/* BACK SIDE */}
            <div className={`card-face card-back ${selectedCard.materialClass}`} style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="card-noise-overlay" />
              {/* Contact info — UPPER LEFT */}
              <div style={{ position: "absolute", top: "12%", left: "8%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="2" width="14" height="14" opacity="0.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                  <span style={{ fontSize: "12px", color: selectedCard.textColor || "#1a1a1f", opacity: 0.8, letterSpacing: ".01em" }}>{phoneNumber ? `${countryCode} ${formatPhone(phoneNumber)}` : "+971 XX XXX XXXX"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="2" width="14" height="14" opacity="0.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span style={{ fontSize: "12px", color: selectedCard.textColor || "#1a1a1f", opacity: 0.8, letterSpacing: ".01em" }}>{emailAddress || "name@company.ae"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="2" width="14" height="14" opacity="0.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span style={{ fontSize: "12px", color: selectedCard.textColor || "#1a1a1f", opacity: 0.8, letterSpacing: ".01em" }}>{qrUrl || "yourwebsite.com"}</span>
                </div>
              </div>
              {/* QR Code — UPPER RIGHT */}
              <div style={{ position: "absolute", top: "10%", right: "8%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {qrImageUrl ? (
                  <img src={qrImageUrl} alt="QR" style={{ width: "90px", height: "90px", borderRadius: "8px" }} />
                ) : (
                  <div style={{ width: "90px", height: "90px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.02)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="1.5" width="32" height="32" opacity=".2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
                  </div>
                )}
              </div>
              {/* Logo — centered bottom, clean */}
              {logoPreview && (
                <div style={{ position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)" }}>
                  <img src={logoPreview} alt="Logo" style={{ maxWidth: "135px", maxHeight: "85px", objectFit: "contain", opacity: 0.6 }} />
                </div>
              )}
            </div>
          </div>
          <div className="preview-label">{isFlipped ? t("flipToFront") : t("previewHint")}</div>
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
        <div className="inq-overlay" onClick={() => { setShowInquiry(false); setTeamMembers([]); setCsvError(""); navigate("/"); }}>
          <div className="inq-modal inq-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="inq-layout">

            {/* Card Preview */}
            <div className="inq-preview">
              <div className={`card-flipper-hover inq-card-flip${modalFlipped ? " is-flipped" : ""}`} onClick={() => setModalFlipped((f) => !f)}>
                {/* MODAL FRONT */}
                <div className={`card-face card-front ${selectedCard.materialClass}`} style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="card-noise-overlay" />
                  <div style={{ position: "absolute", top: "10%", left: "8%" }}>
                    <span style={{ fontSize: "9px", letterSpacing: ".1em", textTransform: "uppercase", color: selectedCard.textColor, opacity: 0.85, fontWeight: 800 }}>{companyName || t("phCompany")}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: "12%", left: "8%" }}>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: selectedCard.textColor, letterSpacing: ".03em", marginBottom: "2px", fontFamily: "'Playfair Display', serif" }}>{fullName || t("phName")}</div>
                    <div style={{ fontSize: "8px", color: selectedCard.textColor, opacity: 0.8, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 400 }}>{jobTitle || t("phTitle")}</div>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, transparent 2%, #b8860b 15%, #d4a843 50%, #b8860b 85%, transparent 98%)", opacity: 1 }} />
                </div>
                {/* MODAL BACK */}
                <div className={`card-face card-back ${selectedCard.materialClass}`} style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="card-noise-overlay" />
                  {/* Contact info — UPPER LEFT */}
                  <div style={{ position: "absolute", top: "12%", left: "8%", display: "flex", flexDirection: "column", gap: "7px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="2" width="10" height="10" opacity="0.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                      <span style={{ fontSize: "9px", color: selectedCard.textColor || "#1a1a1f", opacity: 0.8, letterSpacing: ".01em" }}>{phoneNumber ? `${countryCode} ${formatPhone(phoneNumber)}` : "+971 XX XXX XXXX"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="2" width="10" height="10" opacity="0.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <span style={{ fontSize: "9px", color: selectedCard.textColor || "#1a1a1f", opacity: 0.8, letterSpacing: ".01em" }}>{emailAddress || "name@company.ae"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="2" width="10" height="10" opacity="0.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      <span style={{ fontSize: "9px", color: selectedCard.textColor || "#1a1a1f", opacity: 0.8, letterSpacing: ".01em" }}>{qrUrl || "yourwebsite.com"}</span>
                    </div>
                  </div>
                  {/* QR Code — UPPER RIGHT */}
                  <div style={{ position: "absolute", top: "10%", right: "8%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {qrImageUrl ? (
                      <img src={qrImageUrl} alt="QR" style={{ width: "64px", height: "64px", borderRadius: "6px" }} />
                    ) : (
                      <div style={{ width: "64px", height: "64px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.02)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={selectedCard.textColor || "#1a1a1f"} strokeWidth="1.5" width="26" height="26" opacity=".2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
                      </div>
                    )}
                  </div>
                  {/* Logo — centered bottom, clean */}
                  {logoPreview && (
                    <div style={{ position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)" }}>
                      <img src={logoPreview} alt="Logo" style={{ maxWidth: "101px", maxHeight: "61px", objectFit: "contain", opacity: 0.6 }} />
                    </div>
                  )}
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
            {inqStep === "success" && (
              <div className="inq-success">
                <div className="inq-success-icon">✅</div>
                <h2>{t("inqSuccess")}</h2>
                <p>{t("inqSuccessDesc")}</p>
                <button className="inq-close-btn" onClick={() => { setShowInquiry(false); setTeamMembers([]); setCsvError(""); navigate("/"); }}>{t("inqClose")}</button>
              </div>
            )}

            {inqStep === "form" && (
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
                  {(companyName || jobTitle || phoneNumber || emailAddress) && (
                    <div style={{ marginTop: ".75rem", paddingTop: ".75rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      {companyName && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".35rem" }}>
                          <span style={{ color: "#6b7280" }}>{t("fieldCompany")}</span>
                          <span style={{ color: "#1a1a1f", fontWeight: 500 }}>{companyName}</span>
                        </div>
                      )}
                      {jobTitle && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".35rem" }}>
                          <span style={{ color: "#6b7280" }}>{t("fieldTitle")}</span>
                          <span style={{ color: "#1a1a1f", fontWeight: 500 }}>{jobTitle}</span>
                        </div>
                      )}
                      {phoneNumber && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".35rem" }}>
                          <span style={{ color: "#6b7280" }}>{t("fieldPhone")}</span>
                          <span style={{ color: "#1a1a1f", fontWeight: 500 }}>{countryCode} {formatPhone(phoneNumber)}</span>
                        </div>
                      )}
                      {emailAddress && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".35rem" }}>
                          <span style={{ color: "#6b7280" }}>{t("fieldEmail")}</span>
                          <span style={{ color: "#1a1a1f", fontWeight: 500 }}>{emailAddress}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowInquiry(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "none", border: "1px solid rgba(69,123,157,0.3)",
                    borderRadius: "8px", padding: ".5rem 1rem", fontSize: ".82rem",
                    color: "#457b9d", fontWeight: 500, cursor: "pointer",
                    fontFamily: "inherit", marginTop: ".75rem", transition: ".2s"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  {t("inqEditDesign")}
                </button>

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
                  <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                    <select value={inqCountryCode} onChange={(e) => setInqCountryCode(e.target.value)} style={{ width: "120px", padding: "0 8px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: ".88rem", fontFamily: "inherit", color: "#1a1a1f", background: "#fff", cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: "28px" }}>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+973">🇧🇭 +973</option>
                      <option value="+968">🇴🇲 +968</option>
                      <option value="+965">🇰🇼 +965</option>
                      <option value="+962">🇯🇴 +962</option>
                      <option value="+961">🇱🇧 +961</option>
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+1">🇨🇦 +1</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                    </select>
                    <input className="inq-input" value={inqPhone} onChange={(e) => { const digits = e.target.value.replace(/\D/g, ""); setInqPhone(digits); }} type="tel" placeholder="50 123 4567" style={{ flex: 1 }} />
                  </div>
                </div>

                <div className="inq-field">
                  <label className="inq-label">{t("inqNotes")}</label>
                  <textarea className="inq-textarea" value={inqNotes} onChange={(e) => setInqNotes(e.target.value)} rows={3} placeholder={t("inqNotesHint")} />
                </div>

                <button className="inq-submit" onClick={() => setInqStep("roster")} disabled={!inqEmail.trim() || !inqQty}>
                  {t("inqNextRoster")}
                </button>

                <div className="inq-footer">
                  <span>{t("inqOrSales")} </span>
                  <button className="inq-footer-link" onClick={() => { setShowInquiry(false); navigate("/contact-sales"); }}>{t("inqCallSales")}</button>
                </div>
              </div>
            )}

            {inqStep === "roster" && (
              <div style={{ padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500, color: "#1a1a1f", margin: 0 }}>
                    {t("rosterTitle")}
                  </h3>
                  <span style={{ fontSize: ".78rem", padding: ".35rem .75rem", background: "#e6f1fb", color: "#185fa5", borderRadius: "50px", fontWeight: 500 }}>
                    {teamMembers.filter(m => m.name.trim()).length} / {inqQty.replace("–", "-")} {t("rosterAssigned")}
                  </span>
                </div>
                <p style={{ fontSize: ".85rem", color: "#6b7280", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  {t("rosterDesc")}
                </p>

                <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
                  <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "#1d9e75" }} />
                  <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "#378add" }} />
                  <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "#e0e0e0" }} />
                </div>

                <div style={{
                  border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px",
                  marginBottom: "1rem", overflow: "hidden"
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: ".75rem 1rem", background: "rgba(69,123,157,0.04)",
                    borderBottom: "1px solid rgba(0,0,0,0.06)"
                  }}>
                    <span style={{ fontSize: ".82rem", color: "#1a1a1f" }}>
                      <span style={{ marginRight: "6px" }}>📋</span> {t("rosterCsvTemplate")}
                    </span>
                    <button onClick={downloadCsvTemplate}
                      style={{
                        background: "none", border: "1px solid rgba(69,123,157,0.3)", borderRadius: "6px",
                        padding: "5px 14px", fontSize: ".78rem", color: "#457b9d", fontWeight: 500,
                        cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px"
                      }}>
                      ↓ {t("rosterCsvDownload")}
                    </button>
                  </div>
                  <div style={{
                    padding: "1rem", textAlign: "center", cursor: "pointer", position: "relative",
                    background: "rgba(0,0,0,0.01)"
                  }}>
                    <input
                      type="file" accept=".csv,.txt" onChange={handleCsvUpload}
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: ".85rem", color: "#6b7280" }}>
                      {t("rosterCsvDrop")} <span style={{ color: "#457b9d", fontWeight: 500 }}>{t("rosterCsvBrowse")}</span>
                    </span>
                    <div style={{ fontSize: ".75rem", color: "#9ca3af", marginTop: ".25rem" }}>
                      {t("rosterCsvFormat")}
                    </div>
                  </div>
                </div>
                {csvError && (
                  <p style={{ fontSize: ".78rem", color: "#e63946", marginBottom: ".75rem" }}>{csvError}</p>
                )}

                {teamMembers.length > 0 && (
                  <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px", overflow: "hidden", marginBottom: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 1fr 1fr 1fr 36px", background: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      {["#", t("rosterName"), t("rosterRole"), t("rosterEmail"), t("rosterPhone"), t("rosterCompany"), ""].map((h, i) => (
                        <div key={i} style={{ padding: "8px 10px", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".08em", color: "#6b7280", fontWeight: 600 }}>{h}</div>
                      ))}
                    </div>
                    {teamMembers.map((member, idx) => (
                      <div key={member.id} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 1fr 1fr 1fr 36px", borderBottom: idx < teamMembers.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", alignItems: "center" }}>
                        <div style={{ padding: "6px 10px", fontSize: ".78rem", color: "#9ca3af" }}>{idx + 1}</div>
                        <div style={{ padding: "4px 6px" }}>
                          <input value={member.name} onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                            placeholder={t("rosterNamePh")}
                            style={{ width: "100%", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: ".82rem", fontFamily: "inherit", outline: "none", color: "#1a1a1f" }} />
                        </div>
                        <div style={{ padding: "4px 6px" }}>
                          <input value={member.title} onChange={(e) => updateTeamMember(member.id, "title", e.target.value)}
                            placeholder={t("rosterRolePh")}
                            style={{ width: "100%", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: ".82rem", fontFamily: "inherit", outline: "none", color: "#1a1a1f" }} />
                        </div>
                        <div style={{ padding: "4px 6px" }}>
                          <input value={member.email} onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                            placeholder={t("rosterEmailPh")} type="email"
                            style={{ width: "100%", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: ".82rem", fontFamily: "inherit", outline: "none", color: "#1a1a1f" }} />
                        </div>
                        <div style={{ padding: "4px 6px" }}>
                          <input value={member.phone} onChange={(e) => updateTeamMember(member.id, "phone", e.target.value)}
                            placeholder={t("rosterPhonePh")} type="tel"
                            style={{ width: "100%", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: ".82rem", fontFamily: "inherit", outline: "none", color: "#1a1a1f" }} />
                        </div>
                        <div style={{ padding: "4px 6px" }}>
                          <input value={member.company} onChange={(e) => updateTeamMember(member.id, "company", e.target.value)}
                            placeholder={t("rosterCompanyPh")}
                            style={{ width: "100%", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: ".82rem", fontFamily: "inherit", outline: "none", color: "#1a1a1f" }} />
                        </div>
                        <div style={{ padding: "4px 6px", textAlign: "center" }}>
                          <button onClick={() => removeTeamMember(member.id)}
                            style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "1rem", fontFamily: "inherit", padding: "4px", lineHeight: 1 }}
                            title="Remove">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={addTeamMember}
                  disabled={teamMembers.length >= getMaxMembers()}
                  style={{ background: "none", border: "none", color: "#457b9d", fontSize: ".85rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", padding: "0", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  + {t("rosterAdd")}
                </button>

                <div style={{ background: "rgba(69,123,157,0.06)", border: "1px solid rgba(69,123,157,0.12)", borderRadius: "10px", padding: ".85rem 1rem", marginBottom: "1.5rem", fontSize: ".8rem", color: "#457b9d", lineHeight: 1.6 }}>
                  {t("rosterNote")}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <button onClick={() => setInqStep("form")}
                    style={{ padding: ".75rem 1.5rem", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: ".85rem", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>
                    {t("rosterBack")}
                  </button>
                  <button onClick={handleInquirySubmit} disabled={inqStep === "submitting"}
                    style={{ flex: 1, padding: ".75rem 1.5rem", background: "#e63946", color: "#fff", border: "none", borderRadius: "8px", fontSize: ".88rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: ".3s", letterSpacing: ".03em" }}>
                    {t("rosterSubmit")}
                  </button>
                </div>

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <button onClick={() => { setTeamMembers([]); handleInquirySubmit(); }}
                    style={{ background: "none", border: "none", color: "#9ca3af", fontSize: ".78rem", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                    {t("rosterSkip")}
                  </button>
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
