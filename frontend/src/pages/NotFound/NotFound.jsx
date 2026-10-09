import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import SEO from '../../components/SEO/SEO';

const TR = {
  en: {
    title: 'Page Not Found',
    heading: '404',
    message: "The page you're looking for doesn't exist or has been moved.",
    home: 'Back to Home',
    demo: 'Try Live Demo',
  },
  it: {
    title: 'Pagina non trovata',
    heading: '404',
    message: 'La pagina che stai cercando non esiste o è stata spostata.',
    home: 'Torna alla Home',
    demo: 'Prova la demo live',
  },
  fr: {
    title: 'Page introuvable',
    heading: '404',
    message: 'La page que vous cherchez n\'existe pas ou a été déplacée.',
    home: 'Retour à l\'accueil',
    demo: 'Essayer la démo en direct',
  },
  es: {
    title: 'Página no encontrada',
    heading: '404',
    message: 'La página que buscas no existe o fue movida.',
    home: 'Volver al inicio',
    demo: 'Prueba la demo en vivo',
  },
  ar: {
    title: 'الصفحة غير موجودة',
    heading: '404',
    message: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    home: 'العودة للرئيسية',
    demo: 'جرّب العرض التجريبي',
  },
};

const NotFound = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  const t = (k) => TR[lang]?.[k] || TR.en[k];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--text)',
    }}>
      <SEO title={t('title')} description={t('message')} path="/404" />
      <h1 style={{
        fontSize: 'clamp(5rem, 15vw, 10rem)',
        fontWeight: 800,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #e63946, #ac0704)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
      }}>
        {t('heading')}
      </h1>
      <p style={{
        fontSize: '1.1rem',
        color: 'var(--muted)',
        maxWidth: '400px',
        margin: '1rem 0 2rem',
      }}>
        {t('message')}
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{
          padding: '.75rem 1.5rem',
          background: '#e63946',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '.95rem',
        }}>
          {t('home')}
        </Link>
        <Link to="/enterprise/crmdemo" style={{
          padding: '.75rem 1.5rem',
          background: 'var(--surface)',
          color: 'var(--text)',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '.95rem',
          border: '1px solid var(--border)',
        }}>
          {t('demo')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
