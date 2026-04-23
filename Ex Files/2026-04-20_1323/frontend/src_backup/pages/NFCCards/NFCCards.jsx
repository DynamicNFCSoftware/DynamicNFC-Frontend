import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './NFCCards.css';
import SEO from '../../components/SEO/SEO';

/* ── Card images: update these paths to your actual assets ── */
import cardFrontImg from './assets/card-front.jpg';
import cardBackImg from './assets/card-back.jpg';

/* ═══════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    /* Nav */
    home: 'Home', enterprise: 'Enterprise', nfcCards: 'NFC Cards', login: 'Login',
    /* Hero */
    badge: 'Premium NFC Technology',
    heroTitle: 'The Last Business Card\nYou\'ll Ever Need',
    heroSub: 'Handcrafted from brushed metal, 24K gold, bamboo, and premium PVC. Your entire professional identity — shared in one tap.',
    heroCta: 'Order Your Card',
    heroSecondary: 'Explore Materials',
    flipHint: 'Hover to flip · Tap on mobile',
    /* Stats */
    stat1v: '12+', stat1l: 'Card Types',
    stat2v: '40+', stat2l: 'Countries',
    stat3v: '< 1s', stat3l: 'Tap to Share',
    stat4v: '0', stat4l: 'Apps Required',
    /* How it works */
    howTitle: 'How It Works',
    howSub: 'Three steps to your premium identity',
    step1t: 'Choose Your Material', step1d: 'Select from premium PVC, brushed metal, 24K gold, bamboo, or walnut. Each material is crafted for a distinct impression.',
    step2t: 'Personalize Your Card', step2d: 'Add your name, logo, and QR link. Our system encodes your NFC chip with your complete digital profile.',
    step3t: 'Tap & Share Instantly', step3d: 'Hold your card to any smartphone. Your contact info, portfolio, or website opens instantly — no app needed.',
    /* Benefits */
    benTitle: 'Why DynamicNFC',
    benSub: 'Built for professionals who demand more',
    ben1t: 'NFC + QR Dual Access', ben1d: 'Every card carries both NFC chip and QR code. Works with any modern smartphone — iPhone, Android, or tablet.',
    ben2t: 'Premium Materials', ben2d: 'Brushed metal with 24K gold accents, natural bamboo, walnut wood, and premium PVC in 5 finishes.',
    ben3t: 'Real-Time Analytics', ben3d: 'Track every tap, scan, and interaction. Know who viewed your profile, when, and what they clicked.',
    ben4t: 'No App Required', ben4d: 'Your recipients never need to download anything. One tap opens your profile directly in their browser.',
    ben5t: 'Made in Canada', ben5d: 'Designed, engineered, and shipped from Canada. Premium quality with 40+ country shipping.',
    ben6t: 'CRM Integration', ben6d: 'Connect with Salesforce, HubSpot, or any CRM. Every contact captured flows into your pipeline automatically.',
    /* Materials */
    matTitle: 'Crafted Materials',
    matSub: 'Choose the finish that defines your presence',
    matPvc: 'Premium PVC', matMetal: 'Brushed Metal', matEco: 'Natural Eco',
    matPvcDesc: 'Lightweight, durable, and available in 5 finishes — White, Black, Gold, Silver, and Transparent.',
    matMetalDesc: 'Substantial weight and brushed texture. Available in Gold, Silver, Black, Rose Gold, and 24K.',
    matEcoDesc: 'Sustainable bamboo and walnut wood. A natural statement with full NFC capability.',
    /* FAQ */
    faqTitle: 'Frequently Asked Questions',
   faq1q: 'What are your production and delivery timelines?',
faq1a: 'DynamicNFC specializes in bulk and enterprise orders. Production timelines are confirmed after reviewing order volume, material selection, and customization requirements. Delivery estimates are provided upon quote approval.',

faq2q: 'Do recipients need an app?',
faq2a: 'No. When someone taps your card or scans the QR code, your digital profile opens instantly in their browser. No apps, no downloads, no friction.',

faq3q: 'Is DynamicNFC subscription-based?',
faq3a: 'No subscription is required for standard cards. You purchase your NFC cards based on your required quantity. Optional advanced features and team management tools are available for enterprise clients.',

