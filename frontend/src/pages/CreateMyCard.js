import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../api';
import { FiGlobe, FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin, FiUser, FiBriefcase, FiAward, FiHome } from 'react-icons/fi';

export default function CreateMyCard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', jobTitle: '', department: '', companyName: '', email: '', phone: '', companyUrl: '', address: '', backgroundColor: '#FFFFFF'
  });
  const [errors, setErrors] = useState({});
  const [socialLinks, setSocialLinks] = useState([]);
  const [files, setFiles] = useState({ companyLogo: null, profilePicture: null, coverPhoto: null });
  const [preview, setPreview] = useState(null);
  // object URLs for immediate file preview (revoked on change)
  const [objectUrls, setObjectUrls] = useState({ companyLogo: null, profilePicture: null, coverPhoto: null });
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getUser(id)
      .then(u => {
        if (!u) return;
        setForm({
          name: u.name || '', jobTitle: u.jobTitle || '', department: u.department || '', companyName: u.companyName || '',
          email: u.email || '', phone: u.phone || '', companyUrl: u.companyUrl || '', address: u.address || '', backgroundColor: u.backgroundColor || '#FFFFFF'
        });
        setPreview(u);
  if (u.socialLinks && Array.isArray(u.socialLinks)) setSocialLinks(u.socialLinks || []);
      })
    .catch(err => console.error('load failed', err))
    .finally(() => setLoading(false));
  }, [id]);

  // input change handlers
  function onChange(e){
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // live-validate the changed field
    validateField(name, value);
  }

  function onFileChange(e){
    const { name, files: f } = e.target;
    setFiles(prev => ({ ...prev, [name]: f && f[0] }));
  }

  // Create object URLs for selected files so the preview updates immediately
  useEffect(() => {
    const newUrls = {
      companyLogo: files.companyLogo ? URL.createObjectURL(files.companyLogo) : null,
      profilePicture: files.profilePicture ? URL.createObjectURL(files.profilePicture) : null,
      coverPhoto: files.coverPhoto ? URL.createObjectURL(files.coverPhoto) : null,
    };

    setObjectUrls(prev => {
      // revoke previous urls
      try {
        if (prev) {
          Object.values(prev).forEach(u => { if (u) URL.revokeObjectURL(u); });
        }
      } catch (e) {
        // ignore
      }
      return newUrls;
    });

    return () => {
      // cleanup newly created urls when files change/unmount
      try {
        Object.values(newUrls).forEach(u => { if (u) URL.revokeObjectURL(u); });
      } catch (e) {}
    };
  }, [files.companyLogo, files.profilePicture, files.coverPhoto]);

  // validation helpers
  function validateField(name, value) {
    const v = value == null ? '' : String(value).trim();
    setErrors(prev => {
      const copy = { ...prev };
      if (name === 'email') {
        if (v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) copy.email = 'Please enter a valid email';
        else delete copy.email;
      } else if (name === 'companyUrl') {
        if (v && !/^(https?:\/\/)?[\w.-]+(\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!$&'()*+,;=.]+$/.test(v)) copy.companyUrl = 'Please enter a valid URL (include https://)';
        else delete copy.companyUrl;
      } else if (name === 'phone') {
        if (v && !/^[+\d][\d ()-]{4,}$/.test(v)) copy.phone = 'Please enter a valid phone number';
        else delete copy.phone;
      } else {
        delete copy[name];
      }
      return copy;
    });
  }

  function validateAll() {
    const e = {};
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (form.companyUrl && !/^(https?:\/\/)?[\w.-]+(\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!$&'()*+,;=.]+$/.test(form.companyUrl)) e.companyUrl = 'Please enter a valid URL';
    if (form.phone && !/^[+\d][\d ()-]{4,}$/.test(form.phone)) e.phone = 'Please enter a valid phone number';

    return e;
  }

  // Keep errors in sync as the user types or edits social links
  useEffect(() => {
    const current = validateAll();
    // Only update state when it actually differs to avoid re-renders
    const same = JSON.stringify(current) === JSON.stringify(errors);
    if (!same) setErrors(current);
  // watch the specific fields that affect validation
  }, [form.email, form.phone, form.companyUrl, socialLinks]);

  // Social links helpers
  function updateSocialLink(idx, field, value){
    setSocialLinks(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }
  function addSocialLink(){
    setSocialLinks(prev => ([ ...prev, { platform: 'website', link: '' } ]));
  }
  function removeSocialLink(idx){
    setSocialLinks(prev => prev.filter((_, i) => i !== idx));
  }
  
  // Helper function to ensure URLs have proper protocol
  function formatSocialUrl(url) {
    if (!url) return url;
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    return `https://${trimmedUrl}`;
  }

  // Field icons used across form and preview
  const icons = {
    website: <FiGlobe size={18} color="#3B82F6" />,
    linkedin: <FiLinkedin size={18} color="#0A66C2" />,
    twitter: <FiTwitter size={18} color="#1DA1F2" />,
    facebook: <FiFacebook size={18} color="#1877F2" />,
  instagram: <FiInstagram size={18} color="#E1306C" />,
    companyLogo: <FiHome size={18} color="#F76B8A" />
  };

  const fieldIcons = {
    name: <FiUser size={18} color="#FF6B6B" />,
    jobTitle: <FiBriefcase size={18} color="#FFB86B" />,
    department: <FiGlobe size={18} color="#6B7280" />,
  companyName: <FiHome size={18} color="#F76B8A" />,
    accreditations: <FiAward size={18} color="#E6A23C" />,
    headline: <FiGlobe size={18} color="#6B7280" />,
    general: <FiGlobe size={18} color="#6B7280" />,
    email: <FiMail size={18} color="#FF6B6B" />,
    phone: <FiPhone size={18} color="#FF8C42" />,
    companyUrl: <FiGlobe size={18} color="#7F56D9" />,
    link: <FiGlobe size={18} color="#3B82F6" />,
    address: <FiMapPin size={18} color="#F43F5E" />
  };

  async function onSave(e){
    e.preventDefault();
    setLoading(true);
    // final validation before submit
    const finalErrors = validateAll();
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setLoading(false);
      // focus the top of the form so user sees errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try{
      let socialStr = '';
      if (socialLinks && Array.isArray(socialLinks) && socialLinks.length > 0){
        // basic validation: ensure each row has a link
        const cleaned = socialLinks.map(s => ({ platform: s.platform || 'website', link: (s.link || '').trim() })).filter(s => s.link);
        if (cleaned.length > 0) socialStr = JSON.stringify(cleaned);
      }

      const fd = new FormData();
      // Append only non-empty scalar fields so we don't send empty strings
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && String(v).trim() !== '') {
          fd.append(k, v);
        }
      });

      // Append files only when the user selected them
      if (files.companyLogo) fd.append('companyLogo', files.companyLogo);
      if (files.profilePicture) fd.append('profilePicture', files.profilePicture);
      if (files.coverPhoto) fd.append('coverPhoto', files.coverPhoto);

  // Append social links only when present and valid
  if (socialStr) fd.append('socialLinks', socialStr);

      // Debug: log FormData entries so we can inspect what the browser will send
      console.log('DEBUG - Current form state:', form);
      try {
        const entries = [];
        for (const pair of fd.entries()) {
          // pair[1] can be a File — stringify small details
          const value = pair[1] instanceof File ? `[File:${pair[1].name}]` : pair[1];
          entries.push([pair[0], value]);
        }
        console.debug('FormData entries before submit:', entries);
        console.log('DEBUG - backgroundColor in FormData:', entries.find(e => e[0] === 'backgroundColor'));
      } catch (logErr) {
        console.debug('Could not enumerate FormData entries', logErr);
      }

      const saved = id ? await updateUser(id, fd) : await createUser(fd);
      setPreview(saved);
      if (saved && (saved.hashId || saved.id)) {
        // Öncelikle hashId kullan, yoksa ID'ye fallback yap
        const cardId = saved.hashId || saved.id;
        navigate(`/create-my-card/${cardId}`, { replace: true });
      }
    }catch(err){
      console.error('save failed', err);
      // Extra diagnostics: log response status, headers and body when available
      if (err && err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        console.error('Response data:', err.response.data);
      }
      const headerMsg = err?.response?.headers?.['x-error-message'];
      const bodyMsg = err?.response?.data || err?.message || 'Unknown error';
      const msg = headerMsg ? `${bodyMsg} (server: ${headerMsg})` : bodyMsg;
      alert('Save failed: ' + msg);
    }finally{ setLoading(false); }
  }

  // QR rendering: create an image URL that encodes the absolute user URL
  useEffect(() => {
    const userId = id || (preview && preview.id);
    const userHashId = preview && preview.hashId;
    if (!userId && !userHashId) { setQrUrl(null); return; }
    
    // Öncelikle hashId kullan, yoksa userId'ye fallback yap
    const cardId = userHashId || userId;
    const target = `${window.location.origin}/view-my-card/${cardId}`;
    // Use a public QR image API to avoid adding a dependency
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(target)}`;
    setQrUrl(qr);
  }, [id, preview]);

  // live display preview: merge saved preview with current form and file selections
  const displayPreview = {
    ...(preview || {}),
    ...form,
    socialLinks: (socialLinks && socialLinks.length > 0) ? socialLinks : ((preview && preview.socialLinks) ? preview.socialLinks : []),
    companyLogo: objectUrls.companyLogo || (preview && preview.companyLogo) || null,
    profilePicture: objectUrls.profilePicture || (preview && preview.profilePicture) || null,
    coverPhoto: objectUrls.coverPhoto || (preview && preview.coverPhoto) || null,
  };

  const hasDisplayData = Boolean(
    (displayPreview && (
      displayPreview.name || displayPreview.jobTitle || displayPreview.companyName || displayPreview.email || displayPreview.phone || displayPreview.companyUrl || displayPreview.address || (displayPreview.socialLinks && displayPreview.socialLinks.length > 0)
    ))
  );

  // layout constants for preview
  const coverHeight = 180; // increase so the full cover can be shown
  const avatarSize = 72;
  const avatarTop = coverHeight - avatarSize - 12; // keep avatars fully inside the cover

  return (
    <div className="create-card" style={{ display: 'flex', gap: 24, padding: 24 }}>
      <div className="form-panel" style={{ flex: 1 }}>
        <h2>Create My Card</h2>
        <form onSubmit={onSave}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.name}</div>
              <div style={{ flex: 1 }}>
                <input name="name" value={form.name} onChange={onChange} placeholder="Full name (e.g. Jane Doe)" className="input" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.jobTitle}</div>
              <div style={{ flex: 1 }}>
                <input name="jobTitle" value={form.jobTitle} onChange={onChange} placeholder="Job title (e.g. Head of Product)" className="input" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.department}</div>
              <div style={{ flex: 1 }}>
                <input name="department" value={form.department} onChange={onChange} placeholder="Department (e.g. Design)" className="input" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.companyName}</div>
              <div style={{ flex: 1 }}>
                <input name="companyName" value={form.companyName} onChange={onChange} placeholder="Company name (optional)" className="input" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.email}</div>
              <div style={{ flex: 1 }}>
                <input name="email" value={form.email} onChange={onChange} placeholder="name@company.com" className={`input ${errors.email ? 'invalid' : ''}`} />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.phone}</div>
              <div style={{ flex: 1 }}>
                <input name="phone" value={form.phone} onChange={onChange} placeholder="+1 555 555 5555" className={`input ${errors.phone ? 'invalid' : ''}`} />
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.companyUrl}</div>
              <div style={{ flex: 1 }}>
                <input name="companyUrl" value={form.companyUrl} onChange={onChange} placeholder="https://example.com" className={`input ${errors.companyUrl ? 'invalid' : ''}`} />
                {errors.companyUrl && <div className="field-error">{errors.companyUrl}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36 }}>{fieldIcons.address}</div>
              <div style={{ flex: 1 }}>
                <input name="address" value={form.address} onChange={onChange} placeholder="City, State or full address" className="input" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 600 }}>Social links</label>
              {socialLinks.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fbfdff', padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(10,20,40,0.04)' }}>
                  <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icons[s.platform] || icons.website}</div>
                  <select value={s.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} style={{ width: 120, padding: '6px 8px', borderRadius: 6 }}>
                    <option value="website">Website</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                  <input style={{ flex: 1, padding: '6px 8px', borderRadius: 6 }} placeholder="example.com/your-page" value={s.link} onChange={e => updateSocialLink(i, 'link', e.target.value)} />
                  <button type="button" onClick={() => removeSocialLink(i)} style={{ padding: '6px 8px', background: 'transparent', border: 'none', color: '#c33' }}>✕</button>
                </div>
              ))}
              <div>
                <button type="button" onClick={addSocialLink} style={{ padding: '6px 10px' }}>+ Add social link</button>
              </div>
              {errors.socialLinks && <div className="field-error">{errors.socialLinks}</div>}
            </div>

            {/* Background Color Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 600 }}>Card Background Color</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fbfdff', padding: '12px', borderRadius: 8, border: '1px solid rgba(10,20,40,0.04)' }}>
                <input 
                  type="color" 
                  name="backgroundColor" 
                  value={form.backgroundColor} 
                  onChange={onChange}
                  style={{ width: 50, height: 40, borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>Choose your card background color</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Current: {form.backgroundColor}</div>
                </div>
              </div>
              
              {/* Preset Color Options */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { color: '#FFFFFF', name: 'White' },
                  { color: '#F8FAFC', name: 'Light Gray' },
                  { color: '#EFF6FF', name: 'Light Blue' },
                  { color: '#F0FDF4', name: 'Light Green' },
                  { color: '#FEF3F2', name: 'Light Red' },
                  { color: '#FFFBEB', name: 'Light Yellow' },
                  { color: '#F5F3FF', name: 'Light Purple' },
                  { color: '#FDF2F8', name: 'Light Pink' }
                ].map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, backgroundColor: preset.color }))}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: preset.color,
                      border: form.backgroundColor === preset.color ? '3px solid #007bff' : '1px solid #ddd',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <label className="file-label">Company Logo<input type="file" name="companyLogo" onChange={onFileChange} accept="image/*" /></label>
            <label className="file-label">Profile Picture<input type="file" name="profilePicture" onChange={onFileChange} accept="image/*" /></label>
            <label className="file-label">Cover Photo<input type="file" name="coverPhoto" onChange={onFileChange} accept="image/*" /></label>

            <div style={{ marginTop: 12 }}>
              <button type="submit" className="btn" disabled={loading || Object.keys(errors).length > 0}>{id ? 'Update' : 'Save'}</button>
              {Object.keys(errors).length > 0 && <div className="form-hint">Please fix the highlighted fields before saving.</div>}
            </div>
          </div>
        </form>
      </div>

      <div className="preview-panel" style={{ width: 380 }}>
        <h3>Preview / Saved</h3>
        { (id || (preview && preview.id)) && (
          <div style={{ marginBottom: 12, textAlign: 'center' }}>
            <h4 style={{ margin: '6px 0' }}>QR code (scan with phone)</h4>
            {qrUrl ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={qrUrl} alt={`QR for ${id || (preview && preview.id)}`} style={{ width: 220, height: 220, borderRadius: 8, background: '#fff', padding: 8 }} />
              </div>
            ) : (
              <div style={{ color: '#666' }}>Generating QR code…</div>
            )}
            <div style={{ marginTop: 8, fontSize: 13, color: '#444' }}>Point your phone camera at the QR code to open the page.</div>
          </div>
        )}
        {loading && <div>Loading…</div>}
        {hasDisplayData ? (
          <div className="card-preview" style={{ width: 360, borderRadius: 14, background: displayPreview.backgroundColor || '#fff', boxShadow: '0 8px 24px rgba(12,12,16,0.08)', overflow: 'hidden' }}>
            {/* cover */}
            <div style={{ position: 'relative', height: 160, background: '#f6f7f8' }}>
              {displayPreview.coverPhoto ? (
                <img src={displayPreview.coverPhoto} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#eee' }} />
              )}

              {/* company badge at top-right */}
              {displayPreview.companyName && (
                <div style={{ position: 'absolute', right: 16, top: 16, background: '#F77', color: '#fff', padding: '10px 14px', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'center', boxShadow: '0 6px 18px rgba(247,119,119,0.18)' }}>
                  <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: 8, overflow: 'hidden' }}>
                    {displayPreview.companyLogo ? (
                      <img src={displayPreview.companyLogo} alt="company logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icons.companyLogo || icons.website}</div>
                    )}
                  </div>
                  <div style={{ fontWeight: 600 }}>{displayPreview.companyName}</div>
                </div>
              )}

              {/* circular avatar overlapping bottom-left */}
              {displayPreview.profilePicture && (
                <img src={displayPreview.profilePicture} alt="profile" style={{ position: 'absolute', left: 18, bottom: -36, width: 92, height: 92, objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }} />
              )}
            </div>

            <div style={{ padding: '56px 24px 24px 24px' }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{displayPreview.name}</h2>
              <div style={{ color: '#333', marginTop: 6, fontWeight: 500 }}>{displayPreview.jobTitle}</div>
              <div style={{ color: '#777', marginTop: 6 }}>{displayPreview.companyName}</div>

              {/* contact rows */}
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 12 }}>
                {displayPreview.email && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fieldIcons.email}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{displayPreview.email}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>Email</div>
                    </div>
                  </div>
                )}

                {displayPreview.phone && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fieldIcons.phone}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{displayPreview.phone}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>Cell phone</div>
                    </div>
                  </div>
                )}

                {displayPreview.companyUrl && (
                  <a href={formatSocialUrl(displayPreview.companyUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fieldIcons.companyUrl}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0b57d0' }}>{displayPreview.companyUrl}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>Website</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
            {displayPreview.socialLinks && displayPreview.socialLinks.length > 0 && (
              <div className="social-links" style={{ marginTop: 10, marginLeft: 12 }}>
                <h5 style={{ margin: '8px 0' }}>Social</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {displayPreview.socialLinks.map((s, i) => (
                    <a key={i} href={formatSocialUrl(s.link)} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: '#0b57d0', textDecoration: 'none' }}>
                      <span style={{ width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icons[s.platform] || icons.website}</span>
                      <span style={{ fontSize: 13 }}>{s.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>No saved data yet. Fill the form and hit Save.</div>
        )}
      </div>
    </div>
  );
}


