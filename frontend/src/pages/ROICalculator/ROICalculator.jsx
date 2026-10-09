import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import './ROICalculator.css';
import SEO from '../../components/SEO/SEO';
import { useLanguage } from '../../i18n';
import { ROI_TR as TR } from './roiCalculatorTranslations';

/* ─── Industry Presets (labels live in roiCalculatorTranslations.js under ind[key]) ─── */
const INDUSTRIES = {
  real_estate: {
    defaults: { vip: 100, price: 750000, views: 40, days: 21, conv: 4 },
    priceMin: 200000, priceMax: 5000000, priceStep: 50000,
    viewMax: 200, dayMax: 60,
  },
  automotive: {
    defaults: { vip: 75, price: 85000, views: 60, days: 14, conv: 6 },
    priceMin: 20000, priceMax: 500000, priceStep: 5000,
    viewMax: 300, dayMax: 45,
  },
};

/* ─── Animated Counter ─── */
function AnimNum({ value, prefix = "", suffix = "", decimals = 0, duration = 700 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = display;
    const end = value;
    if (start === end) return;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * ease);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  const f = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("en-US");
  return <span>{prefix}{f}{suffix}</span>;
}

/* ─── Slider ─── */
function Slider({ label, value, min, max, step, onChange, prefix = "", suffix = "", desc }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rc-slider-group">
      <div className="rc-slider-header">
        <span className="rc-slider-label">{label}</span>
        <span className="rc-slider-value">{prefix}{typeof value === 'number' ? value.toLocaleString('en-US') : value}{suffix}</span>
      </div>
      {desc && <p className="rc-slider-desc">{desc}</p>}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="rc-slider"
        style={{ background: `linear-gradient(to right, #e63946 0%, #e63946 ${pct}%, #e5e7eb ${pct}%)` }}
      />
    </div>
  );
}

/* ─── KPI Card ─── */
function KPI({ label, children, accent, sub }) {
  return (
    <div className={`rc-kpi ${accent || ""}`}>
      <div className="rc-kpi-value">{children}</div>
      <div className="rc-kpi-label">{label}</div>
      {sub && <div className="rc-kpi-sub">{sub}</div>}
    </div>
  );
}

/* ─── Funnel Bar ─── */
function FunnelBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="rc-funnel-row">
      <span className="rc-funnel-label">{label}</span>
      <div className="rc-funnel-track">
        <div className="rc-funnel-fill" style={{ width: `${Math.max(pct, 2)}%`, background: color }} />
      </div>
      <span className="rc-funnel-num">{Math.round(value).toLocaleString('en-US')}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