faq4q: 'Can we update card information after printing?',
faq4a: 'Yes. Each NFC card connects to a secure digital profile that can be updated anytime. Modify contact details, links, branding, or content without reprinting physical cards.',

faq5q: 'Do you offer bulk or team pricing?',
faq5a: 'Yes. DynamicNFC operates on a volume-based pricing model. Pricing is calculated according to order quantity, material selection, and customization scope. Contact info@dynamicnfc.help for a tailored quote.',

faq6q: 'Which phones are compatible?',
faq6a: 'All iPhones from iPhone 7 onward and virtually all modern Android devices support NFC. Additionally, the integrated QR code ensures compatibility with any smartphone equipped with a camera.',
    /* CTA */
    ctaTitle: 'Ready to Elevate Your Identity?',
    ctaSub: 'Join thousands of professionals who have replaced paper cards with premium NFC technology.',
    ctaBtn: 'Design Your Card Now',
    /* Footer */
    footProduct: 'Product', footEnterprise: 'Enterprise', footNfcCards: 'NFC Business Cards',
    footOrderCard: 'Order Card', footAccount: 'Account', footCreateCard: 'Create Card',
    footLogin: 'Log in', footSignup: 'Sign up',
    footCopy: '© 2026 DynamicNFC Card Inc. All Rights Reserved.',
  },
  ar: {
    home: 'الرئيسية', enterprise: 'المؤسسات', nfcCards: 'بطاقات NFC', login: 'تسجيل الدخول',
    badge: "تقنية الاتصال قريب المدى الفاخرة",
    heroTitle: "آخر بطاقة عمل ستحتاجها",
    heroSub: "مصنوعة يدويًا من المعدن المصقول، الذهب عيار 24 قيراط، الخيزران، وPVC فاخر. كل هويتك المهنية — مشتركة بنقرة واحدة.",
    heroCta: "اطلب بطاقتك",
    heroSecondary: "استكشف المواد",
    flipHint: "مرّر للتقليب · انقر على الجوال",
    stat1v: "12+", stat1l: "أنواع البطاقات",
    stat2v: "40+", stat2l: "الدول",
    stat3v: "< 1 ثانية", stat3l: "انقر للمشاركة",
    stat4v: '0', stat4l: "التطبيقات المطلوبة",
    howTitle: "كيف تعمل",
    howSub: "ثلاث خطوات لهويتك الفاخرة",
    step1t: "اختر مادتك", step1d: "اختر من بين PVC الفاخر، المعدن المصقول، الذهب عيار 24 قيراط، الخيزران، أو خشب الجوز. كل مادة مصممة لتترك انطباعًا مميزًا.",
    step2t: "خصص بطاقتك", step2d: "أضف اسمك، شعارك، ورابط QR. يقوم نظامنا بترميز شريحة الاتصال قريب المدى الخاصة بك مع ملفك الرقمي الكامل.",
    step3t: "انقر وشارك فورًا", step3d: "ضع بطاقتك بالقرب من أي هاتف ذكي. تفتح معلومات الاتصال الخاصة بك، محفظتك، أو موقعك فورًا — لا حاجة لتطبيق.",
    benTitle: "لماذا DynamicNFC",
    benSub: "مصممة للمحترفين الذين يطالبون بالمزيد",
    ben1t: "الوصول المزدوج الاتصال قريب المدى + QR", ben1d: "كل بطاقة تحتوي على شريحة الاتصال قريب المدى ورمز QR. تعمل مع أي هاتف ذكي حديث — iPhone، Android، أو جهاز لوحي.",
    ben2t: "مواد فاخرة", ben2d: "معادن مصقولة مع لمسات ذهبية عيار 24 قيراط، خشب خيزران طبيعي، خشب الجوز، وPVC فاخر بخمسة تشطيبات.",
    ben3t: "تحليلات الوقت الحقيقي", ben3d: "تتبع كل نقرة، مسح، وتفاعل. اعرف من شاهد ملفك الشخصي، متى، وما الذي نقر عليه.",
    ben4t: "لا حاجة لتطبيق", ben4d: "المستلمون لا يحتاجون لتنزيل أي شيء. نقرة واحدة تفتح ملفك مباشرة في المتصفح.",
    ben5t: "صنع في كندا", ben5d: "مصممة، ومهندسة، وشحنت من كندا. جودة فائقة وشحن لأكثر من 40 دولة.",
    ben6t: "تكامل إدارة علاقات العملاء", ben6d: "الاتصال بـ Salesforce أو HubSpot أو أي إدارة علاقات العملاء. كل جهة اتصال يتم التقاطها تتدفق تلقائيًا إلى خط أنابيب المبيعات الخاص بك.",
    matTitle: "المواد المصممة",
    matSub: "اختر التشطيب الذي يعكس حضورك",
    matPvc: "PVC فاخر", matMetal: "معدن مصقول", matEco: "Eco طبيعي",
    matPvcDesc: "خفيف الوزن، متين، ومتوافر بخمسة تشطيبات — أبيض، أسود، ذهب، فضة، وشفاف.",
    matMetalDesc: "وزن ملموس وملمس مصقول. متوفر بالذهب، الفضة، الأسود، الوردي، و24 قيراط.",
    matEcoDesc: "خيزران وخشب جوز مستدام. بيان طبيعي مع قدرة الاتصال قريب المدى كاملة.",
    faqTitle: "الأسئلة المتكررة",
    faq1q: "ما هي جداول الإنتاج والتسليم؟",
faq1a: "تختص DynamicNFC بالطلبات الكبيرة والمؤسسية. يتم تأكيد جداول الإنتاج بعد مراجعة حجم الطلب، اختيار المواد، ومتطلبات التخصيص. يتم توفير تقديرات التسليم بعد الموافقة على العرض.",

faq2q: "هل يحتاج المستلمون لتطبيق؟",
faq2a: "لا. عند نقر شخص على بطاقتك أو مسح رمز QR، يفتح ملفك الرقمي مباشرة في المتصفح. لا تطبيقات، لا تنزيلات، بدون أي عوائق.",

faq3q: "هل DynamicNFC يعتمد على الاشتراك؟",
faq3a: "لا تتطلب البطاقات القياسية اشتراكًا. تشتري بطاقات الاتصال قريب المدى حسب الكمية المطلوبة. الميزات المتقدمة وأدوات إدارة الفريق اختيارية للعملاء المؤسسيين.",

faq4q: "هل يمكننا تحديث معلومات البطاقة بعد الطباعة؟",
faq4a: "نعم. كل بطاقة الاتصال قريب المدى تتصل بملف رقمي آمن يمكن تحديثه في أي وقت. يمكنك تعديل بيانات الاتصال، الروابط، العلامة التجارية، أو المحتوى دون إعادة طباعة البطاقات.",

faq5q: "هل تقدمون أسعارًا للطلبات الكبيرة أو الفرق؟",
faq5a: "نعم. تعمل DynamicNFC بنموذج تسعير يعتمد على الكمية. يتم حساب الأسعار وفقًا لكمية الطلب، اختيار المواد، ونطاق التخصيص. اتصل بـ info@dynamicnfc.help لعرض سعر مخصص.",

faq6q: "أي الهواتف متوافقة؟",
faq6a: "جميع أجهزة iPhone من iPhone 7 وما بعده ومعظم أجهزة Android الحديثة تدعم الاتصال قريب المدى. بالإضافة إلى ذلك، يضمن رمز QR المدمج التوافق مع أي هاتف مزود بكاميرا.",
    ctaTitle: "هل أنت مستعد لرفع هويتك المهنية؟",
    ctaSub: "انضم إلى آلاف المحترفين الذين استبدلوا البطاقات الورقية بتقنية الاتصال قريب المدى الفاخرة.",
    ctaBtn: "صمم بطاقتك الآن",
    footProduct: 'المنتج', footEnterprise: 'المؤسسات', footNfcCards: 'بطاقات NFC للأعمال',
    footOrderCard: "اطلب بطاقة", footAccount: 'الحساب', footCreateCard: 'إنشاء بطاقة',
    footLogin: 'تسجيل الدخول', footSignup: 'إنشاء حساب',
    footCopy: '© 2026 DynamicNFC Card Inc. جميع الحقوق محفوظة.',
  },
};

