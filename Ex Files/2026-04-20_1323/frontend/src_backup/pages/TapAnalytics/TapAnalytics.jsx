import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './TapAnalytics.css';

const AdminNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="ca-admin-nav" style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 2rem 0', display: 'flex', gap: '0.5rem' }}>
      <Link to="/admin/analytics" style={{ color: pathname === '/admin/analytics' ? '#fff' : 'rgba(255,255,255,0.5)', background: pathname === '/admin/analytics' ? 'rgba(230,57,70,0.2)' : 'transparent', textDecoration: 'none', fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: 8, transition: '0.2s' }}>Tap Analytics</Link>
      <Link to="/admin/cards" style={{ color: pathname === '/admin/cards' ? '#fff' : 'rgba(255,255,255,0.5)', background: pathname === '/admin/cards' ? 'rgba(230,57,70,0.2)' : 'transparent', textDecoration: 'none', fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: 8, transition: '0.2s' }}>Card Management</Link>
    </nav>
  );
};

const PIE_COLORS = ['#e63946', '#457b9d', '#2ec4b6'];

export default function TapAnalytics() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [taps, setTaps] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [cardsSnap, tapsSnap] = await Promise.all([
        getDocs(collection(db, 'smartcards')),
        getDocs(query(collection(db, 'taps'), orderBy('timestamp', 'desc'), limit(500))),
      ]);
      setCards(cardsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTaps(tapsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLastRefresh(new Date());
    } catch (err) {
      console.error('TapAnalytics fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchData, 30000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchData]);

  // Computed stats
  const now = Date.now();
  const tapsWithMs = taps.map(t => ({ ...t, ms: t.timestamp?.toMillis?.() || 0 }));
  const last24h = tapsWithMs.filter(t => now - t.ms < 86400000).length;
  const last7d = tapsWithMs.filter(t => now - t.ms < 604800000).length;
  const uniqueCards = new Set(taps.map(t => t.cardId)).size;

  // Chart: taps per day (last 7 days)
  const dayMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dayMap[key] = 0;
  }
  tapsWithMs.forEach(t => {
    if (now - t.ms < 604800000 && t.ms > 0) {
      const key = new Date(t.ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in dayMap) dayMap[key]++;
    }
  });
  const barData = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

  // Chart: device breakdown
  const deviceMap = { mobile: 0, desktop: 0, tablet: 0 };
  taps.forEach(t => { if (t.deviceType && deviceMap[t.deviceType] !== undefined) deviceMap[t.deviceType]++; });
  const total = taps.length || 1;
  const pieData = Object.entries(deviceMap)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }));

  // Card performance
  const sortedCards = [...cards].sort((a, b) => (b.totalTaps || 0) - (a.totalTaps || 0));

  // Filtered taps for selected card
  const displayTaps = selectedCard
    ? taps.filter(t => t.cardId === selectedCard)
    : taps;

  if (loading) {
    return <div className="ta-page"><div className="ta-loading"><div className="ta-spinner" /></div></div>;
  }

  return (
    <div className="ta-page">
      <AdminNav />
      {/* Header */}
      <div className="ta-header">
        <div>
          <h1 className="ta-title">Tap Analytics</h1>
          <p className="ta-subtitle">Real-time NFC card engagement data</p>
        </div>
        <div className="ta-header-actions">
          <label className="ta-auto-toggle">
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
            Auto-refresh
          </label>
          <button className={`ta-refresh-btn${refreshing ? ' spinning' : ''}`} onClick={fetchData} disabled={refreshing}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/><path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/></svg>
            Refresh
          </button>
          {lastRefresh && <span className="ta-last-refresh">Updated {lastRefresh.toLocaleTimeString()}</span>}
        </div>
      </div>

      <div className="ta-main">
        {taps.length === 0 ? (
          <div className="ta-empty">No taps recorded yet. Tap an NFC card to see data here.</div>
        ) : (
          <>
            {/* Stats */}
            <div className="ta-stats">
              <div className="ta-stat-card red">
                <div className="ta-stat-label">Total Taps</div>
                <div className="ta-stat-value red">{taps.length}</div>
              </div>
              <div className="ta-stat-card blue">
                <div className="ta-stat-label">Last 24 Hours</div>
                <div className="ta-stat-value blue">{last24h}</div>
              </div>
              <div className="ta-stat-card green">
                <div className="ta-stat-label">Last 7 Days</div>
                <div className="ta-stat-value green">{last7d}</div>
              </div>
              <div className="ta-stat-card amber">
                <div className="ta-stat-label">Unique Cards</div>
                <div className="ta-stat-value amber">{uniqueCards}</div>
              </div>
            </div>

            {/* Charts */}
            <div className="ta-charts-row">
              <div className="ta-chart-card">
                <div className="ta-chart-title">Taps Over Time (Last 7 Days)</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13 }} />
                    <Bar dataKey="count" fill="#e63946" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="ta-chart-card">
                <div className="ta-chart-title">Device Breakdown</div>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} label={({ name, pct }) => `${name} ${pct}%`}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="ta-empty">No device data</div>
                )}
              </div>
            </div>

            {/* Card Performance Table */}
            <div className="ta-section">
              <div className="ta-section-title">Card Performance</div>
              <div className="ta-table-wrap">
                <table className="ta-table">
                  <thead>
                    <tr>
                      <th>Card ID</th>
                      <th>Assigned To</th>
                      <th>Type</th>
                      <th>Total Taps</th>
                      <th>Last Tap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCards.map(c => (
                      <tr key={c.id} onClick={() => setSelectedCard(selectedCard === c.id ? null : c.id)} style={selectedCard === c.id ? { background: 'rgba(230,57,70,0.08)' } : undefined}>
                        <td style={{ fontWeight: 600 }}>{c.id}</td>
                        <td>{c.assignedName || <span style={{ color: 'var(--ta-text-muted)' }}>Unassigned</span>}</td>
                        <td><span className={`ta-badge ${c.cardType || ''}`}>{c.cardType || '—'}</span></td>
                        <td>{c.totalTaps || 0}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--ta-text-secondary)' }}>{c.lastTapAt?.toDate?.() ? c.lastTapAt.toDate().toLocaleString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Taps Feed */}
            <div className="ta-section">
              <div className="ta-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {selectedCard ? (
                  <>
                    <button className="ta-back" onClick={() => setSelectedCard(null)}>← All taps</button>
                    Taps for {selectedCard}
                  </>
                ) : 'Recent Taps'}
              </div>
              <div className="ta-feed">
                {displayTaps.slice(0, 20).map(t => (
                  <div className="ta-feed-item" key={t.id}>
                    <span className="ta-feed-time">{t.timestamp?.toDate?.() ? t.timestamp.toDate().toLocaleString() : '—'}</span>
                    <span className="ta-feed-card">{t.cardId}</span>
                    <span className="ta-feed-device">{t.deviceType || '—'}</span>
                    <span className="ta-feed-user">{t.assignedTo || ''}</span>
                  </div>
                ))}
                {displayTaps.length === 0 && <div className="ta-empty">No taps for this card yet.</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
