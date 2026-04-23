import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════
   ROI Calculator — Real Estate Investment Tool
   Part of the DynamicNFC CRM Demo System
   ═══════════════════════════════════════════════════════ */

const TR = {
  en: {
    back: "Back to Portal",
    badge: "INVESTMENT TOOL",
    title: "ROI Calculator",
    subtitle: "Estimate your return on investment for premium real estate properties. Adjust the parameters below to see projected returns.",
    propPrice: "Property Price",
    downPayment: "Down Payment",
    annualRent: "Annual Rental Income",
    appreciation: "Annual Appreciation",
    holdYears: "Investment Period",
    years: "years",
    calculate: "Calculate ROI",
    results: "Investment Projection",
    totalInvested: "Total Invested",
    propertyValueEnd: "Property Value",
    totalRentalIncome: "Total Rental Income",
    totalReturn: "Total Return",
    netProfit: "Net Profit",
    roi: "ROI",
    annualRoi: "Annual ROI",
    breakdownTitle: "Year-by-Year Breakdown",
    year: "Year",
    value: "Property Value",
    rentCum: "Cumulative Rent",
    totalVal: "Total Value",
    disclaimer: "This calculator provides estimates for informational purposes only. Actual returns may vary based on market conditions, taxes, maintenance costs, and other factors. Consult a financial advisor before making investment decisions.",
    currency: "$",
    unitTypes: "Unit Type",
    penthouse: "Penthouse",
    standard: "Standard Residence",
    studio: "Studio Apartment",
    custom: "Custom",
  },
  ar: {
    back: "العودة إلى البوابة",
    badge: "أداة استثمارية",
    title: "حاسبة العائد على الاستثمار",
    subtitle: "قدّر عائد استثمارك في العقارات الفاخرة. عدّل المعطيات أدناه لعرض العوائد المتوقعة.",
    propPrice: "سعر العقار",
    downPayment: "الدفعة المقدمة",
    annualRent: "الإيجار السنوي",
    appreciation: "التقدير السنوي",
    holdYears: "فترة الاستثمار",
    years: "سنوات",
    calculate: "احسب العائد",
    results: "توقعات الاستثمار",
    totalInvested: "إجمالي المستثمر",
    propertyValueEnd: "قيمة العقار",
    totalRentalIncome: "إجمالي الإيجار",
    totalReturn: "إجمالي العائد",
    netProfit: "صافي الربح",
    roi: "العائد على الاستثمار",
    annualRoi: "العائد السنوي",
    breakdownTitle: "التفصيل السنوي",
    year: "السنة",
    value: "قيمة العقار",
    rentCum: "الإيجار التراكمي",
    totalVal: "القيمة الإجمالية",
    disclaimer: "هذه الحاسبة تقدم تقديرات لأغراض إعلامية فقط. قد تختلف العوائد الفعلية بناءً على ظروف السوق والضرائب وتكاليف الصيانة وعوامل أخرى. استشر مستشاراً مالياً قبل اتخاذ قرارات الاستثمار.",
    currency: "$",
    unitTypes: "نوع الوحدة",
    penthouse: "بنتهاوس",
    standard: "سكن عادي",
    studio: "استوديو",
    custom: "مخصص",
  },
};