function detectLang() {
  const n = navigator.language || navigator.userLanguage || 'en';
  return n.startsWith('ar') ? 'ar' : 'en';
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

/* ── FAQ Accordion ── */
function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`nfc-faq-item ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <div className="nfc-faq-q">
        <span>{question}</span>
        <svg className="nfc-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className="nfc-faq-a">
        <p>{answer}</p>
      </div>
    </div>
  );
}

/* ── Card Flip ── */
function CardShowcase({ frontImg, backImg, hint, onCardClick }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="nfc-card-showcase">
      <div className="nfc-card-float">
        <div className="nfc-card-shadow" />
        <div
          className={`nfc-flip-container${flipped ? ' flipped' : ''}`}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
          onClick={onCardClick}
        >
          <div className="nfc-flip-inner">
            <div className="nfc-flip-face nfc-flip-front">
              <img src={frontImg} alt="DynamicNFC Card Front" className="nfc-card-img" />
            </div>
            <div className="nfc-flip-face nfc-flip-back">
              <img src={backImg} alt="DynamicNFC Card Back" className="nfc-card-img" />
            </div>
          </div>
        </div>
        <div className="nfc-flip-hint">{hint}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
function NFCCards() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  const faqs = [
    { q: 'faq1q', a: 'faq1a' },
    { q: 'faq2q', a: 'faq2a' },
    { q: 'faq3q', a: 'faq3a' },
    { q: 'faq4q', a: 'faq4a' },
    { q: 'faq5q', a: 'faq5a' },
    { q: 'faq6q', a: 'faq6a' },
  ];

  const benefits = [
    { k: 'ben1', icon: 'nfc', color: 'blue' },
    { k: 'ben2', icon: 'material', color: 'gold' },
    { k: 'ben3', icon: 'analytics', color: 'red' },
    { k: 'ben4', icon: 'phone', color: 'blue' },
    { k: 'ben5', icon: 'maple', color: 'red' },
    { k: 'ben6', icon: 'crm', color: 'blue' },
  ];

  const steps = [
    { k: 'step1', num: '01', icon: 'palette' },
    { k: 'step2', num: '02', icon: 'edit' },
    { k: 'step3', num: '03', icon: 'zap' },
  ];

  return (
    <div className="nfc-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title="NFC Cards" description="Premium NFC VIP Access Keys — physical cards that unlock private digital experiences." path="/nfc-cards" />
      {/* Background */}
      <div className="nfc-bg-mesh" />

      {/* Navbar is now global — rendered in App.jsx */}

      {/* ── Hero ── */}
      <section className="nfc-hero">
        <div className="nfc-hero-content">
          <div className="nfc-hero-text">
            <div className="nfc-badge">
              <span className="nfc-badge-dot" />
              {t('badge')}
            </div>
            <h1 className="nfc-hero-title">
              {t('heroTitle').split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
            <p className="nfc-hero-sub">{t('heroSub')}</p>
            <div className="nfc-hero-ctas">
              <button onClick={() => navigate('/create-physical-card')} className="nfc-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                {t('heroCta')}
              </button>
              <button onClick={() => document.getElementById('nfc-benefits')?.scrollIntoView({ behavior: 'smooth' })} className="nfc-btn-ghost">
                {t('heroSecondary')}
              </button>
            </div>
          </div>
          <CardShowcase
            frontImg={cardFrontImg}
            backImg={cardBackImg}
            hint={t('flipHint')}
            onCardClick={() => navigate('/create-physical-card')}
          />
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="nfc-stats">
        {[['stat1v', 'stat1l'], ['stat2v', 'stat2l'], ['stat3v', 'stat3l'], ['stat4v', 'stat4l']].map(([v, l], i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="nfc-stat-sep" />}
            <div className="nfc-stat">
              <span className="nfc-stat-val">{t(v)}</span>
              <span className="nfc-stat-lbl">{t(l)}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── How It Works ── */}
      <section className="nfc-section">
        <div className="nfc-section-header">
          <h2 className="nfc-section-title">{t('howTitle')}</h2>
          <p className="nfc-section-sub">{t('howSub')}</p>
        </div>
        <div className="nfc-steps">
          {steps.map((s, i) => (
            <div className="nfc-step" key={i} style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
              <div className="nfc-step-num">{s.num}</div>
              <h4>{t(s.k + 't')}</h4>
              <p>{t(s.k + 'd')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="nfc-section" id="nfc-benefits">
        <div className="nfc-section-header">
          <h2 className="nfc-section-title">{t('benTitle')}</h2>
          <p className="nfc-section-sub">{t('benSub')}</p>
        </div>
        <div className="nfc-benefits-grid">
          {benefits.map((b, i) => (
            <div className="nfc-benefit" key={i} style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <div className={`nfc-benefit-icon ${b.color}`}>
                {b.icon === 'nfc' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /></svg>}
                {b.icon === 'material' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /></svg>}
                {b.icon === 'analytics' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
                {b.icon === 'phone' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>}
                {b.icon === 'maple' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>}
                {b.icon === 'crm' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
              </div>
              <h4>{t(b.k + 't')}</h4>
              <p>{t(b.k + 'd')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Materials Preview ── */}
      <section className="nfc-section">
        <div className="nfc-section-header">
          <h2 className="nfc-section-title">{t('matTitle')}</h2>
          <p className="nfc-section-sub">{t('matSub')}</p>
        </div>
        <div className="nfc-materials">
          {[
            { k: 'matPvc', dk: 'matPvcDesc', swatches: ['#f7f6f3', '#1a1a1f', '#ddb528', '#cccccc'], gradient: 'linear-gradient(135deg, rgba(69,123,157,0.06), rgba(69,123,157,0.02))' },
            { k: 'matMetal', dk: 'matMetalDesc', swatches: ['#c9a84c', '#b8b8ba', '#1e1e24', '#dab098', '#ecd050'], gradient: 'linear-gradient(135deg, rgba(184,148,47,0.06), rgba(184,148,47,0.02))' },
            { k: 'matEco', dk: 'matEcoDesc', swatches: ['#d0b478', '#72502e'], gradient: 'linear-gradient(135deg, rgba(22,163,74,0.06), rgba(22,163,74,0.02))' },
          ].map((mat, i) => (
            <div className="nfc-material-card" key={i} style={{ background: mat.gradient }}>
              <div className="nfc-mat-swatches">
                {mat.swatches.map((c, j) => (
                  <div key={j} className="nfc-mat-swatch" style={{ background: c }} />
                ))}
              </div>
              <h4>{t(mat.k)}</h4>
              <p>{t(mat.dk)}</p>
              <button className="nfc-mat-link" onClick={() => navigate('/create-physical-card')}>
                View all →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="nfc-section nfc-section-narrow">
        <div className="nfc-section-header">
          <h2 className="nfc-section-title">{t('faqTitle')}</h2>
        </div>
        <div className="nfc-faq-list">
          {faqs.map((f, i) => (
            <FAQItem
              key={i}
              question={t(f.q)}
              answer={t(f.a)}
              isOpen={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="nfc-cta-section">
        <div className="nfc-cta-inner">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSub')}</p>
          <button onClick={() => navigate('/create-physical-card')} className="nfc-btn-primary nfc-btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            {t('ctaBtn')}
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="nfc-footer">
        <div className="nfc-footer-inner">
          <div className="nfc-footer-brand">
            <Link to="/"><img src="/assets/images/logo.png" alt="DynamicNFC" className="nfc-footer-logo" /></Link>
          </div>
          <div className="nfc-footer-cols">
            <div className="nfc-footer-col">
              <h5>{t('footProduct')}</h5>
              <Link to="/enterprise">{t('footEnterprise')}</Link>
              <Link to="/nfc-cards">{t('footNfcCards')}</Link>
              <Link to="/order-card">{t('footOrderCard')}</Link>
              <Link to="/developers">Developers</Link>
              <Link to="/real-estate">Real Estate</Link>
            </div>
            <div className="nfc-footer-col">
              <h5>{t('footAccount')}</h5>
              <Link to="/create-physical-card">{t('footCreateCard')}</Link>
              <Link to="/login">{t('footLogin')}</Link>
              <Link to="/login">{t('footSignup')}</Link>
            </div>
          </div>
        </div>
        <div className="nfc-footer-bottom">
          <p>{t('footCopy')}</p>
        </div>
      </footer>
    </div>
  );
}

export default NFCCards;
