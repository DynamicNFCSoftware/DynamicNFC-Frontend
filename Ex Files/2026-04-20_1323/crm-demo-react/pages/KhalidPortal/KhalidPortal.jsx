// KhalidPortal.jsx
// VIP Investor Portal for Khalid Al-Rashid
// Gold accent (#b8860b), ROI-focused, penthouse showcases
// Features: Tower selection → Unit grid → Property modal (5 tabs) → Compare → Favorites

import { useState, useEffect, useCallback, useMemo } from 'react';
import { units, towerInfo, towerNames } from '../../shared/unitsData';
import { createT, tFeature } from '../../shared/translations';
import { track } from '../../shared/tracking';
import './KhalidPortal.css';

// Portal-specific translations
const portalT = {
  en: {
    welcomeKhalid: "Welcome, Khalid Al-Rashid",
    investorSub: "Your exclusive VIP investor portal — Premium penthouses and investment opportunities",
    premiumInvestment: "Premium Investment Collection",
    selectTowerSub: "Exclusive penthouse and luxury units for discerning investors",
    investmentProjections: "Investment Projections",
    estAnnualROI: "Est. Annual ROI", estMonthlyRental: "Est. Monthly Rental",
    requestVIPPricing: "Request VIP Pricing", requestPaymentPlan: "Request Payment Plan",
    downloadFloorPlan: "Download Floor Plan", scheduleViewing: "Schedule Private Viewing",
    annualROI: "Annual ROI", monthlyRental: "Monthly Rental",
    avgRental: "Avg. Rental/SF/Year", yoyAppreciation: "YoY Appreciation", occupancyRate: "Occupancy Rate",
    investmentComparison: "Investment Comparison",
    estROI: "Est. ROI", luxuryUnits: "Luxury Units Available",
    premiumSuites: "Premium Suites Available", modernResidences: "Modern Residences Available",
    skyPenthouses: "Sky Penthouses · Grand Residences",
    execLiving: "Executive Living · Family Residences",
    contemporary: "Contemporary · Urban Living",
    investmentOverview: "Investment Overview",
    homes: "Investment Properties", amenities: "Amenities", returns: "Returns", contact: "Contact",
    vipInvestor: "VIP Investor",
  },
  ar: {
    welcomeKhalid: "مرحباً، خالد الراشد",
    investorSub: "بوابة المستثمر VIP الحصرية — بنتهاوس فاخرة وفرص استثمارية",
    premiumInvestment: "مجموعة استثمارية فاخرة",
    selectTowerSub: "بنتهاوس حصري ووحدات فاخرة للمستثمرين",
    investmentProjections: "توقعات الاستثمار",
    estAnnualROI: "العائد السنوي المتوقع", estMonthlyRental: "الإيجار الشهري المتوقع",
    requestVIPPricing: "طلب أسعار VIP", requestPaymentPlan: "طلب خطة الدفع",
    downloadFloorPlan: "تحميل المخطط", scheduleViewing: "جدولة معاينة خاصة",
    annualROI: "العائد السنوي", monthlyRental: "الإيجار الشهري",
    avgRental: "متوسط الإيجار/قدم²/سنة", yoyAppreciation: "النمو السنوي", occupancyRate: "نسبة الإشغال",
    investmentComparison: "مقارنة الاستثمار",
    estROI: "العائد المتوقع", luxuryUnits: "وحدات فاخرة متاحة",
    premiumSuites: "أجنحة فاخرة متاحة", modernResidences: "وحدات عصرية متاحة",
    skyPenthouses: "بنتهاوس سماوي · إقامات كبرى",
    execLiving: "حياة راقية · إقامات عائلية",
    contemporary: "عصري · حياة حضرية",
    investmentOverview: "نظرة عامة على الاستثمار",
    homes: "عقارات استثمارية", amenities: "المرافق", returns: "العوائد", contact: "اتصل بنا",
    vipInvestor: "مستثمر VIP",
  }
};

const visitor = { name: 'Khalid Al-Rashid', type: 'vip' };

