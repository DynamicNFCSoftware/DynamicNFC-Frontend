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
  it: {
    '': 'Home',
    'login': 'Accedi',
    'nfc-cards': 'Card NFC',
    'enterprise': 'Enterprise',
    'developers': 'Sviluppatori',
    'real-estate': 'Immobiliare',
    'contact-sales': 'Contatta le vendite',
    'order-card': 'Ordina card',
    'automotive': 'Automotive',
    'create-card': 'Crea card',
    'dashboard': 'Le mie card',
    'edit-card': 'Modifica card',
    'create-physical-card': 'Card fisica',
    'admin': 'Admin',
    'vip-crm': 'VIP CRM',
    'priority': 'VIP prioritari',
    'analytics': 'Registro attività',
    'cards': 'Gestione card',
    'campaigns': 'Campagne',
    'settings': 'Impostazioni',
    'crmdemo': 'Demo CRM',
    'khalid': 'Portale VIP',
    'ahmed': 'Portale Famiglia',
    'marketplace': 'Marketplace',
    'ai-demo': 'Demo AI',
    'roi-calculator': 'Calcolatore ROI',
    'demo': 'Demo',
    'sultan': 'Portale Sultan',
    'showroom': 'Showroom',
    'sales': 'Vendite',
  },
  fr: {
    '': 'Accueil',
    'login': 'Connexion',
    'nfc-cards': 'Cartes NFC',
    'enterprise': 'Entreprise',
    'developers': 'Promoteurs',
    'real-estate': 'Immobilier',
    'contact-sales': 'Contacter les ventes',
    'order-card': 'Commander une carte',
    'automotive': 'Automobile',
    'create-card': 'Créer une carte',
    'dashboard': 'Mes cartes',
    'edit-card': 'Modifier la carte',
    'create-physical-card': 'Carte physique',
    'admin': 'Admin',
    'vip-crm': 'VIP CRM',
    'priority': 'VIP prioritaires',
    'analytics': 'Journal d\'activité',
    'cards': 'Gestion des cartes',
    'campaigns': 'Campagnes',
    'settings': 'Paramètres',
    'crmdemo': 'Démo CRM',
    'khalid': 'Portail VIP',
    'ahmed': 'Portail Famille',
    'marketplace': 'Marketplace',
    'ai-demo': 'Démo IA',
    'roi-calculator': 'Calculateur de ROI',
    'demo': 'Démo',
    'sultan': 'Portail Sultan',
    'showroom': 'Showroom',
    'sales': 'Ventes',
  },
  es: {
    '': 'Inicio',
    'login': 'Iniciar sesión',
    'nfc-cards': 'Tarjetas NFC',
    'enterprise': 'Empresas',
    'developers': 'Desarrolladores',
    'real-estate': 'Bienes raíces',
    'contact-sales': 'Contactar a ventas',
    'order-card': 'Pedir tarjeta',
    'automotive': 'Automotriz',
    'create-card': 'Crear tarjeta',
    'dashboard': 'Mis tarjetas',
    'edit-card': 'Editar tarjeta',
    'create-physical-card': 'Tarjeta física',
    'admin': 'Admin',
    'vip-crm': 'VIP CRM',
    'priority': 'VIP prioritarios',
    'analytics': 'Registro de actividad',
    'cards': 'Gestión de tarjetas',
    'campaigns': 'Campañas',
    'settings': 'Configuración',
    'crmdemo': 'Demo CRM',
    'khalid': 'Portal VIP',
    'ahmed': 'Portal Familiar',
    'marketplace': 'Marketplace',
    'ai-demo': 'Demo de IA',
    'roi-calculator': 'Calculadora de ROI',
    'demo': 'Demo',
    'sultan': 'Portal Sultan',
    'showroom': 'Showroom',
    'sales': 'Ventas',
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
