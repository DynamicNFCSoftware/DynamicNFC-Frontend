// ═══════════════════════════════════════════════════════════════
// PRIORITY VIP LIST — Salesforce Lightning Grade
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './AdminPriorityVIP.css';

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

function getTrigger(events) {
  const h48 = Date.now() - 48 * 3600000;
  const recent = events.filter(e => (e.timestamp?.toDate?.()?.getTime?.() || 0) > h48);
  if (!recent.length) return null;
  if (recent.some(e => e.event === 'book_viewing')) return { icon: '\u2705', text: 'Viewing booked \u2014 confirm & prepare', color: '#059669' };
  if (recent.some(e => ['pricing_request', 'payment_plan'].includes(e.event))) return { icon: '\u{1F525}', text: 'Pricing requested \u2014 call with offer', color: '#dc2626' };
  if (recent.some(e => ['brochure_download', 'floorplan_download'].includes(e.event))) return { icon: '\u{1F4CB}', text: 'Downloaded materials \u2014 follow up', color: '#f59e0b' };
  if (recent.length >= 3) return { icon: '\u26A1', text: `${recent.length} actions in 48h \u2014 strike now`, color: '#3b82f6' };
  return null;
}

function getAlerts(events) {
  const alerts = [];
  const hasPricing = events.some(e => e.event === 'pricing_request');
  const hasBooking = events.some(e => e.event === 'book_viewing');
  const hasCompare = events.some(e => e.event === 'unit_compare');
  const hasFamily = events.some(e => e.visitorType === 'family');
  const hasPayment = events.some(e => e.event === 'payment_plan');
  const hasAdvisor = events.some(e => e.event === 'contact_advisor');
  if (hasBooking && hasPricing) alerts.push({ label: 'High Intent', type: 'red' });
  else if (hasPricing) alerts.push({ label: 'Pricing Interest', type: 'red' });
  if (hasPayment) alerts.push({ label: 'Payment Plan', type: 'red' });
  if (hasAdvisor) alerts.push({ label: 'Advisor Contact', type: 'green' });
  if (hasCompare) alerts.push({ label: 'Comparing Plans', type: 'blue' });
  if (hasFamily) alerts.push({ label: 'Family Buyer', type: 'amber' });
  return alerts;
}

