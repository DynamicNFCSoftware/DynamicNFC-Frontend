import { registerTranslations } from "../index";

const developers = {
  en: {
    /* ── Section Nav ── */
    navChallenge: "The Challenge",
    navShift: "The Shift",
    navHow: "How It Works",
    navDemo: "Live Demo",
    navUseCases: "Use Cases",
    navPilot: "Start a Pilot",

    /* ── Hero ── */
    heroBadge: "Sales Velocity Engine for Real Estate Developers",
    heroTitle: "Identity Precedes Action. Action Drives Sales.",
    heroSub:
      "DynamicNFC turns your project websites into private, invitation-only buyer experiences. You know WHO is browsing before you know WHAT they do — and that changes everything about how your sales team closes.",
    stat1Val: "47%",
    stat1Label: "Higher Engagement",
    stat2Val: "3.2×",
    stat2Label: "Conversion to Viewing",
    stat3Val: "100%",
    stat3Label: "Identified Buyers",
    heroCtaPilot: "Start a Pilot Program →",
    heroCtaDemo: "See the Live Demo",

    /* ── The Blind Spot ── */
    challLabel: "The Blind Spot",
    challTitle: "Your Buyers Are Ready. Your Sales Team Doesn't Know It.",
    challQuote:
      'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options on your project website. Yet when your sales team picks up the phone, they lack one critical thing: <strong>context</strong>. They don\'t know who is ready, what they care about most, or when to act. This leads to delayed follow-ups, generic conversations, and missed momentum.',
    chall1Icon: "👥",
    chall1Title: "Anonymous Traffic",
    chall1Desc:
      "Thousands visit your project website. You see page views — but you don't know if that visitor is a $5M investor or a casual browser.",
    chall2Icon: "🕐",
    chall2Title: "Delayed Follow-Up",
    chall2Desc:
      "By the time your sales team reaches out, the buyer has cooled off. The window between peak interest and first contact is too wide.",
    chall3Icon: "📋",
    chall3Title: "Generic Outreach",
    chall3Desc:
      "Every buyer gets the same brochure, the same tour, the same call script. A penthouse investor and a first-time family buyer hear the same pitch.",

    /* ── The Shift ── */
    shiftLabel: "The Shift",
    shiftTitle: "From Public Website to Private Invitation",
    shiftDesc:
      "What if you stopped treating your project website as a brochure, and instead treated it as a private experience for selected prospects? Not everyone — only those you intentionally invite.",
    oldLabel: "The Old Way",
    oldTitle: "Generic Project Website",
    oldDesc:
      "One website for everyone. Anonymous traffic. No buyer identity. Sales team calls blind.",
    old1: "Same experience for all visitors",
    old2: "No way to identify high-intent buyers",
    old3: "Sales team lacks context on calls",
    old4: "Follow-up based on guesswork",
    newLabel: "The Dynamic Way",
    newTitle: "Private VIP Experiences",
    newDesc:
      "Each prospect receives a VIP Access Key — a physical invitation to their own private portal.",
    new1: "Personalized content per buyer",
    new2: "Identity known before first click",
    new3: "Sales team calls with full context",
    new4: "Follow-up timed to buyer signals",

    /* ── How It Works ── */
    howLabel: "How It Works",
    howTitle: "From Premium Box to Booked Viewing",
    howDesc:
      'Selected prospects receive a premium box with a VIP Access Key and a personal message: "This card unlocks a private experience created specifically for you." When they tap, they enter. When they browse, you know.',
    how1Icon: "🎯",
    how1Title: "VIP Campaign Selection",
    how1Desc:
      "Your sales team selects 100–200 high-value prospects per project — investors, repeat buyers, referrals, broker-referred VIPs. Each gets a named VIP Access Key.",
    how2Icon: "📦",
    how2Title: "Premium Box Delivery",
    how2Desc:
      "The Access Key arrives in a premium box with a personalized message. This is not a marketing flyer — it is a private invitation. The physical touch creates exclusivity and trust before any tracking happens.",
    how3Icon: "📱",
    how3Title: "Tap to Private Portal",
    how3Desc:
      "When the buyer taps their card, they access a private experience tailored to their profile — floor plans, pricing, payment options, amenities. No app required. No login. One tap.",
    how4Icon: "📊",
    how4Title: "Behavioral Intelligence",
    how4Desc:
      "Every action inside the portal — floor plans viewed, pricing downloaded, viewings requested — feeds your sales dashboard in real time. Your team knows exactly who is ready and what they want.",

    /* ── Key Difference ── */
    diffLabel: "The Key Difference",
    diffTitle: "Same Website. Same Actions. Different Intelligence.",
    diffDesc:
      "Inside the experience, buyers are free to do whatever they want — book a viewing, request pricing, explore payment plans, download brochures. There is no forced funnel. The only difference is identity.",
    diffVipTitle: "VIP Buyer (Known Identity)",
    diffVipDesc:
      'We know who they are. That enables personal follow-ups, tailored incentives, and concierge-level sales. Your team calls with context: "I see you\'ve been looking at 2BR units on floors 30-40 with city views — we have two left at the pre-launch price."',
    diffAnonTitle: "Public Visitor (Anonymous)",
    diffAnonDesc:
      "We learn at a segment level and optimize marketing. Which floor plans get the most attention? What price range drives downloads? Same website, same actions — but different intelligence that drives different decisions.",

    /* ── Portfolio Scale ── */
    portLabel: "Portfolio Scale",
    portTitle: "One Platform. Every Project. Cross-Portfolio Intelligence.",
    portDesc:
      "Unlike single-project tools, DynamicNFC deploys across your entire portfolio. Buyer intelligence from Project A carries to Project B. A prospect who viewed penthouses in Tower One gets penthouse-first content when Tower Two launches.",
    port1Icon: "🏗️",
    port1Title: "Deploy Once, Scale Everywhere",
    port1Desc:
      "Configure the platform once. Launch new project portals in days — not months. Same dashboard, new project, shared buyer intelligence.",
    port2Icon: "📊",
    port2Title: "Cross-Project Buyer Signals",
    port2Desc:
      "A buyer who engaged with your downtown tower also gets flagged when your waterfront project launches. Portfolio-level insights that single-project tools can't provide.",
    port3Icon: "🔄",
    port3Title: "Eliminate Repeated Setup",
    port3Desc:
      "No more rebuilding sales infrastructure for every new launch. Your templates, buyer segments, and analytics framework carry forward.",

    /* ── Live Demo ── */
    demoLabel: "Live Demo",
    demoTitle: "See It In Action — Vista Residences",
    demoDesc:
      "Explore a working demo built for a fictional luxury tower project. See how different buyer profiles receive completely different experiences from the same platform.",
    demoBadge1: "★ VIP Investor",
    demoBadge2: "🏠 Family Buyer",
    demoBadge3: "🌐 Public Access",
    demoBadge4: "📊 Analytics",
    demoCard1Title: "Khalid Al-Rashid — Investor Portal",
    demoCard1Desc:
      "Elite investor experience — ROI-focused content, high-floor penthouse showcases, investment analytics dashboard.",
    demoCard2Title: "Ahmed Al-Fahad — Family Portal",
    demoCard2Desc:
      "Family buyer experience — 3BR units, school districts, parks, community amenities, family-friendly payment plans.",
    demoCard3Title: "Global Marketplace",
    demoCard3Desc:
      "Anonymous browsing with progressive lead capture — how public visitors become known buyers over time.",
    demoCard4Title: "Corporate Dashboard",
    demoCard4Desc:
      "Internal behavioral analytics — real-time engagement, lead scoring, behavior tracking, and conversion funnels.",
    demoCta: "Visit Full Demo Environment →",

    /* ── Use Cases ── */
    ucLabel: "Use Cases",
    ucTitle: "From Tower Launches to Master-Planned Communities",
    ucDesc:
      "DynamicNFC adapts to every project type in your portfolio — each with its own VIP buyer experience.",
    uc1Title: "Residential Towers",
    uc1Desc:
      "Launch a 500-unit tower with VIP Access Keys for your top 200 prospects. Each card unlocks a portal showing their preferred floor, view orientation, and payment plan — before a single phone call is made. Your sales team sees who opened the portal, what they viewed, and who is ready for a callback.",
    uc1Tag1: "Floor Selection",
    uc1Tag2: "View Orientation",
    uc1Tag3: "Payment Plans",
    uc1Tag4: "Buyer Scoring",
    uc2Title: "Master-Planned Communities",
    uc2Desc:
      "Across a 2,000-unit master plan, different buyer segments need different experiences. Investors see ROI projections and rental yields. Families see school proximity and parks. DynamicNFC delivers both from the same project — each identified, each tracked.",
    uc2Tag1: "Segment Targeting",
    uc2Tag2: "Phased Releases",
    uc2Tag3: "Community Amenities",
    uc2Tag4: "Multi-Phase Tracking",
    uc3Title: "Branded Residences",
    uc3Desc:
      "For ultra-luxury branded residences, the sales experience must match the brand. VIP Access Keys arrive in a premium box that reflects the brand's design language. The private portal is exclusive, curated, and personal — matching the white-glove standard your buyers expect.",
    uc3Tag1: "Brand Integration",
    uc3Tag2: "White-Glove Experience",
    uc3Tag3: "Concierge Sales",
    uc3Tag4: "Ultra-High-Net-Worth",
    uc4Title: "Mixed-Use Developments",
    uc4Desc:
      "Retail investors, commercial tenants, and residential buyers have fundamentally different needs. DynamicNFC creates distinct portals within the same development — each tailored to what matters most for that buyer type, all feeding the same unified dashboard.",
    uc4Tag1: "Multi-Segment",
    uc4Tag2: "Commercial & Residential",
    uc4Tag3: "Investor vs. End-User",
    uc4Tag4: "Unified Analytics",

    /* ── Partnership Model ── */
    partLabel: "Partnership Model",
    partTitle:
      "Launch in Weeks. Measure in Viewings. Scale to Your Portfolio.",
    partDesc:
      "We work alongside your sales team to design, deploy, and optimize the VIP buyer experience — starting with one project, then scaling across every launch.",
    part1Icon: "🚀",
    part1Title: "2–4 Week Pilot",
    part1Desc:
      "Launch on one project with 100 VIP Access Keys. Measure booked viewings against your control group within 30 days.",
    part2Icon: "📐",
    part2Title: "Custom Portal Design",
    part2Desc:
      "We design private buyer portals that match your project branding — floor plan galleries, pricing, amenities, calls-to-action.",
    part3Icon: "🔗",
    part3Title: "CRM Integration",
    part3Desc:
      "Behavioral intelligence feeds directly into Salesforce, HubSpot, or your custom CRM. No system replacement — we enhance what you already use.",
    part4Icon: "🏢",
    part4Title: "Portfolio Rollout",
    part4Desc:
      "Once proven on one project, deploy across your entire portfolio. Shared buyer intelligence across all launches. New project portals go live in days.",

    /* ── ROI ── */
    roiLabel: "Why This Matters",
    roiTitle: "Sales Velocity, Not Vanity Metrics.",
    roiDesc:
      "This is not about clicks or dashboards. It's about one thing: an increase in booked viewings and decision speed.",
    roi1Val: "3.2×",
    roi1Label: "Conversion to Viewing",
    roi1Sub: "VIP invitees vs. anonymous traffic",
    roi2Val: "47%",
    roi2Label: "Faster Decision Cycle",
    roi2Sub: "From first portal access to booked viewing",
    roi3Val: "100%",
    roi3Label: "Identified Engagement",
    roi3Sub: "Every interaction linked to a named buyer",

    /* ── FAQ ── */
    faqLabel: "Developer FAQ",
    faqTitle: "Questions Your Team Will Ask",
    faq1Q: "Is this replacing our website or CRM?",
    faq1A: "No. DynamicNFC sits on top of your existing systems and enhances them. Your project website remains public. The VIP portal is a private layer for selected prospects — connected to your existing CRM.",
    faq2Q: "How is consent and privacy handled?",
    faq2A: "Consent is explicit. The prospect receives a physical card with a clear message. The tap is the opt-in. There is no hidden tracking — the buyer knowingly enters their private portal. This establishes consent, exclusivity, and trust before any tracking happens.",
    faq3Q: "What does the buyer actually receive?",
    faq3A: "A premium box containing a VIP Access Key — a brushed-metal NFC card with a personalized message. Not a marketing flyer. A private invitation. When they tap, they enter a web experience designed specifically for them. No app required.",
    faq4Q: "Can this work across multiple projects?",
    faq4A: "Yes — that's the core developer advantage. One platform, one dashboard, with project-level filtering and portfolio-level insights. Buyer intelligence from one project carries to the next.",
    faq5Q: "How do we measure pilot success?",
    faq5A: "One metric: increase in booked viewings among VIP invitees versus your control group. Not clicks. Not pageviews. Real sales activity within 30 days of launch.",
    faq6Q: "What about international buyers?",
    faq6A: "Portals support multiple languages and adapt to buyer location. The same project can serve buyers from Dubai, London, and Vancouver — each in their preferred language, all tracked in the same dashboard.",

    /* ── Final CTA ── */
    ctaLabel: "Ready to Deploy",
    ctaTitle:
      "You're Not Handing Out Cards. You're Issuing Private Invitations.",
    ctaDesc:
      "Turn digital intent into real sales momentum. Start with one project and 100 VIP Access Keys. Measure the difference in booked viewings. Then scale to your portfolio.",
    ctaPilot: "Start a Pilot Program →",
    ctaDemo: "See the Live Demo",

    /* ── Pilot Modal ── */
    modalTitle: "Start a Developer Pilot",
    modalSub:
      "Tell us about your portfolio and we'll design a custom pilot — 100 VIP Access Keys on one project, full analytics, measurable results within 30 days.",
    modalSec1: "Contact Information",
    modalSec2: "Company & Portfolio",
    modalSec3: "Pilot Project",
    modalSec4: "Sales Challenge",
    modalSubmit: "Submit Pilot Request →",
    modalSubmitting: "Submitting...",
    modalNote:
      "We respond within 24 hours. Your information is kept strictly confidential.",
    successTitle: "Pilot Request Submitted",
    successDesc:
      "Thank you. Our developer partnerships team will review your portfolio details and reach out within 24 hours.",
    successClose: "Close",

    /* ── Footer ── */
    footerText:
      "© 2026 DynamicNFC — Sales Velocity Engine for Real Estate Developers",
  },

  ar: {
    /* ── Section Nav ── */
    navChallenge: "التحدي",
    navShift: "التحوّل",
    navHow: "آلية العمل",
    navDemo: "عرض حي",
    navUseCases: "حالات الاستخدام",
    navPilot: "ابدأ تجربة تشغيلية",

    /* ── Hero ── */
    heroBadge: "محرّك تسريع المبيعات للمطوّرين العقاريين",
    heroTitle: "الهوية تسبق الفعل. والفعل يقود المبيعات.",
    heroSub:
      "تحوّل DynamicNFC مواقع مشاريعكم العقارية إلى تجارب حصرية بالدعوة فقط. تعرفون هوية المتصفّح قبل أن تعرفوا ما يفعله — وهذا يُحدث تحوّلاً جذرياً في أسلوب إغلاق فريق المبيعات للصفقات.",
    stat1Val: "٤٧٪",
    stat1Label: "معدّل تفاعل أعلى",
    stat2Val: "٣٫٢×",
    stat2Label: "معدّل التحويل إلى معاينة",
    stat3Val: "١٠٠٪",
    stat3Label: "مشترون معرّفو الهوية",
    heroCtaPilot: "ابدأ البرنامج التجريبي ←",
    heroCtaDemo: "شاهد العرض الحي",

    /* ── The Blind Spot ── */
    challLabel: "النقطة العمياء",
    challTitle: "المشترون جاهزون. لكنّ فريق مبيعاتكم لا يعلم بذلك.",
    challQuote:
      "يقضي المشترون الأكثر اهتماماً أسابيع في استكشاف المخططات الطابقية والأسعار وخيارات السداد على موقع مشروعكم. ومع ذلك، حين يرفع فريق المبيعات سمّاعة الهاتف، ينقصه عنصر حاسم واحد: <strong>السياق</strong>. لا يعرفون من المستعد للشراء، ولا ما يهمّه أكثر، ولا متى ينبغي التحرّك. والنتيجة: متابعات متأخرة، ومحادثات نمطية، وفُرص ضائعة.",
    chall1Icon: "👥",
    chall1Title: "زيارات مجهولة الهوية",
    chall1Desc:
      "آلاف الزوّار يتصفّحون موقع المشروع. ترون أرقام الزيارات — لكنكم لا تعرفون إن كان الزائر مستثمراً بملايين الدولارات أم متصفّحاً عابراً.",
    chall2Icon: "🕐",
    chall2Title: "تأخّر في المتابعة",
    chall2Desc:
      "بحلول الوقت الذي يتواصل فيه فريق المبيعات، يكون المشتري قد فقد حماسه. الفجوة الزمنية بين ذروة الاهتمام وأول تواصل واسعة جداً.",
    chall3Icon: "📋",
    chall3Title: "تواصل نمطي",
    chall3Desc:
      "كل مشترٍ يحصل على الكتيّب ذاته، والجولة ذاتها، والنص ذاته. مستثمر البنتهاوس والمشتري المبتدئ يسمعان العرض نفسه.",

    /* ── The Shift ── */
    shiftLabel: "التحوّل",
    shiftTitle: "من موقع إلكتروني عام إلى دعوة خاصة",
    shiftDesc:
      "ماذا لو توقّفتم عن التعامل مع موقع المشروع كنشرة إعلانية، وحوّلتموه بدلاً من ذلك إلى تجربة حصرية لعملاء مختارين؟ ليس للجميع — فقط لمن تدعونهم بشكل مقصود.",
    oldLabel: "الأسلوب التقليدي",
    oldTitle: "موقع مشروع عام",
    oldDesc:
      "موقع واحد للجميع. زيارات مجهولة. لا هوية للمشتري. فريق المبيعات يتّصل دون أي معطيات.",
    old1: "تجربة موحّدة لجميع الزوّار",
    old2: "لا سبيل لتحديد المشترين ذوي الاهتمام العالي",
    old3: "فريق المبيعات يفتقر إلى السياق أثناء المكالمات",
    old4: "متابعة مبنية على التخمين",
    newLabel: "الأسلوب الديناميكي",
    newTitle: "تجارب VIP حصرية",
    newDesc:
      "يتلقّى كل عميل محتمل مفتاح وصول VIP — دعوة مادية تقوده إلى بوابته الخاصة.",
    new1: "محتوى مخصّص لكل مشترٍ",
    new2: "هوية المشتري معروفة قبل أول نقرة",
    new3: "فريق المبيعات يتّصل بسياق متكامل",
    new4: "متابعة مُوقَّتة وفق إشارات المشتري",

    /* ── How It Works ── */
    howLabel: "آلية العمل",
    howTitle: "من الصندوق الفاخر إلى حجز المعاينة",
    howDesc:
      "يتلقّى العملاء المختارون صندوقاً فاخراً يحتوي على مفتاح وصول VIP ورسالة شخصية: \"هذه البطاقة تفتح لك تجربة خاصة صُمِّمت حصرياً من أجلك.\" حين يلمسون البطاقة، يدخلون. وحين يتصفّحون، تعرفون أنتم.",
    how1Icon: "🎯",
    how1Title: "اختيار حملة VIP",
    how1Desc:
      "يختار فريق مبيعاتكم بين ١٠٠ و٢٠٠ عميل محتمل عالي القيمة لكل مشروع — مستثمرون، ومشترون متكرّرون، وإحالات، وعملاء VIP عبر الوسطاء. يحصل كل منهم على مفتاح VIP باسمه.",
    how2Icon: "📦",
    how2Title: "توصيل الصندوق الفاخر",
    how2Desc:
      "يصل مفتاح الوصول في صندوق فاخر مرفقاً برسالة شخصية. ليس منشوراً تسويقياً — بل دعوة خاصة. اللمسة المادية تُرسي الحصرية والثقة قبل أي تتبّع.",
    how3Icon: "📱",
    how3Title: "لمسة واحدة للبوابة الخاصة",
    how3Desc:
      "حين يلمس المشتري بطاقته، يصل إلى تجربة رقمية مُصمَّمة وفق ملفّه الشخصي — مخططات طابقية، وأسعار، وخيارات سداد، ومرافق. بدون تطبيق. بدون تسجيل دخول. لمسة واحدة فقط.",
    how4Icon: "📊",
    how4Title: "ذكاء سلوكي لحظي",
    how4Desc:
      "كل إجراء داخل البوابة — من استعراض المخططات إلى تحميل الأسعار وطلب المعاينات — يُغذّي لوحة مبيعاتكم لحظياً. يعرف فريقكم بالضبط من المستعد وماذا يريد.",

    /* ── Key Difference ── */
    diffLabel: "الفرق الجوهري",
    diffTitle: "الموقع ذاته. الإجراءات ذاتها. ذكاء مختلف.",
    diffDesc:
      "داخل التجربة، المشترون أحرار في فعل ما يشاؤون — حجز معاينة، أو طلب أسعار، أو استكشاف خطط السداد، أو تحميل الكتيّبات. لا قمع إجباري. الفرق الوحيد هو الهوية.",
    diffVipTitle: "مشتري VIP (هوية معروفة)",
    diffVipDesc:
      "نعرف من هم. وهذا يُتيح متابعات شخصية، وحوافز مخصّصة، ومبيعات على مستوى الكونسيرج. يتّصل فريقكم بسياق كامل: \"ألاحظ أنكم تستعرضون وحدات بغرفتَي نوم في الطوابق ٣٠–٤٠ بإطلالة على المدينة — لدينا وحدتان متبقّيتان بسعر ما قبل الإطلاق.\"",
    diffAnonTitle: "زائر عام (مجهول الهوية)",
    diffAnonDesc:
      "نتعلّم على مستوى الشريحة ونُحسّن الاستراتيجية التسويقية. أيّ المخططات تستقطب الاهتمام الأكبر؟ أيّ نطاق سعري يحفّز التحميلات؟ الموقع ذاته، والإجراءات ذاتها — لكنّ ذكاءً مختلفاً يقود قرارات مختلفة.",

    /* ── Portfolio Scale ── */
    portLabel: "نطاق المحفظة",
    portTitle: "منصة واحدة. كل المشاريع. ذكاء مشترك عبر المحفظة.",
    portDesc:
      "على عكس أدوات المشروع الواحد، تنتشر DynamicNFC عبر محفظتكم بالكامل. بيانات المشتري الذكية من المشروع (أ) تنتقل إلى المشروع (ب). العميل الذي استعرض البنتهاوس في البرج الأول يحصل على محتوى البنتهاوس أولاً حين يُطلَق البرج الثاني.",
    port1Icon: "🏗️",
    port1Title: "انشر مرة واحدة، وتوسّع في كل مكان",
    port1Desc:
      "هيّئوا المنصة مرة واحدة. أطلقوا بوابات مشاريع جديدة في أيام — لا أشهر. لوحة تحكّم واحدة، مشروع جديد، وذكاء مشتري مشترك.",
    port2Icon: "📊",
    port2Title: "إشارات المشترين عبر المشاريع",
    port2Desc:
      "المشتري الذي تفاعل مع برجكم في وسط المدينة يُوسَم تلقائياً عند إطلاق مشروع الواجهة البحرية. رؤى على مستوى المحفظة لا توفّرها أدوات المشروع الواحد.",
    port3Icon: "🔄",
    port3Title: "تخلّصوا من الإعداد المتكرّر",
    port3Desc:
      "لا مزيد من إعادة بناء البنية التحتية للمبيعات مع كل إطلاق جديد. القوالب وشرائح المشترين وإطار التحليلات تنتقل معكم.",

    /* ── Live Demo ── */
    demoLabel: "عرض حي",
    demoTitle: "شاهدوه عملياً — فيستا ريزيدنسز",
    demoDesc:
      "استكشفوا عرضاً حياً مبنياً لمشروع برج فاخر افتراضي. شاهدوا كيف تحصل ملفات مشترين مختلفة على تجارب مختلفة كلياً من المنصة ذاتها.",
    demoBadge1: "★ مستثمر VIP",
    demoBadge2: "🏠 مشترٍ عائلي",
    demoBadge3: "🌐 وصول عام",
    demoBadge4: "📊 التحليلات",
    demoCard1Title: "خالد الراشد — بوابة المستثمر",
    demoCard1Desc:
      "تجربة مستثمر نخبوية — محتوى يركّز على العائد الاستثماري، واستعراض وحدات البنتهاوس في الطوابق العليا، ولوحة تحليلات استثمارية.",
    demoCard2Title: "أحمد الفهد — بوابة المشتري العائلي",
    demoCard2Desc:
      "تجربة المشتري العائلي — وحدات بثلاث غرف نوم، والمدارس المجاورة، والحدائق، ومرافق المجتمع، وخطط سداد ملائمة للعائلات.",
    demoCard3Title: "السوق العالمي",
    demoCard3Desc:
      "تصفّح مجهول الهوية مع التقاط تدريجي للعملاء المحتملين — كيف يتحوّل الزوّار المجهولون إلى مشترين معرّفين بمرور الوقت.",
    demoCard4Title: "لوحة تحكّم الشركة",
    demoCard4Desc:
      "تحليلات سلوكية داخلية — تفاعل لحظي، وتصنيف العملاء المحتملين، وتتبّع السلوك، وقمع التحويل.",
    demoCta: "زوروا بيئة العرض الكاملة ←",

    /* ── Use Cases ── */
    ucLabel: "حالات الاستخدام",
    ucTitle: "من إطلاق الأبراج إلى المجتمعات المخطَّطة",
    ucDesc:
      "تتكيّف DynamicNFC مع كل نوع مشروع في محفظتكم — لكلٍّ منها تجربة VIP خاصة بالمشتري.",
    uc1Title: "الأبراج السكنية",
    uc1Desc:
      "أطلقوا برجاً من ٥٠٠ وحدة مع مفاتيح وصول VIP لأفضل ٢٠٠ عميل محتمل. كل بطاقة تفتح بوابة تعرض الطابق المفضّل واتجاه الإطلالة وخطة السداد — قبل إجراء أي مكالمة هاتفية. يرى فريق مبيعاتكم من فتح البوابة، وماذا استعرض، ومن المستعد للتواصل.",
    uc1Tag1: "اختيار الطابق",
    uc1Tag2: "اتجاه الإطلالة",
    uc1Tag3: "خطط السداد",
    uc1Tag4: "تصنيف المشتري",
    uc2Title: "المجتمعات المخطَّطة الكبرى",
    uc2Desc:
      "عبر مخطط رئيسي يضمّ ٢٠٠٠ وحدة، تحتاج شرائح المشترين المختلفة إلى تجارب مختلفة. المستثمرون يرون توقّعات العائد والعوائد الإيجارية. والعائلات ترى قرب المدارس والحدائق. تقدّم DynamicNFC كليهما من المشروع ذاته — كل مشترٍ معرّف الهوية ومُتتبَّع.",
    uc2Tag1: "استهداف الشرائح",
    uc2Tag2: "إطلاقات مرحلية",
    uc2Tag3: "مرافق المجتمع",
    uc2Tag4: "تتبّع متعدّد المراحل",
    uc3Title: "المساكن ذات العلامات التجارية الفاخرة",
    uc3Desc:
      "في المساكن الفاخرة ذات العلامات التجارية، يجب أن تُضاهي تجربة البيع مستوى العلامة. تصل مفاتيح وصول VIP في صندوق فاخر يعكس لغة التصميم الخاصة بالعلامة. البوابة الخاصة حصرية ومنسّقة وشخصية — تُطابق معايير الخدمة الراقية التي يتوقّعها المشترون.",
    uc3Tag1: "تكامل العلامة التجارية",
    uc3Tag2: "تجربة خدمة راقية",
    uc3Tag3: "مبيعات الكونسيرج",
    uc3Tag4: "أصحاب الثروات الفائقة",
    uc4Title: "المشاريع متعدّدة الاستخدامات",
    uc4Desc:
      "مستثمرو التجزئة والمستأجرون التجاريون والمشترون السكنيون لديهم احتياجات مختلفة جذرياً. تُنشئ DynamicNFC بوابات متمايزة ضمن المشروع الواحد — كلٌّ منها مُصمَّم وفق ما يهمّ ذلك النوع من المشترين، وجميعها يُغذّي لوحة تحكّم موحّدة.",
    uc4Tag1: "شرائح متعدّدة",
    uc4Tag2: "تجاري وسكني",
    uc4Tag3: "مستثمر مقابل مستخدم نهائي",
    uc4Tag4: "تحليلات موحّدة",

    /* ── Partnership Model ── */
    partLabel: "نموذج الشراكة",
    partTitle: "أطلقوا في أسابيع. قيسوا بالمعاينات. توسّعوا عبر المحفظة.",
    partDesc:
      "نعمل جنباً إلى جنب مع فريق مبيعاتكم لتصميم تجربة المشتري VIP ونشرها وتحسينها — بدءاً من مشروع واحد، ثم التوسّع عبر كل إطلاق.",
    part1Icon: "🚀",
    part1Title: "تجربة تشغيلية من ٢ إلى ٤ أسابيع",
    part1Desc:
      "أطلقوا على مشروع واحد بمئة مفتاح وصول VIP. قيسوا المعاينات المحجوزة مقابل مجموعة التحكّم خلال ٣٠ يوماً.",
    part2Icon: "📐",
    part2Title: "تصميم بوابات مخصّصة",
    part2Desc:
      "نصمّم بوابات خاصة بالمشترين تتوافق مع هوية مشروعكم — معارض مخططات طابقية، وأسعار، ومرافق، ودعوات لاتخاذ إجراء.",
    part3Icon: "🔗",
    part3Title: "تكامل مع نظام إدارة العملاء",
    part3Desc:
      "يُغذّي الذكاء السلوكي نظام Salesforce أو HubSpot أو نظام إدارة العملاء الخاص بكم مباشرةً. لا استبدال للأنظمة — بل تعزيز لما تستخدمونه حالياً.",
    part4Icon: "🏢",
    part4Title: "نشر على مستوى المحفظة",
    part4Desc:
      "بمجرد إثبات الفعالية على مشروع واحد، انشروا عبر محفظتكم بالكامل. ذكاء مشتري مشترك عبر جميع الإطلاقات. بوابات المشاريع الجديدة تنطلق في أيام.",

    /* ── ROI ── */
    roiLabel: "لماذا هذا مهم",
    roiTitle: "سرعة المبيعات، لا مقاييس التباهي.",
    roiDesc:
      "الأمر لا يتعلّق بالنقرات أو لوحات التحكّم. يتعلّق بشيء واحد: زيادة المعاينات المحجوزة وتسريع اتخاذ القرار.",
    roi1Val: "٣٫٢×",
    roi1Label: "معدّل التحويل إلى معاينة",
    roi1Sub: "مدعوّو VIP مقابل الزيارات المجهولة",
    roi2Val: "٤٧٪",
    roi2Label: "دورة قرار أسرع",
    roi2Sub: "من أول دخول للبوابة إلى حجز المعاينة",
    roi3Val: "١٠٠٪",
    roi3Label: "تفاعل معرّف الهوية",
    roi3Sub: "كل تفاعل مرتبط بمشترٍ مُسمّى",

    /* ── FAQ ── */
    faqLabel: "الأسئلة الشائعة للمطوّرين",
    faqTitle: "أسئلة سيطرحها فريقكم",
    faq1Q: "هل يحلّ هذا النظام محلّ موقعنا الإلكتروني أو نظام إدارة العملاء؟",
    faq1A: "لا. تعمل DynamicNFC فوق أنظمتكم القائمة وتُعزّزها. يبقى موقع المشروع متاحاً للعموم. بوابة VIP هي طبقة خاصة للعملاء المحتملين المختارين — متصلة بنظام إدارة العملاء الحالي لديكم.",
    faq2Q: "كيف تُعالَج مسألة الموافقة والخصوصية؟",
    faq2A: "الموافقة صريحة وواضحة. يتلقّى العميل المحتمل بطاقة مادية مرفقة برسالة واضحة. لمسة البطاقة هي الموافقة. لا يوجد تتبّع خفي — المشتري يدخل بوابته الخاصة عن علم ودراية. وهذا يُرسي الموافقة والحصرية والثقة قبل أي عملية تتبّع.",
    faq3Q: "ما الذي يتلقّاه المشتري فعلياً؟",
    faq3A: "صندوق فاخر يحتوي على مفتاح وصول VIP — بطاقة NFC معدنية مصقولة مع رسالة شخصية. ليس منشوراً تسويقياً. بل دعوة خاصة. حين يلمس البطاقة، يدخل تجربة رقمية صُمِّمت خصيصاً له. بدون تطبيق.",
    faq4Q: "هل يعمل النظام عبر مشاريع متعدّدة؟",
    faq4A: "نعم — وهذه هي الميزة الجوهرية للمطوّرين. منصة واحدة، لوحة تحكّم واحدة، مع تصفية على مستوى المشروع ورؤى على مستوى المحفظة. ذكاء المشتري من مشروع ينتقل إلى المشروع التالي.",
    faq5Q: "كيف نقيس نجاح التجربة التشغيلية؟",
    faq5A: "بمقياس واحد: الزيادة في المعاينات المحجوزة بين مدعوّي VIP مقارنةً بمجموعة التحكّم. ليس بالنقرات. ولا بمشاهدات الصفحات. بل بنشاط مبيعات فعلي خلال ٣٠ يوماً من الإطلاق.",
    faq6Q: "ماذا عن المشترين الدوليين؟",
    faq6A: "تدعم البوابات لغات متعدّدة وتتكيّف مع موقع المشتري الجغرافي. المشروع ذاته يخدم مشترين من دبي ولندن وفانكوفر — كلٌّ بلغته المفضّلة، وجميعهم مُتتبَّعون في لوحة التحكّم ذاتها.",

    /* ── Final CTA ── */
    ctaLabel: "جاهزون للنشر",
    ctaTitle: "أنتم لا توزّعون بطاقات. أنتم تُصدرون دعوات خاصة.",
    ctaDesc:
      "حوّلوا النية الرقمية إلى زخم مبيعات حقيقي. ابدأوا بمشروع واحد ومئة مفتاح وصول VIP. قيسوا الفرق في المعاينات المحجوزة. ثم توسّعوا عبر محفظتكم.",
    ctaPilot: "ابدأوا البرنامج التجريبي ←",
    ctaDemo: "شاهدوا العرض الحي",

    /* ── Pilot Modal ── */
    modalTitle: "ابدأوا تجربة تشغيلية للمطوّرين",
    modalSub:
      "أخبرونا عن محفظتكم العقارية وسنصمّم تجربة تشغيلية مخصّصة — ١٠٠ مفتاح وصول VIP على مشروع واحد، تحليلات شاملة، ونتائج قابلة للقياس خلال ٣٠ يوماً.",
    modalSec1: "معلومات التواصل",
    modalSec2: "الشركة والمحفظة العقارية",
    modalSec3: "مشروع التجربة التشغيلية",
    modalSec4: "التحدّي البيعي",
    modalSubmit: "إرسال طلب التجربة التشغيلية ←",
    modalSubmitting: "جارٍ الإرسال...",
    modalNote:
      "نردّ خلال ٢٤ ساعة. معلوماتكم تُعامَل بسرية تامة.",
    successTitle: "تم إرسال طلب التجربة التشغيلية",
    successDesc:
      "شكراً لكم. سيراجع فريق شراكات المطوّرين تفاصيل محفظتكم ويتواصل معكم خلال ٢٤ ساعة.",
    successClose: "إغلاق",

    /* ── Footer ── */
    footerText:
      "© ٢٠٢٦ DynamicNFC — محرّك تسريع المبيعات للمطوّرين العقاريين",
  },
};

registerTranslations("developers", developers);

export default developers;
