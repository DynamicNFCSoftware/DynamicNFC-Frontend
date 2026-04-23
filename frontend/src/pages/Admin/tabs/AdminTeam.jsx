import { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import '../../CardAdmin/CardAdmin.css';
import { useTranslation } from '../../../i18n';
import '../../../i18n/pages/admin';

const ROLES = (t) => ([
  { value: 'admin', label: t('roleAdmin'), desc: t('roleAdminDesc') },
  { value: 'editor', label: t('roleEditor'), desc: t('roleEditorDesc') },
  { value: 'viewer', label: t('roleViewer'), desc: t('roleViewerDesc') },
]);

const roleBadge = (role) => {
  const colors = { admin: '#e63946', editor: '#457b9d', viewer: '#6b7280' };
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 6,
      fontSize: '0.72rem', fontWeight: 600, color: '#fff',
      background: colors[role] || colors.viewer,
    }}>{role || 'viewer'}</span>
  );
};

export default function AdminTeam() {
  const t = useTranslation('admin');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ email: '', role: 'editor', name: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const showToast = (msg, isError) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'admins'));
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => {
        const order = { admin: 0, editor: 1, viewer: 2 };
        return (order[a.role] ?? 2) - (order[b.role] ?? 2);
      }));
    } catch (err) {
      console.error('Team fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    if (modal) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modal]);

  const closeModal = () => { setModal(null); setFormError(''); setRemoveTarget(null); };

  const openAdd = () => {
    setForm({ email: '', role: 'editor', name: '' });
    setModal('add');
  };

  const openEditRole = (member) => {
    setForm({ email: member.id, role: member.role || 'viewer', name: member.name || '' });
    setModal('edit');
  };

  const openRemove = (member) => {
    setRemoveTarget(member);
    setModal('remove');
  };

  const handleAdd = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) return setFormError(t('emailRequired'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormError(t('invalidEmail'));
    if (members.some(m => m.id === email)) return setFormError(t('memberExists'));
    setSaving(true);
    try {
      await setDoc(doc(db, 'admins', email), {
        role: form.role,
        name: form.name.trim() || null,
        addedAt: serverTimestamp(),
      });
      showToast(t('memberAddedAs', { email, role: form.role }));
      closeModal();
      await fetchMembers();
    } catch (e) { setFormError(e.message); } finally { setSaving(false); }
  };

  const handleEditRole = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'admins', form.email), {
        role: form.role,
        name: form.name.trim() || null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      showToast(t('memberUpdatedTo', { email: form.email, role: form.role }));
      closeModal();
      await fetchMembers();
    } catch (e) { setFormError(e.message); } finally { setSaving(false); }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'admins', removeTarget.id));
      showToast(t('memberRemovedFromTeam', { id: removeTarget.id }));
      closeModal();
      await fetchMembers();
    } catch (e) { showToast(e.message, true); } finally { setSaving(false); }
  };

  if (loading) return <div className="ca-loading"><div className="ca-spinner" /></div>;

  return (
    <div>
      <div className="ca-header">
        <div>
          <h1 className="ca-title">{t('teamManagement')}</h1>
          <p className="ca-subtitle">{t('teamManagementSubtitle')}</p>
        </div>
        <div className="ca-header-actions">
          <button className="ca-btn ca-btn-red" onClick={openAdd}>+ {t('addMember')}</button>
        </div>
      </div>

      <div className="ca-main">
        <span className="ca-card-count">
          {members.length === 1 ? t('teamMembersCount', { count: members.length }) : t('teamMembersCountPlural', { count: members.length })}
        </span>

        {members.length === 0 ? (
          <div className="ca-empty">{t('noTeamMembers')}</div>
        ) : (
          <div className="ca-table-wrapper">
            <div className="ca-table-scroll">
              <table className="ca-table">
                <thead>
                  <tr>
                    <th>{t('email')}</th>
                    <th>{t('name')}</th>
                    <th>{t('role')}</th>
                    <th>{t('added')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.id}</td>
                      <td>{m.name || <span style={{ color: 'var(--ca-text-muted)' }}>—</span>}</td>
                      <td>{roleBadge(m.role)}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--ca-text-secondary)' }}>
                        {m.addedAt?.toDate ? m.addedAt.toDate().toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="ca-actions">
                          <button className="ca-btn ca-btn-ghost ca-btn-sm" onClick={() => openEditRole(m)}>{t('edit')}</button>
                          <button className="ca-btn ca-btn-danger ca-btn-sm" onClick={() => openRemove(m)}>{t('remove')}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role descriptions */}
        <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--ca-text-primary, #fff)' }}>{t('roleDescriptions')}</h3>
          {ROLES(t).map(r => (
            <div key={r.value} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              {roleBadge(r.value)}
              <span style={{ fontSize: '0.78rem', color: 'var(--ca-text-secondary, #aaa)' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {modal === 'add' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">{t('addTeamMember')}</h2>
            <div className="ca-form-group">
              <label className="ca-form-label">{t('email')}</label>
              <input className="ca-form-input" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormError(''); }} placeholder={t('emailPlaceholder')} />
            </div>
            <div className="ca-form-group">
              <label className="ca-form-label">{t('displayNameOptional')}</label>
              <input className="ca-form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('displayNameExample')} />
            </div>
            <div className="ca-form-group">
              <label className="ca-form-label">{t('role')}</label>
              <select className="ca-form-input ca-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES(t).map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
              </select>
            </div>
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>{t('cancel')}</button>
              <button className="ca-btn ca-btn-red" onClick={handleAdd} disabled={saving}>{saving ? t('adding') : t('addMember')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {modal === 'edit' && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">{t('editMemberTitle', { email: form.email })}</h2>
            <div className="ca-form-group">
              <label className="ca-form-label">{t('displayName')}</label>
              <input className="ca-form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('displayName')} />
            </div>
            <div className="ca-form-group">
              <label className="ca-form-label">{t('role')}</label>
              <select className="ca-form-input ca-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES(t).map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
              </select>
            </div>
            {formError && <p className="ca-form-error">{formError}</p>}
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>{t('cancel')}</button>
              <button className="ca-btn ca-btn-red" onClick={handleEditRole} disabled={saving}>{saving ? t('saving') : t('saveChanges')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation */}
      {modal === 'remove' && removeTarget && (
        <div className="ca-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ca-modal">
            <h2 className="ca-modal-title">{t('removeTeamMember')}</h2>
            <p className="ca-confirm-text">{t('removeTeamMemberConfirm', { id: removeTarget.id })}</p>
            <div className="ca-modal-actions">
              <button className="ca-btn ca-btn-ghost" onClick={closeModal}>{t('cancel')}</button>
              <button className="ca-btn ca-btn-danger" onClick={handleRemove} disabled={saving}>{saving ? t('removing') : t('remove')}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`ca-toast${toast.isError ? ' ca-toast-error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}
