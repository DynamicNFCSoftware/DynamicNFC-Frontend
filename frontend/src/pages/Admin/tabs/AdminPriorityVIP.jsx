// ═══════════════════════════════════════════════════════════════
// PRIORITY VIP LIST — Salesforce Lightning Grade
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './AdminPriorityVIP.css';
import { useTranslation } from '../../../i18n';
import '../../../i18n/pages/admin';

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
  if (!events?.length) return { score: 0, raw: 0, label: 'NEW', color: '#94a3b8', stage: 'new' };
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
  const raw = score;
  Object.entries(intentMap).forEach(([evt, pts]) => { if (events.some(e => e.event === evt)) score += pts; });
  const rawTotal = score;
  score = Math.min(score, 100);
  const hot = c.hotThreshold || 80, warm = c.warmThreshold || 50, interested = c.interestedThreshold || 20;
  if (score >= hot) return { score, raw: rawTotal, label: 'HOT', color: '#dc2626', stage: 'hot' };
  if (score >= warm) return { score, raw: rawTotal, label: 'WARM', color: '#f59e0b', stage: 'warm' };
  if (score >= interested) return { score, raw: rawTotal, label: 'INTERESTED', color: '#3b82f6', stage: 'interested' };
  return { score, raw: rawTotal, label: 'NEW', color: '#94a3b8', stage: 'new' };
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

function getAlerts(events, t) {
  const alerts = [];
  const hasPricing = events.some(e => e.event === 'pricing_request');
  const hasBooking = events.some(e => e.event === 'book_viewing');
  const hasCompare = events.some(e => e.event === 'unit_compare');
  const hasFamily = events.some(e => e.visitorType === 'family');
  const hasPayment = events.some(e => e.event === 'payment_plan');
  const hasAdvisor = events.some(e => e.event === 'contact_advisor');
  if (hasBooking && hasPricing) alerts.push({ label: t('alertHighIntent'), type: 'red' });
  else if (hasPricing) alerts.push({ label: t('alertPricingInterest'), type: 'red' });
  if (hasPayment) alerts.push({ label: t('alertPaymentPlan'), type: 'red' });
  if (hasAdvisor) alerts.push({ label: t('alertAdvisorContact'), type: 'green' });
  if (hasCompare) alerts.push({ label: t('alertComparingPlans'), type: 'blue' });
  if (hasFamily) alerts.push({ label: t('alertFamilyBuyer'), type: 'amber' });
  return alerts;
}

function getDue(person) {
  if (person.trigger?.text?.toLowerCase?.().includes('booked')) return 'today';
  if (person.trigger?.text?.toLowerCase?.().includes('pricing')) return 'today';
  if (person.idle >= 6 && person.score >= 30) return 'today';
  if (person.score >= 70) return 'today';
  if (person.idle >= 3 || person.score >= 50) return 'tomorrow';
  return 'week';
}

function getRisk(person) {
  if (person.idle >= 7 && person.score >= 30) return 'high';
  if (person.idle >= 4 || person.score >= 50) return 'medium';
  return 'low';
}