export default function KhalidPortal() {
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

  // Track portal entry on mount
  useEffect(() => {
    track('vip_portal_entry', { portal: 'khalid' }, visitor);
  }, []);

  // Language persistence
  useEffect(() => {
    localStorage.setItem('dnfc_lang', lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  // Toast helper
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  // Tower selection
  const selectTower = useCallback((id) => {
    setCurrentTower(id);
    setBedFilter('all');
    track('tower_selected', { tower: id, tower_name: towerNames[id] }, visitor);
  }, []);

  // Filtered units
  const filteredUnits = useMemo(() => {
    if (!currentTower) return [];
    let f = units.filter(u => u.t === currentTower);
    if (bedFilter !== 'all') f = f.filter(u => u.b === bedFilter);
    return f;
  }, [currentTower, bedFilter]);

  // Available bed types for current tower
  const bedTypes = useMemo(() => {
    if (!currentTower) return [];
    return [...new Set(units.filter(u => u.t === currentTower).map(u => u.b))];
  }, [currentTower]);

  // Tower unit counts
  const towerCounts = useMemo(() => {
    const counts = {};
    ['luna', 'astra', 'nova'].forEach(t => {
      counts[t] = units.filter(u => u.t === t).length;
    });
    return counts;
  }, []);

  // Compare functions
  const toggleCompare = useCallback((id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) { showToast(t('maxProperties')); return prev; }
      track('comparison_view', { unit_id: id }, visitor);
      return [...prev, id];
    });
  }, [t, showToast]);

  // Favorites
  const toggleFav = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); track('favorite_remove', { unit_id: id }, visitor); }
      else { next.add(id); track('favorite_add', { unit_id: id }, visitor); showToast(t('addedFavorites')); }
      return next;
    });
  }, [t, showToast]);

  // CTA handlers
  const handleCTA = useCallback((ctaName, unitName) => {
    track('cta_click', { cta_name: ctaName, unit: unitName }, visitor);
    const msgs = {
      request_pricing: `${t('pricingRequestSent')} ${unitName}`,
      request_payment_plan: t('paymentPlanSent'),
      download_floorplan: t('floorPlanDownload'),
      book_viewing: t('viewingRequestSent'),
    };
    showToast(msgs[ctaName] || 'Request sent!');
  }, [t, showToast]);

  // Open property modal
  const openModal = useCallback((unit) => {
    setSelectedUnit(unit);
    setModalTab('plans');
    track('unit_view', { unit_id: unit.id, type: unit.ty, tower: unit.t }, visitor);
  }, []);

  // ─── RENDER: DEMO BAR ───
  const DemoBar = () => (
    <div className="k-demo-bar">
      <div className="k-demo-links">
        <a href="/khalid-portal" className="k-demo-link active">{t('dbarKhalid')}</a>
        <a href="/ahmed-portal" className="k-demo-link">{t('dbarAhmed')}</a>
        <a href="/marketplace" className="k-demo-link">{t('dbarMarket')}</a>
        <a href="/dashboard" className="k-demo-link">{t('dbarDash')}</a>
      </div>
      <div className="k-lang-btns">
        <button className={`k-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`k-lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>ع</button>
      </div>
    </div>
  );

  // ─── RENDER: VIP HEADER ───
  const VIPHeader = () => (
    <div className="k-vip-header">
      <div className="k-vip-badge">{t('vipInvestor')}</div>
      <div className="k-vip-welcome">
        <div className="k-vip-avatar">KR</div>
        <div>
          <h1 className="k-vip-name">{t('welcomeKhalid')}</h1>
          <p className="k-vip-sub">{t('investorSub')}</p>
        </div>
      </div>
    </div>
  );

  // ─── RENDER: TOWER SELECTION ───
  const TowerSelection = () => (
    <section className="k-tower-section">
      <h2 className="k-section-title">{t('premiumInvestment')}</h2>
      <p className="k-section-sub">{t('selectTowerSub')}</p>
      <div className="k-towers-grid">
        {Object.entries(towerInfo).map(([key, tower]) => (
          <div key={key} className="k-tower-card" onClick={() => selectTower(key)}>
            <img src={tower.img} alt={t(tower.nameKey)} className="k-tower-img" loading="lazy" />
            <div className="k-tower-overlay">
              <div className="k-tower-badge">{t('estROI')} 8-18%</div>
              <h3 className="k-tower-name">{t(tower.nameKey)}</h3>
              <p className="k-tower-desc">{tower.descInvestor[lang] || tower.descInvestor.en}</p>
              <span className="k-tower-count">{towerCounts[key]} {t('luxuryUnits')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Overview Stats */}
      <div className="k-invest-bar">
        <div className="k-invest-stat">
          <span className="k-invest-val">8-18%</span>
          <span className="k-invest-label">{t('annualROI')}</span>
        </div>
        <div className="k-invest-stat">
          <span className="k-invest-val">$2,500</span>
          <span className="k-invest-label">{t('avgRental')}</span>
        </div>
        <div className="k-invest-stat">
          <span className="k-invest-val">14%</span>
          <span className="k-invest-label">{t('yoyAppreciation')}</span>
        </div>
        <div className="k-invest-stat">
          <span className="k-invest-val">99%</span>
          <span className="k-invest-label">{t('occupancyRate')}</span>
        </div>
      </div>
    </section>
  );

  // ─── RENDER: PROPERTIES SCREEN ───
  const PropertiesScreen = () => (
    <section className="k-properties">
      <button className="k-back-btn" onClick={() => setCurrentTower(null)}>
        ← {t('backToTower')}
      </button>
      <h2 className="k-section-title">{towerNames[currentTower]}</h2>

      {/* Bedroom Filter Tabs */}
      <div className="k-bed-tabs">
        <button className={`k-bed-tab ${bedFilter === 'all' ? 'active' : ''}`}
          onClick={() => { setBedFilter('all'); track('bedroom_filter', { filter: 'all' }, visitor); }}>
          {t('allProperties')}
        </button>
        {bedTypes.map(b => (
          <button key={b} className={`k-bed-tab ${bedFilter === b ? 'active' : ''}`}
            onClick={() => { setBedFilter(b); track('bedroom_filter', { filter: b }, visitor); }}>
            {b === 'penthouse' ? t('penthouses') : t(`bed${b}`)}
          </button>
        ))}
      </div>

      {/* Unit Cards Grid */}
      <div className="k-units-grid">
        {filteredUnits.map((u, i) => (
          <div key={u.id} className="k-unit-card" style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => openModal(u)}>
            <div className="k-unit-img-wrap">
              <img src={u.img.card} alt={u.n} className="k-unit-img" loading="lazy" />
            </div>
            <span className={`k-unit-badge ${u.s}`}>
              {t(u.s)}
            </span>
            <div className="k-unit-body">
              <div className="k-unit-type">{u.ty}</div>
              <div className="k-unit-name">{u.n}</div>
              <div className="k-unit-specs">
                <span>{u.tt.toLocaleString()} {t('sf')}</span>
                <span>·</span>
                <span>{u.b === 'penthouse' ? t('ph') : u.b + ' ' + t('br')}</span>
              </div>
              <div className="k-unit-roi">
                <div>
                  <span className="k-roi-val">{u.roi.annual}</span>
                  <div className="k-roi-label">{t('annualROI')}</div>
                </div>
                <div style={{ textAlign: 'end' }}>
                  <span className="k-roi-rental">{u.roi.rental}</span>
                  <div className="k-roi-label">{t('monthlyRental')}</div>
                </div>
              </div>
            </div>
            <div className="k-unit-actions" onClick={e => e.stopPropagation()}>
              <button className={`k-action-btn fav ${favorites.has(u.id) ? 'active' : ''}`}
                onClick={() => toggleFav(u.id)}>♥ {t('save')}</button>
              <button className={`k-action-btn ${compareList.includes(u.id) ? 'active' : ''}`}
                onClick={() => toggleCompare(u.id)}>⚖ {t('compare')}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ─── RENDER: PROPERTY MODAL ───
  const PropertyModal = () => {
    if (!selectedUnit) return null;
    const u = selectedUnit;
    const tabs = ['plans', 'views', 'blueprints', 'features', 'amenitiesTab'];

    return (
      <div className="k-modal-backdrop" onClick={() => setSelectedUnit(null)}>
        <div className="k-modal" onClick={e => e.stopPropagation()}>
          <div className="k-modal-header">
            <span className="k-modal-title">{t('planDetails')}</span>
            <button className="k-modal-close" onClick={() => setSelectedUnit(null)}>✕</button>
          </div>

          {/* Modal Tabs */}
          <div className="k-modal-tabs">
            {tabs.map(tab => (
              <button key={tab} className={`k-modal-tab ${modalTab === tab ? 'active' : ''}`}
                onClick={() => setModalTab(tab)}>
                {t(tab)}
              </button>
            ))}
          </div>

          <div className="k-modal-body">
            {/* Plans Tab */}
            {modalTab === 'plans' && (
              <div className="k-plan-section">
                <img src={u.img.fp} alt="Floor Plan" className="k-plan-img"
                  onClick={() => setFullsizeImg(u.img.fp)} />
                <div className="k-plan-info">
                  <h3 className="k-plan-name">{u.n}</h3>
                  <p className="k-plan-sub">{u.ty} — {towerNames[u.t]}</p>
                  <span className={`k-status-tag ${u.s}`}>{t(u.s)}</span>

                  <div className="k-specs-grid">
                    <div className="k-spec">
                      <span className="k-spec-label">{t('indoorSF')}</span>
                      <span className="k-spec-val">{u.i.toLocaleString()} {t('sf')}</span>
                    </div>
                    <div className="k-spec">
                      <span className="k-spec-label">{t('outdoorSF')}</span>
                      <span className="k-spec-val">{u.o.toLocaleString()} {t('sf')}</span>
                    </div>
                    <div className="k-spec">
                      <span className="k-spec-label">{t('totalSF')}</span>
                      <span className="k-spec-val">{u.tt.toLocaleString()} {t('sf')}</span>
                    </div>
                  </div>

                  <div className="k-roi-box">
                    <h4>{t('investmentProjections')}</h4>
                    <div className="k-roi-row">
                      <span>{t('estAnnualROI')}</span>
                      <strong className="k-gold">{u.roi.annual}</strong>
                    </div>
                    <div className="k-roi-row">
                      <span>{t('estMonthlyRental')}</span>
                      <strong>{u.roi.rental}</strong>
                    </div>
                  </div>

                  <div className="k-cta-stack">
                    <button className="k-cta gold" onClick={() => handleCTA('request_pricing', u.n)}>
                      {t('requestVIPPricing')}
                    </button>
                    <button className="k-cta outline" onClick={() => handleCTA('request_payment_plan', u.n)}>
                      {t('requestPaymentPlan')}
                    </button>
                    <button className="k-cta outline" onClick={() => handleCTA('download_floorplan', u.n)}>
                      {t('downloadFloorPlan')}
                    </button>
                    <button className="k-cta red" onClick={() => handleCTA('book_viewing', u.n)}>
                      {t('scheduleViewing')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Views Tab */}
            {modalTab === 'views' && (
              <div>
                <div className="k-gallery-grid">
                  {u.img.views.map((v, i) => (
                    <div key={i} className="k-gallery-item" onClick={() => setFullsizeImg(v.url)}>
                      <img src={v.url} alt={v.l} loading="lazy" />
                      <span className="k-gallery-label">{v.l}</span>
                    </div>
                  ))}
                </div>
                <p className="k-footnote">{t('artistRenderings')}</p>
              </div>
            )}

            {/* Blueprints Tab */}
            {modalTab === 'blueprints' && (
              <div>
                <div className="k-gallery-grid">
                  {u.img.bp.map((b, i) => (
                    <div key={i} className="k-gallery-item" onClick={() => setFullsizeImg(b.url)}>
                      <img src={b.url} alt={b.l} loading="lazy" />
                      <span className="k-gallery-label">{b.l}</span>
                    </div>
                  ))}
                </div>
                <p className="k-footnote">{t('archBlueprints')}</p>
              </div>
            )}

            {/* Features Tab */}
            {modalTab === 'features' && (
              <div className="k-features-grid">
                {Object.entries(u.f).map(([room, items]) => (
                  <div key={room} className="k-feature-group">
                    <h4 className="k-feature-title">{t(room)}</h4>
                    <ul className="k-feature-list">
                      {items.map((item, i) => (
                        <li key={i}>{tFeature(item, lang)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Amenities Tab */}
            {modalTab === 'amenitiesTab' && (
              <div className="k-amenities-wrap">
                {u.a.map((am, i) => (
                  <span key={i} className="k-amenity-tag">{am}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER: COMPARE BAR ───
  const CompareBar = () => {
    if (compareList.length === 0) return null;
    return (
      <div className="k-compare-bar">
        <span>{t('compareProperties')} ({compareList.length}/3 {t('selected')})</span>
        <div className="k-compare-actions">
          <button onClick={() => setCompareList([])}>{t('clear')}</button>
          <button className="go" onClick={() => {
            if (compareList.length < 2) { showToast(t('selectAtLeast')); return; }
            setShowCompare(true);
          }}>{t('compareNow')}</button>
        </div>
      </div>
    );
  };

  // ─── RENDER: COMPARE MODAL ───
  const CompareModal = () => {
    if (!showCompare) return null;
    const items = compareList.map(id => units.find(u => u.id === id)).filter(Boolean);
    return (
      <div className="k-modal-backdrop" onClick={() => setShowCompare(false)}>
        <div className="k-modal wide" onClick={e => e.stopPropagation()}>
          <div className="k-modal-header">
            <span className="k-modal-title">{t('investmentComparison')}</span>
            <button className="k-modal-close" onClick={() => setShowCompare(false)}>✕</button>
          </div>
          <div className="k-compare-table-wrap">
            <table className="k-compare-table">
              <thead>
                <tr>
                  <th></th>
                  {items.map(u => <th key={u.id}>{u.n}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td>{t('type')}</td>{items.map(u => <td key={u.id}>{u.ty}</td>)}</tr>
                <tr><td>{t('totalSF')}</td>{items.map(u => <td key={u.id}>{u.tt.toLocaleString()} {t('sf')}</td>)}</tr>
                <tr><td>{t('indoorSFLabel')}</td>{items.map(u => <td key={u.id}>{u.i.toLocaleString()}</td>)}</tr>
                <tr><td>{t('outdoorSFLabel')}</td>{items.map(u => <td key={u.id}>{u.o.toLocaleString()}</td>)}</tr>
                <tr><td>{t('annualROI')}</td>{items.map(u => <td key={u.id} className="k-gold">{u.roi.annual}</td>)}</tr>
                <tr><td>{t('monthlyRental')}</td>{items.map(u => <td key={u.id}>{u.roi.rental}</td>)}</tr>
                <tr><td>{t('status')}</td>{items.map(u => <td key={u.id}><span className={`k-status-tag ${u.s}`}>{t(u.s)}</span></td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ───
  return (
    <div className={`k-portal ${isRTL ? 'rtl' : ''}`}>
      <DemoBar />
      <VIPHeader />

      <main className="k-main">
        {!currentTower ? <TowerSelection /> : <PropertiesScreen />}
      </main>

      <PropertyModal />
      <CompareBar />
      <CompareModal />

      {/* Fullsize Image Overlay */}
      {fullsizeImg && (
        <div className="k-fullsize" onClick={() => setFullsizeImg(null)}>
          <img src={fullsizeImg} alt="Full Size" />
        </div>
      )}

      {/* Toast */}
      {toast && <div className="k-toast">{toast}</div>}
    </div>
  );
}
