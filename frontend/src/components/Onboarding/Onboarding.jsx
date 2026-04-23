import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n';
import './Onboarding.css';

const STORAGE_KEY = 'dnfc_onboarded';

const STEPS = {
  en: [
    {
      icon: '\u{1F44B}',
      title: 'Welcome to DynamicNFC!',
      desc: 'Let us show you around. This quick tour will help you get the most out of your account.',
      features: [
        { icon: '\u{1F4B3}', title: 'Create NFC Cards', desc: 'Design digital cards with your info & socials' },
        { icon: '\u{1F4CA}', title: 'Track Analytics', desc: 'See who taps your card and when' },
        { icon: '\u{1F310}', title: 'Share Anywhere', desc: 'One link, one tap — instant connection' },
      ],
    },
    {
      icon: '\u{1F3A8}',
      title: 'Create Your First Card',
      desc: 'Head to Create Card to build your digital identity. Add your name, photo, social links, and choose a theme that fits your brand.',
      nav: '/create-card',
    },
    {
      icon: '\u{1F4CB}',
      title: 'Your Dashboard',
      desc: 'All your cards live here. View, edit, or share them. Track how many taps each card gets and manage your digital presence.',
      nav: '/dashboard',
    },
    {
      icon: '\u{1F680}',
      title: 'You\'re All Set!',
      desc: 'That\'s everything you need to get started. Create your first card now, or explore the platform at your own pace.',
    },
  ],
  ar: [
    {
      icon: '\u{1F44B}',
      title: 'مرحبًا بك في DynamicNFC!',
      desc: 'دعنا نعرّفك على المنصة. هذه الجولة السريعة ستساعدك في الاستفادة القصوى من حسابك.',
      features: [
        { icon: '\u{1F4B3}', title: 'إنشاء بطاقات NFC', desc: 'صمم بطاقات رقمية بمعلوماتك وحساباتك' },
        { icon: '\u{1F4CA}', title: 'تتبع التحليلات', desc: 'تعرف على من يقرأ بطاقتك ومتى' },
        { icon: '\u{1F310}', title: 'شارك في أي مكان', desc: 'رابط واحد، نقرة واحدة — اتصال فوري' },
      ],
    },
    {
      icon: '\u{1F3A8}',
      title: 'أنشئ بطاقتك الأولى',
      desc: 'انتقل إلى إنشاء بطاقة لبناء هويتك الرقمية. أضف اسمك وصورتك وروابطك الاجتماعية واختر التصميم المناسب.',
      nav: '/create-card',
    },
    {
      icon: '\u{1F4CB}',
      title: 'لوحة التحكم',
      desc: 'جميع بطاقاتك هنا. يمكنك عرضها أو تعديلها أو مشاركتها. تتبع عدد النقرات لكل بطاقة وأدِر حضورك الرقمي.',
      nav: '/dashboard',
    },
    {
      icon: '\u{1F680}',
      title: 'أنت جاهز!',
      desc: 'هذا كل ما تحتاجه للبدء. أنشئ بطاقتك الأولى الآن، أو استكشف المنصة بالطريقة التي تناسبك.',
    },
  ],
};

export default function Onboarding() {
  const { isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const path = location.pathname || '';
    if (path.startsWith('/unified') || path.startsWith('/enterprise/')) return;
    if (!isAuthenticated()) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {}
    // Small delay so dashboard loads first
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, location.pathname]);

  const steps = STEPS[lang] || STEPS.en;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const finish = useCallback(() => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }, []);

  const next = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  }, [isLast, finish]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const goAndFinish = useCallback((path) => {
    finish();
    navigate(path);
  }, [finish, navigate]);

  if (!visible) return null;

  return (
    <>
      <div className="ob-overlay" onClick={skip} />
      <div className="ob-modal" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="ob-header">
          <div className="ob-icon">{current.icon}</div>
          <h2>{current.title}</h2>
          <p>{current.desc}</p>
        </div>

        {current.features && (
          <div className="ob-body">
            <div className="ob-features">
              {current.features.map((f, i) => (
                <div className="ob-feature" key={i}>
                  <div className="ob-feature-icon">{f.icon}</div>
                  <div className="ob-feature-text">
                    <div className="ob-feature-title">{f.title}</div>
                    <div className="ob-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {current.nav && (
          <div className="ob-body">
            <button
              className="ob-btn-next"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              onClick={() => goAndFinish(current.nav)}
            >
              {lang === 'ar' ? 'اذهب الآن' : 'Go there now'} →
            </button>
          </div>
        )}

        <div className="ob-footer">
          <div className="ob-dots">
            {steps.map((_, i) => (
              <div key={i} className={`ob-dot${i === step ? ' ob-active' : ''}`} />
            ))}
          </div>
          <div className="ob-btns">
            <button className="ob-btn-skip" onClick={skip}>
              {lang === 'ar' ? 'تخطي' : 'Skip'}
            </button>
            <button className="ob-btn-next" onClick={next}>
              {isLast
                ? (lang === 'ar' ? 'ابدأ الآن' : "Let's go!")
                : (lang === 'ar' ? 'التالي' : 'Next')}
              {!isLast && <span>→</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
