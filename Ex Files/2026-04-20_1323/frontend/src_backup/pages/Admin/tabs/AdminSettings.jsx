import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase';
import './AdminSettings.css';

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

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Scoring config
  const [scoring, setScoring] = useState({ ...DEFAULT_SCORING });

  // Terminology
  const [terminology, setTerminology] = useState({
    projectName: '',
    unitLabel: 'Unit',
    viewingLabel: 'Viewing',
    towerLabel: 'Tower',
    floorPlanLabel: 'Floor Plan',
  });

  // Admins
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Score preview
  const [previewScore, setPreviewScore] = useState(65);

  useEffect(() => {
    const load = async () => {
      try {
        const [scoringSnap, termSnap, adminsSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'scoring')),
          getDoc(doc(db, 'settings', 'terminology')),
          getDocs(collection(db, 'admins')),
        ]);

        if (scoringSnap.exists()) {
          setScoring(prev => ({ ...prev, ...scoringSnap.data() }));
        }
        if (termSnap.exists()) {
          setTerminology(prev => ({ ...prev, ...termSnap.data() }));
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

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'scoring'), scoring),
        setDoc(doc(db, 'settings', 'terminology'), terminology),
      ]);
      showToast('Settings saved successfully', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save settings', 'error');
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
      showToast('Admin added');
    } catch (err) {
      showToast('Failed to add admin', 'error');
    }
  };

  const removeAdmin = async (email) => {
    if (!window.confirm(`Remove ${email} from admins?`)) return;
    try {
      await deleteDoc(doc(db, 'admins', email));
      setAdmins(prev => prev.filter(a => a.email !== email));
      showToast('Admin removed');
    } catch (err) {
      showToast('Failed to remove admin', 'error');
    }
  };

  const clearBehaviors = async () => {
    if (!window.confirm('Delete ALL behavior tracking data? This cannot be undone.')) return;
    if (!window.confirm('Are you REALLY sure? All VIP scores and timelines will be lost.')) return;
    try {
      const snap = await getDocs(collection(db, 'behaviors'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      showToast('All behavior data cleared');
    } catch (err) {
      showToast('Failed to clear data', 'error');
    }
  };

  const resetScoring = () => {
    if (!window.confirm('Reset all scoring values to defaults?')) return;
    setScoring({ ...DEFAULT_SCORING });
    showToast('Scoring reset to defaults \u2014 click Save to apply');
  };

  const getPreviewLabel = (score) => {
    if (score >= scoring.hotThreshold) return { label: 'HOT', color: '#dc2626' };
    if (score >= scoring.warmThreshold) return { label: 'WARM', color: '#f59e0b' };
    if (score >= scoring.interestedThreshold) return { label: 'INTERESTED', color: '#3b82f6' };
    return { label: 'NEW', color: '#94a3b8' };
  };

  const ScoringRow = ({ label, field, max }) => (
    <div className="as-row">
      <div className="as-row-label">
        <span>{label}</span>
        {max && <span className="as-row-desc">max {max}</span>}
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
        <span className="as-pts">pts</span>
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

  if (loading) return <div className="as-loading"><div className="as-spinner" />Loading settings...</div>;

  const preview = getPreviewLabel(previewScore);

  return (
    <div className="as-page">
      {/* Toast */}
      {toast && (
        <div className={`as-toast ${toast.type}`}>
          {toast.type === 'success' ? '\u2713' : '\u2715'} {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="as-header">
        <div>
          <h1 className="as-title">Settings</h1>
          <p className="as-subtitle">Configure scoring, terminology, and admin access</p>
        </div>
        <button onClick={saveAll} disabled={saving} className="as-save-btn">
          {saving ? 'Saving...' : '\u2713 Save All'}
        </button>
      </div>

      {/* SCORING */}
      <div className="as-section">
        <div className="as-section-label">LEAD SCORING CONFIGURATION</div>
        <p className="as-section-desc">Configure how engagement is scored. Your sales team will see leads ranked by these scores.</p>

        <div className="as-card">
          <div className="as-card-title">Action Points</div>
          <ScoringRow label="Visit (per unique session)" field="visitPoints" max="25" />
          <ScoringRow label="Time in portal (per minute)" field="minutePoints" max="15" />
          <ScoringRow label="Unit viewed (per unique)" field="unitViewPoints" max="15" />
          <ScoringRow label="Pricing request" field="pricingRequestPoints" />
          <ScoringRow label="Brochure / plan download" field="brochureDownloadPoints" />
          <ScoringRow label="ROI calculator used" field="roiCalculatorPoints" />
          <ScoringRow label="Payment plan requested" field="paymentPlanPoints" />
          <ScoringRow label="Viewing booked" field="bookViewingPoints" />
          <ScoringRow label="Advisor contacted" field="contactAdvisorPoints" />
        </div>

        <div className="as-card" style={{ marginTop: 12 }}>
          <div className="as-card-title">Score Thresholds</div>
          <ThresholdRow label="HOT lead" field="hotThreshold" color="#dc2626" emoji={'\u{1F534}'} />
          <ThresholdRow label="WARM lead" field="warmThreshold" color="#f59e0b" emoji={'\u{1F7E1}'} />
          <ThresholdRow label="INTERESTED" field="interestedThreshold" color="#3b82f6" emoji={'\u{1F535}'} />
          <div className="as-threshold-note">Below INTERESTED threshold = NEW (gray)</div>

          {/* Preview */}
          <div className="as-preview">
            <span>Preview: Score </span>
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
        <div className="as-section-label">TERMINOLOGY</div>
        <p className="as-section-desc">Customize labels to match your project and industry.</p>

        <div className="as-card">
          <TermRow label="Project Name" field="projectName" placeholder="e.g. Vista Residences" />
          <TermRow label="Unit label" field="unitLabel" placeholder="Unit" />
          <TermRow label="Viewing label" field="viewingLabel" placeholder="Viewing" />
          <TermRow label="Tower label" field="towerLabel" placeholder="Tower" />
          <TermRow label="Floor Plan label" field="floorPlanLabel" placeholder="Floor Plan" />
        </div>
      </div>

      {/* DATA BOUNDARIES */}
      <div className="as-section">
        <div className="as-section-label">DATA BOUNDARIES</div>
        <div className="as-card">
          <div className="as-boundary">{'\u2713'} VIP tracking requires explicit invitation via physical NFC card</div>
          <div className="as-boundary">{'\u2713'} Standard tracking remains anonymous and cohort-based</div>
          <div className="as-boundary">{'\u2713'} Role-based access: sales reps see only assigned VIPs</div>
          <div className="as-boundary">{'\u2713'} Consent is established via physical card tap {'\u2014'} the ultimate opt-in</div>
        </div>
      </div>

      {/* ADMIN MANAGEMENT */}
      <div className="as-section">
        <div className="as-section-label">ADMIN ACCESS</div>
        <p className="as-section-desc">Users with admin access can view all data and manage cards.</p>

        <div className="as-card">
          {admins.map(a => (
            <div key={a.email} className="as-admin-row">
              <div className="as-admin-avatar">{a.email.charAt(0).toUpperCase()}</div>
              <div className="as-admin-info">
                <span className="as-admin-email">{a.email}</span>
                <span className="as-admin-role">{a.role || 'admin'}</span>
              </div>
              <button onClick={() => removeAdmin(a.email)} className="as-admin-remove">Remove</button>
            </div>
          ))}
          <div className="as-admin-add">
            <input
              type="email"
              placeholder="email@example.com"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAdmin()}
              className="as-admin-input"
            />
            <button onClick={addAdmin} className="as-admin-add-btn">+ Add Admin</button>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="as-section">
        <div className="as-section-label" style={{ color: '#dc2626' }}>DANGER ZONE</div>
        <div className="as-card danger">
          <div className="as-danger-row">
            <div>
              <div className="as-danger-title">Clear All Behavior Data</div>
              <div className="as-danger-desc">Delete all tracked events. VIP scores and timelines will be reset.</div>
            </div>
            <button onClick={clearBehaviors} className="as-danger-btn">Clear Data</button>
          </div>
          <div className="as-danger-row">
            <div>
              <div className="as-danger-title">Reset Scoring to Defaults</div>
              <div className="as-danger-desc">Revert all scoring weights and thresholds to factory settings.</div>
            </div>
            <button onClick={resetScoring} className="as-danger-btn">Reset Defaults</button>
          </div>
        </div>
      </div>
    </div>
  );
}
