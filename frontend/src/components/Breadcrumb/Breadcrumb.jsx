import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './Breadcrumb.css';

const ROUTE_LABELS = {
  en: {
    '': 'Home',
    'login': 'Login',
    'nfc-cards': 'NFC Cards',
    'enterprise': 'Enterprise',
    'developers': 'Developers',
    'real-estate': 'Real Estate',
    'contact-sales': 'Contact Sales',
    'order-card': 'Order Card',
    'automotive': 'Automotive',
    'create-card': 'Create Card',
    'dashboard': 'My Cards',
    'edit-card': 'Edit Card',
    'create-physical-card': 'Physical Card',
    'admin': 'Admin',
    'vip-crm': 'VIP CRM',
    'priority': 'Priority VIP',
    'analytics': 'Activity Log',
    'cards': 'Card Management',
    'campaigns': 'Campaigns',
    'settings': 'Settings',
    'crmdemo': 'CRM Demo',
    'khalid': 'VIP Portal',
    'ahmed': 'Family Portal',
    'marketplace': 'Marketplace',
    'ai-demo': 'AI Demo',
    'roi-calculator': 'ROI Calculator',
    'demo': 'Demo',
    'sultan': 'Sultan Portal',
    'showroom': 'Showroom',
    'sales': 'Sales',
  },
  ar: {
    '': 'الرئيسية',
    'login': 'تسجيل الدخول',
    'nfc-cards': 'بطاقات NFC',
    'enterprise': 'المؤسسات',
    'developers': 'المطورون',
    'real-estate': 'العقارات',
    'contact-sales': 'تواصل مع المبيعات',
    'order-card': 'طلب بطاقة',
    'automotive': 'السيارات',
    'create-card': 'إنشاء بطاقة',
    'dashboard': 'بطاقاتي',
    'edit-card': 'تعديل البطاقة',
    'create-physical-card': 'بطاقة فعلية',
    'admin': 'الإدارة',
    'vip-crm': 'VIP CRM',
    'priority': 'الأولوية VIP',
    'analytics': 'سجل النشاط',
    'cards': 'إدارة البطاقات',
    'campaigns': 'الحملات',
    'settings': 'الإعدادات',
    'crmdemo': 'عرض CRM',
    'khalid': 'بوابة VIP',
    'ahmed': 'بوابة العائلة',
    'marketplace': 'السوق',
    'ai-demo': 'عرض AI',
    'roi-calculator': 'حاسبة ROI',
    'demo': 'عرض',
    'sultan': 'بوابة سلطان',
    'showroom': 'صالة العرض',
    'sales': 'المبيعات',
  },
};

export default function Breadcrumb() {
  const location = useLocation();
  const { lang } = useLanguage();
  const labels = ROUTE_LABELS[lang] || ROUTE_LABELS.en;

  const segments = location.pathname.split('/').filter(Boolean);

  // Don't render on home or if only 1 segment
  if (segments.length < 2) return null;

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const label = labels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    const isLast = i === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav className="bc" aria-label="Breadcrumb" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Link to="/" className="bc-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>
      {crumbs.map(({ path, label, isLast }) => (
        <React.Fragment key={path}>
          <span className="bc-sep">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points={lang === 'ar' ? '15 18 9 12 15 6' : '9 6 15 12 9 18'} />
            </svg>
          </span>
          {isLast ? (
            <span className="bc-current">{label}</span>
          ) : (
            <Link to={path} className="bc-link">{label}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
