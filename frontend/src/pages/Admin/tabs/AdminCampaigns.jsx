import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, query, where, orderBy, limit, Timestamp, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import './AdminCampaigns.css';

function timeAgo(ts) {
  if (!ts?.toDate) return 'Never';
  const diff = Date.now() - ts.toDate().getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : ts instanceof Date ? ts : new Date(ts.seconds ? ts.seconds * 1000 : ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const EMPTY_FORM = { id: '', name: '', client: '', description: '', totalCards: 0, startDate: '', endDate: '', sector: 'real_estate' };

export default function AdminCampaigns() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [cards, setCards] = useState([]);
  const [taps, setTaps] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [deactivateId, setDeactivateId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);
  const [expandedArchive, setExpandedArchive] = useState({});

  const showToast = (msg, isError) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const thirtyDaysAgo = Timestamp.fromDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      void thirtyDaysAgo;

      const [campSnap, cardsSnap, tapsSnap] = await Promise.all([
        getDocs(query(collection(db, 'campaigns'), limit(100))),
        getDocs(collection(db, 'smartcards')),
        getDocs(collection(db, 'taps')),
      ]);
      setCampaigns(campSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCards(cardsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTaps(tapsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('AdminCampaigns fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    if (modal) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modal]);

  const closeModal = () => { setModal(null); setFormError(''); setEditId(null); setDeactivateId(null); };
  const openCreate = () => { setForm(EMPTY_FORM); setModal('create'); };

  const openEdit = (camp) => {
    setForm({
      id: camp.id,
      name: camp.name || '',
      client: camp.client || '',
      description: camp.description || '',
      totalCards: camp.totalCards || 0,
      startDate: camp.startDate?.toDate ? camp.startDate.toDate().toISOString().split('T')[0] : '',
      endDate: camp.endDate?.toDate ? camp.endDate.toDate().toISOString().split('T')[0] : '',
      sector: camp.sector || 'real_estate',
    });
    setEditId(camp.id);
    setModal('edit');
  };

  const openDeactivate = (id) => { setDeactivateId(id); setModal('deactivate'); };

  const handleChange = (field, value) => {
    if (field === 'id') value = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm(f => ({ ...f, [field]: value }));
    setFormError('');
  };

  const handleCreate = async () => {
    if (!form.id.trim()) return setFormError('Campaign ID is required');
    if (!form.name.trim()) return setFormError('Campaign name is required');
    if (campaigns.some(c => c.id === form.id)) return setFormError('Campaign ID already exists');
    setSaving(true);
    try {
      await setDoc(doc(db, 'campaigns', form.id), {
        name: form.name,
        client: form.client || null,
        description: form.description || null,
        totalCards: parseInt(form.totalCards) || 0,
        activeCards: 0,
        startDate: form.startDate ? new Date(form.startDate) : serverTimestamp(),
        endDate: form.endDate ? new Date(form.endDate) : null,
        sector: form.sector || 'real_estate',
        status: 'active',
        createdAt: serverTimestamp(),
      });
      showToast(`Campaign "${form.name}" created`);
      closeModal();
      await fetchData();
    } catch (e) { setFormError(e.message); } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!form.name.trim()) return setFormError('Campaign name is required');
    setSaving(true);
    try {
      await updateDoc(doc(db, 'campaigns', editId), {
        name: form.name,
        client: form.client || null,
        description: form.description || null,
        totalCards: parseInt(form.totalCards) || 0,
        startDate: form.startDate ? new Date(form.startDate) : null,
        endDate: form.endDate ? new Date(form.endDate) : null,
        sector: form.sector || 'real_estate',
        updatedAt: serverTimestamp(),
      });
      showToast(`Campaign "${form.name}" updated`);
      closeModal();
      await fetchData();
    } catch (e) { setFormError(e.message); } finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'campaigns', deactivateId), {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });
      showToast('Campaign completed');
      closeModal();
      await fetchData();
    } catch (e) { showToast(e.message, true); } finally { setSaving(false); }
  };

  const getCampStats = (campId) => {
    const campCards = cards.filter(c => c.campaignId === campId);
    const campTaps = taps.filter(t => t.campaignId === campId);
    let lastTap = null;
    campTaps.forEach(t => {
      const ms = t.timestamp?.toMillis?.() || 0;
      if (!lastTap || ms > lastTap) lastTap = ms;
    });
    return {
      totalCards: campCards.length,
      activeCards: campCards.filter(c => c.status === 'active').length,
      totalTaps: campCards.reduce((sum, c) => sum + (c.totalTaps || 0), 0),
      lastTapTs: lastTap,
    };
  };

  const statusClass = (s) => s === 'active' ? 'acmp-status-active' : s === 'paused' ? 'acmp-status-paused' : 'acmp-status-completed';
  const sectorClass = (s) => s === 'automotive' ? 'acmp-sector-automotive' : 'acmp-sector-real_estate';
  const sectorLabel = (s) => s === 'automotive' ? 'Automotive' : 'Real Estate';

  const toggleArchive = (id) => setExpandedArchive(prev => ({ ...prev, [id]: !prev[id] }));

  const getTs = (ts) => {
    if (!ts) return 0;
    if (ts.toMillis) return ts.toMillis();
    if (ts.seconds) return ts.seconds * 1000;
    if (ts instanceof Date) return ts.getTime();
    return 0;
  };

  const activeCampaigns = campaigns
    .filter(c => c.status !== 'completed')
    .sort((a, b) => getTs(b.createdAt) - getTs(a.createdAt));

  const completedCampaigns = campaigns
    .filter(c => c.status === 'completed')
    .sort((a, b) => getTs(b.updatedAt || b.endDate || b.createdAt) - getTs(a.updatedAt || a.endDate || a.createdAt));

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;

  const campaignForm = () => (
    <>
      {modal === 'create' && (
        <div className="acmp-form-group">
          <label className="acmp-form-label">Campaign ID</label>
          <input className="acmp-form-input" value={form.id} onChange={e => handleChange('id', e.target.value)} placeholder="e.g. marina-tower-q2" />
        </div>
      )}
      <div className="acmp-form-group">
        <label className="acmp-form-label">Campaign Name</label>
        <input className="acmp-form-input" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Display name" />
      </div>
      <div className="acmp-form-group">
        <label className="acmp-form-label">Client</label>
        <input className="acmp-form-input" value={form.client} onChange={e => handleChange('client', e.target.value)} placeholder="Client name" />
      </div>
      <div className="acmp-form-group">
        <label className="acmp-form-label">Sector</label>
        <select className="acmp-form-input" value={form.sector} onChange={e => handleChange('sector', e.target.value)}>
          <option value="real_estate">Real Estate</option>
          <option value="automotive">Automotive</option>
        </select>
      </div>
      <div className="acmp-form-group">
        <label className="acmp-form-label">Description</label>
        <textarea className="acmp-form-input acmp-textarea" value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Campaign description (optional)" rows={3} />
      </div>
      <div className="acmp-form-row">
        <div className="acmp-form-group">
          <label className="acmp-form-label">Total Cards (planned)</label>
          <input className="acmp-form-input" type="number" value={form.totalCards} onChange={e => handleChange('totalCards', e.target.value)} />
        </div>
      </div>
      <div className="acmp-form-row">
        <div className="acmp-form-group">
          <label className="acmp-form-label">Start Date</label>
          <input className="acmp-form-input" type="date" value={form.startDate} onChange={e => handleChange('startDate', e.target.value)} />
        </div>
        <div className="acmp-form-group">
          <label className="acmp-form-label">End Date (optional)</label>
          <input className="acmp-form-input" type="date" value={form.endDate} onChange={e => handleChange('endDate', e.target.value)} />
        </div>
      </div>
    </>
  );

  return (
    <div className="acmp-page">
      <div className="acmp-header">
        <div>
          <h2 className="acmp-title">Campaigns</h2>
          <p className="acmp-subtitle">Manage your NFC card campaigns and track performance</p>
        </div>
        <button className="acmp-btn acmp-btn-primary" onClick={openCreate}>+ New Campaign</button>
      </div>

      {campaigns.length === 0 ? (
        <div className="acmp-empty">
          <div className="acmp-empty-icon">{'\u{1F680}'}</div>
          <p>No campaigns yet. Create your first campaign to start organizing your NFC cards.</p>
          <button className="acmp-btn acmp-btn-primary" onClick={openCreate} style={{ marginTop: '1rem' }}>+ Create Campaign</button>
        </div>
      ) : (
        <>
          {/* ── Active Campaigns ── */}
          {activeCampaigns.length > 0 && (
            <div className="acmp-list">
              {activeCampaigns.map(c => {
                const stats = getCampStats(c.id);
                return (
                  <div className="acmp-card" key={c.id}>
                    <div className="acmp-card-body">
                      <div className="acmp-card-top">
                        <div>
                          <h3 className="acmp-card-name">{c.name}</h3>
                          {c.client && <p className="acmp-card-client">Client: {c.client}</p>}
                          {c.description && <p className="acmp-card-desc">{c.description}</p>}
                        </div>
                        <div className="acmp-badges">
                          <span className={`acmp-sector-badge ${sectorClass(c.sector)}`}>{sectorLabel(c.sector)}</span>
                          <span className={`acmp-status ${statusClass(c.status)}`}>{c.status || 'active'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="acmp-stats">
                      <div className="acmp-stat">
                        <div className="acmp-stat-value">{stats.totalCards}</div>
                        <div className="acmp-stat-label">Total Cards</div>
                      </div>
                      <div className="acmp-stat">
                        <div className="acmp-stat-value acmp-val-planned">{c.totalCards || 0}</div>
                        <div className="acmp-stat-label">Planned</div>
                      </div>
                      <div className="acmp-stat">
                        <div className="acmp-stat-value acmp-val-taps">{stats.totalTaps}</div>
                        <div className="acmp-stat-label">Total Taps</div>
                      </div>
                      <div className="acmp-stat">
                        <div className="acmp-stat-value acmp-val-time">{stats.lastTapTs ? timeAgo({ toDate: () => new Date(stats.lastTapTs) }) : 'Never'}</div>
                        <div className="acmp-stat-label">Last Tap</div>
                      </div>
                    </div>
                    <div className="acmp-card-footer">
                      <div className="acmp-card-meta">
                        <span>Started: {formatDate(c.startDate)}</span>
                        {c.endDate && <span>Ends: {formatDate(c.endDate)}</span>}
                        <span>ID: {c.id}</span>
                      </div>
                      <div className="acmp-actions">
                        <button className="acmp-btn acmp-btn-view" onClick={() => navigate(`/admin/cards?campaign=${c.id}`)}>View Cards</button>
                        <button className="acmp-btn" onClick={() => openEdit(c)}>Edit</button>
                        <button className="acmp-btn acmp-btn-danger" onClick={() => openDeactivate(c.id)}>Complete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Completed Campaigns (Archive) ── */}
          {completedCampaigns.length > 0 && (
            <div className="acmp-archive">
              <div className="acmp-archive-header">
                <span className="acmp-archive-label">Completed ({completedCampaigns.length})</span>
                <div className="acmp-archive-line" />
              </div>
              <div className="acmp-archive-list">
                {completedCampaigns.map(c => {
                  const stats = getCampStats(c.id);
                  const isOpen = expandedArchive[c.id];
                  return (
                    <div className="acmp-arc-card" key={c.id}>
                      <div className="acmp-arc-row" onClick={() => toggleArchive(c.id)}>
                        <span className={`acmp-arc-chevron${isOpen ? ' acmp-arc-open' : ''}`}>&#9654;</span>
                        <span className="acmp-arc-name">{c.name}</span>
                        {c.client && <span className="acmp-arc-client">{c.client}</span>}
                        <span className="acmp-arc-date">{formatDate(c.updatedAt || c.endDate || c.createdAt)}</span>
                        <div className="acmp-arc-mini-stats">
                          <span>{stats.totalCards} cards</span>
                          <span>{stats.totalTaps} taps</span>
                        </div>
                        <div className="acmp-badges" style={{ marginLeft: 'auto' }}>
                          <span className={`acmp-sector-badge ${sectorClass(c.sector)}`}>{sectorLabel(c.sector)}</span>
                          <span className="acmp-status acmp-status-completed">completed</span>
                        </div>
                      </div>
                      {isOpen && (
                        <div className="acmp-arc-detail">
                          {c.description && <p className="acmp-arc-desc">{c.description}</p>}
                          <div className="acmp-stats acmp-stats-muted">
                            <div className="acmp-stat">
                              <div className="acmp-stat-value">{stats.totalCards}</div>
                              <div className="acmp-stat-label">Total Cards</div>
                            </div>
                            <div className="acmp-stat">
                              <div className="acmp-stat-value" style={{ color: '#9ca3af' }}>{c.totalCards || 0}</div>
                              <div className="acmp-stat-label">Planned</div>
                            </div>
                            <div className="acmp-stat">
                              <div className="acmp-stat-value" style={{ color: '#9ca3af' }}>{stats.totalTaps}</div>
                              <div className="acmp-stat-label">Total Taps</div>
                            </div>
                            <div className="acmp-stat">
                              <div className="acmp-stat-value acmp-val-time">{stats.lastTapTs ? timeAgo({ toDate: () => new Date(stats.lastTapTs) }) : 'Never'}</div>
                              <div className="acmp-stat-label">Last Tap</div>
                            </div>
                          </div>
                          <div className="acmp-arc-footer">
                            <div className="acmp-card-meta">
                              <span>Started: {formatDate(c.startDate)}</span>
                              {c.endDate && <span>Ended: {formatDate(c.endDate)}</span>}
                              <span>ID: {c.id}</span>
                            </div>
                            <div className="acmp-actions">
                              <button className="acmp-btn acmp-btn-view" onClick={(e) => { e.stopPropagation(); navigate(`/admin/cards?campaign=${c.id}`); }}>View Cards</button>
                              <button className="acmp-btn" onClick={(e) => { e.stopPropagation(); openEdit(c); }}>Edit</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Create / Edit Modal ── */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="acmp-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="acmp-modal">
            <h2 className="acmp-modal-title">{modal === 'create' ? 'Create Campaign' : `Edit: ${editId}`}</h2>
            {campaignForm()}
            {formError && <p className="acmp-form-error">{formError}</p>}
            <div className="acmp-modal-actions">
              <button className="acmp-btn" onClick={closeModal}>Cancel</button>
              <button className="acmp-btn acmp-btn-primary" onClick={modal === 'create' ? handleCreate : handleEdit} disabled={saving}>
                {saving ? 'Saving...' : modal === 'create' ? 'Create Campaign' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Deactivate Modal ── */}
      {modal === 'deactivate' && (
        <div className="acmp-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="acmp-modal">
            <h2 className="acmp-modal-title">Complete Campaign</h2>
            <p style={{ color: '#6b7280', margin: '1rem 0', lineHeight: 1.6 }}>
              Mark <strong style={{ color: '#111827' }}>{deactivateId}</strong> as completed? Cards will remain active but the campaign will be archived.
            </p>
            <div className="acmp-modal-actions">
              <button className="acmp-btn" onClick={closeModal}>Cancel</button>
              <button className="acmp-btn acmp-btn-danger" onClick={handleDeactivate} disabled={saving}>
                {saving ? 'Completing...' : 'Complete Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`acmp-toast${toast.isError ? ' acmp-toast-error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}
