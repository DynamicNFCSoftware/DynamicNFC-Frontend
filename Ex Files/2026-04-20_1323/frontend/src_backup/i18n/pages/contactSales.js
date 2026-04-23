import { registerTranslations } from "../index";

const contactSales = {
  en: {
    /* Hero */
    heroBadge: "Let's Talk",
    heroTitle:
      "Tell Us What You're Building. We'll Show You How to Sell It Faster.",
    heroSub:
      "Whether you're launching a tower, running a brokerage, or scaling across a portfolio — we'll design a VIP buyer experience pilot matched to your project.",

    /* Trust bar */
    trust1: "24hr Response",
    trust2: "No Commitment",
    trust3: "Custom Pilot Design",
    trust4: "NDA Available",

    /* Form section */
    formTitle: "Start the Conversation",
    formSub:
      "Fill out the form below and our team will get back to you within 24 hours with a personalized recommendation.",

    /* Form sections */
    sec1: "Contact Information",
    sec2: "About Your Business",
    sec3: "Your Project",
    sec4: "What's Your Biggest Sales Challenge?",

    /* Labels */
    lblName: "Full Name",
    lblEmail: "Email",
    lblPhone: "Phone",
    lblCity: "City / Market",
    lblCompany: "Company / Brokerage",
    lblRole: "Your Role",
    lblTeamSize: "Team Size",
    lblIndustry: "Industry Focus",
    lblProjectName: "Project or Campaign Name",
    lblProjectType: "Project Type",
    lblUnits: "Total Units / Listings",
    lblTimeline: "Target Launch",
    lblChallenge: "Primary Challenge",
    lblBudget: "Pilot Budget Range",
    lblNotes: "Anything else we should know?",
    lblNotesPlaceholder:
      "Tell us about your current sales process, buyer list, goals, or questions...",

    /* Select options */
    rolePlaceholder: "Select role",
    roleOpts: [
      "VP of Sales",
      "Director of Sales",
      "Sales Manager",
      "Broker / Owner",
      "Marketing Director",
      "CEO / Chairman",
      "General Manager",
      "Agent / Team Lead",
      "Other",
    ],
    teamPlaceholder: "Select",
    teamOpts: ["Just me", "2 – 10", "11 – 50", "50 – 200", "200+"],
    industryPlaceholder: "Select focus",
    industryOpts: [
      "Pre-Construction / New Development",
      "Luxury Resale",
      "Brokerage / Team",
      "Master-Planned Community",
      "Branded Residences",
      "Mixed-Use Development",
      "Commercial Real Estate",
      "Other",
    ],
    projectPlaceholder: "Select type",
    projectOpts: [
      "Residential Tower",
      "Luxury Resale ($2M+)",
      "Master-Planned Community",
      "Branded Residences",
      "Brokerage VIP Campaign",
      "Mixed-Use Development",
      "Commercial",
      "Other",
    ],
    unitsPlaceholder: "Select range",
    unitsOpts: [
      "Under 50",
      "50 – 200",
      "200 – 500",
      "500 – 2,000",
      "2,000+",
      "N/A",
    ],
    timelinePlaceholder: "Select timeline",
    timelineOpts: [
      "Immediately",
      "1 – 3 months",
      "3 – 6 months",
      "6+ months",
      "Just exploring",
    ],
    challengePlaceholder: "Select challenge",
    challengeOpts: [
      "Anonymous website traffic — can't identify buyers",
      "Too slow from interest to first contact",
      "Generic outreach — one pitch for all buyers",
      "Low conversion from leads to booked viewings",
      "Sales team lacks buyer context on calls",
      "Need premium positioning for luxury listings",
      "Engaging international / remote buyers",
      "No portfolio-level buyer intelligence",
      "Repeated setup costs per project launch",
      "Other",
    ],
    budgetPlaceholder: "Select range",
    budgetOpts: [
      "Under $100,000",
      "$100,000 – $250,000",
      "$250,000 – $500,000",
      "$500,000+",
      "Need guidance",
    ],

    /* Submit */
    submitInquiry: "Submit Inquiry →",
    submitting: "Submitting...",
    formNote:
      "We respond within 24 hours. Your information is kept strictly confidential.",

    /* Success */
    successTitle: "Inquiry Submitted",
    successDesc:
      "Thank you. Our sales team will review your details and reach out within 24 hours with a personalized pilot recommendation.",
    successBack: "← Back to Home",
    successAnother: "Submit Another Inquiry",

    /* Sidebar */
    sideTitle: "What Happens Next?",
    side1Title: "We Review",
    side1Desc:
      "Our team reviews your submission and matches you with the right specialist — developers, brokerages, or luxury teams.",
    side2Title: "Discovery Call",
    side2Desc:
      "A 20-minute call to understand your sales process, buyer profiles, and project goals. No pitch — just questions.",
    side3Title: "Custom Proposal",
    side3Desc:
      "Within 48 hours, you receive a tailored pilot plan — portal design, VIP Access Key count, timeline, and pricing.",
    side4Title: "Launch",
    side4Desc:
      "2–4 weeks from approval to first cards in the hands of your VIP prospects.",
    sideQuote:
      '"You are not handing out NFC cards. You are issuing private invitations — and turning digital intent into real sales momentum."',
  },

  ar: {
    /* البطل */
    heroBadge: "لنتحدث",
    heroTitle: "أخبرنا بما تبنيه، وسنُريك كيف تبيعه بشكلٍ أسرع.",
    heroSub:
      "سواء كنتَ تُطلق برجًا سكنيًا، أو تُدير شركة وساطة عقارية، أو تتوسّع عبر محفظة مشاريع — سنصمّم لك تجربة مشترٍ حصرية تجريبية تتناسب مع مشروعك.",

    /* شريط الثقة */
    trust1: "استجابة خلال 24 ساعة",
    trust2: "بدون أيّ التزام",
    trust3: "تصميم تجريبي مخصّص",
    trust4: "اتفاقية سرية متاحة",

    /* قسم النموذج */
    formTitle: "ابدأ الحوار",
    formSub:
      "املأ النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة بتوصية مخصّصة لمشروعك.",

    /* عناوين الأقسام */
    sec1: "معلومات التواصل",
    sec2: "عن نشاطك التجاري",
    sec3: "تفاصيل مشروعك",
    sec4: "ما أبرز تحدٍّ تواجهه في المبيعات؟",

    /* التسميات */
    lblName: "الاسم الكامل",
    lblEmail: "البريد الإلكتروني",
    lblPhone: "رقم الهاتف",
    lblCity: "المدينة / السوق",
    lblCompany: "الشركة / الوساطة العقارية",
    lblRole: "المسمّى الوظيفي",
    lblTeamSize: "حجم الفريق",
    lblIndustry: "القطاع المتخصّص",
    lblProjectName: "اسم المشروع أو الحملة",
    lblProjectType: "نوع المشروع",
    lblUnits: "إجمالي الوحدات / العقارات",
    lblTimeline: "الموعد المستهدف للإطلاق",
    lblChallenge: "التحدي الرئيسي",
    lblBudget: "نطاق ميزانية التجربة",
    lblNotes: "هل هناك ما تودّ إضافته؟",
    lblNotesPlaceholder:
      "أخبرنا عن آلية المبيعات الحالية لديك، وقائمة المشترين المحتملين، وأهدافك، أو أيّ استفسارات أخرى...",

    /* خيارات القوائم */
    rolePlaceholder: "اختر المسمّى الوظيفي",
    roleOpts: [
      "نائب الرئيس للمبيعات",
      "مدير إدارة المبيعات",
      "مدير مبيعات",
      "وسيط عقاري / مالك",
      "مدير التسويق",
      "الرئيس التنفيذي / رئيس مجلس الإدارة",
      "المدير العام",
      "وكيل عقاري / قائد فريق",
      "أخرى",
    ],
    teamPlaceholder: "اختر",
    teamOpts: ["شخص واحد", "2 – 10", "11 – 50", "50 – 200", "+200"],
    industryPlaceholder: "اختر القطاع",
    industryOpts: [
      "مشاريع ما قبل البناء / التطوير الجديد",
      "إعادة بيع العقارات الفاخرة",
      "شركة وساطة / فريق مبيعات",
      "مجتمع سكني متكامل التخطيط",
      "مساكن تحمل علامات تجارية مرموقة",
      "تطوير متعدّد الاستخدامات",
      "العقارات التجارية",
      "أخرى",
    ],
    projectPlaceholder: "اختر النوع",
    projectOpts: [
      "برج سكني",
      "إعادة بيع فاخر (أكثر من 2 مليون دولار)",
      "مجتمع سكني متكامل التخطيط",
      "مساكن تحمل علامات تجارية مرموقة",
      "حملة حصرية لعملاء VIP عبر الوساطة",
      "تطوير متعدّد الاستخدامات",
      "عقارات تجارية",
      "أخرى",
    ],
    unitsPlaceholder: "اختر النطاق",
    unitsOpts: [
      "أقل من 50",
      "50 – 200",
      "200 – 500",
      "500 – 2,000",
      "+2,000",
      "لا ينطبق",
    ],
    timelinePlaceholder: "اختر الإطار الزمني",
    timelineOpts: [
      "فورًا",
      "من شهر إلى 3 أشهر",
      "من 3 إلى 6 أشهر",
      "أكثر من 6 أشهر",
      "أستكشف الخيارات حاليًا",
    ],
    challengePlaceholder: "اختر التحدي",
    challengeOpts: [
      "زيارات مجهولة المصدر للموقع — لا يمكن تحديد هوية المشترين",
      "بطء في التواصل من لحظة إبداء الاهتمام حتى أول تواصل فعلي",
      "تواصل تسويقي عام — عرض واحد لجميع المشترين",
      "معدّل تحويل منخفض من العملاء المحتملين إلى حجوزات المعاينة",
      "فريق المبيعات يفتقر إلى معلومات كافية عن المشتري أثناء المكالمات",
      "الحاجة إلى تموضع متميّز للعقارات الفاخرة",
      "صعوبة استقطاب المشترين الدوليين أو عن بُعد",
      "غياب الذكاء التحليلي على مستوى المحفظة الاستثمارية",
      "تكاليف إعداد متكرّرة مع كل إطلاق مشروع جديد",
      "أخرى",
    ],
    budgetPlaceholder: "اختر النطاق",
    budgetOpts: [
      "أقل من 100,000 دولار",
      "100,000 – 250,000 دولار",
      "250,000 – 500,000 دولار",
      "أكثر من 500,000 دولار",
      "أحتاج إلى استشارة",
    ],

    /* الإرسال */
    submitInquiry: "إرسال الاستفسار ←",
    submitting: "جارٍ الإرسال...",
    formNote:
      "نردّ خلال 24 ساعة. جميع معلوماتك تُعامل بسرية تامة.",

    /* النجاح */
    successTitle: "تم إرسال الاستفسار بنجاح",
    successDesc:
      "شكرًا لك. سيراجع فريق المبيعات لدينا التفاصيل التي قدّمتها، وسيتواصل معك خلال 24 ساعة بتوصية تجريبية مخصّصة.",
    successBack: "→ العودة إلى الصفحة الرئيسية",
    successAnother: "إرسال استفسار آخر",

    /* الشريط الجانبي */
    sideTitle: "ماذا يحدث بعد ذلك؟",
    side1Title: "المراجعة",
    side1Desc:
      "يراجع فريقنا طلبك ويوجّهك إلى المختصّ المناسب — سواء في مجال التطوير العقاري، أو الوساطة، أو الفرق المتخصّصة بالعقارات الفاخرة.",
    side2Title: "مكالمة استكشافية",
    side2Desc:
      "مكالمة مدّتها 20 دقيقة لفهم آلية المبيعات لديك، وملفّات المشترين، وأهداف المشروع. لا عروض ترويجية — فقط أسئلة.",
    side3Title: "عرض مخصّص",
    side3Desc:
      "خلال 48 ساعة، تتلقّى خطة تجريبية مفصّلة تشمل تصميم البوابة الرقمية، وعدد مفاتيح الوصول الحصرية، والجدول الزمني، والتسعير.",
    side4Title: "الإطلاق",
    side4Desc:
      "من أسبوعين إلى أربعة أسابيع من الموافقة حتى وصول أولى البطاقات إلى أيدي عملائك المميّزين.",
    sideQuote:
      '"أنتَ لا توزّع بطاقات NFC. أنتَ تُصدر دعوات خاصة — وتحوّل النيّة الرقمية إلى زخمٍ حقيقي في المبيعات."',
  },
};

registerTranslations("contactSales", contactSales);

export default contactSales;
