import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { initRemoteConfig, getConfigValue } from '../../firebase';
import './Home.css';
import SEO from '../../components/SEO/SEO';
import '../../i18n/pages/home';

import cardFrontImg from '../NFCCards/Assets/card-front.jpg';
import cardBackImg  from '../NFCCards/Assets/card-back.jpg';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR) — Trimmed to 8 sections
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    /* Badge */
    badge: 'Sales Velocity Engine',

    /* Hero */
    heroLine1: 'Your next buyer',
    heroLine2: 'already has a name.',
    heroLine3: '',
    heroSub: 'NFC cards that show you exactly who your buyers are',
    heroSubWords: ['name', 'interest', 'intent'],
    cardCta: 'See what Khalid sees when he taps →',
    cardHint: 'This is your VIP Access Key',

    /* Stats */
    stat1v: 'Named',  stat1l: 'Visitors', stat1ctx: 'Every tap is linked to a real person',
    stat2v: 'Intent', stat2l: 'Scoring',   stat2ctx: 'See who\'s ready to buy, not just browsing',
    stat3v: 'Real-Time', stat3l: 'Alerts',   stat3ctx: 'Know the moment a prospect re-engages',
    stat4v: 'Zero', stat4l: 'Guesswork', stat4ctx: 'No anonymous traffic — only named VIPs',

    /* ROI CTA */
    roiBadge: 'SALES VELOCITY TOOL',
    roiTitle1: 'How much revenue would ', roiTitle2: '100', roiTitle3: ' VIP invitations generate?',
    roiDesc: 'Plug in your project numbers — see the projected impact on viewings, conversion, and sales pipeline in real time.',
    roiBtn: 'Calculate Your ROI',

    /* How It Works */
    howLabel: 'How it works',
    howTitle: 'From Premium Box to Booked Action',
    howSub: 'A 4-step process that turns digital intent into real sales momentum — across industries.',
    step1t: 'VIP Selection',     step1d: 'Your sales team selects high-value prospects and assigns a personalized NFC card.',
    step2t: 'Premium Delivery',  step2d: 'Prospects receive a premium box with their VIP Access Key and a personal invitation.',
    step3t: 'Tap & Explore',     step3d: 'One tap opens their private portal — curated content, pricing, booking tools, and exclusive offers.',
    step4t: 'Sales Intelligence', step4d: 'Every interaction feeds the dashboard in real-time. Your team knows exactly when and why to call.',

    /* Live Demo */
    demoLabel: 'Live demos',
    demoTitle: 'See It In Action',
    demoSub: 'Step into the buyer\'s shoes. Experience what your VIP prospects see when they tap.',
    demoRe: 'Real Estate',
    demoRed: 'See how a VIP buyer explores penthouses, compares ROI, and books a private viewing — all from one tap.',
    demoReTag1: 'VIP Portal', demoReTag2: 'ROI Analytics', demoReTag3: 'Booking',
    demoAuto: 'Automotive',
    demoAutod: 'See how a showroom guest configures their dream car, books a test drive, and gets a personalized follow-up.',
    demoAutoTag1: 'VIP Showroom', demoAutoTag2: 'Configurator', demoAutoTag3: 'Test Drive',
    demoCta: 'Launch the full demo',

    /* Industries */
    indLabel: 'Industries',
    indTitle: 'Built For Your Industry',
    indSub: 'Specialized paths, one platform.',
    ind1t: 'Real Estate Developers',
    ind1d: 'VIP buyer portals, behavioral analytics, CRM intelligence. Turn every launch into a data-driven sales engine.',
    ind1cta: 'Developer Solutions →',
    ind1tags: ['VIP Portals', 'Behavioral Analytics', 'CRM Integration', 'Payment Plans'],
    ind2t: 'Real Estate Agents',
    ind2d: 'Agent cards, listing links, lead capture at open houses, QR sign-in, and broker-level brand control.',
    ind2cta: 'Agent Solutions →',
    ind2tags: ['Agent Cards', 'Lead Capture', 'Open House QR', 'Broker Control'],
    ind3t: 'Enterprise NFC Cards',
    ind3d: 'Premium metal, 24K gold, bamboo, PVC cards with custom encoding. Bulk orders, team provisioning, worldwide fulfillment.',
    ind3cta: 'Enterprise Cards →',
    ind3tags: ['Metal & Gold', 'Bulk Orders', 'Team Management', 'Analytics'],
    ind4t: 'Automotive Dealerships',
    ind4d: 'VIP showroom portals, test drive intelligence, vehicle configurator, and buyer intent signals for luxury dealerships.',
    ind4cta: 'Automotive Solutions →',
    ind4tags: ['VIP Showroom', 'Test Drive Intel', 'Configurator', 'Dealer Dashboard'],

    /* Testimonial */
    testimonialLabel: 'Pilot Program Result',
    testimonialQuote: 'Within 3 weeks of deploying DynamicNFC cards, we identified 14 high-intent buyers we would have never known about. Two penthouses sold directly from VIP portal interactions.',
    testimonialName: 'Khalid Al-Rashid',
    testimonialRole: 'VP of Sales, Prestige Developments',

    /* FAQ */
    faqTitle: 'FAQ',
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
    faq6a: 'Yes. Each project gets its own branded portal with custom units, floor plans, pricing, and bilingual content.',
    faq7q: 'How much does it cost?',
    faq7a: 'Pricing is pilot-based. It depends on card quantity, portal complexity, and integrations. We\'ll scope it on a call.',
    faq8q: 'How fast can we launch?',
    faq8a: 'Most pilots go live within 2 weeks. Card production takes 5-7 business days, portal setup runs in parallel.',
    faq9q: 'What CRMs do you integrate with?',
    faq9a: 'Salesforce, HubSpot, Zoho, and any CRM with an API. We push lead data and behavioral signals directly.',
    faq10q: 'What card materials are available?',
    faq10a: 'PVC, premium metal, 24K gold, bamboo, and carbon fiber. All NFC-enabled with custom encoding and branding.',

    /* AI Section */
    aiBadge: 'WHAT FIRES AFTER THE TAP',
    aiTitle: 'Four platforms. Zero manual work.',
    aiSub: 'Khalid taps his NFC card. In under a minute, these four things happen without anyone lifting a finger.',
    aiCard1t: 'Canva', aiCard1d: 'A 7-page investment proposal gets designed on the spot — his name, his unit, ROI numbers, floor plans.',
    aiCard1ex: 'Gulf-luxury layout, bilingual EN/AR, exported as PDF.',
    aiCard2t: 'Gmail', aiCard2d: 'The proposal gets attached to a personal invite email and lands in Khalid\'s inbox automatically.',
    aiCard2ex: 'Real Gmail draft — open it yourself to verify.',
    aiCard3t: 'Calendar', aiCard3d: 'The system checks who\'s free, picks the best slot, and books a private showing at the sales center.',
    aiCard3ex: 'Real Google Calendar event with reminders set.',
    aiCard4t: 'DocuSign', aiCard4d: 'An NDA gets sent before the showing. Khalid signs, exclusive pre-launch pricing unlocks in his portal.',
    aiCard4ex: 'Pre-filled, ready for e-signature, pricing auto-unlocks.',
    aiCta: 'See the full pipeline in action →',

    /* UI labels */
    demoCardCta: 'Try the demo →',
    poweredBy: 'Powered by',
    tabOverview: 'Overview', tabActivity: 'Activity', tabAnalytics: 'Analytics',
    tryItYourself: 'Try it yourself',

    /* Final CTA */
    ctaTitle: 'See it work with your own numbers.',
    ctaSub: 'We\'ll walk you through the full pipeline using your project data. No pitch deck — just your numbers.',
    ctaPrimary: 'Launch Live Demo',
    ctaSecondary: 'Book a Walkthrough',

    /* Footer */
    footIndustries: 'Industries', footEnterprise: 'Enterprise', footNfcCards: 'NFC Cards',
    footContact: 'Contact Sales', footResources: 'Resources',
    footLogin: 'Log in', footDev: 'Developers', footRe: 'Real Estate',
    footAutomotive: 'Automotive', footLiveDemo: 'Live Demo',
    footCopy: '© 2026 DynamicNFC Card Inc. All Rights Reserved.',
    footNote: 'Headquartered in Vancouver, Canada. Serving luxury real estate developers globally.',
  },
  ar: {
    badge: "محرك سرعة المبيعات",
    heroLine1: 'مشتريك القادم', heroLine2: 'لديه اسم بالفعل.', heroLine3: '',
    heroSub: 'بطاقات NFC تُظهر لك بالضبط من هم مشتروك',
    heroSubWords: ['الاسم', 'الاهتمام', 'النية'],
    cardCta: 'شاهد ما يراه خالد عندما ينقر →', cardHint: 'هذا هو مفتاح وصول كبار الشخصيات',

    stat1v: 'زوار', stat1l: 'معرّفون', stat1ctx: 'كل نقرة مرتبطة بشخص حقيقي',
    stat2v: 'تقييم', stat2l: 'النية', stat2ctx: 'اعرف من مستعد للشراء، ليس فقط التصفح',
    stat3v: 'تنبيهات', stat3l: 'فورية', stat3ctx: 'اعرف لحظة عودة العميل المحتمل',
    stat4v: 'بلا', stat4l: 'تخمين', stat4ctx: 'لا زوار مجهولون — فقط عملاء VIP معرّفون',

    roiBadge: 'أداة سرعة المبيعات',
    roiTitle1: 'كم من الإيرادات ستولدها ', roiTitle2: '١٠٠', roiTitle3: ' دعوة VIP؟',
    roiDesc: 'أدخل أرقام مشروعك — شاهد التأثير المتوقع على المعاينات والتحويل وخط المبيعات في الوقت الفعلي.',
    roiBtn: 'احسب عائدك',

    howLabel: 'كيف يعمل', howTitle: 'من الصندوق الفاخر إلى الإجراء المحجوز',
    howSub: 'عملية من ٤ خطوات تحوّل النية الرقمية إلى زخم مبيعات حقيقي — عبر القطاعات.',
    step1t: 'اختيار VIP', step1d: 'يختار فريق مبيعاتك العملاء ذوي القيمة العالية ويخصص بطاقة NFC.',
    step2t: 'توصيل مميز', step2d: 'يتلقى العملاء صندوقاً فاخراً مع مفتاح VIP ودعوة شخصية.',
    step3t: 'المس واستكشف', step3d: 'نقرة واحدة تفتح بوابتهم الخاصة — محتوى مخصص، أسعار، أدوات حجز، وعروض حصرية.',
    step4t: 'ذكاء المبيعات', step4d: 'كل تفاعل يغذي لوحة التحكم لحظياً. فريقك يعرف بالضبط متى ولماذا يتصل.',

    demoLabel: 'عروض مباشرة', demoTitle: "مشاهدة التطبيق عملياً",
    demoSub: "ادخل مكان المشتري. اختبر ما يراه عملاؤك المميزون عند النقر.",
    demoRe: 'العقارات',
    demoRed: 'شاهد كيف يستكشف مشتري VIP البنتهاوس، يقارن العائد، ويحجز معاينة خاصة — كل ذلك بنقرة واحدة.',
    demoReTag1: 'بوابة VIP', demoReTag2: 'تحليلات العائد', demoReTag3: 'حجز',
    demoAuto: 'السيارات',
    demoAutod: 'شاهد كيف يُخصص ضيف صالة العرض سيارة أحلامه، يحجز تجربة قيادة، ويحصل على متابعة مخصصة.',
    demoAutoTag1: 'صالة عرض VIP', demoAutoTag2: 'أداة التكوين', demoAutoTag3: 'تجربة قيادة',
    demoCta: 'ابدأ العرض الكامل',

    indLabel: 'القطاعات', indTitle: "مصممة لصناعتك", indSub: "مسارات متخصصة، منصة واحدة",
    ind1t: "مطورو العقارات", ind1d: "بوابات مشتري VIP، تحليلات سلوكية، ذكاء CRM. حوّل كل إطلاق إلى محرك مبيعات.",
    ind1cta: "حلول للمطورين", ind1tags: ['بوابات VIP', 'تحليلات سلوكية', 'تكامل CRM', 'خطط الدفع'],
    ind2t: "وكلاء العقارات", ind2d: "بطاقات الوكلاء، التقاط العملاء في المعارض، أوراق تسجيل QR، والتحكم بالعلامة التجارية.",
    ind2cta: "حلول للوكلاء", ind2tags: ['بطاقات الوكلاء', 'التقاط العملاء', 'QR للمعارض', 'تحكم الوسيط'],
    ind3t: "بطاقات NFC للمؤسسات", ind3d: "بطاقات معدنية فاخرة، ذهب 24 قيراط، خشب بامبو، وبطاقات PVC مع ترميز مخصص.",
    ind3cta: "بطاقات المؤسسات", ind3tags: ['معدن وذهب', 'طلبات جماعية', 'إدارة الفرق', 'تحليلات'],
    ind4t: 'وكلاء السيارات', ind4d: 'بوابات صالة عرض VIP، ذكاء تجربة القيادة، أداة التكوين، وإشارات نية المشتري.',
    ind4cta: 'حلول السيارات →', ind4tags: ['صالة عرض VIP', 'ذكاء التجربة', 'أداة التكوين', 'لوحة الوكيل'],

    testimonialLabel: 'نتيجة البرنامج التجريبي',
    testimonialQuote: 'خلال 3 أسابيع من نشر بطاقات DynamicNFC، حددنا 14 مشترياً ذوي نية عالية لم نكن لنعرفهم أبداً. تم بيع شقتين بنتهاوس مباشرة من تفاعلات بوابة VIP.',
    testimonialName: 'خالد الرشيد', testimonialRole: 'نائب رئيس المبيعات، بريستيج للتطوير',

    faqTitle: 'الأسئلة الشائعة',
    faq1q: "هل هذا يحل محل إدارة علاقات العملاء؟", faq1a: "لا. DynamicNFC تعمل على تعزيز إدارة علاقات العملاء بالذكاء السلوكي من بوابات VIP.",
    faq2q: "هل هذا متوافق مع قوانين الخصوصية؟", faq2a: "نعم. النقر الفعلي على بطاقة NFC هو الموافقة المطلقة.",
    faq3q: "ما هو مقياس نجاح التجربة؟", faq3a: "زيادة في عدد الزيارات المحجوزة بين المدعوين من VIP مقارنة بالمجموعة الضابطة.",
    faq4q: "هل يحتاج المشترون لتطبيق؟", faq4a: "لا. النقر أو مسح QR يفتح البوابة مباشرة في متصفح الهاتف.",
    faq5q: "ما مدة التجربة؟", faq5a: "90 يوماً من تسليم صندوق VIP. يشمل إعداد البوابة وإنتاج البطاقات ومراجعة كاملة للأداء.",
    faq6q: "هل يمكن تخصيص البوابة لكل مشروع؟", faq6a: "نعم. كل مشروع يحصل على بوابة بعلامة تجارية خاصة مع وحدات مخصصة ومحتوى ثنائي اللغة.",
    faq7q: 'كم التكلفة؟', faq7a: 'التسعير يعتمد على التجربة. يتحدد حسب كمية البطاقات وتعقيد البوابة والتكاملات. نحدده معك في مكالمة.',
    faq8q: 'كم يستغرق الإطلاق؟', faq8a: 'معظم التجارب تبدأ خلال أسبوعين. إنتاج البطاقات يستغرق 5-7 أيام عمل، وإعداد البوابة يسير بالتوازي.',
    faq9q: 'ما أنظمة CRM المدعومة؟', faq9a: 'Salesforce وHubSpot وZoho وأي نظام CRM لديه API. نرسل بيانات العملاء والإشارات السلوكية مباشرة.',
    faq10q: 'ما المواد المتاحة للبطاقات؟', faq10a: 'PVC، معدن فاخر، ذهب 24 قيراط، بامبو، وألياف كربون. جميعها مزودة بـ NFC مع ترميز وعلامة تجارية مخصصة.',

    aiBadge: 'ماذا يحدث بعد النقرة',
    aiTitle: 'أربع منصات. بلا أي عمل يدوي.',
    aiSub: 'خالد ينقر بطاقة NFC. خلال أقل من دقيقة، هذه الأشياء الأربعة تحدث بدون أن يرفع أحد إصبعه.',
    aiCard1t: 'Canva', aiCard1d: 'عرض استثماري من 7 صفحات يُصمَّم فوراً — اسمه، وحدته، أرقام العائد، والمخططات.',
    aiCard1ex: 'تصميم فاخر خليجي، ثنائي اللغة، يُصدَّر كـ PDF.',
    aiCard2t: 'Gmail', aiCard2d: 'العرض يُرفق ببريد دعوة شخصي ويصل إلى بريد خالد تلقائياً.',
    aiCard2ex: 'مسودة Gmail حقيقية — افتحها بنفسك للتحقق.',
    aiCard3t: 'Calendar', aiCard3d: 'النظام يتحقق من الأوقات المتاحة، يختار الأنسب، ويحجز معاينة خاصة.',
    aiCard3ex: 'حدث Google Calendar حقيقي مع تذكيرات.',
    aiCard4t: 'DocuSign', aiCard4d: 'يُرسَل عقد سرية قبل المعاينة. خالد يوقّع، والأسعار الحصرية تُفتح في بوابته.',
    aiCard4ex: 'معبأ مسبقاً، جاهز للتوقيع الإلكتروني، الأسعار تُفتح تلقائياً.',
    aiCta: 'شاهد كامل سير العمل →',

    demoCardCta: 'جرّب العرض →',
    poweredBy: 'مدعوم بـ',
    tabOverview: 'نظرة عامة', tabActivity: 'النشاط', tabAnalytics: 'التحليلات',
    tryItYourself: 'جرّبه بنفسك',

    ctaTitle: 'شاهد كيف يعمل بأرقام مشروعك.',
    ctaSub: 'سنعرض لك كامل سير العمل باستخدام بيانات مشروعك. بلا عروض تقديمية — فقط أرقامك.',
    ctaPrimary: 'ابدأ العرض المباشر', ctaSecondary: 'احجز جولة تعريفية',

    footIndustries: 'القطاعات', footEnterprise: 'المؤسسات', footNfcCards: 'بطاقات NFC',
    footContact: 'تواصل مع المبيعات', footResources: 'الموارد',
    footLogin: 'تسجيل الدخول', footDev: 'المطورين', footRe: 'العقارات',
    footAutomotive: 'السيارات', footLiveDemo: 'عرض تجريبي مباشر',
    footCopy: '© ٢٠٢٦ DynamicNFC Card Inc. جميع الحقوق محفوظة.',
    footNote: 'المقر الرئيسي في فانكوفر، كندا. نخدم مطوري العقارات الفاخرة عالمياً.',
  },
};

