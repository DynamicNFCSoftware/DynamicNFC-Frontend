// ═══════════════════════════════════════════════════════════════
// ANALYTICS PAGE — Salesforce Lightning Grade
// Charts + Heatmaps + Guidance
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from 'recharts';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './AdminAnalytics.css';

/* ────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────── */

const DEFAULT_SCORING = {
  visitPoints: 5, minutePoints: 1, unitViewPoints: 3,
  pricingRequestPoints: 15, brochureDownloadPoints: 5, roiCalculatorPoints: 10,
  paymentPlanPoints: 15, bookViewingPoints: 25, contactAdvisorPoints: 20,
  hotThreshold: 80, warmThreshold: 50, interestedThreshold: 20,
};

function calcScore(events, cfg) {
  const c = cfg || DEFAULT_SCORING;
  if (!events?.length) return { score: 0 };
  let score = 0;
  const sessions = new Set(events.map(e => e.sessionId)).size;
  score += Math.min(sessions * (c.visitPoints || 5), 25);
  const exits = events.filter(e => e.event === 'portal_exit');
  const totalSec = exits.reduce((s, e) => s + (e.details?.durationSeconds || 0), 0);
  score += Math.min(Math.floor(totalSec / 60) * (c.minutePoints || 1), 15);
  const units = new Set(events.filter(e => ['unit_view', 'unit_interaction'].includes(e.event)).map(e => (e.details?.unitId || e.data?.unitId)).filter(Boolean)).size;
  score += Math.min(units * (c.unitViewPoints || 3), 15);
  const intentMap = {
    pricing_request: c.pricingRequestPoints || 15, brochure_download: c.brochureDownloadPoints || 5,
    floorplan_download: c.brochureDownloadPoints || 5, roi_calculator: c.roiCalculatorPoints || 10,
    payment_plan: c.paymentPlanPoints || 15, book_viewing: c.bookViewingPoints || 25,
    contact_advisor: c.contactAdvisorPoints || 20, whatsapp_click: c.contactAdvisorPoints || 20,
  };
  Object.entries(intentMap).forEach(([evt, pts]) => { if (events.some(e => e.event === evt)) score += pts; });
  return { score: Math.min(score, 100) };
}

const INTENT_EVENTS = ['pricing_request', 'payment_plan', 'book_viewing', 'contact_advisor', 'brochure_download', 'floorplan_download', 'roi_calculator'];
const INTENT_WEIGHTS = {
  pricing_request: 15, payment_plan: 15, book_viewing: 25, contact_advisor: 20,
  brochure_download: 5, floorplan_download: 5, roi_calculator: 10,
};

const tooltipStyle = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '0.75rem', padding: '8px 12px',
};

