import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, doc, getDocs, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import '../../CardAdmin/CardAdmin.css';
import { useTranslation } from '../../../i18n';
import '../../../i18n/pages/admin';

const statusBadge = (s, t) => <span className={`ca-badge ca-badge-${s || 'unassigned'}`}>{s || t('unassigned')}</span>;
const typeBadge = (cardType) => <span className={`ca-badge ca-badge-${cardType || 'public'}`}>{cardType || '—'}</span>;

function relativeTime(ts, t) {
  if (!ts?.toDate) return t('lastTapNever');
  const diff = Date.now() - ts.toDate().getTime();
  if (diff < 60000) return t('justNow');
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const EMPTY_CARD = { cardId: '', redirectUrl: '', assignedTo: '', assignedName: '', assignedEmail: '', cardType: 'vip', campaignId: '', status: 'active' };
const EMPTY_CAMPAIGN = { id: '', name: '', client: '', totalCards: 0, startDate: '', endDate: '' };

export default function AdminCards() {
  const t = useTranslation('admin');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [filterCampaign, setFilterCampaign] = useState(searchParams.get('campaign') || 'all');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_CARD);
  const [campForm, setCampForm] = useState(EMPTY_CAMPAIGN);
  const [editId, setEditId] = useState(null);
  const [deactivateId, setDeactivateId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [schedules, setSchedules] = useState([]);

  const showToast = (msg, isError) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cardsSnap, campSnap] = await Promise.all([
        getDocs(collection(db, 'smartcards')),
        getDocs(collection(db, 'campaigns')),
      ]);
      setCards(cardsSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() || 0;
        const tb = b.createdAt?.toMillis?.() || 0;
        return tb - ta;
      }));
      setCampaigns(campSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('AdminCards fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    if (modal) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modal]);

  const closeModal = () => { setModal(null); setFormError(''); setEditId(null); setDeactivateId(null); };
  const openCreate = () => { setForm(EMPTY_CARD); setModal('create'); };
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
    setSchedules((card.scheduledRedirects || []).map(sr => ({
      url: sr.url || '',
      startDate: sr.startDate?.toDate ? sr.startDate.toDate().toISOString().slice(0, 16) : '',
      endDate: sr.endDate?.toDate ? sr.endDate.toDate().toISOString().slice(0, 16) : '',
    })));
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
    if (!form.cardId.trim()) return setFormError(t('cardIdRequired'));
    if (!form.redirectUrl.trim()) return setFormError(t('redirectUrlRequired'));
    if (cards.some(c => c.id === form.cardId)) return setFormError(t('cardIdExists'));
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
      showToast(t('cardCreatedMsg', { id: form.cardId }));
      closeModal();
      await fetchData();
    } catch (e) { setFormError(e.message); } finally { setSaving(false); }
  };

  const handleEditCard = async () => {
    if (!form.redirectUrl.trim()) return setFormError(t('redirectUrlRequired'));
    const validSchedules = schedules.filter(s => s.url && s.startDate && s.endDate);
    for (const s of validSchedules) {
      if (new Date(s.endDate) <= new Date(s.startDate)) return setFormError(t('scheduleEndAfterStart'));
    }
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
        scheduledRedirects: validSchedules.map(s => ({
          url: s.url,
          startDate: Timestamp.fromDate(new Date(s.startDate)),
          endDate: Timestamp.fromDate(new Date(s.endDate)),
        })),
        updatedAt: serverTimestamp(),
      });
      showToast(t('cardUpdatedMsg', { id: editId }));
      closeModal();
      await fetchData();
    } catch (e) { setFormError(e.message); } finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'smartcards', deactivateId), {
        status: 'inactive',
        updatedAt: serverTimestamp(),
      });
      showToast(t('cardDeactivatedMsg', { id: deactivateId }));
      closeModal();
      await fetchData();
    } catch (e) { showToast(e.message, true); } finally { setSaving(false); }
  };

  const handleCreateCampaign = async () => {
    if (!campForm.id.trim()) return setFormError(t('campaignIdRequired'));
    if (!campForm.name.trim()) return setFormError(t('campaignNameRequired'));
    setSaving(true);
    try {
      await setDoc(doc(db, 'campaigns', campForm.id), {
        name: campForm.name,
        client: campForm.client || null,
        totalCards: parseInt(campForm.totalCards) || 0,
        activeCards: 0,
        startDate: campForm.startDate ? new Date(campForm.startDate) : serverTimestamp(),
        endDate: campForm.endDate ? new Date(campForm.endDate) : null,
        status: 'active',
      });
      showToast(t('campaignCreated'));
      closeModal();
      await fetchData();
    } catch (e) { setFormError(e.message); } finally { setSaving(false); }
  };

  const copyUrl = (cardId) => {
    navigator.clipboard.writeText(`dynamicnfc.ca/c/${cardId}`).then(() => {
      showToast(t('urlCopied'));
    }).catch(() => { showToast(t('copyFailed'), true); });
  };

  const filtered = filterCampaign === 'all' ? cards : cards.filter(c => c.campaignId === filterCampaign);

  if (loading) return <div className="ca-loading"><div className="ca-spinner" /></div>;

  const cardForm = (isEdit) => (
    <>
      {!isEdit && (
        <div className="ca-form-group">
          <label className="ca-form-label">{t('cardId')}</label>
          <input className="ca-form-input" value={form.cardId} onChange={e => handleFormChange('cardId', e.target.value)} placeholder={t('cardIdExample')} />
        </div>
      )}
      <div className="ca-form-group">
          <label className="ca-form-label">{t('redirectUrl')}</label>
        <input className="ca-form-input" value={form.redirectUrl} onChange={e => handleFormChange('redirectUrl', e.target.value)} placeholder={t('redirectUrlExample')} />
      </div>
      <div className="ca-form-row">
        <div className="ca-form-group">
          <label className="ca-form-label">{t('assignedToId')}</label>
          <input className="ca-form-input" value={form.assignedTo} onChange={e => handleFormChange('assignedTo', e.target.value)} placeholder={t('personIdExample')} />
        </div>
        <div className="ca-form-group">
          <label className="ca-form-label">{t('assignedName')}</label>
          <input className="ca-form-input" value={form.assignedName} onChange={e => handleFormChange('assignedName', e.target.value)} placeholder={t('displayName')} />
        </div>
      </div>
      <div className="ca-form-group">
        <label className="ca-form-label">{t('assignedEmail')}</label>
        <input className="ca-form-input" value={form.assignedEmail} onChange={e => handleFormChange('assignedEmail', e.target.value)} placeholder={t('emailPlaceholder')} />
      </div>
      <div className="ca-form-row">
        <div className="ca-form-group">
          <label className="ca-form-label">{t('cardType')}</label>
          <select className="ca-form-input ca-select" value={form.cardType} onChange={e => handleFormChange('cardType', e.target.value)}>
            <option value="vip">{t('typeVip')}</option>
            <option value="family">{t('typeFamily')}</option>
            <option value="public">{t('typePublic')}</option>
          </select>
        </div>
        <div className="ca-form-group">
          <label className="ca-form-label">{t('status')}</label>
          <select className="ca-form-input ca-select" value={form.status} onChange={e => handleFormChange('status', e.target.value)}>
            <option value="active">{t('statusActive')}</option>
            <option value="unassigned">{t('unassigned')}</option>
            <option value="inactive">{t('statusInactive')}</option>
          </select>
        </div>
      </div>
      <div className="ca-form-group">
          <label className="ca-form-label">{t('campaign')}</label>
        <select className="ca-form-input ca-select" value={form.campaignId} onChange={e => handleFormChange('campaignId', e.target.value)}>
          <option value="">{t('none')}</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name || c.id}</option>)}
        </select>
      </div>
      {isEdit && (
        <div className="ca-form-group">
          <label className="ca-form-label">{t('scheduledRedirects')}</label>
          <p style={{ fontSize: '0.72rem', color: 'var(--ca-text-muted)', margin: '0 0 0.5rem' }}>{t('scheduledRedirectsDesc')}</p>
          {schedules.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.6rem', marginBottom: '0.5rem' }}>
              <div className="ca-form-group" style={{ marginBottom: '0.4rem' }}>
                <input className="ca-form-input" value={s.url} onChange={e => { const u = [...schedules]; u[i] = { ...u[i], url: e.target.value }; setSchedules(u); }} placeholder={t('scheduledRedirectUrlPeriod')} />
              </div>
              <div className="ca-form-row" style={{ gap: '0.4rem' }}>
                <div className="ca-form-group" style={{ flex: 1 }}>
                  <label className="ca-form-label" style={{ fontSize: '0.7rem' }}>{t('start')}</label>
                  <input className="ca-form-input" type="datetime-local" value={s.startDate} onChange={e => { const u = [...schedules]; u[i] = { ...u[i], startDate: e.target.value }; setSchedules(u); }} />
                </div>
                <div className="ca-form-group" style={{ flex: 1 }}>
                  <label className="ca-form-label" style={{ fontSize: '0.7rem' }}>{t('end')}</label>
                  <input className="ca-form-input" type="datetime-local" value={s.endDate} onChange={e => { const u = [...schedules]; u[i] = { ...u[i], endDate: e.target.value }; setSchedules(u); }} />
                </div>
                <button className="ca-btn ca-btn-danger ca-btn-sm" style={{ alignSelf: 'flex-end', marginBottom: 2 }} onClick={() => setSchedules(schedules.filter((_, j) => j !== i))}>{t('remove')}</button>
              </div>
            </div>
          ))}
          <button className="ca-btn ca-btn-ghost ca-btn-sm" onClick={() => setSchedules([...schedules, { url: '', startDate: '', endDate: '' }])}>+ {t('addSchedule')}</button>
        </div>
      )}
    </>
  );

  return (
    <div>
      <div className="ca-header">
        <div>
          <h1 className="ca-title">{t('cardManagementTitle')}</h1>
          <p className="ca-subtitle">{t('cardManagementSubtitle')}</p>
        </div>
        <div className="ca-header-actions">
          <button className="ca-btn ca-btn-red" onClick={openCreate}>+ {t('newCard')}</button>
          <button className="ca-btn ca-btn-blue" onClick={openCampaign}>+ {t('newCampaign')}</button>
        </div>
      </div>

      <div className="ca-main">
        <div className="ca-filter-bar">
          <select className="ca-select" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}>
            <option value="all">{t('allCampaigns')}</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name || c.id}</option>)}
          </select>
          <span className="ca-card-count">{t('showingCards', { filtered: filtered.length, total: cards.length })}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="ca-empty">{t('noCardsYet')}</div>
        ) : (
          <div className="ca-table-wrapper">
            <div className="ca-table-scroll">
              <table className="ca-table">
                <thead>
                  <tr>
                    <th>{t('cardId')}</th>
                    <th>{t('status')}</th>
                    <th>{t('assignedTo')}</th>
                    <th>{t('type')}</th>
                    <th>{t('campaign')}</th>
                    <th>{t('taps')}</th>
                    <th>{t('lastTapText')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id}>
                      <td><Link to={`/admin/cards/${c.id}`} className="ca-card-id" title={t('viewFullProfile')}>{c.id}</Link></td>
                      <td>{statusBadge(c.status, t)}</td>
                      <td>{c.assignedName || <span style={{ color: 'var(--ca-text-muted)' }}>—</span>}</td>
                      <td>{typeBadge(c.cardType)}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--ca-text-secondary)' }}>{c.campaignId || '—'}</td>
                      <td style={{ fontWeight: 600 }}>{c.totalTaps || 0}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--ca-text-secondary)' }}>{relativeTime(c.lastTapAt, t)}</td>
                      <td>
                        <div className="ca-actions">
                          <button className="ca-btn ca-btn-ghost ca-btn-sm" onClick={() => openEdit(c)}>{t('edit')}</button>
                          {c.status !== 'inactive' && (
                            <button className="ca-btn ca-btn-danger ca-btn-sm" onClick={() => openDeactivate(c.id)}>{t('deactivate')}</button>
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

      {modal === 'create' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">{t('createNewCard')}</h2>
            {cardForm(false)}
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>{t('cancel')}</button>
              <button className="ca-btn ca-btn-red" onClick={handleCreateCard} disabled={saving}>{saving ? t('creating') : t('createCard')}</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'edit' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">{t('editCardTitle', { id: editId })}</h2>
            {cardForm(true)}
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>{t('cancel')}</button>
              <button className="ca-btn ca-btn-red" onClick={handleEditCard} disabled={saving}>{saving ? t('saving') : t('saveChanges')}</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'campaign' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">{t('createCampaign')}</h2>
            <div className="ca-form-group">
              <label className="ca-form-label">{t('campaignId')}</label>
              <input className="ca-form-input" value={campForm.id} onChange={e => handleCampChange('id', e.target.value)} placeholder={t('campaignIdExample')} />
            </div>
            <div className="ca-form-group">
              <label className="ca-form-label">{t('campaignName')}</label>
              <input className="ca-form-input" value={campForm.name} onChange={e => handleCampChange('name', e.target.value)} placeholder={t('displayName')} />
            </div>
            <div className="ca-form-row">
              <div className="ca-form-group">
                <label className="ca-form-label">{t('client')}</label>
                <input className="ca-form-input" value={campForm.client} onChange={e => handleCampChange('client', e.target.value)} placeholder={t('clientName')} />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">{t('totalCards')}</label>
                <input className="ca-form-input" type="number" value={campForm.totalCards} onChange={e => handleCampChange('totalCards', e.target.value)} />
              </div>
            </div>
            <div className="ca-form-row">
              <div className="ca-form-group">
                <label className="ca-form-label">{t('startDate')}</label>
                <input className="ca-form-input" type="date" value={campForm.startDate} onChange={e => handleCampChange('startDate', e.target.value)} />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">{t('endDateOptional')}</label>
                <input className="ca-form-input" type="date" value={campForm.endDate} onChange={e => handleCampChange('endDate', e.target.value)} />
              </div>
            </div>
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>{t('cancel')}</button>
              <button className="ca-btn ca-btn-blue" onClick={handleCreateCampaign} disabled={saving}>{saving ? t('creating') : t('createCampaign')}</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'deactivate' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">{t('deactivateCardTitle')}</h2>
            <p className="ca-confirm-text">{t('deactivateCardConfirm', { id: deactivateId })}</p>
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>{t('cancel')}</button>
              <button className="ca-btn ca-btn-danger" onClick={handleDeactivate} disabled={saving}>{saving ? t('deactivating') : t('deactivate')}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`ca-toast${toast.isError ? ' ca-toast-error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}
