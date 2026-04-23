import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './ContactSales.css';
import SEO from '../../components/SEO/SEO';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   Contact Sales — Inquiry Page
   ═══════════════════════════════════════════ */
/* ── Industry keys ── */
const IND_RE_DEV = 'real_estate_developer';
const IND_RE_AGENT = 'real_estate_agent';
const IND_AUTO = 'automotive';
const IND_OTHER = 'other';

const TR = {
  en: {
    /* Hero */
    heroBadge:'Let\'s Talk',
    heroTitle:'Tell Us What You\'re Building. We\'ll Show You How to Sell It Faster.',
    heroSub:'Whether you\'re launching a tower, running a brokerage, managing a dealership, or scaling across a portfolio — we\'ll design a VIP experience pilot matched to your business.',

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
    lblCompany:'Company Name', lblRole:'Your Role', lblTeamSize:'Team Size',
    lblIndustrySelect:'Industry',
    lblProjectName:'Project or Campaign Name', lblProjectType:'Project Type',
    lblUnits:'Total Units / Listings', lblTimeline:'Target Launch',
    lblChallenge:'Primary Challenge', lblBudget:'Pilot Budget Range',
    lblNotes:'Anything else we should know?',
    lblNotesPlaceholder:'Tell us about your current sales process, buyer list, goals, or questions...',

    /* Industry selector */
    industrySelectPlaceholder:'Select your industry',
    industrySelectOpts: {
      [IND_RE_DEV]: 'Real Estate Developer',
      [IND_RE_AGENT]: 'Real Estate Agent / Brokerage',
      [IND_AUTO]: 'Automotive',
      [IND_OTHER]: 'Other',
    },

    /* Role options per industry */
    rolePlaceholder:'Select role',
    roleOpts_re_dev:['VP of Sales','Director of Sales','Sales Manager','Marketing Director','CEO / Chairman','General Manager','Other'],
    roleOpts_re_agent:['Broker / Owner','Team Lead','Senior Agent','Marketing Manager','Operations Manager','Other'],
    roleOpts_auto:['Dealer Principal / Owner','General Manager','Sales Manager','Marketing Director','BDC Manager','F&I Manager','Other'],
    roleOpts_other:['CEO / Founder','VP of Sales','Director of Sales','Sales Manager','Marketing Director','Operations Manager','Other'],

    /* Team size (shared) */
    teamPlaceholder:'Select',
    teamOpts:['Just me','2 – 10','11 – 50','50 – 200','200+'],

    /* Project labels per industry */
    lblProjectName_re_dev:'Project or Development Name',
    lblProjectName_re_agent:'Campaign or Listing Name',
    lblProjectName_auto:'Dealership or Campaign Name',
    lblProjectName_other:'Project or Campaign Name',

    /* Project type per industry */
    projectPlaceholder:'Select type',
    projectOpts_re_dev:['Residential Tower','Master-Planned Community','Branded Residences','Mixed-Use Development','Commercial','Other'],
    projectOpts_re_agent:['Luxury Resale ($2M+)','Brokerage VIP Campaign','Team Lead Generation','Open House Enhancement','Portfolio Marketing','Other'],
    projectOpts_auto:['New Vehicle Sales','Pre-Owned / CPO','Service & Retention','VIP Customer Program','Multi-Rooftop Group','Other'],
    projectOpts_other:['Product Launch','VIP Customer Experience','Sales Enablement','Lead Generation','Brand Activation','Other'],

    /* Units per industry */
    lblUnits_re_dev:'Total Units',
    lblUnits_re_agent:'Active Listings',
    lblUnits_auto:'Monthly Volume',
    lblUnits_other:'Scale',
    unitsPlaceholder:'Select range',
    unitsOpts_re_dev:['Under 50','50 – 200','200 – 500','500 – 2,000','2,000+'],
    unitsOpts_re_agent:['1 – 10','11 – 50','50 – 100','100+','N/A'],
    unitsOpts_auto:['Under 50/mo','50 – 150/mo','150 – 500/mo','500+/mo','Multi-location'],
    unitsOpts_other:['Small','Medium','Large','Enterprise','N/A'],

    /* Timeline (shared label, per-industry for auto) */
    lblTimeline_auto:'Target Launch / Season',
    timelinePlaceholder:'Select timeline',
    timelineOpts:['Immediately','1 – 3 months','3 – 6 months','6+ months','Just exploring'],

    /* Challenge per industry */
    challengePlaceholder:'Select challenge',
    challengeOpts_re:['Anonymous website traffic — can\'t identify buyers','Too slow from interest to first contact','Generic outreach — one pitch for all buyers','Low conversion from leads to booked viewings','Sales team lacks buyer context on calls','Need premium positioning for luxury listings','Engaging international / remote buyers','No portfolio-level buyer intelligence','Repeated setup costs per project launch','Other'],
    challengeOpts_auto:['Can\'t differentiate from competing dealers','Low repeat & referral rates','No VIP experience for high-value customers','Service drive retention is weak','Digital leads don\'t convert to showroom visits','Inconsistent follow-up across sales team','No way to track offline engagement','Need to launch CPO or EV campaign fast','Multi-rooftop brand inconsistency','Other'],
    challengeOpts_other:['Anonymous traffic — can\'t identify prospects','Too slow from interest to first contact','Generic outreach — same pitch for everyone','Low conversion from leads to meetings','Sales team lacks prospect context','Need premium brand positioning','Engaging remote / international clients','No portfolio-level intelligence','Other'],

    /* Budget */
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
    side1Title:'We Review', side1Desc:'Our team reviews your submission and matches you with the right specialist — developers, brokerages, dealerships, or luxury teams.',
    side2Title:'Discovery Call', side2Desc:'A 20-minute call to understand your sales process, customer profiles, and project goals. No pitch — just questions.',
    side3Title:'Custom Proposal', side3Desc:'Within 48 hours, you receive a tailored pilot plan — portal design, VIP Access Key count, timeline, and pricing.',
    side4Title:'Launch', side4Desc:'2–4 weeks from approval to first cards in the hands of your VIP prospects.',
    sideQuote:'"You are not handing out NFC cards. You are issuing private invitations — and turning digital intent into real sales momentum."',

    /* Footer */
    footerText:'© 2025 DynamicNFC — Sales Velocity Engine',
  },

  ar: {
    heroBadge:"دعنا نتحدث",
    heroTitle:"أخبرنا بما تقوم ببنائه. وسنوضح لك كيف تبيعه بشكل أسرع.",
    heroSub:"سواء كنت تطلق برجًا، أو تدير شركة وساطة، أو تدير وكالة سيارات، أو توسع أعمالك — سنصمم تجربة تجريبية لكبار الشخصيات تتناسب مع عملك.",
    trust1:"رد خلال 24 ساعة", trust2:"بدون التزام", trust3:"تصميم تجربة مخصصة", trust4:"إمكانية توقيع اتفاقية عدم الإفصاح",
    formTitle:"ابدأ المحادثة",
    formSub:"املأ النموذج أدناه وسيعود فريقنا إليك خلال 24 ساعة بتوصية مخصصة.",
    sec1:"معلومات الاتصال", sec2:"حول عملك", sec3:"مشروعك", sec4:"ما هو أكبر تحدٍ في المبيعات لديك؟",
    lblName:"الاسم الكامل", lblEmail:"البريد الإلكتروني", lblPhone:"الهاتف", lblCity:"المدينة / السوق",
    lblCompany:"اسم الشركة", lblRole:"دورك", lblTeamSize:"حجم الفريق",
    lblIndustrySelect:"القطاع",
    lblProjectName:"اسم المشروع أو الحملة", lblProjectType:"نوع المشروع",
    lblUnits:"إجمالي الوحدات / العروض", lblTimeline:"موعد الإطلاق المستهدف",
    lblChallenge:"التحدي الرئيسي", lblBudget:"نطاق ميزانية التجربة",
    lblNotes:"هل هناك أي شيء آخر يجب أن نعرفه؟",
    lblNotesPlaceholder:"أخبرنا عن عملية البيع الحالية لديك، وقائمة المشترين، والأهداف، أو الأسئلة...",

    /* Industry selector */
    industrySelectPlaceholder:"اختر قطاعك",
    industrySelectOpts: {
      [IND_RE_DEV]: 'مطور عقاري',
      [IND_RE_AGENT]: 'وكيل عقاري / وساطة',
      [IND_AUTO]: 'سيارات',
      [IND_OTHER]: 'أخرى',
    },

    /* Role per industry */
    rolePlaceholder:"اختر الدور",
    roleOpts_re_dev:['نائب رئيس المبيعات','مدير المبيعات','مدير مبيعات','مدير التسويق','رئيس تنفيذي','مدير عام','أخرى'],
    roleOpts_re_agent:['وسيط / مالك','قائد فريق','وكيل أول','مدير التسويق','مدير العمليات','أخرى'],
    roleOpts_auto:['مالك الوكالة','مدير عام','مدير المبيعات','مدير التسويق','مدير تطوير الأعمال','مدير التمويل والتأمين','أخرى'],
    roleOpts_other:['رئيس تنفيذي / مؤسس','نائب رئيس المبيعات','مدير المبيعات','مدير مبيعات','مدير التسويق','مدير العمليات','أخرى'],

    teamPlaceholder:"اختر",
    teamOpts:['أنا فقط','2 – 10','11 – 50','50 – 200','200+'],

    /* Project labels per industry */
    lblProjectName_re_dev:'اسم المشروع أو التطوير',
    lblProjectName_re_agent:'اسم الحملة أو القائمة',
    lblProjectName_auto:'اسم الوكالة أو الحملة',
    lblProjectName_other:'اسم المشروع أو الحملة',

    projectPlaceholder:"اختر النوع",
    projectOpts_re_dev:['برج سكني','مجتمع مخطط','مساكن ذات علامة','تطوير متعدد الاستخدامات','تجاري','أخرى'],
    projectOpts_re_agent:['إعادة بيع فاخر (2M+)','حملة VIP للوساطة','توليد العملاء للفريق','تحسين المنازل المفتوحة','تسويق المحفظة','أخرى'],
    projectOpts_auto:['مبيعات سيارات جديدة','مستعملة / معتمدة','خدمة واحتفاظ','برنامج عملاء VIP','مجموعة متعددة الفروع','أخرى'],
    projectOpts_other:['إطلاق منتج','تجربة عملاء VIP','تمكين المبيعات','توليد العملاء','تنشيط العلامة التجارية','أخرى'],

    /* Units per industry */
    lblUnits_re_dev:'إجمالي الوحدات',
    lblUnits_re_agent:'القوائم النشطة',
    lblUnits_auto:'الحجم الشهري',
    lblUnits_other:'الحجم',
    unitsPlaceholder:"اختر النطاق",
    unitsOpts_re_dev:['أقل من 50','50 – 200','200 – 500','500 – 2,000','2,000+'],
    unitsOpts_re_agent:['1 – 10','11 – 50','50 – 100','100+','لا ينطبق'],
    unitsOpts_auto:['أقل من 50/شهر','50 – 150/شهر','150 – 500/شهر','500+/شهر','متعدد الفروع'],
    unitsOpts_other:['صغير','متوسط','كبير','مؤسسة','لا ينطبق'],

    lblTimeline_auto:'موعد الإطلاق / الموسم المستهدف',
    timelinePlaceholder:"اختر الجدول الزمني",
    timelineOpts:['فوراً','1 – 3 أشهر','3 – 6 أشهر','6+ أشهر','مجرد استكشاف'],

    /* Challenge per industry */
    challengePlaceholder:"اختر التحدي",
    challengeOpts_re:['زوار موقع مجهولون','بطء من الاهتمام إلى أول اتصال','تواصل عام — نفس العرض للجميع','تحويل منخفض من العملاء إلى معاينات','فريق المبيعات يفتقر السياق','حاجة لتموضع فاخر','التعامل مع مشترين دوليين','لا ذكاء على مستوى المحفظة','تكاليف إعداد متكررة','أخرى'],
    challengeOpts_auto:['لا يمكن التميز عن الوكلاء المنافسين','معدلات تكرار وإحالة منخفضة','لا توجد تجربة VIP للعملاء ذوي القيمة العالية','ضعف الاحتفاظ في قسم الخدمة','العملاء الرقميون لا يزورون المعرض','متابعة غير متسقة عبر فريق المبيعات','لا طريقة لتتبع التفاعل غير الرقمي','حاجة لإطلاق حملة سيارات معتمدة أو كهربائية بسرعة','تضارب العلامة التجارية بين الفروع','أخرى'],
    challengeOpts_other:['زوار مجهولون — لا يمكن تحديد العملاء المحتملين','بطء من الاهتمام إلى أول اتصال','تواصل عام — نفس العرض للجميع','تحويل منخفض من العملاء إلى اجتماعات','فريق المبيعات يفتقر السياق','حاجة لتموضع العلامة التجارية الفاخرة','التعامل مع عملاء دوليين','لا ذكاء على مستوى المحفظة','أخرى'],

    budgetPlaceholder:"اختر النطاق",
    budgetOpts:['أقل من 5,000$','5,000$ – 15,000$','15,000$ – 50,000$','50,000$+','أحتاج توجيه'],
    submit:'إرسال الاستفسار →', submitting:"جارٍ الإرسال...",
    formNote:"نرد خلال 24 ساعة. يتم الحفاظ على معلوماتك بسرية تامة.",
    successTitle:"تم إرسال الطلب",
    successDesc:"شكرًا لك. سيقوم فريق المبيعات لدينا بمراجعة بياناتك والتواصل معك خلال 24 ساعة مع توصية تجريبية مخصصة.",
    successBack:"← العودة إلى الصفحة الرئيسية", successAnother:"إرسال طلب آخر",
    sideTitle:"ماذا يحدث بعد ذلك؟",
    side1Title:"نقوم بالمراجعة", side1Desc:"يقوم فريقنا بمراجعة طلبك ومطابقته مع المتخصص المناسب — مطورون أو شركات وساطة أو وكالات سيارات أو فرق فاخرة.",
    side2Title:"مكالمة استكشافية", side2Desc:"مكالمة لمدة 20 دقيقة لفهم عملية المبيعات لديك، وملفات العملاء، وأهداف المشروع. بدون عرض بيع — فقط أسئلة.",
    side3Title:"مقترح مخصص", side3Desc:"خلال 48 ساعة، ستتلقى خطة تجريبية مخصصة — تصميم البوابة، وعدد مفاتيح الوصول لكبار الشخصيات، والجدول الزمني، والتسعير.",
    side4Title:"الإطلاق", side4Desc:"من أسبوعين إلى أربعة أسابيع من الموافقة حتى وصول أول البطاقات إلى أيدي العملاء المميزين.",
    sideQuote:"\"أنت لا توزع بطاقات الاتصال قريب المدى. أنت تصدر دعوات خاصة — وتحول الاهتمام الرقمي إلى زخم حقيقي في المبيعات.\"",
    footerText:'© 2025 DynamicNFC — محرك تسريع المبيعات',
},
};