function getNextBestAction(person) {
  if (!person.trigger) {
    if (person.idle > 7 && person.score >= 30) return 'Idle for ' + person.idle + 'd but scored high. Re-engage now.';
    if (person.score >= 50 && person.actions.length === 0) return 'Warm lead with no intent action yet. Send exclusive offer.';
    return null;
  }
  const ev = person.events;
  const hasPricing = ev.some(e => e.event === 'pricing_request');
  const hasBooking = ev.some(e => e.event === 'book_viewing');
  if (hasPricing && !hasBooking) return 'Pricing requested but hasn\u2019t booked. Offer payment plan.';
  if (hasBooking) return 'Viewing booked \u2014 confirm details and prepare materials.';
  return person.trigger.text;
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
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);
  const [outreachTarget, setOutreachTarget] = useState(null);
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
  const { people, candidates, nextBestActions } = useMemo(() => {
    if (!rawData) return { people: [], candidates: [], nextBestActions: [] };
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
      const trigger = getTrigger(ev);
      const alerts = getAlerts(ev);
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
      if (ev.some(e => e.event === 'pricing_request')) actions.push('Pricing requested');
      if (ev.some(e => e.event === 'book_viewing')) actions.push('Viewing booked');
      if (ev.some(e => e.event === 'brochure_download')) actions.push('Brochure downloaded');
      if (ev.some(e => e.event === 'payment_plan')) actions.push('Payment plan');
      if (ev.some(e => e.event === 'contact_advisor')) actions.push('Advisor contacted');

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
      .map(p => ({ ...p, nba: getNextBestAction(p) }))
      .filter(p => p.nba)
      .slice(0, 5);

    return { people: peopleList, candidates: candidatesList, nextBestActions: nbaList };
  }, [rawData, sectorFilter]);

  /* ── Export CSV ── */
  const exportCSV = () => {
    const headers = 'Score,Raw Score,Name,Stage,Campaign,Trigger,Days Idle,Alerts\n';
    const rows = people.map(p => {
      return `${p.score},${p.raw},"${p.name}","${p.label}","${p.campaignName}","${p.trigger?.text || 'No trigger'}",${p.idle},"${p.alerts.map(a => a.label).join(', ')}"`;
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `priority-vip-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  /* ── Outreach target details ── */
  const outreachName = outreachTarget?.name || 'Client';
  const outreachUnit = outreachTarget?.topUnit;

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;

  return (
    <div>
      {/* ═══════ HEADER ═══════ */}
      <div className="apv-header">
        <div>
          <h1 className="apv-title">Priority VIP List</h1>
          <div className="apv-subtitle">
            {people.length} contacts {'\u00B7'} {people.filter(p => p.stage === 'hot').length} hot {'\u00B7'} sorted by engagement score
          </div>
        </div>
        <div className="apv-header-actions">
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: '0.78rem', fontFamily: 'inherit', color: '#374151', background: '#fff', cursor: 'pointer' }}
          >
            <option value="all">All Sectors</option>
            <option value="real_estate">Real Estate</option>
            <option value="automotive">Automotive</option>
          </select>
          <button onClick={fetchData} className="apv-btn">{'\u21BB'} Refresh</button>
          <button onClick={exportCSV} className="apv-btn">{'\u{1F4CA}'} Export CSV</button>
        </div>
      </div>

      {/* ═══════ PRIORITY TABLE ═══════ */}
      <div className="apv-table-wrap">
        <table className="apv-table">
          <thead>
            <tr>
              <th>VIP</th>
              <th>Lead Score</th>
              <th>Trigger</th>
              <th>Idle</th>
              <th>Alerts</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {people.map(p => {
              const isRisk = p.idle > 5 && p.score >= 30;
              return (
                <tr key={p.id}>
                  {/* VIP Cell */}
                  <td>
                    <div className="apv-vip-cell">
                      <div className="apv-avatar" style={{ background: p.color }}>{initials(p.name)}</div>
                      <div>
                        <div className="apv-vip-name">
                          {p.name}
                          {isRisk && <span className="apv-risk-badge">AT RISK</span>}
                        </div>
                        <div className="apv-vip-id">{p.id}</div>
                        <div className="apv-vip-campaign">{p.campaignName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td>
                    <div className="apv-score" style={{ color: p.color, borderColor: p.color + '40', background: p.color + '0a' }}>
                      {p.score}
                    </div>
                    {p.raw > p.score && <div className="apv-score-raw">raw: {p.raw}</div>}
                  </td>

                  {/* Trigger */}
                  <td className="apv-trigger-cell">
                    {p.trigger ? (
                      <div className="apv-trigger-text" style={{ color: p.trigger.color }}>
                        {p.trigger.icon} {p.trigger.text}
                      </div>
                    ) : (
                      <span className="apv-no-trigger">No trigger</span>
                    )}
                  </td>

                  {/* Idle */}
                  <td>
                    <span className={`apv-idle${isRisk ? ' risk' : ''}`}>
                      {p.idle < 999 ? `${p.idle}d` : '\u2014'}
                    </span>
                  </td>

                  {/* Alerts */}
                  <td>
                    <div className="apv-alerts">
                      {p.alerts.map((a, i) => (
                        <span key={i} className={`apv-alert ${a.type}`}>{a.label}</span>
                      ))}
                      {p.alerts.length === 0 && <span className="apv-alert gray">No alerts</span>}
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="apv-action-btns">
                      <button className="apv-tbl-btn primary" onClick={() => setOutreachTarget(p)}>Outreach {'\u2192'}</button>
                      <Link to={`/admin/cards/${p.id}`} className="apv-tbl-btn">View</Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {people.length === 0 && <div className="apv-empty">No contacts to display</div>}
      </div>

      {/* ═══════ VIP CANDIDATES ═══════ */}
      {candidates.length > 0 && (
        <>
          <div className="apv-section">
            <span className="apv-section-icon">{'\u2B50'}</span>
            VIP Candidates — Registered users scoring above threshold
          </div>
          <div className="apv-candidates">
            {candidates.map((c, i) => (
              <div key={i} className="apv-candidate">
                <div className="apv-candidate-avatar" style={{ background: c.color }}>{initials(c.name)}</div>
                <div className="apv-candidate-info">
                  <div className="apv-candidate-name">{c.name}</div>
                  <div className="apv-candidate-meta">
                    {c.visitorType} {'\u00B7'} Score: {c.score} {c.topUnit ? `\u00B7 Top: ${c.topUnit}` : ''}
                  </div>
                </div>
                <Link to="/admin/cards" className="apv-promote-btn">Promote to VIP {'\u2192'}</Link>
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
            Next Best Actions — Auto-suggested based on VIP behavior
          </div>
          <div className="apv-nba-list">
            {nextBestActions.map((p, i) => (
              <div key={i} className="apv-nba" style={{ borderLeftColor: p.trigger?.color || p.color }}>
                <div>
                  <div className="apv-nba-name">{p.name}</div>
                </div>
                <div className="apv-nba-text">{p.nba}</div>
                <button className="apv-nba-btn" onClick={() => setOutreachTarget(p)}>Act {'\u2192'}</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <div className="apv-section">
        <span className="apv-section-icon">{'\u26A1'}</span>
        Quick Actions — Bulk Operations
      </div>
      <div className="apv-quick">
        <button className="apv-quick-btn" onClick={() => {
          const highIntent = people.filter(p => p.alerts.some(a => a.label === 'High Intent' || a.label === 'Pricing Interest'));
          if (highIntent.length === 0) { alert('No high-intent VIPs found.'); return; }
          const emails = highIntent.map(p => p.email).filter(Boolean);
          if (emails.length > 0) window.location.href = `mailto:?bcc=${emails.join(',')}`;
          else alert(`${highIntent.length} high-intent VIPs found but no email addresses on file.`);
        }}>
          {'\u{1F4E7}'} Email All High Intent VIPs
        </button>
        <button className="apv-quick-btn" onClick={exportCSV}>
          {'\u{1F4CA}'} Export Priority List
        </button>
      </div>
      <div className="apv-reminder">
        Reminder: VIP actions are for 1-to-1 outreach (call, SMS, email). Standard actions are for segment marketing.
      </div>

      {/* ═══════ OUTREACH MODAL ═══════ */}
      {outreachTarget && (
        <div className="apv-modal-overlay" onClick={() => setOutreachTarget(null)}>
          <div className="apv-modal" onClick={e => e.stopPropagation()}>
            <button className="apv-modal-close" onClick={() => setOutreachTarget(null)}>{'\u2715'}</button>
            <h3>Outreach {'\u2014'} {outreachName}</h3>

            <div className="apv-modal-section">
              <div className="apv-modal-label">{'\u{1F4DE}'} Call Script</div>
              <div className="apv-modal-script">
                {'\u201C'}Hello {outreachName}, this is [Your Name] from [Project Name].
                I{'\u2019'}m following up on your private invitation.
                {outreachUnit
                  ? ` We noticed your interest in ${outreachUnit}. Would you be available for a private viewing this week?`
                  : ' We\u2019d love to arrange an exclusive tour at your convenience.'
                }{'\u201D'}
              </div>
            </div>

            <div className="apv-modal-section">
              <div className="apv-modal-label">{'\u2709\uFE0F'} Email Template</div>
              <div className="apv-modal-script">
                Dear {outreachName},{'\n\n'}
                Thank you for your interest{outreachUnit ? ` in ${outreachUnit}` : ''}.
                As a VIP member, we{'\u2019'}d love to arrange an exclusive tour at your convenience.
                {'\n\n'}Best regards,{'\n'}[Your Name]
              </div>
            </div>

            <div className="apv-modal-section">
              <div className="apv-modal-label">{'\u{1F4AC}'} WhatsApp</div>
              <div className="apv-modal-script">
                Hi {outreachName}, this is [Your Name] from [Project Name].
                {outreachUnit
                  ? ` Following up on your interest in ${outreachUnit} \u2014 would you like to schedule a private tour?`
                  : ' We\u2019d love to schedule a private viewing for you. When works best?'
                }
              </div>
            </div>

            <div className="apv-modal-guard">
              <strong>{'\u26A0\uFE0F'} Guardrail:</strong> Never mention tracking or analytics.
              Frame outreach as a follow-up to their private VIP invitation.
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