/* ── SVG Icons ── */
const Arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const Check = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

const ICONS = {
  chart:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  nfc:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8"/></svg>,
  users:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  card:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  star:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  pie:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  home:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cpu:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  building:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="8" y1="6" x2="8" y2="6.01"/><line x1="12" y1="6" x2="12" y2="6.01"/><line x1="16" y1="6" x2="16" y2="6.01"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/></svg>,
  car:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><path d="M5 17h14M3 12l2-5h14l2 5M7 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>,
};

/* ── Sub-components ── */
function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`hp-faq-item${isOpen ? ' open' : ''}`} onClick={onClick}
      role="button" tabIndex={0} aria-expanded={isOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}>
      <div className="hp-faq-q"><span>{question}</span>
        <svg className="hp-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div className="hp-faq-a"><p>{answer}</p></div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   MAIN PAGE — 8 Sections
   1. Hero  2. Stats  3. ROI CTA  4. How It Works
   5. Live Demo  6. Industries  7. Testimonial+FAQ  8. Final CTA
   ═══════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [abCta, setAbCta] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await initRemoteConfig();
        if (cancelled) return;
        const val = getConfigValue('hero_cta_text');
        if (val) setAbCta(val);
      } catch {
        // Ignore remote config failures (UI should still work).
      }
    };

    // Defer remote config to reduce main-thread work during initial paint.
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(run, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mql) return;

    const apply = () => setPrefersReducedMotion(!!mql.matches);
    apply();

    // Safari fallback: addListener/removeListener
    const onChange = () => apply();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener?.(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener?.(onChange);
    };
  }, []);

  const [scrollPct, setScrollPct] = useState(0);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  const [bgParticles, setBgParticles] = useState([]);
  useEffect(() => {
    if (prefersReducedMotion) {
      setBgParticles([]);
      return;
    }

    const count = window.innerWidth < 520 ? 12 : 20;
    setBgParticles(
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${18 + Math.random() * 12}s`,
      }))
    );
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setHeroReady(true);
      return;
    }
    const id = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(id);
  }, [prefersReducedMotion]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(() => {
        const h = document.documentElement;
        setScrollPct(Math.min(h.scrollTop / (h.scrollHeight - h.clientHeight) * 100, 100));
        ticking = false;
      }); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  useEffect(() => {
    const els = document.querySelectorAll('.hp-reveal, .hp-reveal-stagger');
    if (prefersReducedMotion) {
      // Instantly reveal content for users who prefer reduced motion.
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    // Fallback: if IntersectionObserver is unavailable, reveal everything.
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    // Failsafe: even if the observer never fires (browser quirks / extensions),
    // reveal everything shortly after first paint.
    const forceRevealId = window.setTimeout(() => {
      els.forEach(el => el.classList.add('visible'));
    }, 1200);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => {
      window.clearTimeout(forceRevealId);
      obs.disconnect();
    };
  }, [prefersReducedMotion]);

  const faqsLeft = [
    { q: 'faq1q', a: 'faq1a' }, { q: 'faq2q', a: 'faq2a' }, { q: 'faq3q', a: 'faq3a' },
    { q: 'faq4q', a: 'faq4a' }, { q: 'faq5q', a: 'faq5a' },
  ];
  const faqsRight = [
    { q: 'faq6q', a: 'faq6a' }, { q: 'faq7q', a: 'faq7a' }, { q: 'faq8q', a: 'faq8a' },
    { q: 'faq9q', a: 'faq9a' }, { q: 'faq10q', a: 'faq10a' },
  ];

  // ── Section components (refactor only; no UI/logic changes) ──
  const HeroSection = () => (
    <section className={`hp-hero${heroReady ? ' animate' : ''}`}>
      <div className="hp-hero-bg" />
      <div className="hp-hero-inner">
        <div className="hp-hero-text">
          <div className="hp-badge"><span className="hp-pulse" />{t('badge')}</div>
          <h1>{t('heroLine1')}<br /><em>{t('heroLine2')}</em></h1>
          <p>
            {t('heroSub')}
            {isRTL ? ' — بـ' : ' — by '}
            {(TR[lang]?.heroSubWords || TR.en.heroSubWords).map((w, i, arr) => (
              <React.Fragment key={i}>
                <strong>{w}</strong>
                {i < arr.length - 1 ? (isRTL ? '، بـ' : ', by ') : '.'}
              </React.Fragment>
            ))}
          </p>
          <div className="hp-hero-ctas">
            <button onClick={() => navigate('/enterprise/crmdemo/dashboard')} className="hp-btn red">{Arrow}{t('ctaPrimary')}</button>
            <button onClick={() => navigate('/contact-sales')} className="hp-btn ghost">{t('ctaSecondary')}</button>
          </div>
        </div>
        <div className="hp-hero-visual">
          <div className="hp-card-scene">
            <div className="hp-card-shadow" />
            <div
              className={`hp-card-flip${flipped ? ' flipped' : ''}`}
              onClick={() => setFlipped(f => !f)}
            >
              <div className="hp-card-face hp-card-front">
                <img src={cardFrontImg} alt="DynamicNFC Card" loading="eager" decoding="async" />
              </div>
              <div className="hp-card-face hp-card-back">
                <img src={cardBackImg} alt="DynamicNFC Card Back" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
          <div className="hp-card-cta-row">
            <button onClick={() => navigate('/enterprise/crmdemo/khalid')} className="hp-card-explore">{t('cardCta')}</button>
          </div>
          <div className="hp-card-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            {t('cardHint')}
          </div>
        </div>
      </div>
    </section>
  );

  const SocialProofSection = () => (
    <div className="hp-social-proof">
      <span>{isRTL ? '🇨🇦 صُنع في كندا' : '🇨🇦 Built in Canada'}</span>
      <span className="hp-sp-dot">·</span>
      <span>{isRTL ? '✦ 14 مشتري VIP محدد في أول تجربة' : '✦ 14 VIP buyers identified in first pilot'}</span>
      <span className="hp-sp-dot">·</span>
      <span>{isRTL ? '🇦🇪 تجربة في الخليج' : '🇦🇪 Piloting in the Gulf'}</span>
    </div>
  );

  const ProductShowcaseSection = () => (
    <section className="hp-showcase hp-reveal">
      <div className="hp-showcase-inner">
        <div className="hp-showcase-text">
          <h2>{isRTL ? 'هذا ما يراه فريق مبيعاتك' : 'This is what your sales team sees.'}</h2>
          <p>{isRTL ? 'كل نقرة، كل زيارة، كل نية شراء — في لوحة تحكم واحدة.' : 'Every tap, every visit, every buying signal — in one dashboard.'}</p>
          <button className="hp-btn red" onClick={() => navigate('/enterprise/crmdemo/dashboard')}>{Arrow}{isRTL ? 'استكشف لوحة التحكم' : 'Explore the dashboard'}</button>
        </div>
        <div className="hp-showcase-browser">
          <div className="hp-browser-bar">
            <div className="hp-browser-dots"><span /><span /><span /></div>
            <div className="hp-browser-url">dynamicnfc.ca/dashboard</div>
          </div>
          <div className="hp-browser-tabs">
            <button className={`hp-browser-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>{t('tabOverview')}</button>
            <button className={`hp-browser-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>{t('tabActivity')}</button>
            <button className={`hp-browser-tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>{t('tabAnalytics')}</button>
          </div>
          <div className="hp-browser-body">
            <img
              src={activeTab === 1 ? '/assets/images/dashboard-activity.png' : activeTab === 2 ? '/assets/images/dashboard-analytics.png' : '/assets/images/dashboard-overview.png'}
              alt="DynamicNFC Dashboard"
              className="hp-browser-img"
            />
          </div>
        </div>
      </div>
    </section>
  );

  const RoiBannerSection = () => (
    <section className="re-roi-banner hp-reveal">
      <div className="re-roi-banner-glow" />
      <div className="re-roi-banner-content">
        <div className="re-roi-banner-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="14" width="4" height="6" rx="1" fill="currentColor" opacity="0.2" />
            <rect x="10" y="10" width="4" height="10" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="17" y="6" width="4" height="14" rx="1" fill="currentColor" opacity="0.4" />
          </svg>
        </div>
        <div className="re-roi-banner-text">
          <span className="re-roi-banner-badge">{t('roiBadge')}</span>
          <h3>{t('roiTitle1')}<em>{t('roiTitle2')}</em>{t('roiTitle3')}</h3>
          <p>{t('roiDesc')}</p>
        </div>
        <Link to="/sales/roi-calculator" className="re-roi-banner-btn">
          {t('roiBtn')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </section>
  );

  const HowItWorksSection = () => (
    <section className="hp-section hp-section-wide hp-reveal">
      <div className="hp-label gold">{t('howLabel')}</div>
      <div className="hp-section-header">
        <h2>{t('howTitle')}</h2>
        <p>{t('howSub')}</p>
      </div>
      <div className="hp-steps">
        {[
          { n: '01', k: 'step1', icon: ICONS.users, color: 'mint' },
          { n: '02', k: 'step2', icon: ICONS.card, color: 'blue' },
          { n: '03', k: 'step3', icon: ICONS.nfc, color: 'yellow' },
          { n: '04', k: 'step4', icon: ICONS.chart, color: 'accent' },
        ].map((s, i) => (
          <div className={`hp-step hp-step-${s.color}`} key={i}>
            <div className="hp-step-visual">
              <span className="hp-step-bg-num">{s.n}</span>
              <div className="hp-step-orb">{s.icon}<div className="hp-step-glow" /></div>
            </div>
            {i < 3 && <div className="hp-step-line" />}
            <h4>{t(s.k + 't')}</h4>
            <p>{t(s.k + 'd')}</p>
          </div>
        ))}
      </div>

      {/* Divider — transition to pipeline */}
      <div className="hp-how-divider">
        <div className="hp-how-divider-line" />
        <span className="hp-how-divider-text">{t('aiBadge')}</span>
        <div className="hp-how-divider-line" />
      </div>

      {/* Powered-by logo bar */}
      <div className="hp-powered-bar">
        <span className="hp-powered-label">{t('poweredBy')}</span>
        <div className="hp-powered-logos">
          <div className="hp-powered-logo canva">
            <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="#00C4CC"/><text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="sans-serif">C</text></svg>
            <span>Canva</span>
          </div>
          <div className="hp-powered-logo gmail">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M2 6l10 7 10-7v12H2z" fill="#fff" stroke="#EA4335" strokeWidth="1.5"/><path d="M22 6L12 13 2 6" fill="none" stroke="#EA4335" strokeWidth="2"/></svg>
            <span>Gmail</span>
          </div>
          <div className="hp-powered-logo gcal">
            <svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" fill="#fff" stroke="#4285F4" strokeWidth="1.5"/><rect x="3" y="4" width="18" height="5" rx="2" fill="#4285F4"/><line x1="8" y1="2" x2="8" y2="6" stroke="#4285F4" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="#4285F4" strokeWidth="2"/></svg>
            <span>Calendar</span>
          </div>
          <div className="hp-powered-logo docusign">
            <svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="3" fill="#FFC829"/><path d="M8 12l3 3 5-6" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>DocuSign</span>
          </div>
        </div>
      </div>

      {/* Pipeline strip */}
      <div className="hp-pipeline hp-reveal-stagger">
        {[
          { tk: 'aiCard1', color: 'canva',
            logo: <svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="22" fill="#00C4CC"/><text x="24" y="32" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700" fontFamily="sans-serif">C</text></svg> },
          { tk: 'aiCard2', color: 'gmail',
            logo: <svg viewBox="0 0 48 48" width="40" height="40"><path d="M6 10h36v28H6z" fill="#fff"/><path d="M42 10L24 26 6 10" fill="#EA4335"/><rect x="6" y="10" width="8" height="28" fill="#4285F4"/><rect x="34" y="10" width="8" height="28" fill="#34A853"/><path d="M6 10l18 14 18-14" fill="none" stroke="#c5221f" strokeWidth="2.5"/></svg> },
          { tk: 'aiCard3', color: 'gcal',
            logo: <svg viewBox="0 0 48 48" width="40" height="40"><rect x="6" y="10" width="36" height="34" rx="4" fill="#fff" stroke="#4285F4" strokeWidth="2.5"/><rect x="6" y="10" width="36" height="10" rx="4" fill="#4285F4"/><line x1="16" y1="6" x2="16" y2="14" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="6" x2="32" y2="14" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/><circle cx="18" cy="30" r="2.5" fill="#34A853"/><circle cx="30" cy="30" r="2.5" fill="#EA4335"/><circle cx="18" cy="38" r="2.5" fill="#FBBC04"/><circle cx="30" cy="38" r="2.5" fill="#4285F4"/></svg> },
          { tk: 'aiCard4', color: 'docusign',
            logo: <svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="4" width="40" height="40" rx="8" fill="#FFC829"/><path d="M16 24l6 6 10-12" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> },
        ].map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="hp-pipe-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            )}
            <div className={`hp-pipe-card hp-pipe-${c.color}`}>
              <div className="hp-pipe-logo">{c.logo}</div>
              <h4>{t(c.tk + 't')}</h4>
              <p>{t(c.tk + 'd')}</p>
              <div className="hp-pipe-ex">
                <span>{t(c.tk + 'ex')}</span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <button className="hp-btn hp-ai-cta" onClick={() => navigate('/enterprise/crmdemo/ai-demo')}>{t('aiCta')}</button>
      </div>
    </section>
  );

  const LiveDemoSection = () => (
    <section className="hp-demo-section hp-reveal">
      <div className="hp-demo-inner">
        <div className="hp-label white">{t('demoLabel')}</div>
        <div className="hp-section-header light">
          <h2>{t('demoTitle')}</h2>
          <p>{t('demoSub')}</p>
        </div>
        <div className="hp-demo-grid hp-reveal-stagger">
          <Link to="/enterprise/crmdemo/dashboard" className="hp-demo-sector-card">
            <div className="hp-demo-sector-icon" style={{ background: 'rgba(197,164,103,0.15)', color: '#C5A467' }}>{ICONS.star}</div>
            <h3>{t('demoRe')}</h3>
            <p>{t('demoRed')}</p>
            <div className="hp-demo-tags">
              <span>{t('demoReTag1')}</span><span>{t('demoReTag2')}</span><span>{t('demoReTag3')}</span>
            </div>
            <span className="hp-demo-sector-cta">{t('demoCardCta')}</span>
          </Link>
          <Link to="/automotive/dashboard" className="hp-demo-sector-card">
            <div className="hp-demo-sector-icon" style={{ background: 'rgba(229,115,115,0.15)', color: '#E57373' }}>{ICONS.car}</div>
            <h3>{t('demoAuto')}</h3>
            <p>{t('demoAutod')}</p>
            <div className="hp-demo-tags">
              <span>{t('demoAutoTag1')}</span><span>{t('demoAutoTag2')}</span><span>{t('demoAutoTag3')}</span>
            </div>
            <span className="hp-demo-sector-cta">{t('demoCardCta')}</span>
          </Link>
        </div>
      </div>
    </section>
  );

  const IndustriesSection = () => (
    <section className="hp-section hp-reveal">
      <div className="hp-label blue">{t('indLabel')}</div>
      <div className="hp-section-header">
        <h2>{t('indTitle')}</h2>
        <p>{t('indSub')}</p>
      </div>
      <div className="hp-ind-grid hp-reveal-stagger">
        {[
          { k: 'ind1', icon: ICONS.building, c: 'blue', nav: '/developers', demo: '/enterprise/crmdemo/dashboard' },
          { k: 'ind2', icon: ICONS.home, c: 'red', nav: '/real-estate' },
          { k: 'ind3', icon: ICONS.card, c: 'gold', nav: '/nfc-cards' },
          { k: 'ind4', icon: ICONS.car, c: 'red', nav: '/automotive', demo: '/automotive/dashboard' },
        ].map((ind, i) => (
          <div
            className={`hp-ind-card ${ind.c}`}
            key={i}
            onClick={() => navigate(ind.nav)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(ind.nav); } }}
          >
            <div className={`hp-ind-icon ${ind.c}`}>{ind.icon}</div>
            <h3>{t(ind.k + 't')}</h3>
            <p>{t(ind.k + 'd')}</p>
            <div className="hp-ind-tags">
              {(TR[lang]?.[ind.k + 'tags'] || TR.en[ind.k + 'tags']).map((tag, j) => <span key={j}>{tag}</span>)}
            </div>
            <div className="hp-ind-cta-row">
              <span className="hp-ind-cta">{t(ind.k + 'cta')}</span>
              {ind.demo && (
                <Link
                  to={ind.demo}
                  className="hp-ind-demo-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isRTL ? 'جرّب العرض →' : 'Try demo →'}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const TestimonialSection = () => (
    <section className="hp-section hp-section-narrow hp-reveal">
      <div className="hp-testimonial">
        <span className="hp-testimonial-label">{t('testimonialLabel')}</span>
        <blockquote className="hp-testimonial-quote">"{t('testimonialQuote')}"</blockquote>
        <div className="hp-testimonial-author">
          <div className="hp-testimonial-avatar">KR</div>
          <div className="hp-testimonial-info">
            <strong>{t('testimonialName')}</strong>
            <span>{t('testimonialRole')}</span>
          </div>
        </div>
      </div>
    </section>
  );

  const FaqSection = () => (
    <section className="hp-section hp-section-wide hp-reveal">
      <div className="hp-section-header"><h2>{t('faqTitle')}</h2></div>
      <div className="hp-faq-grid">
        <div className="hp-faq-col">
          {faqsLeft.map((f, i) => (
            <FAQItem
              key={i}
              question={t(f.q)}
              answer={t(f.a)}
              isOpen={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
        <div className="hp-faq-col">
          {faqsRight.map((f, i) => {
            const idx = i + 5;
            return (
              <FAQItem
                key={idx}
                question={t(f.q)}
                answer={t(f.a)}
                isOpen={openFaq === idx}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );

  const FinalCtaSection = () => (
    <section className="hp-cta-section hp-reveal">
      <div className="hp-cta-inner">
        <h2>{t('ctaTitle')}</h2>
        <p>{t('ctaSub')}</p>
        <div className="hp-cta-btns">
          <button onClick={() => navigate('/contact-sales')} className="hp-btn white-red lg">{Arrow}{t('ctaSecondary')}</button>
          <button onClick={() => navigate('/enterprise/crmdemo/dashboard')} className="hp-btn ghost-light">{t('tryItYourself')}</button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="hp" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title="Home" description="DynamicNFC — Turn anonymous traffic into named buyers with NFC-powered private portals." path="/" />
      <div className="hp-scroll-progress" style={{ width: `${scrollPct}%` }} />
      <div className="hp-particles" aria-hidden="true">
        {bgParticles.map((p, i) => <div key={i} className="hp-particle" style={p} />)}
      </div>

      {/* ═══ 1-3: HERO / SOCIAL PROOF / SHOWCASE / ROI ── */}
      <HeroSection />
      <SocialProofSection />
      <ProductShowcaseSection />
      <RoiBannerSection />

      <HowItWorksSection />

      {/* ═══ 5-6: LIVE DEMO & INDUSTRIES ── */}
      <LiveDemoSection />

      {/* ═══ 6. INDUSTRIES ═══ */}
      <IndustriesSection />

      {/* ═══ 7. TESTIMONIAL ═══ */}
      <TestimonialSection />

      {/* ═══ 8. FAQ ═══ */}
      <FaqSection />

      {/* ═══ 8. FINAL CTA ═══ */}
      <FinalCtaSection />

      {/* ═══ FOOTER ═══ */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand">
            <Link to="/"><img src="/assets/images/logo.png" alt="DynamicNFC" className="hp-footer-logo" /></Link>
            <p className="hp-footer-note">{t('footNote')}</p>
          </div>
          <div className="hp-footer-cols">
            <div className="hp-footer-col">
              <h5>{t('footIndustries')}</h5>
              <Link to="/developers">{t('footDev')}</Link>
              <Link to="/real-estate">{t('footRe')}</Link>
              <Link to="/automotive">{t('footAutomotive')}</Link>
              <Link to="/nfc-cards">{t('footNfcCards')}</Link>
            </div>
            <div className="hp-footer-col">
              <h5>{t('footResources')}</h5>
              <Link to="/enterprise/crmdemo/dashboard">{t('footLiveDemo')}</Link>
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
