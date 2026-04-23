import { registerTranslations } from "../index";

const nfcCards = {
  en: {
    /* ── Hero ── */
    badge: "Premium NFC Technology",
    heroTitle: "The Last Business Card\nYou'll Ever Need",
    heroSub:
      "Handcrafted from brushed metal, 24K gold, bamboo, and premium PVC. Your entire professional identity — shared in one tap.",
    heroCta: "Order Your Card",
    heroSecondary: "Explore Materials",
    flipHint: "Hover to flip · Tap on mobile",

    /* ── Stats ── */
    stat1v: "12+",
    stat1l: "Card Types",
    stat2v: "40+",
    stat2l: "Countries",
    stat3v: "< 1s",
    stat3l: "Tap to Share",
    stat4v: "0",
    stat4l: "Apps Required",

    /* ── How It Works ── */
    howTitle: "How It Works",
    howSub: "Three steps to your premium identity",
    step1t: "Choose Your Material",
    step1d:
      "Select from premium PVC, brushed metal, 24K gold, bamboo, or walnut. Each material is crafted for a distinct impression.",
    step2t: "Personalize Your Card",
    step2d:
      "Add your name, logo, and QR link. Our system encodes your NFC chip with your complete digital profile.",
    step3t: "Tap & Share Instantly",
    step3d:
      "Hold your card to any smartphone. Your contact info, portfolio, or website opens instantly — no app needed.",

    /* ── Benefits ── */
    benTitle: "Why DynamicNFC",
    benSub: "Built for professionals who demand more",
    ben1t: "NFC + QR Dual Access",
    ben1d:
      "Every card carries both NFC chip and QR code. Works with any modern smartphone — iPhone, Android, or tablet.",
    ben2t: "Premium Materials",
    ben2d:
      "Brushed metal with 24K gold accents, natural bamboo, walnut wood, and premium PVC in 5 finishes.",
    ben3t: "Real-Time Analytics",
    ben3d:
      "Track every tap, scan, and interaction. Know who viewed your profile, when, and what they clicked.",
    ben4t: "No App Required",
    ben4d:
      "Your recipients never need to download anything. One tap opens your profile directly in their browser.",
    ben5t: "Made in Canada",
    ben5d:
      "Designed, engineered, and shipped from Canada. Premium quality with 40+ country shipping.",
    ben6t: "CRM Integration",
    ben6d:
      "Connect with Salesforce, HubSpot, or any CRM. Every contact captured flows into your pipeline automatically.",

    /* ── Materials ── */
    matTitle: "Crafted Materials",
    matSub: "Choose the finish that defines your presence",
    matPvc: "Premium PVC",
    matMetal: "Brushed Metal",
    matEco: "Natural Eco",
    matPvcDesc:
      "Lightweight, durable, and available in 5 finishes — White, Black, Gold, Silver, and Transparent.",
    matMetalDesc:
      "Substantial weight and brushed texture. Available in Gold, Silver, Black, Rose Gold, and 24K.",
    matEcoDesc:
      "Sustainable bamboo and walnut wood. A natural statement with full NFC capability.",

    /* ── FAQ ── */
    faqTitle: "Frequently Asked Questions",
    faq1q: "What are your production and delivery timelines?",
    faq1a:
      "DynamicNFC specializes in bulk and enterprise orders. Production timelines are confirmed after reviewing order volume, material selection, and customization requirements. Delivery estimates are provided upon quote approval.",
    faq2q: "Do recipients need an app?",
    faq2a:
      "No. When someone taps your card or scans the QR code, your digital profile opens instantly in their browser. No apps, no downloads, no friction.",
    faq3q: "Is DynamicNFC subscription-based?",
    faq3a:
      "No subscription is required for standard cards. You purchase your NFC cards based on your required quantity. Optional advanced features and team management tools are available for enterprise clients.",
    faq4q: "Can we update card information after printing?",
    faq4a:
      "Yes. Each NFC card connects to a secure digital profile that can be updated anytime. Modify contact details, links, branding, or content without reprinting physical cards.",
    faq5q: "Do you offer bulk or team pricing?",
    faq5a:
      "Yes. DynamicNFC operates on a volume-based pricing model. Pricing is calculated according to order quantity, material selection, and customization scope. Contact info@dynamicnfc.help for a tailored quote.",
    faq6q: "Which phones are compatible?",
    faq6a:
      "All iPhones from iPhone 7 onward and virtually all modern Android devices support NFC. Additionally, the integrated QR code ensures compatibility with any smartphone equipped with a camera.",

    /* ── CTA ── */
    ctaTitle: "Ready to Elevate Your Identity?",
    ctaSub:
      "Join thousands of professionals who have replaced paper cards with premium NFC technology.",
    ctaBtn: "Design Your Card Now",

    /* ── Footer (page-specific) ── */
    footOrderCard: "Order Card",
  },

  ar: {
    /* ── Hero ── */
    badge: "تقنية NFC المتميّزة",
    heroTitle: "آخر بطاقة أعمال\nستحتاج إليها على الإطلاق",
    heroSub:
      "مصنوعة يدويًا من المعدن المصقول والذهب عيار 24 والخيزران والـPVC الفاخر. هويتك المهنية بالكامل — تُشارَك بلمسة واحدة.",
    heroCta: "اطلب بطاقتك",
    heroSecondary: "استكشف الخامات",
    flipHint: "مرِّر للقلب · انقر على الهاتف",

    /* ── Stats ── */
    stat1v: "‎+12",
    stat1l: "نوع بطاقة",
    stat2v: "‎+40",
    stat2l: "دولة",
    stat3v: "أقل من ثانية",
    stat3l: "للمشاركة بلمسة",
    stat4v: "0",
    stat4l: "تطبيقات مطلوبة",

    /* ── How It Works ── */
    howTitle: "آليّة العمل",
    howSub: "ثلاث خطوات نحو هويتك المتميّزة",
    step1t: "اختر الخامة",
    step1d:
      "اختر من بين الـPVC الفاخر أو المعدن المصقول أو الذهب عيار 24 أو الخيزران أو خشب الجوز. كل خامة مُصمَّمة لتترك انطباعًا مميّزًا.",
    step2t: "خصِّص بطاقتك",
    step2d:
      "أضِف اسمك وشعارك ورابط QR الخاص بك. يقوم نظامنا بترميز شريحة NFC بملفك الرقمي الكامل.",
    step3t: "انقر وشارِك فورًا",
    step3d:
      "ضع بطاقتك بالقرب من أي هاتف ذكي. تُفتَح معلومات الاتصال أو الموقع الإلكتروني فورًا — دون الحاجة إلى أي تطبيق.",

    /* ── Benefits ── */
    benTitle: "لماذا DynamicNFC؟",
    benSub: "مصمَّمة للمحترفين الذين يسعون إلى التميّز",
    ben1t: "وصول مزدوج عبر NFC وQR",
    ben1d:
      "تحمل كل بطاقة شريحة NFC ورمز QR معًا. تعمل مع أي هاتف ذكي حديث — آيفون أو أندرويد أو جهاز لوحي.",
    ben2t: "خامات فاخرة",
    ben2d:
      "معدن مصقول بلمسات من الذهب عيار 24، وخيزران طبيعي، وخشب الجوز، وPVC فاخر بخمسة تشطيبات.",
    ben3t: "تحليلات فورية",
    ben3d:
      "تتبَّع كل نقرة ومسح وتفاعل. اعرف مَن شاهد ملفك الشخصي ومتى وماذا نقر.",
    ben4t: "لا حاجة إلى تطبيق",
    ben4d:
      "لا يحتاج المستلمون إلى تحميل أي شيء. نقرة واحدة تفتح ملفك مباشرةً في متصفّحهم.",
    ben5t: "صُنع في كندا",
    ben5d:
      "صُمِّم وطُوِّر وشُحِن من كندا. جودة فائقة مع خدمة شحن إلى أكثر من 40 دولة.",
    ben6t: "تكامل مع أنظمة CRM",
    ben6d:
      "اربط بطاقتك بـ Salesforce أو HubSpot أو أي نظام CRM. تتدفق كل جهة اتصال جديدة إلى خط المبيعات تلقائيًا.",

    /* ── Materials ── */
    matTitle: "خامات مصنوعة بإتقان",
    matSub: "اختر التشطيب الذي يعكس حضورك",
    matPvc: "PVC فاخر",
    matMetal: "معدن مصقول",
    matEco: "صديقة للبيئة",
    matPvcDesc:
      "خفيفة الوزن ومتينة ومتوفرة بخمسة تشطيبات — أبيض وأسود وذهبي وفضي وشفّاف.",
    matMetalDesc:
      "وزن ملموس وملمس مصقول. متوفرة بالذهبي والفضي والأسود والوردي الذهبي والذهب عيار 24.",
    matEcoDesc:
      "خيزران مستدام وخشب الجوز الطبيعي. لمسة بيئية راقية مع دعم كامل لتقنية NFC.",

    /* ── FAQ ── */
    faqTitle: "الأسئلة الشائعة",
    faq1q: "ما المدة اللازمة للإنتاج والتسليم؟",
    faq1a:
      "تتخصّص DynamicNFC في الطلبات المؤسسية والطلبات بالجملة. تُحدَّد مدة الإنتاج بعد مراجعة حجم الطلب ونوع الخامات ومتطلبات التخصيص، ويُقدَّم الجدول الزمني التقديري عند اعتماد عرض السعر.",
    faq2q: "هل يحتاج المستلم إلى تطبيق؟",
    faq2a:
      "لا. عند النقر على البطاقة أو مسح رمز QR، يُفتَح الملف الرقمي مباشرةً في المتصفح دون الحاجة إلى أي تطبيق أو تحميل.",
    faq3q: "هل تعتمد DynamicNFC على نظام اشتراك؟",
    faq3a:
      "لا يتطلب المنتج الأساسي أي اشتراك. تُشترى البطاقات وفقًا للكمية المطلوبة. تتوفر ميزات متقدمة وأدوات إدارة الفِرَق للعملاء من المؤسسات.",
    faq4q: "هل يمكن تحديث المعلومات بعد الطباعة؟",
    faq4a:
      "نعم. ترتبط كل بطاقة NFC بملف رقمي آمن يمكن تحديثه في أي وقت. يمكنك تعديل بيانات الاتصال والروابط والهوية البصرية والمحتوى دون الحاجة إلى إعادة طباعة البطاقة.",
    faq5q: "هل تقدّمون أسعارًا للطلبات بالجملة وفِرَق العمل؟",
    faq5a:
      "نعم. تعتمد DynamicNFC نموذج تسعير قائمًا على حجم الطلب. يُحتسَب السعر بناءً على الكمية ونوع الخامات ونطاق التخصيص. تواصلوا معنا عبر info@dynamicnfc.help للحصول على عرض سعر مخصّص.",
    faq6q: "ما الأجهزة المتوافقة؟",
    faq6a:
      "تدعم جميع أجهزة iPhone بدءًا من iPhone 7 ومعظم أجهزة Android الحديثة تقنية NFC. كما يضمن رمز QR المدمج التوافق مع أي هاتف ذكي مزوَّد بكاميرا.",

    /* ── CTA ── */
    ctaTitle: "هل أنت مستعد للارتقاء بهويتك المهنية؟",
    ctaSub:
      "انضم إلى آلاف المحترفين الذين استبدلوا البطاقات الورقية بتقنية NFC المتميّزة.",
    ctaBtn: "صمِّم بطاقتك الآن",

    /* ── Footer (page-specific) ── */
    footOrderCard: "اطلب بطاقتك",
  },
};

registerTranslations("nfcCards", nfcCards);

export default nfcCards;