const PRESETS = [
  { key: "penthouse", price: 4500000, down: 25, rent: 280000, appr: 8.2 },
  { key: "standard", price: 1800000, down: 20, rent: 120000, appr: 7.5 },
  { key: "studio", price: 750000, down: 15, rent: 55000, appr: 6.8 },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

.roi-page {
  min-height: 100vh; font-family: 'Outfit', sans-serif;
  background: linear-gradient(170deg, #0a0a0f 0%, #12121a 40%, #0d1117 100%);
  color: #e8e8ec; padding-bottom: 4rem;
  -webkit-font-smoothing: antialiased;
}
.roi-page * { margin: 0; padding: 0; box-sizing: border-box; }

.roi-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 50;
  background: rgba(10,10,15,0.8);
}
.roi-nav-logo { height: 48px; width: auto; }
.roi-nav-back {
  display: inline-flex; align-items: center; gap: 0.5rem;
  color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.8rem;
  font-weight: 500; transition: color 0.2s; border: 1px solid rgba(255,255,255,0.1);
  padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.03);
}
.roi-nav-back:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
.roi-nav-back svg { width: 16px; height: 16px; }
.roi-lang { display: flex; gap: 3px; }
.roi-lang button {
  width: 34px; height: 30px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04); cursor: pointer; font-size: 0.72rem; font-weight: 600;
  color: rgba(255,255,255,0.4); transition: all 0.2s; font-family: 'Outfit', sans-serif;
}
.roi-lang button.active { background: rgba(184,134,11,0.15); border-color: rgba(184,134,11,0.3); color: #b8860b; }
.roi-nav-right { display: flex; align-items: center; gap: 0.75rem; }

.roi-container { max-width: 960px; margin: 0 auto; padding: 3rem 2rem; }

.roi-header { text-align: center; margin-bottom: 3rem; }
.roi-badge {
  display: inline-block; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em;
  color: #b8860b; margin-bottom: 1rem; padding: 0.35rem 1rem; border-radius: 50px;
  background: rgba(184,134,11,0.08); border: 1px solid rgba(184,134,11,0.15);
}
.roi-title {
  font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 500; margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.roi-subtitle { font-size: 0.9rem; line-height: 1.7; color: rgba(255,255,255,0.4); max-width: 560px; margin: 0 auto; }

/* Presets */
.roi-presets { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 2.5rem; flex-wrap: wrap; }
.roi-preset {
  padding: 0.6rem 1.25rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 0.78rem;
  font-weight: 500; cursor: pointer; transition: all 0.25s; font-family: 'Outfit', sans-serif;
}
.roi-preset:hover { border-color: rgba(184,134,11,0.3); color: #b8860b; }
.roi-preset.active { background: rgba(184,134,11,0.1); border-color: rgba(184,134,11,0.3); color: #b8860b; }

/* Form */
.roi-form {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px; padding: 2rem; margin-bottom: 2.5rem;
}
.roi-field { display: flex; flex-direction: column; gap: 0.4rem; }
.roi-field.full { grid-column: 1 / -1; }
.roi-label {
  font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: rgba(255,255,255,0.4);
}
.roi-input-wrap { position: relative; }
.roi-input {
  width: 100%; padding: 0.75rem 1rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  color: #fff; font-size: 1rem; font-family: 'Outfit', sans-serif;
  font-weight: 500; outline: none; transition: border-color 0.2s;
}
.roi-input:focus { border-color: rgba(184,134,11,0.4); }
.roi-input-suffix {
  position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
  font-size: 0.78rem; color: rgba(255,255,255,0.3); pointer-events: none;
}
.roi-slider-val {
  display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem;
}
.roi-slider-num { font-size: 1.1rem; font-weight: 600; color: #b8860b; }
.roi-slider {
  width: 100%; -webkit-appearance: none; appearance: none; height: 4px;
  border-radius: 2px; background: rgba(255,255,255,0.08); outline: none; margin-top: 0.5rem;
}
.roi-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
  background: #b8860b; cursor: pointer; border: 2px solid #0a0a0f;
  box-shadow: 0 0 8px rgba(184,134,11,0.4);
}

/* Results */
.roi-results {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px; padding: 2rem; margin-bottom: 2rem;
}
.roi-results-title {
  font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 500;
  margin-bottom: 1.5rem; color: #fff;
}
.roi-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
.roi-metric {
  padding: 1.25rem; border-radius: 14px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  text-align: center;
}
.roi-metric-val {
  font-size: 1.35rem; font-weight: 700; display: block; margin-bottom: 0.2rem;
}
.roi-metric-val.gold { color: #b8860b; }
.roi-metric-val.green { color: #2a9d5c; }
.roi-metric-val.blue { color: #457b9d; }
.roi-metric-val.red { color: #e63946; }
.roi-metric-lbl {
  font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em;
  color: rgba(255,255,255,0.35);
}

/* Table */
.roi-table-wrap { overflow-x: auto; }
.roi-table-title {
  font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; color: rgba(255,255,255,0.6);
}
.roi-table {
  width: 100%; border-collapse: collapse; font-size: 0.8rem;
}
.roi-table th {
  text-align: left; padding: 0.6rem 1rem; font-size: 0.68rem; text-transform: uppercase;
  letter-spacing: 0.06em; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06);
  font-weight: 600;
}
.roi-table td {
  padding: 0.6rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.7);
}
.roi-table tr:last-child td { border-bottom: none; font-weight: 600; color: #b8860b; }

/* ROI Bar */
.roi-bar-wrap { margin-top: 1.5rem; }
.roi-bar-label { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.roi-bar-text { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
.roi-bar-pct { font-size: 0.85rem; font-weight: 700; color: #2a9d5c; }
.roi-bar-track {
  height: 8px; border-radius: 4px; background: rgba(255,255,255,0.06); overflow: hidden;
}
.roi-bar-fill {
  height: 100%; border-radius: 4px;
  background: linear-gradient(90deg, #b8860b, #2a9d5c);
  transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
}

.roi-disclaimer {
  font-size: 0.7rem; line-height: 1.6; color: rgba(255,255,255,0.25);
  text-align: center; max-width: 600px; margin: 2rem auto 0;
  padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.04);
}

/* Responsive */
@media (max-width: 700px) {
  .roi-form { grid-template-columns: 1fr; }
  .roi-metrics { grid-template-columns: 1fr 1fr; }
  .roi-nav { padding: 1rem 1.25rem; }
  .roi-container { padding: 2rem 1.25rem; }
}
@media (max-width: 480px) {
  .roi-metrics { grid-template-columns: 1fr; }
}
`;

function fmt(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function detectLang() {
  const n = navigator.language || navigator.userLanguage || "en";
  return n.startsWith("ar") ? "ar" : "en";
}

export default function ROICalculator() {
  const [lang, setLang] = useState(detectLang);
  const isRTL = lang === "ar";
  const t = (k) => TR[lang]?.[k] || TR.en[k] || k;

  const [activePreset, setActivePreset] = useState("penthouse");
  const [price, setPrice] = useState(4500000);
  const [downPct, setDownPct] = useState(25);
  const [rent, setRent] = useState(280000);
  const [apprPct, setApprPct] = useState(8.2);
  const [holdYears, setHoldYears] = useState(5);

  const applyPreset = (p) => {
    setActivePreset(p.key);
    setPrice(p.price);
    setDownPct(p.down);
    setRent(p.rent);
    setApprPct(p.appr);
  };

  const results = useMemo(() => {
    const downPayment = price * (downPct / 100);
    const totalInvested = downPayment;
    const rows = [];
    let cumRent = 0;

    for (let y = 1; y <= holdYears; y++) {
      const propVal = price * Math.pow(1 + apprPct / 100, y);
      cumRent += rent;
      rows.push({ year: y, propVal, cumRent, total: propVal + cumRent - price + downPayment });
    }

    const finalPropVal = price * Math.pow(1 + apprPct / 100, holdYears);
    const totalRental = rent * holdYears;
    const totalReturn = finalPropVal + totalRental;
    const netProfit = totalReturn - price;
    const roi = ((netProfit / totalInvested) * 100);
    const annualRoi = roi / holdYears;

    return { totalInvested, finalPropVal, totalRental, totalReturn, netProfit, roi, annualRoi, rows };
  }, [price, downPct, rent, apprPct, holdYears]);

  return (
    <div className="roi-page" dir={isRTL ? "rtl" : "ltr"}>
      <style>{CSS}</style>

      <nav className="roi-nav">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="DynamicNFC" className="roi-nav-logo" />
        </Link>
        <div className="roi-nav-right">
          <div className="roi-lang">
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>ع</button>
          </div>
          <Link to="/enterprise/crmdemo/khalid" className="roi-nav-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {t("back")}
          </Link>
        </div>
      </nav>

      <div className="roi-container">
        {/* Header */}
        <div className="roi-header">
          <span className="roi-badge">{t("badge")}</span>
          <h1 className="roi-title">{t("title")}</h1>
          <p className="roi-subtitle">{t("subtitle")}</p>
        </div>

        {/* Presets */}
        <div className="roi-presets">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              className={`roi-preset${activePreset === p.key ? " active" : ""}`}
              onClick={() => applyPreset(p)}
            >
              {t(p.key)}
            </button>
          ))}
          <button
            className={`roi-preset${activePreset === "custom" ? " active" : ""}`}
            onClick={() => setActivePreset("custom")}
          >
            {t("custom")}
          </button>
        </div>

        {/* Input Form */}
        <div className="roi-form">
          <div className="roi-field">
            <label className="roi-label">{t("propPrice")}</label>
            <div className="roi-input-wrap">
              <input
                type="number"
                className="roi-input"
                value={price}
                onChange={(e) => { setPrice(Number(e.target.value) || 0); setActivePreset("custom"); }}
                min={0}
                step={50000}
              />
            </div>
          </div>

          <div className="roi-field">
            <label className="roi-label">{t("annualRent")}</label>
            <div className="roi-input-wrap">
              <input
                type="number"
                className="roi-input"
                value={rent}
                onChange={(e) => { setRent(Number(e.target.value) || 0); setActivePreset("custom"); }}
                min={0}
                step={5000}
              />
            </div>
          </div>

          <div className="roi-field">
            <label className="roi-label">{t("downPayment")}</label>
            <input
              type="range"
              className="roi-slider"
              min={10}
              max={100}
              value={downPct}
              onChange={(e) => { setDownPct(Number(e.target.value)); setActivePreset("custom"); }}
            />
            <div className="roi-slider-val">
              <span className="roi-slider-num">{downPct}%</span>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{fmt(price * downPct / 100)}</span>
            </div>
          </div>

          <div className="roi-field">
            <label className="roi-label">{t("appreciation")}</label>
            <input
              type="range"
              className="roi-slider"
              min={0}
              max={20}
              step={0.1}
              value={apprPct}
              onChange={(e) => { setApprPct(Number(e.target.value)); setActivePreset("custom"); }}
            />
            <div className="roi-slider-val">
              <span className="roi-slider-num">{apprPct}%</span>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{fmt(price * apprPct / 100)}{" / yr"}</span>
            </div>
          </div>

          <div className="roi-field full">
            <label className="roi-label">{t("holdYears")}</label>
            <input
              type="range"
              className="roi-slider"
              min={1}
              max={15}
              value={holdYears}
              onChange={(e) => setHoldYears(Number(e.target.value))}
            />
            <div className="roi-slider-val">
              <span className="roi-slider-num">{holdYears} {t("years")}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="roi-results">
          <h2 className="roi-results-title">{t("results")}</h2>

          <div className="roi-metrics">
            <div className="roi-metric">
              <span className="roi-metric-val blue">{fmt(results.totalInvested)}</span>
              <span className="roi-metric-lbl">{t("totalInvested")}</span>
            </div>
            <div className="roi-metric">
              <span className="roi-metric-val gold">{fmt(results.finalPropVal)}</span>
              <span className="roi-metric-lbl">{t("propertyValueEnd")}</span>
            </div>
            <div className="roi-metric">
              <span className="roi-metric-val green">{fmt(results.netProfit)}</span>
              <span className="roi-metric-lbl">{t("netProfit")}</span>
            </div>
            <div className="roi-metric">
              <span className="roi-metric-val red">{results.roi.toFixed(1)}%</span>
              <span className="roi-metric-lbl">{t("roi")}</span>
            </div>
          </div>

          {/* ROI Bar */}
          <div className="roi-bar-wrap">
            <div className="roi-bar-label">
              <span className="roi-bar-text">{t("annualRoi")}</span>
              <span className="roi-bar-pct">{results.annualRoi.toFixed(1)}%</span>
            </div>
            <div className="roi-bar-track">
              <div className="roi-bar-fill" style={{ width: `${Math.min(results.annualRoi * 2, 100)}%` }} />
            </div>
          </div>

          {/* Year-by-Year Table */}
          <div className="roi-table-wrap" style={{ marginTop: "2rem" }}>
            <div className="roi-table-title">{t("breakdownTitle")}</div>
            <table className="roi-table">
              <thead>
                <tr>
                  <th>{t("year")}</th>
                  <th>{t("value")}</th>
                  <th>{t("rentCum")}</th>
                  <th>{t("netProfit")}</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{fmt(r.propVal)}</td>
                    <td>{fmt(r.cumRent)}</td>
                    <td>{fmt(r.propVal - price + r.cumRent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="roi-disclaimer">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
