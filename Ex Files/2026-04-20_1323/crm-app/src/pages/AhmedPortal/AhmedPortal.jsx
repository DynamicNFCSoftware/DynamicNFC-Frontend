// AhmedPortal.jsx
// VIP Family Buyer Portal for Ahmed Al-Fahad
// Blue (#457b9d) + Teal (#2ec4b6) accent, family-focused
// Shares structure with KhalidPortal but emphasizes family/community features

import { useState, useEffect, useCallback, useMemo } from 'react';
import { units, towerInfo, towerNames } from '../../shared/unitsData';
import { createT, tFeature } from '../../shared/translations';
import { track } from '../../shared/tracking';
import './AhmedPortal.css';

const portalT = {
  en: {
    welcomeAhmed: "Welcome, Ahmed Al-Fahad", vipFamily: "VIP Family Access",
    familySub: "Your exclusive VIP family portal — Family-friendly residences and community amenities",
    familyCollection: "Family Residence Collection",
    selectTowerSub: "Family-oriented residences with premium community features",
    nearbySchools: "Nearby Schools", communityParks: "Community Parks",
    familyUnits: "Family Units", walkScore: "Walk Score",
    schoolsWithin: "Schools Within 2km", parksPlaygrounds: "Parks & Playgrounds",
    communityCenter: "Community Center",
    bookFamilyViewing: "Book Family Viewing", requestPricing: "Request Pricing",
    requestPaymentPlan: "Request Payment Plan", downloadFloorPlan: "Download Floor Plan",
    familyComparison: "Family Comparison", communityOverview: "Community Overview",
    homes: "Family Homes", amenities: "Amenities", community: "Community", contact: "Contact",
    annualROI: "Annual ROI", monthlyRental: "Monthly Rental",
    investmentProjections: "Investment Projections",
    estAnnualROI: "Est. Annual ROI", estMonthlyRental: "Est. Monthly Rental",
  },
  ar: {
    welcomeAhmed: "مرحباً، أحمد الفهد", vipFamily: "وصول VIP عائلي",
    familySub: "بوابة VIP العائلية الحصرية — وحدات عائلية ومرافق مجتمعية",
    familyCollection: "مجموعة الإقامات العائلية",
    selectTowerSub: "وحدات عائلية مع مرافق مجتمعية متميزة",
    nearbySchools: "مدارس قريبة", communityParks: "حدائق مجتمعية",
    familyUnits: "وحدات عائلية", walkScore: "درجة المشي",
    schoolsWithin: "مدارس خلال ٢ كم", parksPlaygrounds: "حدائق وملاعب",
    communityCenter: "مركز مجتمعي",
    bookFamilyViewing: "حجز معاينة عائلية", requestPricing: "طلب الأسعار",
    requestPaymentPlan: "طلب خطة الدفع", downloadFloorPlan: "تحميل المخطط",
    familyComparison: "مقارنة عائلية", communityOverview: "نظرة عامة على المجتمع",
    homes: "منازل عائلية", amenities: "المرافق", community: "المجتمع", contact: "اتصل بنا",
    annualROI: "العائد السنوي", monthlyRental: "الإيجار الشهري",
    investmentProjections: "توقعات الاستثمار",
    estAnnualROI: "العائد السنوي المتوقع", estMonthlyRental: "الإيجار الشهري المتوقع",
  }
};

const visitor = { name: 'Ahmed Al-Fahad', type: 'vip' };

