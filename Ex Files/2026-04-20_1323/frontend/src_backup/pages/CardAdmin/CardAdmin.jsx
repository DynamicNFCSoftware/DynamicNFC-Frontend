import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, doc, getDocs, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './CardAdmin.css';

const AdminNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="ca-admin-nav">
      <Link to="/admin/analytics" className={pathname === '/admin/analytics' ? 'ca-nav-active' : ''}>Tap Analytics</Link>
      <Link to="/admin/cards" className={pathname === '/admin/cards' ? 'ca-nav-active' : ''}>Card Management</Link>
    </nav>
  );
};

const statusBadge = (s) => <span className={`ca-badge ca-badge-${s || 'unassigned'}`}>{s || 'unassigned'}</span>;
const typeBadge = (t) => <span className={`ca-badge ca-badge-${t || 'public'}`}>{t || '—'}</span>;

function relativeTime(ts) {
  if (!ts?.toDate) return 'Never';
  const diff = Date.now() - ts.toDate().getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const EMPTY_CARD = { cardId: '', redirectUrl: '', assignedTo: '', assignedName: '', assignedEmail: '', cardType: 'vip', campaignId: '', status: 'active' };
const EMPTY_CAMPAIGN = { id: '', name: '', client: '', totalCards: 0, startDate: '', endDate: '' };

export default function CardAdmin() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [filterCampaign, setFilterCampaign] = useState('all');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'campaign' | 'deactivate'
  const [form, setForm] = useState(EMPTY_CARD);
  const [campForm, setCampForm] = useState(EMPTY_CAMPAIGN);
  const [editId, setEditId] = useState(null);
  const [deactivateId, setDeactivateId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const showToast = (msg, isError) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    console.log('CardAdmin: fetching data...');
    try {
      const [cardsSnap, campSnap] = await Promise.all([
        getDocs(collection(db, 'smartcards')),
        getDocs(collection(db, 'campaigns')),
      ]);
      console.log('CardAdmin: smartcards count:', cardsSnap.size, cardsSnap.docs.map(d => d.id));
      console.log('CardAdmin: campaigns count:', campSnap.size, campSnap.docs.map(d => d.id));
      setCards(cardsSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() || 0;
        const tb = b.createdAt?.toMillis?.() || 0;
        return tb - ta;
      }));
      setCampaigns(campSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('CardAdmin fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    if (modal) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modal]);

  const closeModal = () => { setModal(null); setFormError(''); setEditId(null); setDeactivateId(null); };

  const openCreate = () => {
    setForm(EMPTY_CARD);
    setModal('create');
  };

  const openEdit = (card) => {
    setForm({
      cardId: card.id,
      redirectUrl: card.redirectUrl || '',
      assignedTo: card.assignedTo || '',
      assignedName: card.assignedName || '',
      assignedEmail: card.assignedEmail || '',
      cardType: card.cardType || 'vip',
      campaignId: card.campaignId || '',
      status: card.status || 'active',
    });
    setEditId(card.id);
    setModal('edit');
  };

  const openDeactivate = (cardId) => { setDeactivateId(cardId); setModal('deactivate'); };
  const openCampaign = () => { setCampForm(EMPTY_CAMPAIGN); setModal('campaign'); };

  const handleFormChange = (field, value) => {
    if (field === 'cardId') value = value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    setForm(f => ({ ...f, [field]: value }));
    setFormError('');
  };

  const handleCampChange = (field, value) => {
    if (field === 'id') value = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setCampForm(f => ({ ...f, [field]: value }));
    setFormError('');
  };

  const handleCreateCard = async () => {
    if (!form.cardId.trim()) return setFormError('Card ID is required');
    if (!form.redirectUrl.trim()) return setFormError('Redirect URL is required');
    if (cards.some(c => c.id === form.cardId)) return setFormError('Card ID already exists');
    setSaving(true);
    try {
      await setDoc(doc(db, 'smartcards', form.cardId), {
        status: form.assignedTo ? form.status : 'unassigned',
        assignedTo: form.assignedTo || null,
        assignedName: form.assignedName || null,
        assignedEmail: form.assignedEmail || null,
        redirectUrl: form.redirectUrl,
        campaignId: form.campaignId || null,
        cardType: form.cardType || 'vip',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        totalTaps: 0,
        lastTapAt: null,
      });
      showToast(`Card ${form.cardId} created`);
      closeModal();
      await fetchData();
    } catch (e) {
      setFormError(e.message);
    } finally { setSaving(false); }
  };

  const handleEditCard = async () => {
    if (!form.redirectUrl.trim()) return setFormError('Redirect URL is required');
    setSaving(true);
    try {
      await updateDoc(doc(db, 'smartcards', editId), {
        status: form.assignedTo ? form.status : 'unassigned',
        assignedTo: form.assignedTo || null,
        assignedName: form.assignedName || null,
        assignedEmail: form.assignedEmail || null,
        redirectUrl: form.redirectUrl,
        campaignId: form.campaignId || null,
        cardType: form.cardType || 'vip',
        updatedAt: serverTimestamp(),
      });
      showToast(`Card ${editId} updated`);
      closeModal();
      await fetchData();
    } catch (e) {
      setFormError(e.message);
    } finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'smartcards', deactivateId), {
        status: 'inactive',
        updatedAt: serverTimestamp(),
      });
      showToast(`Card ${deactivateId} deactivated`);
      closeModal();
      await fetchData();
    } catch (e) {
      showToast(e.message, true);
    } finally { setSaving(false); }
  };

  const handleCreateCampaign = async () => {
    if (!campForm.id.trim()) return setFormError('Campaign ID is required');
    if (!campForm.name.trim()) return setFormError('Campaign name is required');
    setSaving(true);
    try {
      const data = {
        name: campForm.name,
        client: campForm.client || null,
        totalCards: parseInt(campForm.totalCards) || 0,
        activeCards: 0,
        startDate: campForm.startDate ? new Date(campForm.startDate) : serverTimestamp(),
        endDate: campForm.endDate ? new Date(campForm.endDate) : null,
        status: 'active',
      };
      await setDoc(doc(db, 'campaigns', campForm.id), data);
      showToast(`Campaign "${campForm.name}" created`);
      closeModal();
      await fetchData();
    } catch (e) {
      setFormError(e.message);
    } finally { setSaving(false); }
  };

  const copyUrl = (cardId) => {
    navigator.clipboard.writeText(`dynamicnfc.ca/c/${cardId}`).then(() => {
      showToast('URL copied!');
    }).catch(() => {
      showToast('Copy failed', true);
    });
  };

  const filtered = filterCampaign === 'all' ? cards : cards.filter(c => c.campaignId === filterCampaign);

  if (loading) return <div className="ca-page"><div className="ca-loading"><div className="ca-spinner" /></div></div>;

  const cardForm = (isEdit) => (
    <>
      {!isEdit && (
        <div className="ca-form-group">
          <label className="ca-form-label">Card ID</label>
          <input className="ca-form-input" value={form.cardId} onChange={e => handleFormChange('cardId', e.target.value)} placeholder="e.g. VISTA005" />
        </div>
      )}
      <div className="ca-form-group">
        <label className="ca-form-label">Redirect URL</label>
        <input className="ca-form-input" value={form.redirectUrl} onChange={e => handleFormChange('redirectUrl', e.target.value)} placeholder="https://..." />
      </div>
      <div className="ca-form-row">
        <div className="ca-form-group">
          <label className="ca-form-label">Assigned To (ID)</label>
          <input className="ca-form-input" value={form.assignedTo} onChange={e => handleFormChange('assignedTo', e.target.value)} placeholder="person-id" />
        </div>
        <div className="ca-form-group">
          <label className="ca-form-label">Assigned Name</label>
          <input className="ca-form-input" value={form.assignedName} onChange={e => handleFormChange('assignedName', e.target.value)} placeholder="Display name" />
        </div>
      </div>
      <div className="ca-form-group">
        <label className="ca-form-label">Assigned Email</label>
        <input className="ca-form-input" value={form.assignedEmail} onChange={e => handleFormChange('assignedEmail', e.target.value)} placeholder="email@example.com" />
      </div>
      <div className="ca-form-row">
        <div className="ca-form-group">
          <label className="ca-form-label">Card Type</label>
          <select className="ca-form-input ca-select" value={form.cardType} onChange={e => handleFormChange('cardType', e.target.value)}>
            <option value="vip">VIP</option>
            <option value="family">Family</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div className="ca-form-group">
          <label className="ca-form-label">Status</label>
          <select className="ca-form-input ca-select" value={form.status} onChange={e => handleFormChange('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="unassigned">Unassigned</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="ca-form-group">
        <label className="ca-form-label">Campaign</label>
        <select className="ca-form-input ca-select" value={form.campaignId} onChange={e => handleFormChange('campaignId', e.target.value)}>
          <option value="">None</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name || c.id}</option>)}
        </select>
      </div>
    </>
  );

  return (
    <div className="ca-page">
      <AdminNav />

      <div className="ca-header">
        <div>
          <h1 className="ca-title">Card Management</h1>
          <p className="ca-subtitle">Create, assign, and manage NFC smart cards</p>
        </div>
        <div className="ca-header-actions">
          <button className="ca-btn ca-btn-red" onClick={openCreate}>+ New Card</button>
          <button className="ca-btn ca-btn-blue" onClick={openCampaign}>+ New Campaign</button>
        </div>
      </div>

      <div className="ca-main">
        <div className="ca-filter-bar">
          <select className="ca-select" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}>
            <option value="all">All Campaigns</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name || c.id}</option>)}
          </select>
          <span className="ca-card-count">Showing {filtered.length} of {cards.length} cards</span>
        </div>

        {filtered.length === 0 ? (
          <div className="ca-empty">No cards yet. Click "New Card" to create one.</div>
        ) : (
          <div className="ca-table-wrapper">
            <div className="ca-table-scroll">
              <table className="ca-table">
                <thead>
                  <tr>
                    <th>Card ID</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Type</th>
                    <th>Campaign</th>
                    <th>Taps</th>
                    <th>Last Tap</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id}>
                      <td><span className="ca-card-id" onClick={() => copyUrl(c.id)} title="Click to copy URL">{c.id}</span></td>
                      <td>{statusBadge(c.status)}</td>
                      <td>{c.assignedName || <span style={{ color: 'var(--ca-text-muted)' }}>—</span>}</td>
                      <td>{typeBadge(c.cardType)}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--ca-text-secondary)' }}>{c.campaignId || '—'}</td>
                      <td style={{ fontWeight: 600 }}>{c.totalTaps || 0}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--ca-text-secondary)' }}>{relativeTime(c.lastTapAt)}</td>
                      <td>
                        <div className="ca-actions">
                          <button className="ca-btn ca-btn-ghost ca-btn-sm" onClick={() => openEdit(c)}>Edit</button>
                          {c.status !== 'inactive' && (
                            <button className="ca-btn ca-btn-danger ca-btn-sm" onClick={() => openDeactivate(c.id)}>Deactivate</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Card Modal */}
      {modal === 'create' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">Create New Card</h2>
            {cardForm(false)}
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="ca-btn ca-btn-red" onClick={handleCreateCard} disabled={saving}>{saving ? 'Creating...' : 'Create Card'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {modal === 'edit' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">Edit Card: {editId}</h2>
            {cardForm(true)}
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="ca-btn ca-btn-red" onClick={handleEditCard} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {modal === 'campaign' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">Create Campaign</h2>
            <div className="ca-form-group">
              <label className="ca-form-label">Campaign ID</label>
              <input className="ca-form-input" value={campForm.id} onChange={e => handleCampChange('id', e.target.value)} placeholder="e.g. marina-tower-q2" />
            </div>
            <div className="ca-form-group">
              <label className="ca-form-label">Campaign Name</label>
              <input className="ca-form-input" value={campForm.name} onChange={e => handleCampChange('name', e.target.value)} placeholder="Display name" />
            </div>
            <div className="ca-form-row">
              <div className="ca-form-group">
                <label className="ca-form-label">Client</label>
                <input className="ca-form-input" value={campForm.client} onChange={e => handleCampChange('client', e.target.value)} placeholder="Client name" />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">Total Cards</label>
                <input className="ca-form-input" type="number" value={campForm.totalCards} onChange={e => handleCampChange('totalCards', e.target.value)} />
              </div>
            </div>
            <div className="ca-form-row">
              <div className="ca-form-group">
                <label className="ca-form-label">Start Date</label>
                <input className="ca-form-input" type="date" value={campForm.startDate} onChange={e => handleCampChange('startDate', e.target.value)} />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">End Date (optional)</label>
                <input className="ca-form-input" type="date" value={campForm.endDate} onChange={e => handleCampChange('endDate', e.target.value)} />
              </div>
            </div>
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="ca-btn ca-btn-blue" onClick={handleCreateCampaign} disabled={saving}>{saving ? 'Creating...' : 'Create Campaign'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirm */}
      {modal === 'deactivate' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">Deactivate Card</h2>
            <p className="ca-confirm-text">Deactivate <span className="ca-confirm-id">{deactivateId}</span>? This card will stop redirecting.</p>
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="ca-btn ca-btn-danger" onClick={handleDeactivate} disabled={saving}>{saving ? 'Deactivating...' : 'Deactivate'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`ca-toast${toast.isError ? ' ca-toast-error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}


