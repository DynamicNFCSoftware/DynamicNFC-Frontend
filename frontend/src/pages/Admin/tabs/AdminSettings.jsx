import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useAdmin } from '../../../hooks/useAdmin';
import { useLanguage } from '../../../i18n';
import './AdminSettings.css';
import { useTranslation } from '../../../i18n';
import '../../../i18n/pages/admin';

const DEFAULT_SCORING = {
  visitPoints: 5,
  minutePoints: 1,
  unitViewPoints: 3,
  pricingRequestPoints: 15,
  brochureDownloadPoints: 5,
  roiCalculatorPoints: 10,
  paymentPlanPoints: 15,
  bookViewingPoints: 25,
  contactAdvisorPoints: 20,
  hotThreshold: 80,
  warmThreshold: 50,
  interestedThreshold: 20,
};

const CLEANUP_TEXT = {
  en: {
    sectionLabel: 'Cleanup exempt accounts',
    sectionDesc: 'Accounts listed here are skipped by inactivity cleanup jobs.',
    uids: 'UIDs',
    emails: 'Emails',
    reason: 'Reason',
    noUids: 'No exempt UIDs yet',
    noEmails: 'No exempt emails yet',
    typeLabel: 'Type',
    typeUid: 'UID',
    typeEmail: 'Email',
    identifierLabel: 'Identifier',
    identifierPlaceholderUid: 'e.g. user_123abc',
    identifierPlaceholderEmail: 'e.g. owner@company.com',
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Why should this account be exempt?',
    add: 'Add',
    remove: 'Remove',
    loading: 'Loading cleanup exemptions...',
    saving: 'Saving...',
    saved: 'Cleanup exemptions updated',
    saveError: 'Failed to update cleanup exemptions',
    invalidIdentifier: 'Please enter a valid identifier',
    duplicateEntry: 'This identifier is already exempt',
    invalidUid: 'UID must be 20-32 alphanumeric characters',
    invalidEmail: 'Please enter a valid email address',
    invalidReason: 'Reason must be between 5 and 200 characters',
    ownAccountWarning: 'You are removing your own account!',
    notAuthorized: 'Admin authorization is required.',
    noExemptAccounts: 'No exempt accounts yet',
    emptyInfo: 'Exempt accounts are skipped during auto-cleanup',
    confirmTitle: 'Confirm remove',
    confirmMessage:
      'Bu hesabı exempt listesinden çıkarmak, 15 gün inaktifse silinmesine neden olur. Devam edilsin mi?',
    cancel: 'Cancel',
    addedByPrefix: 'by',
    unknownEditor: 'unknown',
  },
  ar: {
    sectionLabel: 'الحسابات المعفاة من التنظيف',
    sectionDesc: 'الحسابات هنا يتم تخطيها أثناء تنظيف عدم النشاط.',
    uids: 'معرّفات UID',
    emails: 'البريد الإلكتروني',
    reason: 'السبب',
    noUids: 'لا توجد UID معفاة بعد',
    noEmails: 'لا توجد إيميلات معفاة بعد',
    typeLabel: 'النوع',
    typeUid: 'UID',
    typeEmail: 'إيميل',
    identifierLabel: 'المعرف',
    identifierPlaceholderUid: 'مثال: user_123abc',
    identifierPlaceholderEmail: 'مثال: owner@company.com',
    reasonLabel: 'السبب',
    reasonPlaceholder: 'لماذا يجب إعفاء هذا الحساب؟',
    add: 'إضافة',
    remove: 'إزالة',
    loading: 'جار تحميل قائمة الإعفاء...',
    saving: 'جار الحفظ...',
    saved: 'تم تحديث إعفاءات التنظيف',
    saveError: 'فشل تحديث إعفاءات التنظيف',
    invalidIdentifier: 'أدخل معرفاً صالحاً',
    duplicateEntry: 'هذا المعرف معفى بالفعل',
    invalidUid: 'UID يجب أن يكون 20-32 حرفاً/رقماً',
    invalidEmail: 'يرجى إدخال بريد إلكتروني صالح',
    invalidReason: 'السبب يجب أن يكون بين 5 و200 حرف',
    ownAccountWarning: 'أنت تزيل حسابك الشخصي!',
    notAuthorized: 'يتطلب صلاحية مشرف.',
    noExemptAccounts: 'لا توجد حسابات معفاة بعد',
    emptyInfo: 'الحسابات المعفاة يتم تخطيها أثناء التنظيف التلقائي',
    confirmTitle: 'تأكيد الإزالة',
    confirmMessage:
      'إزالة هذا الحساب من قائمة الإعفاء قد تؤدي لحذفه إذا بقي غير نشط لمدة 15 يوماً. هل تريد المتابعة؟',
    cancel: 'إلغاء',
    addedByPrefix: 'بواسطة',
    unknownEditor: 'غير معروف',
  },
  tr: {
    sectionLabel: 'Cleanup muaf hesaplar',
    sectionDesc: 'Buradaki hesaplar inactivity cleanup sırasında atlanır.',
    uids: 'UID listesi',
    emails: 'Email listesi',
    reason: 'Neden',
    noUids: 'Henüz muaf UID yok',
    noEmails: 'Henüz muaf email yok',
    typeLabel: 'Tür',
    typeUid: 'UID',
    typeEmail: 'Email',
    identifierLabel: 'Identifier',
    identifierPlaceholderUid: 'örn: user_123abc',
    identifierPlaceholderEmail: 'örn: owner@company.com',
    reasonLabel: 'Neden',
    reasonPlaceholder: 'Bu hesap neden muaf olmalı?',
    add: 'Ekle',
    remove: 'Kaldır',
    loading: 'Cleanup muaf listesi yükleniyor...',
    saving: 'Kaydediliyor...',
    saved: 'Cleanup muaf listesi güncellendi',
    saveError: 'Cleanup muaf listesi güncellenemedi',
    invalidIdentifier: 'Geçerli bir identifier girin',
    duplicateEntry: 'Bu identifier zaten muaf',
    invalidUid: 'UID 20-32 karakter alfanumerik olmalı',
    invalidEmail: 'Geçerli bir email adresi girin',
    invalidReason: 'Neden 5 ile 200 karakter arasında olmalı',
    ownAccountWarning: 'Kendi hesabını çıkarıyorsun!',
    notAuthorized: 'Admin yetkisi gerekli.',
    noExemptAccounts: 'Henüz muaf hesap yok',
    emptyInfo: 'Muaf hesaplar otomatik cleanup sırasında atlanır',
    confirmTitle: 'Kaldırmayı onayla',
    confirmMessage:
      'Bu hesabı exempt listesinden çıkarmak, 15 gün inaktifse silinmesine neden olur. Devam edilsin mi?',
    cancel: 'Cancel',
    addedByPrefix: 'by',
    unknownEditor: 'unknown',
  },
};

