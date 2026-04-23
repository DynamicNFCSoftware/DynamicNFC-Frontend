// Marketplace.jsx
// Public/Anonymous Marketplace Portal for Al Noor Residences
// Red accent (#e63946), login/register system, chatbot, lead capture
// Anonymous users can browse; pricing/viewing CTAs require login

import { useState, useEffect, useCallback, useMemo } from 'react';
import { units, towerInfo, towerNames } from '../../shared/unitsData';
import { createT, tFeature } from '../../shared/translations';
import { track } from '../../shared/tracking';
import './Marketplace.css';

const portalT = {
  en: {
    heroTitle: "Al Noor Residences", heroSub: "Discover Your Perfect Home",
    residences: "Residences", towers: "Towers", roiRange: "ROI Range",
    allProperties: "All Properties", penthouses: "Penthouses", luxury: "Luxury",
    family: "Family", investment: "Investment",
    loginRequired: "Login Required", loginToAccess: "Login to access pricing and booking",
    login: "Login", register: "Register", logout: "Logout",
    emailPlaceholder: "Email address", namePlaceholder: "Full name",
    registerBtn: "Register & Continue", loginBtn: "Sign In",
    chatTitle: "Al Noor Assistant", chatPlaceholder: "Ask about our residences...",
    chatWelcome: "Welcome! How can I help you explore Al Noor Residences?",
    requestPricing: "Request Pricing", requestPaymentPlan: "Request Payment Plan",
    downloadBrochure: "Download Brochure", bookViewing: "Book Viewing",
    annualROI: "Annual ROI", monthlyRental: "Monthly Rental",
  },
  ar: {
    heroTitle: "أنوار المساكن", heroSub: "اكتشف منزلك المثالي",
    residences: "وحدة سكنية", towers: "أبراج", roiRange: "نطاق العائد",
    allProperties: "جميع العقارات", penthouses: "بنتهاوس", luxury: "فاخر",
    family: "عائلي", investment: "استثماري",
    loginRequired: "تسجيل الدخول مطلوب", loginToAccess: "سجل دخولك للوصول للأسعار والحجز",
    login: "دخول", register: "تسجيل", logout: "خروج",
    emailPlaceholder: "البريد الإلكتروني", namePlaceholder: "الاسم الكامل",
    registerBtn: "تسجيل ومتابعة", loginBtn: "تسجيل الدخول",
    chatTitle: "مساعد أنوار", chatPlaceholder: "اسأل عن وحداتنا السكنية...",
    chatWelcome: "مرحباً! كيف يمكنني مساعدتك في استكشاف أنوار المساكن؟",
    requestPricing: "طلب الأسعار", requestPaymentPlan: "طلب خطة الدفع",
    downloadBrochure: "تحميل الكتيب", bookViewing: "حجز معاينة",
    annualROI: "العائد السنوي", monthlyRental: "الإيجار الشهري",
  }
};

// Chatbot responses
const chatResponses = [
  "Al Noor Residences offers 39 premium units across 3 towers. Would you like to know about a specific tower?",
  "Our ROI ranges from 8-18% annually. Penthouses offer the highest returns. Shall I show you available penthouses?",
  "We have family-friendly 3BR units starting from 1,450 SF with nearby schools and parks. Want to explore?",
  "You can book a private viewing anytime. Would you like to register for a personalized experience?",
  "Our payment plans are flexible with up to 5 years. Register to get detailed pricing for your preferred units.",
];

