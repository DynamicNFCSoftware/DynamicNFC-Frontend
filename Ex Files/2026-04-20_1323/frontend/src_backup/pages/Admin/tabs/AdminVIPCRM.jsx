// ═══════════════════════════════════════════════════════════════
// VIP CRM — Split Panel · Salesforce Lightning Grade
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './AdminVIPCRM.css';

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

const timeAgo = (ts) => {
  if (!ts) return 'Never';
  const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date(ts));
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const fmtDur = (sec) => {
  if (!sec || sec <= 0) return '\u2014';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  return m > 0 ? `${m}m` : `${sec}s`;
};

const initials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const avatarColors = ['#e63946', '#457b9d', '#2a9d8f', '#e76f51', '#6366f1', '#0176d3', '#7c3aed', '#059669'];
const getAvatarColor = (id) => avatarColors[Math.abs([...id].reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)) % avatarColors.length];

function eventLabel(e) {
  const labels = {
    portal_open: 'Opened portal', portal_entry: 'Opened portal', portal_exit: 'Left portal',
    unit_view: 'Viewed unit', unit_interaction: 'Viewed unit', tower_view: 'Viewed tower',
    section_view: 'Browsed section', pricing_request: 'Requested pricing',
    book_viewing: 'Booked viewing', brochure_download: 'Downloaded brochure',
    floorplan_view: 'Viewed floor plan', floorplan_download: 'Downloaded floor plan',
    payment_plan: 'Requested payment plan',
    roi_calculator: 'Used ROI calculator', contact_advisor: 'Contacted advisor',
    unit_favorite: 'Favorited unit', unit_compare: 'Compared units',
    filter_use: 'Used filter', tab_click: 'Clicked tab', cta_click: 'Clicked action',
    whatsapp_click: 'Clicked WhatsApp',
  };
  let l = labels[e.event] || e.event.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const d = e.details || e.data || {};
  if (d.unitName) l += ` \u2014 ${d.unitName}`;
  else if (d.unitId) l += ` \u2014 ${d.unitId}`;
  else if (d.towerName) l += ` \u2014 ${d.towerName}`;
  if (e.event === 'portal_exit' && d.durationSeconds) l += ` (${fmtDur(d.durationSeconds)})`;
  return l;
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
  if (hasBooking && !hasPricing) alerts.push({ label: 'Viewing Booked', type: 'green' });
  return alerts;
}

