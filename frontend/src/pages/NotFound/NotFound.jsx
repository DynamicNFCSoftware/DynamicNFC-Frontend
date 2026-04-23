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