export default function Marketplace() {
  const [lang, setLang] = useState(() => localStorage.getItem('dnfc_lang') || 'en');
  const [user, setUser] = useState(null); // {name, email}
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });
  const [currentTower, setCurrentTower] = useState(null);
  const [category, setCategory] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [toast, setToast] = useState('');

  const t = useMemo(() => createT(lang, portalT), [lang]);
  const isRTL = lang === 'ar';

  useEffect(() => { track('marketplace_entry', {}, { name: null, type: 'anonymous' }); }, []);
  useEffect(() => { localStorage.setItem('dnfc_lang', lang); document.documentElement.dir = isRTL ? 'rtl' : 'ltr'; }, [lang, isRTL]);

  const visitor = useMemo(() => user ? { name: user.name, type: 'registered' } : { name: null, type: 'anonymous' }, [user]);
  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); }, []);

  // Register/Login
  const handleRegister = useCallback(() => {
    if (!loginForm.email || !loginForm.name) return;
    const u = { name: loginForm.name, email: loginForm.email };
    setUser(u);
    setShowLogin(false);
    track('user_registered', { email: u.email }, { name: u.name, type: 'registered' });
  }, [loginForm]);

  // CTA with login gate
  const handleCTA = useCallback((ctaName, unitName) => {
    if (!user && ctaName !== 'download_brochure') {
      setShowLogin(true);
      track('login_modal_open', { trigger: ctaName }, visitor);
      return;
    }
    track('cta_click', { cta_name: ctaName, unit: unitName }, visitor);
    showToast(`Request sent for ${unitName}`);
  }, [user, visitor, showToast]);

  // Filtered units by category
  const displayUnits = useMemo(() => {
    if (currentTower) {
      return units.filter(u => u.t === currentTower);
    }
    switch (category) {
      case 'penthouses': return units.filter(u => u.b === 'penthouse');
      case 'luxury': return units.filter(u => u.tt >= 2500);
      case 'family': return units.filter(u => u.b === '3' || u.b === '4');
      case 'investment': return units.filter(u => parseFloat(u.roi.annual) >= 12);
      default: return units;
    }
  }, [currentTower, category]);

  // Chat
  const sendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
    const reply = chatResponses[Math.floor(Math.random() * chatResponses.length)];
    setTimeout(() => setChatMessages(prev => [...prev, { from: 'bot', text: reply }]), 800);
    track('chat_message', { message: chatInput }, visitor);
    setChatInput('');
  }, [chatInput, visitor]);

  return (
    <div className={`m-portal ${isRTL ? 'rtl' : ''}`}>
      {/* Demo Bar */}
      <div className="m-demo-bar">
        <div className="m-demo-links">
          <a href="/khalid-portal" className="m-demo-link">{t('dbarKhalid')}</a>
          <a href="/ahmed-portal" className="m-demo-link">{t('dbarAhmed')}</a>
          <a href="/marketplace" className="m-demo-link active">{t('dbarMarket')}</a>
          <a href="/dashboard" className="m-demo-link">{t('dbarDash')}</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user && (
            <div className="m-user-chip">
              <span className="m-user-avatar">{user.name[0]}</span>
              <span>{user.name}</span>
              <button className="m-logout" onClick={() => setUser(null)}>{t('logout')}</button>
            </div>
          )}
          <div className="m-lang-btns">
            <button className={`m-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`m-lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>ع</button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="m-hero">
        <h1 className="m-hero-title">{t('heroTitle')}</h1>
        <p className="m-hero-sub">{t('heroSub')}</p>
        <div className="m-hero-stats">
          <div className="m-hero-stat"><span className="m-stat-val">39</span><span className="m-stat-label">{t('residences')}</span></div>
          <div className="m-hero-stat"><span className="m-stat-val">3</span><span className="m-stat-label">{t('towers')}</span></div>
          <div className="m-hero-stat"><span className="m-stat-val">8-18%</span><span className="m-stat-label">{t('roiRange')}</span></div>
        </div>
      </div>

      <main className="m-main">
        {/* Category Tabs */}
        <div className="m-cat-tabs">
          {['all', 'penthouses', 'luxury', 'family', 'investment'].map(c => (
            <button key={c} className={`m-cat-tab ${category === c ? 'active' : ''}`}
              onClick={() => { setCategory(c); setCurrentTower(null); track('category_filter', { category: c }, visitor); }}>
              {t(c === 'all' ? 'allProperties' : c)}
            </button>
          ))}
        </div>

        {/* Tower Cards (clickable) */}
        {!currentTower && (
          <div className="m-towers-grid">
            {Object.entries(towerInfo).map(([key, tower]) => (
              <div key={key} className="m-tower-card" onClick={() => { setCurrentTower(key); track('tower_selected', { tower: key }, visitor); }}>
                <img src={tower.img} alt={t(tower.nameKey)} className="m-tower-img" loading="lazy" />
                <div className="m-tower-overlay">
                  <h3>{t(tower.nameKey)}</h3>
                  <p>{tower.descPublic[lang] || tower.descPublic.en}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTower && (
          <button className="m-back-btn" onClick={() => setCurrentTower(null)}>← {t('backToTower')}</button>
        )}

        {/* Units Grid */}
        <div className="m-units-grid">
          {displayUnits.map((u, i) => (
            <div key={u.id} className="m-unit-card" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="m-unit-img-wrap"><img src={u.img.card} alt={u.n} className="m-unit-img" loading="lazy" /></div>
              <span className={`m-unit-badge ${u.s}`}>{t(u.s)}</span>
              <div className="m-unit-body">
                <div className="m-unit-type">{u.ty}</div>
                <div className="m-unit-name">{u.n}</div>
                <div className="m-unit-specs">{u.tt.toLocaleString()} {t('sf')} · {u.b === 'penthouse' ? t('ph') : u.b + ' ' + t('br')}</div>
                <div className="m-unit-roi">
                  <span className="m-roi-val">{u.roi.annual} {t('annualROI')}</span>
                </div>
              </div>
              <div className="m-unit-ctas">
                <button className="m-cta" onClick={() => handleCTA('request_pricing', u.n)}>{t('requestPricing')}</button>
                <button className="m-cta outline" onClick={() => handleCTA('book_viewing', u.n)}>{t('bookViewing')}</button>
                <button className="m-cta outline sm" onClick={() => handleCTA('download_brochure', u.n)}>{t('downloadBrochure')}</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="m-modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="m-login-modal" onClick={e => e.stopPropagation()}>
            <button className="m-modal-close" onClick={() => setShowLogin(false)}>✕</button>
            <h3>{t('loginRequired')}</h3>
            <p className="m-login-sub">{t('loginToAccess')}</p>
            <input type="text" placeholder={t('namePlaceholder')} value={loginForm.name}
              onChange={e => setLoginForm(p => ({ ...p, name: e.target.value }))} className="m-input" />
            <input type="email" placeholder={t('emailPlaceholder')} value={loginForm.email}
              onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} className="m-input" />
            <button className="m-cta full" onClick={handleRegister}>{t('registerBtn')}</button>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <button className="m-chat-fab" onClick={() => { setChatOpen(!chatOpen); if (!chatOpen) track('chat_opened', {}, visitor); }}>
        {chatOpen ? '✕' : '💬'}
      </button>
      {chatOpen && (
        <div className="m-chat-panel">
          <div className="m-chat-header">{t('chatTitle')}</div>
          <div className="m-chat-messages">
            <div className="m-chat-msg bot">{t('chatWelcome')}</div>
            {chatMessages.map((m, i) => (
              <div key={i} className={`m-chat-msg ${m.from}`}>{m.text}</div>
            ))}
          </div>
          <div className="m-chat-input-row">
            <input className="m-chat-input" placeholder={t('chatPlaceholder')}
              value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()} />
            <button className="m-chat-send" onClick={sendChat}>→</button>
          </div>
        </div>
      )}

      {toast && <div className="m-toast">{toast}</div>}
    </div>
  );
}
