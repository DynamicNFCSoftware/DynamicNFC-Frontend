// Dashboard.jsx
// Al Noor Residences Analytics Dashboard
// 7 tabs: Overview, VIP CRM, Priority VIP, Analytics, Units, Campaigns, Settings
// Real-time localStorage polling, Chart.js integration, VIP behavioral intelligence

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getEvents, getActionCounts, getLiveCounts, track } from '../../shared/tracking';
import { createT } from '../../shared/translations';
import { units as allUnits } from '../../shared/unitsData';
import './Dashboard.css';

const dashT = {
  en: {
    headerTitle: "Al Noor Residences", headerSub: "VIP Behavioral Intelligence",
    liveDemo: "Live Demo",
    navOverview: "Overview", navVipCrm: "VIP CRM", navPriority: "Priority VIP",
    navAnalytics: "Analytics", navUnits: "Units & Plans", navCampaigns: "Campaigns", navSettings: "Settings",
    execView: "Executive View",
    execDesc: "Conversions are identical for VIP and Standard traffic. The only difference is identity.",
    kpi1: "Primary KPI: Booked Viewings uplift", kpi2: "No forced funnel",
    kpi3: "Shared actions: Book, Pricing, Payment Plan, Brochure",
    mVipSessions: "VIP Sessions", mRegSessions: "Registered Sessions",
    mAnonSessions: "Anonymous Sessions", mTotalConversions: "Total Conversions",
    mVipSub: "Person known via NFC", mRegSub: "Marketplace sign-ups",
    mAnonSub: "Standard web traffic", mConvSub: "All shared actions",
    sharedConversions: "Shared Conversion Actions",
    actBookViewing: "Book a Viewing", actRequestPricing: "Request Pricing",
    actRequestPayment: "Request Payment Plan", actDownloadBrochure: "Download Brochure",
    vipLabel: "VIP", stdLabel: "Std",
    liveActivityFeed: "Live Activity Feed", realtimeInteractions: "Real-time portal interactions",
    vipDirectory: "VIP Directory", selectVipPrompt: "Select a VIP to view behavioral timeline.",
    leadScore: "Lead Score", alerts: "Alerts", salesRep: "Sales Rep",
    priorityVipList: "Priority VIP List", dailySalesCockpit: "Daily sales cockpit",
    analytics: "Analytics", unitsFloorPlans: "Units & Floor Plans",
    campaigns: "Campaigns", settings: "Settings",
    available: "Available", reserved: "Reserved", sold: "Sold",
    active: "Active", paused: "Paused",
    dataBoundaries: "Data Boundaries", mvpLock: "MVP Lock",
    outreachBtn: "📞 Outreach",
    help: "Help", createVip: "Create VIP",
  },
  ar: {
    headerTitle: "أنوار المساكن", headerSub: "ذكاء سلوكي VIP",
    liveDemo: "عرض مباشر",
    navOverview: "نظرة عامة", navVipCrm: "VIP CRM", navPriority: "أولوية VIP",
    navAnalytics: "التحليلات", navUnits: "الوحدات والمخططات", navCampaigns: "الحملات", navSettings: "الإعدادات",
    execView: "العرض التنفيذي",
    execDesc: "التحويلات متطابقة لحركة VIP والعادية. الفرق الوحيد هو الهوية.",
    kpi1: "المؤشر الرئيسي: زيادة المعاينات المحجوزة", kpi2: "بدون قمع إجباري",
    kpi3: "الإجراءات المشتركة: حجز، تسعير، خطة دفع، كتيب",
    mVipSessions: "جلسات VIP", mRegSessions: "جلسات مسجلة",
    mAnonSessions: "جلسات مجهولة", mTotalConversions: "إجمالي التحويلات",
    mVipSub: "شخص معروف عبر NFC", mRegSub: "تسجيلات السوق",
    mAnonSub: "حركة ويب عادية", mConvSub: "جميع الإجراءات المشتركة",
    sharedConversions: "إجراءات التحويل المشتركة",
    actBookViewing: "حجز معاينة", actRequestPricing: "طلب الأسعار",
    actRequestPayment: "طلب خطة الدفع", actDownloadBrochure: "تحميل الكتيب",
    vipLabel: "VIP", stdLabel: "عادي",
    liveActivityFeed: "سجل النشاط المباشر", realtimeInteractions: "تفاعلات في الوقت الفعلي",
    vipDirectory: "دليل VIP", selectVipPrompt: "اختر عميل VIP لعرض سلوكه.",
    leadScore: "نقاط العميل", alerts: "التنبيهات", salesRep: "مندوب المبيعات",
    priorityVipList: "قائمة أولوية VIP", dailySalesCockpit: "لوحة المبيعات اليومية",
    analytics: "التحليلات", unitsFloorPlans: "الوحدات والمخططات",
    campaigns: "الحملات", settings: "الإعدادات",
    available: "متاح", reserved: "محجوز", sold: "مباع",
    active: "نشط", paused: "متوقف",
    dataBoundaries: "حدود البيانات", mvpLock: "قفل MVP",
    outreachBtn: "📞 تواصل",
    help: "مساعدة", createVip: "إنشاء VIP",
  }
};