const INTENT_EVENTS = ['pricing_request', 'payment_plan', 'book_viewing', 'contact_advisor', 'brochure_download'];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AdminVIPCRM() {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [outreachModal, setOutreachModal] = useState(null);
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
      console.error('VIP CRM fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Compute people list ── */
  const people = useMemo(() => {
    if (!rawData) return [];
    const { cards, behaviors, campaigns, cfg } = rawData;

    // Sector filter
    const sectorCampIds = sectorFilter === 'all'
      ? null
      : new Set(campaigns.filter(c => c.sector === sectorFilter).map(c => c.id));
    const filteredCards = sectorCampIds ? cards.filter(c => sectorCampIds.has(c.campaignId)) : cards;

    return filteredCards.map(card => {
      const ev = behaviors.filter(b => b.cardId === card.id);
      const sc = calcScore(ev, cfg);
      const sessions = new Set(ev.map(e => e.sessionId).filter(Boolean)).size;
      const exits = ev.filter(e => e.event === 'portal_exit');
      const totalSec = exits.reduce((s, e) => s + (e.details?.durationSeconds || 0), 0);
      const unitsViewed = new Set(ev.filter(e => ['unit_view', 'unit_interaction'].includes(e.event)).map(e => (e.details?.unitId || e.data?.unitId)).filter(Boolean)).size;
      const lastEv = ev[0];
      const lastActivity = lastEv?.timestamp?.toDate?.() || null;
      const idle = lastActivity ? Math.floor((Date.now() - lastActivity.getTime()) / 86400000) : 999;
      const trigger = getTrigger(ev);
      const alerts = getAlerts(ev);
      const name = card.assignedName || card.assignedTo || ev.find(e => e.visitorName)?.visitorName || `Card ${card.id}`;
      const color = getAvatarColor(card.id);

      // Repeat views (pricing signal): count of pricing_request events
      const pricingSignalCount = ev.filter(e => ['pricing_request', 'payment_plan'].includes(e.event)).length;
      const repeatViews = sessions;

      // Time to first action
      const openEv = [...ev].reverse().find(e => ['portal_open', 'portal_entry'].includes(e.event));
      const firstIntent = [...ev].reverse().find(e => INTENT_EVENTS.includes(e.event));
      let ttfa = null;
      if (openEv && firstIntent) {
        const t1 = openEv.timestamp?.toDate?.()?.getTime?.() || 0;
        const t2 = firstIntent.timestamp?.toDate?.()?.getTime?.() || 0;
        if (t2 > t1) ttfa = Math.round((t2 - t1) / 60000);
      }

      // Viewing velocity
      let viewVel = null;
      const bookEv = [...ev].reverse().find(e => e.event === 'book_viewing');
      if (bookEv && openEv) {
        const t1 = openEv.timestamp?.toDate?.()?.getTime?.() || 0;
        const t2 = bookEv.timestamp?.toDate?.()?.getTime?.() || 0;
        if (t2 > t1) viewVel = Math.round((t2 - t1) / 86400000 * 10) / 10;
      }

      // Top unit
      const unitViews = ev.filter(e => ['unit_view', 'unit_interaction'].includes(e.event) && (e.details?.unitName || e.data?.unitName));
      const topUnit = unitViews.length > 0 ? (unitViews[0].details?.unitName || unitViews[0].data?.unitName) : null;

      // Campaign name
      const campaign = campaigns.find(c => c.id === card.campaignId);
      const campaignName = campaign?.name || card.campaignId || '\u2014';

      // Sales rep
      const salesRep = card.salesRep || card.assignedSalesRep || null;

      // Email & phone
      const email = card.email || card.assignedEmail || null;
      const phone = card.phone || card.assignedPhone || null;

      const scoreColor = sc.color;
      return {
        ...card, name, ...sc, scoreColor, avatarColor: color, color, sessions, totalSec, unitsViewed,
        events: ev, trigger, alerts, lastActivity, idle, topUnit,
        campaignName, salesRep, email, phone, repeatViews,
        pricingSignalCount, ttfa, viewVel,
      };
    }).sort((a, b) => b.score - a.score);
  }, [rawData, sectorFilter]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    if (!search.trim()) return people;
    const q = search.toLowerCase();
    return people.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.campaignName || '').toLowerCase().includes(q) ||
      p.label.toLowerCase().includes(q)
    );
  }, [people, search]);

  const selected = people.find(p => p.id === selectedId);

  /* ── RENDER ── */
  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;

  return (
    <div>
      <div className="avc-layout">
        {/* ═══════ LEFT PANEL — DIRECTORY ═══════ */}
        <div className="avc-left">
          <div className="avc-left-header">
            <div>
              <div className="avc-left-title">VIP Directory</div>
              <div className="avc-left-count">{people.length} contacts {'\u00B7'} {people.filter(p => p.stage === 'hot').length} hot</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select
                value={sectorFilter}
                onChange={e => { setSectorFilter(e.target.value); setSelectedId(null); }}
                style={{ padding: '4px 8px', borderRadius: 5, border: '1px solid #e5e7eb', fontSize: '0.65rem', fontFamily: 'inherit', color: '#374151', background: '#fff', cursor: 'pointer' }}
              >
                <option value="all">All</option>
                <option value="real_estate">Real Estate</option>
                <option value="automotive">Automotive</option>
              </select>
              <Link to="/admin/cards" className="avc-create-btn">+ Create VIP</Link>
            </div>
          </div>

          <div className="avc-search">
            <input
              type="text"
              placeholder="Search name, ID, campaign..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="avc-list">
            {filtered.length === 0 ? (
              <div className="avc-empty-list">
                {search ? 'No matches found' : 'No contacts yet'}
              </div>
            ) : filtered.map(p => (
              <div
                key={p.id}
                className={`avc-vip-item${selectedId === p.id ? ' selected' : ''}`}
                onClick={() => setSelectedId(p.id)}
              >
                <div className="avc-avatar" style={{ background: p.avatarColor }}>
                  {initials(p.name)}
                </div>
                <div className="avc-vip-info">
                  <div className="avc-vip-name">{p.name}</div>
                  <div className="avc-vip-meta">
                    {p.id.slice(0, 12)} {'\u00B7'} {p.campaignName} {'\u00B7'} {p.idle < 999 ? `${p.idle}d idle` : 'No activity'}
                  </div>
                </div>
                <div
                  className="avc-score-circle"
                  style={{ color: p.scoreColor, borderColor: p.scoreColor + '40', background: p.scoreColor + '0a' }}
                >
                  {p.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ RIGHT PANEL — DETAIL ═══════ */}
        <div className="avc-right">
          {!selected ? (
            <div className="avc-empty-detail">
              <div className="avc-empty-detail-icon">{'\u{1F464}'}</div>
              <div>Select a contact to view their intelligence profile</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="avc-detail-header">
                <div className="avc-detail-avatar" style={{ background: selected.avatarColor }}>
                  {initials(selected.name)}
                </div>
                <div>
                  <div className="avc-detail-name">{selected.name}</div>
                  <div className="avc-detail-meta">
                    <span>{selected.id}</span>
                    {selected.email && <><span>{'\u00B7'}</span><span>{selected.email}</span></>}
                    {selected.phone && <><span>{'\u00B7'}</span><span>{selected.phone}</span></>}
                    <span className="avc-detail-badge" style={{ background: selected.scoreColor + '14', color: selected.scoreColor }}>{selected.label}</span>
                    {selected.idle > 5 && selected.score >= 30 && (
                      <span className="avc-detail-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>AT RISK</span>
                    )}
                  </div>
                  <div className="avc-detail-actions">
                    <button className="avc-action-btn" onClick={() => setOutreachModal('call')}>{'\u{1F4DE}'} Outreach</button>
                    <Link to={`/admin/cards/${selected.id}`} className="avc-action-btn">View Full Profile {'\u2192'}</Link>
                  </div>
                </div>
              </div>

              {/* Sales Trigger */}
              {selected.trigger && (
                <div className="avc-trigger" style={{
                  background: selected.trigger.color + '08',
                  borderColor: selected.trigger.color + '20',
                }}>
                  <span className="avc-trigger-icon">{selected.trigger.icon}</span>
                  <div>
                    <div className="avc-trigger-title" style={{ color: selected.trigger.color }}>SALES TRIGGER: WHY CALL NOW?</div>
                    <div className="avc-trigger-text" style={{ color: selected.trigger.color }}>{selected.trigger.text}</div>
                  </div>
                </div>
              )}

              {/* 4 Metric Cards */}
              <div className="avc-metrics">
                <div className="avc-metric">
                  <div className="avc-metric-val">{selected.score}</div>
                  <div className="avc-metric-lbl">Decayed Score</div>
                  <div className="avc-metric-sub">{'\u23F3'} Engagement</div>
                </div>
                <div className="avc-metric">
                  <div className="avc-metric-val">{selected.repeatViews}</div>
                  <div className="avc-metric-lbl">Repeat Views</div>
                  <div className="avc-metric-sub">{selected.sessions} sessions</div>
                </div>
                <div className="avc-metric">
                  <div className="avc-metric-val">{selected.pricingSignalCount}</div>
                  <div className="avc-metric-lbl">Pricing Signal</div>
                  <div className="avc-metric-sub">Pricing + payment</div>
                </div>
                <div className="avc-metric">
                  <div className="avc-metric-val">{selected.idle < 999 ? `${selected.idle}d` : '\u2014'}</div>
                  <div className="avc-metric-lbl">Days Idle</div>
                  <div className="avc-metric-sub">Since last activity</div>
                </div>
              </div>

              {/* Velocity */}
              <div className="avc-velocity">
                <span>Time to First Action: <b>{selected.ttfa !== null ? `${selected.ttfa} min` : '\u2014'}</b></span>
                <span>{'\u00B7'}</span>
                <span>Viewing Velocity: <b>{selected.viewVel !== null ? `${selected.viewVel} days` : '\u2014'}</b></span>
              </div>

              {/* Alert Badges */}
              {selected.alerts.length > 0 && (
                <div className="avc-alerts">
                  {selected.alerts.map((a, i) => (
                    <span key={i} className={`avc-alert-badge ${a.type}`}>{a.label}</span>
                  ))}
                </div>
              )}

              {/* Context: Sales Rep, Card, Campaign */}
              <div className="avc-context">
                <span>Sales Rep: <b>{selected.salesRep || 'Unassigned'}</b></span>
                <span>Card: <b>{selected.id}</b></span>
                <span>Campaign: <b>{selected.campaignName}</b></span>
              </div>

              {/* Outreach Buttons */}
              <div className="avc-outreach">
                <button className="avc-outreach-btn red" onClick={() => setOutreachModal('call')}>{'\u{1F4DE}'} Call</button>
                <button className="avc-outreach-btn blue" onClick={() => setOutreachModal('email')}>{'\u2709\uFE0F'} Email</button>
                <button className="avc-outreach-btn green" onClick={() => setOutreachModal('whatsapp')}>{'\u{1F4AC}'} WhatsApp</button>
              </div>

              {/* Timeline */}
              <div className="avc-timeline-card">
                <div className="avc-timeline-header">
                  Timeline
                  <span>Last seen {timeAgo(selected.lastActivity)}</span>
                </div>
                <div className="avc-timeline">
                  {selected.events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8', fontSize: '0.82rem' }}>
                      No events recorded
                    </div>
                  ) : selected.events.slice(0, 30).map((e, i) => {
                    const isIntent = INTENT_EVENTS.includes(e.event);
                    return (
                      <div key={i} className="avc-tl-item">
                        <div className={`avc-tl-dot ${isIntent ? 'intent' : ''}`} />
                        <div>
                          <div className="avc-tl-action">{eventLabel(e)}</div>
                          {(e.details?.unitName || e.data?.unitName) && (
                            <div className="avc-tl-unit">{e.details?.unitName || e.data?.unitName}</div>
                          )}
                          <div className="avc-tl-time">{timeAgo(e.timestamp)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══════ OUTREACH MODAL ═══════ */}
      {outreachModal && selected && (
        <div className="avc-modal-overlay" onClick={() => setOutreachModal(null)}>
          <div className="avc-modal" onClick={e => e.stopPropagation()}>
            <button className="avc-modal-close" onClick={() => setOutreachModal(null)}>{'\u2715'}</button>
            <h3>Outreach {'\u2014'} {selected.name}</h3>

            <div className="avc-modal-section">
              <div className="avc-modal-label">{'\u{1F4DE}'} Call Script</div>
              <div className="avc-modal-script">
                {'\u201C'}Hello {selected.name}, this is [Your Name] from [Project Name].
                I{'\u2019'}m following up on your private invitation.
                {selected.topUnit
                  ? ` We noticed your interest in ${selected.topUnit}. Would you be available for a private viewing this week?`
                  : ' We\u2019d love to arrange an exclusive tour at your convenience.'
                }{'\u201D'}
              </div>
            </div>

            <div className="avc-modal-section">
              <div className="avc-modal-label">{'\u2709\uFE0F'} Email Template</div>
              <div className="avc-modal-script">
                Dear {selected.name},
                {'\n\n'}Thank you for your interest{selected.topUnit ? ` in ${selected.topUnit}` : ''}.
                As a VIP member, we{'\u2019'}d love to arrange an exclusive tour at your convenience.
                {'\n\n'}Best regards,{'\n'}[Your Name]
              </div>
            </div>

            <div className="avc-modal-section">
              <div className="avc-modal-label">{'\u{1F4AC}'} WhatsApp</div>
              <div className="avc-modal-script">
                Hi {selected.name}, this is [Your Name] from [Project Name].
                {selected.topUnit
                  ? ` Following up on your interest in ${selected.topUnit} \u2014 would you like to schedule a private tour?`
                  : ' We\u2019d love to schedule a private viewing for you. When works best?'
                }
              </div>
            </div>

            <div className="avc-modal-guard">
              <strong>{'\u26A0\uFE0F'} Guardrail:</strong> Never mention tracking or analytics.
              Frame outreach as a follow-up to their private VIP invitation.
            </div>

            <div className="avc-outreach" style={{ justifyContent: 'center' }}>
              <a href={selected.phone ? `tel:${selected.phone}` : '#'} className="avc-outreach-btn red">{'\u{1F4DE}'} Call</a>
              <a href={selected.email ? `mailto:${selected.email}` : '#'} className="avc-outreach-btn blue">{'\u2709\uFE0F'} Email</a>
              <a
                href={selected.phone ? `https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="avc-outreach-btn green"
              >{'\u{1F4AC}'} WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
