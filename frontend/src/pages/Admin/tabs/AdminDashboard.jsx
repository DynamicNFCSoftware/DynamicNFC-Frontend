// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD v3 — Salesforce Lightning Grade
// Full CRM Demo Level — Real Firestore Data
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  collection, getDocs, query, where, orderBy, limit, Timestamp, doc, getDoc,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import './AdminDashboard.css';
import { useTranslation } from '../../../i18n';
import '../../../i18n/pages/admin';

/* ────────────────────────────────────────────
   MICRO COMPONENTS
   ──────────────────────────────────────────── */

const AnimCounter = ({ value, suffix = '' }) => {
  const [d, setD] = useState(0);
  useEffect(() => {
    if (!value) { setD(0); return; }
    let s = 0;
    const step = Math.max(value / 50, 1);
    const t = setInterval(() => {
      s += step;
      if (s >= value) { setD(value); clearInterval(t); }
      else setD(Math.round(s));
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <>{d}{suffix}</>;
};

const Spark = ({ data = [], color = '#e63946', w = 64, h = 24 }) => {
  if (data.length < 2) return <div style={{ width: w, height: h }} />;
  const mx = Math.max(...data, 1), mn = Math.min(...data, 0), r = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / r) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - mn) / r) * (h - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
};

const TrendBadge = ({ current, previous, t }) => {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return <span className="ad-trend up">{t('trendNew')}</span>;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return <span className="ad-trend flat">{'\u2192'} 0%</span>;
  return <span className={`ad-trend ${pct > 0 ? 'up' : 'down'}`}>{pct > 0 ? '\u2191' : '\u2193'} {Math.abs(pct)}%</span>;
};

/* ────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────── */

const timeAgo = (ts, t) => {
  if (!ts) return t('lastTapNever');
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return t('justNow');
  if (s < 3600) return `${Math.floor(s / 60)}${t('minuteShort')}`;
  if (s < 86400) return `${Math.floor(s / 3600)}${t('hourShort')}`;
  return `${Math.floor(s / 86400)}${t('dayShort')}`;
};

const fmtDur = (sec) => {
  if (!sec || sec <= 0) return '\u2014';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const dayKey = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : (date?.toDate ? date.toDate() : new Date(date));
  try { return d.toISOString().slice(0, 10); } catch { return ''; }
};

const eventIcons = {
  portal_open: '\u{1F511}', portal_entry: '\u{1F511}',
  unit_view: '\u{1F441}\uFE0F', unit_interaction: '\u{1F441}\uFE0F',
  pricing_request: '\u{1F4B0}', book_viewing: '\u{1F4C5}',
  brochure_download: '\u{1F4C4}', floorplan_download: '\u{1F4C4}',
  payment_plan: '\u{1F4B3}', contact_advisor: '\u{1F4DE}',
  tower_view: '\u{1F3E2}', portal_exit: '\u{1F44B}',
  roi_calculator: '\u{1F4CA}', section_view: '\u{1F4CB}',
};

/* ────────────────────────────────────────────
   SCORING ENGINE
   ──────────────────────────────────────────── */

const DEFAULT_SCORING = {
  visitPoints: 5, minutePoints: 1, unitViewPoints: 3,
  pricingRequestPoints: 15, brochureDownloadPoints: 5,
  roiCalculatorPoints: 10, paymentPlanPoints: 15,
  bookViewingPoints: 25, contactAdvisorPoints: 20,
  hotThreshold: 80, warmThreshold: 50, interestedThreshold: 20,
};

function calcScore(events, cfg) {
  const c = cfg || DEFAULT_SCORING;
  if (!events?.length) return { score: 0, label: 'NEW', color: '#94a3b8', stage: 'new' };
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
  score = Math.min(score, 100);
  const hot = c.hotThreshold || 80, warm = c.warmThreshold || 50, interested = c.interestedThreshold || 20;
  if (score >= hot) return { score, label: 'HOT', color: '#dc2626', stage: 'hot' };
  if (score >= warm) return { score, label: 'WARM', color: '#f59e0b', stage: 'warm' };
  if (score >= interested) return { score, label: 'INTERESTED', color: '#3b82f6', stage: 'interested' };
  return { score, label: 'NEW', color: '#94a3b8', stage: 'new' };
}

function getTrigger(events, t) {
  const h48 = Date.now() - 48 * 3600000;
  const recent = events.filter(e => (e.timestamp?.toDate?.()?.getTime?.() || 0) > h48);
  if (!recent.length) return null;
  if (recent.some(e => e.event === 'book_viewing')) return { icon: '\u2705', text: t('triggerViewingBooked'), color: '#059669' };
  if (recent.some(e => ['pricing_request', 'payment_plan'].includes(e.event))) return { icon: '\u{1F525}', text: t('triggerPricingRequested'), color: '#dc2626' };
  if (recent.some(e => ['brochure_download', 'floorplan_download'].includes(e.event))) return { icon: '\u{1F4CB}', text: t('triggerDownloaded'), color: '#f59e0b' };
  if (recent.length >= 3) return { icon: '\u26A1', text: `${recent.length} ${t('triggerActions48h')}`, color: '#3b82f6' };
  return null;
}

function eventLabel(e, t) {
  const labels = {
    portal_open: t('evtOpenedPortal'), portal_entry: t('evtOpenedPortal'), portal_exit: t('evtLeftPortal'),
    unit_view: t('evtViewedUnit'), unit_interaction: t('evtViewedUnit'), tower_view: t('evtViewedTower'),
    section_view: t('evtBrowsedSection'), pricing_request: t('requestPricing'),
    book_viewing: t('bookViewing'), brochure_download: t('actionBrochure'),
    floorplan_download: t('evtDownloadedFloorPlan'), payment_plan: t('alertPaymentPlan'),
    roi_calculator: t('roiShort'), contact_advisor: t('alertAdvisorContact'),
    unit_favorite: t('favorite'), unit_compare: t('alertComparingPlans'),
    filter_use: t('filter'), tab_click: t('tab'), cta_click: t('evtClickedAction'),
  };
  let l = labels[e.event] || e.event;
  const d = e.details || e.data || {};
  if (d.unitName) l += ` \u2014 ${d.unitName}`;
  else if (d.unitId) l += ` \u2014 ${d.unitId}`;
  else if (d.towerName) l += ` \u2014 ${d.towerName}`;
  if (e.event === 'portal_exit' && d.durationSeconds) l += ` (${fmtDur(d.durationSeconds)})`;
  return l;
}

function getQueueDue(person) {
  if (person.trigger?.text?.toLowerCase?.().includes('booked')) return 'today';
  if (person.trigger?.text?.toLowerCase?.().includes('pricing')) return 'today';
  if (person.idle >= 6 && person.score >= 30) return 'today';
  if (person.score >= 70) return 'today';
  if (person.idle >= 3 || person.score >= 50) return 'tomorrow';
  return 'week';
}

function getQueueRisk(person) {
  if (person.idle >= 7 && person.score >= 30) return 'high';
  if (person.idle >= 4 || person.score >= 50) return 'medium';
  return 'low';
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */

export default function AdminDashboard() {
  const t = useTranslation('admin');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [feedFilter, setFeedFilter] = useState('all');
  const [seeding, setSeeding] = useState(false);
  const { sector: sectorFilter, setSector: setSectorFilter } = useOutletContext();

  const fetchData = async () => {
    setLoading(true);
    try {
      const thirtyDaysAgo = Timestamp.fromDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      const [cardsSnap, behavSnap, tapsSnap, campSnap, cfgSnap] = await Promise.all([
        getDocs(query(collection(db, 'smartcards'), limit(200))),
        getDocs(query(
          collection(db, 'behaviors'),
          where('timestamp', '>=', thirtyDaysAgo),
          orderBy('timestamp', 'desc'),
          limit(500)
        )),
        getDocs(query(collection(db, 'taps'), orderBy('timestamp', 'desc'), limit(50))).catch(() => ({ docs: [] })),
        getDocs(collection(db, 'campaigns')),
        getDoc(doc(db, 'settings', 'scoring')).catch(() => null),
      ]);
      const cfg = cfgSnap?.exists?.() ? { ...DEFAULT_SCORING, ...cfgSnap.data() } : DEFAULT_SCORING;
      setData({
        cards: cardsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        behaviors: behavSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        taps: tapsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        campaigns: campSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        cfg,
      });
    } catch (err) {
      console.error('Dashboard fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const behavRef = query(collection(db, 'behaviors'), orderBy('timestamp', 'desc'), limit(500));
    const tapsRef = query(collection(db, 'taps'), orderBy('timestamp', 'desc'), limit(50));
    const unsubBehaviors = onSnapshot(behavRef, (snap) => {
      const behaviors = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(prev => prev ? { ...prev, behaviors } : prev);
    });
    const unsubTaps = onSnapshot(tapsRef, (snap) => {
      const taps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(prev => prev ? { ...prev, taps } : prev);
    });
    return () => {
      unsubBehaviors();
      unsubTaps();
    };
  }, []);

  const seedDemoRun = async () => {
    if (seeding) return;
    if (!window.confirm(t('seedConfirm'))) return;
    setSeeding(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error(t('notAuthenticated'));
      const resp = await fetch('/api/demo/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(result.error || t('seedFail'));
      await fetchData();
      alert(t('seedDone'));
    } catch (err) {
      console.error('Seed demo failed:', err);
      alert(t('seedFail'));
    } finally {
      setSeeding(false);
    }
  };

  const resetSeedRun = async () => {
    if (seeding) return;
    if (!window.confirm(t('resetConfirm'))) return;
    setSeeding(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error(t('notAuthenticated'));
      const resp = await fetch('/api/demo/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(result.error || t('resetFail'));
      await fetchData();
      alert(t('resetDone'));
    } catch (err) {
      console.error('Reset demo failed:', err);
      alert(t('resetFail'));
    } finally {
      setSeeding(false);
    }
  };

  /* ── COMPUTED ── */
  const m = useMemo(() => {
    if (!data) return null;
    const { cards: allCards, behaviors: allBehaviors, taps, campaigns, cfg } = data;
    const now = new Date();

    // Sector filter: find campaign IDs matching sector
    const sectorCampIds = sectorFilter === 'all'
      ? null
      : new Set(campaigns.filter(c => c.sector === sectorFilter).map(c => c.id));

    // Filter cards and behaviors by sector
    const cards = sectorCampIds ? allCards.filter(c => sectorCampIds.has(c.campaignId)) : allCards;
    const cardIds = new Set(cards.map(c => c.id));
    const behaviors = sectorCampIds ? allBehaviors.filter(b => cardIds.has(b.cardId)) : allBehaviors;

    // 4-layer split
    const vipEvents = behaviors.filter(b => b.visitorType === 'vip');
    const regEvents = behaviors.filter(b => b.visitorType === 'registered' || b.visitorType === 'family');
    const anonEvents = behaviors.filter(b => b.visitorType === 'anonymous' || !b.visitorType);

    const vipSessions = new Set(vipEvents.map(e => e.sessionId).filter(Boolean)).size;
    const regSessions = new Set(regEvents.map(e => e.sessionId).filter(Boolean)).size;
    const anonSessions = new Set(anonEvents.map(e => e.sessionId).filter(Boolean)).size;

    // People profiles
    const people = cards.map(card => {
      const ev = behaviors.filter(b => b.cardId === card.id);
      const sc = calcScore(ev, cfg);
      const sessions = new Set(ev.map(e => e.sessionId).filter(Boolean)).size;
      const exits = ev.filter(e => e.event === 'portal_exit');
      const totalSec = exits.reduce((s, e) => s + (e.details?.durationSeconds || 0), 0);
      const units = new Set(ev.filter(e => ['unit_view', 'unit_interaction'].includes(e.event)).map(e => (e.details?.unitId || e.data?.unitId)).filter(Boolean)).size;
      const acts = [];
      if (ev.some(e => e.event === 'pricing_request')) acts.push(t('alertPricingInterest'));
      if (ev.some(e => e.event === 'book_viewing')) acts.push(t('alertViewingBooked'));
      if (ev.some(e => e.event === 'brochure_download')) acts.push(t('actionBrochure'));
      if (ev.some(e => e.event === 'payment_plan')) acts.push(t('alertPaymentPlan'));
      if (ev.some(e => e.event === 'contact_advisor')) acts.push(t('alertAdvisorContact'));
      const lastEv = ev[0];
      const trigger = getTrigger(ev, t);
      const lastActivity = lastEv?.timestamp?.toDate?.() || null;
      const idle = lastActivity ? Math.floor((Date.now() - lastActivity.getTime()) / 86400000) : 999;
      const atRisk = idle > 5 && sc.score >= 30;

      // Time to First Action
      const openEv = [...ev].reverse().find(e => ['portal_open', 'portal_entry'].includes(e.event));
      const firstIntent = [...ev].reverse().find(e => ['pricing_request', 'book_viewing', 'brochure_download', 'payment_plan', 'contact_advisor'].includes(e.event));
      let ttfa = null;
      if (openEv && firstIntent) {
        const t1 = openEv.timestamp?.toDate?.()?.getTime?.() || 0;
        const t2 = firstIntent.timestamp?.toDate?.()?.getTime?.() || 0;
        if (t2 > t1) ttfa = Math.round((t2 - t1) / 60000);
      }

      // Viewing velocity: days from card creation / first tap to first booking
      let viewVel = null;
      const bookEv = [...ev].reverse().find(e => e.event === 'book_viewing');
      if (bookEv && openEv) {
        const t1 = openEv.timestamp?.toDate?.()?.getTime?.() || 0;
        const t2 = bookEv.timestamp?.toDate?.()?.getTime?.() || 0;
        if (t2 > t1) viewVel = Math.round((t2 - t1) / 86400000 * 10) / 10;
      }

      const name = card.assignedName || card.assignedTo || ev.find(e => e.visitorName)?.visitorName || `Card ${card.id}`;
      return {
        ...card, name, ...sc, sessions, totalSec, units, actions: acts, trigger,
        lastActivity, idle, atRisk, ttfa, viewVel, eventCount: ev.length,
        summary: acts.length > 0 ? acts.slice(0, 2).join(', ') : (ev.length > 2 ? t('browsingActively') : ev.length > 0 ? t('evtOpenedPortal') : t('noActivity')),
      };
    }).sort((a, b) => b.score - a.score);

    // Pipeline
    const pipeline = { hot: 0, warm: 0, interested: 0, new: 0 };
    people.forEach(p => { pipeline[p.stage]++; });

    // Velocity KPIs
    const ttfaValues = people.filter(p => p.ttfa !== null).map(p => p.ttfa);
    const avgTTFA = ttfaValues.length > 0 ? Math.round(ttfaValues.reduce((a, b) => a + b, 0) / ttfaValues.length) : null;
    const velValues = people.filter(p => p.viewVel !== null).map(p => p.viewVel);
    const avgViewVel = velValues.length > 0 ? (velValues.reduce((a, b) => a + b, 0) / velValues.length).toFixed(1) : null;

    // VIP vs Std booking rate
    const vipCards = cards.filter(c => c.cardType === 'vip' || c.visitorType === 'vip');
    const stdCards = cards.filter(c => c.cardType !== 'vip' && c.visitorType !== 'vip');
    const vipWithBooking = vipCards.filter(c => behaviors.some(b => b.cardId === c.id && b.event === 'book_viewing')).length;
    const stdWithBooking = stdCards.filter(c => behaviors.some(b => b.cardId === c.id && b.event === 'book_viewing')).length;
    const vipBookRate = vipCards.length > 0 ? vipWithBooking / vipCards.length : 0;
    const stdBookRate = stdCards.length > 0 ? stdWithBooking / stdCards.length : 0;
    const convLift = stdBookRate > 0 ? (vipBookRate / stdBookRate).toFixed(1) + 'x' : (vipBookRate > 0 ? '\u221Ex' : '\u2014');
    const leadCaptureRate = anonSessions > 0 ? Math.round(regSessions / anonSessions * 100) : 0;

    // Total conversions & bookings
    const totalConversions = behaviors.filter(b => ['book_viewing', 'pricing_request', 'payment_plan', 'brochure_download', 'contact_advisor'].includes(b.event)).length;
    const totalBookings = behaviors.filter(b => b.event === 'book_viewing').length;

    // Conversion by type with VIP/Std split
    const convByType = {};
    ['book_viewing', 'pricing_request', 'payment_plan'].forEach(evt => {
      convByType[evt] = {
        total: behaviors.filter(b => b.event === evt).length,
        vip: vipEvents.filter(b => b.event === evt).length,
        std: regEvents.concat(anonEvents).filter(b => b.event === evt).length,
      };
    });
    convByType.brochure_download = {
      total: behaviors.filter(b => ['brochure_download', 'floorplan_download'].includes(b.event)).length,
      vip: vipEvents.filter(b => ['brochure_download', 'floorplan_download'].includes(b.event)).length,
      std: regEvents.concat(anonEvents).filter(b => ['brochure_download', 'floorplan_download'].includes(b.event)).length,
    };

    // 7-day trend (multi-line)
    const trend = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      return {
        date: label,
        vip: vipEvents.filter(b => dayKey(b.timestamp) === key).length,
        registered: regEvents.filter(b => dayKey(b.timestamp) === key).length,
        anonymous: anonEvents.filter(b => dayKey(b.timestamp) === key).length,
      };
    });

    // Sparklines
    const spark = (evts) => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const arr = Array.isArray(evts) ? evts : [evts];
      return behaviors.filter(b => arr.includes(b.event) && dayKey(b.timestamp) === key).length;
    });

    // Channel mix
    const channelMix = [
      { name: t('vipNfc'), value: vipSessions, color: '#e63946' },
      { name: t('registeredLabel'), value: regSessions, color: '#457b9d' },
      { name: t('anonymousLabel'), value: anonSessions, color: '#94a3b8' },
    ].filter(d => d.value > 0);

    // Funnel
    const portalOpenedCount = new Set(behaviors.filter(b => ['portal_open', 'portal_entry'].includes(b.event)).map(b => b.cardId)).size;
    const unitViewedCount = new Set(behaviors.filter(b => ['unit_view', 'unit_interaction'].includes(b.event)).map(b => b.cardId)).size;
    const pricingCount = new Set(behaviors.filter(b => ['pricing_request', 'brochure_download', 'floorplan_download', 'roi_calculator', 'payment_plan'].includes(b.event)).map(b => b.cardId)).size;
    const bookingCount = new Set(behaviors.filter(b => ['book_viewing', 'contact_advisor'].includes(b.event)).map(b => b.cardId)).size;
    const funnel = [
      { label: t('totalVisitors'), value: cards.length + taps.length, color: '#64748b' },
      { label: t('portalOpened'), value: portalOpenedCount, color: '#3b82f6' },
      { label: t('viewedUnit'), value: unitViewedCount, color: '#8b5cf6' },
      { label: t('requestedPricing'), value: pricingCount, color: '#f59e0b' },
      { label: t('bookedViewing'), value: bookingCount, color: '#059669' },
    ];

    // Interest distribution
    const unitInterest = {};
    behaviors.filter(b => ['unit_view', 'unit_interaction'].includes(b.event)).forEach(b => {
      const name = b.details?.unitName || b.data?.unitName;
      if (name) unitInterest[name] = (unitInterest[name] || 0) + 1;
    });
    const topUnits = Object.entries(unitInterest).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, views: count }));

    // Recent events
    const recentEvents = behaviors.slice(0, 20);

    // VIP summary
    const hotPeople = people.filter(p => p.stage === 'hot');
    const avgScore = people.length > 0 ? Math.round(people.reduce((s, p) => s + p.score, 0) / people.length) : 0;
    const activeAlerts = people.filter(p => p.actions.length > 0 && !p.actions.includes('Viewing booked') && p.score >= 30).length;

    // Week comparison
    const thisWeekStart = new Date(now); thisWeekStart.setDate(now.getDate() - 7);
    const lastWeekStart = new Date(now); lastWeekStart.setDate(now.getDate() - 14);
    const twEvents = behaviors.filter(b => { const t = b.timestamp?.toDate?.()?.getTime?.(); return t && t > thisWeekStart.getTime(); }).length;
    const lwEvents = behaviors.filter(b => { const t = b.timestamp?.toDate?.()?.getTime?.(); return t && t > lastWeekStart.getTime() && t <= thisWeekStart.getTime(); }).length;

    // Campaigns
    const campaignMetrics = campaigns.map(camp => {
      const cPeople = people.filter(p => p.campaignId === camp.id);
      const cEvents = behaviors.filter(b => { const card = cards.find(c => c.id === b.cardId); return card?.campaignId === camp.id; });
      const hot = cPeople.filter(p => p.stage === 'hot').length;
      const warm = cPeople.filter(p => p.stage === 'warm').length;
      const convRate = cPeople.length > 0 ? Math.round((cPeople.filter(p => p.actions.length > 0).length / cPeople.length) * 100) : 0;
      const vipCount = cPeople.filter(p => p.cardType === 'vip' || p.visitorType === 'vip').length;
      return { ...camp, people: cPeople.length, hot, warm, convRate, events: cEvents.length, vipCount };
    });

    return {
      people, pipeline, vipSessions, regSessions, anonSessions,
      totalConversions, totalBookings, convByType,
      avgTTFA, avgViewVel, convLift, leadCaptureRate,
      trend, spark, channelMix, funnel, topUnits,
      recentEvents, hotPeople, avgScore, activeAlerts,
      twEvents, lwEvents, campaignMetrics, totalEvents: behaviors.length,
    };
  }, [data, sectorFilter, t]);

  /* ── RENDER ── */
  if (loading) return <div className="ad-loading-state"><div className="ad-spinner" /><span>{t('loadingIntelligence')}</span></div>;
  if (!m) return <div className="ad-loading-state">{t('failedLoadData')}</div>;

  const hotCount = m.pipeline.hot;
  const needsAttention = hotCount + m.people.filter(p => p.atRisk).length;

  // Filtered feed
  const filteredEvents = m.recentEvents.filter(e => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'vip') return e.visitorType === 'vip';
    if (feedFilter === 'registered') return e.visitorType === 'registered' || e.visitorType === 'family';
    return true;
  });

  const callQueue = m.people
    .filter((p) => p.score > 0)
    .map((p) => ({ ...p, due: getQueueDue(p), risk: getQueueRisk(p), owner: p.salesRep || 'Unassigned' }))
    .sort((a, b) => {
      const dueRank = { today: 3, tomorrow: 2, week: 1 };
      const riskRank = { high: 3, medium: 2, low: 1 };
      if (dueRank[b.due] !== dueRank[a.due]) return dueRank[b.due] - dueRank[a.due];
      if (riskRank[b.risk] !== riskRank[a.risk]) return riskRank[b.risk] - riskRank[a.risk];
      return b.score - a.score;
    })
    .slice(0, 5);

  return (
    <div className="ad-dash">

      {/* ═══════ HEADER ═══════ */}
      <div className="ad-header-row">
        <div>
          <h1 className="ad-h1">{t('salesIntelligence')}</h1>
          <p className="ad-subtitle" style={{ color: needsAttention > 0 ? '#dc2626' : '#059669' }}>
            {needsAttention > 0
              ? `${needsAttention} ${needsAttention === 1 ? t('contactNeedsAttention') : t('contactsNeedAttention')}`
              : m.people.length > 0 ? `${m.people.length} ${t('contactsTrackedHealthy')}` : t('readySendVip')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: '0.8rem', fontFamily: 'inherit', color: '#374151', background: '#fff', cursor: 'pointer' }}
          >
            <option value="all">{t('allSectors')}</option>
            <option value="real_estate">{t('navRealEstate')}</option>
            <option value="automotive">{t('navAutomotive')}</option>
          </select>
          <button onClick={fetchData} className="ad-btn-refresh">{'\u21BB'} {t('refresh')}</button>
          <button onClick={seedDemoRun} className="ad-btn-refresh" disabled={seeding}>
            {seeding ? '...' : `+ ${t('seedDemo')}`}
          </button>
          <button onClick={resetSeedRun} className="ad-btn-refresh" disabled={seeding}>
            {seeding ? '...' : t('resetSeed')}
          </button>
        </div>
      </div>

      <div className="ad-demo-guide">
        <div className="ad-demo-guide-title">{t('guidedDemoFlow')}</div>
        <div className="ad-demo-guide-steps">
          <span><b>1.</b> {t('guideStep1')}</span>
          <span><b>2.</b> {t('guideStep2')}</span>
          <span><b>3.</b> {t('guideStep3')}</span>
          <span><b>4.</b> {t('guideStep4')}</span>
        </div>
      </div>

      <div className="ad-call-queue">
        <div className="ad-card-hdr-row">
          <div className="ad-chart-hdr">{t('callQueueTitle')}</div>
          <span className="ad-card-sub-count">{t('callQueueSub')}</span>
        </div>
        <div className="ad-call-list">
          {callQueue.length === 0 ? (
            <div className="ad-empty-sm">{t('noActionableContacts')}</div>
          ) : callQueue.map((p) => (
            <Link to={`/admin/cards/${p.id}`} key={p.id} className="ad-call-row">
              <div className="ad-call-main">
                <div className="ad-call-name">{p.name}</div>
                <div className="ad-call-meta">{p.owner} · {p.topUnit || t('noUnitFocus')}</div>
              </div>
              <div className="ad-call-tags">
                <span className={`ad-chip-pill due ${p.due}`}>{p.due === 'today' ? t('dueToday') : p.due === 'tomorrow' ? t('dueTomorrow') : t('dueWeek')}</span>
                <span className={`ad-chip-pill risk ${p.risk}`}>{p.risk === 'high' ? t('riskHigh') : p.risk === 'medium' ? t('riskMedium') : t('riskLow')}</span>
                <span className="ad-chip-pill score">{t('scoreShort')} {p.score}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══════ S1: EXECUTIVE VIEW ═══════ */}
      <div className="ad-exec">
        <h3>{t('executiveView')}</h3>
        <p>{t('executiveDesc')}</p>
        <div className="ad-exec-chips">
          <span className="ad-chip">{t('chipPrimaryKpi')}</span>
          <span className="ad-chip">{t('chipConfigScoring')}</span>
          <span className="ad-chip">{t('chipSharedActions')}</span>
        </div>
      </div>

      {/* ═══════ S2: VELOCITY KPIs ═══════ */}
      <div className="ad-section-label">{t('velocityLabel')}</div>
      <div className="ad-vel-row">
        <div className="ad-vel-card">
          <div className="ad-vel-label">{t('timeToFirstAction')}</div>
          <div className="ad-vel-num">{m.avgTTFA !== null ? m.avgTTFA : '\u2014'}<span className="ad-vel-unit">{m.avgTTFA !== null ? ` ${t('minuteShort')}` : ''}</span></div>
          <div className="ad-vel-sub">{t('avgMinsFromTap')}</div>
        </div>
        <div className="ad-vel-card">
          <div className="ad-vel-label">{t('viewingVelocity')}</div>
          <div className="ad-vel-num">{m.avgViewVel !== null ? m.avgViewVel : '\u2014'}<span className="ad-vel-unit">{m.avgViewVel !== null ? ` ${t('daysLabel')}` : ''}</span></div>
          <div className="ad-vel-sub">{t('avgDaysToBooking')}</div>
        </div>
        <div className="ad-vel-card">
          <div className="ad-vel-label">{t('vipConvLift')}</div>
          <div className="ad-vel-num">{m.convLift}</div>
          <div className="ad-vel-sub">{t('vipVsStdBooking')}</div>
        </div>
        <div className="ad-vel-card">
          <div className="ad-vel-label">{t('leadCapture')}</div>
          <div className="ad-vel-num">{m.leadCaptureRate}<span className="ad-vel-unit">%</span></div>
          <div className="ad-vel-sub">{t('anonToRegistered')}</div>
        </div>
      </div>

      {/* ═══════ S3: SESSION COUNTS ═══════ */}
      <div className="ad-section-label">{t('sessionsUpper')}</div>
      <div className="ad-session-row">
        <div className="ad-session-card">
          <div className="ad-session-num" style={{ color: '#e63946' }}><AnimCounter value={m.vipSessions} /></div>
          <div className="ad-session-label">{t('vipSessionsLabel')}</div>
          <div className="ad-session-sub">{t('personKnownNfc')}</div>
        </div>
        <div className="ad-session-card">
          <div className="ad-session-num" style={{ color: '#457b9d' }}><AnimCounter value={m.regSessions} /></div>
          <div className="ad-session-label">{t('registeredLabel')}</div>
          <div className="ad-session-sub">{t('marketSignups')}</div>
        </div>
        <div className="ad-session-card">
          <div className="ad-session-num" style={{ color: '#94a3b8' }}><AnimCounter value={m.anonSessions} /></div>
          <div className="ad-session-label">{t('anonymousLabel')}</div>
          <div className="ad-session-sub">{t('standardWebTraffic')}</div>
        </div>
        <div className="ad-session-card">
          <div className="ad-session-num" style={{ color: '#f59e0b' }}><AnimCounter value={m.totalConversions} /></div>
          <div className="ad-session-label">{t('conversionsLabel')}</div>
          <div className="ad-session-sub">{t('allSharedActions')}</div>
        </div>
        <div className="ad-session-card">
          <div className="ad-session-num" style={{ color: '#059669' }}><AnimCounter value={m.totalBookings} /></div>
          <div className="ad-session-label">{t('bookingsLabel')}</div>
          <div className="ad-session-sub">{t('viewingsBooked')}</div>
        </div>
      </div>

      {/* ═══════ S4: CONVERSION ACTIONS ═══════ */}
      <div className="ad-section-header">
        <h2>{t('sharedConversionActions')}</h2>
        <span className="ad-section-badge">{t('vipStdNonLinear')}</span>
      </div>
      <div className="ad-conv-row">
        {[
          { k: 'book_viewing', l: t('bookViewing'), c: '#dc2626', evts: 'book_viewing' },
          { k: 'pricing_request', l: t('requestPricing'), c: '#f59e0b', evts: 'pricing_request' },
          { k: 'payment_plan', l: t('paymentPlan'), c: '#059669', evts: 'payment_plan' },
          { k: 'brochure_download', l: t('downloadMaterials'), c: '#3b82f6', evts: ['brochure_download', 'floorplan_download'] },
        ].map(a => {
          const conv = m.convByType[a.k];
          return (
            <div key={a.k} className="ad-conv" style={{ borderBottomColor: a.c }}>
              <div className="ad-conv-top">
                <span className="ad-conv-num" style={{ color: a.c }}><AnimCounter value={conv.total} /></span>
                <Spark data={m.spark(a.evts)} color={a.c} />
              </div>
              <div className="ad-conv-lbl">{a.l}</div>
              <div className="ad-conv-split">
                <span><span className="ad-dot red" />{t('vipShort')}: <b>{conv.vip}</b></span>
                <span><span className="ad-dot blue" />{t('standardShort')}: <b>{conv.std}</b></span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="ad-legend-note">
        {t('redVipBlueStd')}
      </p>

      {/* ═══════ S5: CHARTS ROW ═══════ */}
      <div className="ad-section-label">{t('analyticsUpper')}</div>
      <div className="ad-analytics-row">
        {/* Engagement Over Time - Multi-line */}
        <div className="ad-chart-card" style={{ flex: 5 }}>
          <div className="ad-chart-hdr">{t('engagementOverTime7d')}</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={m.trend}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontSize: 11, padding: '6px 10px' }} />
              <Legend wrapperStyle={{ fontSize: '0.65rem' }} />
              <Line type="monotone" dataKey="anonymous" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} name={t('anonymousLabel')} />
              <Line type="monotone" dataKey="registered" stroke="#457b9d" strokeWidth={2} dot={{ r: 3 }} name={t('registeredLabel')} />
              <Line type="monotone" dataKey="vip" stroke="#e63946" strokeWidth={2} dot={{ r: 3 }} name={t('vipShort')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Mix */}
        <div className="ad-chart-card" style={{ flex: 3 }}>
          <div className="ad-chart-hdr">{t('channelMix')}</div>
          {m.channelMix.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={m.channelMix} cx="50%" cy="50%" innerRadius={36} outerRadius={56} paddingAngle={3} dataKey="value">
                    {m.channelMix.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="ad-pie-legend">
                {m.channelMix.map(s => <span key={s.name}><i style={{ background: s.color }} />{s.name} ({s.value})</span>)}
              </div>
            </>
          ) : <div className="ad-empty-sm">{t('noActivityYet')}</div>}
        </div>
      </div>

      {/* ═══════ S6: FEED + VIP SUMMARY ═══════ */}
      <div className="ad-section-label">{t('activityVipSummaryUpper')}</div>
      <div className="ad-bottom-row">
        {/* Activity Feed */}
        <div className="ad-card-block" style={{ flex: 5 }}>
          <div className="ad-card-hdr-row">
            <div className="ad-chart-hdr">{t('activityFeed')}</div>
            <div className="ad-feed-filters">
              {['all', 'vip', 'registered'].map(f => (
                <button key={f} className={`ad-feed-filter ${feedFilter === f ? 'active' : ''}`} onClick={() => setFeedFilter(f)}>
                  {f === 'all' ? t('allFilter') : f === 'vip' ? t('vipShort') : t('registeredLabel')}
                </button>
              ))}
            </div>
          </div>
          <div className="ad-feed-list">
            {filteredEvents.length === 0 ? (
              <div className="ad-empty-sm">{t('noFilterActivityYet', { filter: feedFilter !== 'all' ? feedFilter : '' })}</div>
            ) : filteredEvents.map((e, i) => {
              const icon = eventIcons[e.event] || eventIcons.default || '\u{1F4CB}';
              const catColors = { browse: '#94a3b8', engage: '#3b82f6', intent: '#f59e0b', action: '#dc2626' };
              return (
                <div key={i} className="ad-feed-row">
                  <div className="ad-feed-icon-box" style={{ background: (catColors[e.category] || '#94a3b8') + '14' }}>
                    {icon}
                  </div>
                  <div className="ad-feed-content">
                    <div className="ad-feed-who">
                      {e.visitorName || `Card ${e.cardId || '?'}`}
                      {e.visitorType === 'vip' && <span className="ad-feed-vip-tag">{t('vipShort')}</span>}
                      {(e.visitorType === 'registered' || e.visitorType === 'family') && <span className="ad-feed-reg-tag">{t('registeredLabel')}</span>}
                    </div>
                    <div className="ad-feed-what">{eventLabel(e, t)}</div>
                  </div>
                  <div className="ad-feed-when">{timeAgo(e.timestamp, t)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VIP Summary */}
        <div className="ad-card-block" style={{ flex: 3 }}>
          <div className="ad-card-hdr-row">
            <div className="ad-chart-hdr">{t('vipActivitySummary')}</div>
            <span className="ad-card-sub-count">{t('highPrioritySignals')}</span>
          </div>
          <div className="ad-vip-summary">
            <div className="ad-vip-kpis">
              <div className="ad-vip-kpi" style={{ background: '#fef2f2' }}>
                <div className="ad-vip-kpi-num" style={{ color: '#dc2626' }}>{m.hotPeople.length}</div>
                <div className="ad-vip-kpi-lbl">{t('hotLeads')}</div>
              </div>
              <div className="ad-vip-kpi" style={{ background: '#fffbeb' }}>
                <div className="ad-vip-kpi-num" style={{ color: '#f59e0b' }}>{m.activeAlerts}</div>
                <div className="ad-vip-kpi-lbl">{t('alertsLabel')}</div>
              </div>
              <div className="ad-vip-kpi" style={{ background: '#eff6ff' }}>
                <div className="ad-vip-kpi-num" style={{ color: '#3b82f6' }}>{m.avgScore}</div>
                <div className="ad-vip-kpi-lbl">{t('avgScore')}</div>
              </div>
            </div>
            <div className="ad-vip-people">
              {m.people.filter(p => p.score > 0).slice(0, 3).map(p => (
                <Link to={`/admin/cards/${p.id}`} key={p.id} className="ad-vip-mini">
                  <div className="ad-vip-mini-score" style={{ background: p.color + '14', color: p.color, borderColor: p.color + '30' }}>{p.score}</div>
                  <div className="ad-vip-mini-info">
                    <div className="ad-vip-mini-name">{p.name}</div>
                    <div className="ad-vip-mini-meta">{p.summary} {'\u00B7'} {p.idle < 999 ? `${p.idle}d ${t('idleShort')}` : ''}</div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/admin/priority" className="ad-vip-link">{t('viewPriorityList')} {'\u2192'}</Link>
          </div>
        </div>
      </div>

      {/* ═══════ S7: FUNNEL ═══════ */}
      <div className="ad-section-label">{t('conversionFunnelUpper')}</div>
      <div className="ad-chart-card">
        <div className="ad-funnel">
          {m.funnel.map((step, i) => {
            const maxVal = m.funnel[0].value || 1;
            const pct = Math.max((step.value / maxVal) * 100, 8);
            const prev = i > 0 ? m.funnel[i - 1].value : null;
            const dropOff = prev && prev > 0 ? Math.round(((prev - step.value) / prev) * 100) : null;
            return (
              <div key={i} className="ad-funnel-step">
                <div className="ad-funnel-bar" style={{ width: `${pct}%`, background: step.color }}>
                  {step.value}
                </div>
                <div className="ad-funnel-info">
                  <span>{step.label}</span>
                  {dropOff !== null && dropOff > 0 && <span className="ad-funnel-drop">{'\u2193'} {dropOff}% {t('dropOff')}</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="ad-funnel-legend">
          <span><i style={{ background: '#94a3b8' }} /> {t('portalOpens')}</span>
          <span><i style={{ background: '#3b82f6' }} /> {t('engagedSessions')}</span>
          <span><i style={{ background: '#f59e0b' }} /> {t('intentSignals')}</span>
          <span><i style={{ background: '#dc2626' }} /> {t('bookingsLabel')}</span>
        </div>
      </div>

      {/* ═══════ S8: INTEREST DISTRIBUTION ═══════ */}
      {m.topUnits.length > 0 && (<>
        <div className="ad-section-label">{t('interestDistributionUpper')}</div>
        <div className="ad-chart-card">
          <div className="ad-chart-hdr">{t('topUnitsByViews')}</div>
          <ResponsiveContainer width="100%" height={Math.max(m.topUnits.length * 36, 100)}>
            <BarChart data={m.topUnits} layout="vertical" barSize={16} margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="views" fill="#e63946" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="ad-legend-note">{t('unitBarLegend')}</p>
        </div>
      </>)}

      {/* ═══════ S9: CAMPAIGNS ═══════ */}
      {m.campaignMetrics.length > 0 && (<>
        <div className="ad-section-label">{t('campaignsUpper')}</div>
        <div className="ad-campaign-grid">
          {m.campaignMetrics.map(c => (
            <div key={c.id} className="ad-campaign-card">
              <div className="ad-campaign-top">
                <div className="ad-campaign-name">{c.name || c.id}</div>
                <div className={`ad-campaign-status ${c.status === 'active' ? 'active' : ''}`}>{c.status || 'active'}</div>
              </div>
              <div className="ad-campaign-client">{c.client || '\u2014'}</div>
              <div className="ad-campaign-metrics">
                <div><b>{c.people}</b><span>{t('cardsMetric')}</span></div>
                <div><b>{c.vipCount}</b><span>{t('vipShort')}</span></div>
                <div><b>{c.convRate}%</b><span>{t('convMetric')}</span></div>
                <div><b>{c.events}</b><span>{t('eventsMetric')}</span></div>
              </div>
              <div className="ad-campaign-pipeline">
                {c.hot > 0 && <span style={{ color: '#dc2626' }}>{'\u{1F534}'} {c.hot} {t('hotShort')}</span>}
                {c.warm > 0 && <span style={{ color: '#f59e0b' }}>{'\u{1F7E1}'} {c.warm} {t('warmLabel')}</span>}
              </div>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}
