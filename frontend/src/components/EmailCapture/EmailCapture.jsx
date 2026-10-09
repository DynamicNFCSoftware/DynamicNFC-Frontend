import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useLanguage } from '../../i18n';
import './EmailCapture.css';

const TR = {
  en: {
    successTitle: "You're in!",
    successText: "Thank you for subscribing. We'll keep you updated.",
    title: 'Stay Ahead of the Curve',
    desc: 'Get exclusive insights on NFC technology, digital business cards, and sales intelligence — delivered to your inbox.',
    placeholder: 'Enter your email',
    subscribe: 'Subscribe',
    note: 'No spam. Unsubscribe anytime.',
    errEmail: 'Please enter a valid email.',
    errGeneric: 'Something went wrong. Please try again.',
  },
  it: {
    successTitle: 'Iscrizione completata!',
    successText: 'Grazie per esserti iscritto. Ti terremo aggiornato.',
    title: 'Resta un passo avanti',
    desc: 'Ricevi approfondimenti esclusivi su tecnologia NFC, biglietti da visita digitali e sales intelligence — direttamente nella tua casella di posta.',
    placeholder: 'Inserisci la tua email',
    subscribe: 'Iscriviti',
    note: 'Niente spam. Puoi annullare l\'iscrizione in qualsiasi momento.',
    errEmail: 'Inserisci un indirizzo email valido.',
    errGeneric: 'Qualcosa è andato storto. Riprova.',
  },
  fr: {
    successTitle: 'Vous êtes inscrit !',
    successText: 'Merci de votre abonnement. Nous vous tiendrons informé.',
    title: 'Gardez une longueur d\'avance',
    desc: 'Recevez des analyses exclusives sur la technologie NFC, les cartes professionnelles numériques et la sales intelligence — directement dans votre boîte de réception.',
    placeholder: 'Entrez votre courriel',
    subscribe: 'S\'abonner',
    note: 'Aucun pourriel. Désabonnez-vous en tout temps.',
    errEmail: 'Veuillez entrer une adresse courriel valide.',
    errGeneric: 'Une erreur s\'est produite. Veuillez réessayer.',
  },
  es: {
    successTitle: '¡Ya estás dentro!',
    successText: 'Gracias por suscribirte. Te mantendremos al día.',
    title: 'Mantente un paso adelante',
    desc: 'Recibe ideas exclusivas sobre tecnología NFC, tarjetas de presentación digitales y sales intelligence — directo en tu bandeja de entrada.',
    placeholder: 'Ingresa tu correo electrónico',
    subscribe: 'Suscribirme',
    note: 'Sin spam. Cancela tu suscripción cuando quieras.',
    errEmail: 'Ingresa un correo electrónico válido.',
    errGeneric: 'Algo salió mal. Inténtalo de nuevo.',
  },
  ar: {
    successTitle: 'تم اشتراكك!',
    successText: 'شكرًا لاشتراكك. سنبقيك على اطلاع.',
    title: 'ابقَ في المقدمة',
    desc: 'احصل على رؤى حصرية حول تقنية NFC وبطاقات الأعمال الرقمية وذكاء المبيعات — تصلك إلى بريدك الإلكتروني.',
    placeholder: 'أدخل بريدك الإلكتروني',
    subscribe: 'اشترك',
    note: 'بدون رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.',
    errEmail: 'يرجى إدخال بريد إلكتروني صالح.',
    errGeneric: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  },
};

const DISMISS_KEY = 'dnfc_newsletter_dismissed';
const MIN_DELAY_MS = 300_000; // 5 minutes
const SCROLL_THRESHOLD = 0.5; // 50% of page

export default function EmailCapture() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;

  // Rule 3: Never show on demo pages
  const isDemo = pathname.startsWith('/enterprise/crmdemo') || pathname.startsWith('/automotive/demo');

  // Only show on public marketing pages
  const allowed = !isDemo && (
    pathname === '/' || pathname === '/nfc-cards' || pathname === '/enterprise' ||
    pathname === '/real-estate' || pathname === '/automotive' || pathname === '/developers' ||
    pathname === '/pricing' || pathname === '/blog'
  );

  // Rule 2: Persist dismiss in localStorage (survives sessions)
  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, 'true'); } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    if (!allowed || dismissed) return;
    // Rule 2: If previously dismissed, never show again
    try { if (localStorage.getItem(DISMISS_KEY) === 'true') return; } catch { /* storage unavailable */ }
    try { if (localStorage.getItem('dnfc_email_subscribed')) return; } catch { /* storage unavailable */ }

    let ready = false;
    let scrollFired = false;

    const activate = () => {
      if (ready) return;
      ready = true;
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleShowOnScroll, { passive: true });
      if (scrollFired) setVisible(true);
    };

    const delayTimer = setTimeout(() => {
      activate();
    }, MIN_DELAY_MS);

    const handleScrollGate = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (scrollPct >= SCROLL_THRESHOLD) {
        scrollFired = true;
        activate();
        window.removeEventListener('scroll', handleScrollGate);
      }
    };

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) setVisible(true);
    };

    const handleShowOnScroll = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (scrollPct > 0.6) setVisible(true);
    };

    window.addEventListener('scroll', handleScrollGate, { passive: true });

    return () => {
      clearTimeout(delayTimer);
      window.removeEventListener('scroll', handleScrollGate);
      window.removeEventListener('scroll', handleShowOnScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [allowed, dismissed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('errEmail');
      return;
    }
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email.trim().toLowerCase(),
        source: pathname,
        subscribedAt: serverTimestamp(),
      });
      setSubmitted(true);
      try { localStorage.setItem('dnfc_email_subscribed', '1'); } catch { /* storage unavailable */ }
      setTimeout(dismiss, 3000);
    } catch {
      setError('errGeneric');
    }
  };

  if (!visible || !allowed) return null;

  return (
    <div className="ec-overlay" onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      <div className="ec-modal">
        <button className="ec-close" onClick={dismiss}>×</button>
        {submitted ? (
          <div className="ec-success">
            <div className="ec-check">✓</div>
            <h3>{t('successTitle')}</h3>
            <p>{t('successText')}</p>
          </div>
        ) : (
          <>
            <h3 className="ec-title">{t('title')}</h3>
            <p className="ec-desc">{t('desc')}</p>
            <form className="ec-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="ec-input"
                placeholder={t('placeholder')}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoFocus
              />
              <button type="submit" className="ec-submit">{t('subscribe')}</button>
            </form>
            {error && <p className="ec-error">{t(error)}</p>}
            <p className="ec-note">{t('note')}</p>
          </>
        )}
      </div>
    </div>
  );
}
