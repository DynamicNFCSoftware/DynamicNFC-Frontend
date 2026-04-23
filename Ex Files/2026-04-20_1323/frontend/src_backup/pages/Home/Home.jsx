import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './Home.css';
import SEO from '../../components/SEO/SEO';

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

    /* Stats */
    stat1v: '47%',  stat1l: 'Higher Engagement', stat1ctx: 'VIP cardholders vs anonymous traffic',
    stat2v: '3.2×', stat2l: 'Conversion Rate',   stat2ctx: 'Named prospects vs cold outreach',
    stat3v: '< 48h', stat3l: 'Decision Speed',   stat3ctx: 'From first tap to booked viewing',
    stat4v: '100%', stat4l: 'Identified Visitors', stat4ctx: 'Every tap linked to a named VIP',

    /* ROI CTA */
    roiBadge: 'SALES VELOCITY TOOL',
    roiTitle: 'How much revenue would <em>100</em> VIP invitations generate?',
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
    faq6a: 'Yes. Each project gets its own branded portal with custom units, floor plans, pricing, and bilingual content.',

    /* Final CTA */
    ctaTitle: 'Ready to Accelerate Your Sales?',
    ctaSub: 'You\'re not handing out NFC cards. You\'re issuing private invitations — and turning digital intent into real sales momentum.',
    ctaPrimary: 'Launch Live Demo',
    ctaSecondary: 'Talk to Sales',

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
    heroLine1: 'نقرة واحدة.', heroLine2: 'مشترٍ معروف.', heroLine3: 'صفقة مغلقة.',
    heroSub1: 'بطاقات NFC فاخرة تحوّل زوار الموقع المجهولين إلى ', heroSubB1: 'عملاء VIP معروفين',
    heroSub2: ' — مع ', heroSubB2: 'بوابات خاصة', heroSub3: ' و', heroSubB3: 'ذكاء سلوكي',
    heroSub4: ' و', heroSubB4: 'محفزات مبيعات فورية', heroSub5: '.',
    cardCta: 'شاهد ما يراه خالد عندما ينقر →', cardHint: 'هذا هو مفتاح وصول كبار الشخصيات',

    stat1v: "47%", stat1l: "مشاركة أعلى", stat1ctx: 'حاملو بطاقات VIP مقابل الزوار المجهولين',
    stat2v: "3.2×", stat2l: "معدل التحويل", stat2ctx: 'العملاء المعروفون مقابل التواصل البارد',
    stat3v: "< 48 ساعة", stat3l: "سرعة القرار", stat3ctx: 'من أول نقرة إلى حجز الزيارة',
    stat4v: '١٠٠٪', stat4l: 'زوار معرّفون', stat4ctx: 'كل نقرة مرتبطة بعميل VIP',

    roiBadge: 'أداة سرعة المبيعات',
    roiTitle: 'كم من الإيرادات ستولدها <em>١٠٠</em> دعوة VIP؟',
    roiDesc: 'أدخل أرقام مشروعك — شاهد التأثير المتوقع على المعاينات والتحويل وخط المبيعات في الوقت الفعلي.',
    roiBtn: 'احسب عائدك',

    howLabel: 'كيف يعمل', howTitle: 'من الصندوق الفاخر إلى الإجراء المحجوز',
    howSub: 'عملية من ٤ خطوات تحوّل النية الرقمية إلى زخم مبيعات حقيقي — عبر القطاعات.',
    step1t: 'اختيار VIP', step1d: 'يختار فريق مبيعاتك العملاء ذوي القيمة العالية ويخصص بطاقة NFC.',
    step2t: 'توصيل مميز', step2d: 'يتلقى العملاء صندوقاً فاخراً مع مفتاح VIP ودعوة شخصية.',
    step3t: 'المس واستكشف', step3d: 'نقرة واحدة تفتح بوابتهم الخاصة — محتوى مخصص، أسعار، أدوات حجز، وعروض حصرية.',
    step4t: 'ذكاء المبيعات', step4d: 'كل تفاعل يغذي لوحة التحكم لحظياً. فريقك يعرف بالضبط متى ولماذا يتصل.',

    demoLabel: 'عروض مباشرة', demoTitle: "مشاهدة التطبيق عملياً",
    demoSub: "استكشف العروض المباشرة عبر العقارات والسيارات — بوابات VIP، الأسواق، ولوحات الذكاء.",
    demoCard1: "عقارات — مستثمر VIP", demoCard1d: "خالد الرشيد — مشتري بنتهاوس مع تحليلات ROI",
    demoCard2: "عقارات — مشتري عائلي", demoCard2d: "أحمد الفهد — عائلة مع تركيز على المدارس والمجتمع",
    demoCard3: "سيارات — صالة عرض VIP", demoCard3d: "خالد المنصوري — AMG GT 63 S مع أداة تكوين وحجز تجربة قيادة",
    demoCard4: "سيارات — لوحة تحكم الوكيل", demoCard4d: "بريستيج موتورز — ذكاء سلوك VIP، تحليلات الموديلات، ومحفزات المبيعات",
    demoCard5: 'خط مبيعات الذكاء الاصطناعي', demoCard5d: 'شاهد الذكاء الاصطناعي ينسق Canva وGmail والتقويم وDocuSign مباشرة — قابل للتحقق',
    demoCta: "إطلاق العرض التجريبي الكامل",

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

    faqTitle: "الأسئلة المتكررة",
    faq1q: "هل هذا يحل محل إدارة علاقات العملاء؟", faq1a: "لا. DynamicNFC تعمل على تعزيز إدارة علاقات العملاء بالذكاء السلوكي من بوابات VIP.",
    faq2q: "هل هذا متوافق مع قوانين الخصوصية؟", faq2a: "نعم. النقر الفعلي على بطاقة NFC هو الموافقة المطلقة.",
    faq3q: "ما هو مقياس نجاح التجربة؟", faq3a: "زيادة في عدد الزيارات المحجوزة بين المدعوين من VIP مقارنة بالمجموعة الضابطة.",
    faq4q: "هل يحتاج المشترون لتطبيق؟", faq4a: "لا. النقر أو مسح QR يفتح البوابة مباشرة في متصفح الهاتف.",
    faq5q: "ما مدة التجربة؟", faq5a: "90 يوماً من تسليم صندوق VIP. يشمل إعداد البوابة وإنتاج البطاقات ومراجعة كاملة للأداء.",
    faq6q: "هل يمكن تخصيص البوابة لكل مشروع؟", faq6a: "نعم. كل مشروع يحصل على بوابة بعلامة تجارية خاصة مع وحدات مخصصة ومحتوى ثنائي اللغة.",

    ctaTitle: 'مستعد لتسريع مبيعاتك؟',
    ctaSub: 'أنت لا توزع بطاقات NFC. أنت تُصدر دعوات خاصة — وتحوّل النية الرقمية إلى زخم مبيعات حقيقي.',
    ctaPrimary: 'ابدأ العرض المباشر', ctaSecondary: 'تحدث للمبيعات',

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
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / 40, 3);
      setDisplay(prefix + (isDecimal ? (target * eased).toFixed(1) : Math.round(target * eased)) + suffix);
      if (step >= 40) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, value]);
  return <>{display}</>;
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
  const [flipped, setFlipped] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const statsRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  const [bgParticles] = useState(() =>
    Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`, animationDuration: `${18 + Math.random() * 12}s`,
    }))
  );

  useEffect(() => { setTimeout(() => setHeroReady(true), 100); }, []);

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
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
      <div className="hp-scroll-progress" style={{ width: `${scrollPct}%` }} />
      <div className="hp-particles" aria-hidden="true">
        {bgParticles.map((p, i) => <div key={i} className="hp-particle" style={p} />)}
      </div>

      {/* ═══ 1. HERO ═══ */}
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
              <button onClick={() => navigate('/enterprise/crmdemo/khalid')} className="hp-card-explore">{t('cardCta')}</button>
            </div>
            <div className="hp-card-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              {t('cardHint')}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. STATS ═══ */}
      <section className="hp-stats" ref={statsRef}>
        {[
          { v: t('stat1v'), l: t('stat1l'), c: 'red', ctx: t('stat1ctx') },
          { v: t('stat2v'), l: t('stat2l'), c: 'blue', ctx: t('stat2ctx') },
          { v: t('stat3v'), l: t('stat3l'), c: 'gold', ctx: t('stat3ctx') },
          { v: t('stat4v'), l: t('stat4l'), c: 'blue', ctx: t('stat4ctx') },
        ].map((s, i) => (
          <div className="hp-stat" key={i}>
            <span className={`hp-stat-v ${s.c}`}><AnimatedCounter value={s.v} visible={statsVisible} /></span>
            <span className="hp-stat-l">{s.l}</span>
            <span className="hp-stat-ctx">{s.ctx}</span>
          </div>
        ))}
      </section>

      {/* ═══ 3. ROI CALCULATOR CTA ═══ */}
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
            <h3 dangerouslySetInnerHTML={{ __html: t('roiTitle') }} />
            <p>{t('roiDesc')}</p>
          </div>
          <Link to="/sales/roi-calculator" className="re-roi-banner-btn">
            {t('roiBtn')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ═══ 4. HOW IT WORKS ═══ */}
      <section className="hp-section hp-section-wide hp-reveal">
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

      {/* ═══ 5. LIVE DEMO ═══ */}
      <section className="hp-demo-section hp-reveal">
        <div className="hp-demo-inner">
          <div className="hp-label white">{t('demoLabel')}</div>
          <div className="hp-section-header light">
            <h2>{t('demoTitle')}</h2>
            <p>{t('demoSub')}</p>
          </div>
          <div className="hp-demo-featured hp-reveal-stagger">
            {[
              { t: t('demoCard1'), d: t('demoCard1d'), path: '/enterprise/crmdemo/khalid', icon: ICONS.star, accent: '#C5A467' },
              { t: t('demoCard3'), d: t('demoCard3d'), path: '/automotive/demo/khalid', icon: ICONS.car, accent: '#b8860b' },
            ].map((c, i) => (
              <Link to={c.path} className="hp-demo-card hp-demo-featured-card" key={i}>
                <div className="hp-demo-icon" style={{ background: `${c.accent}15`, color: c.accent }}>{c.icon}</div>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
                <span className="hp-demo-arrow" style={{ color: c.accent }}>→</span>
              </Link>
            ))}
          </div>
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

      {/* ═══ 6. INDUSTRIES ═══ */}
      <section className="hp-section hp-reveal">
        <div className="hp-label blue">{t('indLabel')}</div>
        <div className="hp-section-header">
          <h2>{t('indTitle')}</h2>
          <p>{t('indSub')}</p>
        </div>
        <div className="hp-ind-grid hp-reveal-stagger">
          {[
            { k: 'ind1', icon: ICONS.building, c: 'blue', nav: '/developers' },
            { k: 'ind2', icon: ICONS.home, c: 'red', nav: '/real-estate' },
            { k: 'ind3', icon: ICONS.card, c: 'gold', nav: '/nfc-cards' },
            { k: 'ind4', icon: ICONS.car, c: 'red', nav: '/automotive' },
          ].map((ind, i) => (
            <div className={`hp-ind-card ${ind.c}`} key={i} onClick={() => navigate(ind.nav)}>
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

      {/* ═══ 7. TESTIMONIAL + FAQ ═══ */}
      <section className="hp-section hp-section-wide hp-reveal">
        <div className="hp-testimonial">
          <div className="hp-testimonial-label">{t('testimonialLabel')}</div>
          <blockquote className="hp-testimonial-quote">"{t('testimonialQuote')}"</blockquote>
          <div className="hp-testimonial-author">
            <div className="hp-testimonial-avatar">{t('testimonialName').split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
            <div className="hp-testimonial-info">
              <strong>{t('testimonialName')}</strong>
              <span>{t('testimonialRole')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-section hp-section-narrow hp-reveal">
        <div className="hp-section-header"><h2>{t('faqTitle')}</h2></div>
        <div className="hp-faq-list">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={t(f.q)} answer={t(f.a)} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* ═══ 8. FINAL CTA ═══ */}
      <section className="hp-cta-section hp-reveal">
        <div className="hp-cta-inner">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSub')}</p>
          <div className="hp-cta-btns">
            <button onClick={() => navigate('/enterprise/crmdemo')} className="hp-btn white-red lg">{Arrow}{t('ctaPrimary')}</button>
            <button onClick={() => navigate('/contact-sales')} className="hp-btn ghost-light">{t('ctaSecondary')}</button>
          </div>
        </div>
      </section>

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