export default function AhmedPortal() {
  const [lang, setLang] = useState(() => localStorage.getItem('dnfc_lang') || 'en');
  const [currentTower, setCurrentTower] = useState(null);
  const [bedFilter, setBedFilter] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalTab, setModalTab] = useState('plans');
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [fullsizeImg, setFullsizeImg] = useState(null);
  const [toast, setToast] = useState('');

  const t = useMemo(() => createT(lang, portalT), [lang]);
  const isRTL = lang === 'ar';

  useEffect(() => { track('vip_portal_entry', { portal: 'ahmed' }, visitor); }, []);
  useEffect(() => { localStorage.setItem('dnfc_lang', lang); document.documentElement.dir = isRTL ? 'rtl' : 'ltr'; }, [lang, isRTL]);

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); }, []);
  const selectTower = useCallback((id) => { setCurrentTower(id); setBedFilter('all'); track('tower_selected', { tower: id }, visitor); }, []);

  const filteredUnits = useMemo(() => {
    if (!currentTower) return [];
    let f = units.filter(u => u.t === currentTower);
    if (bedFilter !== 'all') f = f.filter(u => u.b === bedFilter);
    return f;
  }, [currentTower, bedFilter]);

  const bedTypes = useMemo(() => {
    if (!currentTower) return [];
    return [...new Set(units.filter(u => u.t === currentTower).map(u => u.b))];
  }, [currentTower]);

  const towerCounts = useMemo(() => {
    const c = {}; ['luna','astra','nova'].forEach(t => { c[t] = units.filter(u => u.t === t).length; }); return c;
  }, []);

  const toggleCompare = useCallback((id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) { showToast(t('maxProperties')); return prev; }
      track('comparison_view', { unit_id: id }, visitor);
      return [...prev, id];
    });
  }, [t, showToast]);

  const toggleFav = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); showToast(t('addedFavorites')); track('favorite_add', { unit_id: id }, visitor); }
      return next;
    });
  }, [t, showToast]);

  const handleCTA = useCallback((ctaName, unitName) => {
    track('cta_click', { cta_name: ctaName, unit: unitName }, visitor);
    const msgs = {
      request_pricing: `${t('pricingRequestSent')} ${unitName}`,
      request_payment_plan: t('paymentPlanSent'),
      download_floorplan: t('floorPlanDownload'),
      book_family_viewing: t('viewingRequestSent'),
    };
    showToast(msgs[ctaName] || 'Request sent!');
  }, [t, showToast]);

  const openModal = useCallback((unit) => {
    setSelectedUnit(unit); setModalTab('plans');
    track('unit_view', { unit_id: unit.id, type: unit.ty }, visitor);
  }, []);

  // ─── DEMO BAR ───
  const DemoBar = () => (
    <div className="a-demo-bar">
      <div className="a-demo-links">
        <a href="/khalid-portal" className="a-demo-link">{t('dbarKhalid')}</a>
        <a href="/ahmed-portal" className="a-demo-link active">{t('dbarAhmed')}</a>
        <a href="/marketplace" className="a-demo-link">{t('dbarMarket')}</a>
        <a href="/dashboard" className="a-demo-link">{t('dbarDash')}</a>
      </div>
      <div className="a-lang-btns">
        <button className={`a-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`a-lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>ع</button>
      </div>
    </div>
  );

  // ─── VIP HEADER (BLUE THEME) ───
  const VIPHeader = () => (
    <div className="a-vip-header">
      <div className="a-vip-badge">{t('vipFamily')}</div>
      <div className="a-vip-welcome">
        <div className="a-vip-avatar">AF</div>
        <div>
          <h1 className="a-vip-name">{t('welcomeAhmed')}</h1>
          <p className="a-vip-sub">{t('familySub')}</p>
        </div>
      </div>
    </div>
  );

  // ─── TOWER SELECTION (FAMILY DESCRIPTIONS) ───
  const TowerSelection = () => (
    <section className="a-tower-section">
      <h2 className="a-section-title">{t('familyCollection')}</h2>
      <p className="a-section-sub">{t('selectTowerSub')}</p>

      {/* Family Highlights */}
      <div className="a-family-bar">
        <div className="a-family-stat"><span className="a-family-icon">🏫</span><span>{t('nearbySchools')}</span></div>
        <div className="a-family-stat"><span className="a-family-icon">🌳</span><span>{t('communityParks')}</span></div>
        <div className="a-family-stat"><span className="a-family-icon">🏠</span><span>{t('familyUnits')}</span></div>
        <div className="a-family-stat"><span className="a-family-icon">🚶</span><span>{t('walkScore')}</span></div>
      </div>

      <div className="a-towers-grid">
        {Object.entries(towerInfo).map(([key, tower]) => (
          <div key={key} className="a-tower-card" onClick={() => selectTower(key)}>
            <img src={tower.img} alt={t(tower.nameKey)} className="a-tower-img" loading="lazy" />
            <div className="a-tower-overlay">
              <h3 className="a-tower-name">{t(tower.nameKey)}</h3>
              <p className="a-tower-desc">{tower.descFamily[lang] || tower.descFamily.en}</p>
              <span className="a-tower-count">{towerCounts[key]} {t('familyUnits')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Community Stats */}
      <div className="a-community-bar">
        <div className="a-comm-stat">
          <span className="a-comm-val">12</span>
          <span className="a-comm-label">{t('schoolsWithin')}</span>
        </div>
        <div className="a-comm-stat">
          <span className="a-comm-val">8</span>
          <span className="a-comm-label">{t('parksPlaygrounds')}</span>
        </div>
        <div className="a-comm-stat">
          <span className="a-comm-val">3</span>
          <span className="a-comm-label">{t('communityCenter')}</span>
        </div>
        <div className="a-comm-stat">
          <span className="a-comm-val">92</span>
          <span className="a-comm-label">{t('walkScore')}</span>
        </div>
      </div>
    </section>
  );

  // ─── PROPERTIES SCREEN ───
  const PropertiesScreen = () => (
    <section className="a-properties">
      <button className="a-back-btn" onClick={() => setCurrentTower(null)}>← {t('backToTower')}</button>
      <h2 className="a-section-title">{towerNames[currentTower]}</h2>

      <div className="a-bed-tabs">
        <button className={`a-bed-tab ${bedFilter === 'all' ? 'active' : ''}`}
          onClick={() => { setBedFilter('all'); track('bedroom_filter', { filter: 'all' }, visitor); }}>
          {t('allProperties')}
        </button>
        {bedTypes.map(b => (
          <button key={b} className={`a-bed-tab ${bedFilter === b ? 'active' : ''}`}
            onClick={() => { setBedFilter(b); track('bedroom_filter', { filter: b }, visitor); }}>
            {b === 'penthouse' ? t('penthouses') : t(`bed${b}`)}
          </button>
        ))}
      </div>

      <div className="a-units-grid">
        {filteredUnits.map((u, i) => (
          <div key={u.id} className="a-unit-card" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => openModal(u)}>
            <div className="a-unit-img-wrap"><img src={u.img.card} alt={u.n} className="a-unit-img" loading="lazy" /></div>
            <span className={`a-unit-badge ${u.s}`}>{t(u.s)}</span>
            <div className="a-unit-body">
              <div className="a-unit-type">{u.ty}</div>
              <div className="a-unit-name">{u.n}</div>
              <div className="a-unit-specs">
                <span>{u.tt.toLocaleString()} {t('sf')}</span><span>·</span>
                <span>{u.b === 'penthouse' ? t('ph') : u.b + ' ' + t('br')}</span>
              </div>
              <div className="a-unit-roi">
                <div><span className="a-roi-val">{u.roi.annual}</span><div className="a-roi-label">{t('annualROI')}</div></div>
                <div style={{ textAlign: 'end' }}><span className="a-roi-rental">{u.roi.rental}</span><div className="a-roi-label">{t('monthlyRental')}</div></div>
              </div>
            </div>
            <div className="a-unit-actions" onClick={e => e.stopPropagation()}>
              <button className={`a-action-btn fav ${favorites.has(u.id) ? 'active' : ''}`} onClick={() => toggleFav(u.id)}>♥ {t('save')}</button>
              <button className={`a-action-btn ${compareList.includes(u.id) ? 'active' : ''}`} onClick={() => toggleCompare(u.id)}>⚖ {t('compare')}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ─── PROPERTY MODAL (FAMILY-FOCUSED CTAs) ───
  const PropertyModal = () => {
    if (!selectedUnit) return null;
    const u = selectedUnit;
    const tabs = ['plans', 'views', 'blueprints', 'features', 'amenitiesTab'];
    return (
      <div className="a-modal-backdrop" onClick={() => setSelectedUnit(null)}>
        <div className="a-modal" onClick={e => e.stopPropagation()}>
          <div className="a-modal-header">
            <span className="a-modal-title">{t('planDetails')}</span>
            <button className="a-modal-close" onClick={() => setSelectedUnit(null)}>✕</button>
          </div>
          <div className="a-modal-tabs">
            {tabs.map(tab => (
              <button key={tab} className={`a-modal-tab ${modalTab === tab ? 'active' : ''}`} onClick={() => setModalTab(tab)}>{t(tab)}</button>
            ))}
          </div>
          <div className="a-modal-body">
            {modalTab === 'plans' && (
              <div className="a-plan-section">
                <img src={u.img.fp} alt="Floor Plan" className="a-plan-img" onClick={() => setFullsizeImg(u.img.fp)} />
                <div className="a-plan-info">
                  <h3 className="a-plan-name">{u.n}</h3>
                  <p className="a-plan-sub">{u.ty} — {towerNames[u.t]}</p>
                  <span className={`a-status-tag ${u.s}`}>{t(u.s)}</span>
                  <div className="a-specs-grid">
                    <div className="a-spec"><span className="a-spec-label">{t('indoorSF')}</span><span className="a-spec-val">{u.i.toLocaleString()} {t('sf')}</span></div>
                    <div className="a-spec"><span className="a-spec-label">{t('outdoorSF')}</span><span className="a-spec-val">{u.o.toLocaleString()} {t('sf')}</span></div>
                    <div className="a-spec"><span className="a-spec-label">{t('totalSF')}</span><span className="a-spec-val">{u.tt.toLocaleString()} {t('sf')}</span></div>
                  </div>
                  <div className="a-cta-stack">
                    <button className="a-cta blue" onClick={() => handleCTA('request_pricing', u.n)}>{t('requestPricing')}</button>
                    <button className="a-cta outline" onClick={() => handleCTA('request_payment_plan', u.n)}>{t('requestPaymentPlan')}</button>
                    <button className="a-cta outline" onClick={() => handleCTA('download_floorplan', u.n)}>{t('downloadFloorPlan')}</button>
                    <button className="a-cta teal" onClick={() => handleCTA('book_family_viewing', u.n)}>{t('bookFamilyViewing')}</button>
                  </div>
                </div>
              </div>
            )}
            {modalTab === 'views' && (
              <div>
                <div className="a-gallery-grid">
                  {u.img.views.map((v, i) => (
                    <div key={i} className="a-gallery-item" onClick={() => setFullsizeImg(v.url)}>
                      <img src={v.url} alt={v.l} loading="lazy" /><span className="a-gallery-label">{v.l}</span>
                    </div>
                  ))}
                </div>
                <p className="a-footnote">{t('artistRenderings')}</p>
              </div>
            )}
            {modalTab === 'blueprints' && (
              <div>
                <div className="a-gallery-grid">
                  {u.img.bp.map((b, i) => (
                    <div key={i} className="a-gallery-item" onClick={() => setFullsizeImg(b.url)}>
                      <img src={b.url} alt={b.l} loading="lazy" /><span className="a-gallery-label">{b.l}</span>
                    </div>
                  ))}
                </div>
                <p className="a-footnote">{t('archBlueprints')}</p>
              </div>
            )}
            {modalTab === 'features' && (
              <div className="a-features-grid">
                {Object.entries(u.f).map(([room, items]) => (
                  <div key={room} className="a-feature-group">
                    <h4 className="a-feature-title">{t(room)}</h4>
                    <ul className="a-feature-list">{items.map((item, i) => <li key={i}>{tFeature(item, lang)}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
            {modalTab === 'amenitiesTab' && (
              <div className="a-amenities-wrap">{u.a.map((am, i) => <span key={i} className="a-amenity-tag">{am}</span>)}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── COMPARE BAR & MODAL ───
  const CompareBar = () => {
    if (compareList.length === 0) return null;
    return (
      <div className="a-compare-bar">
        <span>{t('compareProperties')} ({compareList.length}/3)</span>
        <div className="a-compare-actions">
          <button onClick={() => setCompareList([])}>{t('clear')}</button>
          <button className="go" onClick={() => { if (compareList.length < 2) { showToast(t('selectAtLeast')); return; } setShowCompare(true); }}>{t('compareNow')}</button>
        </div>
      </div>
    );
  };

  const CompareModal = () => {
    if (!showCompare) return null;
    const items = compareList.map(id => units.find(u => u.id === id)).filter(Boolean);
    return (
      <div className="a-modal-backdrop" onClick={() => setShowCompare(false)}>
        <div className="a-modal wide" onClick={e => e.stopPropagation()}>
          <div className="a-modal-header">
            <span className="a-modal-title">{t('familyComparison')}</span>
            <button className="a-modal-close" onClick={() => setShowCompare(false)}>✕</button>
          </div>
          <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table className="a-compare-table">
              <thead><tr><th></th>{items.map(u => <th key={u.id}>{u.n}</th>)}</tr></thead>
              <tbody>
                <tr><td>{t('type')}</td>{items.map(u => <td key={u.id}>{u.ty}</td>)}</tr>
                <tr><td>{t('totalSF')}</td>{items.map(u => <td key={u.id}>{u.tt.toLocaleString()} {t('sf')}</td>)}</tr>
                <tr><td>{t('annualROI')}</td>{items.map(u => <td key={u.id}>{u.roi.annual}</td>)}</tr>
                <tr><td>{t('status')}</td>{items.map(u => <td key={u.id}><span className={`a-status-tag ${u.s}`}>{t(u.s)}</span></td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`a-portal ${isRTL ? 'rtl' : ''}`}>
      <DemoBar />
      <VIPHeader />
      <main className="a-main">{!currentTower ? <TowerSelection /> : <PropertiesScreen />}</main>
      <PropertyModal />
      <CompareBar />
      <CompareModal />
      {fullsizeImg && <div className="a-fullsize" onClick={() => setFullsizeImg(null)}><img src={fullsizeImg} alt="Full Size" /></div>}
      {toast && <div className="a-toast">{toast}</div>}
    </div>
  );
}
