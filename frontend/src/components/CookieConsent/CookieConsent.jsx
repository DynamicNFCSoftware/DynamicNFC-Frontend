import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n';
import './CookieConsent.css';

const TR = {
  en: {
    title: 'We value your privacy',
    text: 'Analytics cookies are set only if you accept. We do not sell your personal data.',
    policy: 'Privacy Policy',
    accept: 'Accept', decline: 'Decline',
  },
  it: {
    title: 'La tua privacy è importante per noi',
    text: 'I cookie analitici vengono installati solo se accetti. Non vendiamo i tuoi dati personali.',
    policy: 'Informativa sulla privacy',
    accept: 'Accetta', decline: 'Rifiuta',
  },
  fr: {
    title: 'Votre vie privée nous tient à cœur',
    text: 'Les témoins d\'analyse ne sont déposés que si vous acceptez. Nous ne vendons pas vos données personnelles.',
    policy: 'Politique de confidentialité',
    accept: 'Accepter', decline: 'Refuser',
  },
  es: {
    title: 'Valoramos tu privacidad',
    text: 'Las cookies analíticas solo se instalan si aceptas. No vendemos tus datos personales.',
    policy: 'Política de privacidad',
    accept: 'Aceptar', decline: 'Rechazar',
  },
  ar: {
    title: 'نحن نحترم خصوصيتك',
    text: 'لا تُفعَّل ملفات تعريف الارتباط التحليلية إلا إذا وافقت. نحن لا نبيع بياناتك الشخصية.',
    policy: 'سياسة الخصوصية',
    accept: 'قبول', decline: 'رفض',
  },
};

const CONSENT_KEY = 'dnfc_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      enableAnalytics();
    } else if (!consent) {
      const timer = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const enableAnalytics = () => {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
      gtag('event', 'page_view');
    }
  };

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    enableAnalytics();
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cc-banner">
      <div className="cc-content">
        <div className="cc-text">
          <strong>{t('title')}</strong>
          <p>{t('text')} <a href="/privacy">{t('policy')}</a></p>
        </div>
        <div className="cc-actions">
          <button className="cc-btn cc-accept" onClick={handleAccept}>{t('accept')}</button>
          <button className="cc-btn cc-decline" onClick={handleDecline}>{t('decline')}</button>
        </div>
      </div>
    </div>
  );
}
