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
  it: [
    {
      icon: '\u{1F44B}',
      title: 'Benvenuto in DynamicNFC!',
      desc: 'Ti facciamo fare un giro. Questo breve tour ti aiuterà a ottenere il massimo dal tuo account.',
      features: [
        { icon: '\u{1F4B3}', title: 'Crea card NFC', desc: 'Progetta card digitali con i tuoi dati e i tuoi social' },
        { icon: '\u{1F4CA}', title: 'Monitora le analytics', desc: 'Scopri chi fa tap sulla tua card e quando' },
        { icon: '\u{1F310}', title: 'Condividi ovunque', desc: 'Un link, un tap — connessione immediata' },
      ],
    },
    {
      icon: '\u{1F3A8}',
      title: 'Crea la tua prima card',
      desc: 'Vai su Crea card per costruire la tua identità digitale. Aggiungi nome, foto e link social, poi scegli un tema in linea con il tuo brand.',
      nav: '/create-card',
    },
    {
      icon: '\u{1F4CB}',
      title: 'La tua dashboard',
      desc: 'Tutte le tue card sono qui. Visualizzale, modificale o condividile. Controlla quanti tap riceve ogni card e gestisci la tua presenza digitale.',
      nav: '/dashboard',
    },
    {
      icon: '\u{1F680}',
      title: 'Tutto pronto!',
      desc: 'È tutto ciò che ti serve per iniziare. Crea subito la tua prima card oppure esplora la piattaforma con i tuoi tempi.',
    },
  ],
  fr: [
    {
      icon: '\u{1F44B}',
      title: 'Bienvenue chez DynamicNFC !',
      desc: 'Laissez-nous vous faire visiter. Cette courte visite vous aidera à tirer le meilleur parti de votre compte.',
      features: [
        { icon: '\u{1F4B3}', title: 'Créez des cartes NFC', desc: 'Concevez des cartes numériques avec vos coordonnées et vos réseaux sociaux' },
        { icon: '\u{1F4CA}', title: 'Suivez vos statistiques', desc: 'Voyez qui fait un tap sur votre carte, et quand' },
        { icon: '\u{1F310}', title: 'Partagez partout', desc: 'Un lien, un tap — une connexion instantanée' },
      ],
    },
    {
      icon: '\u{1F3A8}',
      title: 'Créez votre première carte',
      desc: 'Rendez-vous dans Créer une carte pour bâtir votre identité numérique. Ajoutez votre nom, votre photo et vos liens sociaux, puis choisissez un thème à l\'image de votre marque.',
      nav: '/create-card',
    },
    {
      icon: '\u{1F4CB}',
      title: 'Votre dashboard',
      desc: 'Toutes vos cartes se trouvent ici. Consultez-les, modifiez-les ou partagez-les. Suivez le nombre de taps de chaque carte et gérez votre présence numérique.',
      nav: '/dashboard',
    },
    {
      icon: '\u{1F680}',
      title: 'Tout est prêt !',
      desc: 'C\'est tout ce qu\'il vous faut pour commencer. Créez votre première carte dès maintenant ou explorez la plateforme à votre rythme.',
    },
  ],
  es: [
    {
      icon: '\u{1F44B}',
      title: '¡Te damos la bienvenida a DynamicNFC!',
      desc: 'Te mostramos cómo funciona. Este recorrido rápido te ayudará a sacarle el máximo provecho a tu cuenta.',
      features: [
        { icon: '\u{1F4B3}', title: 'Crea tarjetas NFC', desc: 'Diseña tarjetas digitales con tus datos y redes sociales' },
        { icon: '\u{1F4CA}', title: 'Mide tu analítica', desc: 'Ve quién hace tap en tu tarjeta y cuándo' },
        { icon: '\u{1F310}', title: 'Comparte donde sea', desc: 'Un enlace, un tap — conexión instantánea' },
      ],
    },
    {
      icon: '\u{1F3A8}',
      title: 'Crea tu primera tarjeta',
      desc: 'Ve a Crear tarjeta para construir tu identidad digital. Agrega tu nombre, foto y enlaces sociales, y elige un tema que vaya con tu marca.',
      nav: '/create-card',
    },
    {
      icon: '\u{1F4CB}',
      title: 'Tu dashboard',
      desc: 'Aquí viven todas tus tarjetas. Míralas, edítalas o compártelas. Revisa cuántos taps recibe cada tarjeta y gestiona tu presencia digital.',
      nav: '/dashboard',
    },
    {
      icon: '\u{1F680}',
      title: '¡Todo listo!',
      desc: 'Eso es todo lo que necesitas para empezar. Crea tu primera tarjeta ahora o explora la plataforma a tu ritmo.',
    },
  ],
};

const UI = {
  en: { go: 'Go there now', skip: 'Skip', start: "Let's go!", next: 'Next' },
  it: { go: 'Vai subito', skip: 'Salta', start: 'Iniziamo!', next: 'Avanti' },
  fr: { go: 'Y aller maintenant', skip: 'Passer', start: "C'est parti !", next: 'Suivant' },
  es: { go: 'Ir ahora', skip: 'Omitir', start: '¡Vamos!', next: 'Siguiente' },
  ar: { go: 'اذهب الآن', skip: 'تخطي', start: 'ابدأ الآن', next: 'التالي' },
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
    } catch { /* storage unavailable */ }
    // Small delay so dashboard loads first
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, location.pathname]);

  const steps = STEPS[lang] || STEPS.en;
  const t = (k) => UI[lang]?.[k] ?? UI.en[k] ?? k;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const finish = useCallback(() => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* storage unavailable */ }
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
              {t('go')} →
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
              {t('skip')}
            </button>
            <button className="ob-btn-next" onClick={next}>
              {isLast ? t('start') : t('next')}
              {!isLast && <span>→</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
