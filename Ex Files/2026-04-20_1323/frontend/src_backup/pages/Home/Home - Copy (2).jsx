import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './Home.css';
import SEO from '../../components/SEO/SEO';

import cardFrontImg from '../NFCCards/Assets/card-front.jpg';
import cardBackImg  from '../NFCCards/Assets/card-back.jpg';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    home: 'Home', enterprise: 'Enterprise', nfcCards: 'NFC Cards', developers: 'Developers',
    realEstate: 'Real Estate', login: 'Login', contactSales: 'Contact Sales',
    badge: 'Sales Velocity Engine',
    heroLine1: 'One Tap.',
    heroLine2: 'Named Buyer.',
    heroLine3: 'Closed Deal.',
    heroSub1: 'Premium NFC cards that turn anonymous website visitors into ',
    heroSubB1: 'named VIP prospects',
    heroSub2: ' — with ',
    heroSubB2: 'private portals',
    heroSub3: ', ',
    heroSubB3: 'behavioral intelligence',
    heroSub4: ', and ',
    heroSubB4: 'real-time sales triggers',
    heroSub5: '.',
    cardCta: 'See what Khalid sees when he taps →',
    cardHint: 'This is your VIP Access Key',
    trustStrip: 'Built for leading brands in',
    trustStripInd: ['Luxury Real Estate', 'Premium Automotive', 'Private Banking', 'Hospitality'],

    stat1v: '47%',  stat1l: 'Higher Engagement', stat1context: 'VIP cardholders vs anonymous traffic',
    stat2v: '3.2×', stat2l: 'Conversion Rate', stat2context: 'Named prospects vs cold outreach',
    stat3v: '< 48h', stat3l: 'Decision Speed', stat3context: 'From first tap to booked viewing',
    stat4v: '100%', stat4l: 'Identified Visitors', stat4context: 'Every tap linked to a named VIP',

    vsTitle: 'The Blind Spot vs. The Dynamic Way',
    vsSub: 'Same buyer. Same intent. Different outcome.',
    vsOldTitle: 'Without DynamicNFC',
    vsNewTitle: 'With DynamicNFC',
    vsOld1: 'Anonymous traffic — 97% leave unnamed',
    vsOld2: 'Generic follow-ups days later',
    vsOld3: 'Same pitch for every buyer',
    vsOld4: 'Zero behavioral context',
    vsNew1: 'Named VIP prospects from first tap',
    vsNew2: 'Real-time outreach with full context',
    vsNew3: 'Persona-tailored private portals',
    vsNew4: 'Every click, view, and action tracked',

    blindLabel: 'The problem',
    blindTitle: 'The Blind Spot',
    blindSub: 'Your buyers are already exploring. You just can\'t see them.',
    blindDesc: 'Today, your highest-intent buyers spend weeks exploring options online — floor plans, vehicle specs, pricing, configurations. Yet when sales teams engage, they lack the one thing that matters: context.',
    blindPain1: '97% of website visitors leave unidentified',
    blindPain2: 'Sales teams follow up late with generic pitches',
    blindPain3: 'Every buyer gets the same experience — investor or family',

    shiftLabel: 'The solution',
    shiftTitle: 'The Shift',
    shiftSub: 'From public website to private invitation.',
    shiftDesc: 'What if you stopped treating the website as a brochure, and instead treated it as a private experience for selected prospects? Not everyone — only those you intentionally invite.',
    shiftPoint1: 'Selected prospects receive a premium box with an NFC card',
    shiftPoint2: 'One tap opens a private portal built for them',
    shiftPoint3: 'Consent, exclusivity, and trust — before any tracking',

    howLabel: 'How it works',
    howTitle: 'From Premium Box to Booked Action',
    howSub: 'A 4-step process that turns digital intent into real sales momentum — across industries.',
    step1t: 'VIP Selection',     step1d: 'Your sales team selects high-value prospects and assigns a personalized NFC card.',
    step2t: 'Premium Delivery',  step2d: 'Prospects receive a premium box with their VIP Access Key and a personal invitation.',
    step3t: 'Tap & Explore',     step3d: 'One tap opens their private portal — curated content, pricing, booking tools, and exclusive offers.',
    step4t: 'Sales Intelligence', step4d: 'Every interaction feeds the dashboard in real-time. Your team knows exactly when and why to call.',

    demoLabel: 'Live demos',
    demoTitle: 'See It In Action',
    demoSub: 'Explore live demos across real estate and automotive — VIP portals, marketplaces, and intelligence dashboards.',
    demoCard1: 'Real Estate — VIP Investor',
    demoCard1d: 'Khalid Al-Rashid — Penthouse buyer with ROI analytics and payment plans',
    demoCard2: 'Real Estate — Family Buyer',
    demoCard2d: 'Ahmed Al-Fahad — 3BR family with school proximity and community focus',
    demoCard3: 'Automotive — VIP Showroom',
    demoCard3d: 'Khalid Al-Mansouri — AMG GT 63 S with vehicle configurator and test drive booking',
    demoCard4: 'Automotive — Dealer Dashboard',
    demoCard4d: 'Prestige Motors — VIP behavioral intelligence, model analytics, and sales triggers',
    demoCard5: 'AI Sales Pipeline',
    demoCard5d: 'Watch AI orchestrate Canva, Gmail, Calendar, and DocuSign in real-time — fully verifiable',
    demoCta: 'Launch Full Demo',

    indLabel: 'Industries',
    indTitle: 'Built For Your Industry',
    indSub: 'Specialized paths, one platform.',
    ind1t: 'Real Estate Developers',
    ind1d: 'Portfolio-wide sales acceleration. VIP buyer portals, behavioral analytics, CRM intelligence. Turn every launch into a data-driven sales engine.',
    ind1cta: 'Developer Solutions →',
    ind1tags: ['VIP Portals', 'Behavioral Analytics', 'CRM Integration', 'Payment Plans'],
    ind2t: 'Real Estate Agents',
    ind2d: 'Agent onboarding, listing links on every card, lead capture at open houses, QR sign-in sheets, and broker-level brand control.',
    ind2cta: 'Agent Solutions →',
    ind2tags: ['Agent Cards', 'Lead Capture', 'Open House QR', 'Broker Control'],
    ind3t: 'Enterprise NFC Cards',
    ind3d: 'Premium metal, 24K gold, bamboo, and PVC cards with custom encoding. Bulk ordering, team provisioning, and worldwide fulfillment.',
    ind3cta: 'Enterprise Cards →',
    ind3tags: ['Metal & Gold', 'Bulk Orders', 'Team Management', 'Analytics'],
    ind4t: 'Automotive Dealerships',
    ind4d: 'VIP showroom portals, test drive intelligence, vehicle configurator, and buyer intent signals for luxury dealerships. Mercedes, BMW, Porsche — Gulf region ready.',
    ind4cta: 'Automotive Solutions →',
    ind4tags: ['VIP Showroom', 'Test Drive Intel', 'Configurator', 'Dealer Dashboard'],

    testimonialQuote: 'Within 3 weeks of deploying DynamicNFC cards, we identified 14 high-intent buyers we would have never known about. Two penthouses sold directly from VIP portal interactions.',
    testimonialName: 'Khalid Al-Rashid',
    testimonialRole: 'VP of Sales, Prestige Developments',
    testimonialLabel: 'Pilot Program Result',

    featLabel: 'Platform',
    featTitle: 'Enterprise-Grade Platform',
    featSub: 'Everything your team needs to sell faster.',
    feat1t: 'Identity-First Intelligence', feat1d: 'Know WHO is browsing before you know WHAT they do. NFC tap = named VIP with full behavioral context.',
    feat2t: 'Behavioral Analytics',        feat2d: 'Real-time dashboards tracking views, configurations, pricing requests, and bookings — per VIP and per listing or model.',
    feat3t: 'Automated Sales Triggers',     feat3d: '"Why call now?" engine. Auto-generated outreach reasons based on last 48h VIP behavior.',
    feat4t: 'Bilingual EN/AR + RTL',        feat4d: 'Full Arabic support with professional industry terminology. Every portal, dashboard, and report — Gulf region ready.',
    feat5t: 'Privacy by Design',            feat5d: 'Physical tap = explicit consent. No surveillance. Concierge tone. PDPL/DPL aligned.',
    feat6t: 'Canada-Based Operations',      feat6d: 'Headquartered in Vancouver. Dedicated account management and priority support for Gulf clients.',

    trustLabel: 'Trust',
    trustTitle: 'Privacy-First. CRM-Integrated. Zero Friction.',
    trust1t: 'Consent by Design',   trust1d: 'The physical NFC tap is the ultimate opt-in. No dark patterns.',
    trust2t: 'NFC + QR Fallback',   trust2d: 'NFC for instant access. QR for universal compatibility. No app required.',
    trust3t: 'CRM Integration',     trust3d: 'Sits on top of your existing systems — enhances, never replaces.',
    trust4t: 'AI Personalization',  trust4d: 'Content adapts dynamically to each prospect\'s interests and stage.',

    procLabel: 'Process',
    procTitle: 'From Pilot to Scale',
    procSub: 'A proven 4-step process',
    proc1t: 'Discovery Call',       proc1d: 'We assess your portfolio, current pain points, and pilot scope. 30 minutes.',
    proc2t: 'Pilot Setup',          proc2d: 'Project portal design, content delivery, VIP list selection, and card design approval. 2 weeks.',
    proc3t: 'Premium Box Delivery', proc3d: 'NFC card encoding, premium box assembly, and delivery to your selected VIPs.',
    proc4t: '90-Day Review',        proc4d: 'Measure booked viewing uplift, decision speed, and VIP engagement vs. control group.',

    priceLabel: 'Pricing',
    priceTitle: 'Enterprise Pricing',
    priceSub: 'Pilot programs are customized to your portfolio.',
    priceInc: 'What\'s included:',
    priceI1: 'VIP Access Keys (NFC cards)',
    priceI2: 'Private buyer portals',
    priceI3: 'Behavioral analytics dashboard',
    priceI4: 'Dedicated account manager',
    priceI5: '90-day performance review',
    priceCta: 'Get a Custom Quote',

    faqLabel: 'FAQ',
    faqTitle: 'Questions Executives Ask',
    faq1q: 'Is this replacing our CRM?',
    faq1a: 'No. DynamicNFC sits on top of your existing CRM and enhances it with behavioral intelligence from VIP portals.',
    faq2q: 'Is this compliant with privacy laws?',
    faq2a: 'Yes. The physical NFC tap is the ultimate opt-in. Consent is explicit, invitations are intentional, and access is controlled.',
    faq3q: 'What\'s the pilot success metric?',
    faq3a: 'Increase in booked viewings among VIP invitees versus the control group. We measure decision speed, not just clicks.',
    faq4q: 'Do buyers need an app?',
    faq4a: 'No. A tap or QR scan opens the portal instantly in the phone\'s browser — no downloads required.',
    faq5q: 'How long is the pilot?',
    faq5a: '90 days from VIP box delivery. Includes portal setup, card production, and full performance review.',
    faq6q: 'Can we customize per project?',
    faq6a: 'Yes. Each development project gets its own branded portal with custom units, floor plans, pricing, and bilingual content.',

    ctaTitle: 'Ready to Accelerate Your Sales?',
    ctaSub: 'You\'re not handing out NFC cards. You\'re issuing private invitations — and turning digital intent into real sales momentum.',
    ctaPrimary: 'Launch Live Demo',
    ctaSecondary: 'Talk to Sales',

    footIndustries: 'Industries', footEnterprise: 'Enterprise', footNfcCards: 'NFC Cards',
    footContact: 'Contact Sales', footResources: 'Resources',
    footLogin: 'Log in', footDev: 'Developers', footRe: 'Real Estate',
    footAutomotive: 'Automotive', footLiveDemo: 'Live Demo',
    footCopy: '© 2026 DynamicNFC Card Inc. All Rights Reserved.',
    footNote: 'Headquartered in Vancouver, Canada. Serving luxury real estate developers globally.',
  },
  ar: {
    home: 'الرئيسية', enterprise: 'المؤسسات', nfcCards: 'بطاقات NFC', developers: 'المطورين',
    realEstate: 'العقارات', login: 'تسجيل الدخول', contactSales: 'تواصل مع المبيعات',
    badge: "محرك سرعة المبيعات",
    heroLine1: 'نقرة واحدة.',
    heroLine2: 'مشترٍ معروف.',
    heroLine3: 'صفقة مغلقة.',
    heroSub1: 'بطاقات NFC فاخرة تحوّل زوار الموقع المجهولين إلى ',
    heroSubB1: 'عملاء VIP معروفين',
    heroSub2: ' — مع ',
    heroSubB2: 'بوابات خاصة',
    heroSub3: ' و',
    heroSubB3: 'ذكاء سلوكي',
    heroSub4: ' و',
    heroSubB4: 'محفزات مبيعات فورية',
    heroSub5: '.',
    cardCta: 'شاهد ما يراه خالد عندما ينقر ←',
    cardHint: 'هذا هو مفتاح وصول كبار الشخصيات',
    trustStrip: 'مصمم للعلامات الرائدة في',
    trustStripInd: ['العقارات الفاخرة', 'السيارات المتميزة', 'الخدمات المصرفية الخاصة', 'الضيافة'],

    stat1v: "0.47",  stat1l: "مشاركة أعلى", stat1context: 'حاملو بطاقات VIP مقابل الزوار المجهولين',
    stat2v: "3.2×", stat2l: "معدل التحويل", stat2context: 'العملاء المعروفون مقابل التواصل البارد',
    stat3v: "< 48 ساعة", stat3l: "سرعة القرار", stat3context: 'من أول نقرة إلى حجز الزيارة',
    stat4v: '١٠٠٪', stat4l: 'زوار معرّفون', stat4context: 'كل نقرة مرتبطة بعميل VIP',

    vsTitle: 'النقطة العمياء مقابل الطريقة الديناميكية',
    vsSub: 'نفس المشتري. نفس النية. نتيجة مختلفة.',
    vsOldTitle: 'بدون DynamicNFC',
    vsNewTitle: 'مع DynamicNFC',
    vsOld1: 'حركة مرور مجهولة — 97% يغادرون دون اسم',
    vsOld2: 'متابعات عامة بعد أيام',
    vsOld3: 'نفس العرض لكل مشتري',
    vsOld4: 'صفر سياق سلوكي',
    vsNew1: 'عملاء VIP معروفون من أول نقرة',
    vsNew2: 'تواصل فوري مع سياق كامل',
    vsNew3: 'بوابات خاصة مخصصة لكل شخصية',
    vsNew4: 'كل نقرة وعرض وإجراء يُتتبع',

    blindLabel: 'المشكلة',
    blindTitle: "النقطة العمياء",
    blindSub: "عملاؤك المستكشفون بالفعل. أنت فقط لا تراهم.",
    blindDesc: "اليوم، يقضي المشترون ذوو النية العالية أسابيع في استكشاف الخيارات — مخططات الطوابق، مواصفات السيارات، الأسعار، التكوينات. ومع ذلك، عندما يتواصل فرق المبيعات، يفتقرون للسياق.",
    blindPain1: '٩٧٪ من زوار الموقع يغادرون دون تعريف أنفسهم',
    blindPain2: 'فرق المبيعات تتابع متأخرة بعروض عامة',
    blindPain3: 'كل مشترٍ يحصل على نفس التجربة — مستثمر أو عائلة',

    shiftLabel: 'الحل',
    shiftTitle: "التحول",
    shiftSub: "من الموقع العام إلى الدعوة الخاصة.",
    shiftDesc: "ماذا لو توقفت عن التعامل مع الموقع الإلكتروني ككتيب، وبدأت في اعتباره تجربة خاصة للمستثمرين المختارين؟ ليس للجميع — فقط لأولئك الذين تدعوهم عن قصد. يحصل هؤلاء على صندوق فاخر يحتوي على بطاقة الاتصال قريب المدى. عند النقر، يصلون إلى تجربة رقمية خاصة. هذا يضمن الموافقة، الحصرية، والثقة قبل أي تتبع.",
    shiftPoint1: 'العملاء المختارون يتلقون صندوقاً فاخراً مع بطاقة NFC',
    shiftPoint2: 'نقرة واحدة تفتح بوابة خاصة مبنية لهم',
    shiftPoint3: 'الموافقة والحصرية والثقة — قبل أي تتبع',

    howLabel: 'كيف يعمل',
    howTitle: 'من الصندوق الفاخر إلى الإجراء المحجوز',
    howSub: 'عملية من ٤ خطوات تحوّل النية الرقمية إلى زخم مبيعات حقيقي — عبر القطاعات.',
    step1t: 'اختيار VIP',      step1d: 'يختار فريق مبيعاتك العملاء ذوي القيمة العالية ويخصص بطاقة NFC.',
    step2t: 'توصيل مميز',      step2d: 'يتلقى العملاء صندوقاً فاخراً مع مفتاح VIP ودعوة شخصية.',
    step3t: 'المس واستكشف',    step3d: 'نقرة واحدة تفتح بوابتهم الخاصة — محتوى مخصص، أسعار، أدوات حجز، وعروض حصرية.',
    step4t: 'ذكاء المبيعات',   step4d: 'كل تفاعل يغذي لوحة التحكم لحظياً. فريقك يعرف بالضبط متى ولماذا يتصل.',

    demoLabel: 'عروض مباشرة',
    demoTitle: "مشاهدة التطبيق عمليًا",
    demoSub: "استكشف العروض المباشرة عبر العقارات والسيارات — بوابات VIP، الأسواق، ولوحات الذكاء.",
    demoCard1: "عقارات — مستثمر VIP", demoCard1d: "خالد الرشيد — مشتري بنتهاوس مع تحليلات ROI",
    demoCard2: "عقارات — مشتري عائلي", demoCard2d: "أحمد الفهد — عائلة مع تركيز على المدارس والمجتمع",
    demoCard3: "سيارات — صالة عرض VIP", demoCard3d: "خالد المنصوري — AMG GT 63 S مع أداة تكوين وحجز تجربة قيادة",
    demoCard4: "سيارات — لوحة تحكم الوكيل", demoCard4d: "بريستيج موتورز — ذكاء سلوك VIP، تحليلات الموديلات، ومحفزات المبيعات",
    demoCard5: 'خط مبيعات الذكاء الاصطناعي', demoCard5d: 'شاهد الذكاء الاصطناعي ينسق Canva وGmail والتقويم وDocuSign مباشرة — قابل للتحقق',
    demoCta: "إطلاق العرض التجريبي الكامل",

    indLabel: 'القطاعات',
    indTitle: "مصممة لصناعتك",
    indSub: "مسارات متخصصة، منصة واحدة",
    ind1t: "مطورو العقارات",
    ind1d: "تسريع المبيعات على مستوى المحفظة. بوابات مشترين كبار الشخصيات، تحليلات سلوكية، ذكاء إدارة علاقات العملاء. حوّل كل إطلاق إلى محرك مبيعات قائم على البيانات.",
    ind1cta: "حلول للمطورين",
    ind1tags: ['بوابات VIP', 'تحليلات سلوكية', 'تكامل CRM', 'خطط الدفع'],
    ind2t: "وكلاء العقارات",
    ind2d: "تدريب الوكلاء، روابط القوائم على كل بطاقة، جمع العملاء المحتملين في المعارض المفتوحة، أوراق تسجيل QR، والتحكم بالعلامة التجارية على مستوى الوسيط.",
    ind2cta: "حلول للوكلاء",
    ind2tags: ['بطاقات الوكلاء', 'التقاط العملاء', 'QR للمعارض', 'تحكم الوسيط'],
    ind3t: "بطاقات الاتصال قريب المدى للمؤسسات",
    ind3d: "بطاقات معدنية فاخرة، ذهب 24 قيراط، خشب بامبو، وبطاقات PVC مع ترميز مخصص. طلب بالجملة، إعداد الفرق، وشحن عالمي.",
    ind3cta: "بطاقات المؤسسات",
    ind3tags: ['معدن وذهب', 'طلبات جماعية', 'إدارة الفرق', 'تحليلات'],
    ind4t: 'وكلاء السيارات',
    ind4d: 'بوابات صالة عرض VIP خاصة، ذكاء تجربة القيادة، أداة تكوين السيارات، وإشارات نية المشتري لوكلاء السيارات الفاخرة. Mercedes، BMW، Porsche — جاهز لمنطقة الخليج.',
    ind4cta: 'حلول السيارات →',
    ind4tags: ['صالة عرض VIP', 'ذكاء التجربة', 'أداة التكوين', 'لوحة الوكيل'],

    testimonialQuote: 'خلال 3 أسابيع من نشر بطاقات DynamicNFC، حددنا 14 مشترياً ذوي نية عالية لم نكن لنعرفهم أبداً. تم بيع شقتين بنتهاوس مباشرة من تفاعلات بوابة VIP.',
    testimonialName: 'خالد الرشيد',
    testimonialRole: 'نائب رئيس المبيعات، بريستيج للتطوير',
    testimonialLabel: 'نتيجة البرنامج التجريبي',

    featLabel: 'المنصة',
    featTitle: "منصة بمستوى المؤسسات",
    featSub: "كل ما يحتاجه فريقك، لا شيء إضافي",
    feat1t: "الذكاء القائم على الهوية",     feat1d: "اعرف من يتصفح قبل أن تعرف ماذا يفعل. نقرة الاتصال قريب المدى = كبار الشخصيات معروف مع سياق سلوكي كامل.",
    feat2t: "التحليلات السلوكية",          feat2d: "لوحات تحكم في الوقت الفعلي تتعقب المشاهدات، التكوينات، طلبات الأسعار، والحجوزات — لكل VIP ولكل وحدة أو موديل.",
    feat3t: "محفزات المبيعات",      feat3d: "محرك \"لماذا الاتصال الآن؟\". أسباب تواصل مولدة تلقائيًا بناءً على سلوك كبار الشخصيات خلال آخر 48 ساعة.",
    feat4t: "ثنائي اللغة EN/AR + RTL", feat4d: "دعم كامل للغة العربية مع مصطلحات احترافية للصناعة. كل بوابة، لوحة تحكم، وتقرير — جاهز لمنطقة الخليج.",
    feat5t: "الخصوصية حسب التصميم",         feat5d: "النقرة المادية = موافقة صريحة. لا مراقبة. نبرة خدمة شخصية في جميع التواصلات. متوافقة مع PDPL/DPL.",
    feat6t: "عمليات مقرها كندا",            feat6d: "المقر الرئيسي في فانكوفر. إدارة حسابات مخصصة ودعم أولوية لعملاء الخليج.",

    trustLabel: 'الثقة',
    trustTitle: 'خصوصية أولاً. تكامل CRM. بدون احتكاك.',
    trust1t: 'موافقة بالتصميم',    trust1d: 'النقر الفعلي هو أقصى اشتراك. بدون أنماط مظلمة.',
    trust2t: 'NFC + رمز QR',       trust2d: 'NFC للوصول الفوري. QR للتوافق الشامل. بدون تطبيق.',
    trust3t: 'تكامل CRM',          trust3d: 'يعمل فوق أنظمتك الحالية — يعزز ولا يستبدل.',
    trust4t: 'تخصيص بالذكاء الاصطناعي', trust4d: 'المحتوى يتكيف ديناميكياً مع اهتمامات كل عميل ومرحلته.',

    procLabel: 'العملية',
    procTitle: 'من البرنامج التجريبي إلى التوسع',
    procSub: 'عملية مثبتة من 4 خطوات',
    proc1t: 'مكالمة استكشافية',       proc1d: 'نقوم بتقييم محفظتك، ونقاط الألم الحالية، ونطاق البرنامج التجريبي. 30 دقيقة.',
    proc2t: 'إعداد البرنامج التجريبي', proc2d: 'تصميم بوابة المشروع، تسليم المحتوى، اختيار قائمة الـ VIP، واعتماد تصميم البطاقة. أسبوعان.',
    proc3t: 'تسليم الصندوق الفاخر',   proc3d: 'ترميز بطاقات NFC، تجميع الصناديق الفاخرة، وتسليمها إلى VIP المختارين لديك.',
    proc4t: 'مراجعة 90 يومًا',        proc4d: 'قياس زيادة حجوزات الزيارات، سرعة اتخاذ القرار، وتفاعل VIP مقارنة بمجموعة التحكم.',

    priceLabel: 'التسعير',
    priceTitle: 'تسعير المؤسسات',
    priceSub: 'البرامج التجريبية مخصصة لمحفظتك.',
    priceInc: 'ما الذي يتضمنه:',
    priceI1: 'مفاتيح وصول VIP (بطاقات NFC)',
    priceI2: 'بوابات خاصة للمشترين',
    priceI3: 'لوحة تحكم التحليلات السلوكية',
    priceI4: 'مدير حساب مخصص',
    priceI5: 'مراجعة أداء لمدة 90 يومًا',
    priceCta: 'احصل على عرض مخصص',

    faqLabel: 'أسئلة شائعة',
    faqTitle: "الأسئلة المتكررة",
    faq1q: "هل هذا يحل محل إدارة علاقات العملاء الخاص بنا؟", faq1a: "لا. DynamicNFC تعمل على تعزيز إدارة علاقات العملاء الخاص بك بالذكاء السلوكي من بوابات كبار الشخصيات.",
    faq2q: "هل هذا متوافق مع قوانين الخصوصية؟", faq2a: "نعم. النقر الفعلي على بطاقة الاتصال قريب المدى هو الموافقة المطلقة. الموافقة صريحة، الدعوات مقصودة، والوصول مُتحكم فيه.",
    faq3q: "ما هو مقياس نجاح التجربة؟", faq3a: "زيادة في عدد الزيارات المحجوزة بين المدعوين من كبار الشخصيات مقارنة بالمجموعة الضابطة. نقيس سرعة القرار، ليس مجرد النقرات.",
    faq4q: "هل يحتاج المشترون لتطبيق؟", faq4a: "لا. النقر أو مسح QR يفتح البوابة مباشرة في متصفح الهاتف — لا حاجة لتنزيل أي تطبيق.",
    faq5q: "ما مدة التجربة؟", faq5a: "90 يومًا من تسليم صندوق كبار الشخصيات. يشمل إعداد البوابة، إنتاج البطاقات، ومراجعة كاملة للأداء.",
    faq6q: "هل يمكن تخصيص البوابة لكل مشروع؟", faq6a: "نعم. كل مشروع تطوير يحصل على بوابة بعلامة تجارية خاصة مع وحدات مخصصة، مخططات طوابق، أسعار، ومحتوى ثنائي اللغة.",

    ctaTitle: 'مستعد لتسريع مبيعاتك؟',
    ctaSub: 'أنت لا توزع بطاقات NFC. أنت تُصدر دعوات خاصة — وتحوّل النية الرقمية إلى زخم مبيعات حقيقي.',
    ctaPrimary: 'ابدأ العرض المباشر',
    ctaSecondary: 'تحدث للمبيعات',

    footIndustries: 'القطاعات', footEnterprise: 'المؤسسات', footNfcCards: 'بطاقات NFC',
    footContact: 'تواصل مع المبيعات', footResources: 'الموارد',
    footLogin: 'تسجيل الدخول', footDev: 'المطورين', footRe: 'العقارات',
    footAutomotive: 'السيارات', footLiveDemo: 'عرض تجريبي مباشر',
    footCopy: '© ٢٠٢٦ DynamicNFC Card Inc. جميع الحقوق محفوظة.',
    footNote: 'المقر الرئيسي في فانكوفر، كندا. نخدم مطوري العقارات الفاخرة عالمياً.',
    ctaFinalPrimary: "إطلاق العرض التجريبي المباشر",
    ctaFinalSecondary: "التحدث مع المبيعات",
    ctaFinalSub: "شاهد العرض التوضيحي المباشر أو حدّد موعدًا لمكالمة استكشافية مع فريقنا.",
    ctaFinalTitle: "هل أنت مستعد لتسريع مبيعاتك؟",
    heroNote: "متوفر أيضًا لبطاقات الاتصال قريب المدى للمؤسسات وحلول الفرق",
},
};