function getNextBestAction(person, t) {
  if (!person.trigger) {
    if (person.idle > 7 && person.score >= 30) return t('idleHighScoreReengage', { days: person.idle });
    if (person.score >= 50 && person.actions.length === 0) return t('warmNoIntentOffer');
    return null;
  }

  const ev = person.events;
  const hasPricing = ev.some(e => e.event === 'pricing_request');
  const hasBooking = ev.some(e => e.event === 'book_viewing');
  if (hasPricing && !hasBooking) return t('pricingNotBookedOffer');
  if (hasBooking) return t('viewingBookedPrepare');
  return person.trigger.text;
}
function timeAgo(ts, t) {
  if (!ts) return t('lastTapNever');
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return t('justNow');
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

const initials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const avatarColors = ['#e63946', '#457b9d', '#2a9d8f', '#e76f51', '#6366f1', '#0176d3', '#7c3aed', '#059669'];
const getAvatarColor = (id) => avatarColors[Math.abs([...id].reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)) % avatarColors.length];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AdminPriorityVIP() {
  const t = useTranslation('admin');
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);
  const [outreachTarget, setOutreachTarget] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState('all');
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
      console.error('Priority fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Compute ── */
  const { people, candidates, nextBestActions, ownerRows } = useMemo(() => {
    if (!rawData) return { people: [], candidates: [], nextBestActions: [], ownerRows: [] };
    const { cards, behaviors, campaigns, cfg } = rawData;

    // Sector filter
    const sectorCampIds = sectorFilter === 'all'
      ? null
      : new Set(campaigns.filter(c => c.sector === sectorFilter).map(c => c.id));
    const filteredCards = sectorCampIds ? cards.filter(c => sectorCampIds.has(c.campaignId)) : cards;

    const peopleList = filteredCards.map(card => {
      const ev = behaviors.filter(b => b.cardId === card.id);
      const sc = calcScore(ev, cfg);
      const lastEv = ev[0];
      const lastActivity = lastEv?.timestamp?.toDate?.() || null;
      const idle = lastActivity ? Math.floor((Date.now() - lastActivity.getTime()) / 86400000) : 999;
      const trigger = getTrigger(ev, t);
      const alerts = getAlerts(ev, t);
      const name = card.assignedName || card.assignedTo || ev.find(e => e.visitorName)?.visitorName || `Card ${card.id}`;
      const color = getAvatarColor(card.id);
      const campaign = campaigns.find(c => c.id === card.campaignId);
      const campaignName = campaign?.name || card.campaignId || '\u2014';
      const email = card.email || card.assignedEmail || null;
      const phone = card.phone || card.assignedPhone || null;

      // Top unit
      const unitViews = ev.filter(e => ['unit_view', 'unit_interaction'].includes(e.event) && (e.details?.unitName || e.data?.unitName));
      const topUnit = unitViews.length > 0 ? (unitViews[0].details?.unitName || unitViews[0].data?.unitName) : null;

      // Actions list
      const actions = [];
      if (ev.some(e => e.event === 'pricing_request')) actions.push(t('alertPricingInterest'));
      if (ev.some(e => e.event === 'book_viewing')) actions.push(t('alertViewingBooked'));
      if (ev.some(e => e.event === 'brochure_download')) actions.push(t('actionBrochure'));
      if (ev.some(e => e.event === 'payment_plan')) actions.push(t('alertPaymentPlan'));
      if (ev.some(e => e.event === 'contact_advisor')) actions.push(t('alertAdvisorContact'));

      return {
        ...card, name, ...sc, color, events: ev, trigger, alerts,
        lastActivity, idle, campaignName, topUnit, actions, email, phone,
      };
    }).sort((a, b) => b.score - a.score);

    // VIP Candidates: registered users scoring above warm threshold
    const cardIds = new Set(cards.map(c => c.id));
    const regVisitors = {};
    behaviors.forEach(b => {
      if ((b.visitorType === 'registered' || b.visitorType === 'family') && b.visitorName && !cardIds.has(b.cardId)) {
        const key = b.visitorName || b.cardId;
        if (!regVisitors[key]) regVisitors[key] = { name: key, events: [], visitorType: b.visitorType };
        regVisitors[key].events.push(b);
      }
    });
    const candidatesList = Object.values(regVisitors).map(v => {
      const sc = calcScore(v.events, cfg);
      const unitViews = v.events.filter(e => ['unit_view', 'unit_interaction'].includes(e.event) && (e.details?.unitName || e.data?.unitName));
      const topUnit = unitViews.length > 0 ? (unitViews[0].details?.unitName || unitViews[0].data?.unitName) : null;
      return { ...v, ...sc, topUnit, color: getAvatarColor(v.name) };
    }).filter(v => v.score >= (cfg.warmThreshold || 50)).sort((a, b) => b.score - a.score);

    // Next best actions
    const nbaList = peopleList
      .map(p => ({ ...p, nba: getNextBestAction(p, t) }))
      .filter(p => p.nba)
      .slice(0, 5);

    const ownerMap = {};
    peopleList.forEach((p) => {
      const owner = p.salesRep || t('unassigned');
      if (!ownerMap[owner]) ownerMap[owner] = { owner, total: 0, dueToday: 0, highRisk: 0 };
      ownerMap[owner].total += 1;
      if (getDue(p) === 'today') ownerMap[owner].dueToday += 1;
      if (getRisk(p) === 'high') ownerMap[owner].highRisk += 1;
    });
    const rows = Object.values(ownerMap).sort((a, b) => {
      if (b.dueToday !== a.dueToday) return b.dueToday - a.dueToday;
      if (b.highRisk !== a.highRisk) return b.highRisk - a.highRisk;
      return b.total - a.total;
    });

    return { people: peopleList, candidates: candidatesList, nextBestActions: nbaList, ownerRows: rows };
  }, [rawData, sectorFilter, t]);

  const filteredPeople = useMemo(() => (
    ownerFilter === 'all' ? people : people.filter((p) => (p.salesRep || t('unassigned')) === ownerFilter)
  ), [people, ownerFilter]);

  /* ── Export CSV ── */
  const exportCSV = () => {
    const headers = 'Score,Raw Score,Name,Stage,Campaign,Trigger,Days Idle,Alerts\n';
    const rows = people.map(p => {
      return `${p.score},${p.raw},"${p.name}","${p.label}","${p.campaignName}","${p.trigger?.text || t('noTrigger')}",${p.idle},"${p.alerts.map(a => a.label).join(', ')}"`;
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `priority-vip-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  /* ── Outreach target details ── */
  const outreachName = outreachTarget?.name || t('clientLabel');
  const outreachUnit = outreachTarget?.topUnit;

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;

  return (
    <div>
      {/* ═══════ HEADER ═══════ */}
      <div className="apv-header">
        <div>
          <h1 className="apv-title">{t('navPriorityVip')}</h1>
          <div className="apv-subtitle">
            {people.length} {t('contactsTrackedHealthy')} {'\u00B7'} {people.filter(p => p.stage === 'hot').length} {t('riskHigh')} {'\u00B7'} {t('scoreShort')}
          </div>
        </div>
        <div className="apv-header-actions">
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: '0.78rem', fontFamily: 'inherit', color: '#374151', background: '#fff', cursor: 'pointer' }}
          >
            <option value="all">{t('allSectors')}</option>
            <option value="real_estate">{t('navRealEstate')}</option>
            <option value="automotive">{t('navAutomotive')}</option>
          </select>
          <button onClick={fetchData} className="apv-btn">{'\u21BB'} {t('refresh')}</button>
          <button onClick={exportCSV} className="apv-btn">{'\u{1F4CA}'} {t('exportCsv')}</button>
        </div>
      </div>

      {/* ═══════ OWNER WORKLOAD ═══════ */}
      <div className="apv-section">
        <span className="apv-section-icon">{'\u{1F465}'}</span>
        {t('callQueueTitle')}
      </div>
      <div className="apv-owner-row">
        <button
          type="button"
          className={`apv-owner-chip ${ownerFilter === 'all' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('all')}
        >
          <span className="apv-owner-name">{t('navAll')}</span>
          <span className="apv-owner-metrics">
            <span className="apv-pill due">{people.length} {t('total')}</span>
            <span className="apv-pill risk">{people.filter(p => getRisk(p) === 'high').length} {t('riskHigh')}</span>
          </span>
        </button>
        {ownerRows.map((r) => (
          <button
            type="button"
            key={r.owner}
            className={`apv-owner-chip ${ownerFilter === r.owner ? 'active' : ''}`}
            onClick={() => setOwnerFilter(r.owner)}
          >
            <span className="apv-owner-name">{r.owner}</span>
            <span className="apv-owner-metrics">
              <span className="apv-pill due">{r.dueToday} {t('dueToday')}</span>
              <span className="apv-pill risk">{r.highRisk} {t('riskHigh')}</span>
            </span>
          </button>
        ))}
      </div>

      {/* ═══════ PRIORITY TABLE ═══════ */}
      <div className="apv-table-wrap">
        <table className="apv-table">
          <thead>
            <tr>
              <th>{t('vipShort')}</th>
              <th>{t('owner')}</th>
              <th>{t('unitFocus')}</th>
              <th>{t('leadScore')}</th>
              <th>{t('nextAction')}</th>
              <th>{t('due')}</th>
              <th>{t('risk')}</th>
              <th>{t('lastTouch')}</th>
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map(p => {
              const due = getDue(p);
              const risk = getRisk(p);
              const owner = p.salesRep || t('unassigned');
              return (
                <tr key={p.id}>
                  {/* VIP Cell */}
                  <td>
                    <div className="apv-vip-cell">
                      <div className="apv-avatar" style={{ background: p.color }}>{initials(p.name)}</div>
                      <div>
                        <div className="apv-vip-name">
                          {p.name}
                          {risk === 'high' && <span className="apv-risk-badge">{t('riskHigh').toUpperCase()}</span>}
                        </div>
                        <div className="apv-vip-id">{p.id}</div>
                        <div className="apv-vip-campaign">{p.campaignName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Owner */}
                  <td>
                    <div className="apv-owner-cell">
                      <div className="apv-owner-main">{owner}</div>
                    </div>
                  </td>

                  {/* Unit Focus */}
                  <td>
                    <div className="apv-trigger-cell">
                      <div className="apv-trigger-text">{p.topUnit || '\u2014'}</div>
                    </div>
                  </td>

                  {/* Score */}
                  <td>
                    <div className="apv-score" style={{ color: p.color, borderColor: p.color + '40', background: p.color + '0a' }}>
                      {p.score}
                    </div>
                    {p.raw > p.score && <div className="apv-score-raw">{t('rawLabel')}: {p.raw}</div>}
                  </td>

                  {/* Next Action */}
                  <td className="apv-trigger-cell">
                    <div className="apv-trigger-text" style={{ color: p.trigger?.color || '#64748b' }}>
                      {getNextBestAction(p, t) || p.trigger?.text || t('nurtureUnitContent')}
                    </div>
                  </td>

                  {/* Due */}
                  <td>
                    <span className={`apv-pill due ${due}`}>{due === 'today' ? t('dueToday') : due === 'tomorrow' ? t('dueTomorrow') : t('dueWeek')}</span>
                  </td>

                  {/* Risk */}
                  <td>
                    <span className={`apv-pill risk ${risk}`}>{risk === 'high' ? t('riskHigh') : risk === 'medium' ? t('riskMedium') : t('riskLow')}</span>
                  </td>

                  {/* Last Touch */}
                  <td>
                    <span className="apv-idle">
                      {timeAgo(p.lastActivity, t)}
                    </span>
                    <div className="apv-score-raw">{p.idle < 999 ? `${p.idle}d ${t('idleShort')}` : '\u2014'}</div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="apv-action-btns">
                      <button className="apv-tbl-btn primary" onClick={() => setOutreachTarget(p)}>{t('outreach')} {'\u2192'}</button>
                      <Link to={`/admin/cards/${p.id}`} className="apv-tbl-btn">{t('navOverview')}</Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {people.length === 0 && <div className="apv-empty">{t('noActionableContacts')}</div>}
      </div>

      {/* ═══════ VIP CANDIDATES ═══════ */}
      {candidates.length > 0 && (
        <>
          <div className="apv-section">
            <span className="apv-section-icon">{'\u2B50'}</span>
            {t('vipCandidatesTitle')} - {t('vipCandidatesSub')}
          </div>
          <div className="apv-candidates">
            {candidates.map((c, i) => (
              <div key={i} className="apv-candidate">
                <div className="apv-candidate-avatar" style={{ background: c.color }}>{initials(c.name)}</div>
                <div className="apv-candidate-info">
                  <div className="apv-candidate-name">{c.name}</div>
                  <div className="apv-candidate-meta">
                    {c.visitorType} {'\u00B7'} {t('scoreLabel')}: {c.score} {c.topUnit ? `\u00B7 ${t('topLabel')}: ${c.topUnit}` : ''}
                  </div>
                </div>
                <Link to="/admin/cards" className="apv-promote-btn">{t('promoteToVip')} {'\u2192'}</Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══════ NEXT BEST ACTIONS ═══════ */}
      {nextBestActions.length > 0 && (
        <>
          <div className="apv-section">
            <span className="apv-section-icon">{'\u{1F3AF}'}</span>
            {t('nextBestActionsTitle')} - {t('nextBestActionsSub')}
          </div>
          <div className="apv-nba-list">
            {nextBestActions.map((p, i) => (
              <div key={i} className="apv-nba" style={{ borderLeftColor: p.trigger?.color || p.color }}>
                <div>
                  <div className="apv-nba-name">{p.name}</div>
                </div>
                <div className="apv-nba-text">{p.nba}</div>
                <button className="apv-nba-btn" onClick={() => setOutreachTarget(p)}>{t('act')} {'\u2192'}</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <div className="apv-section">
        <span className="apv-section-icon">{'\u26A1'}</span>
        {t('quickActions')} - {t('bulkOperations')}
      </div>
      <div className="apv-quick">
        <button className="apv-quick-btn" onClick={() => {
          const highIntent = people.filter(p => p.alerts.some(a => a.label === t('alertHighIntent') || a.label === t('alertPricingInterest')));
          if (highIntent.length === 0) { alert(t('noHighIntentFound')); return; }
          const emails = highIntent.map(p => p.email).filter(Boolean);
          if (emails.length > 0) window.location.href = `mailto:?bcc=${emails.join(',')}`;
          else alert(t('noHighIntentEmail', { count: highIntent.length }));
        }}>
          {'\u{1F4E7}'} {t('emailAllHighIntent')}
        </button>
        <button className="apv-quick-btn" onClick={exportCSV}>
          {'\u{1F4CA}'} {t('exportPriorityList')}
        </button>
      </div>
      <div className="apv-reminder">
        {t('reminderVipActions')}
      </div>

      {/* ═══════ OUTREACH MODAL ═══════ */}
      {outreachTarget && (
        <div className="apv-modal-overlay" onClick={() => setOutreachTarget(null)}>
          <div className="apv-modal" onClick={e => e.stopPropagation()}>
            <button className="apv-modal-close" onClick={() => setOutreachTarget(null)}>{'\u2715'}</button>
            <h3>{t('outreachModalTitle')} {'\u2014'} {outreachName}</h3>

            <div className="apv-modal-section">
              <div className="apv-modal-label">{'\u{1F4DE}'} {t('callScript')}</div>
              <div className="apv-modal-script">
                {'\u201C'}{t('outreachCallLine1', { name: outreachName })}
                {outreachUnit
                  ? ` ${t('outreachCallWithUnit', { unit: outreachUnit })}`
                  : ` ${t('outreachCallNoUnit')}`
                }{'\u201D'}
              </div>
            </div>

            <div className="apv-modal-section">
              <div className="apv-modal-label">{'\u2709\uFE0F'} {t('emailTemplate')}</div>
              <div className="apv-modal-script">
                {t('outreachEmailDear', { name: outreachName })}{'\n\n'}
                {t('outreachEmailThanks', { unit: outreachUnit ? ` ${outreachUnit}` : '' })}
                {'\n'}
                {t('outreachEmailVipLine')}
                {'\n\n'}
                {t('outreachEmailBest')}{'\n'}[Your Name]
              </div>
            </div>

            <div className="apv-modal-section">
              <div className="apv-modal-label">{'\u{1F4AC}'} WhatsApp</div>
              <div className="apv-modal-script">
                {t('outreachWhatsAppIntro', { name: outreachName })}
                {outreachUnit
                  ? ` ${t('outreachWhatsAppWithUnit', { unit: outreachUnit })}`
                  : ` ${t('outreachWhatsAppNoUnit')}`
                }
              </div>
            </div>

            <div className="apv-modal-guard">
              <strong>{'\u26A0\uFE0F'} {t('guardrail')}:</strong> {t('guardrailText')}
            </div>

            <div className="apv-modal-actions">
              <a href={outreachTarget.phone ? `tel:${outreachTarget.phone}` : '#'} className="apv-outreach-btn red">{'\u{1F4DE}'} Call</a>
              <a href={outreachTarget.email ? `mailto:${outreachTarget.email}` : '#'} className="apv-outreach-btn blue">{'\u2709\uFE0F'} Email</a>
              <a
                href={outreachTarget.phone ? `https://wa.me/${outreachTarget.phone.replace(/[^0-9]/g, '')}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="apv-outreach-btn green"
              >{'\u{1F4AC}'} WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