const heatColor = (val) => {
  if (val === 0) return { bg: '#f1f5f9', color: '#94a3b8' };
  if (val <= 20) return { bg: '#fef9c3', color: '#a16207' };
  if (val <= 60) return { bg: '#fed7aa', color: '#c2410c' };
  return { bg: '#fecaca', color: '#dc2626' };
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);
  const { sector: sectorFilter, setSector: setSectorFilter } = useOutletContext();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cardsSnap, behavSnap, campSnap, cfgSnap] = await Promise.all([
        getDocs(collection(db, 'smartcards')),
        getDocs(query(collection(db, 'behaviors'), orderBy('timestamp', 'desc'))),
        getDocs(collection(db, 'campaigns')),
        getDoc(doc(db, 'settings', 'scoring')).catch(() => null),
      ]);
      const cfg = cfgSnap?.exists?.() ? { ...DEFAULT_SCORING, ...cfgSnap.data() } : DEFAULT_SCORING;
      setRawData({
        cards: cardsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        behaviors: behavSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        campaigns: campSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        cfg,
      });
    } catch (err) {
      console.error('Analytics fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const m = useMemo(() => {
    if (!rawData) return null;
    const { cards: allCards, behaviors: allBehaviors, campaigns, cfg } = rawData;

    // Sector filter
    const sectorCampIds = sectorFilter === 'all'
      ? null
      : new Set(campaigns.filter(c => c.sector === sectorFilter).map(c => c.id));
    const cards = sectorCampIds ? allCards.filter(c => sectorCampIds.has(c.campaignId)) : allCards;
    const cardIds = new Set(cards.map(c => c.id));
    const behaviors = sectorCampIds ? allBehaviors.filter(b => cardIds.has(b.cardId)) : allBehaviors;

    // ── S1: Lead Score Distribution ──
    const buckets = [
      { range: '0\u201320', label: 'Cold', min: 0, max: 20, color: '#94a3b8', count: 0 },
      { range: '20\u201340', label: 'Warm', min: 20, max: 40, color: '#3b82f6', count: 0 },
      { range: '40\u201360', label: 'Engaged', min: 40, max: 60, color: '#f59e0b', count: 0 },
      { range: '60\u201380', label: 'Hot', min: 60, max: 80, color: '#d97706', count: 0 },
      { range: '80+', label: 'Ready', min: 80, max: 999, color: '#dc2626', count: 0 },
    ];
    const people = cards.map(card => {
      const ev = behaviors.filter(b => b.cardId === card.id);
      const sc = calcScore(ev, cfg);
      const name = card.assignedName || card.assignedTo || `Card ${card.id}`;
      return { ...card, name, score: sc.score, events: ev };
    });
    people.forEach(p => {
      const bucket = buckets.find(b => p.score >= b.min && p.score < b.max);
      if (bucket) bucket.count++;
    });

    // ── S2: Action Performance VIP vs Std ──
    const vipEvents = behaviors.filter(b => b.visitorType === 'vip');
    const stdEvents = behaviors.filter(b => b.visitorType !== 'vip');
    const actionTypes = [
      { key: 'book_viewing', label: 'Book Viewing' },
      { key: 'pricing_request', label: 'Pricing' },
      { key: 'payment_plan', label: 'Payment Plan' },
      { key: 'brochure_download', label: 'Brochure', extra: ['floorplan_download'] },
    ];
    const actionPerf = actionTypes.map(a => {
      const keys = [a.key, ...(a.extra || [])];
      return {
        name: a.label,
        VIP: vipEvents.filter(e => keys.includes(e.event)).length,
        Standard: stdEvents.filter(e => keys.includes(e.event)).length,
      };
    });

    // ── S3: Top Plans by Interest ──
    const unitInterest = {};
    behaviors.filter(b => ['unit_view', 'unit_interaction'].includes(b.event)).forEach(b => {
      const name = b.details?.unitName || b.data?.unitName;
      if (name) unitInterest[name] = (unitInterest[name] || 0) + 1;
    });
    const topPlans = Object.entries(unitInterest)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, views]) => ({ name, views }));

    // ── S4: VIP Intent Heatmap ──
    // Rows = VIP people, Cols = unit types (derived from unitName)
    const vipPeople = people.filter(p => p.events.some(e => e.visitorType === 'vip') && p.score > 0);
    const unitTypes = new Set();
    behaviors.filter(b => INTENT_EVENTS.includes(b.event)).forEach(b => {
      const name = b.details?.unitName || b.data?.unitName;
      if (name) unitTypes.add(name);
    });
    const unitTypesArr = [...unitTypes].slice(0, 6);

    const vipHeatmap = vipPeople.slice(0, 8).map(p => {
      const row = { name: p.name };
      unitTypesArr.forEach(ut => {
        const weight = p.events
          .filter(e => INTENT_EVENTS.includes(e.event) && ((e.details?.unitName || e.data?.unitName) === ut))
          .reduce((s, e) => s + (INTENT_WEIGHTS[e.event] || 1), 0);
        row[ut] = weight;
      });
      return row;
    });

    // ── S5: Property Demand Heatmap ──
    // Rows = towers/buildings, Cols = floor ranges
    const towerDemand = {};
    behaviors.filter(b => ['unit_view', 'unit_interaction', ...INTENT_EVENTS].includes(b.event)).forEach(b => {
      const tower = b.details?.towerName || b.data?.towerName;
      const floor = b.details?.floor || b.data?.floor;
      if (!tower) return;
      if (!towerDemand[tower]) towerDemand[tower] = { low: 0, mid: 0, high: 0, total: 0 };
      const f = parseInt(floor) || 0;
      if (f >= 1 && f <= 4) towerDemand[tower].low++;
      else if (f >= 5 && f <= 8) towerDemand[tower].mid++;
      else if (f >= 9) towerDemand[tower].high++;
      towerDemand[tower].total++;
    });
    const propertyHeatmap = Object.entries(towerDemand)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 6)
      .map(([tower, d]) => ({ tower, ...d }));

    return {
      buckets, totalContacts: cards.length,
      actionPerf, topPlans,
      vipHeatmap, unitTypesArr,
      propertyHeatmap,
    };
  }, [rawData, sectorFilter]);

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;
  if (!m) return <div className="aan-empty">Failed to load analytics data</div>;

  return (
    <div style={{ maxWidth: 1080 }}>
      {/* ═══════ HEADER ═══════ */}
      <div className="aan-header">
        <div>
          <h1 className="aan-title">Analytics</h1>
          <div className="aan-subtitle">Deep engagement intelligence across all traffic</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: '0.78rem', fontFamily: 'inherit', color: '#374151', background: '#fff', cursor: 'pointer' }}
          >
            <option value="all">All Sectors</option>
            <option value="real_estate">Real Estate</option>
            <option value="automotive">Automotive</option>
          </select>
          <button onClick={fetchData} className="aan-btn">{'\u21BB'} Refresh</button>
        </div>
      </div>

      {/* ═══════ S1: LEAD SCORE DISTRIBUTION ═══════ */}
      <div className="aan-card">
        <div className="aan-card-title">Lead Score Distribution</div>
        <div className="aan-card-desc">Pipeline health across all contacts {'\u2014'} {m.totalContacts} contacts</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={m.buckets} layout="vertical" barSize={20} margin={{ left: 10, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis
              type="category" dataKey="range" width={80}
              tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false}
              tickFormatter={(v, i) => `${v} ${m.buckets[i]?.label || ''}`}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {m.buckets.map((b, i) => <Cell key={i} fill={b.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════ S2 + S3: 2-column ═══════ */}
      <div className="aan-grid-2">
        {/* S2: Action Performance */}
        <div className="aan-card">
          <div className="aan-card-title">Action Performance</div>
          <div className="aan-card-desc">VIP vs Standard comparison</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={m.actionPerf} barSize={16} margin={{ left: -10, right: 10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '0.65rem' }} />
              <Bar dataKey="VIP" fill="#e63946" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Standard" fill="#457b9d" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* S3: Top Plans */}
        <div className="aan-card">
          <div className="aan-card-title">Top Plans by Interest</div>
          <div className="aan-card-desc">All traffic {'\u2014'} unit views</div>
          {m.topPlans.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(m.topPlans.length * 32, 100)}>
              <BarChart data={m.topPlans} layout="vertical" barSize={14} margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="views" fill="#e63946" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="aan-empty">No unit view data yet</div>
          )}
        </div>
      </div>

      {/* ═══════ S4 + S5: Heatmaps ═══════ */}
      <div className="aan-grid-2">
        {/* S4: VIP Intent Heatmap */}
        <div className="aan-card">
          <div className="aan-card-title">VIP Intent Heatmap</div>
          <div className="aan-card-desc">Weighted intent signals per VIP {'\u00D7'} unit</div>
          {m.vipHeatmap.length > 0 && m.unitTypesArr.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="aan-heatmap">
                <thead>
                  <tr>
                    <th>VIP</th>
                    {m.unitTypesArr.map(ut => <th key={ut}>{ut}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {m.vipHeatmap.map((row, i) => (
                    <tr key={i}>
                      <td>{row.name}</td>
                      {m.unitTypesArr.map(ut => {
                        const val = row[ut] || 0;
                        const h = heatColor(val);
                        return (
                          <td key={ut}>
                            <span className="aan-heat-cell" style={{ background: h.bg, color: h.color }}>
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="aan-empty">No VIP intent data yet</div>
          )}
        </div>

        {/* S5: Property Demand Heatmap */}
        <div className="aan-card">
          <div className="aan-card-title">Property Demand Heatmap</div>
          <div className="aan-card-desc">Tower demand by floor range</div>
          {m.propertyHeatmap.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="aan-heatmap">
                <thead>
                  <tr>
                    <th>Tower</th>
                    <th>Low (1-4)</th>
                    <th>Mid (5-8)</th>
                    <th>High (9+)</th>
                  </tr>
                </thead>
                <tbody>
                  {m.propertyHeatmap.map((row, i) => (
                    <tr key={i}>
                      <td>{row.tower}</td>
                      {['low', 'mid', 'high'].map(key => {
                        const val = row[key];
                        const h = heatColor(val);
                        return (
                          <td key={key}>
                            <span className="aan-heat-cell" style={{ background: h.bg, color: h.color }}>
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="aan-empty">No tower/floor data yet</div>
          )}
        </div>
      </div>

      {/* ═══════ S6: GUIDANCE ═══════ */}
      <div className="aan-section">Guidance</div>
      <div className="aan-guidance">
        <div className="aan-guide-item" style={{ borderLeftColor: '#3b82f6' }}>
          <span className="aan-guide-icon">{'\u{1F535}'}</span>
          <div>
            <div className="aan-guide-title">Low clicks {'\u2260'} low demand</div>
            <div className="aan-guide-text">
              Improve media, naming, and clarity before changing price.
              A unit with zero views may just need better presentation.
            </div>
          </div>
        </div>
        <div className="aan-guide-item" style={{ borderLeftColor: '#f59e0b' }}>
          <span className="aan-guide-icon">{'\u{1F7E0}'}</span>
          <div>
            <div className="aan-guide-title">Pricing signals = follow-up signals</div>
            <div className="aan-guide-text">
              For VIP: call with payment plan. For Standard: add pricing CTA to portal.
              Every pricing request is a buying signal.
            </div>
          </div>
        </div>
        <div className="aan-guide-item" style={{ borderLeftColor: '#dc2626' }}>
          <span className="aan-guide-icon">{'\u{1F534}'}</span>
          <div>
            <div className="aan-guide-title">MVP guardrail</div>
            <div className="aan-guide-text">
              This dashboard exists to increase booked viewings, not analytics for analytics.
              Every insight should lead to an action.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
