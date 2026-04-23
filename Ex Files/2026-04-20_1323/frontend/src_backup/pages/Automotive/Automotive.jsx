import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './Automotive.css';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR) — Full automotive copy
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    navChallenge:'The Blind Spot', navHow:'How It Works', navUseCases:'Use Cases', navImpact:'Impact', navPilot:'Request a Pilot',
    heroBadge:'Automotive Sales Velocity Engine',
    heroTitle:'Turn Showroom Visitors Into Closed Deals',
    heroSub:'DynamicNFC transforms premium NFC cards into private showroom portals — bridging the gap between anonymous test-drive requests and named, high-intent buyers ready to configure, negotiate, and close.',
    statConversion:'Conversion Rate', statDecision:'Faster Decision Cycle', statIdentified:'Identified Visitors',
    heroCtaPilot:'Request a Pilot →', heroCtaSee:'See How It Works', heroCtaDemo:'See the Live Demo',

    probLabel:'The Blind Spot', probTitle:'Your Sales Team Is Selling Blind',
    probQuote:'Your highest-intent buyers spend weeks researching models, configurations, and financing options online. Yet when they walk into the showroom, your sales team starts from zero — no history, no preferences, no <strong style="color:var(--red)">context.</strong>',
    prob1Icon:'🚗', prob1Title:'Anonymous Showroom Traffic', prob1Desc:'Walk-ins browse models, take brochures, and leave. No identity, no follow-up, no conversion tracking.',
    prob2Icon:'⏳', prob2Title:'Delayed Follow-ups', prob2Desc:'Sales teams reach out days later with generic offers — no insight into which models, trims, or financing the buyer explored.',
    prob3Icon:'📋', prob3Title:'One-Size-Fits-All Pitch', prob3Desc:'Every buyer gets the same presentation — whether they want a family SUV or a performance coupe.',

    shiftLabel:'The Shift', shiftTitle:'From Generic Showroom to Private Experience',
    shiftDesc:'What if you stopped treating every showroom visit as a cold interaction — and started treating it as a continuation of the buyer\'s journey?',
    oldLabel:'The Old Way', oldTitle:'Generic Showroom', oldDesc:'Every visitor gets the same walk-around. No history. No preferences. Cold follow-ups.',
    old1:'Anonymous walk-ins', old2:'Same pitch for everyone', old3:'No behavioral data', old4:'Generic follow-ups',
    newLabel:'The Dynamic Way', newTitle:'Private VIP Showroom Portal', newDesc:'Each VIP Access Key unlocks a personalized digital showroom. Identity drives every interaction.',
    new1:'Named, identified buyers', new2:'Model-specific content', new3:'Real-time intent signals', new4:'Contextual, timely outreach',

    howLabel:'The Process', howTitle:'From VIP Key to Signed Contract',
    howDesc:'Selected prospects receive a premium VIP Access Key — an NFC-enabled card linked to their profile. The buying journey transforms from there.',
    step1Title:'Prospect Selection', step1Desc:'Your sales team identifies high-value prospects — repeat visitors, test-drive requesters, or referral leads — and assigns a personalized NFC key.',
    step2Title:'Premium Handoff', step2Desc:'The buyer receives a VIP Access Key during their showroom visit or via premium delivery: "This card unlocks your private showroom experience."',
    step3Title:'Tap & Explore', step3Desc:'One tap opens their private portal — tailored model comparisons, configuration tools, financing calculators, and booking options linked to their identity.',
    step4Title:'Behavioral Intelligence', step4Desc:'Every interaction — model views, configuration saves, financing simulations, test-drive bookings — feeds your dashboard in real time.',

    ucLabel:'Use Cases', ucTitle:'Built for Every Automotive Scenario',
    uc1Icon:'🏎️', uc1Title:'Luxury & Performance', uc1Desc:'Create exclusive digital experiences for high-net-worth buyers exploring limited editions, bespoke configurations, and premium services.',
    uc1Tag1:'Bespoke Config', uc1Tag2:'VIP Concierge', uc1Tag3:'Private Viewings',
    uc2Icon:'🚙', uc2Title:'Fleet & Corporate', uc2Desc:'Streamline fleet purchasing with dedicated portals showing volume pricing, model comparisons, and lease vs. buy calculators.',
    uc2Tag1:'Volume Pricing', uc2Tag2:'Fleet Management', uc2Tag3:'Corporate Accounts',
    uc3Icon:'🔧', uc3Title:'Certified Pre-Owned', uc3Desc:'Give CPO buyers confidence with vehicle history, inspection reports, warranty details, and personalized recommendations.',
    uc3Tag1:'Vehicle History', uc3Tag2:'Inspection Reports', uc3Tag3:'Warranty Info',
    uc4Icon:'⚡', uc4Title:'EV & New Energy', uc4Desc:'Educate and convert EV-curious buyers with range calculators, charging maps, incentive breakdowns, and test-drive scheduling.',
    uc4Tag1:'Range Calculator', uc4Tag2:'Incentive Finder', uc4Tag3:'Charging Network',

    idLabel:'The Key Difference', idTitle:'Same Showroom. Same Models. Different Intelligence.', idTagline:'Identity is the multiplier.',
    idVipLabel:'VIP Access Key Holder', idVipTitle:'Named Prospect — Omar Al-Khalili',
    idVipDesc:'You know he configured the GLE 63 AMG three times, compared it with the X5 M, ran financing for 48 months, and spent 12 minutes on the performance package. Your sales team calls with context, timing, and the right offer.',
    idVip1:'Personalized Follow-ups', idVip2:'Configuration History', idVip3:'Concierge Service', idVip4:'Named Intelligence',
    idAnonLabel:'Anonymous Showroom Visitor', idAnonTitle:'Unknown — Generic Lead Only',
    idAnonDesc:'Someone visited the SUV section and took a brochure. You don\'t know who, what they compared, or how serious they are. The lead sits in a queue with hundreds of others.',
    idAnon1:'Segment-level Data', idAnon2:'Generic Follow-up', idAnon3:'No Purchase Signals', idAnon4:'No Named History',

    roiLabel:'Why This Matters', roiTitle:'Measured by One Thing: Deals Closed Faster.',
    roiDesc:'Success isn\'t about impressions or clicks. It\'s about how fast a buyer moves from showroom visit to signed contract.',
    roiMetric1:'4.1×', roiMetric1Label:'Higher Conversion', roiMetric1Sub:'VIP key holders vs. anonymous walk-ins',
    roiMetric2:'52%', roiMetric2Label:'Faster Decision Cycle', roiMetric2Sub:'From first tap to signed contract',
    roiMetric3:'100%', roiMetric3Label:'Identified Engagement', roiMetric3Sub:'Every interaction linked to a named buyer',

    trustLabel:'Built for Automotive', trustTitle:'Privacy-First. DMS-Integrated. Zero Friction.',
    trust1Icon:'🔒', trust1Title:'Consent by Design', trust1Desc:'The physical tap is the ultimate opt-in. No dark patterns. The handshake is the consent.',
    trust2Icon:'📱', trust2Title:'NFC + QR Fallback', trust2Desc:'NFC for instant access. QR code backup for universal compatibility. No app downloads.',
    trust3Icon:'🔗', trust3Title:'DMS Integration', trust3Desc:'Sits on top of your existing dealer management system. Enhances your DMS with behavioral intelligence.',
    trust4Icon:'🤖', trust4Title:'AI Personalization', trust4Desc:'Content adapts dynamically to each buyer\'s preferences, financing stage, and engagement history.',

    faqLabel:'Questions Dealers Ask', faqTitle:'Answered Before You Ask Them',
    faq1Q:'Does this replace our DMS or website?',
    faq1A:'No. DynamicNFC is a layer on top of your existing systems. Your website and DMS keep working. We enhance both with identity-linked behavioral intelligence that neither can capture alone.',
    faq2Q:'How do we measure pilot success?',
    faq2A:'One metric: increase in closed deals among VIP key holders versus your standard walk-in conversion rate. Not clicks — real sales.',
    faq3Q:'What about data privacy?',
    faq3A:'Consent is built into the physical experience. When a buyer taps a card they received in person, that\'s explicit opt-in. No hidden tracking.',
    faq4Q:'What does the buyer actually receive?',
    faq4A:'A premium VIP Access Key — an NFC-enabled card with a personal message. Not a flyer — a private invitation to their digital showroom.',
    faq5Q:'How fast can we deploy?',
    faq5A:'A pilot program launches within 2–4 weeks. We configure your portals, design the experience, program the NFC keys, and connect analytics.',
    faq6Q:'What\'s the ROI?',
    faq6A:'It\'s about cutting the time from "interested" to "signed" in half. When your sales team engages with context, deals close faster.',

    ctaLabel:'Ready to Deploy',
    ctaTitle:"You're Not Handing Out Business Cards. You're Issuing VIP Access Keys.",
    ctaDesc:'Turn showroom traffic into closed deals. Start a pilot with 50 VIP keys and measure the difference in conversion within 30 days.',
    ctaPilot:'Request a Pilot Program →', ctaContact:'Contact Sales', ctaDemo:'See the Live Demo', ctaDashboard:'Dealer Dashboard',

    modalTitle:'Request an Automotive Pilot', modalSub:"Tell us about your dealership and we'll design a custom pilot — 50 VIP Access Keys, full analytics dashboard, and measurable results within 30 days.",
    modalSec1:'Contact Information', modalSec2:'Dealership & Role', modalSec3:'Details', modalSec4:'Current Challenges',
    modalSubmit:'Submit Pilot Request →', modalSubmitting:'Submitting...',
    modalNote:'We respond within 24 hours. Your information is kept strictly confidential.',
    successTitle:'Pilot Request Submitted',
    successDesc:'Thank you. Our automotive team will review your details and reach out within 24 hours to design your custom pilot.',
    successClose:'Close',
    footerText:'© 2026 DynamicNFC — Sales Velocity Engine for Automotive',
  },
  ar: {
    navChallenge:'النقطة العمياء', navHow:'كيف تعمل', navUseCases:'حالات الاستخدام', navImpact:'التأثير', navPilot:'طلب تجربة تجريبية',
    heroBadge:'محرك تسريع مبيعات السيارات',
    heroTitle:'تحويل زوار صالة العرض إلى صفقات مُغلقة',
    heroSub:'يحوّل DynamicNFC بطاقات NFC الفاخرة إلى بوابات صالة عرض خاصة — جسر بين طلبات تجربة القيادة المجهولة والمشترين ذوي النية العالية الجاهزين للتكوين والتفاوض والإغلاق.',
    statConversion:'معدل التحويل', statDecision:'دورة قرار أسرع', statIdentified:'زوار محددون',
    heroCtaPilot:'طلب تجربة تجريبية →', heroCtaSee:'شاهد كيف تعمل', heroCtaDemo:'شاهد العرض التجريبي المباشر',

    probLabel:'النقطة العمياء', probTitle:'فريق المبيعات يبيع دون بصيرة',
    probQuote:'يقضي المشترون الأكثر جدية أسابيع في البحث عن الموديلات والتكوينات وخيارات التمويل عبر الإنترنت. ومع ذلك، عندما يدخلون صالة العرض، يبدأ فريق المبيعات من الصفر — بدون تاريخ، بدون تفضيلات، بدون سياق.',
    prob1Icon:'🚗', prob1Title:'حركة مرور مجهولة في صالة العرض', prob1Desc:'يتصفح الزوار الموديلات، يأخذون كتيبات، ويغادرون. بدون هوية، بدون متابعة، بدون تتبع تحويل.',
    prob2Icon:'⏳', prob2Title:'متابعات متأخرة', prob2Desc:'يتواصل فريق المبيعات بعد أيام بعروض عامة — بدون معرفة الموديلات أو الفئات أو التمويل الذي استكشفه المشتري.',
    prob3Icon:'📋', prob3Title:'عرض واحد يناسب الجميع', prob3Desc:'كل مشترٍ يحصل على نفس العرض — سواء كان يريد SUV عائلي أو كوبيه رياضي.',

    shiftLabel:'التحول', shiftTitle:'من صالة عرض عامة إلى تجربة خاصة',
    shiftDesc:'ماذا لو توقفت عن معاملة كل زيارة لصالة العرض كتفاعل بارد — وبدأت اعتبارها استمرارًا لرحلة المشتري؟',
    oldLabel:'الطريقة القديمة', oldTitle:'صالة عرض عامة', oldDesc:'كل زائر يحصل على نفس الجولة. بدون تاريخ. بدون تفضيلات. متابعات باردة.',
    old1:'زوار مجهولون', old2:'نفس العرض للجميع', old3:'بدون بيانات سلوكية', old4:'متابعات عامة',
    newLabel:'الطريقة الديناميكية', newTitle:'بوابة صالة عرض VIP خاصة', newDesc:'كل مفتاح وصول VIP يفتح صالة عرض رقمية مخصصة. الهوية تقود كل تفاعل.',
    new1:'مشترون معروفون ومحددون', new2:'محتوى خاص بالموديل', new3:'إشارات نية في الوقت الفعلي', new4:'تواصل سياقي وفي الوقت المناسب',

    howLabel:'العملية', howTitle:'من مفتاح VIP إلى عقد موقّع',
    howDesc:'يحصل العملاء المختارون على مفتاح وصول VIP فاخر — بطاقة مزودة بتقنية NFC مرتبطة بملفهم. تتحول رحلة الشراء من هنا.',
    step1Title:'اختيار العملاء المحتملين', step1Desc:'يحدد فريق المبيعات العملاء ذوي القيمة العالية — الزوار المتكررون، طالبو تجربة القيادة، أو العملاء المُحالون — ويخصص مفتاح NFC مخصص.',
    step2Title:'التسليم الفاخر', step2Desc:'يتلقى المشتري مفتاح وصول VIP أثناء زيارته لصالة العرض أو عبر توصيل فاخر: "يفتح هذا المفتاح تجربة صالة العرض الخاصة بك."',
    step3Title:'النقر والاستكشاف', step3Desc:'نقرة واحدة تفتح بوابتهم الخاصة — مقارنات موديلات مخصصة، أدوات تكوين، حاسبات تمويل، وخيارات حجز مرتبطة بهويتهم.',
    step4Title:'التحليلات السلوكية', step4Desc:'كل تفاعل — مشاهدة الموديلات، حفظ التكوينات، محاكاة التمويل، حجز تجارب القيادة — يُغذي لوحة التحكم في الوقت الفعلي.',

    ucLabel:'حالات الاستخدام', ucTitle:'مصمم لكل سيناريو في عالم السيارات',
    uc1Icon:'🏎️', uc1Title:'الفخامة والأداء', uc1Desc:'أنشئ تجارب رقمية حصرية للمشترين ذوي الثروات العالية الذين يستكشفون الإصدارات المحدودة والتكوينات المخصصة والخدمات المتميزة.',
    uc1Tag1:'تكوين مخصص', uc1Tag2:'خدمة VIP', uc1Tag3:'عروض خاصة',
    uc2Icon:'🚙', uc2Title:'الأساطيل والشركات', uc2Desc:'تبسيط شراء الأساطيل ببوابات مخصصة تعرض أسعار الجملة ومقارنات الموديلات وحاسبات التأجير مقابل الشراء.',
    uc2Tag1:'أسعار الجملة', uc2Tag2:'إدارة الأساطيل', uc2Tag3:'حسابات الشركات',
    uc3Icon:'🔧', uc3Title:'السيارات المستعملة المعتمدة', uc3Desc:'امنح مشتري السيارات المستعملة الثقة بتاريخ المركبة وتقارير الفحص وتفاصيل الضمان والتوصيات المخصصة.',
    uc3Tag1:'تاريخ المركبة', uc3Tag2:'تقارير الفحص', uc3Tag3:'معلومات الضمان',
    uc4Icon:'⚡', uc4Title:'السيارات الكهربائية والطاقة الجديدة', uc4Desc:'ثقّف وحوّل المشترين المهتمين بالسيارات الكهربائية بحاسبات المدى وخرائط الشحن وتفاصيل الحوافز وجدولة تجارب القيادة.',
    uc4Tag1:'حاسبة المدى', uc4Tag2:'باحث الحوافز', uc4Tag3:'شبكة الشحن',

    idLabel:'الفرق الرئيسي', idTitle:'نفس صالة العرض. نفس الموديلات. ذكاء مختلف.', idTagline:'الهوية هي المضاعف.',
    idVipLabel:'حامل مفتاح وصول VIP', idVipTitle:'عميل معروف — عمر الخليلي',
    idVipDesc:'تعرف أنه كوّن GLE 63 AMG ثلاث مرات، وقارنه بـ X5 M، وحسب التمويل لـ 48 شهرًا، وقضى 12 دقيقة على باقة الأداء. يتصل فريق المبيعات بالسياق والتوقيت والعرض المناسب.',
    idVip1:'متابعات مخصصة', idVip2:'تاريخ التكوين', idVip3:'خدمة كونسيرج', idVip4:'ذكاء معروف بالاسم',
    idAnonLabel:'زائر صالة عرض مجهول', idAnonTitle:'مجهول — بيانات عامة فقط',
    idAnonDesc:'شخص ما زار قسم SUV وأخذ كتيبًا. لا تعرف من هو، ما الذي قارنه، أو مدى جديته. العميل المحتمل في قائمة انتظار مع المئات.',
    idAnon1:'بيانات على مستوى الشريحة', idAnon2:'متابعة عامة', idAnon3:'بدون إشارات شراء', idAnon4:'بدون تاريخ معروف',

    roiLabel:'لماذا هذا مهم', roiTitle:'يُقاس بشيء واحد: صفقات تُغلق أسرع.',
    roiDesc:'النجاح ليس عن الانطباعات أو النقرات. إنه عن سرعة انتقال المشتري من زيارة صالة العرض إلى عقد موقّع.',
    roiMetric1:'4.1×', roiMetric1Label:'تحويل أعلى', roiMetric1Sub:'حاملو مفتاح VIP مقابل الزوار المجهولين',
    roiMetric2:'52%', roiMetric2Label:'دورة قرار أسرع', roiMetric2Sub:'من أول نقرة إلى عقد موقّع',
    roiMetric3:'100%', roiMetric3Label:'تفاعل محدد بالهوية', roiMetric3Sub:'كل تفاعل مرتبط بمشترٍ معروف',

    trustLabel:'مصمم لقطاع السيارات', trustTitle:'خصوصية أولاً. متكامل مع نظام إدارة الوكالة. بدون عوائق.',
    trust1Icon:'🔒', trust1Title:'الموافقة حسب التصميم', trust1Desc:'النقرة الفعلية هي الموافقة المطلقة. لا أنماط مظلمة. المصافحة هي الموافقة.',
    trust2Icon:'📱', trust2Title:'NFC + QR احتياطي', trust2Desc:'NFC للوصول الفوري. رمز QR احتياطي للتوافق الشامل. لا حاجة لتنزيل تطبيق.',
    trust3Icon:'🔗', trust3Title:'تكامل نظام إدارة الوكالة', trust3Desc:'يعمل فوق نظام إدارة الوكالة الحالي. يعزز النظام بالذكاء السلوكي.',
    trust4Icon:'🤖', trust4Title:'التخصيص بالذكاء الاصطناعي', trust4Desc:'المحتوى يتكيف ديناميكيًا مع تفضيلات كل مشترٍ ومرحلة التمويل وتاريخ التفاعل.',

    faqLabel:'الأسئلة التي يطرحها الوكلاء', faqTitle:'تم الإجابة عليها قبل أن تسألها',
    faq1Q:'هل يحل هذا محل نظام إدارة الوكالة أو موقعنا الإلكتروني؟',
    faq1A:'لا. DynamicNFC طبقة فوق أنظمتك الحالية. موقعك ونظام إدارة الوكالة يظلان يعملان. نحن نحسّن كلاهما بذكاء سلوكي مرتبط بالهوية.',
    faq2Q:'كيف نقيس نجاح التجربة؟',
    faq2A:'مؤشر واحد: زيادة الصفقات المُغلقة بين حاملي مفاتيح VIP مقارنة بمعدل التحويل القياسي. ليست النقرات — بل المبيعات الحقيقية.',
    faq3Q:'ماذا عن خصوصية البيانات؟',
    faq3A:'الموافقة مدمجة في التجربة الفعلية. عندما ينقر المشتري على بطاقة تلقاها شخصيًا، فهذا موافقة صريحة. لا تتبع خفي.',
    faq4Q:'ماذا يحصل عليه المشتري فعليًا؟',
    faq4A:'مفتاح وصول VIP فاخر — بطاقة مزودة بتقنية NFC مع رسالة شخصية. ليست نشرة — بل دعوة خاصة لصالة العرض الرقمية.',
    faq5Q:'ما مدى سرعة التنفيذ؟',
    faq5A:'يمكن إطلاق برنامج تجريبي خلال 2–4 أسابيع. نقوم بإعداد بواباتك وتصميم التجربة وبرمجة مفاتيح NFC وربط التحليلات.',
    faq6Q:'ما هو العائد على الاستثمار؟',
    faq6A:'الأمر يتعلق بتقليل الوقت من "مهتم" إلى "موقّع" للنصف. عندما يتواصل فريق المبيعات بالسياق، تُغلق الصفقات أسرع.',

    ctaLabel:'جاهز للتنفيذ', ctaTitle:'أنت لا توزع بطاقات عمل. أنت تصدر مفاتيح وصول VIP.',
    ctaDesc:'حوّل حركة صالة العرض إلى صفقات مُغلقة. ابدأ تجربة مع 50 مفتاح VIP وقِس الفرق في التحويل خلال 30 يومًا.',
    ctaPilot:'طلب برنامج تجريبي →', ctaContact:'تواصل مع المبيعات', ctaDemo:'شاهد العرض التجريبي المباشر', ctaDashboard:'لوحة تحكم التاجر',

    modalTitle:'طلب تجربة تجريبية للسيارات', modalSub:'أخبرنا عن وكالتك وسنصمم تجربة مخصصة — 50 مفتاح وصول VIP، لوحة تحكم تحليلات كاملة، ونتائج قابلة للقياس خلال 30 يومًا.',
    modalSec1:'معلومات الاتصال', modalSec2:'الوكالة والدور', modalSec3:'التفاصيل', modalSec4:'التحديات الحالية',
    modalSubmit:'إرسال طلب تجربة →', modalSubmitting:'إرسال...',
    modalNote:'نرد خلال 24 ساعة. معلوماتك محفوظة بسرية تامة.',
    successTitle:'تم تقديم طلب التجربة', successDesc:'شكرًا لك. سيقوم فريق السيارات بمراجعة تفاصيلك والتواصل خلال 24 ساعة لتصميم تجربتك المخصصة.',
    successClose:'إغلاق',
    footerText:'© 2026 DynamicNFC — محرك تسريع المبيعات لقطاع السيارات',
  },
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function Automotive() {
  const { lang } = useLanguage();
  const [pilotOpen, setPilotOpen] = useState(false);
  const [pilotSuccess, setPilotSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('.auto-reveal');
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
    data._subject = `Automotive Pilot Request — ${data.dealership} / ${data.firstName} ${data.lastName}`;
    try {
      await fetch('https://formsubmit.co/ajax/info@dynamicnfc.help', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      setPilotSuccess(true);
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'automotive_pilot',
          event_label: data.dealership || 'unknown',
        });
      }
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
    <div className="auto-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="auto-bg-mesh" />
      <div className="auto-particles">
        {particles.map((p, i) => <div key={i} className="auto-particle" style={p} />)}
      </div>

      {/* Navbar is now global — rendered in App.jsx */}

      {/* ═══ HERO ═══ */}
      <section className="auto-hero">
        <div className="auto-nfc-anim">
          <div className="auto-nfc-waves-wrap"><div className="auto-nfc-wave" /><div className="auto-nfc-wave" /><div className="auto-nfc-wave" /></div>
          <div className="auto-nfc-card-icon"><NfcIcon /></div>
        </div>
        <div className="auto-hero-badge">{t('heroBadge')}</div>
        <h1>{t('heroTitle')}</h1>
        <p className="auto-hero-sub">{t('heroSub')}</p>
        <div className="auto-hero-stats">
          <div className="auto-stat"><span className="auto-stat-val">4.1×</span><span className="auto-stat-lbl">{t('statConversion')}</span></div>
          <div className="auto-stat"><span className="auto-stat-val">52%</span><span className="auto-stat-lbl">{t('statDecision')}</span></div>
          <div className="auto-stat"><span className="auto-stat-val">100%</span><span className="auto-stat-lbl">{t('statIdentified')}</span></div>
        </div>
        <div className="auto-hero-ctas">
          <button className="auto-btn-primary" onClick={openPilot}>{t('heroCtaPilot')}</button>
          <button className="auto-btn-secondary" onClick={() => scrollTo('how')}>{t('heroCtaSee')}</button>
          <Link to="/automotive/demo" className="auto-btn-secondary">{t('heroCtaDemo')}</Link>
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ PROBLEM — The Blind Spot ═══ */}
      <section className="auto-section auto-problem auto-reveal" id="problem">
        <div className="auto-section-label red">{t('probLabel')}</div>
        <div className="auto-section-title">{t('probTitle')}</div>
        <p className="auto-problem-quote" dangerouslySetInnerHTML={{ __html: t('probQuote') }} />
        <div className="auto-problem-cards">
          {[1, 2, 3].map(i => (
            <div className="auto-problem-card" key={i}>
              <div className="auto-problem-card-icon">{t(`prob${i}Icon`)}</div>
              <h4>{t(`prob${i}Title`)}</h4>
              <p>{t(`prob${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ ROI CALCULATOR CTA — Premium Banner ═══ */}
      <section className="auto-roi-banner auto-reveal">
        <div className="auto-roi-banner-content">
          <div className="auto-roi-banner-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="14" width="4" height="6" rx="1" fill="currentColor" opacity="0.2" />
              <rect x="10" y="10" width="4" height="10" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="17" y="6" width="4" height="14" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <div className="auto-roi-banner-text">
            <span className="auto-roi-banner-badge">SALES VELOCITY TOOL</span>
            <h3>How much revenue would <em>75</em> VIP invitations generate?</h3>
            <p>Plug in your dealership numbers — see the projected impact on test drives, conversion, and sales pipeline in real time.</p>
          </div>
          <Link to="/sales/roi-calculator?industry=automotive" className="auto-roi-banner-btn">
            Calculate Your ROI
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ THE SHIFT ═══ */}
      <section className="auto-section auto-reveal">
        <div className="auto-section-label gold">{t('shiftLabel')}</div>
        <div className="auto-section-title">{t('shiftTitle')}</div>
        <p className="auto-section-desc">{t('shiftDesc')}</p>
        <div className="auto-shift-grid">
          <div className="auto-shift-box old">
            <div className="auto-shift-box-label">{t('oldLabel')}</div>
            <h3>{t('oldTitle')}</h3>
            <p>{t('oldDesc')}</p>
            <ul>{['old1','old2','old3','old4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
          <div className="auto-shift-arrow"><ArrowIcon /></div>
          <div className="auto-shift-box new">
            <div className="auto-shift-box-label">{t('newLabel')}</div>
            <h3>{t('newTitle')}</h3>
            <p>{t('newDesc')}</p>
            <ul>{['new1','new2','new3','new4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="auto-section auto-reveal" id="how">
        <div className="auto-section-label teal">{t('howLabel')}</div>
        <div className="auto-section-title">{t('howTitle')}</div>
        <p className="auto-section-desc">{t('howDesc')}</p>
        <div className="auto-steps-row">
          {[1,2,3,4].map(i => (
            <div className="auto-step-card" key={i}>
              <div className="auto-step-num">{i}</div>
              <h4>{t(`step${i}Title`)}</h4>
              <p>{t(`step${i}Desc`)}</p>
              {i < 4 && <div className="auto-step-connector" />}
            </div>
          ))}
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ USE CASES ═══ */}
      <section className="auto-section auto-reveal" id="usecases">
        <div className="auto-section-label blue">{t('ucLabel')}</div>
        <div className="auto-section-title">{t('ucTitle')}</div>
        <div className="auto-usecases-grid">
          {[1,2,3,4].map(i => (
            <div className="auto-usecase-card" key={i}>
              <div className="auto-usecase-icon">{t(`uc${i}Icon`)}</div>
              <h4>{t(`uc${i}Title`)}</h4>
              <p>{t(`uc${i}Desc`)}</p>
              <div className="auto-usecase-tags">
                {[1,2,3].map(j => <span className="auto-usecase-tag" key={j}>{t(`uc${i}Tag${j}`)}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ LIVE DEMO PORTALS ═══ */}
      <section className="auto-section auto-reveal" id="demo-portals">
        <div className="auto-section-label blue">{lang === 'ar' ? 'العرض التجريبي المباشر' : 'LIVE DEMO'}</div>
        <div className="auto-section-title">{lang === 'ar' ? 'جرّب البوابات بنفسك' : 'Experience the Portals Yourself'}</div>
        <p className="auto-section-desc">{lang === 'ar' ? 'استكشف كيف يعمل النظام — من تجربة المشتري الخاصة إلى لوحة تحكم الوكيل.' : 'See how DynamicNFC works end-to-end — from the buyer\'s private portal to the dealer intelligence dashboard.'}</p>
        <div className="auto-demo-grid">
          <a href="/automotive/demo/khalid" className="auto-demo-portal auto-reveal">
            <div className="auto-demo-badge red">{lang === 'ar' ? 'مشتري VIP' : 'VIP BUYER'}</div>
            <h4>{lang === 'ar' ? 'بوابة خالد — مشتري فاخر' : 'Khalid Portal — Luxury Buyer'}</h4>
            <p>{lang === 'ar' ? 'تجربة مخصصة للمشتري الفاخر — مقارنات الموديلات، أدوات التهيئة، حاسبة التمويل.' : 'Personalized luxury buyer experience — model comparisons, configuration tools, financing calculator.'}</p>
            <div className="auto-demo-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          </a>
          <a href="/automotive/demo/sultan" className="auto-demo-portal auto-reveal">
            <div className="auto-demo-badge blue">{lang === 'ar' ? 'مشتري عائلي' : 'FAMILY BUYER'}</div>
            <h4>{lang === 'ar' ? 'بوابة سلطان — مشتري عائلي' : 'Sultan Portal — Family Buyer'}</h4>
            <p>{lang === 'ar' ? 'تجربة المشتري العائلي — الأمان، المساحة، خطط الدفع، حجز تجربة قيادة.' : 'Family buyer experience — safety ratings, space, payment plans, test-drive booking.'}</p>
            <div className="auto-demo-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          </a>
          <a href="/automotive/demo/showroom" className="auto-demo-portal auto-reveal">
            <div className="auto-demo-badge blue">{lang === 'ar' ? 'وصول عام' : 'PUBLIC ACCESS'}</div>
            <h4>{lang === 'ar' ? 'صالة العرض العامة' : 'Public Showroom'}</h4>
            <p>{lang === 'ar' ? 'تجربة التصفح المجهول — التقاط العملاء المحتملين وإشارات التفاعل التلقائية.' : 'Anonymous browsing experience — lead capture and progressive engagement signals.'}</p>
            <div className="auto-demo-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          </a>
          <a href="/automotive/dashboard" className="auto-demo-portal auto-demo-featured auto-reveal">
            <div className="auto-demo-badge red">{lang === 'ar' ? 'لوحة التحليلات' : 'ANALYTICS'}</div>
            <h4>{lang === 'ar' ? 'لوحة تحكم الوكيل' : 'Dealer Intelligence Dashboard'}</h4>
            <p>{lang === 'ar' ? 'تحليلات سلوكية في الوقت الحقيقي — تسجيل العملاء المحتملين، تتبع السلوك، مسارات التحويل.' : 'Real-time behavioral analytics — lead scoring, behavior tracking, conversion funnels, A/B testing.'}</p>
            <div className="auto-demo-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          </a>
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ VIP vs ANONYMOUS ═══ */}
      <section className="auto-section auto-identity auto-reveal">
        <div className="auto-section-label red">{t('idLabel')}</div>
        <div className="auto-section-title">{t('idTitle')}</div>
        <div className="auto-identity-tagline">{t('idTagline')}</div>
        <div className="auto-identity-grid">
          <div className="auto-identity-card vip">
            <div className="auto-card-label">{t('idVipLabel')}</div>
            <h3>{t('idVipTitle')}</h3>
            <p>{t('idVipDesc')}</p>
            <div className="auto-identity-features">
              {['idVip1','idVip2','idVip3','idVip4'].map(k => <span className="auto-identity-feature" key={k}>{t(k)}</span>)}
            </div>
          </div>
          <div className="auto-identity-card anon">
            <div className="auto-card-label">{t('idAnonLabel')}</div>
            <h3>{t('idAnonTitle')}</h3>
            <p>{t('idAnonDesc')}</p>
            <div className="auto-identity-features">
              {['idAnon1','idAnon2','idAnon3','idAnon4'].map(k => <span className="auto-identity-feature" key={k}>{t(k)}</span>)}
            </div>
          </div>
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ ROI / IMPACT ═══ */}
      <section className="auto-section auto-roi auto-reveal" id="roi">
        <div className="auto-section-label red">{t('roiLabel')}</div>
        <div className="auto-section-title">{t('roiTitle')}</div>
        <p className="auto-section-desc" style={{ margin: '0 auto 1.5rem' }}>{t('roiDesc')}</p>
        <div className="auto-roi-metrics">
          <div className="auto-roi-card"><div className="auto-roi-big red">{t('roiMetric1')}</div><div className="auto-roi-label">{t('roiMetric1Label')}</div><div className="auto-roi-sub">{t('roiMetric1Sub')}</div></div>
          <div className="auto-roi-card"><div className="auto-roi-big blue">{t('roiMetric2')}</div><div className="auto-roi-label">{t('roiMetric2Label')}</div><div className="auto-roi-sub">{t('roiMetric2Sub')}</div></div>
          <div className="auto-roi-card"><div className="auto-roi-big gold">{t('roiMetric3')}</div><div className="auto-roi-label">{t('roiMetric3Label')}</div><div className="auto-roi-sub">{t('roiMetric3Sub')}</div></div>
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ TRUST / TECHNOLOGY ═══ */}
      <section className="auto-section auto-reveal">
        <div className="auto-section-label teal">{t('trustLabel')}</div>
        <div className="auto-section-title">{t('trustTitle')}</div>
        <div className="auto-trust-grid">
          {[
            { i: 1, c: 'red' }, { i: 2, c: 'blue' }, { i: 3, c: 'teal' }, { i: 4, c: 'gold' },
          ].map(({ i, c }) => (
            <div className="auto-trust-item" key={i}>
              <div className={`auto-trust-icon ${c}`}>{t(`trust${i}Icon`)}</div>
              <h4>{t(`trust${i}Title`)}</h4>
              <p>{t(`trust${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="auto-divider" />

      {/* ═══ FAQ ═══ */}
      <section className="auto-section auto-reveal">
        <div className="auto-section-label blue">{t('faqLabel')}</div>
        <div className="auto-section-title">{t('faqTitle')}</div>
        <div className="auto-faq-grid">
          {[1,2,3,4,5,6].map(i => (
            <div className="auto-faq-card" key={i}>
              <div className="auto-faq-q">{t(`faq${i}Q`)}</div>
              <div className="auto-faq-a">{t(`faq${i}A`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="auto-cta-section auto-reveal" id="pilot">
        <div className="auto-section-label red" style={{ marginBottom: '1.5rem' }}>{t('ctaLabel')}</div>
        <h2>{t('ctaTitle')}</h2>
        <p>{t('ctaDesc')}</p>
        <div className="auto-cta-buttons">
          <button className="auto-btn-primary" onClick={openPilot}>{t('ctaPilot')}</button>
          <Link to="/automotive/demo" className="auto-btn-secondary">{t('ctaDemo')}</Link>
          <Link to="/automotive/dashboard" className="auto-btn-secondary">{t('ctaDashboard')}</Link>
          <Link to="/contact-sales" className="auto-btn-secondary">{t('ctaContact')}</Link>
        </div>
      </section>

      {/* ═══ PILOT MODAL ═══ */}
      <div className={`auto-pilot-backdrop${pilotOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closePilot(); }}>
        <div className="auto-pilot-modal" onClick={(e) => e.stopPropagation()}>
          {!pilotSuccess ? (
            <>
              <div className="auto-pilot-header">
                <h3>{t('modalTitle')}</h3>
                <button className="auto-pilot-close" onClick={closePilot}>✕</button>
              </div>
              <p className="auto-pilot-sub">{t('modalSub')}</p>
              <form className="auto-pilot-form" ref={formRef} onSubmit={handleSubmit}>
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div className="auto-pilot-section-label">{t('modalSec1')}</div>
                <div className="auto-pilot-row">
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">First Name <span className="req">*</span></label>
                    <input className="auto-pilot-input" type="text" name="firstName" required />
                  </div>
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Last Name <span className="req">*</span></label>
                    <input className="auto-pilot-input" type="text" name="lastName" required />
                  </div>
                </div>
                <div className="auto-pilot-row">
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Business Email <span className="req">*</span></label>
                    <input className="auto-pilot-input" type="email" name="email" required />
                  </div>
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Phone</label>
                    <input className="auto-pilot-input" type="tel" name="phone" />
                  </div>
                </div>

                <div className="auto-pilot-divider" />
                <div className="auto-pilot-section-label">{t('modalSec2')}</div>
                <div className="auto-pilot-row">
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Dealership / Group <span className="req">*</span></label>
                    <input className="auto-pilot-input" type="text" name="dealership" required />
                  </div>
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Role <span className="req">*</span></label>
                    <select className="auto-pilot-select" name="role" required defaultValue="">
                      <option value="" disabled>Select role</option>
                      <option value="gm">General Manager</option>
                      <option value="sales-director">Sales Director</option>
                      <option value="sales-manager">Sales Manager</option>
                      <option value="marketing-director">Marketing Director</option>
                      <option value="digital-manager">Digital Manager</option>
                      <option value="owner">Dealer Principal / Owner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="auto-pilot-divider" />
                <div className="auto-pilot-section-label">{t('modalSec3')}</div>
                <div className="auto-pilot-row">
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Brand(s) <span className="req">*</span></label>
                    <input className="auto-pilot-input" type="text" name="brands" required placeholder="e.g. Mercedes-Benz, BMW" />
                  </div>
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Segment Focus</label>
                    <select className="auto-pilot-select" name="segment" defaultValue="">
                      <option value="" disabled>Select segment</option>
                      <option value="luxury">Luxury / Premium</option>
                      <option value="performance">Performance / Sports</option>
                      <option value="suv-crossover">SUV / Crossover</option>
                      <option value="ev">EV / New Energy</option>
                      <option value="fleet">Fleet / Corporate</option>
                      <option value="cpo">Certified Pre-Owned</option>
                      <option value="multi">Multi-Segment</option>
                    </select>
                  </div>
                </div>
                <div className="auto-pilot-row">
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Monthly Showroom Traffic</label>
                    <select className="auto-pilot-select" name="traffic" defaultValue="">
                      <option value="" disabled>Select range</option>
                      <option value="under-200">Under 200</option>
                      <option value="200-500">200 – 500</option>
                      <option value="500-1000">500 – 1,000</option>
                      <option value="1000+">1,000+</option>
                    </select>
                  </div>
                  <div className="auto-pilot-field">
                    <label className="auto-pilot-label">Location</label>
                    <input className="auto-pilot-input" type="text" name="location" />
                  </div>
                </div>

                <div className="auto-pilot-divider" />
                <div className="auto-pilot-section-label">{t('modalSec4')}</div>
                <div className="auto-pilot-field full">
                  <label className="auto-pilot-label">Biggest sales challenge?</label>
                  <select className="auto-pilot-select" name="challenge" defaultValue="">
                    <option value="" disabled>Select challenge</option>
                    <option value="anonymous-traffic">Anonymous showroom traffic</option>
                    <option value="low-test-drive">Low test-drive conversion</option>
                    <option value="slow-followup">Slow follow-up after visits</option>
                    <option value="generic-outreach">Generic outreach / no personalization</option>
                    <option value="online-offline-gap">Online-to-showroom gap</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="auto-pilot-field full">
                  <label className="auto-pilot-label">Notes</label>
                  <textarea className="auto-pilot-textarea" name="notes" />
                </div>

                <button type="submit" className="auto-pilot-submit" disabled={submitting}>
                  {submitting ? t('modalSubmitting') : t('modalSubmit')}
                </button>
                <p className="auto-pilot-note">{t('modalNote')}</p>
              </form>
            </>
          ) : (
            <div className="auto-pilot-success show">
              <div className="auto-pilot-success-icon">✓</div>
              <h4>{t('successTitle')}</h4>
              <p>{t('successDesc')}</p>
              <button className="auto-btn-close-success" onClick={closePilot}>{t('successClose')}</button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="auto-footer">
        <p>© 2026 <a href="https://dynamicnfc.ca">DynamicNFC</a> — {lang === 'ar' ? 'محرك تسريع المبيعات لقطاع السيارات' : 'Sales Velocity Engine for Automotive'}</p>
      </footer>
    </div>
  );
}
