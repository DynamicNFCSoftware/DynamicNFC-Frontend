import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ContactSales.css';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   Contact Sales — Inquiry Page
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    /* Hero */
    heroBadge:'Let\'s Talk',
    heroTitle:'Tell Us What You\'re Building. We\'ll Show You How to Sell It Faster.',
    heroSub:'Whether you\'re launching a tower, running a brokerage, or scaling across a portfolio — we\'ll design a VIP buyer experience pilot matched to your project.',

    /* Trust bar */
    trust1:'24hr Response', trust2:'No Commitment', trust3:'Custom Pilot Design', trust4:'NDA Available',

    /* Form section */
    formTitle:'Start the Conversation',
    formSub:'Fill out the form below and our team will get back to you within 24 hours with a personalized recommendation.',

    /* Form sections */
    sec1:'Contact Information',
    sec2:'About Your Business',
    sec3:'Your Project',
    sec4:'What\'s Your Biggest Sales Challenge?',

    /* Labels */
    lblName:'Full Name', lblEmail:'Email', lblPhone:'Phone', lblCity:'City / Market',
    lblCompany:'Company / Brokerage', lblRole:'Your Role', lblTeamSize:'Team Size',
    lblIndustry:'Industry Focus',
    lblProjectName:'Project or Campaign Name', lblProjectType:'Project Type',
    lblUnits:'Total Units / Listings', lblTimeline:'Target Launch',
    lblChallenge:'Primary Challenge', lblBudget:'Pilot Budget Range',
    lblNotes:'Anything else we should know?',
    lblNotesPlaceholder:'Tell us about your current sales process, buyer list, goals, or questions...',

    /* Select options */
    rolePlaceholder:'Select role',
    roleOpts:['VP of Sales','Director of Sales','Sales Manager','Broker / Owner','Marketing Director','CEO / Chairman','General Manager','Agent / Team Lead','Other'],
    teamPlaceholder:'Select',
    teamOpts:['Just me','2 – 10','11 – 50','50 – 200','200+'],
    industryPlaceholder:'Select focus',
    industryOpts:['Pre-Construction / New Development','Luxury Resale','Brokerage / Team','Master-Planned Community','Branded Residences','Mixed-Use Development','Commercial Real Estate','Other'],
    projectPlaceholder:'Select type',
    projectOpts:['Residential Tower','Luxury Resale ($2M+)','Master-Planned Community','Branded Residences','Brokerage VIP Campaign','Mixed-Use Development','Commercial','Other'],
    unitsPlaceholder:'Select range',
    unitsOpts:['Under 50','50 – 200','200 – 500','500 – 2,000','2,000+','N/A'],
    timelinePlaceholder:'Select timeline',
    timelineOpts:['Immediately','1 – 3 months','3 – 6 months','6+ months','Just exploring'],
    challengePlaceholder:'Select challenge',
    challengeOpts:['Anonymous website traffic — can\'t identify buyers','Too slow from interest to first contact','Generic outreach — one pitch for all buyers','Low conversion from leads to booked viewings','Sales team lacks buyer context on calls','Need premium positioning for luxury listings','Engaging international / remote buyers','No portfolio-level buyer intelligence','Repeated setup costs per project launch','Other'],
    budgetPlaceholder:'Select range',
    budgetOpts:['Under $100,000','$100,000 – $250,000','$250,000 – $500,000','$500,000+','Need guidance'],

    /* Submit */
    submit:'Submit Inquiry →', submitting:'Submitting...',
    formNote:'We respond within 24 hours. Your information is kept strictly confidential.',

    /* Success */
    successTitle:'Inquiry Submitted',
    successDesc:'Thank you. Our sales team will review your details and reach out within 24 hours with a personalized pilot recommendation.',
    successBack:'← Back to Home', successAnother:'Submit Another Inquiry',

    /* Sidebar */
    sideTitle:'What Happens Next?',
    side1Title:'We Review', side1Desc:'Our team reviews your submission and matches you with the right specialist — developers, brokerages, or luxury teams.',
    side2Title:'Discovery Call', side2Desc:'A 20-minute call to understand your sales process, buyer profiles, and project goals. No pitch — just questions.',
    side3Title:'Custom Proposal', side3Desc:'Within 48 hours, you receive a tailored pilot plan — portal design, VIP Access Key count, timeline, and pricing.',
    side4Title:'Launch', side4Desc:'2–4 weeks from approval to first cards in the hands of your VIP prospects.',
    sideQuote:'"You are not handing out NFC cards. You are issuing private invitations — and turning digital intent into real sales momentum."',

    /* Footer */
    footerText:'© 2025 DynamicNFC — Sales Velocity Engine for Real Estate',
  },

  ar: {
    heroBadge:'لنتحدث',
    heroTitle:'أخبرنا ماذا تبني. سنريك كيف تبيعه أسرع.',
    heroSub:'سواء كنت تطلق برجاً أو تدير وساطة أو تتوسع عبر محفظة — سنصمم تجربة VIP تجريبية تناسب مشروعك.',
    trust1:'رد خلال 24 ساعة', trust2:'بدون التزام', trust3:'تصميم تجربة مخصص', trust4:'اتفاقية سرية متاحة',
    formTitle:'ابدأ المحادثة',
    formSub:'املأ النموذج أدناه وسيعود فريقنا إليك خلال 24 ساعة بتوصية مخصصة.',
    sec1:'معلومات الاتصال', sec2:'عن عملك', sec3:'مشروعك', sec4:'ما أكبر تحدي مبيعات لديك؟',
    lblName:'الاسم الكامل', lblEmail:'البريد الإلكتروني', lblPhone:'الهاتف', lblCity:'المدينة / السوق',
    lblCompany:'الشركة / الوساطة', lblRole:'دورك', lblTeamSize:'حجم الفريق', lblIndustry:'التركيز الصناعي',
    lblProjectName:'اسم المشروع أو الحملة', lblProjectType:'نوع المشروع',
    lblUnits:'إجمالي الوحدات', lblTimeline:'موعد الإطلاق المستهدف',
    lblChallenge:'التحدي الرئيسي', lblBudget:'ميزانية التجربة',
    lblNotes:'أي شيء آخر يجب أن نعرفه؟',
    lblNotesPlaceholder:'أخبرنا عن عملية مبيعاتك الحالية، قائمة المشترين، الأهداف، أو الأسئلة...',
    rolePlaceholder:'اختر الدور',
    roleOpts:['نائب رئيس المبيعات','مدير المبيعات','مدير مبيعات','وسيط / مالك','مدير التسويق','رئيس تنفيذي','مدير عام','وكيل / قائد فريق','أخرى'],
    teamPlaceholder:'اختر',
    teamOpts:['أنا فقط','2 – 10','11 – 50','50 – 200','200+'],
    industryPlaceholder:'اختر التركيز',
    industryOpts:['ما قبل البناء / تطوير جديد','إعادة بيع فاخر','وساطة / فريق','مجتمع مخطط','مساكن ذات علامة','تطوير متعدد الاستخدامات','عقارات تجارية','أخرى'],
    projectPlaceholder:'اختر النوع',
    projectOpts:['برج سكني','إعادة بيع فاخر (2M+)','مجتمع مخطط','مساكن ذات علامة','حملة VIP للوساطة','تطوير متعدد الاستخدامات','تجاري','أخرى'],
    unitsPlaceholder:'اختر النطاق',
    unitsOpts:['أقل من 50','50 – 200','200 – 500','500 – 2,000','2,000+','لا ينطبق'],
    timelinePlaceholder:'اختر الجدول',
    timelineOpts:['فوراً','1 – 3 أشهر','3 – 6 أشهر','6+ أشهر','مجرد استكشاف'],
    challengePlaceholder:'اختر التحدي',
    challengeOpts:['زوار موقع مجهولون','بطء من الاهتمام إلى أول اتصال','تواصل عام — نفس العرض للجميع','تحويل منخفض من العملاء إلى معاينات','فريق المبيعات يفتقر السياق','حاجة لتموضع فاخر','التعامل مع مشترين دوليين','لا ذكاء على مستوى المحفظة','تكاليف إعداد متكررة','أخرى'],
    budgetPlaceholder:'اختر النطاق',
    budgetOpts:['أقل من 5,000$','5,000$ – 15,000$','15,000$ – 50,000$','50,000$+','أحتاج توجيه'],
    submit:'إرسال الاستفسار →', submitting:'جارٍ الإرسال...',
    formNote:'نرد خلال 24 ساعة. معلوماتك سرية تماماً.',
    successTitle:'تم إرسال الاستفسار',
    successDesc:'شكراً لك. سيراجع فريق المبيعات تفاصيلك ويتواصل خلال 24 ساعة.',
    successBack:'← العودة للرئيسية', successAnother:'إرسال استفسار آخر',
    sideTitle:'ماذا يحدث بعد ذلك؟',
    side1Title:'نراجع', side1Desc:'فريقنا يراجع طلبك ويطابقك مع الأخصائي المناسب.',
    side2Title:'مكالمة اكتشاف', side2Desc:'مكالمة 20 دقيقة لفهم عملية مبيعاتك وملفات المشترين والأهداف.',
    side3Title:'اقتراح مخصص', side3Desc:'خلال 48 ساعة، تتلقى خطة تجربة مفصلة — تصميم البوابة، عدد مفاتيح VIP، الجدول، والتسعير.',
    side4Title:'إطلاق', side4Desc:'2-4 أسابيع من الموافقة إلى أول بطاقات في أيدي عملاء VIP.',
    sideQuote:'"أنت لا توزع بطاقات NFC. أنت تصدر دعوات خاصة — وتحوّل النية الرقمية إلى زخم مبيعات حقيقي."',
    footerText:'© 2025 DynamicNFC — محرك تسريع المبيعات للعقارات',
  },
};