// VIP mock data
const vips = [
  { id: 'VIP-001', name: 'Khalid Al-Rashid', initials: 'KR', code: 'KAR-001', score: 92, type: 'investor',
    topTower: 'Al Qamar', alerts: ['Pricing Interest', 'High Intent'], rep: 'Sarah M.', card: 'NFC-2847',
    campaign: 'Winter Access', lastSeen: '12m ago', color: 'red',
    timeline: [
      { time: '12m ago', type: 'click', note: 'Requested pricing — Al Qamar Penthouse Alpha' },
      { time: '45m ago', type: 'view', note: 'Viewed Al Qamar Sub-Penthouse A' },
      { time: '2h ago', type: 'click', note: 'Downloaded floor plan — Penthouse Beta' },
      { time: '1d ago', type: 'view', note: 'First portal entry via NFC card' },
    ]},
  { id: 'VIP-002', name: 'Ahmed Al-Fahad', initials: 'AF', code: 'AAF-002', score: 47, type: 'family',
    topTower: 'Al Safwa', alerts: ['Family Buyer', 'Comparing Plans'], rep: 'Omar K.', card: 'NFC-3192',
    campaign: 'Payment Plan Priority', lastSeen: '3h ago', color: 'blue',
    timeline: [
      { time: '3h ago', type: 'view', note: 'Browsed Al Safwa Family 3BR units' },
      { time: '5h ago', type: 'click', note: 'Compared 3 family units side by side' },
      { time: '1d ago', type: 'view', note: 'First portal entry via NFC card' },
    ]},
];

const campaigns = [
  { name: 'Winter Access Campaign', status: 'active', cards: 25, activated: 18, convRate: '34%' },
  { name: 'Penthouse Preview', status: 'active', cards: 10, activated: 8, convRate: '45%' },
  { name: 'Payment Plan Priority', status: 'paused', cards: 40, activated: 22, convRate: '28%' },
];