export default function ROICalculator() {
  const [searchParams] = useSearchParams();
  const initialIndustry = searchParams.get('industry') === 'automotive' ? 'automotive' : 'real_estate';

  const [industry, setIndustry] = useState(initialIndustry);
  const ind = INDUSTRIES[industry];
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;
  const indText = t('ind')[industry];

  const [vipInvites, setVipInvites] = useState(INDUSTRIES[initialIndustry].defaults.vip);
  const [avgPrice, setAvgPrice] = useState(INDUSTRIES[initialIndustry].defaults.price);
  const [currentViewings, setCurrentViewings] = useState(INDUSTRIES[initialIndustry].defaults.views);
  const [currentDaysToView, setCurrentDaysToView] = useState(INDUSTRIES[initialIndustry].defaults.days);
  const [currentConversion, setCurrentConversion] = useState(INDUSTRIES[initialIndustry].defaults.conv);

  const switchIndustry = (key) => {
    setIndustry(key);
    const d = INDUSTRIES[key].defaults;
    setVipInvites(d.vip);
    setAvgPrice(d.price);
    setCurrentViewings(d.views);
    setCurrentDaysToView(d.days);
    setCurrentConversion(d.conv);
  };

  const TAP_RATE = 0.68, ENGAGEMENT_LIFT = 0.47, CONVERSION_MULTIPLIER = 3.2, SPEED_REDUCTION = 0.52, COST_PER_VIP = 45;

  const taps = Math.round(vipInvites * TAP_RATE);
  const engagedVIPs = Math.round(taps * (1 + ENGAGEMENT_LIFT));
  const additionalViewings = Math.round(engagedVIPs * 0.42);
  const totalViewings = currentViewings + additionalViewings;
  const baseConvRate = currentConversion / 100;
  const vipConvRate = Math.min(baseConvRate * CONVERSION_MULTIPLIER, 0.35);
  const baseSales = Math.round(currentViewings * baseConvRate);
  const vipSales = Math.round(additionalViewings * vipConvRate);
  const totalSales = baseSales + vipSales;
  const salesLift = baseSales > 0 ? ((totalSales - baseSales) / baseSales * 100) : 0;
  const newDaysToView = Math.round(currentDaysToView * (1 - SPEED_REDUCTION));
  const daysSaved = currentDaysToView - newDaysToView;
  const revenueImpact = vipSales * avgPrice;
  const investment = vipInvites * COST_PER_VIP;
  const roi = investment > 0 ? revenueImpact / investment : 0;

  return (
    <div className="rc-page">
      <SEO title={t('seoTitle')} description={t('seoDesc')} path="/sales/roi-calculator" />
      {/* Nav */}
      <nav className="rc-nav">
        <a href="/" className="rc-nav-logo">
          <span className="rc-logo-text"><span className="rc-logo-dynamic">Dynamic</span><span className="rc-logo-nfc">NFC</span></span>
          <svg className="rc-logo-waves" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#457b9d" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9.5 8.5a5 5 0 0 1 0 7" /><path d="M13 6a9 9 0 0 1 0 12" /><path d="M16.5 3.5a13 13 0 0 1 0 17" />
          </svg>
        </a>
        <div className="rc-nav-badge"><span className="rc-pulse" />{t('navBadge')} — {indText.label}</div>
      </nav>

      {/* Header */}
      <div className="rc-header">
        <h1 className="rc-title">{t('title1')}<br /><span className="rc-accent">{vipInvites.toLocaleString('en-US')} {t('titleInv')}</span>{t('titleEnd')}</h1>
        <p className="rc-subtitle">{t('subtitle')}</p>
      </div>

      {/* Industry Switcher */}
      <div className="rc-industry-switcher">
        {Object.entries(INDUSTRIES).map(([key]) => (
          <button key={key} className={`rc-industry-btn${industry === key ? ' active' : ''}`} onClick={() => switchIndustry(key)}>{t('ind')[key].label}</button>
        ))}
      </div>

      <div className="rc-layout">
        {/* Inputs */}
        <div className="rc-inputs">
          <div className="rc-card rc-card-input">
            <h2 className="rc-card-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>{indText.titleLabel}</h2>
            <Slider label={t('sliderVip')} desc={t('sliderVipDesc')} value={vipInvites} min={25} max={500} step={25} onChange={setVipInvites} />
            <Slider label={indText.priceLabel} value={avgPrice} min={ind.priceMin} max={ind.priceMax} step={ind.priceStep} onChange={setAvgPrice} prefix="$" />
            <Slider label={indText.viewLabel} desc={t('viewDesc')} value={currentViewings} min={5} max={ind.viewMax} step={5} onChange={setCurrentViewings} />
            <Slider label={indText.dayLabel} value={currentDaysToView} min={3} max={ind.dayMax} step={1} onChange={setCurrentDaysToView} suffix={t('daysSuffix')} />
            <Slider label={t('convLabel')} desc={indText.convDesc} value={currentConversion} min={1} max={15} step={0.5} onChange={setCurrentConversion} suffix="%" />
          </div>
        </div>

        {/* Results */}
        <div className="rc-results">
          <div className="rc-kpi-grid">
            <KPI label={indText.kpiAdditional} accent="rc-kpi-blue"><AnimNum value={additionalViewings} prefix="+" /></KPI>
            <KPI label={t('kpiDays')} accent="rc-kpi-red"><AnimNum value={daysSaved} /></KPI>
            <KPI label={t('kpiSales')} accent="rc-kpi-green"><AnimNum value={vipSales} prefix="+" /></KPI>
            <KPI label={t('kpiRevenue')} accent="rc-kpi-gold" sub={<>{t('kpiInvestment')}<AnimNum value={investment} /></>}><AnimNum value={revenueImpact} prefix="$" /></KPI>
          </div>

          <div className="rc-roi-hero">
            <div className="rc-roi-label">{t('roiLabel')}</div>
            <div className="rc-roi-value"><AnimNum value={roi} decimals={0} suffix="×" /></div>
            <div className="rc-roi-sub">{t('roiSub')}</div>
          </div>

          <div className="rc-card">
            <h2 className="rc-card-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#457b9d" strokeWidth="2"><path d="M22 2L2 2l7 9v7l6 3V11z"/></svg>{t('funnelTitle')}</h2>
            <FunnelBar label={t('fSent')} value={vipInvites} max={vipInvites} color="#457b9d" />
            <FunnelBar label={t('fTapped')} value={taps} max={vipInvites} color="#5a9bbd" />
            <FunnelBar label={t('fEngaged')} value={engagedVIPs} max={vipInvites} color="#d4a017" />
            <FunnelBar label={indText.fBooked} value={additionalViewings} max={vipInvites} color="#e67317" />
            <FunnelBar label={t('fClosed')} value={vipSales} max={vipInvites} color="#e63946" />
          </div>

          <div className="rc-card">
            <h2 className="rc-card-title">{t('assumeTitle')}</h2>
            <ul className="rc-assumptions">
              <li>{t('aTap')((TAP_RATE * 100).toFixed(0))}</li>
              <li>{t('aEng')((ENGAGEMENT_LIFT * 100).toFixed(0))}</li>
              <li>{t('aConv')(CONVERSION_MULTIPLIER)}</li>
              <li>{t('aSpeed')((SPEED_REDUCTION * 100).toFixed(0))}</li>
              <li>{t('aCost')(COST_PER_VIP)}</li>
            </ul>
          </div>

          <div className="rc-compare">
            <div className="rc-compare-col rc-compare-before">
              <div className="rc-compare-tag">{t('without')}</div>
              <div className="rc-compare-row"><span>{indText.monthly}</span><strong>{currentViewings}</strong></div>
              <div className="rc-compare-row"><span>{indText.daysToFirst}</span><strong>{currentDaysToView}{t('daysSuffix')}</strong></div>
              <div className="rc-compare-row"><span>{t('convRate')}</span><strong>{currentConversion}%</strong></div>
              <div className="rc-compare-row"><span>{t('monthlySales')}</span><strong>{baseSales}</strong></div>
            </div>
            <div className="rc-compare-col rc-compare-after">
              <div className="rc-compare-tag rc-tag-active">{t('withDnfc')}</div>
              <div className="rc-compare-row"><span>{indText.monthly}</span><strong>{totalViewings}</strong></div>
              <div className="rc-compare-row"><span>{indText.daysToFirst}</span><strong>{newDaysToView}{t('daysSuffix')}</strong></div>
              <div className="rc-compare-row"><span>{t('vipConvRate')}</span><strong>{(vipConvRate * 100).toFixed(1)}%</strong></div>
              <div className="rc-compare-row"><span>{t('monthlySales')}</span><strong>{totalSales} <span className="rc-lift">+{salesLift.toFixed(0)}%</span></strong></div>
            </div>
          </div>

          <div className="rc-cta">
            <p className="rc-cta-text">{indText.ctaText}</p>
            <a href="/contact-sales" className="rc-cta-btn">{t('ctaBtn')}</a>
            <a href="/enterprise/crmdemo" className="rc-cta-link">{t('ctaLink')}</a>
          </div>
        </div>
      </div>

      <p className="rc-disclaimer">{t('disclaimer')}</p>
    </div>
  );
}
