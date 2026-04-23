import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { calculateEngagementScore, describeEvent, getCategoryIcon, getCategoryColor } from '../../../services/firestoreTracking';

function formatTime(ts) {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
  });
}

function formatDate(ts) {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function FunnelBar({ stage }) {
  const stages = ['browse', 'engage', 'intent', 'action'];
  const labels = ['Awareness', 'Interest', 'Intent', 'Action'];
  const colors = ['#9ca3af', '#0176d3', '#f59e0b', '#dc2626'];
  const activeIndex = stages.indexOf(stage);

  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
      {stages.map((s, i) => (
        <div key={s} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            height: 6,
            borderRadius: 3,
            background: i <= activeIndex ? colors[i] : '#e5e7eb',
            transition: 'background 0.3s',
          }} />
          <div style={{
            fontSize: 11,
            color: i <= activeIndex ? colors[i] : '#9ca3af',
            fontWeight: i === activeIndex ? 600 : 400,
            marginTop: 4,
          }}>
            {labels[i]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminVIPProfile() {
  const { cardId } = useParams();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState(null);
  const [events, setEvents] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [cardSnap, behavSnap] = await Promise.all([
        getDoc(doc(db, 'smartcards', cardId)),
        getDocs(query(collection(db, 'behaviors'), where('cardId', '==', cardId), orderBy('timestamp', 'asc'))),
      ]);
      if (cardSnap.exists()) setCard({ id: cardSnap.id, ...cardSnap.data() });
      setEvents(behavSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('VIPProfile fetch error:', err);
    } finally { setLoading(false); }
  }, [cardId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;

  // Scoring
  const scoreResult = calculateEngagementScore(events);

  // Stats
  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
  const exitEvents = events.filter(e => e.event === 'portal_exit');
  const totalDuration = exitEvents.reduce((s, e) => s + (e.details?.durationSeconds || e.data?.durationSeconds || 0), 0);
  const unitsViewed = new Set(
    events.filter(e => e.event === 'unit_view').map(e => e.details?.unitId || e.data?.unitId).filter(Boolean)
  ).size;
  const ctaClicks = events.filter(e => e.category === 'intent' || e.category === 'action').length;

  const visitorName = card?.assignedName || events.find(e => e.visitorName)?.visitorName || cardId;
  const visitorType = card?.cardType || events.find(e => e.visitorType)?.visitorType || '';

  const durationStr = totalDuration >= 3600
    ? `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m`
    : totalDuration >= 60
    ? `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`
    : `${totalDuration}s`;

  // Session breakdown
  const sessionMap = {};
  events.forEach(e => {
    const sid = e.sessionId || 'unknown';
    if (!sessionMap[sid]) sessionMap[sid] = { events: [], start: null, duration: 0, portal: e.portalName || '' };
    sessionMap[sid].events.push(e);
    if (e.event === 'portal_open') sessionMap[sid].start = e.timestamp;
    if (e.event === 'portal_exit') sessionMap[sid].duration = e.details?.durationSeconds || e.data?.durationSeconds || 0;
  });
  const sessions = Object.entries(sessionMap).reverse();

  // Most viewed units
  const unitViews = {};
  events.filter(e => e.event === 'unit_view').forEach(e => {
    const id = e.details?.unitId || e.data?.unitId;
    if (id) {
      if (!unitViews[id]) unitViews[id] = { count: 0, name: e.details?.unitName || e.data?.unitName || id };
      unitViews[id].count++;
    }
  });
  const topUnits = Object.entries(unitViews).sort((a, b) => b[1].count - a[1].count).slice(0, 5);

  // CTA Summary
  const ctaSummary = [
    { event: 'pricing_request', label: 'Pricing Requested', done: false, count: 0 },
    { event: 'book_viewing', label: 'Viewing Booked', done: false, count: 0 },
    { event: 'brochure_download', label: 'Brochure Downloaded', done: false, count: 0 },
    { event: 'floorplan_download', label: 'Floor Plan Downloaded', done: false, count: 0 },
    { event: 'payment_plan', label: 'Payment Plan Requested', done: false, count: 0 },
    { event: 'roi_calculator', label: 'ROI Calculator Used', done: false, count: 0 },
    { event: 'contact_advisor', label: 'Advisor Contacted', done: false, count: 0 },
  ];
  ctaSummary.forEach(cta => {
    cta.count = events.filter(e => e.event === cta.event).length;
    cta.done = cta.count > 0;
  });

  const sectionStyle = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
  const labelStyle = { fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' };

  return (
    <div style={{ maxWidth: 900 }}>
      <Link to="/admin/cards" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '1rem' }}>
        {'\u2190'} Back to Cards
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#111827' }}>{visitorName}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Card: {cardId}</span>
            {visitorType && <span style={{ padding: '0.15rem 0.5rem', borderRadius: 50, fontSize: '0.7rem', fontWeight: 500, background: 'rgba(1,118,211,0.1)', color: '#0176d3' }}>{visitorType.toUpperCase()}</span>}
            <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{card?.totalTaps || 0} taps</span>
          </div>
        </div>
        <button onClick={fetchData} style={{ padding: '0.4rem 1rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }}>Refresh</button>
      </div>

      {/* Engagement Score */}
      <div style={sectionStyle}>
        <div style={labelStyle}>Engagement Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 12 }}>
          <div style={{ flex: 1, height: 12, background: '#e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${scoreResult.score}%`, height: '100%', background: scoreResult.color, borderRadius: 6, transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: scoreResult.color }}>{scoreResult.score}</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: scoreResult.color, letterSpacing: '0.05em' }}>{scoreResult.label}</span>
        </div>
        <FunnelBar stage={scoreResult.stage} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        {[
          { val: uniqueSessions, lbl: 'Total Visits', color: '#0176d3' },
          { val: durationStr, lbl: 'Total Time', color: '#16a34a' },
          { val: unitsViewed, lbl: 'Units Viewed', color: '#f59e0b' },
          { val: ctaClicks, lbl: 'CTAs Clicked', color: '#e63946' },
        ].map((s, i) => (
          <div key={i} style={{ ...sectionStyle, marginBottom: 0, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Session Breakdown */}
      <div style={sectionStyle}>
        <div style={labelStyle}>Sessions ({sessions.length})</div>
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No sessions recorded yet.</div>
        ) : (
          sessions.map(([sid, sData]) => {
            const isOpen = expandedSession === sid;
            const highestCat = sData.events.some(e => e.category === 'action') ? 'action'
              : sData.events.some(e => e.category === 'intent') ? 'intent'
              : sData.events.some(e => e.category === 'engage') ? 'engage' : 'browse';
            return (
              <div key={sid} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <div
                  onClick={() => setExpandedSession(isOpen ? null : sid)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  <span style={{ color: '#9ca3af', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', fontSize: '0.7rem' }}>{'\u25B6'}</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', minWidth: 100 }}>{formatDate(sData.start)} {formatTime(sData.start)}</span>
                  <span style={{ color: getCategoryColor(highestCat), fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{highestCat}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{sData.events.length} events</span>
                  {sData.duration > 0 && <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{sData.duration}s</span>}
                  {sData.portal && <span style={{ color: '#9ca3af', fontSize: '0.7rem', marginLeft: 'auto' }}>{sData.portal}</span>}
                </div>
                {isOpen && (
                  <div style={{ paddingLeft: '1.5rem', paddingBottom: '0.5rem' }}>
                    {sData.events.map(ev => (
                      <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.35rem 0', fontSize: '0.82rem' }}>
                        <span style={{ fontSize: '0.9rem', width: 20, textAlign: 'center', flexShrink: 0 }}>{getCategoryIcon(ev.category)}</span>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: getCategoryColor(ev.category), flexShrink: 0, marginTop: 6 }} />
                        <span style={{ color: '#9ca3af', fontSize: '0.72rem', minWidth: 90, flexShrink: 0 }}>{formatTime(ev.timestamp)}</span>
                        <span style={{ color: '#374151', flex: 1 }}>{describeEvent(ev)}</span>
                        {ev.secondsInSession != null && <span style={{ color: '#d1d5db', fontSize: '0.7rem' }}>{ev.secondsInSession}s</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Most Viewed Units */}
      {topUnits.length > 0 && (
        <div style={sectionStyle}>
          <div style={labelStyle}>Most Viewed Units</div>
          {topUnits.map(([uid, info]) => (
            <div key={uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#0176d3' }}>{info.name}</span>
                <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>{info.count} views</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Summary */}
      <div style={sectionStyle}>
        <div style={labelStyle}>CTA Summary</div>
        {ctaSummary.map(cta => (
          <div key={cta.event} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: '0.85rem' }}>
            <span style={{ color: cta.done ? '#059669' : '#d1d5db' }}>
              {cta.done ? '\u2705' : '\u25CB'}
            </span>
            <span style={{ color: cta.done ? '#374151' : '#9ca3af' }}>
              {cta.label}{cta.count > 1 ? ` (${cta.count}x)` : cta.done ? '' : ' \u2014 not yet'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
