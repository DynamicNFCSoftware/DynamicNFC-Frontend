import { registerTranslations } from "../index";

const realEstate = {
  en: {
    /* ── Nav (page-specific anchors) ── */
    navChallenge: "The Challenge",
    navHow: "How It Works",
    navDemo: "Live Demo",
    navUseCases: "Use Cases",
    navPilot: "Start a Pilot",

    /* ── Hero ── */
    heroBadge: "VIP Digital Experience for Real Estate",
    heroTitle: "Turn Buyer Intent Into Booked Viewings.",
    heroSub:
      "DynamicNFC gives real estate sales teams a new weapon: VIP Access Keys that deliver private, personalized buyer experiences — and tell you exactly who is ready to act, what they care about, and when to call.",
    stat1Val: "47%",
    stat1Label: "Higher Engagement",
    stat2Val: "3.2×",
    stat2Label: "Faster to Viewing",
    stat3Val: "Real-time",
    stat3Label: "Buyer Intelligence",
    heroCtaPilot: "Start a Pilot →",
    heroCtaDemo: "See the Live Demo",

    /* ── Challenge (Blind Spot) ── */
    challLabel: "The Blind Spot",
    challTitle: "Your Sales Team Has Leads. They Don't Have Context.",
    challQuote:
      'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options online. Yet when your sales team picks up the phone, they often lack one critical thing: <strong>context</strong>. They don\'t know who is ready, what they care about most, or when to act. This leads to delayed follow-ups, generic conversations, and missed momentum.',
    chall1Icon: "👥",
    chall1Title: "Anonymous Traffic",
    chall1Desc:
      "Hundreds of visitors browse your project website. You see page views — but you don't know who they are or what caught their attention.",
    chall2Icon: "🕐",
    chall2Title: "Delayed Follow-Up",
    chall2Desc:
      "By the time your sales team reaches out, the buyer has cooled off. The window between peak interest and first contact is too wide.",
    chall3Icon: "📋",
    chall3Title: "Generic Outreach",
    chall3Desc:
      "Every buyer gets the same email, the same call script, the same brochure. A penthouse investor and a first-time family buyer hear the same pitch.",

    /* ── The Shift ── */
    shiftLabel: "The Shift",
    shiftTitle: "From Public Website to Private Invitation",
    shiftDesc:
      "What if you stopped treating your website as a brochure, and instead treated it as a private experience for selected prospects? Not everyone — only those you intentionally invite.",
    oldLabel: "The Old Way",
    oldTitle: "Generic Website",
    oldDesc: "One website for everyone. Anonymous traffic. No buyer identity.",
    old1: "Same experience for all visitors",
    old2: "No way to identify high-intent buyers",
    old3: "Sales team calls blind",
    old4: "Follow-up based on guesswork",
    newLabel: "The Dynamic Way",
    newTitle: "Private VIP Experience",
    newDesc:
      "Each buyer receives a VIP Access Key that unlocks a portal built for them.",
    new1: "Personalized content per buyer",
    new2: "Identity known before first click",
    new3: "Sales team has full context",
    new4: "Follow-up timed to buyer signals",

    /* ── How It Works ── */
    howLabel: "How It Works",
    howTitle: "From Premium Box to Booked Viewing",
    howDesc:
      'Selected prospects receive a premium box with an NFC card and a personal message. The message is clear: "This card unlocks a private experience created specifically for you."',
    how1Icon: "📦",
    how1Title: "VIP Campaign Selection",
    how1Desc:
      "Your sales team selects high-value prospects from the CRM — investors, repeat buyers, referrals, VIP waitlist members. Each gets a personalized VIP Access Key.",
    how2Icon: "💳",
    how2Title: "Premium Box Delivery",
    how2Desc:
      'The NFC card arrives in a premium box with a personal message: "This unlocks your private experience." The physical touch creates exclusivity and trust.',
    how3Icon: "📱",
    how3Title: "Tap to Private Portal",
    how3Desc:
      "When the buyer taps their card, they access a private digital experience — tailored to their preferences, interests, and stage in the journey. No app required.",
    how4Icon: "📊",
    how4Title: "Behavioral Intelligence",
    how4Desc:
      "Every action inside the portal — floor plans viewed, pricing downloaded, viewings booked — feeds your sales dashboard in real time. Your team knows exactly when to act.",

    /* ── Key Difference ── */
    diffLabel: "The Key Difference",
    diffTitle: "Same Website. Same Actions. Different Intelligence.",
    diffDesc:
      "The actions are identical for everyone — book a viewing, request pricing, explore payment plans. The only difference is identity.",
    diffVipTitle: "VIP Buyer (Known)",
    diffVipDesc:
      'We know who they are. That enables personal follow-ups, tailored incentives, and concierge-level sales. Your team calls with context: "I see you\'ve been looking at 2BR units on floors 30-40 — we have two left."',
    diffAnonTitle: "Public Visitor (Anonymous)",
    diffAnonDesc:
      "We learn at a segment level and optimize marketing. Which floor plans get the most attention? What price range drives downloads? Data-driven campaign decisions.",

    /* ── Live Demo ── */
    demoLabel: "Live Demo",
    demoTitle: "See It In Action — Vista Residences",
    demoDesc:
      "Explore a working demo built for a fictional luxury tower project. See how different buyer profiles receive completely different experiences from the same platform.",
    demoBadge1: "VIP Investor",
    demoBadge2: "Family Buyer",
    demoBadge3: "Public Access",
    demoBadge4: "Analytics Dashboard",
    demoCard1Title: "Khalid Al-Rashid — Investor Portal",
    demoCard1Desc:
      "Elite investor experience with ROI-focused content, high-floor penthouse showcases, and investment analytics.",
    demoCard2Title: "Ahmed Al-Fahad — Family Portal",
    demoCard2Desc:
      "Family buyer experience highlighting 3BR units, school districts, parks, and community amenities.",
    demoCard3Title: "Global Marketplace",
    demoCard3Desc:
      "Anonymous browsing experience with progressive lead capture — how public visitors become known buyers.",
    demoCard4Title: "Corporate Dashboard",
    demoCard4Desc:
      "Internal CRM dashboard showing real-time engagement, lead scoring, behavior tracking, and conversion funnels.",
    demoCta: "Visit Full Demo Environment →",

    /* ── Use Cases ── */
    ucLabel: "Use Cases",
    ucTitle: "From Tower Launches to Luxury Resale",
    ucDesc: "DynamicNFC adapts to every sales scenario in real estate.",
    uc1Title: "Pre-Construction Sales",
    uc1Desc:
      "Launch a 500-unit tower with VIP Access Keys for your top 200 prospects. Each card unlocks a portal showing their preferred floor, view orientation, and payment plan — before a single phone call is made. Your sales team sees who opened the portal, what they viewed, and who is ready for a callback.",
    uc1Tag1: "Floor Selection",
    uc1Tag2: "Pre-Launch Access",
    uc1Tag3: "Payment Plans",
    uc1Tag4: "Buyer Scoring",
    uc2Title: "Luxury Resale",
    uc2Desc:
      "For $5M+ listings, every touchpoint must reflect the calibre of the property. A premium brushed-metal NFC card delivered in a branded box positions the listing as exclusive. The buyer portal showcases private photography, video walkthroughs, and neighborhood data — all personalized to the recipient.",
    uc2Tag1: "White-Glove Experience",
    uc2Tag2: "Premium Presentation",
    uc2Tag3: "Private Media",
    uc2Tag4: "Concierge Sales",
    uc3Title: "Brokerage VIP Campaigns",
    uc3Desc:
      "Run a campaign across 50 high-value prospects this quarter. Each receives a VIP Access Key linked to your current inventory. Track which prospects engage, which listings they view repeatedly, and trigger sales alerts when engagement spikes. This is targeted outreach with built-in intelligence.",
    uc3Tag1: "Campaign Tracking",
    uc3Tag2: "Multi-Listing",
    uc3Tag3: "Engagement Alerts",
    uc3Tag4: "Pipeline Intelligence",
    uc4Title: "International Buyers",
    uc4Desc:
      "For overseas investors who can't visit the sales center, the VIP Access Key bridges the distance. Multi-language portals with virtual tours, floor plans, and pricing — all tracked. Your sales team in Vancouver knows the moment a buyer in Dubai opens their portal at 2am local time.",
    uc4Tag1: "Multi-Language",
    uc4Tag2: "Virtual Tours",
    uc4Tag3: "Time Zone Aware",
    uc4Tag4: "Cross-Border Sales",

    /* ── Partnership ── */
    partLabel: "Partnership Model",
    partTitle: "Launch in Weeks. Measure in Viewings.",
    partDesc:
      "We work alongside your sales team to design, deploy, and optimize the VIP buyer experience for your current project.",
    part1Icon: "🎯",
    part1Title: "Select Your Prospects",
    part1Desc:
      "Choose 50–200 high-value prospects from your CRM or VIP waitlist. We help you segment by buyer profile.",
    part2Icon: "🎨",
    part2Title: "Design the Experience",
    part2Desc:
      "We build a private buyer portal matched to your project branding — floor plans, pricing, amenities, and calls-to-action.",
    part3Icon: "📦",
    part3Title: "Deliver VIP Access Keys",
    part3Desc:
      "Premium NFC cards ship in branded boxes with personalized messages. Your prospects receive a physical invitation.",
    part4Icon: "📈",
    part4Title: "Track & Close",
    part4Desc:
      "Your sales dashboard lights up with buyer signals. Your team follows up with context — and books more viewings.",

    /* ── ROI ── */
    roiLabel: "Why This Matters",
    roiTitle: "Sales Velocity, Not Vanity Metrics.",
    roiDesc:
      'This is not about clicks or dashboards. It\'s about one thing: cutting the time from "Interested" to "Booked Viewing."',
    roi1Val: "47%",
    roi1Label: "Higher Engagement",
    roi1Sub: "VIP portals vs. standard project websites",
    roi2Val: "3.2×",
    roi2Label: "Conversion to Viewing",
    roi2Sub: "Among VIP invitees vs. anonymous leads",
    roi3Val: "< 48hr",
    roi3Label: "Time to First Follow-Up",
    roi3Sub: "Triggered by real buyer signals, not cold lists",

    /* ── FAQ ── */
    faqLabel: "Sales Team FAQ",
    faqTitle: "Questions Your Team Will Ask",
    faq1Q: "Is this replacing our website or CRM?",
    faq1A:
      "No. DynamicNFC sits on top of your existing systems and enhances them. Your website remains public. The VIP portal is a private layer for selected prospects — connected to your CRM.",
    faq2Q: "How is consent handled?",
    faq2A:
      "Consent is explicit. The prospect receives a physical card with a clear message. The tap is the opt-in. There is no hidden tracking — the buyer knowingly enters their private portal.",
    faq3Q: "What does the buyer actually see?",
    faq3A:
      "A personalized web experience — no app required. They see floor plans, pricing, amenities, and calls-to-action tailored to their profile. Think of it as their own private project website.",
    faq4Q: "How do we measure success?",
    faq4A:
      "One metric: increase in booked viewings among VIP invitees versus your control group. We also track portal engagement, content interaction, and conversion-to-callback rates.",
    faq5Q: "How long does setup take?",
    faq5A:
      "2–4 weeks from kickoff to first cards delivered. We design the portal, program the NFC cards, package the boxes, and ship — while your sales team continues working their pipeline.",
    faq6Q: "What CRM systems do you connect with?",
    faq6A:
      "Salesforce, HubSpot, Follow Up Boss, kvCORE, and custom integrations via webhook. Buyer signals flow directly into your sales team's existing workflow.",

    /* ── CTA ── */
    ctaLabel: "Ready to Move",
    ctaTitle:
      "You're Not Handing Out Cards. You're Issuing Private Invitations.",
    ctaDesc:
      "Turn digital intent into real sales momentum. Start with 50 VIP Access Keys for your current project and measure the difference.",
    ctaPilot: "Start a Pilot →",
    ctaDemo: "See the Live Demo",

    /* ── Modal ── */
    modalTitle: "Start a Sales Pilot",
    modalSub:
      "Tell us about your current project and we'll design a VIP buyer experience pilot — typically 50–200 Access Keys with a personalized portal.",
    modalSec1: "Contact Information",
    modalSec2: "Your Practice",
    modalSec3: "Pilot Project",
    modalSec4: "Sales Challenge",
    modalSubmit: "Submit Pilot Request →",
    modalSubmitting: "Submitting...",
    modalNote:
      "We respond within 24 hours. Your information is kept strictly confidential.",
    successTitle: "Pilot Request Submitted",
    successDesc:
      "Thank you. Our real estate specialist will reach out within 24 hours with a customized pilot proposal.",
    successClose: "Close",

    /* ── Footer ── */
    footerText:
      "© 2026 DynamicNFC — Sales Velocity Engine for Real Estate Professionals",
  },

  ar: {
    /* ── Nav (page-specific anchors) ── */
    navChallenge: "التحدّي",
    navHow: "آلية العمل",
    navDemo: "عرض مباشر",
    navUseCases: "حالات الاستخدام",
    navPilot: "ابدأ مشروعًا تجريبيًّا",

    /* ── Hero ── */
    heroBadge: "تجربة رقمية حصرية للقطاع العقاري",
    heroTitle: "حوِّل اهتمام المشتري إلى معاينات مؤكّدة.",
    heroSub:
      "يمنح DynamicNFC فِرَق المبيعات العقارية أداةً جديدة: مفاتيح وصول VIP تقدّم تجارب مخصّصة وحصرية لكل مشترٍ — وتُطلعك بدقّة على من هو مستعدّ للشراء، وما يستأثر باهتمامه، والتوقيت الأمثل للتواصل.",
    stat1Val: "٤٧٪",
    stat1Label: "معدّل تفاعل أعلى",
    stat2Val: "٣٫٢×",
    stat2Label: "أسرع وصولًا للمعاينة",
    stat3Val: "لحظي",
    stat3Label: "ذكاء سلوك المشتري",
    heroCtaPilot: "ابدأ مشروعًا تجريبيًّا ←",
    heroCtaDemo: "شاهد العرض المباشر",

    /* ── Challenge (Blind Spot) ── */
    challLabel: "الثغرة الخفيّة",
    challTitle: "فريق مبيعاتك يملك عملاء محتملين، لكنّه يفتقر إلى السياق.",
    challQuote:
      "يقضي المشترون الأكثر اهتمامًا أسابيع في استكشاف المخطّطات الطابقية والأسعار وخطط السداد عبر الإنترنت. غير أنّ فريق المبيعات حين يتواصل معهم، كثيرًا ما ينقصه عنصر جوهري: <strong>السياق</strong>. لا يعرفون من المستعدّ للشراء، ولا ما يهمّهم أكثر، ولا متى ينبغي التحرّك. يؤدّي ذلك إلى متابعات متأخّرة ومحادثات نمطية وفرص ضائعة.",
    chall1Icon: "👥",
    chall1Title: "زيارات مجهولة الهُويّة",
    chall1Desc:
      "مئات الزوّار يتصفّحون موقع مشروعك. ترى أرقام الزيارات، لكنّك لا تعرف من هم ولا ما استرعى انتباههم.",
    chall2Icon: "🕐",
    chall2Title: "متابعة متأخّرة",
    chall2Desc:
      "حين يتواصل فريق المبيعات أخيرًا، يكون حماس المشتري قد فتر. الفجوة الزمنية بين ذروة الاهتمام وأوّل اتصال أوسع ممّا ينبغي.",
    chall3Icon: "📋",
    chall3Title: "تواصل نمطي",
    chall3Desc:
      "كلّ مشترٍ يتلقّى البريد ذاته والنصّ ذاته والكتيّب ذاته. مستثمر البنتهاوس والأسرة التي تشتري لأوّل مرة يسمعان العرض نفسه.",

    /* ── The Shift ── */
    shiftLabel: "التحوّل",
    shiftTitle: "من موقع إلكتروني عامّ إلى دعوة خاصّة",
    shiftDesc:
      "ماذا لو توقّفتَ عن التعامل مع موقعك كنشرة إعلانية، وبدأت تعامله كتجربة حصرية لعملاء مختارين؟ ليس للجميع — فقط لمن تختارهم بعناية.",
    oldLabel: "الأسلوب التقليدي",
    oldTitle: "موقع إلكتروني عامّ",
    oldDesc: "موقع واحد للجميع. زيارات مجهولة. لا هُويّة للمشتري.",
    old1: "تجربة واحدة موحّدة لجميع الزوّار",
    old2: "لا سبيل لتحديد المشترين ذوي الاهتمام العالي",
    old3: "فريق المبيعات يتّصل دون أيّ معلومات مسبقة",
    old4: "متابعات مبنيّة على التخمين",
    newLabel: "الأسلوب الديناميكي",
    newTitle: "تجربة VIP حصرية",
    newDesc:
      "كلّ مشترٍ يحصل على مفتاح وصول VIP يفتح له بوّابة رقمية صُمِّمت خصّيصًا له.",
    new1: "محتوى مخصّص لكلّ مشترٍ",
    new2: "هُويّة المشتري معروفة قبل أوّل نقرة",
    new3: "فريق المبيعات يمتلك السياق الكامل",
    new4: "متابعات مبنيّة على إشارات سلوك المشتري",

    /* ── How It Works ── */
    howLabel: "آلية العمل",
    howTitle: "من العلبة الفاخرة إلى حجز المعاينة",
    howDesc:
      "يتلقّى العملاء المختارون علبة فاخرة تحتوي على بطاقة NFC ورسالة شخصية واضحة: \"هذه البطاقة تفتح لك تجربة خاصّة صُمِّمت حصريًّا من أجلك.\"",
    how1Icon: "📦",
    how1Title: "اختيار العملاء لحملة VIP",
    how1Desc:
      "يختار فريق مبيعاتك العملاء ذوي القيمة العالية من نظام إدارة العلاقات — مستثمرون، مشترون متكرّرون، إحالات، أعضاء قائمة الانتظار. يحصل كلّ منهم على مفتاح وصول VIP مخصّص.",
    how2Icon: "💳",
    how2Title: "توصيل العلبة الفاخرة",
    how2Desc:
      "تصل بطاقة NFC في علبة فاخرة مرفقة برسالة شخصية. هذا الحضور المادّي يُرسّخ الشعور بالحصرية والثقة.",
    how3Icon: "📱",
    how3Title: "لمسة واحدة نحو البوّابة الخاصّة",
    how3Desc:
      "حين يلمس المشتري بطاقته، يصل إلى تجربة رقمية خاصّة مصمَّمة وفق تفضيلاته واهتماماته ومرحلته الشرائية. لا حاجة لأيّ تطبيق.",
    how4Icon: "📊",
    how4Title: "ذكاء سلوكي لحظي",
    how4Desc:
      "كلّ إجراء داخل البوّابة — مخطّطات طابقية تمّت مشاهدتها، أسعار تمّ تحميلها، معاينات تمّ حجزها — يُغذّي لوحة مبيعاتك لحظيًّا. فريقك يعرف بدقّة متى يتحرّك.",

    /* ── Key Difference ── */
    diffLabel: "الفارق الجوهري",
    diffTitle: "الموقع ذاته. الإجراءات ذاتها. ذكاء مختلف تمامًا.",
    diffDesc:
      "الإجراءات متطابقة للجميع — حجز معاينة، طلب أسعار، استكشاف خطط السداد. الفارق الوحيد هو معرفة هُويّة المشتري.",
    diffVipTitle: "مشترٍ VIP (معروف الهُويّة)",
    diffVipDesc:
      "نعرف من هو. وهذا يتيح متابعات شخصية وحوافز مصمَّمة خصّيصًا ومبيعات بمستوى الكونسيرج. فريقك يتّصل بسياق كامل.",
    diffAnonTitle: "زائر عامّ (مجهول الهُويّة)",
    diffAnonDesc:
      "نتعلّم على مستوى الشريحة ونُحسّن الحملات التسويقية. أيّ المخطّطات تحظى بأكبر اهتمام؟ أيّ نطاق سعري يُحفّز التحميل؟ قرارات حملات مبنيّة على البيانات.",

    /* ── Live Demo ── */
    demoLabel: "عرض مباشر",
    demoTitle: "شاهده عمليًّا — فيستا ريزيدنسز",
    demoDesc:
      "استكشف عرضًا توضيحيًّا عمليًّا لمشروع برج فاخر خيالي. شاهد كيف يحصل المشترون بحسب ملفّاتهم المختلفة على تجارب مختلفة تمامًا من المنصّة ذاتها.",
    demoBadge1: "مستثمر VIP",
    demoBadge2: "مشترٍ عائلي",
    demoBadge3: "وصول عامّ",
    demoBadge4: "لوحة التحليلات",
    demoCard1Title: "خالد الراشد — بوّابة المستثمر",
    demoCard1Desc:
      "تجربة استثمارية نخبوية تركّز على العائد على الاستثمار، وعروض البنتهاوس في الطوابق العليا، والتحليلات الاستثمارية.",
    demoCard2Title: "أحمد الفهد — بوّابة العائلة",
    demoCard2Desc:
      "تجربة مصمَّمة للمشتري العائلي تُبرز وحدات ثلاث غرف نوم والمدارس المجاورة والحدائق والمرافق المجتمعية.",
    demoCard3Title: "السوق العالمي",
    demoCard3Desc:
      "تجربة تصفّح مجهولة الهُويّة مع آلية التقاط تدريجي للعملاء المحتملين — كيف يتحوّل الزوّار العاديّون إلى مشترين معروفين.",
    demoCard4Title: "لوحة التحكّم المؤسّسية",
    demoCard4Desc:
      "لوحة CRM داخلية تعرض التفاعل اللحظي وتقييم العملاء المحتملين وتتبّع السلوك وقمع التحويل.",
    demoCta: "زُر بيئة العرض الكاملة ←",

    /* ── Use Cases ── */
    ucLabel: "حالات الاستخدام",
    ucTitle: "من إطلاق الأبراج إلى إعادة بيع العقارات الفاخرة",
    ucDesc: "يتكيّف DynamicNFC مع كلّ سيناريو مبيعات في القطاع العقاري.",
    uc1Title: "مبيعات ما قبل الإنشاء",
    uc1Desc:
      "أطلِق برجًا من ٥٠٠ وحدة مع مفاتيح وصول VIP لأفضل ٢٠٠ عميل لديك. كلّ بطاقة تفتح بوّابة تعرض الطابق المفضّل واتجاه الإطلالة وخطّة السداد — قبل إجراء أيّ مكالمة هاتفية. يرى فريق مبيعاتك من فتح البوّابة وماذا شاهد ومن هو جاهز لإعادة الاتصال.",
    uc1Tag1: "اختيار الطابق",
    uc1Tag2: "وصول ما قبل الإطلاق",
    uc1Tag3: "خطط السداد",
    uc1Tag4: "تقييم المشتري",
    uc2Title: "إعادة بيع العقارات الفاخرة",
    uc2Desc:
      "للعقارات التي تتجاوز قيمتها ٥ ملايين دولار، يجب أن تعكس كلّ نقطة اتصال مستوى العقار. بطاقة NFC معدنية مصقولة في علبة تحمل العلامة التجارية تُبرز حصرية العقار. بوّابة المشتري تستعرض تصويرًا خاصًّا وجولات مرئية وبيانات الحيّ — مخصَّصة بالكامل للمتلقّي.",
    uc2Tag1: "تجربة فائقة الرقيّ",
    uc2Tag2: "عرض متميّز",
    uc2Tag3: "وسائط خاصّة",
    uc2Tag4: "مبيعات بمستوى الكونسيرج",
    uc3Title: "حملات VIP لشركات الوساطة",
    uc3Desc:
      "نفِّذ حملة تستهدف ٥٠ عميلًا ذا قيمة عالية هذا الربع. يتلقّى كلّ منهم مفتاح وصول VIP مرتبطًا بمخزونك الحالي من العقارات. تتبَّع من يتفاعل وأيّ العقارات يعاود مشاهدتها، وفعِّل تنبيهات البيع عند ارتفاع معدّل التفاعل. هذا تواصل موجَّه مزوَّد بذكاء مُدمَج.",
    uc3Tag1: "تتبّع الحملة",
    uc3Tag2: "عقارات متعدّدة",
    uc3Tag3: "تنبيهات التفاعل",
    uc3Tag4: "ذكاء خطّ المبيعات",
    uc4Title: "المشترون الدوليّون",
    uc4Desc:
      "للمستثمرين في الخارج الذين لا يستطيعون زيارة مركز المبيعات، يُقرّب مفتاح الوصول VIP المسافة. بوّابات متعدّدة اللغات تتضمّن جولات افتراضية ومخطّطات طابقية وأسعارًا — وكلّها تحت المراقبة. يعرف فريق مبيعاتك في فانكوفر لحظة فتح مشترٍ في دبي لبوّابته في الثانية صباحًا بتوقيته المحلّي.",
    uc4Tag1: "متعدّد اللغات",
    uc4Tag2: "جولات افتراضية",
    uc4Tag3: "مراعاة المنطقة الزمنية",
    uc4Tag4: "مبيعات عابرة للحدود",

    /* ── Partnership ── */
    partLabel: "نموذج الشراكة",
    partTitle: "أطلِق في أسابيع. قِس النتائج بالمعاينات.",
    partDesc:
      "نعمل جنبًا إلى جنب مع فريق مبيعاتك لتصميم ونشر وتحسين تجربة المشتري VIP لمشروعك الحالي.",
    part1Icon: "🎯",
    part1Title: "اختر عملاءك المستهدَفين",
    part1Desc:
      "اختر ٥٠ إلى ٢٠٠ عميل ذوي قيمة عالية من نظام إدارة العلاقات أو قائمة انتظار VIP. نساعدك في التقسيم وفق ملفّ المشتري.",
    part2Icon: "🎨",
    part2Title: "صمِّم التجربة",
    part2Desc:
      "نبني بوّابة مشتري خاصّة متوافقة مع الهُويّة البصرية لمشروعك — مخطّطات طابقية وأسعار ومرافق ودعوات لاتّخاذ الإجراء.",
    part3Icon: "📦",
    part3Title: "وصِّل مفاتيح الوصول VIP",
    part3Desc:
      "تُشحَن بطاقات NFC الفاخرة في علب تحمل العلامة التجارية مع رسائل مخصَّصة. يتلقّى عملاؤك دعوة ماديّة ملموسة.",
    part4Icon: "📈",
    part4Title: "تتبَّع وأغلِق الصفقات",
    part4Desc:
      "تتوهّج لوحة مبيعاتك بإشارات المشتري. فريقك يتابع بسياق كامل — ويحجز مزيدًا من المعاينات.",

    /* ── ROI ── */
    roiLabel: "لماذا يُهمّ هذا",
    roiTitle: "سرعة المبيعات، لا مقاييس استعراضية.",
    roiDesc:
      "الأمر لا يتعلّق بالنقرات أو لوحات المعلومات. يتعلّق بشيء واحد: تقليص المسافة الزمنية من \"مهتمّ\" إلى \"معاينة محجوزة\".",
    roi1Val: "٤٧٪",
    roi1Label: "معدّل تفاعل أعلى",
    roi1Sub: "بوّابات VIP مقارنةً بمواقع المشاريع التقليدية",
    roi2Val: "٣٫٢×",
    roi2Label: "معدّل التحويل إلى معاينة",
    roi2Sub: "بين مدعوّي VIP مقارنةً بالعملاء المحتملين المجهولين",
    roi3Val: "< ٤٨ ساعة",
    roi3Label: "الزمن حتى أوّل متابعة",
    roi3Sub: "تُفعَّل بإشارات سلوك حقيقية، لا بقوائم باردة",

    /* ── FAQ ── */
    faqLabel: "الأسئلة الشائعة لفريق المبيعات",
    faqTitle: "أسئلة سيطرحها فريقك",
    faq1Q: "هل يحلّ هذا محلّ موقعنا الإلكتروني أو نظام إدارة العلاقات؟",
    faq1A:
      "لا. يعمل DynamicNFC فوق أنظمتكم القائمة ويُعزّزها. يظلّ موقعكم متاحًا للعموم. بوّابة VIP هي طبقة خاصّة للعملاء المختارين — متّصلة بنظام إدارة العلاقات لديكم.",
    faq2Q: "كيف تُعالَج مسألة الموافقة؟",
    faq2A:
      "الموافقة صريحة ومباشرة. يتلقّى العميل بطاقة ماديّة مع رسالة واضحة. لمسة البطاقة هي فعل الموافقة. لا يوجد تتبّع خفيّ — المشتري يدخل بوّابته الخاصّة عن وعي واختيار.",
    faq3Q: "ماذا يرى المشتري فعليًّا؟",
    faq3A:
      "تجربة ويب مخصَّصة لا تتطلّب أيّ تطبيق. يرى مخطّطات طابقية وأسعارًا ومرافق ودعوات لاتّخاذ الإجراء، مصمَّمة جميعها وفق ملفّه الشخصي. اعتبرها موقع المشروع الخاصّ به.",
    faq4Q: "كيف نقيس النجاح؟",
    faq4A:
      "مقياس واحد رئيسي: الزيادة في المعاينات المحجوزة بين مدعوّي VIP مقارنةً بمجموعة المقارنة. نتتبّع أيضًا التفاعل مع البوّابة والتفاعل مع المحتوى ومعدّلات التحويل إلى إعادة الاتصال.",
    faq5Q: "كم يستغرق الإعداد؟",
    faq5A:
      "من أسبوعين إلى أربعة أسابيع من الانطلاق وحتى تسليم أولى البطاقات. نصمّم البوّابة ونبرمج بطاقات NFC ونُعدّ العلب ونشحنها — بينما يواصل فريق مبيعاتك العمل على خطّ المبيعات الحالي.",
    faq6Q: "ما أنظمة إدارة العلاقات التي تتكاملون معها؟",
    faq6A:
      "Salesforce وHubSpot وFollow Up Boss وkvCORE، إضافةً إلى تكاملات مخصَّصة عبر webhook. تتدفّق إشارات المشتري مباشرةً إلى سير عمل فريق مبيعاتك الحالي.",

    /* ── CTA ── */
    ctaLabel: "جاهز للانطلاق",
    ctaTitle: "أنت لا توزّع بطاقات. أنت تُصدر دعوات خاصّة.",
    ctaDesc:
      "حوِّل الاهتمام الرقمي إلى زخم مبيعات حقيقي. ابدأ بـ ٥٠ مفتاح وصول VIP لمشروعك الحالي وقِس الفارق.",
    ctaPilot: "ابدأ مشروعًا تجريبيًّا ←",
    ctaDemo: "شاهد العرض المباشر",

    /* ── Modal ── */
    modalTitle: "ابدأ مشروع مبيعات تجريبيًّا",
    modalSub:
      "أخبرنا عن مشروعك الحالي وسنصمّم لك تجربة VIP تجريبية — عادةً ما تشمل ٥٠ إلى ٢٠٠ مفتاح وصول مع بوّابة مخصَّصة.",
    modalSec1: "معلومات التواصل",
    modalSec2: "بيانات شركتك",
    modalSec3: "المشروع التجريبي",
    modalSec4: "التحدّي البيعي",
    modalSubmit: "أرسِل طلب المشروع التجريبي ←",
    modalSubmitting: "جارٍ الإرسال...",
    modalNote:
      "نردّ خلال ٢٤ ساعة. معلوماتك تُعامَل بسريّة تامّة.",
    successTitle: "تمّ إرسال طلب المشروع التجريبي",
    successDesc:
      "شكرًا لك. سيتواصل معك أخصائي القطاع العقاري لدينا خلال ٢٤ ساعة مع مقترح تجريبي مخصَّص.",
    successClose: "إغلاق",

    /* ── Footer ── */
    footerText:
      "© ٢٠٢٦ DynamicNFC — محرّك تسريع المبيعات لمحترفي القطاع العقاري",
  },
};

registerTranslations("realEstate", realEstate);

export default realEstate;