/* ── Helper: get per-industry translation key suffix ── */
function indSuffix(industry) {
  switch (industry) {
    case IND_RE_DEV: return 're_dev';
    case IND_RE_AGENT: return 're_agent';
    case IND_AUTO: return 'auto';
    default: return 'other';
  }
}

export default function ContactSales() {
  const { lang } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [industry, setIndustry] = useState('');
  const formRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);
  const suffix = indSuffix(industry);

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
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'contact',
          event_label: data.industry || 'unknown',
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { alert('Error submitting. Please try again.'); }
    setSubmitting(false);
  };

  const resetForm = () => { setSuccess(false); setIndustry(''); formRef.current?.reset(); };

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
      <SEO title="Contact Sales" description="Start a pilot program with 100 VIP invitations. Request pricing for DynamicNFC." path="/contact-sales" />

      {/* Navbar is now global — rendered in App.jsx */}

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
              <div className="cs-row single">
                <div className="cs-field full">
                  <label className="cs-label">{t('lblIndustrySelect')} <span className="cs-req">*</span></label>
                  <select className="cs-select" name="industry" required value={industry} onChange={e => setIndustry(e.target.value)}>
                    <option value="" disabled>{t('industrySelectPlaceholder')}</option>
                    {Object.entries(t('industrySelectOpts')).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="cs-row">
                <Input label={t('lblCompany')} name="company" required />
                <Select label={t('lblRole')} name="role" placeholder={t('rolePlaceholder')} options={t(`roleOpts_${suffix}`)} required />
              </div>
              <div className="cs-row single">
                <Select label={t('lblTeamSize')} name="teamSize" placeholder={t('teamPlaceholder')} options={t('teamOpts')} />
              </div>

              {/* Section 3: Project (conditional on industry) */}
              <div className="cs-divider" />
              <div className="cs-section-label">{t('sec3')}</div>
              <div className="cs-row">
                <Input label={t(`lblProjectName_${suffix}`)} name="project" />
                <Select label={t('lblProjectType')} name="projectType" placeholder={t('projectPlaceholder')} options={t(`projectOpts_${suffix}`)} />
              </div>
              <div className="cs-row">
                <Select label={t(`lblUnits_${suffix}`)} name="units" placeholder={t('unitsPlaceholder')} options={t(`unitsOpts_${suffix}`)} />
                <Select label={industry === IND_AUTO ? t('lblTimeline_auto') : t('lblTimeline')} name="timeline" placeholder={t('timelinePlaceholder')} options={t('timelineOpts')} />
              </div>

              {/* Section 4: Challenge (conditional on industry) */}
              <div className="cs-divider" />
              <div className="cs-section-label">{t('sec4')}</div>
              <div className="cs-row single">
                <Select label={t('lblChallenge')} name="challenge" placeholder={t('challengePlaceholder')} options={t(industry === IND_AUTO ? 'challengeOpts_auto' : (industry === IND_RE_DEV || industry === IND_RE_AGENT) ? 'challengeOpts_re' : 'challengeOpts_other')} />
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
        <p>© 2025 <a href="https://dynamicnfc.ca">DynamicNFC</a> — {lang === 'ar' ? 'محرك تسريع المبيعات' : 'Sales Velocity Engine'}</p>
      </footer>
    </div>
  );
}