/* ── SVG Icons ── */
const Arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const XMark = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>;
const Check = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

const ICONS = {
  key:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  chart:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  zap:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  globe:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  shield:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  maple:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L9.5 8.5 3 9l4.5 5L6 21l6-3 6 3-1.5-7L21 9l-6.5-.5z"/></svg>,
  nfc:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8"/></svg>,
  lock:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  link:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  cpu:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  building:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="8" y1="6" x2="8" y2="6.01"/><line x1="12" y1="6" x2="12" y2="6.01"/><line x1="16" y1="6" x2="16" y2="6.01"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/></svg>,
  home:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  card:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  star:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  users:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  pie:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
};

/* ── Sub-components ── */
function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`hp-faq-item${isOpen ? ' open' : ''}`} onClick={onClick}>
      <div className="hp-faq-q"><span>{question}</span>
        <svg className="hp-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div className="hp-faq-a"><p>{answer}</p></div>
    </div>
  );
}

function AnimatedCounter({ value, visible }) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!visible) return;
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) { setDisplay(value); return; }
    const target = parseFloat(numMatch[0]);
    const prefix = value.slice(0, value.indexOf(numMatch[0]));
    const suffix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length);
    const isDecimal = numMatch[0].includes('.');
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      const current = target * eased;
      setDisplay(prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix);
      if (step >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [visible, value]);
  return <>{display}</>;
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const statsRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  const [bgParticles] = useState(() =>
    Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${18 + Math.random() * 12}s`,
    }))
  );

  useEffect(() => {
    const els = document.querySelectorAll('.hp-rv');
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('hp-vis'); obs.unobserve(e.target); } }), { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    els.forEach((el) => obs.observe(el));
    const fallback = setTimeout(() => els.forEach((el) => el.classList.add('hp-vis')), 3000);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, [lang]);

  /* Hero entrance — trigger after FOUC guard clears */
  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* Scroll progress bar */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const h = document.documentElement;
          const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
          setScrollPct(Math.min(pct, 100));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Stats counter — trigger on scroll */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Scroll reveal observer (FIX 2) */
  useEffect(() => {
    const els = document.querySelectorAll('.hp-reveal, .hp-reveal-stagger');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const faqs = [
    { q: 'faq1q', a: 'faq1a' }, { q: 'faq2q', a: 'faq2a' }, { q: 'faq3q', a: 'faq3a' },
    { q: 'faq4q', a: 'faq4a' }, { q: 'faq5q', a: 'faq5a' }, { q: 'faq6q', a: 'faq6a' },
  ];

  return (
    <div className="hp" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title="Home" description="DynamicNFC — Turn anonymous traffic into named buyers with NFC-powered private portals." path="/" />

      {/* ════════ SCROLL PROGRESS ════════ */}
      <div className="hp-scroll-progress" style={{ width: `${scrollPct}%` }} />

      {/* Subtle floating particles */}
      <div className="hp-particles" aria-hidden="true">
        {bgParticles.map((p, i) => <div key={i} className="hp-particle" style={p} />)}
      </div>

      {/* Navbar is now global — rendered in App.jsx */}

      {/* ════════ HERO ════════ */}
      <section className={`hp-hero${heroReady ? ' animate' : ''}`}>
        <div className="hp-hero-bg" />
        <div className="hp-hero-inner">
          <div className="hp-hero-text">
            <div className="hp-badge"><span className="hp-pulse" />{t('badge')}</div>
            <h1>{t('heroLine1')}<br /><em>{t('heroLine2')}</em><br />{t('heroLine3')}</h1>
            <p>{t('heroSub1')}<strong>{t('heroSubB1')}</strong>{t('heroSub2')}<strong>{t('heroSubB2')}</strong>{t('heroSub3')}<strong>{t('heroSubB3')}</strong>{t('heroSub4')}<strong>{t('heroSubB4')}</strong>{t('heroSub5')}</p>
            <div className="hp-hero-ctas">
              <button onClick={() => navigate('/enterprise/crmdemo')} className="hp-btn red">{Arrow}{t('ctaPrimary')}</button>
              <button onClick={() => navigate('/contact-sales')} className="hp-btn ghost">{t('ctaSecondary')}</button>
            </div>
          </div>
          <div className="hp-hero-visual">
            <div className="hp-card-scene">
              <div className="hp-card-shadow" />
              <div className={`hp-card-flip${flipped ? ' flipped' : ''}`}
                onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}
                onClick={() => navigate('/nfc-cards')}>
                <div className="hp-card-face hp-card-front"><img src={cardFrontImg} alt="DynamicNFC Card" /></div>
                <div className="hp-card-face hp-card-back"><img src={cardBackImg} alt="DynamicNFC Card Back" /></div>
              </div>
            </div>
            <div className="hp-card-cta-row">
              <button onClick={() => navigate('/enterprise/crmdemo/khalid')} className="hp-card-explore">
                {t('cardCta')}
              </button>
            </div>
            <div className="hp-card-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              {t('cardHint')}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="hp-stats" ref={statsRef}>
        {[
          { v: t('stat1v'), l: t('stat1l'), c: 'red', ctx: t('stat1context') },
          { v: t('stat2v'), l: t('stat2l'), c: 'blue', ctx: t('stat2context') },
          { v: t('stat3v'), l: t('stat3l'), c: 'gold', ctx: t('stat3context') },
          { v: t('stat4v'), l: t('stat4l'), c: 'blue', ctx: t('stat4context') },
        ].map((s, i) => (
          <div className="hp-stat" key={i}>
            <span className={`hp-stat-v ${s.c}`}>
              <AnimatedCounter value={s.v} visible={statsVisible} />
            </span>
            <span className="hp-stat-l">{s.l}</span>
            <span className="hp-stat-ctx">{s.ctx}</span>
          </div>
        ))}
      </section>

      {/* ════════ TRUST STRIP ════════ */}
      <div className="hp-trust-strip">
        <span className="hp-trust-strip-label">{t('trustStrip')}</span>
        <div className="hp-trust-strip-items">
          {(TR[lang]?.trustStripInd || TR.en.trustStripInd).map((ind, i) => (
            <span className="hp-trust-strip-tag" key={i}>{ind}</span>
          ))}
        </div>
      </div>

      {/* ════════ OLD vs NEW ════════ */}
      <section className="hp-section hp-section-wide hp-rv hp-reveal">
        <div className="hp-section-header">
          <h2>{t('vsTitle')}</h2>
          <p className="hp-sub-italic">{t('vsSub')}</p>
        </div>
        <div className="hp-vs-grid">
          <div className="hp-vs-card old">
            <div className="hp-vs-header old">
              <span className="hp-vs-icon">✕</span>
              <h3>{t('vsOldTitle')}</h3>
            </div>
            <div className="hp-vs-items">
              {['vsOld1', 'vsOld2', 'vsOld3', 'vsOld4'].map((k, i) => (
                <div className="hp-vs-item old" key={i}>{XMark}<span>{t(k)}</span></div>
              ))}
            </div>
          </div>
          <div className="hp-vs-divider">
            <span>VS</span>
          </div>
          <div className="hp-vs-card new">
            <div className="hp-vs-header new">
              <span className="hp-vs-icon">✓</span>
              <h3>{t('vsNewTitle')}</h3>
            </div>
            <div className="hp-vs-items">
              {['vsNew1', 'vsNew2', 'vsNew3', 'vsNew4'].map((k, i) => (
                <div className="hp-vs-item new" key={i}>{Check}<span>{t(k)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="hp-section hp-section-wide hp-rv hp-reveal">
        <div className="hp-label gold">{t('howLabel')}</div>
        <div className="hp-section-header">
          <h2>{t('howTitle')}</h2>
          <p>{t('howSub')}</p>
        </div>
        <div className="hp-steps">
          {[
            { n: '01', k: 'step1', icon: ICONS.users },
            { n: '02', k: 'step2', icon: ICONS.card },
            { n: '03', k: 'step3', icon: ICONS.nfc },
            { n: '04', k: 'step4', icon: ICONS.chart },
          ].map((s, i) => (
            <div className="hp-step" key={i}>
              <div className="hp-step-num">{s.n}</div>
              {i < 3 && <div className="hp-step-line" />}
              <div className="hp-step-icon">{s.icon}</div>
              <h4>{t(s.k + 't')}</h4>
              <p>{t(s.k + 'd')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ LIVE DEMO ════════ */}
      <section className="hp-demo-section hp-rv hp-reveal">
        <div className="hp-demo-inner">
          <div className="hp-label white">{t('demoLabel')}</div>
          <div className="hp-section-header light">
            <h2>{t('demoTitle')}</h2>
            <p>{t('demoSub')}</p>
          </div>
          {/* Featured demos — büyük kartlar */}
          <div className="hp-demo-featured hp-reveal-stagger">
            {[
              { t: t('demoCard1'), d: t('demoCard1d'), path: '/enterprise/crmdemo/khalid', icon: ICONS.star, accent: '#C5A467' },
              { t: t('demoCard3'), d: t('demoCard3d'), path: '/automotive/demo/khalid', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><path d="M5 17h14M3 12l2-5h14l2 5M7 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>, accent: '#b8860b' },
            ].map((c, i) => (
              <Link to={c.path} className="hp-demo-card hp-demo-featured-card" key={i}>
                <div className="hp-demo-icon" style={{ background: `${c.accent}15`, color: c.accent }}>{c.icon}</div>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
                <span className="hp-demo-arrow" style={{ color: c.accent }}>→</span>
              </Link>
            ))}
          </div>

          {/* Secondary demos — küçük kartlar */}
          <div className="hp-demo-secondary hp-reveal-stagger">
            {[
              { t: t('demoCard2'), d: t('demoCard2d'), path: '/enterprise/crmdemo/ahmed', icon: ICONS.home, accent: '#2ec4b6' },
              { t: t('demoCard4'), d: t('demoCard4d'), path: '/automotive/dashboard', icon: ICONS.pie, accent: '#e63946' },
              { t: t('demoCard5'), d: t('demoCard5d'), path: '/enterprise/crmdemo/ai-demo', icon: ICONS.cpu, accent: '#8b5cf6' },
            ].map((c, i) => (
              <Link to={c.path} className="hp-demo-card hp-demo-secondary-card" key={i}>
                <div className="hp-demo-icon" style={{ background: `${c.accent}15`, color: c.accent }}>{c.icon}</div>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
                <span className="hp-demo-arrow" style={{ color: c.accent }}>→</span>
              </Link>
            ))}
          </div>
          <div className="hp-demo-cta">
            <button onClick={() => navigate('/enterprise/crmdemo')} className="hp-btn white-red">{Arrow}{t('demoCta')}</button>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIAL ════════ */}
      <section className="hp-section hp-section-wide hp-rv hp-reveal">
        <div className="hp-testimonial">
          <div className="hp-testimonial-label">{t('testimonialLabel')}</div>
          <blockquote className="hp-testimonial-quote">
            "{t('testimonialQuote')}"
          </blockquote>
          <div className="hp-testimonial-author">
            <div className="hp-testimonial-avatar">
              {t('testimonialName').split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>
            <div className="hp-testimonial-info">
              <strong>{t('testimonialName')}</strong>
              <span>{t('testimonialRole')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ INDUSTRY ════════ */}
      <section className="hp-section hp-rv hp-reveal">
        <div className="hp-label blue">{t('indLabel')}</div>
        <div className="hp-section-header">
          <h2>{t('indTitle')}</h2>
          <p>{t('indSub')}</p>
        </div>
        <div className="hp-ind-grid hp-reveal-stagger">
          {[
            { k: 'ind1', icon: ICONS.building, c: 'blue', nav: '/enterprise', featured: true },
            { k: 'ind2', icon: ICONS.home, c: 'red', nav: '/real-estate' },
            { k: 'ind3', icon: ICONS.card, c: 'gold', nav: '/nfc-cards' },
            { k: 'ind4', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28"><path d="M5 17h14M3 12l2-5h14l2 5M7 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>, c: 'red', nav: '/automotive' },
          ].map((ind, i) => (
            <div className={`hp-ind-card ${ind.c}${ind.featured ? ' featured' : ''}`} key={i} onClick={() => navigate(ind.nav)}>
              {ind.featured && <div className="hp-ind-featured">Primary Offering</div>}
              <div className={`hp-ind-icon ${ind.c}`}>{ind.icon}</div>
              <h3>{t(ind.k + 't')}</h3>
              <p>{t(ind.k + 'd')}</p>
              <div className="hp-ind-tags">
                {(TR[lang]?.[ind.k + 'tags'] || TR.en[ind.k + 'tags']).map((tag, j) => <span key={j}>{tag}</span>)}
              </div>
              <span className="hp-ind-cta">{t(ind.k + 'cta')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="hp-section hp-rv hp-reveal">
        <div className="hp-label red">{t('featLabel')}</div>
        <div className="hp-section-header">
          <h2>{t('featTitle')}</h2>
          <p>{t('featSub')}</p>
        </div>
        {/* Top 3 features — büyük kartlar */}
        <div className="hp-feat-primary hp-reveal-stagger">
          {[
            { k: 'feat1', icon: ICONS.key, c: 'red' },
            { k: 'feat2', icon: ICONS.chart, c: 'blue' },
            { k: 'feat3', icon: ICONS.zap, c: 'gold' },
          ].map((f, i) => (
            <div className="hp-feat hp-feat-big" key={i}>
              <div className={`hp-feat-icon ${f.c}`}>{f.icon}</div>
              <h4>{t(f.k + 't')}</h4>
              <p>{t(f.k + 'd')}</p>
            </div>
          ))}
        </div>

        {/* Secondary features — compact icon row */}
        <div className="hp-feat-secondary hp-reveal-stagger">
          {[
            { k: 'feat4', icon: ICONS.globe, c: 'blue' },
            { k: 'feat5', icon: ICONS.shield, c: 'red' },
            { k: 'feat6', icon: ICONS.maple, c: 'blue' },
          ].map((f, i) => (
            <div className="hp-feat-mini" key={i}>
              <div className={`hp-feat-mini-icon ${f.c}`}>{f.icon}</div>
              <div className="hp-feat-mini-text">
                <h4>{t(f.k + 't')}</h4>
                <p>{t(f.k + 'd')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ TRUST BAR ════════ */}
      <section className="hp-section hp-rv hp-reveal">
        <div className="hp-trust-grid hp-reveal-stagger">
          {[
            { k: 'trust1', icon: ICONS.lock },
            { k: 'trust2', icon: ICONS.nfc },
            { k: 'trust3', icon: ICONS.link },
            { k: 'trust4', icon: ICONS.cpu },
          ].map((tr, i) => (
            <div className="hp-trust" key={i}>
              <div className="hp-trust-icon">{tr.icon}</div>
              <h4>{t(tr.k + 't')}</h4>
              <p>{t(tr.k + 'd')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ PROCESS ════════ */}
      <section className="hp-section hp-section-wide hp-rv hp-reveal">
        <div className="hp-label blue">{t('procLabel')}</div>
        <div className="hp-section-header">
          <h2>{t('procTitle')}</h2>
          <p>{t('procSub')}</p>
        </div>
        <div className="hp-process-timeline">
          {[
            { n: '01', k: 'proc1', icon: ICONS.users },
            { n: '02', k: 'proc2', icon: ICONS.key },
            { n: '03', k: 'proc3', icon: ICONS.card },
            { n: '04', k: 'proc4', icon: ICONS.chart },
          ].map((s, i) => (
            <div className="hp-proc-step" key={i}>
              <div className="hp-proc-dot-col">
                <div className="hp-proc-dot">{s.n}</div>
                {i < 3 && <div className="hp-proc-line" />}
              </div>
              <div className="hp-proc-content">
                <div className="hp-proc-icon">{s.icon}</div>
                <h4>{t(s.k + 't')}</h4>
                <p>{t(s.k + 'd')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section className="hp-section hp-section-narrow hp-rv hp-reveal">
        <div className="hp-pricing">
          <div className="hp-label gold">{t('priceLabel')}</div>
          <h2>{t('priceTitle')}</h2>
          <p>{t('priceSub')}</p>
          <div className="hp-price-includes">
            <h4>{t('priceInc')}</h4>
            <ul className="hp-price-list">
              {['priceI1', 'priceI2', 'priceI3', 'priceI4', 'priceI5'].map((k, i) => (
                <li key={i}>{Check}<span>{t(k)}</span></li>
              ))}
            </ul>
          </div>
          <button onClick={() => navigate('/contact-sales')} className="hp-btn red">{Arrow}{t('priceCta')}</button>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="hp-section hp-section-narrow hp-rv hp-reveal">
        <div className="hp-section-header"><h2>{t('faqTitle')}</h2></div>
        <div className="hp-faq-list">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={t(f.q)} answer={t(f.a)} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="hp-cta-section hp-rv hp-reveal">
        <div className="hp-cta-inner">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSub')}</p>
          <div className="hp-cta-btns">
            <button onClick={() => navigate('/enterprise/crmdemo')} className="hp-btn white-red lg">{Arrow}{t('ctaPrimary')}</button>
            <button onClick={() => navigate('/contact-sales')} className="hp-btn ghost-light">{t('ctaSecondary')}</button>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand">
            <Link to="/"><img src="/assets/images/logo.png" alt="DynamicNFC" className="hp-footer-logo" /></Link>
            <p className="hp-footer-note">{t('footNote')}</p>
          </div>
          <div className="hp-footer-cols">
            <div className="hp-footer-col">
              <h5>{t('footIndustries')}</h5>
              <Link to="/enterprise">{t('footEnterprise')}</Link>
              <Link to="/developers">{t('footDev')}</Link>
              <Link to="/real-estate">{t('footRe')}</Link>
              <Link to="/automotive">{t('footAutomotive')}</Link>
              <Link to="/nfc-cards">{t('footNfcCards')}</Link>
            </div>
            <div className="hp-footer-col">
              <h5>{t('footResources')}</h5>
              <Link to="/enterprise/crmdemo">{t('footLiveDemo')}</Link>
              <Link to="/contact-sales">{t('footContact')}</Link>
              <Link to="/login">{t('footLogin')}</Link>
            </div>
          </div>
        </div>
        <div className="hp-footer-bottom"><p>{t('footCopy')}</p></div>
      </footer>
    </div>
  );
}
