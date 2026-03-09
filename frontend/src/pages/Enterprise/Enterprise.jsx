import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Enterprise.css';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR) — Full enterprise copy
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    navChallenge:'The Challenge', navHow:'How It Works', navDemo:'Live Demo', navImpact:'Impact', navPilot:'Request a Pilot',
    heroBadge:'Enterprise Sales Velocity Engine',
    heroTitle:'Turn Anonymous Visitors Into Booked Viewings',
    heroSub:'DynamicNFC transforms premium NFC cards into private buyer portals — bridging the gap between anonymous digital traffic and named, high-intent prospects ready to commit across mega-developments and branded residences.',
    statConversion:'Conversion Rate', statDecision:'Faster Decision Cycle', statIdentified:'Identified Visitors',
    heroCtaPilot:'Request a Pilot →', heroCtaDemo:'See the Live Demo',

    probLabel:'The Blind Spot', probTitle:'Your Sales Team Is Operating Without Context',
    probQuote:'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options online. Yet when sales teams engage, they lack the one critical thing that closes deals: <strong style="color:var(--red)">context.</strong>',
    prob1Icon:'🏙️', prob1Title:'Anonymous Traffic', prob1Desc:'97% of your website visitors leave without ever identifying themselves — across every project launch',
    prob2Icon:'⏳', prob2Title:'Delayed Follow-ups', prob2Desc:'Sales teams reach out too late, with no insight into which units, payment plans, or amenities prospects explored',
    prob3Icon:'📋', prob3Title:'Generic Conversations', prob3Desc:'Every prospect gets the same pitch — whether they\'re an investor seeking ROI or a family seeking community',

    shiftLabel:'The Shift', shiftTitle:'From Brochure Website to Private Invitation',
    shiftDesc:'What if you stopped treating the website as a public brochure — and started treating it as a private experience for selected prospects?',
    oldLabel:'The Old Way', oldTitle:'Generic Website', oldDesc:'Everyone sees the same thing. Anonymous visitors. Zero context for your sales team.',
    old1:'Anonymous traffic', old2:'One-size-fits-all content', old3:'No behavioral signals', old4:'Cold follow-ups',
    newLabel:'The Dynamic Way', newTitle:'Private VIP Experience', newDesc:'Each VIP Access Key unlocks a personalized portal. Identity precedes action.',
    new1:'Named, identified visitors', new2:'Persona-tailored content', new3:'Real-time behavioral signals', new4:'Contextual, timely outreach',

    howLabel:'The Process', howTitle:'From Premium Box to Booked Viewing',
    howDesc:'Selected prospects receive a premium box containing a VIP Access Key — an NFC-enabled card with a personal message. The experience unfolds from there.',
    step1Title:'VIP Selection', step1Desc:'Your sales team selects high-value prospects and assigns a personalized NFC card linked to their profile.',
    step2Title:'Premium Delivery', step2Desc:'Prospects receive a premium box with a VIP Access Key and personal invitation: "This card unlocks a private experience created for you."',
    step3Title:'Tap & Explore', step3Desc:'One tap opens their private portal — tailored floor plans, pricing, amenities, and booking tools, all linked to their identity.',
    step4Title:'Behavioral Intelligence', step4Desc:'Every interaction — floor plan views, pricing requests, viewing bookings — feeds your dashboard in real time.',

    idLabel:'The Key Difference', idTitle:'Same Website. Same Actions. Different Intelligence.', idTagline:'Identity is the multiplier.',
    idVipLabel:'VIP Access Key Holder', idVipTitle:'Named Prospect — Khalid Al-Rashid',
    idVipDesc:'You know he viewed the Skyline Penthouse three times, downloaded the ROI brochure, and spent 8 minutes on payment plans. Your sales team calls with context, timing, and the right offer.',
    idVip1:'Personal Follow-ups', idVip2:'Tailored Incentives', idVip3:'Concierge Sales', idVip4:'Named Intelligence',
    idAnonLabel:'Anonymous Website Visitor', idAnonTitle:'Unknown — Segment Data Only',
    idAnonDesc:"Someone visited the penthouse page. You don't know who, how many times, or what else they explored. The lead sits in a queue with hundreds of others.",
    idAnon1:'Segment-level Data', idAnon2:'Generic Outreach', idAnon3:'Marketing Optimization', idAnon4:'No Named Signals',

    demoLabel:'Live Demo', demoTitle:'See It In Action — Vista Residences',
    demoDesc:'Explore our fully functional demo environment. Four portals show how DynamicNFC transforms the same project into four distinct experiences — from VIP investors to anonymous browsers.',
    demoBadge1:'★ VIP Investor', demoCard1Title:'Khalid Al-Rashid Portal',
    demoCard1Desc:'Elite investor experience with ROI-focused content, high-floor penthouse showcases, and investment analytics.',
    demoBadge2:'🏠 Family Buyer', demoCard2Title:'Ahmed Al-Fahad Portal',
    demoCard2Desc:'Premium homebuyer experience highlighting family-friendly 3BR units, school districts, and community amenities.',
    demoBadge3:'🌐 Public Access', demoCard3Title:'Global Marketplace',
    demoCard3Desc:'Anonymous and registered user browsing experience with adaptive content based on engagement signals.',
    demoBadge4:'📊 Analytics', demoCard4Title:'Corporate Dashboard — Behavioral Intelligence',
    demoCard4Desc:'Real-time engagement metrics, lead scoring, conversion funnels, and A/B testing. See how every tap feeds your sales pipeline.',
    demoBadge5:'🤖 AI Engine', demoCard5Title:'AI Sales Pipeline — Live MCP Demo',
    demoCard5Desc:'Watch AI orchestrate Gmail, Google Calendar, and DocuSign in real-time. Every action is verifiable — click to confirm in your own accounts.',
    demoCta:'Explore Full Demo →',

    roiLabel:'Why This Matters', roiTitle:"This Is Not About Clicks. It's About Sales Velocity.",
    roiDesc:'Success is measured by one thing: how fast prospects move from first tap to booked viewing to signed deal.',
    roiFlow1:'100 VIP Invitations', roiFlow2:'Private Digital Access', roiFlow3:'High-Intent Signals',
    roiFlow4:'Sales Prioritization', roiFlow5:'More Booked Viewings', roiFlow6:'Higher Close Rate',
    roiMetric1Label:'Higher Conversion Rate', roiMetric1Sub:'VIP invitees vs. anonymous website traffic',
    roiMetric2Label:'Faster Decision Cycle', roiMetric2Sub:'From first tap to booked viewing',
    roiMetric3Label:'Identified Engagement', roiMetric3Sub:'Every tap is linked to a named prospect',

    trustLabel:'Built for Enterprise', trustTitle:'Privacy-First. CRM-Integrated. Zero Friction.',
    trust1Icon:'🔒', trust1Title:'Consent by Design', trust1Desc:'The physical tap is the ultimate opt-in. Consent is explicit, invitations are intentional, access is controlled.',
    trust2Icon:'📱', trust2Title:'NFC + QR Fallback', trust2Desc:'NFC for instant access. QR codes for universal compatibility. No app downloads required.',
    trust3Icon:'🔗', trust3Title:'CRM Integration', trust3Desc:"Sits on top of your existing systems. Enhances your CRM with behavioral intelligence — doesn't replace it.",
    trust4Icon:'🤖', trust4Title:'AI Personalization', trust4Desc:"Content adapts dynamically to each prospect's interests, stage, and engagement history.",

    faqLabel:'Questions Executives Ask', faqTitle:'Addressed Before You Ask Them',
    faq1Q:'Is this replacing our website or CRM?',
    faq1A:'No. DynamicNFC is a layer that sits on top of your existing systems. Your website keeps working. Your CRM keeps working. We enhance both with identity-linked behavioral intelligence that neither can capture alone.',
    faq2Q:'How do we measure pilot success?',
    faq2A:'One metric: increase in booked viewings among VIP invitees versus your control group. Not clicks, not pageviews — real sales activity.',
    faq3Q:'What about data privacy and compliance?',
    faq3A:"Consent is baked into the physical experience. When a prospect taps a card they intentionally received, that's explicit opt-in. No dark patterns, no hidden tracking. The tap is the consent.",
    faq4Q:'What does the prospect actually receive?',
    faq4A:'A premium box with an NFC-enabled VIP Access Key and a personal message. Not a marketing flyer — a private invitation.',
    faq5Q:'How fast can we deploy?',
    faq5A:'A pilot program can launch within 2–4 weeks. We configure your portals, design the premium box experience, program the NFC cards, and connect the analytics dashboard.',
    faq6Q:"What's the real ROI here?",
    faq6A:'It\'s about cutting the time from "Interested" to "Viewing" in half. When your sales team engages at the right moment with the right context, decisions accelerate.',

    ctaLabel:'Ready to Deploy',
    ctaTitle:"You're Not Handing Out NFC Cards. You're Issuing Private Invitations.",
    ctaDesc:'Turn digital intent into real sales momentum. Start a pilot with 100 VIP invitations and measure the difference in booked viewings within 30 days.',
    ctaPilot:'Request a Pilot Program →', ctaDemo:'Explore the Live Demo',

    modalTitle:'Request a Pilot Program', modalSub:"Tell us about your development and we'll design a custom pilot program — 100 VIP invitations, full analytics dashboard, and measurable results within 30 days.",
    modalSec1:'Contact Information', modalSec2:'Company & Role', modalSec3:'Project Details', modalSec4:'Current Challenges',
    modalSubmit:'Submit Pilot Request →', modalSubmitting:'Submitting...',
    modalNote:'We respond within 24 hours. Your information is kept strictly confidential.',
    successTitle:'Pilot Request Submitted',
    successDesc:'Thank you. Our enterprise team will review your project details and reach out within 24 hours to design your custom pilot program.',
    successClose:'Close',
    footerText:'© 2025 DynamicNFC — Sales Velocity Engine for Real Estate Developers',
  },
  ar: {
    navChallenge:'التحدي', navHow:'كيف يعمل', navDemo:'عرض مباشر', navImpact:'التأثير', navPilot:'طلب تجربة',
    heroBadge:'محرك تسريع المبيعات للمؤسسات',
    heroTitle:'حوّل الزوار المجهولين إلى معاينات محجوزة',
    heroSub:'تحوّل DynamicNFC بطاقات NFC المميزة إلى بوابات مشترين خاصة — تسد الفجوة بين حركة المرور الرقمية المجهولة والعملاء المحتملين المعروفين ذوي النية العالية.',
    statConversion:'معدل التحويل', statDecision:'دورة قرار أسرع', statIdentified:'زوار معرّفون',
    heroCtaPilot:'طلب تجربة تجريبية →', heroCtaDemo:'شاهد العرض المباشر',
    probLabel:'النقطة العمياء', probTitle:'فريق مبيعاتك يعمل بدون سياق',
    probQuote:'يقضي مشتروك الأكثر اهتماماً أسابيع في استكشاف المخططات والأسعار وخيارات الدفع عبر الإنترنت. لكن عندما تتواصل فرق المبيعات، ينقصها الشيء الحاسم: <strong style="color:var(--red)">السياق.</strong>',
    prob1Icon:'🏙️', prob1Title:'حركة مرور مجهولة', prob1Desc:'٩٧٪ من زوار موقعك يغادرون دون تعريف أنفسهم',
    prob2Icon:'⏳', prob2Title:'متابعات متأخرة', prob2Desc:'فرق المبيعات تتواصل متأخرة، بدون معرفة ما استكشفه العملاء',
    prob3Icon:'📋', prob3Title:'محادثات عامة', prob3Desc:'كل عميل يحصل على نفس العرض — سواء كان مستثمراً أو عائلة',
    shiftLabel:'التحوّل', shiftTitle:'من موقع كتيّب إلى دعوة خاصة',
    shiftDesc:'ماذا لو توقفت عن معاملة الموقع ككتيّب عام وبدأت بمعاملته كتجربة خاصة؟',
    oldLabel:'الطريقة القديمة', oldTitle:'موقع عام', oldDesc:'الجميع يرى نفس الشيء. زوار مجهولون.',
    old1:'حركة مرور مجهولة', old2:'محتوى واحد للجميع', old3:'لا إشارات سلوكية', old4:'متابعات باردة',
    newLabel:'طريقة DynamicNFC', newTitle:'تجربة VIP خاصة', newDesc:'كل مفتاح VIP يفتح بوابة مخصصة. الهوية تسبق الفعل.',
    new1:'زوار معرّفون بالاسم', new2:'محتوى مخصص', new3:'إشارات سلوكية لحظية', new4:'تواصل سياقي',
    howLabel:'العملية', howTitle:'من الصندوق المميز إلى المعاينة المحجوزة',
    howDesc:'يتلقى العملاء المختارون صندوقاً مميزاً يحتوي على مفتاح VIP — بطاقة NFC مع رسالة شخصية.',
    step1Title:'اختيار VIP', step1Desc:'يختار فريق مبيعاتك العملاء ذوي القيمة العالية ويخصص بطاقة NFC شخصية.',
    step2Title:'توصيل مميز', step2Desc:'يتلقى العملاء صندوقاً مميزاً مع مفتاح VIP ودعوة شخصية.',
    step3Title:'المس واستكشف', step3Desc:'لمسة واحدة تفتح بوابتهم الخاصة — مخططات وأسعار ومرافق وأدوات حجز.',
    step4Title:'ذكاء سلوكي', step4Desc:'كل تفاعل يغذي لوحة التحكم لحظياً.',
    idLabel:'الفرق الجوهري', idTitle:'نفس الموقع. نفس الإجراءات. ذكاء مختلف.', idTagline:'الهوية هي المضاعف.',
    idVipLabel:'حامل مفتاح VIP', idVipTitle:'عميل معروف — خالد الراشد',
    idVipDesc:'تعلم أنه شاهد البنتهاوس ثلاث مرات وحمّل كتيب العائد الاستثماري وقضى ٨ دقائق على خطط الدفع.',
    idVip1:'متابعات شخصية', idVip2:'حوافز مخصصة', idVip3:'مبيعات كونسيرج', idVip4:'ذكاء مُسمّى',
    idAnonLabel:'زائر موقع مجهول', idAnonTitle:'مجهول — بيانات شريحة فقط',
    idAnonDesc:'شخص ما زار صفحة البنتهاوس. لا تعرف من هو أو ماذا استكشف.',
    idAnon1:'بيانات شريحة', idAnon2:'تواصل عام', idAnon3:'تحسين التسويق', idAnon4:'لا إشارات مُسمّاة',
    demoLabel:'عرض مباشر', demoTitle:'شاهدها تعمل — فيستا ريزيدنسز',
    demoDesc:'استكشف بيئة العرض الكاملة. أربع بوابات توضح كيف تحوّل DynamicNFC نفس المشروع إلى أربع تجارب مختلفة.',
    demoBadge1:'★ مستثمر VIP', demoCard1Title:'بوابة جين دو', demoCard1Desc:'تجربة مستثمر نخبوية مع محتوى يركز على العائد الاستثماري.',
    demoBadge2:'🏠 مشترٍ عائلي', demoCard2Title:'بوابة جون سميث', demoCard2Desc:'تجربة مشترٍ مميزة تبرز وحدات عائلية.',
    demoBadge3:'🌐 وصول عام', demoCard3Title:'السوق العالمي', demoCard3Desc:'تجربة تصفح متكيفة.',
    demoBadge4:'📊 التحليلات', demoCard4Title:'لوحة التحكم المؤسسية', demoCard4Desc:'مقاييس تفاعل لحظية وتقييم عملاء ومسارات تحويل.',
    demoBadge5:'🤖 محرك الذكاء', demoCard5Title:'خط أنابيب المبيعات بالذكاء الاصطناعي',
    demoCard5Desc:'شاهد الذكاء الاصطناعي ينسق Gmail وGoogle Calendar وDocuSign في الوقت الفعلي. كل إجراء قابل للتحقق.',
    demoCta:'استكشف العرض الكامل →',
    roiLabel:'لماذا هذا مهم', roiTitle:'ليس عن النقرات. بل عن سرعة المبيعات.',
    roiDesc:'النجاح يُقاس بسرعة انتقال العملاء من أول لمسة إلى معاينة محجوزة.',
    roiFlow1:'١٠٠ دعوة VIP', roiFlow2:'وصول رقمي خاص', roiFlow3:'إشارات نية عالية',
    roiFlow4:'أولوية المبيعات', roiFlow5:'معاينات أكثر', roiFlow6:'معدل إغلاق أعلى',
    roiMetric1Label:'معدل تحويل أعلى', roiMetric1Sub:'مدعوّو VIP مقابل حركة الموقع',
    roiMetric2Label:'دورة قرار أسرع', roiMetric2Sub:'من أول لمسة إلى معاينة',
    roiMetric3Label:'تفاعل معرّف', roiMetric3Sub:'كل لمسة مرتبطة بعميل مُسمّى',
    trustLabel:'مبني للمؤسسات', trustTitle:'الخصوصية أولاً. متكامل مع CRM. بدون احتكاك.',
    trust1Icon:'🔒', trust1Title:'موافقة بالتصميم', trust1Desc:'اللمسة الفعلية هي أقصى اشتراك.',
    trust2Icon:'📱', trust2Title:'NFC + رمز QR', trust2Desc:'NFC للوصول الفوري. QR للتوافق الشامل.',
    trust3Icon:'🔗', trust3Title:'تكامل CRM', trust3Desc:'يعمل فوق أنظمتك الحالية.',
    trust4Icon:'🤖', trust4Title:'تخصيص بالذكاء الاصطناعي', trust4Desc:'المحتوى يتكيف ديناميكياً مع كل عميل.',
    faqLabel:'أسئلة التنفيذيين', faqTitle:'أُجيبت قبل أن تسألها',
    faq1Q:'هل يحل محل موقعنا أو CRM؟', faq1A:'لا. DynamicNFC طبقة تعمل فوق أنظمتك الحالية.',
    faq2Q:'كيف نقيس نجاح التجربة؟', faq2A:'مقياس واحد: زيادة المعاينات المحجوزة بين مدعوّي VIP.',
    faq3Q:'ماذا عن الخصوصية؟', faq3A:'الموافقة مدمجة في التجربة الفعلية. اللمسة هي الموافقة.',
    faq4Q:'ماذا يتلقى العميل؟', faq4A:'صندوق مميز يحتوي مفتاح VIP مزود بـ NFC ورسالة شخصية.',
    faq5Q:'ما سرعة النشر؟', faq5A:'يمكن إطلاق برنامج تجريبي خلال ٢-٤ أسابيع.',
    faq6Q:'ما العائد الحقيقي؟', faq6A:'تقليص الوقت من "مهتم" إلى "معاينة" إلى النصف.',
    ctaLabel:'جاهز للنشر', ctaTitle:'أنت لا توزع بطاقات NFC. أنت تُصدر دعوات خاصة.',
    ctaDesc:'حوّل النية الرقمية إلى زخم مبيعات حقيقي.',
    ctaPilot:'طلب برنامج تجريبي →', ctaDemo:'استكشف العرض المباشر',
    modalTitle:'طلب برنامج تجريبي', modalSub:'أخبرنا عن مشروعك وسنصمم برنامجاً تجريبياً مخصصاً.',
    modalSec1:'معلومات الاتصال', modalSec2:'الشركة والدور', modalSec3:'تفاصيل المشروع', modalSec4:'التحديات الحالية',
    modalSubmit:'إرسال طلب التجربة →', modalSubmitting:'جارٍ الإرسال...',
    modalNote:'نرد خلال ٢٤ ساعة. معلوماتك سرية تماماً.',
    successTitle:'تم إرسال الطلب', successDesc:'شكراً لك. سيتواصل فريقنا خلال ٢٤ ساعة.',
    successClose:'إغلاق',
    footerText:'© 2025 DynamicNFC — محرك تسريع المبيعات لمطوري العقارات',
  },
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function Enterprise() {
  const [lang, setLang] = useState('en');
  const [pilotOpen, setPilotOpen] = useState(false);
  const [pilotSuccess, setPilotSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('.ent-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Smooth scroll */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Pilot modal */
  const openPilot = () => { setPilotOpen(true); setPilotSuccess(false); document.body.style.overflow = 'hidden'; };
  const closePilot = () => { setPilotOpen(false); document.body.style.overflow = ''; };
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') closePilot(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    data.submitted = new Date().toISOString();
    data._subject = `Pilot Program Request — ${data.company} / ${data.project}`;
    try {
      await fetch('https://formsubmit.co/ajax/info@dynamicnfc.help', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      setPilotSuccess(true);
    } catch { alert('Error submitting. Please try again.'); }
    setSubmitting(false);
  };

  /* Particles */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 20}s`,
    animationDuration: `${15 + Math.random() * 10}s`,
  }));

  const NfcIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gold)' }}>
      <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" />
    </svg>
  );
  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
  );

  return (
    <div className="ent-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="ent-bg-mesh" />
      <div className="ent-particles">
        {particles.map((p, i) => <div key={i} className="ent-particle" style={p} />)}
      </div>

      {/* ═══ NAV ═══ */}
      <nav className="ent-nav">
        <div className="ent-nav-inner">
          <Link to="/" className="ent-nav-brand">
            <div className="ent-nav-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" />
              </svg>
            </div>
            <span className="ent-nav-brand-text">Dynamic<span>NFC</span></span>
          </Link>
          <div className="ent-nav-links">
            <button className="ent-nav-link" onClick={() => scrollTo('problem')}>{t('navChallenge')}</button>
            <button className="ent-nav-link" onClick={() => scrollTo('how')}>{t('navHow')}</button>
            <button className="ent-nav-link" onClick={() => scrollTo('demo')}>{t('navDemo')}</button>
            <button className="ent-nav-link" onClick={() => scrollTo('roi')}>{t('navImpact')}</button>
            <button className="ent-nav-cta" onClick={openPilot}>{t('navPilot')}</button>
            <div className="ent-lang">
              <button className={`ent-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`ent-lang-btn${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>ع</button>
            </div>
          </div>
          <div className="ent-nav-right" style={{ display: 'none' }}>
            {/* Mobile: could add hamburger here */}
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="ent-hero">
        <div className="ent-nfc-anim">
          <div className="ent-nfc-waves-wrap"><div className="ent-nfc-wave" /><div className="ent-nfc-wave" /><div className="ent-nfc-wave" /></div>
          <div className="ent-nfc-card-icon"><NfcIcon /></div>
        </div>
        <div className="ent-hero-badge">{t('heroBadge')}</div>
        <h1>{t('heroTitle')}</h1>
        <p className="ent-hero-sub">{t('heroSub')}</p>
        <div className="ent-hero-stats">
          <div className="ent-stat"><span className="ent-stat-val">3.2×</span><span className="ent-stat-lbl">{t('statConversion')}</span></div>
          <div className="ent-stat"><span className="ent-stat-val">47%</span><span className="ent-stat-lbl">{t('statDecision')}</span></div>
          <div className="ent-stat"><span className="ent-stat-val">100%</span><span className="ent-stat-lbl">{t('statIdentified')}</span></div>
        </div>
        <div className="ent-hero-ctas">
          <button className="ent-btn-primary" onClick={openPilot}>{t('heroCtaPilot')}</button>
          <button className="ent-btn-secondary" onClick={() => scrollTo('demo')}>{t('heroCtaDemo')}</button>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ PROBLEM ═══ */}
      <section className="ent-section ent-problem ent-reveal" id="problem">
        <div className="ent-section-label red">{t('probLabel')}</div>
        <div className="ent-section-title">{t('probTitle')}</div>
        <p className="ent-problem-quote" dangerouslySetInnerHTML={{ __html: t('probQuote') }} />
        <div className="ent-problem-cards">
          {[1, 2, 3].map(i => (
            <div className="ent-problem-card" key={i}>
              <div className="ent-problem-card-icon">{t(`prob${i}Icon`)}</div>
              <h4>{t(`prob${i}Title`)}</h4>
              <p>{t(`prob${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ THE SHIFT ═══ */}
      <section className="ent-section ent-reveal">
        <div className="ent-section-label gold">{t('shiftLabel')}</div>
        <div className="ent-section-title">{t('shiftTitle')}</div>
        <p className="ent-section-desc">{t('shiftDesc')}</p>
        <div className="ent-shift-grid">
          <div className="ent-shift-box old">
            <div className="ent-shift-box-label">{t('oldLabel')}</div>
            <h3>{t('oldTitle')}</h3>
            <p>{t('oldDesc')}</p>
            <ul>{['old1','old2','old3','old4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
          <div className="ent-shift-arrow"><ArrowIcon /></div>
          <div className="ent-shift-box new">
            <div className="ent-shift-box-label">{t('newLabel')}</div>
            <h3>{t('newTitle')}</h3>
            <p>{t('newDesc')}</p>
            <ul>{['new1','new2','new3','new4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="ent-section ent-reveal" id="how">
        <div className="ent-section-label teal">{t('howLabel')}</div>
        <div className="ent-section-title">{t('howTitle')}</div>
        <p className="ent-section-desc">{t('howDesc')}</p>
        <div className="ent-steps-row">
          {[1,2,3,4].map(i => (
            <div className="ent-step-card" key={i}>
              <div className="ent-step-num">{i}</div>
              <h4>{t(`step${i}Title`)}</h4>
              <p>{t(`step${i}Desc`)}</p>
              {i < 4 && <div className="ent-step-connector" />}
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ VIP vs ANONYMOUS ═══ */}
      <section className="ent-section ent-identity ent-reveal">
        <div className="ent-section-label red">{t('idLabel')}</div>
        <div className="ent-section-title">{t('idTitle')}</div>
        <div className="ent-identity-tagline">{t('idTagline')}</div>
        <div className="ent-identity-grid">
          <div className="ent-identity-card vip">
            <div className="ent-card-label">{t('idVipLabel')}</div>
            <h3>{t('idVipTitle')}</h3>
            <p>{t('idVipDesc')}</p>
            <div className="ent-identity-features">
              {['idVip1','idVip2','idVip3','idVip4'].map(k => <span className="ent-identity-feature" key={k}>{t(k)}</span>)}
            </div>
          </div>
          <div className="ent-identity-card anon">
            <div className="ent-card-label">{t('idAnonLabel')}</div>
            <h3>{t('idAnonTitle')}</h3>
            <p>{t('idAnonDesc')}</p>
            <div className="ent-identity-features">
              {['idAnon1','idAnon2','idAnon3','idAnon4'].map(k => <span className="ent-identity-feature" key={k}>{t(k)}</span>)}
            </div>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ LIVE DEMO ═══ */}
      <section className="ent-section ent-demo ent-reveal" id="demo">
        <div className="ent-section-label blue">{t('demoLabel')}</div>
        <div className="ent-section-title">{t('demoTitle')}</div>
        <p className="ent-section-desc" style={{ margin: '0 auto' }}>{t('demoDesc')}</p>
        <div className="ent-demo-showcase">
          <div className="ent-demo-portals">
            <a href="/enterprise/crmdemo/khalid" className="ent-demo-portal" >
              <div className="ent-portal-badge red">{t('demoBadge1')}</div>
              <div className="ent-portal-avatar red">JD</div>
              <h4>{t('demoCard1Title')}</h4>
              <p>{t('demoCard1Desc')}</p>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
            <a href="/enterprise/crmdemo/ahmed" className="ent-demo-portal" >
              <div className="ent-portal-badge blue">{t('demoBadge2')}</div>
              <div className="ent-portal-avatar blue">JS</div>
              <h4>{t('demoCard2Title')}</h4>
              <p>{t('demoCard2Desc')}</p>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
            <a href="/enterprise/crmdemo/marketplace" className="ent-demo-portal" >
              <div className="ent-portal-badge teal">{t('demoBadge3')}</div>
              <div className="ent-portal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--teal)' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h4>{t('demoCard3Title')}</h4>
              <p>{t('demoCard3Desc')}</p>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
            <a href="/enterprise/crmdemo/dashboard" className="ent-demo-portal ent-demo-portal-featured" >
              <div className="ent-portal-badge gold">{t('demoBadge4')}</div>
              <div className="ent-portal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gold)' }}>
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div>
                <h4>{t('demoCard4Title')}</h4>
                <p>{t('demoCard4Desc')}</p>
              </div>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
            <a href="/enterprise/crmdemo/ai-demo" className="ent-demo-portal ent-demo-portal-featured" >
              <div className="ent-portal-badge purple">{t('demoBadge5')}</div>
              <div className="ent-portal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--purple)' }}>
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <div>
                <h4>{t('demoCard5Title')}</h4>
                <p>{t('demoCard5Desc')}</p>
              </div>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
          </div>
          <div className="ent-demo-cta-row">
            <a href="/enterprise/crmdemo/" className="ent-btn-primary" >{t('demoCta')}</a>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ ROI ═══ */}
      <section className="ent-section ent-roi ent-reveal" id="roi">
        <div className="ent-section-label red">{t('roiLabel')}</div>
        <div className="ent-section-title">{t('roiTitle')}</div>
        <p className="ent-section-desc" style={{ margin: '0 auto 1.5rem' }}>{t('roiDesc')}</p>
        <div className="ent-roi-flow">
          {['roiFlow1','roiFlow2','roiFlow3','roiFlow4','roiFlow5','roiFlow6'].map((k, i, a) => (
            <React.Fragment key={k}>
              <div className={`ent-roi-step${k === 'roiFlow6' ? ' ent-roi-highlight' : ''}`}>{t(k)}</div>
              {i < a.length - 1 && <span className="ent-roi-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="ent-roi-metrics">
          <div className="ent-roi-card"><div className="ent-roi-big red">3.2×</div><div className="ent-roi-label">{t('roiMetric1Label')}</div><div className="ent-roi-sub">{t('roiMetric1Sub')}</div></div>
          <div className="ent-roi-card"><div className="ent-roi-big blue">47%</div><div className="ent-roi-label">{t('roiMetric2Label')}</div><div className="ent-roi-sub">{t('roiMetric2Sub')}</div></div>
          <div className="ent-roi-card"><div className="ent-roi-big gold">100%</div><div className="ent-roi-label">{t('roiMetric3Label')}</div><div className="ent-roi-sub">{t('roiMetric3Sub')}</div></div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ TRUST ═══ */}
      <section className="ent-section ent-reveal">
        <div className="ent-section-label teal">{t('trustLabel')}</div>
        <div className="ent-section-title">{t('trustTitle')}</div>
        <div className="ent-trust-grid">
          {[
            { i: 1, c: 'red' }, { i: 2, c: 'blue' }, { i: 3, c: 'teal' }, { i: 4, c: 'gold' },
          ].map(({ i, c }) => (
            <div className="ent-trust-item" key={i}>
              <div className={`ent-trust-icon ${c}`}>{t(`trust${i}Icon`)}</div>
              <h4>{t(`trust${i}Title`)}</h4>
              <p>{t(`trust${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ FAQ ═══ */}
      <section className="ent-section ent-reveal">
        <div className="ent-section-label blue">{t('faqLabel')}</div>
        <div className="ent-section-title">{t('faqTitle')}</div>
        <div className="ent-faq-grid">
          {[1,2,3,4,5,6].map(i => (
            <div className="ent-faq-card" key={i}>
              <div className="ent-faq-q">{t(`faq${i}Q`)}</div>
              <div className="ent-faq-a">{t(`faq${i}A`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="ent-cta-section ent-reveal" id="pilot">
        <div className="ent-section-label red" style={{ marginBottom: '1.5rem' }}>{t('ctaLabel')}</div>
        <h2>{t('ctaTitle')}</h2>
        <p>{t('ctaDesc')}</p>
        <div className="ent-cta-buttons">
          <button className="ent-btn-primary" onClick={openPilot}>{t('ctaPilot')}</button>
          <a href="/enterprise/crmdemo" className="ent-btn-secondary" >{t('ctaDemo')}</a>
        </div>
      </section>

      {/* ═══ PILOT MODAL ═══ */}
      <div className={`ent-pilot-backdrop${pilotOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closePilot(); }}>
        <div className="ent-pilot-modal" onClick={(e) => e.stopPropagation()}>
          {!pilotSuccess ? (
            <>
              <div className="ent-pilot-header">
                <h3>{t('modalTitle')}</h3>
                <button className="ent-pilot-close" onClick={closePilot}>✕</button>
              </div>
              <p className="ent-pilot-sub">{t('modalSub')}</p>
              <form className="ent-pilot-form" ref={formRef} onSubmit={handleSubmit}>
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div className="ent-pilot-section-label">{t('modalSec1')}</div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">First Name <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="text" name="firstName" required />
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Last Name <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="text" name="lastName" required />
                  </div>
                </div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Business Email <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="email" name="email" required />
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Phone</label>
                    <input className="ent-pilot-input" type="tel" name="phone" />
                  </div>
                </div>

                <div className="ent-pilot-divider" />
                <div className="ent-pilot-section-label">{t('modalSec2')}</div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Company <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="text" name="company" required />
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Role <span className="req">*</span></label>
                    <select className="ent-pilot-select" name="role" required defaultValue="">
                      <option value="" disabled>Select role</option>
                      <option value="ceo">CEO / Chairman</option>
                      <option value="cso">Chief Sales Officer</option>
                      <option value="cmo">Chief Marketing Officer</option>
                      <option value="vp-sales">VP of Sales</option>
                      <option value="director-sales">Director of Sales</option>
                      <option value="gm">General Manager</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="ent-pilot-divider" />
                <div className="ent-pilot-section-label">{t('modalSec3')}</div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Project Name <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="text" name="project" required />
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Project Type <span className="req">*</span></label>
                    <select className="ent-pilot-select" name="projectType" required defaultValue="">
                      <option value="" disabled>Select type</option>
                      <option value="tower-highrise">Residential Tower</option>
                      <option value="branded-residences">Branded Residences</option>
                      <option value="luxury-villa">Luxury Villas</option>
                      <option value="mega-project">Mega-Project</option>
                      <option value="mixed-use">Mixed-Use</option>
                      <option value="commercial">Commercial</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Total Units</label>
                    <select className="ent-pilot-select" name="totalUnits" defaultValue="">
                      <option value="" disabled>Select range</option>
                      <option value="under-50">Under 50</option>
                      <option value="50-100">50 – 100</option>
                      <option value="100-500">100 – 500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Location</label>
                    <input className="ent-pilot-input" type="text" name="location" />
                  </div>
                </div>

                <div className="ent-pilot-divider" />
                <div className="ent-pilot-section-label">{t('modalSec4')}</div>
                <div className="ent-pilot-field full">
                  <label className="ent-pilot-label">Biggest sales challenge?</label>
                  <select className="ent-pilot-select" name="challenge" defaultValue="">
                    <option value="" disabled>Select challenge</option>
                    <option value="anonymous-traffic">Anonymous website traffic</option>
                    <option value="slow-followup">Slow follow-up</option>
                    <option value="low-conversion">Low conversion to viewings</option>
                    <option value="generic-outreach">Generic outreach</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="ent-pilot-field full">
                  <label className="ent-pilot-label">Notes</label>
                  <textarea className="ent-pilot-textarea" name="notes" />
                </div>

                <button type="submit" className="ent-pilot-submit" disabled={submitting}>
                  {submitting ? t('modalSubmitting') : t('modalSubmit')}
                </button>
                <p className="ent-pilot-note">{t('modalNote')}</p>
              </form>
            </>
          ) : (
            <div className="ent-pilot-success show">
              <div className="ent-pilot-success-icon">✓</div>
              <h4>{t('successTitle')}</h4>
              <p>{t('successDesc')}</p>
              <button className="ent-btn-close-success" onClick={closePilot}>{t('successClose')}</button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="ent-footer">
        <p>{t('footerText').includes('DynamicNFC') ? (
          <>© 2025 <a href="https://dynamicnfc.ca" >DynamicNFC</a> — {lang === 'ar' ? 'محرك تسريع المبيعات لمطوري العقارات' : 'Sales Velocity Engine for Real Estate Developers'}</>
        ) : t('footerText')}</p>
      </footer>
    </div>
  );
}