const EMPTY_CLEANUP = { uids: [], emails: [], reason: {}, meta: {} };
const UID_REGEX = /^[a-zA-Z0-9]{20,32}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminSettings() {
  const t = useTranslation('admin');
  const { user, get2FAStatus, setup2FA, verify2FA } = useAuth();
  const { isAdmin, adminLoading } = useAdmin();
  const { lang } = useLanguage();
  const cleanupTx = CLEANUP_TEXT[lang] || CLEANUP_TEXT.en;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaSetup, setMfaSetup] = useState(null);
  const [mfaCode, setMfaCode] = useState('');

  // Scoring config
  const [scoring, setScoring] = useState({ ...DEFAULT_SCORING });

  // Terminology
  const [terminology, setTerminology] = useState({
    projectName: '',
    unitLabel: t('termUnitPlaceholder'),
    viewingLabel: t('termViewingPlaceholder'),
    towerLabel: t('termTowerPlaceholder'),
    floorPlanLabel: t('termFloorPlanPlaceholder'),
  });

  // Admins
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Score preview
  const [previewScore, setPreviewScore] = useState(65);
  const [cleanup, setCleanup] = useState({ ...EMPTY_CLEANUP });
  const [cleanupBusy, setCleanupBusy] = useState(false);
  const [cleanupStatus, setCleanupStatus] = useState(null);
  const [cleanupForm, setCleanupForm] = useState({ type: 'uid', identifier: '', reason: '' });
  const [removeModal, setRemoveModal] = useState({ open: false, type: '', identifier: '', isSelf: false });
  const removeTriggerRef = useRef(null);

  useEffect(() => {
    try { setMfaEnabled(get2FAStatus()); } catch {}
  }, [get2FAStatus]);

  useEffect(() => {
    const load = async () => {
      try {
        const [scoringSnap, termSnap, adminsSnap, cleanupSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'scoring')),
          getDoc(doc(db, 'settings', 'terminology')),
          getDocs(collection(db, 'admins')),
          getDoc(doc(db, 'settings', 'cleanup-exempt')),
        ]);

        if (scoringSnap.exists()) {
          setScoring(prev => ({ ...prev, ...scoringSnap.data() }));
        }
        if (termSnap.exists()) {
          setTerminology(prev => ({ ...prev, ...termSnap.data() }));
        }
        if (cleanupSnap.exists()) {
          const raw = cleanupSnap.data() || {};
          setCleanup({
            uids: Array.isArray(raw.uids) ? raw.uids.filter(Boolean) : [],
            emails: Array.isArray(raw.emails) ? raw.emails.filter(Boolean) : [],
            reason: raw.reason && typeof raw.reason === 'object' ? raw.reason : {},
            meta: raw.meta && typeof raw.meta === 'object' ? raw.meta : {},
          });
        } else {
          setCleanup({ ...EMPTY_CLEANUP });
        }
        setAdmins(adminsSnap.docs.map(d => ({ email: d.id, ...d.data() })));
      } catch (err) {
        console.error('Settings load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const normalizeCleanup = (payload) => {
    const uids = Array.from(new Set((payload?.uids || []).map(v => String(v || '').trim()).filter(Boolean)));
    const emails = Array.from(
      new Set((payload?.emails || []).map(v => String(v || '').trim().toLowerCase()).filter(Boolean))
    );
    const reason = payload?.reason && typeof payload.reason === 'object' ? { ...payload.reason } : {};
    const allIdentifiers = new Set([...uids, ...emails]);
    const rawMeta = payload?.meta && typeof payload.meta === 'object' ? payload.meta : {};
    const meta = {};
    Object.entries(rawMeta).forEach(([key, value]) => {
      if (!allIdentifiers.has(key) || !value || typeof value !== 'object') return;
      meta[key] = {
        addedBy: String(value.addedBy || ''),
        addedAt: value.addedAt || null,
      };
    });
    return { uids, emails, reason, meta };
  };

  const persistCleanup = async (nextCleanup) => {
    const normalized = normalizeCleanup(nextCleanup);
    setCleanupBusy(true);
    setCleanupStatus({ type: 'loading', message: cleanupTx.saving });
    try {
      await setDoc(doc(db, 'settings', 'cleanup-exempt'), normalized, { merge: false });
      setCleanup(normalized);
      setCleanupStatus({ type: 'success', message: cleanupTx.saved });
      setTimeout(() => setCleanupStatus(null), 2500);
    } catch (error) {
      console.error('Cleanup exempt save error:', error);
      setCleanupStatus({ type: 'error', message: cleanupTx.saveError });
      setTimeout(() => setCleanupStatus(null), 3000);
    } finally {
      setCleanupBusy(false);
    }
  };

  const formatRelativeTime = (value) => {
    if (!value) return '';
    const date = value?.toDate ? value.toDate() : new Date(value);
    if (!date || Number.isNaN(date.getTime())) return '';
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMin < 60) return lang === 'ar' ? `منذ ${diffMin} د` : lang === 'tr' ? `${diffMin} dk once` : `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return lang === 'ar' ? `منذ ${diffHour} س` : lang === 'tr' ? `${diffHour} sa once` : `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return lang === 'ar' ? `منذ ${diffDay} ي` : lang === 'tr' ? `${diffDay} gun once` : `${diffDay}d ago`;
  };

  const reasonTrimmed = String(cleanupForm.reason || '').trim();
  const identifierTrimmed = String(cleanupForm.identifier || '').trim();
  const normalizedIdentifier = cleanupForm.type === 'email' ? identifierTrimmed.toLowerCase() : identifierTrimmed;
  const isUidType = cleanupForm.type !== 'email';
  const identifierValid = isUidType ? UID_REGEX.test(normalizedIdentifier) : EMAIL_REGEX.test(normalizedIdentifier);
  const reasonValid = reasonTrimmed.length >= 5 && reasonTrimmed.length <= 200;
  const hasDuplicate = (isUidType ? cleanup.uids : cleanup.emails).includes(normalizedIdentifier);
  const addDisabled = cleanupBusy || !identifierValid || !reasonValid || hasDuplicate;

  const addCleanupEntry = async () => {
    const type = cleanupForm.type === 'email' ? 'email' : 'uid';
    const rawIdentifier = String(cleanupForm.identifier || '').trim();
    const identifier = type === 'email' ? rawIdentifier.toLowerCase() : rawIdentifier;
    const reasonText = String(cleanupForm.reason || '').trim();
    const isUid = type === 'uid';
    const validIdentifier = isUid ? UID_REGEX.test(identifier) : EMAIL_REGEX.test(identifier);
    if (!identifier || !validIdentifier) {
      setCleanupStatus({ type: 'error', message: isUid ? cleanupTx.invalidUid : cleanupTx.invalidEmail });
      setTimeout(() => setCleanupStatus(null), 2500);
      return;
    }
    if (reasonText.length < 5 || reasonText.length > 200) {
      setCleanupStatus({ type: 'error', message: cleanupTx.invalidReason });
      setTimeout(() => setCleanupStatus(null), 2500);
      return;
    }
    const existing = type === 'email' ? cleanup.emails : cleanup.uids;
    if (existing.includes(identifier)) {
      setCleanupStatus({ type: 'error', message: cleanupTx.duplicateEntry });
      setTimeout(() => setCleanupStatus(null), 2500);
      return;
    }

    const next = {
      ...cleanup,
      [type === 'email' ? 'emails' : 'uids']: [...existing, identifier],
      reason: {
        ...(cleanup.reason || {}),
        [identifier]: reasonText,
      },
      meta: {
        ...(cleanup.meta || {}),
        [identifier]: {
          addedBy: user?.email || '',
          addedAt: serverTimestamp(),
        },
      },
    };
    await persistCleanup(next);
    setCleanupForm({ type, identifier: '', reason: '' });
  };

  const removeCleanupEntry = async (type, identifier) => {
    const key = type === 'email' ? 'emails' : 'uids';
    const nextReason = { ...(cleanup.reason || {}) };
    const nextMeta = { ...(cleanup.meta || {}) };
    delete nextReason[identifier];
    delete nextMeta[identifier];
    const next = {
      ...cleanup,
      [key]: (cleanup[key] || []).filter(v => v !== identifier),
      reason: nextReason,
      meta: nextMeta,
    };
    await persistCleanup(next);
    closeRemoveModal();
  };

  const closeRemoveModal = () => {
    setRemoveModal({ open: false, type: '', identifier: '', isSelf: false });
    window.setTimeout(() => {
      if (removeTriggerRef.current && typeof removeTriggerRef.current.focus === 'function') {
        removeTriggerRef.current.focus();
      }
    }, 0);
  };

  const openRemoveModal = (type, identifier, triggerEl) => {
    removeTriggerRef.current = triggerEl || null;
    const isSelf = type === 'email' && String(identifier).toLowerCase() === String(user?.email || '').toLowerCase();
    setRemoveModal({ open: true, type, identifier, isSelf });
  };

  useEffect(() => {
    if (!removeModal.open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !cleanupBusy) {
        event.preventDefault();
        closeRemoveModal();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [removeModal.open, cleanupBusy]);

  useEffect(() => {
    if (!removeModal.open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [removeModal.open]);

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'scoring'), scoring),
        setDoc(doc(db, 'settings', 'terminology'), terminology),
      ]);
      showToast(t('settingsSaved'), 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast(t('settingsSaveFailed'), 'error');
    }
    setSaving(false);
  };

  const addAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) return;
    try {
      await setDoc(doc(db, 'admins', newAdminEmail), {
        role: 'admin',
        name: '',
        addedAt: new Date().toISOString(),
      });
      setAdmins(prev => [...prev, { email: newAdminEmail, role: 'admin' }]);
      setNewAdminEmail('');
      showToast(t('adminAdded'));
    } catch (err) {
      showToast(t('addAdminFailed'), 'error');
    }
  };

  const removeAdmin = async (email) => {
    if (!window.confirm(`${t('removeAdminConfirm')} ${email}`)) return;
    try {
      await deleteDoc(doc(db, 'admins', email));
      setAdmins(prev => prev.filter(a => a.email !== email));
      showToast(t('adminRemoved'));
    } catch (err) {
      showToast(t('removeAdminFailed'), 'error');
    }
  };

  const clearBehaviors = async () => {
    if (!window.confirm(t('clearBehaviorConfirm1'))) return;
    if (!window.confirm(t('clearBehaviorConfirm2'))) return;
    try {
      const snap = await getDocs(collection(db, 'behaviors'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      showToast(t('behaviorCleared'));
    } catch (err) {
      showToast(t('clearDataFailed'), 'error');
    }
  };

  const resetScoring = () => {
    if (!window.confirm(t('resetScoringConfirm'))) return;
    setScoring({ ...DEFAULT_SCORING });
    showToast(t('scoringResetPending'));
  };

  const getPreviewLabel = (score) => {
    if (score >= scoring.hotThreshold) return { label: t('riskHigh').toUpperCase(), color: '#dc2626' };
    if (score >= scoring.warmThreshold) return { label: t('riskMedium').toUpperCase(), color: '#f59e0b' };
    if (score >= scoring.interestedThreshold) return { label: t('scoreInterested'), color: '#3b82f6' };
    return { label: 'NEW', color: '#94a3b8' };
  };

  const ScoringRow = ({ label, field, max }) => (
    <div className="as-row">
      <div className="as-row-label">
        <span>{label}</span>
        {max && <span className="as-row-desc">{t('rowMax')} {max}</span>}
      </div>
      <div className="as-row-input">
        <input
          type="number"
          min="0"
          max="50"
          value={scoring[field]}
          onChange={(e) => setScoring(prev => ({ ...prev, [field]: parseInt(e.target.value) || 0 }))}
          className="as-num-input"
        />
        <span className="as-pts">{t('rowPts')}</span>
      </div>
    </div>
  );

  const ThresholdRow = ({ label, field, color, emoji }) => (
    <div className="as-threshold">
      <span className="as-threshold-emoji">{emoji}</span>
      <span className="as-threshold-label">{label}</span>
      <input
        type="range"
        min="5"
        max="100"
        value={scoring[field]}
        onChange={(e) => setScoring(prev => ({ ...prev, [field]: parseInt(e.target.value) }))}
        className="as-slider"
        style={{ accentColor: color }}
      />
      <span className="as-threshold-val" style={{ color }}>{scoring[field]}</span>
    </div>
  );

  const TermRow = ({ label, field, placeholder }) => (
    <div className="as-term-row">
      <label className="as-term-label">{label}</label>
      <input
        type="text"
        value={terminology[field]}
        onChange={(e) => setTerminology(prev => ({ ...prev, [field]: e.target.value }))}
        placeholder={placeholder}
        className="as-term-input"
      />
    </div>
  );

  if (loading || adminLoading) return <div className="as-loading"><div className="as-spinner" />{t('loadingSettings')}</div>;
  if (!isAdmin) return <div className="as-loading">{cleanupTx.notAuthorized}</div>;

  const preview = getPreviewLabel(previewScore);

  return (
    <div className="as-page">
      {/* Toast */}
      {toast && (
        <div className={`as-toast ${toast.type}`}>
          {toast.type === 'success' ? '\u2713' : '\u2715'} {toast.message}
        </div>
      )}

      {/* 2FA Security Section */}
      <div className="as-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="as-card-title">{t('twoFactorAuth')}</h3>
        <p style={{ fontSize: '.82rem', color: 'var(--as-text-secondary)', marginBottom: '1rem' }}>
          {t('twoFactorDesc')}
        </p>
        {mfaEnabled ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ecdc4' }} />
            <span style={{ fontSize: '.85rem', color: '#4ecdc4', fontWeight: 600 }}>{t('twoFactorEnabled')}</span>
          </div>
        ) : mfaSetup ? (
          <div>
            <p style={{ fontSize: '.8rem', color: 'var(--as-text-secondary)', marginBottom: '.75rem' }}>
              {t('twoFactorScan')}
            </p>
            <img src={mfaSetup.qrUrl} alt="2FA QR Code" style={{ width: 180, height: 180, borderRadius: 10, marginBottom: '.75rem', background: '#fff', padding: 8 }} />
            <div style={{ display: 'flex', gap: '.5rem', maxWidth: 300 }}>
              <input
                className="as-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={mfaCode}
                onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                style={{ fontFamily: 'monospace', letterSpacing: '.3em', textAlign: 'center' }}
              />
              <button className="as-btn as-btn-primary" disabled={mfaCode.length !== 6} onClick={async () => {
                try {
                  await verify2FA(mfaSetup.totpSecret, mfaCode);
                  setMfaEnabled(true);
                  setMfaSetup(null);
                  setMfaCode('');
                  setToast({ type: 'success', message: t('twoFactorEnabled') });
                  setTimeout(() => setToast(null), 3000);
                } catch (e) {
                  setToast({ type: 'error', message: t('invalidCode') });
                  setTimeout(() => setToast(null), 3000);
                }
              }}>{t('verify')}</button>
            </div>
          </div>
        ) : (
          <button className="as-btn as-btn-primary" onClick={async () => {
            try {
              const result = await setup2FA();
              setMfaSetup(result);
            } catch (e) {
              setToast({ type: 'error', message: t('twoFactorSetupFailed') });
              setTimeout(() => setToast(null), 3000);
            }
          }}>{t('enable2fa')}</button>
        )}
      </div>

      {/* Header */}
      <div className="as-header">
        <div>
          <h1 className="as-title">{t('settingsTitle')}</h1>
          <p className="as-subtitle">{t('settingsSubtitle')}</p>
        </div>
        <button onClick={saveAll} disabled={saving} className="as-save-btn">
          {saving ? t('saving') : `\u2713 ${t('saveAll')}`}
        </button>
      </div>

      {/* SCORING */}
      <div className="as-section">
        <div className="as-section-label">{t('leadScoringConfig')}</div>
        <p className="as-section-desc">{t('scoringConfigDesc')}</p>

        <div className="as-card">
          <div className="as-card-title">{t('actionPoints')}</div>
          <ScoringRow label={t('rowVisitUnique')} field="visitPoints" max="25" />
          <ScoringRow label={t('rowTimePortal')} field="minutePoints" max="15" />
          <ScoringRow label={t('rowUnitViewed')} field="unitViewPoints" max="15" />
          <ScoringRow label={t('rowPricingRequest')} field="pricingRequestPoints" />
          <ScoringRow label={t('rowBrochureDownload')} field="brochureDownloadPoints" />
          <ScoringRow label={t('rowRoiUsed')} field="roiCalculatorPoints" />
          <ScoringRow label={t('rowPaymentPlanRequested')} field="paymentPlanPoints" />
          <ScoringRow label={t('rowViewingBooked')} field="bookViewingPoints" />
          <ScoringRow label={t('rowAdvisorContacted')} field="contactAdvisorPoints" />
        </div>

        <div className="as-card" style={{ marginTop: 12 }}>
          <div className="as-card-title">{t('scoreThresholds')}</div>
          <ThresholdRow label={t('scoreHotLead')} field="hotThreshold" color="#dc2626" emoji={'\u{1F534}'} />
          <ThresholdRow label={t('scoreWarmLead')} field="warmThreshold" color="#f59e0b" emoji={'\u{1F7E1}'} />
          <ThresholdRow label={t('scoreInterested')} field="interestedThreshold" color="#3b82f6" emoji={'\u{1F535}'} />
          <div className="as-threshold-note">{t('belowInterested')}</div>

          {/* Preview */}
          <div className="as-preview">
            <span>{t('preview')}: {t('scoreShort')} </span>
            <input
              type="number"
              min="0"
              max="100"
              value={previewScore}
              onChange={(e) => setPreviewScore(parseInt(e.target.value) || 0)}
              className="as-preview-input"
            />
            <span> {'\u2192'} </span>
            <span className="as-preview-badge" style={{
              background: preview.color + '14',
              color: preview.color,
            }}>
              {preview.label}
            </span>
          </div>
        </div>
      </div>

      {/* TERMINOLOGY */}
      <div className="as-section">
        <div className="as-section-label">{t('terminology')}</div>
        <p className="as-section-desc">{t('terminologyDesc')}</p>

        <div className="as-card">
          <TermRow label={t('termProjectName')} field="projectName" placeholder={t('termProjectPlaceholder')} />
          <TermRow label={t('termUnitLabel')} field="unitLabel" placeholder={t('termUnitPlaceholder')} />
          <TermRow label={t('termViewingLabel')} field="viewingLabel" placeholder={t('termViewingPlaceholder')} />
          <TermRow label={t('termTowerLabel')} field="towerLabel" placeholder={t('termTowerPlaceholder')} />
          <TermRow label={t('termFloorPlanLabel')} field="floorPlanLabel" placeholder={t('termFloorPlanPlaceholder')} />
        </div>
      </div>

      {/* DATA BOUNDARIES */}
      <div className="as-section">
        <div className="as-section-label">{t('dataBoundaries')}</div>
        <div className="as-card">
          <div className="as-boundary">{'\u2713'} {t('boundaryVipInvite')}</div>
          <div className="as-boundary">{'\u2713'} {t('boundaryAnonCohort')}</div>
          <div className="as-boundary">{'\u2713'} {t('boundaryRoleBased')}</div>
          <div className="as-boundary">{'\u2713'} {t('boundaryConsent')}</div>
        </div>
      </div>

      {/* CLEANUP EXEMPT ACCOUNTS */}
      <div className="as-section">
        <div className="as-section-label">{cleanupTx.sectionLabel}</div>
        <p className="as-section-desc">{cleanupTx.sectionDesc}</p>

        <div className="as-card">
          {cleanup.uids.length === 0 && cleanup.emails.length === 0 ? (
            <div className="as-empty">
              <div className="as-empty-title">{cleanupTx.noExemptAccounts}</div>
              <div className="as-empty-desc">{cleanupTx.emptyInfo}</div>
            </div>
          ) : (
            <div className="as-exempt-lists">
              {cleanup.uids.length > 0 && (
                <div className="as-exempt-group">
                  <div className="as-exempt-group-label">{cleanupTx.uids}</div>
                  {cleanup.uids.map(uid => (
                    <div key={`uid-${uid}`} className="as-exempt-row">
                      <div className="as-exempt-info">
                        <span className="as-exempt-id">{uid}</span>
                        {cleanup.reason?.[uid] && (
                          <span className="as-exempt-reason">{cleanup.reason[uid]}</span>
                        )}
                        {cleanup.meta?.[uid]?.addedBy && (
                          <span className="as-exempt-meta">
                            {cleanupTx.addedByPrefix} {cleanup.meta[uid].addedBy}
                            {cleanup.meta[uid].addedAt ? ` · ${formatRelativeTime(cleanup.meta[uid].addedAt)}` : ''}
                          </span>
                        )}
                      </div>
                      <button
                        className="as-btn as-btn-ghost"
                        disabled={cleanupBusy}
                        onClick={(e) => openRemoveModal('uid', uid, e.currentTarget)}
                      >
                        {cleanupTx.remove}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cleanup.emails.length > 0 && (
                <div className="as-exempt-group">
                  <div className="as-exempt-group-label">{cleanupTx.emails}</div>
                  {cleanup.emails.map(email => (
                    <div key={`email-${email}`} className="as-exempt-row">
                      <div className="as-exempt-info">
                        <span className="as-exempt-id">{email}</span>
                        {cleanup.reason?.[email] && (
                          <span className="as-exempt-reason">{cleanup.reason[email]}</span>
                        )}
                        {cleanup.meta?.[email]?.addedBy && (
                          <span className="as-exempt-meta">
                            {cleanupTx.addedByPrefix} {cleanup.meta[email].addedBy}
                            {cleanup.meta[email].addedAt ? ` · ${formatRelativeTime(cleanup.meta[email].addedAt)}` : ''}
                          </span>
                        )}
                      </div>
                      <button
                        className="as-btn as-btn-ghost"
                        disabled={cleanupBusy}
                        onClick={(e) => openRemoveModal('email', email, e.currentTarget)}
                      >
                        {cleanupTx.remove}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="as-exempt-form">
            <div className="as-exempt-form-row">
              <label className="as-exempt-label">
                {cleanupTx.typeLabel}
                <select
                  className="as-input"
                  value={cleanupForm.type}
                  onChange={e => setCleanupForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="uid">{cleanupTx.typeUid}</option>
                  <option value="email">{cleanupTx.typeEmail}</option>
                </select>
              </label>

              <label className="as-exempt-label as-exempt-label-wide">
                {cleanupTx.identifierLabel}
                <input
                  className="as-input"
                  type="text"
                  placeholder={cleanupForm.type === 'email' ? cleanupTx.identifierPlaceholderEmail : cleanupTx.identifierPlaceholderUid}
                  value={cleanupForm.identifier}
                  onChange={e => setCleanupForm(prev => ({ ...prev, identifier: e.target.value }))}
                />
              </label>
            </div>

            <label className="as-exempt-label">
              {cleanupTx.reasonLabel}
              <input
                className="as-input"
                type="text"
                maxLength={200}
                placeholder={cleanupTx.reasonPlaceholder}
                value={cleanupForm.reason}
                onChange={e => setCleanupForm(prev => ({ ...prev, reason: e.target.value }))}
              />
            </label>

            <div className="as-exempt-actions">
              <button
                className="as-btn as-btn-primary"
                disabled={addDisabled}
                onClick={addCleanupEntry}
              >
                {cleanupTx.add}
              </button>
              {cleanupStatus && (
                <span className={`as-exempt-status as-exempt-status-${cleanupStatus.type}`}>
                  {cleanupStatus.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REMOVE CONFIRM MODAL */}
      {removeModal.open && (
        <div
          className="as-modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget && !cleanupBusy) closeRemoveModal(); }}
        >
          <div className="as-modal" role="dialog" aria-modal="true" aria-labelledby="as-modal-title">
            <h3 id="as-modal-title" className="as-modal-title">{cleanupTx.confirmTitle}</h3>
            <p className="as-modal-body">{cleanupTx.confirmMessage}</p>
            {removeModal.isSelf && (
              <p className="as-modal-warning">{cleanupTx.ownAccountWarning}</p>
            )}
            <div className="as-modal-actions">
              <button
                className="as-btn as-btn-ghost"
                disabled={cleanupBusy}
                onClick={closeRemoveModal}
              >
                {cleanupTx.cancel}
              </button>
              <button
                className="as-btn as-btn-primary"
                disabled={cleanupBusy}
                onClick={() => removeCleanupEntry(removeModal.type, removeModal.identifier)}
              >
                {cleanupTx.remove}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MANAGEMENT */}
      <div className="as-section">
        <div className="as-section-label">{t('adminAccess')}</div>
        <p className="as-section-desc">{t('adminAccessDesc')}</p>

        <div className="as-card">
          {admins.map(a => (
            <div key={a.email} className="as-admin-row">
              <div className="as-admin-avatar">{a.email.charAt(0).toUpperCase()}</div>
              <div className="as-admin-info">
                <span className="as-admin-email">{a.email}</span>
                <span className="as-admin-role">{a.role || t('adminRole')}</span>
              </div>
              <button onClick={() => removeAdmin(a.email)} className="as-admin-remove">{t('remove')}</button>
            </div>
          ))}

          <div className="as-admin-add-row">
            <input
              type="email"
              className="as-input"
              placeholder={t('emailPlaceholder')}
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
            />
            <button
              onClick={addAdmin}
              className="as-btn as-btn-primary"
              disabled={!newAdminEmail || !newAdminEmail.includes('@')}
            >
              {t('addAdmin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}