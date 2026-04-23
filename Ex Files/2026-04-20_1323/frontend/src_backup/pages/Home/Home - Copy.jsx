import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Home.css';

/* ── Card images ── */
import cardFrontImg from '../NFCCards/assets/card-front.jpg';
import cardBackImg from '../NFCCards/assets/card-back.jpg';

/* ═══════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    home: 'Home', enterprise: 'Enterprise', nfcCards: 'NFC Cards', login: 'Login',
    badge: 'Sales Velocity Engine',
    heroLine1: 'Turn Digital Intent',
    heroLine2: 'Into Real Sales',
    heroLine3: 'Momentum',
    heroSub: 'DynamicNFC transforms how luxury real estate developers sell — replacing anonymous website traffic with identified, high-intent VIP buyer experiences powered by NFC technology.',
    ctaPrimary: 'See Live Demo',
    ctaSecondary: 'Talk to Sales',
    heroNote: 'Also available for enterprise NFC business cards & team solutions',

    stat1v: '47%', stat1l: 'Higher Engagement',
    stat2v: '3.2×', stat2l: 'Conversion Rate',
    stat3v: '< 48h', stat3l: 'Decision Speed',

    blindTitle: 'The Blind Spot',
    blindSub: 'Your buyers are already exploring. You just can\'t see them.',
    blindDesc: 'Today, your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options online. Yet when sales teams engage, they lack context. They don\'t know who is ready, what they care about, or when to act. This leads to delayed follow-ups, generic conversations, and missed momentum.',
    shiftTitle: 'The Shift',
    shiftSub: 'From public website to private invitation.',
    shiftDesc: 'What if you stopped treating the website as a brochure, and instead treated it as a private experience for selected prospects? Not everyone — only those you intentionally invite. Selected prospects receive a premium box with an NFC card. When they tap, they access a private digital experience. This establishes consent, exclusivity, and trust before any tracking happens.',

    demoTitle: 'See It In Action',
    demoSub: 'Walk through a live demo of the VIP buyer experience, marketplace, and intelligence dashboard.',
    demoCard1: 'VIP Investor Portal',
    demoCard1d: 'Khalid Al-Rashid — Penthouse buyer with ROI analytics',
    demoCard2: 'Family Buyer Portal',
    demoCard2d: 'Ahmed Al-Fahad — 3BR family with school & community focus',
    demoCard3: 'Public Marketplace',
    demoCard3d: 'Anonymous browsing with lead capture gate',
    demoCard4: 'CRM Dashboard',
    demoCard4d: 'Real-time behavioral intelligence & sales triggers',
    demoCta: 'Launch Full Demo',

    indTitle: 'Built For Your Industry',
    indSub: 'Three specialized paths, one platform',
    ind1t: 'Real Estate Developers',
    ind1d: 'Portfolio-wide sales acceleration. VIP buyer portals, behavioral analytics, CRM intelligence. Turn every launch into a data-driven sales engine.',
    ind1cta: 'Developer Solutions',
    ind1tags: ['VIP Portals', 'Behavioral Analytics', 'CRM Integration', 'Payment Plans'],
    ind2t: 'Real Estate Agents',
    ind2d: 'Agent onboarding, listing links on every card, lead capture at open houses, QR sign-in sheets, and broker-level brand control.',
    ind2cta: 'Agent Solutions',
    ind2tags: ['Agent Cards', 'Lead Capture', 'Open House QR', 'Broker Control'],
    ind3t: 'Enterprise NFC Cards',
    ind3d: 'Premium metal, 24K gold, bamboo, and PVC cards with custom encoding. Bulk ordering, team provisioning, and worldwide fulfillment.',
    ind3cta: 'Enterprise Cards',
    ind3tags: ['Metal & Gold', 'Bulk Orders', 'Team Management', 'Analytics'],

    featTitle: 'Enterprise-Grade Platform',
    featSub: 'Everything your team needs, nothing you don\'t',
    feat1t: 'Identity-First Intelligence', feat1d: 'Know WHO is browsing before you know WHAT they do. NFC tap = named VIP with full behavioral context.',
    feat2t: 'Behavioral Analytics', feat2d: 'Real-time dashboards tracking views, pricing requests, comparisons, and bookings — per VIP and per unit.',
    feat3t: 'Sales Triggers', feat3d: '"Why call now?" engine. Auto-generated outreach reasons based on last 48h VIP behavior.',
    feat4t: 'Bilingual EN/AR + RTL', feat4d: 'Full Arabic support with professional real estate terminology. Every portal, dashboard, and report.',
    feat5t: 'Privacy by Design', feat5d: 'Physical tap = explicit consent. No surveillance. Concierge tone in all outreach. PDPL/DPL aligned.',
    feat6t: 'Canada-Based Operations', feat6d: 'Headquartered in Vancouver. Dedicated account management and priority support for Gulf developers.',

    procTitle: 'From Pilot to Scale',
    procSub: 'A proven 4-step process',
    proc1t: 'Discovery Call', proc1d: 'We assess your portfolio, current pain points, and pilot scope. 30 minutes.',
    proc2t: 'Pilot Setup', proc2d: 'Portal branding, content handoff, VIP list curation, card design approval. 2 weeks.',
    proc3t: 'Premium Box Delivery', proc3d: 'NFC cards encoded, premium boxes assembled, delivered to your selected VIPs.',
    proc4t: '90-Day Review', proc4d: 'Measure booked viewings uplift, decision speed, and VIP engagement vs control group.',

    priceTitle: 'Enterprise Pricing',
    priceSub: 'Pilot programs start from $4,800 for 25 VIP cards with full portal and dashboard access. Pricing scales with portfolio size.',
    priceCta: 'Get a Custom Quote',

    faqTitle: 'Frequently Asked Questions',
    faq1q: 'Is this replacing our CRM?', faq1a: 'No. DynamicNFC sits on top of your existing CRM and enhances it with behavioral intelligence from VIP portals.',
    faq2q: 'Is this compliant with privacy laws?', faq2a: 'Yes. The physical NFC tap is the ultimate opt-in. Consent is explicit, invitations are intentional, and access is controlled.',
    faq3q: 'What\'s the pilot success metric?', faq3a: 'Increase in booked viewings among VIP invitees versus the control group. We measure decision speed, not just clicks.',
    faq4q: 'Do buyers need an app?', faq4a: 'No. A tap or QR scan opens the portal instantly in the phone\'s browser — no downloads required.',
    faq5q: 'How long is the pilot?', faq5a: '90 days from VIP box delivery. Includes portal setup, card production, and a full performance review.',
    faq6q: 'Can we customize the portal per project?', faq6a: 'Yes. Each development project gets its own branded portal with custom units, floor plans, pricing, and bilingual content.',

    ctaFinalTitle: 'Ready to Accelerate Your Sales?',
    ctaFinalSub: 'See the live demo or schedule a discovery call with our team.',
    ctaFinalPrimary: 'Launch Live Demo',
    ctaFinalSecondary: 'Talk to Sales',

    footProduct: 'Product', footEnterprise: 'Enterprise', footNfcCards: 'NFC Business Cards',
    footContact: 'Contact Sales', footAccount: 'Account', footCreateCard: 'Create Card',
    footLogin: 'Log in', footSignup: 'Sign up', footDev: 'Developers', footRe: 'Real Estate',
    footCopy: '© 2026 DynamicNFC Software Inc. All Rights Reserved.',
  },
  ar: {
    home: 'الرئيسية', enterprise: 'المؤسسات', nfcCards: 'بطاقات NFC', login: 'تسجيل الدخول',
    badge: 'محرك تسريع المبيعات',
    heroLine1: 'حوّل النية الرقمية',
    heroLine2: 'إلى زخم مبيعات',
    heroLine3: 'حقيقي',
    heroSub: 'DynamicNFC تحوّل طريقة بيع المطورين العقاريين — من زوار مجهولين إلى تجارب مشتري VIP مُحدّدة الهوية مدعومة بتقنية NFC.',
    ctaPrimary: 'شاهد العرض المباشر',
    ctaSecondary: 'تحدث للمبيعات',
    heroNote: 'متاح أيضاً لبطاقات NFC المؤسسية وحلول الفرق',

    stat1v: '٤٧٪', stat1l: 'تفاعل أعلى',
    stat2v: '٣.٢×', stat2l: 'معدل التحويل',
    stat3v: '< ٤٨ س', stat3l: 'سرعة القرار',

    blindTitle: 'النقطة العمياء',
    blindSub: 'مشترون يستكشفون بالفعل. لكنك لا تراهم.',
    blindDesc: 'اليوم، مشترون بنية عالية يقضون أسابيع في استكشاف المخططات والأسعار وخطط الدفع. لكن فرق المبيعات تفتقر للسياق. لا يعرفون من المستعد، ماذا يهمه، أو متى يتصرفون. هذا يؤدي إلى متابعات متأخرة ومحادثات عامة وزخم ضائع.',
    shiftTitle: 'التحوّل',
    shiftSub: 'من موقع عام إلى دعوة خاصة.',
    shiftDesc: 'ماذا لو توقفت عن التعامل مع الموقع كنشرة إعلانية، وبدلاً من ذلك عاملته كتجربة خاصة لعملاء مختارين؟ ليس الجميع — فقط من تدعوهم عمداً. العملاء المختارون يتلقون صندوقاً فاخراً مع بطاقة NFC. عندما ينقرون، يصلون لتجربة رقمية خاصة.',

    demoTitle: 'شاهده مباشرة',
    demoSub: 'تجوّل في عرض حي لتجربة المشتري VIP والسوق ولوحة الذكاء.',
    demoCard1: 'بوابة مستثمر VIP', demoCard1d: 'خالد الراشد — بنتهاوس مع تحليلات العائد',
    demoCard2: 'بوابة مشتري عائلي', demoCard2d: 'أحمد الفهد — ٣ غرف مع مدارس ومجتمع',
    demoCard3: 'السوق العام', demoCard3d: 'تصفح مجهول مع التقاط العملاء',
    demoCard4: 'لوحة CRM', demoCard4d: 'ذكاء سلوكي فوري ومحفزات مبيعات',
    demoCta: 'ابدأ العرض الكامل',

    indTitle: 'مصمم لقطاعك',
    indSub: 'ثلاث مسارات متخصصة، منصة واحدة',
    ind1t: 'مطورو العقارات', ind1d: 'تسريع مبيعات على مستوى المحفظة. بوابات مشتري VIP، تحليلات سلوكية، ذكاء CRM.',
    ind1cta: 'حلول المطورين', ind1tags: ['بوابات VIP', 'تحليلات سلوكية', 'تكامل CRM', 'خطط الدفع'],
    ind2t: 'وكلاء العقارات', ind2d: 'تأهيل الوكلاء، روابط العقارات، التقاط العملاء في المعارض.',
    ind2cta: 'حلول الوكلاء', ind2tags: ['بطاقات الوكلاء', 'التقاط العملاء', 'QR للمعارض', 'تحكم الوسيط'],
    ind3t: 'بطاقات NFC مؤسسية', ind3d: 'بطاقات معدنية فاخرة وذهب ٢٤ قيراط وخيزران مع ترميز مخصص.',
    ind3cta: 'البطاقات المؤسسية', ind3tags: ['معدن وذهب', 'طلبات جماعية', 'إدارة الفرق', 'تحليلات'],

    featTitle: 'منصة بمستوى المؤسسات', featSub: 'كل ما تحتاجه، لا شيء لا تحتاجه',
    feat1t: 'ذكاء الهوية أولاً', feat1d: 'اعرف مَن يتصفح قبل أن تعرف ماذا يفعل. نقر NFC = VIP مُسمّى بسياق سلوكي كامل.',
    feat2t: 'تحليلات سلوكية', feat2d: 'لوحات فورية تتتبع المشاهدات وطلبات التسعير والمقارنات والحجوزات.',
    feat3t: 'محفزات المبيعات', feat3d: '"لماذا تتصل الآن؟" أسباب تواصل تلقائية بناءً على سلوك VIP.',
    feat4t: 'ثنائي اللغة EN/AR + RTL', feat4d: 'دعم عربي كامل بمصطلحات عقارية احترافية.',
    feat5t: 'خصوصية بالتصميم', feat5d: 'النقر الفعلي = موافقة صريحة. لا مراقبة.',
    feat6t: 'عمليات كندية', feat6d: 'مقرنا في فانكوفر. إدارة حسابات مخصصة للمطورين الخليجيين.',

    procTitle: 'من التجربة إلى التوسع', procSub: 'عملية مثبتة من ٤ خطوات',
    proc1t: 'مكالمة الاكتشاف', proc1d: 'نقيّم محفظتك ونقاط الألم والنطاق. ٣٠ دقيقة.',
    proc2t: 'إعداد التجربة', proc2d: 'تصميم البوابة، تسليم المحتوى، اختيار قائمة VIP. أسبوعان.',
    proc3t: 'توصيل الصندوق الفاخر', proc3d: 'ترميز بطاقات NFC وتجميع الصناديق وتوصيلها لعملائك المختارين.',
    proc4t: 'مراجعة ٩٠ يوم', proc4d: 'قياس ارتفاع حجوزات المعاينة وسرعة القرار مقابل المجموعة الضابطة.',

    priceTitle: 'تسعير المؤسسات',
    priceSub: 'برامج التجربة تبدأ من ٤,٨٠٠ دولار لـ ٢٥ بطاقة VIP مع بوابة كاملة ولوحة تحكم.',
    priceCta: 'احصل على عرض مخصص',

    faqTitle: 'الأسئلة الشائعة',
    faq1q: 'هل يحل محل CRM؟', faq1a: 'لا. يعمل فوق نظامك الحالي ويعززه بالذكاء السلوكي.',
    faq2q: 'هل متوافق مع الخصوصية؟', faq2a: 'نعم. النقر الفعلي هو أقصى موافقة. الدعوات مقصودة والوصول مُتحكم.',
    faq3q: 'ما مقياس نجاح التجربة؟', faq3a: 'زيادة حجوزات المعاينة بين مدعوي VIP مقابل المجموعة الضابطة.',
    faq4q: 'هل يحتاج المشتري تطبيق؟', faq4a: 'لا. نقرة أو مسح QR يفتح البوابة فوراً في المتصفح.',
    faq5q: 'كم مدة التجربة؟', faq5a: '٩٠ يوم من توصيل الصناديق. تشمل إعداد البوابة وإنتاج البطاقات ومراجعة كاملة.',
    faq6q: 'هل يمكن تخصيص البوابة لكل مشروع؟', faq6a: 'نعم. كل مشروع يحصل على بوابة مخصصة بعلامته التجارية.',

    ctaFinalTitle: 'مستعد لتسريع مبيعاتك؟',
    ctaFinalSub: 'شاهد العرض المباشر أو جدول مكالمة اكتشاف مع فريقنا.',
    ctaFinalPrimary: 'ابدأ العرض المباشر', ctaFinalSecondary: 'تحدث للمبيعات',

    footProduct: 'المنتج', footEnterprise: 'المؤسسات', footNfcCards: 'بطاقات NFC',
    footContact: 'تواصل مع المبيعات', footAccount: 'الحساب', footCreateCard: 'إنشاء بطاقة',
    footLogin: 'تسجيل الدخول', footSignup: 'إنشاء حساب', footDev: 'المطورين', footRe: 'العقارات',
    footCopy: '© 2026 DynamicNFC Software Inc. جميع الحقوق محفوظة.',
  },
};

/* ── Components ── */
function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`hp-faq-item ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <div className="hp-faq-q"><span>{question}</span>
        <svg className="hp-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
      <div className="hp-faq-a"><p>{answer}</p></div>
    </div>
  );
}

function CardFlipHero({ frontImg, backImg, onClick }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="hp-card-float">
      <div className="hp-card-shadow" />
      <div className={`hp-flip-container${flipped ? ' flipped' : ''}`}
        onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)} onClick={onClick}>
        <div className="hp-flip-inner">
          <div className="hp-flip-face hp-flip-front"><img src={frontImg} alt="DynamicNFC Card Front" className="hp-card-img" /></div>
          <div className="hp-flip-face hp-flip-back"><img src={backImg} alt="DynamicNFC Card Back" className="hp-card-img" /></div>
        </div>
      </div>
    </div>
  );
}

const Arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const Check = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => { const n = navigator.language || 'en'; return n.startsWith('ar') ? 'ar' : 'en'; });
  const [openFaq, setOpenFaq] = useState(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('hp-vis'); }), { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.hp-rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang]);

  const faqs = [
    { q: 'faq1q', a: 'faq1a' }, { q: 'faq2q', a: 'faq2a' }, { q: 'faq3q', a: 'faq3a' },
    { q: 'faq4q', a: 'faq4a' }, { q: 'faq5q', a: 'faq5a' }, { q: 'faq6q', a: 'faq6a' },
  ];

  return (
    <div className="hp-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="hp-bg-mesh" />

      {/* ════════ NAVBAR ════════ */}
      <nav className="hp-nav">
        <div className="hp-nav-inner">
          <Link to="/" className="hp-logo">Dynamic<span>NFC</span></Link>
          <div className="hp-nav-links">
            <Link to="/" className="hp-nav-active">{t('home')}</Link>
            <Link to="/enterprise">{t('enterprise')}</Link>
            <Link to="/nfc-cards">{t('nfcCards')}</Link>
          </div>
          <div className="hp-nav-right">
            <div className="hp-lang">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>ع</button>
            </div>
            <Link to="/login" className="hp-nav-btn">{t('login')}</Link>
          </div>
        </div>
      </nav>

      {/* ════════ HERO — Developer-led + NFC secondary ════════ */}
      <section className="hp-hero">
        <div className="hp-hero-content">
          <div className="hp-hero-text">
            <div className="hp-badge"><span className="hp-badge-dot" />{t('badge')}</div>
            <h1 className="hp-hero-title">
              {t('heroLine1')}<br />
              <em>{t('heroLine2')}</em><br />
              {t('heroLine3')}
            </h1>
            <p className="hp-hero-sub">{t('heroSub')}</p>
            <div className="hp-hero-ctas">
              <button onClick={() => navigate('/enterprise/crmdemo')} className="hp-btn-primary">{Arrow}{t('ctaPrimary')}</button>
              <button onClick={() => navigate('/contact-sales')} className="hp-btn-ghost">{t('ctaSecondary')}</button>
            </div>
            <p className="hp-hero-note">{t('heroNote')}</p>
          </div>
          <div className="hp-hero-visual">
            <CardFlipHero frontImg={cardFrontImg} backImg={cardBackImg} onClick={() => navigate('/nfc-cards')} />
          </div>
        </div>
      </section>

      {/* ════════ STATS BAR ════════ */}
      <div className="hp-stats-bar">
        {[{ v: t('stat1v'), l: t('stat1l') }, { v: t('stat2v'), l: t('stat2l') }, { v: t('stat3v'), l: t('stat3l') }].map((s, i) => (
          <div className="hp-stat" key={i}><span className="hp-stat-v">{s.v}</span><span className="hp-stat-l">{s.l}</span></div>
        ))}
      </div>

      {/* ════════ THE BLIND SPOT + THE SHIFT ════════ */}
      <section className="hp-section hp-rv">
        <div className="hp-narrative">
          <div className="hp-narr-block">
            <div className="hp-narr-accent red" />
            <h2>{t('blindTitle')}</h2>
            <h3>{t('blindSub')}</h3>
            <p>{t('blindDesc')}</p>
          </div>
          <div className="hp-narr-block">
            <div className="hp-narr-accent blue" />
            <h2>{t('shiftTitle')}</h2>
            <h3>{t('shiftSub')}</h3>
            <p>{t('shiftDesc')}</p>
          </div>
        </div>
      </section>

      {/* ════════ LIVE DEMO PREVIEW ════════ */}
      <section className="hp-section hp-section-full hp-demo-sec hp-rv">
        <div className="hp-section-header"><h2>{t('demoTitle')}</h2><p>{t('demoSub')}</p></div>
        <div className="hp-demo-grid">
          {[
            { t: t('demoCard1'), d: t('demoCard1d'), path: '/enterprise/crmdemo/khalid', emoji: '🔑', color: '#C5A467' },
            { t: t('demoCard2'), d: t('demoCard2d'), path: '/enterprise/crmdemo/ahmed', emoji: '👨‍👩‍👧', color: '#2ec4b6' },
            { t: t('demoCard3'), d: t('demoCard3d'), path: '/enterprise/crmdemo/marketplace', emoji: '🌐', color: '#457b9d' },
            { t: t('demoCard4'), d: t('demoCard4d'), path: '/enterprise/crmdemo/dashboard', emoji: '📊', color: '#e63946' },
          ].map((card, i) => (
            <Link to={card.path} className="hp-demo-card" key={i}>
              <div className="hp-demo-emoji" style={{ background: `${card.color}12`, borderColor: `${card.color}30` }}>{card.emoji}</div>
              <h4>{card.t}</h4>
              <p>{card.d}</p>
              <span className="hp-demo-arrow" style={{ color: card.color }}>→</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => navigate('/enterprise/crmdemo')} className="hp-btn-primary hp-btn-lg">{Arrow}{t('demoCta')}</button>
        </div>
      </section>

      {/* ════════ INDUSTRY TILES ════════ */}
      <section className="hp-section hp-rv">
        <div className="hp-section-header"><h2>{t('indTitle')}</h2><p>{t('indSub')}</p></div>
        <div className="hp-ind-grid">
          {[
            { k: 'ind1', icon: '🏗️', c: 'blue', nav: '/developers' },
            { k: 'ind2', icon: '🏠', c: 'red', nav: '/real-estate' },
            { k: 'ind3', icon: '💳', c: 'gold', nav: '/nfc-cards' },
          ].map((ind, i) => (
            <div className={`hp-ind-card hp-ind-${ind.c}`} key={i}>
              <div className="hp-ind-emoji">{ind.icon}</div>
              <h3>{t(ind.k + 't')}</h3>
              <p>{t(ind.k + 'd')}</p>
              <div className="hp-ind-tags">{(TR[lang]?.[ind.k + 'tags'] || TR.en[ind.k + 'tags']).map((tag, j) => <span key={j}>{tag}</span>)}</div>
              <button onClick={() => navigate(ind.nav)} className="hp-ind-cta">{t(ind.k + 'cta')} →</button>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ FEATURES GRID ════════ */}
      <section className="hp-section hp-rv">
        <div className="hp-section-header"><h2>{t('featTitle')}</h2><p>{t('featSub')}</p></div>
        <div className="hp-feat-grid">
          {[
            { k: 'feat1', emoji: '🔑', c: 'red' }, { k: 'feat2', emoji: '📊', c: 'blue' },
            { k: 'feat3', emoji: '⚡', c: 'gold' }, { k: 'feat4', emoji: '🌍', c: 'blue' },
            { k: 'feat5', emoji: '🛡️', c: 'red' }, { k: 'feat6', emoji: '🍁', c: 'blue' },
          ].map((f, i) => (
            <div className="hp-feat" key={i}>
              <div className={`hp-feat-icon ${f.c}`}>{f.emoji}</div>
              <h4>{t(f.k + 't')}</h4>
              <p>{t(f.k + 'd')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ PROCESS TIMELINE ════════ */}
      <section className="hp-section hp-rv">
        <div className="hp-section-header"><h2>{t('procTitle')}</h2><p>{t('procSub')}</p></div>
        <div className="hp-timeline">
          {[{ n: '01', k: 'proc1' }, { n: '02', k: 'proc2' }, { n: '03', k: 'proc3' }, { n: '04', k: 'proc4' }].map((s, i) => (
            <div className="hp-tl-step" key={i}>
              <div className="hp-tl-num">{s.n}</div>
              {i < 3 && <div className="hp-tl-line" />}
              <h4>{t(s.k + 't')}</h4>
              <p>{t(s.k + 'd')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section className="hp-section hp-section-narrow hp-rv">
        <div className="hp-pricing-box">
          <h2>{t('priceTitle')}</h2>
          <p>{t('priceSub')}</p>
          <button onClick={() => navigate('/contact-sales')} className="hp-btn-primary">{Arrow}{t('priceCta')}</button>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="hp-section hp-section-narrow hp-rv">
        <div className="hp-section-header"><h2>{t('faqTitle')}</h2></div>
        <div className="hp-faq-list">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={t(f.q)} answer={t(f.a)} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="hp-cta-section hp-rv">
        <div className="hp-cta-inner">
          <h2>{t('ctaFinalTitle')}</h2>
          <p>{t('ctaFinalSub')}</p>
          <div className="hp-cta-btns">
            <button onClick={() => navigate('/enterprise/crmdemo')} className="hp-btn-primary hp-btn-lg">{Arrow}{t('ctaFinalPrimary')}</button>
            <button onClick={() => navigate('/contact-sales')} className="hp-btn-ghost-dark">{t('ctaFinalSecondary')}</button>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand"><Link to="/" className="hp-logo">Dynamic<span>NFC</span></Link></div>
          <div className="hp-footer-cols">
            <div className="hp-footer-col">
              <h5>{t('footProduct')}</h5>
              <Link to="/enterprise">{t('footEnterprise')}</Link>
              <Link to="/nfc-cards">{t('footNfcCards')}</Link>
              <Link to="/contact-sales">{t('footContact')}</Link>
              <Link to="/developers">{t('footDev')}</Link>
              <Link to="/real-estate">{t('footRe')}</Link>
            </div>
            <div className="hp-footer-col">
              <h5>{t('footAccount')}</h5>
              <Link to="/create-card">{t('footCreateCard')}</Link>
              <Link to="/login">{t('footLogin')}</Link>
              <Link to="/login">{t('footSignup')}</Link>
            </div>
          </div>
        </div>
        <div className="hp-footer-bottom"><p>{t('footCopy')}</p></div>
      </footer>
    </div>
  );
}
