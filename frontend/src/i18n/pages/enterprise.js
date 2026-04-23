import { registerTranslations } from "../index";

const enterprise = {
  en: {
    /* ── Navigation ── */
    navChallenge: "The Challenge",
    navHow: "How It Works",
    navDemo: "Live Demo",
    navImpact: "Impact",
    navPilot: "Request a Pilot",

    /* ── Hero ── */
    heroBadge: "Enterprise Sales Velocity Engine",
    heroTitle: "Turn Anonymous Visitors Into Booked Viewings",
    heroSub:
      "DynamicNFC transforms premium NFC cards into private buyer portals — bridging the gap between anonymous digital traffic and named, high-intent prospects ready to commit across mega-developments and branded residences.",
    statConversion: "Conversion Rate",
    statDecision: "Faster Decision Cycle",
    statIdentified: "Identified Visitors",
    heroCtaPilot: "Request a Pilot →",
    heroCtaDemo: "See the Live Demo",

    /* ── Problem ── */
    probLabel: "The Blind Spot",
    probTitle: "Your Sales Team Is Operating Without Context",
    probQuote:
      'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options online. Yet when sales teams engage, they lack the one critical thing that closes deals: <strong style="color:var(--red)">context.</strong>',
    prob1Icon: "🏙️",
    prob1Title: "Anonymous Traffic",
    prob1Desc:
      "97% of your website visitors leave without ever identifying themselves — across every project launch",
    prob2Icon: "⏳",
    prob2Title: "Delayed Follow-ups",
    prob2Desc:
      "Sales teams reach out too late, with no insight into which units, payment plans, or amenities prospects explored",
    prob3Icon: "📋",
    prob3Title: "Generic Conversations",
    prob3Desc:
      "Every prospect gets the same pitch — whether they're an investor seeking ROI or a family seeking community",

    /* ── The Shift ── */
    shiftLabel: "The Shift",
    shiftTitle: "From Brochure Website to Private Invitation",
    shiftDesc:
      "What if you stopped treating the website as a public brochure — and started treating it as a private experience for selected prospects?",
    oldLabel: "The Old Way",
    oldTitle: "Generic Website",
    oldDesc:
      "Everyone sees the same thing. Anonymous visitors. Zero context for your sales team.",
    old1: "Anonymous traffic",
    old2: "One-size-fits-all content",
    old3: "No behavioral signals",
    old4: "Cold follow-ups",
    newLabel: "The Dynamic Way",
    newTitle: "Private VIP Experience",
    newDesc:
      "Each VIP Access Key unlocks a personalized portal. Identity precedes action.",
    new1: "Named, identified visitors",
    new2: "Persona-tailored content",
    new3: "Real-time behavioral signals",
    new4: "Contextual, timely outreach",

    /* ── How It Works ── */
    howLabel: "The Process",
    howTitle: "From Premium Box to Booked Viewing",
    howDesc:
      "Selected prospects receive a premium box containing a VIP Access Key — an NFC-enabled card with a personal message. The experience unfolds from there.",
    step1Title: "VIP Selection",
    step1Desc:
      "Your sales team selects high-value prospects and assigns a personalized NFC card linked to their profile.",
    step2Title: "Premium Delivery",
    step2Desc:
      'Prospects receive a premium box with a VIP Access Key and personal invitation: "This card unlocks a private experience created for you."',
    step3Title: "Tap & Explore",
    step3Desc:
      "One tap opens their private portal — tailored floor plans, pricing, amenities, and booking tools, all linked to their identity.",
    step4Title: "Behavioral Intelligence",
    step4Desc:
      "Every interaction — floor plan views, pricing requests, viewing bookings — feeds your dashboard in real time.",

    /* ── VIP vs Anonymous ── */
    idLabel: "The Key Difference",
    idTitle: "Same Website. Same Actions. Different Intelligence.",
    idTagline: "Identity is the multiplier.",
    idVipLabel: "VIP Access Key Holder",
    idVipTitle: "Named Prospect — Khalid Al-Rashid",
    idVipDesc:
      "You know he viewed the Skyline Penthouse three times, downloaded the ROI brochure, and spent 8 minutes on payment plans. Your sales team calls with context, timing, and the right offer.",
    idVip1: "Personal Follow-ups",
    idVip2: "Tailored Incentives",
    idVip3: "Concierge Sales",
    idVip4: "Named Intelligence",
    idAnonLabel: "Anonymous Website Visitor",
    idAnonTitle: "Unknown — Segment Data Only",
    idAnonDesc:
      "Someone visited the penthouse page. You don't know who, how many times, or what else they explored. The lead sits in a queue with hundreds of others.",
    idAnon1: "Segment-level Data",
    idAnon2: "Generic Outreach",
    idAnon3: "Marketing Optimization",
    idAnon4: "No Named Signals",

    /* ── Live Demo ── */
    demoLabel: "Live Demo",
    demoTitle: "See It In Action — Vista Residences",
    demoDesc:
      "Explore our fully functional demo environment. Four portals show how DynamicNFC transforms the same project into four distinct experiences — from VIP investors to anonymous browsers.",
    demoBadge1: "★ VIP Investor",
    demoCard1Title: "Khalid Al-Rashid Portal",
    demoCard1Desc:
      "Elite investor experience with ROI-focused content, high-floor penthouse showcases, and investment analytics.",
    demoBadge2: "🏠 Family Buyer",
    demoCard2Title: "Ahmed Al-Fahad Portal",
    demoCard2Desc:
      "Premium homebuyer experience highlighting family-friendly 3BR units, school districts, and community amenities.",
    demoBadge3: "🌐 Public Access",
    demoCard3Title: "Global Marketplace",
    demoCard3Desc:
      "Anonymous and registered user browsing experience with adaptive content based on engagement signals.",
    demoBadge4: "📊 Analytics",
    demoCard4Title: "Corporate Dashboard — Behavioral Intelligence",
    demoCard4Desc:
      "Real-time engagement metrics, lead scoring, conversion funnels, and A/B testing. See how every tap feeds your sales pipeline.",
    demoBadge5: "🤖 AI Engine",
    demoCard5Title: "AI Sales Pipeline — Live MCP Demo",
    demoCard5Desc:
      "Watch AI orchestrate Gmail, Google Calendar, and DocuSign in real-time. Every action is verifiable — click to confirm in your own accounts.",
    demoCta: "Explore Full Demo →",

    /* ── ROI ── */
    roiLabel: "Why This Matters",
    roiTitle: "This Is Not About Clicks. It's About Sales Velocity.",
    roiDesc:
      "Success is measured by one thing: how fast prospects move from first tap to booked viewing to signed deal.",
    roiFlow1: "100 VIP Invitations",
    roiFlow2: "Private Digital Access",
    roiFlow3: "High-Intent Signals",
    roiFlow4: "Sales Prioritization",
    roiFlow5: "More Booked Viewings",
    roiFlow6: "Higher Close Rate",
    roiMetric1Label: "Higher Conversion Rate",
    roiMetric1Sub: "VIP invitees vs. anonymous website traffic",
    roiMetric2Label: "Faster Decision Cycle",
    roiMetric2Sub: "From first tap to booked viewing",
    roiMetric3Label: "Identified Engagement",
    roiMetric3Sub: "Every tap is linked to a named prospect",

    /* ── Trust / Enterprise Features ── */
    trustLabel: "Built for Enterprise",
    trustTitle: "Privacy-First. CRM-Integrated. Zero Friction.",
    trust1Icon: "🔒",
    trust1Title: "Consent by Design",
    trust1Desc:
      "The physical tap is the ultimate opt-in. Consent is explicit, invitations are intentional, access is controlled.",
    trust2Icon: "📱",
    trust2Title: "NFC + QR Fallback",
    trust2Desc:
      "NFC for instant access. QR codes for universal compatibility. No app downloads required.",
    trust3Icon: "🔗",
    trust3Title: "CRM Integration",
    trust3Desc:
      "Sits on top of your existing systems. Enhances your CRM with behavioral intelligence — doesn't replace it.",
    trust4Icon: "🤖",
    trust4Title: "AI Personalization",
    trust4Desc:
      "Content adapts dynamically to each prospect's interests, stage, and engagement history.",

    /* ── FAQ ── */
    faqLabel: "Questions Executives Ask",
    faqTitle: "Addressed Before You Ask Them",
    faq1Q: "Is this replacing our website or CRM?",
    faq1A:
      "No. DynamicNFC is a layer that sits on top of your existing systems. Your website keeps working. Your CRM keeps working. We enhance both with identity-linked behavioral intelligence that neither can capture alone.",
    faq2Q: "How do we measure pilot success?",
    faq2A:
      "One metric: increase in booked viewings among VIP invitees versus your control group. Not clicks, not pageviews — real sales activity.",
    faq3Q: "What about data privacy and compliance?",
    faq3A:
      "Consent is baked into the physical experience. When a prospect taps a card they intentionally received, that's explicit opt-in. No dark patterns, no hidden tracking. The tap is the consent.",
    faq4Q: "What does the prospect actually receive?",
    faq4A:
      "A premium box with an NFC-enabled VIP Access Key and a personal message. Not a marketing flyer — a private invitation.",
    faq5Q: "How fast can we deploy?",
    faq5A:
      "A pilot program can launch within 2–4 weeks. We configure your portals, design the premium box experience, program the NFC cards, and connect the analytics dashboard.",
    faq6Q: "What's the real ROI here?",
    faq6A:
      'It\'s about cutting the time from "Interested" to "Viewing" in half. When your sales team engages at the right moment with the right context, decisions accelerate.',

    /* ── Final CTA ── */
    ctaLabel: "Ready to Deploy",
    ctaTitle:
      "You're Not Handing Out NFC Cards. You're Issuing Private Invitations.",
    ctaDesc:
      "Turn digital intent into real sales momentum. Start a pilot with 100 VIP invitations and measure the difference in booked viewings within 30 days.",
    ctaPilot: "Request a Pilot Program →",
    ctaDemo: "Explore the Live Demo",

    /* ── Pilot Modal ── */
    modalTitle: "Request a Pilot Program",
    modalSub:
      "Tell us about your development and we'll design a custom pilot program — 100 VIP invitations, full analytics dashboard, and measurable results within 30 days.",
    modalSec1: "Contact Information",
    modalSec2: "Company & Role",
    modalSec3: "Project Details",
    modalSec4: "Current Challenges",
    modalSubmit: "Submit Pilot Request →",
    modalSubmitting: "Submitting...",
    modalNote:
      "We respond within 24 hours. Your information is kept strictly confidential.",
    successTitle: "Pilot Request Submitted",
    successDesc:
      "Thank you. Our enterprise team will review your project details and reach out within 24 hours to design your custom pilot program.",
    successClose: "Close",

    /* ── Footer ── */
    footerText:
      "© 2025 DynamicNFC — Sales Velocity Engine for Real Estate Developers",
  },

  ar: {
    /* ── Navigation ── */
    navChallenge: "التحدي",
    navHow: "آلية العمل",
    navDemo: "عرض مباشر",
    navImpact: "الأثر",
    navPilot: "طلب برنامج تجريبي",

    /* ── Hero ── */
    heroBadge: "محرك تسريع المبيعات للمؤسسات",
    heroTitle: "حوِّل الزوار المجهولين إلى معاينات محجوزة",
    heroSub:
      "تُحوِّل DynamicNFC بطاقات NFC الفاخرة إلى بوابات خاصة بالمشترين، لتسدّ الفجوة بين حركة المرور الرقمية المجهولة والعملاء المحتملين المعروفين ذوي النية الشرائية العالية عبر المشاريع الكبرى والمساكن ذات العلامات التجارية.",
    statConversion: "معدل التحويل",
    statDecision: "دورة قرار أسرع",
    statIdentified: "زوار محدّدو الهوية",
    heroCtaPilot: "طلب برنامج تجريبي →",
    heroCtaDemo: "شاهد العرض المباشر",

    /* ── Problem ── */
    probLabel: "النقطة العمياء",
    probTitle: "فريق مبيعاتك يعمل دون سياق",
    probQuote:
      'يقضي المشترون الأكثر اهتماماً أسابيع في استكشاف المخططات الطابقية والأسعار وخيارات الدفع عبر الإنترنت. لكن حين تتواصل فِرَق المبيعات، ينقصها العنصر الحاسم الذي يُنجز الصفقات: <strong style="color:var(--red)">السياق.</strong>',
    prob1Icon: "🏙️",
    prob1Title: "حركة مرور مجهولة",
    prob1Desc:
      "٩٧٪ من زوار موقعك الإلكتروني يغادرون دون الكشف عن هويتهم — في كل عملية إطلاق مشروع",
    prob2Icon: "⏳",
    prob2Title: "متابعات متأخرة",
    prob2Desc:
      "تتواصل فِرَق المبيعات بعد فوات الأوان، دون أي معرفة بالوحدات أو خطط الدفع أو المرافق التي استكشفها العملاء المحتملون",
    prob3Icon: "📋",
    prob3Title: "محادثات نمطية",
    prob3Desc:
      "يتلقى كل عميل محتمل العرض ذاته — سواء كان مستثمراً يبحث عن العائد أو عائلة تبحث عن مجتمع سكني",

    /* ── The Shift ── */
    shiftLabel: "التحوّل",
    shiftTitle: "من موقع إلكتروني عام إلى دعوة خاصة",
    shiftDesc:
      "ماذا لو توقفت عن التعامل مع الموقع الإلكتروني كمنشور دعائي عام — وبدأت بمعاملته كتجربة حصرية للعملاء المختارين؟",
    oldLabel: "الطريقة التقليدية",
    oldTitle: "موقع إلكتروني عام",
    oldDesc:
      "الجميع يرى المحتوى ذاته. زوار مجهولون. لا سياق لدى فريق مبيعاتك.",
    old1: "حركة مرور مجهولة",
    old2: "محتوى موحّد للجميع",
    old3: "انعدام الإشارات السلوكية",
    old4: "متابعات باردة",
    newLabel: "طريقة DynamicNFC",
    newTitle: "تجربة VIP حصرية",
    newDesc:
      "كل مفتاح وصول VIP يفتح بوابة مخصصة. الهوية تسبق الإجراء.",
    new1: "زوار محدّدون بالاسم",
    new2: "محتوى مُصمّم وفق الملف الشخصي",
    new3: "إشارات سلوكية لحظية",
    new4: "تواصل مدروس وفي الوقت المناسب",

    /* ── How It Works ── */
    howLabel: "آلية العمل",
    howTitle: "من الصندوق الفاخر إلى المعاينة المحجوزة",
    howDesc:
      "يتلقى العملاء المحتملون المختارون صندوقاً فاخراً يحتوي على مفتاح وصول VIP — بطاقة NFC مع رسالة شخصية. ومن هنا تبدأ التجربة.",
    step1Title: "اختيار كبار العملاء",
    step1Desc:
      "يختار فريق مبيعاتك العملاء المحتملين ذوي القيمة العالية ويُخصّص لكل منهم بطاقة NFC مرتبطة بملفه الشخصي.",
    step2Title: "التوصيل الفاخر",
    step2Desc:
      "يتلقى العملاء صندوقاً فاخراً يتضمن مفتاح وصول VIP ودعوة شخصية: \"هذه البطاقة تفتح تجربة خاصة صُمّمت لك.\"",
    step3Title: "المس واستكشف",
    step3Desc:
      "لمسة واحدة تفتح بوابتهم الخاصة — مخططات طابقية وأسعار ومرافق وأدوات حجز، جميعها مرتبطة بهويتهم.",
    step4Title: "الذكاء السلوكي",
    step4Desc:
      "كل تفاعل — من مشاهدة المخططات إلى طلبات التسعير وحجوزات المعاينة — يُغذّي لوحة التحكم لحظياً.",

    /* ── VIP vs Anonymous ── */
    idLabel: "الفارق الجوهري",
    idTitle: "الموقع ذاته. الإجراءات ذاتها. ذكاء مختلف.",
    idTagline: "الهوية هي المُضاعِف.",
    idVipLabel: "حامل مفتاح وصول VIP",
    idVipTitle: "عميل محدّد الهوية — خالد الراشد",
    idVipDesc:
      "تعلم أنه استعرض بنتهاوس سكاي لاين ثلاث مرات، وحمّل كتيّب العائد على الاستثمار، وأمضى ٨ دقائق في مراجعة خطط الدفع. يتواصل فريق مبيعاتك مزوّداً بالسياق والتوقيت والعرض الملائم.",
    idVip1: "متابعات شخصية",
    idVip2: "حوافز مُصمّمة خصيصاً",
    idVip3: "مبيعات بأسلوب الكونسيرج",
    idVip4: "ذكاء مرتبط بالهوية",
    idAnonLabel: "زائر موقع مجهول",
    idAnonTitle: "مجهول — بيانات شريحة فقط",
    idAnonDesc:
      "شخص ما زار صفحة البنتهاوس. لا تعرف من هو، ولا عدد زياراته، ولا ما استكشفه. يبقى العميل المحتمل في قائمة انتظار مع مئات غيره.",
    idAnon1: "بيانات على مستوى الشريحة",
    idAnon2: "تواصل عام",
    idAnon3: "تحسين تسويقي",
    idAnon4: "انعدام الإشارات المُسمّاة",

    /* ── Live Demo ── */
    demoLabel: "عرض مباشر",
    demoTitle: "شاهد النظام قيد التشغيل — فيستا ريزيدنسز",
    demoDesc:
      "استكشف بيئة العرض التفاعلية. أربع بوابات توضح كيف تُحوِّل DynamicNFC المشروع ذاته إلى أربع تجارب متمايزة — من مستثمري VIP إلى المتصفحين المجهولين.",
    demoBadge1: "★ مستثمر VIP",
    demoCard1Title: "بوابة خالد الراشد",
    demoCard1Desc:
      "تجربة مستثمر نخبوية تركّز على العائد الاستثماري، وعروض البنتهاوس في الطوابق العليا، وتحليلات الاستثمار.",
    demoBadge2: "🏠 مشترٍ عائلي",
    demoCard2Title: "بوابة أحمد الفهد",
    demoCard2Desc:
      "تجربة مشترٍ فاخرة تُبرز وحدات ٣ غرف نوم الملائمة للعائلات، والمناطق التعليمية، والمرافق المجتمعية.",
    demoBadge3: "🌐 وصول عام",
    demoCard3Title: "السوق العالمي",
    demoCard3Desc:
      "تجربة تصفح للزوار المجهولين والمسجّلين مع محتوى متكيّف بناءً على إشارات التفاعل.",
    demoBadge4: "📊 التحليلات",
    demoCard4Title: "لوحة التحكم المؤسسية — الذكاء السلوكي",
    demoCard4Desc:
      "مقاييس تفاعل لحظية، وتقييم العملاء المحتملين، ومسارات التحويل، واختبارات A/B. شاهد كيف تُغذّي كل لمسة خط أنابيب مبيعاتك.",
    demoBadge5: "🤖 محرك الذكاء الاصطناعي",
    demoCard5Title: "خط أنابيب المبيعات بالذكاء الاصطناعي — عرض MCP مباشر",
    demoCard5Desc:
      "شاهد الذكاء الاصطناعي ينسّق Gmail وGoogle Calendar وDocuSign في الوقت الفعلي. كل إجراء قابل للتحقق — انقر للتأكيد في حساباتك الخاصة.",
    demoCta: "استكشف العرض الكامل →",

    /* ── ROI ── */
    roiLabel: "لماذا يهمّ هذا",
    roiTitle: "الأمر لا يتعلق بالنقرات، بل بسرعة المبيعات.",
    roiDesc:
      "يُقاس النجاح بأمر واحد: مدى سرعة انتقال العملاء المحتملين من أول لمسة إلى معاينة محجوزة إلى صفقة موقّعة.",
    roiFlow1: "١٠٠ دعوة VIP",
    roiFlow2: "وصول رقمي خاص",
    roiFlow3: "إشارات نية شرائية عالية",
    roiFlow4: "ترتيب أولويات المبيعات",
    roiFlow5: "معاينات محجوزة أكثر",
    roiFlow6: "معدل إغلاق أعلى",
    roiMetric1Label: "معدل تحويل أعلى",
    roiMetric1Sub: "مدعوّو VIP مقابل حركة الموقع المجهولة",
    roiMetric2Label: "دورة قرار أسرع",
    roiMetric2Sub: "من أول لمسة إلى المعاينة المحجوزة",
    roiMetric3Label: "تفاعل محدّد الهوية",
    roiMetric3Sub: "كل لمسة مرتبطة بعميل محتمل معروف بالاسم",

    /* ── Trust / Enterprise Features ── */
    trustLabel: "مبني للمؤسسات",
    trustTitle: "الخصوصية أولاً. تكامل مع CRM. بلا أي احتكاك.",
    trust1Icon: "🔒",
    trust1Title: "الموافقة بالتصميم",
    trust1Desc:
      "اللمسة الفعلية هي أعلى مستويات الاشتراك الطوعي. الموافقة صريحة، والدعوات مقصودة، والوصول مُتحكَّم فيه.",
    trust2Icon: "📱",
    trust2Title: "NFC + رمز QR احتياطي",
    trust2Desc:
      "NFC للوصول الفوري. رموز QR للتوافق الشامل. لا حاجة لتحميل أي تطبيق.",
    trust3Icon: "🔗",
    trust3Title: "تكامل مع نظام CRM",
    trust3Desc:
      "يعمل كطبقة فوق أنظمتك القائمة. يُعزّز نظام CRM لديك بالذكاء السلوكي — ولا يستبدله.",
    trust4Icon: "🤖",
    trust4Title: "تخصيص بالذكاء الاصطناعي",
    trust4Desc:
      "يتكيّف المحتوى ديناميكياً مع اهتمامات كل عميل محتمل ومرحلته وسجل تفاعله.",

    /* ── FAQ ── */
    faqLabel: "أسئلة القيادات التنفيذية",
    faqTitle: "أجوبة جاهزة قبل أن تطرح السؤال",
    faq1Q: "هل يحل هذا محل موقعنا الإلكتروني أو نظام CRM؟",
    faq1A:
      "لا. DynamicNFC طبقة تعمل فوق أنظمتك القائمة. يظل موقعك الإلكتروني يعمل، ويظل نظام CRM لديك يعمل. نحن نُعزّز كليهما بذكاء سلوكي مرتبط بالهوية لا يستطيع أي منهما التقاطه بمفرده.",
    faq2Q: "كيف نقيس نجاح البرنامج التجريبي؟",
    faq2A:
      "بمقياس واحد: الزيادة في المعاينات المحجوزة بين مدعوّي VIP مقارنةً بالمجموعة الضابطة. لا نقرات ولا مشاهدات صفحات — بل نشاط مبيعات فعلي.",
    faq3Q: "ماذا عن خصوصية البيانات والامتثال؟",
    faq3A:
      "الموافقة مدمجة في صُلب التجربة الفعلية. حين ينقر العميل المحتمل على بطاقة تلقّاها عمداً، فهذا اشتراك طوعي صريح. لا أنماط مظلمة، ولا تتبّع خفي. اللمسة هي الموافقة.",
    faq4Q: "ما الذي يتلقّاه العميل المحتمل فعلياً؟",
    faq4A:
      "صندوق فاخر يحتوي على مفتاح وصول VIP مزوّد بتقنية NFC ورسالة شخصية. ليس منشوراً تسويقياً — بل دعوة خاصة.",
    faq5Q: "ما مدى سرعة النشر؟",
    faq5A:
      "يمكن إطلاق البرنامج التجريبي خلال أسبوعين إلى أربعة أسابيع. نُهيئ بواباتك، ونُصمّم تجربة الصندوق الفاخر، ونُبرمج بطاقات NFC، ونربط لوحة التحليلات.",
    faq6Q: "ما العائد الفعلي على الاستثمار؟",
    faq6A:
      "الهدف هو تقليص الوقت من \"مهتم\" إلى \"معاينة\" إلى النصف. حين يتواصل فريق مبيعاتك في اللحظة المناسبة وبالسياق الصحيح، تتسارع القرارات.",

    /* ── Final CTA ── */
    ctaLabel: "جاهز للنشر",
    ctaTitle: "أنت لا توزّع بطاقات NFC. أنت تُصدر دعوات خاصة.",
    ctaDesc:
      "حوِّل النية الرقمية إلى زخم مبيعات حقيقي. ابدأ ببرنامج تجريبي يتضمن ١٠٠ دعوة VIP وقِس الفارق في المعاينات المحجوزة خلال ٣٠ يوماً.",
    ctaPilot: "طلب برنامج تجريبي →",
    ctaDemo: "استكشف العرض المباشر",

    /* ── Pilot Modal ── */
    modalTitle: "طلب برنامج تجريبي",
    modalSub:
      "أخبرنا عن مشروعك التطويري وسنُصمّم لك برنامجاً تجريبياً مخصصاً — ١٠٠ دعوة VIP، ولوحة تحليلات متكاملة، ونتائج قابلة للقياس خلال ٣٠ يوماً.",
    modalSec1: "معلومات التواصل",
    modalSec2: "الشركة والمنصب",
    modalSec3: "تفاصيل المشروع",
    modalSec4: "التحديات الراهنة",
    modalSubmit: "إرسال طلب البرنامج التجريبي →",
    modalSubmitting: "جارٍ الإرسال...",
    modalNote:
      "نردّ خلال ٢٤ ساعة. معلوماتك تُعامل بسرية تامة.",
    successTitle: "تم إرسال طلب البرنامج التجريبي",
    successDesc:
      "شكراً لك. سيراجع فريقنا المؤسسي تفاصيل مشروعك ويتواصل معك خلال ٢٤ ساعة لتصميم برنامجك التجريبي المخصص.",
    successClose: "إغلاق",

    /* ── Footer ── */
    footerText:
      "© ٢٠٢٥ DynamicNFC — محرك تسريع المبيعات للمطورين العقاريين",
  },
};

registerTranslations("enterprise", enterprise);
export default enterprise;