export default function ContactSales() {
  const [lang, setLang] = useState('en');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  useEffect(() => {
    const els = document.querySelectorAll('.cs-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    data.submitted = new Date().toISOString();
    data._subject = `Sales Inquiry — ${data.name} / ${data.company || 'Individual'}`;
    try {
      await fetch('https://formsubmit.co/ajax/info@dynamicnfc.help', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { alert('Error submitting. Please try again.'); }
    setSubmitting(false);
  };

  const resetForm = () => { setSuccess(false); formRef.current?.reset(); };

  const Select = ({ label, name, placeholder, options, required }) => (
    <div className="cs-field">
      <label className="cs-label">{label} {required && <span className="cs-req">*</span>}</label>
      <select className="cs-select" name={name} required={required} defaultValue="">
        <option value="" disabled>{placeholder}</option>
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const Input = ({ label, name, type = 'text', placeholder, required }) => (
    <div className="cs-field">
      <label className="cs-label">{label} {required && <span className="cs-req">*</span>}</label>
      <input className="cs-input" type={type} name={name} placeholder={placeholder} required={required} />
    </div>
  );

  return (
    <div className="cs-page" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* NAV */}
      <nav className="cs-nav">
        <div className="cs-nav-inner">
          <Link to="/" className="cs-nav-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="cs-nav-icon">
              <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
              <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" />
            </svg>
            <span>Dynamic<span>NFC</span></span>
          </Link>
          <div className="cs-nav-right">
            <div className="cs-lang">
              <button className={`cs-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`cs-lang-btn${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>ع</button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="cs-hero">
        <div className="cs-hero-badge">{t('heroBadge')}</div>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSub')}</p>
      </section>

      {/* TRUST BAR */}
      <div className="cs-trust-bar cs-reveal">
        {['trust1','trust2','trust3','trust4'].map(k => (
          <div className="cs-trust-item" key={k}>
            <div className="cs-trust-dot" />
            <span>{t(k)}</span>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="cs-main">
        {/* LEFT — FORM */}
        <div className="cs-form-col cs-reveal">
          <h2>{t('formTitle')}</h2>
          <p className="cs-form-sub">{t('formSub')}</p>

          {!success ? (
            <form className="cs-form" ref={formRef} onSubmit={handleSubmit}>
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="form_type" value="contact_sales" />

              {/* Section 1: Contact */}
              <div className="cs-section-label">{t('sec1')}</div>
              <div className="cs-row">
                <Input label={t('lblName')} name="name" required />
                <Input label={t('lblEmail')} name="email" type="email" required />
              </div>
              <div className="cs-row">
                <Input label={t('lblPhone')} name="phone" type="tel" />
                <Input label={t('lblCity')} name="city" placeholder="e.g. Vancouver, Dubai" />
              </div>

              {/* Section 2: Business */}
              <div className="cs-divider" />
              <div className="cs-section-label">{t('sec2')}</div>
              <div className="cs-row">
                <Input label={t('lblCompany')} name="company" required />
                <Select label={t('lblRole')} name="role" placeholder={t('rolePlaceholder')} options={t('roleOpts')} required />
              </div>
              <div className="cs-row">
                <Select label={t('lblTeamSize')} name="teamSize" placeholder={t('teamPlaceholder')} options={t('teamOpts')} />
                <Select label={t('lblIndustry')} name="industry" placeholder={t('industryPlaceholder')} options={t('industryOpts')} />
              </div>

              {/* Section 3: Project */}
              <div className="cs-divider" />
              <div className="cs-section-label">{t('sec3')}</div>
              <div className="cs-row">
                <Input label={t('lblProjectName')} name="project" />
                <Select label={t('lblProjectType')} name="projectType" placeholder={t('projectPlaceholder')} options={t('projectOpts')} />
              </div>
              <div className="cs-row">
                <Select label={t('lblUnits')} name="units" placeholder={t('unitsPlaceholder')} options={t('unitsOpts')} />
                <Select label={t('lblTimeline')} name="timeline" placeholder={t('timelinePlaceholder')} options={t('timelineOpts')} />
              </div>

              {/* Section 4: Challenge */}
              <div className="cs-divider" />
              <div className="cs-section-label">{t('sec4')}</div>
              <div className="cs-row single">
                <Select label={t('lblChallenge')} name="challenge" placeholder={t('challengePlaceholder')} options={t('challengeOpts')} />
              </div>
              <div className="cs-row single">
                <Select label={t('lblBudget')} name="budget" placeholder={t('budgetPlaceholder')} options={t('budgetOpts')} />
              </div>
              <div className="cs-row single">
                <div className="cs-field full">
                  <label className="cs-label">{t('lblNotes')}</label>
                  <textarea className="cs-textarea" name="notes" placeholder={t('lblNotesPlaceholder')} />
                </div>
              </div>

              <button type="submit" className="cs-submit" disabled={submitting}>
                {submitting ? t('submitting') : t('submit')}
              </button>
              <p className="cs-note">{t('formNote')}</p>
            </form>
          ) : (
            <div className="cs-success">
              <div className="cs-success-icon">✓</div>
              <h3>{t('successTitle')}</h3>
              <p>{t('successDesc')}</p>
              <div className="cs-success-actions">
                <Link to="/" className="cs-btn-secondary">{t('successBack')}</Link>
                <button className="cs-btn-primary" onClick={resetForm}>{t('successAnother')}</button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — SIDEBAR */}
        <aside className="cs-sidebar cs-reveal">
          <h3>{t('sideTitle')}</h3>
          <div className="cs-steps">
            {[1, 2, 3, 4].map(i => (
              <div className="cs-step" key={i}>
                <div className="cs-step-num">{i}</div>
                <div className="cs-step-content">
                  <h4>{t(`side${i}Title`)}</h4>
                  <p>{t(`side${i}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
          <blockquote className="cs-quote">{t('sideQuote')}</blockquote>

          <div className="cs-sidebar-contact">
            <div className="cs-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:info@dynamicnfc.help">info@dynamicnfc.help</a>
            </div>
            <div className="cs-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <a href="https://dynamicnfc.ca" target="_blank" rel="noopener noreferrer">dynamicnfc.ca</a>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="cs-footer">
        <p>© 2025 <a href="https://dynamicnfc.ca">DynamicNFC</a> — {lang === 'ar' ? 'محرك تسريع المبيعات للعقارات' : 'Sales Velocity Engine for Real Estate'}</p>
      </footer>
    </div>
  );
}