export default function Dashboard() {
  const [lang, setLang] = useState(() => localStorage.getItem('dnfc_lang') || 'en');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVip, setSelectedVip] = useState(null);
  const [counts, setCounts] = useState({ vip: 2, registered: 48, anonymous: 127, total: 177 });
  const [actions, setActions] = useState({ book_viewing: { v: 0, s: 0 }, request_pricing: { v: 0, s: 0 }, request_payment_plan: { v: 0, s: 0 }, download_brochure: { v: 0, s: 0 } });
  const [feed, setFeed] = useState([]);

  const t = useMemo(() => createT(lang, dashT), [lang]);
  const isRTL = lang === 'ar';

  // Real-time polling
  useEffect(() => {
    const poll = setInterval(() => {
      const liveCounts = getLiveCounts();
      setCounts({ vip: Math.max(2, liveCounts.vip), registered: Math.max(48, liveCounts.registered + 48), anonymous: Math.max(127, liveCounts.anonymous + 127), total: Math.max(177, liveCounts.total + 177) });
      setActions(getActionCounts());
      const events = getEvents().slice(-20).reverse();
      setFeed(events.map(e => ({ time: formatTime(e.ts), visitor: e.v || 'Anonymous', type: e.tp, evt: e.evt, data: e.d })));
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => { localStorage.setItem('dnfc_lang', lang); document.documentElement.dir = isRTL ? 'rtl' : 'ltr'; }, [lang, isRTL]);

  function formatTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }

  const tabs = [
    { id: 'overview', label: t('navOverview') },
    { id: 'vipcrm', label: t('navVipCrm') },
    { id: 'priority', label: t('navPriority') },
    { id: 'analytics', label: t('navAnalytics') },
    { id: 'units', label: t('navUnits') },
    { id: 'campaigns', label: t('navCampaigns') },
    { id: 'settings', label: t('navSettings') },
  ];

  const totalActions = Object.values(actions).reduce((sum, a) => sum + a.v + a.s, 0);

  return (
    <div className={`d-dashboard ${isRTL ? 'rtl' : ''}`}>
      {/* Demo Bar */}
      <div className="d-demo-bar">
        <div className="d-demo-links">
          <a href="/khalid-portal" className="d-demo-link">{t('dbarKhalid')}</a>
          <a href="/ahmed-portal" className="d-demo-link">{t('dbarAhmed')}</a>
          <a href="/marketplace" className="d-demo-link">{t('dbarMarket')}</a>
          <a href="/dashboard" className="d-demo-link active">{t('dbarDash')}</a>
        </div>
        <div className="d-lang-btns">
          <button className={`d-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`d-lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>ع</button>
        </div>
      </div>

      {/* Header */}
      <header className="d-header">
        <div><h1 className="d-title">{t('headerTitle')}</h1><span className="d-subtitle">{t('headerSub')}</span></div>
        <div className="d-header-actions">
          <span className="d-live-badge">● {t('liveDemo')}</span>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="d-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`d-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </nav>

      <main className="d-main">
        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === 'overview' && (
          <div>
            {/* Executive Banner */}
            <div className="d-exec-banner">
              <h3>{t('execView')}</h3>
              <p>{t('execDesc')}</p>
              <div className="d-kpi-row">
                <span className="d-kpi">{t('kpi1')}</span>
                <span className="d-kpi">{t('kpi2')}</span>
                <span className="d-kpi">{t('kpi3')}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="d-metrics-grid">
              <div className="d-metric red"><div className="d-metric-label">{t('mVipSessions')}</div><div className="d-metric-val red">{counts.vip}</div><div className="d-metric-sub">{t('mVipSub')}</div></div>
              <div className="d-metric blue"><div className="d-metric-label">{t('mRegSessions')}</div><div className="d-metric-val blue">{counts.registered}</div><div className="d-metric-sub">{t('mRegSub')}</div></div>
              <div className="d-metric green"><div className="d-metric-label">{t('mAnonSessions')}</div><div className="d-metric-val green">{counts.anonymous}</div><div className="d-metric-sub">{t('mAnonSub')}</div></div>
              <div className="d-metric amber"><div className="d-metric-label">{t('mTotalConversions')}</div><div className="d-metric-val amber">{totalActions}</div><div className="d-metric-sub">{t('mConvSub')}</div></div>
            </div>

            {/* Shared Conversion Actions */}
            <h3 className="d-section-head">{t('sharedConversions')}</h3>
            <div className="d-action-grid">
              {[
                { key: 'book_viewing', label: t('actBookViewing'), color: 'red' },
                { key: 'request_pricing', label: t('actRequestPricing'), color: 'blue' },
                { key: 'request_payment_plan', label: t('actRequestPayment'), color: 'green' },
                { key: 'download_brochure', label: t('actDownloadBrochure'), color: 'amber' },
              ].map(a => (
                <div key={a.key} className="d-action-bar">
                  <div className={`d-action-val ${a.color}`}>{(actions[a.key]?.v || 0) + (actions[a.key]?.s || 0)}</div>
                  <div className="d-action-label">{a.label}</div>
                  <div className="d-action-split">
                    <span><span className="d-vip-dot" /> VIP: <b>{actions[a.key]?.v || 0}</b></span>
                    <span><span className="d-std-dot" /> Std: <b>{actions[a.key]?.s || 0}</b></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Activity Feed */}
            <h3 className="d-section-head">{t('liveActivityFeed')}</h3>
            <div className="d-feed-card">
              {feed.length === 0 ? (
                <p className="d-feed-empty">No activity yet. Open a portal to generate events.</p>
              ) : feed.map((f, i) => (
                <div key={i} className="d-feed-item">
                  <span className={`d-feed-dot ${f.type}`} />
                  <span className="d-feed-time">{f.time}</span>
                  <span className="d-feed-visitor">{f.visitor}</span>
                  <span className="d-feed-evt">{f.evt}{f.data?.cta_name ? `: ${f.data.cta_name}` : ''}{f.data?.tower ? ` → ${f.data.tower}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ VIP CRM TAB ═══ */}
        {activeTab === 'vipcrm' && (
          <div className="d-grid-2">
            <div className="d-card">
              <h3>{t('vipDirectory')}</h3>
              {vips.map(v => (
                <div key={v.id} className={`d-vip-row ${selectedVip?.id === v.id ? 'active' : ''}`}
                  onClick={() => setSelectedVip(v)}>
                  <div className={`d-vip-avatar ${v.color}`}>{v.initials}</div>
                  <div className="d-vip-info">
                    <div className="d-vip-name">{v.name}</div>
                    <div className="d-vip-sub">{v.code} · Score: {v.score}</div>
                  </div>
                  <div className="d-vip-score">{v.score}</div>
                </div>
              ))}
            </div>
            <div className="d-card">
              {selectedVip ? (
                <div>
                  <div className="d-vip-profile">
                    <div className={`d-vip-avatar lg ${selectedVip.color}`}>{selectedVip.initials}</div>
                    <div>
                      <h3>{selectedVip.name}</h3>
                      <p className="d-text-muted">{selectedVip.type} · {selectedVip.campaign}</p>
                    </div>
                  </div>
                  <div className="d-vip-stats">
                    <div><strong>{selectedVip.score}</strong><span>{t('leadScore')}</span></div>
                    <div><strong>{selectedVip.timeline.length}</strong><span>Events</span></div>
                    <div><strong>{selectedVip.alerts.length}</strong><span>{t('alerts')}</span></div>
                  </div>
                  <div className="d-alerts-row">
                    {selectedVip.alerts.map((a, i) => (
                      <span key={i} className={`d-alert-chip ${selectedVip.color}`}>{a}</span>
                    ))}
                  </div>
                  <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Timeline</h4>
                  <div className="d-timeline">
                    {selectedVip.timeline.map((e, i) => (
                      <div key={i} className="d-tl-item">
                        <div className={`d-tl-dot ${e.type}`} />
                        <div className="d-tl-time">{e.time}</div>
                        <div className="d-tl-note">{e.note}</div>
                      </div>
                    ))}
                  </div>
                  <button className="d-outreach-btn">{t('outreachBtn')}</button>
                </div>
              ) : (
                <p className="d-text-muted">{t('selectVipPrompt')}</p>
              )}
            </div>
          </div>
        )}

        {/* ═══ PRIORITY TAB ═══ */}
        {activeTab === 'priority' && (
          <div>
            <h3 className="d-section-head">{t('priorityVipList')}</h3>
            <p className="d-text-muted" style={{ marginBottom: '1rem' }}>{t('dailySalesCockpit')}</p>
            <div className="d-card">
              <table className="d-table">
                <thead>
                  <tr><th>VIP</th><th>Code</th><th>Top Tower</th><th>Lead Score</th><th>Alerts</th><th>Last Seen</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {vips.sort((a, b) => b.score - a.score).map(v => (
                    <tr key={v.id}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className={`d-vip-avatar sm ${v.color}`}>{v.initials}</div>{v.name}</div></td>
                      <td>{v.code}</td>
                      <td>{v.topTower}</td>
                      <td><span className={`d-score-badge ${v.score >= 80 ? 'high' : v.score >= 50 ? 'med' : 'low'}`}>{v.score}</span></td>
                      <td>{v.alerts.map((a, i) => <span key={i} className={`d-alert-chip sm ${v.color}`}>{a}</span>)}</td>
                      <td>{v.lastSeen}</td>
                      <td><button className="d-btn-sm">Outreach →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS TAB ═══ */}
        {activeTab === 'analytics' && (
          <div>
            <h3 className="d-section-head">{t('analytics')}</h3>
            <div className="d-grid-2">
              <div className="d-card">
                <h4>Action Performance</h4>
                <p className="d-text-muted">VIP vs Standard comparison</p>
                <div className="d-chart-placeholder">
                  {['Book Viewing', 'Request Pricing', 'Payment Plan', 'Download Brochure'].map((a, i) => (
                    <div key={i} className="d-bar-row">
                      <span className="d-bar-label">{a}</span>
                      <div className="d-bar-track">
                        <div className="d-bar-fill vip" style={{ width: `${20 + i * 15}%` }} />
                        <div className="d-bar-fill std" style={{ width: `${10 + i * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-card">
                <h4>VIP Intent Heatmap</h4>
                <div className="d-heatmap">
                  <div className="d-heat-row header"><span></span><span>PH</span><span>3BR</span><span>2BR</span></div>
                  <div className="d-heat-row"><span>Khalid</span><span className="d-heat vhigh">95</span><span className="d-heat high">72</span><span className="d-heat med">30</span></div>
                  <div className="d-heat-row"><span>Ahmed</span><span className="d-heat low">15</span><span className="d-heat vhigh">88</span><span className="d-heat med">45</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ UNITS TAB ═══ */}
        {activeTab === 'units' && (
          <div>
            <h3 className="d-section-head">{t('unitsFloorPlans')}</h3>
            <div className="d-card" style={{ overflowX: 'auto' }}>
              <table className="d-table">
                <thead><tr><th>Unit ID</th><th>Name</th><th>Tower</th><th>Type</th><th>Status</th><th>Total SF</th><th>ROI</th></tr></thead>
                <tbody>
                  {allUnits.slice(0, 15).map(u => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{u.id}</td>
                      <td>{u.n}</td>
                      <td>{u.t === 'luna' ? 'Al Qamar' : u.t === 'astra' ? 'Al Safwa' : 'Al Rawda'}</td>
                      <td>{u.ty}</td>
                      <td><span className={`d-status-tag ${u.s}`}>{t(u.s)}</span></td>
                      <td>{u.tt.toLocaleString()}</td>
                      <td style={{ color: 'var(--d-red)', fontWeight: 600 }}>{u.roi.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ CAMPAIGNS TAB ═══ */}
        {activeTab === 'campaigns' && (
          <div>
            <h3 className="d-section-head">{t('campaigns')}</h3>
            <div className="d-campaigns-grid">
              {campaigns.map((c, i) => (
                <div key={i} className="d-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4>{c.name}</h4>
                    <span className={`d-campaign-badge ${c.status}`}>{t(c.status)}</span>
                  </div>
                  <div className="d-campaign-stats">
                    <div><strong>{c.cards}</strong><span>Cards Issued</span></div>
                    <div><strong>{c.activated}</strong><span>Activated</span></div>
                    <div><strong>{c.convRate}</strong><span>Conv. Rate</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {activeTab === 'settings' && (
          <div>
            <h3 className="d-section-head">{t('settings')}</h3>
            <div className="d-grid-2">
              <div className="d-card">
                <h4>{t('dataBoundaries')}</h4>
                <ul className="d-settings-list">
                  <li>VIP tracking requires explicit invitation via physical NFC card.</li>
                  <li>Standard tracking remains anonymous and cohort-based.</li>
                  <li>Role-based access: sales reps see only assigned VIPs.</li>
                  <li>Magic links must expire and support revoke/reissue.</li>
                </ul>
              </div>
              <div className="d-card">
                <h4>{t('mvpLock')}</h4>
                <ul className="d-settings-list">
                  <li>Out of scope: dynamic pricing, automation workflows, WhatsApp, CRM replacement.</li>
                  <li>Event types: page_view and cta_click only.</li>
                  <li>CTA names fixed: book_viewing, request_pricing, request_payment_plan, download_brochure.</li>
                  <li>Success metric: booked viewings uplift.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
