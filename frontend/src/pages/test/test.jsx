import React, { useState } from 'react';

const SOCIAL_PLATFORMS = [
  'linkedin', 'youtube', 'facebook', 'twitter', 'instagram', 'behance', 'dribbble', 'website'
];

function IconCircle({ children }) {
  return (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 999,
      background: '#111827',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      marginRight: 8,
      flex: '0 0 36px'
    }}>
      {children}
    </div>
  );
}

function CardPreview({ user }) {
  // uses same classes/style as verdiğiniz tasarıma sadık kalacak şekilde
  return (
    <div style={{ width: 360, maxWidth: '36vw', pointerEvents: 'none' }}>
      <img src={user.profilePicture} alt="" style={{ display: 'none' }} loading="lazy" />
      <div
        className="_1mwbo3a0 _1mwbo3a1"
        style={{
          background: 'rgb(248 58 58 / 14%)',
          '--tnkigl2c': '58,74,248',
          '--tnkigl2d': '58,74,248, 0.14',
          '--tnkigl2f': '255,255,255',
          '--tnkigl2e': '#fff',
          '--tnkigl2g': 'CardCustomFont, var(--tnkigl0)',
          minHeight: '100%',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          flexShrink: '0',
          width: '100%',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div className="_15zfejk0 _15zfejk1" style={{ width: '100%' }}>
          <header className="_114jae30">
            <div className="_114jae31 _114jae33 _114jae35" style={{ width: '100%' }}>
              <img src={user.coverPhoto || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="140"></svg>'}
                alt="Banner"
                className="_114jae37 _114jae39 _114jae3b _114jae3d _114jae3e"
                style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div className="_114jae3k _114jae3l _114jae3n _114jae3q" style={{ display: 'flex', justifyContent: 'center', marginTop: -36 }}>
              <img src={user.profilePicture || 'https://via.placeholder.com/72'} alt="profile" className="_114jae3s" style={{ width: 72, height: 72, borderRadius: 12, border: '4px solid white', objectFit: 'cover' }} />
            </div>
          </header>
          <div className="_4p4yt30" style={{ padding: '12px 6px', textAlign: 'center' }}>
            <div className="_4p4yt33">
              <div className="_4p4yt31" style={{ fontSize: 18, fontWeight: 700 }}>{user.name || 'Full Name'}</div>
            </div>
            <div className="_4p4yt32" style={{ color: '#374151' }}>{user.jobTitle || 'Job Title'}</div>
            <div className="_4p4yt32" style={{ color: '#6b7280' }}>{user.department || ''}</div>
            <div className="_4p4yt32" style={{ color: '#374151', fontWeight: 600 }}>{user.companyName || 'Company'}</div>
          </div>

          <ul className="ttlgl00" style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
            {user.phone && (
              <li style={{ display: 'flex', alignItems: 'center', padding: '8px 6px' }}>
                <div className="_11mr3km1" style={{ marginRight: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor"><path d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z" /></svg>
                </div>
                <div className="_8oxuwz1"><div className="_8oxuwz2" data-type="phoneNumber">{user.phone}</div></div>
              </li>
            )}
            {user.email && (
              <li style={{ display: 'flex', alignItems: 'center', padding: '8px 6px' }}>
                <div style={{ marginRight: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor"><path d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z" /></svg>
                </div>
                <div><div data-type="email">{user.email}</div></div>
              </li>
            )}
            {user.website && (
              <li style={{ display: 'flex', alignItems: 'center', padding: '8px 6px' }}>
                <div style={{ marginRight: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM5.5 11a6.5 6.5 0 0113 0H5.5z" /></svg>
                </div>
                <div><div data-type="url">{user.website}</div></div>
              </li>
            )}
            {user.socialLinks.map((s, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 6px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: '#0ea5a4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: 8 }}>
                  <span style={{ fontSize: 12, textTransform: 'uppercase' }}>{s.platform[0]}</span>
                </div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.link}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function test() {
  const [user, setUser] = useState({
    name: '',
    jobTitle: '',
    department: '',
    companyName: '',
    email: '',
    phone: '',
    website: '',
    socialLinks: [],
    companyLogo: '',
    profilePicture: '',
    coverPhoto: ''
  });
  const [qrUrl, setQrUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState(SOCIAL_PLATFORMS[0]);
  const [newSocialLink, setNewSocialLink] = useState('');

  function updateField(key, value) {
    setUser(prev => ({ ...prev, [key]: value }));
  }

  function addSocial() {
    if (!newSocialLink) return;
    setUser(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: newSocialPlatform, link: newSocialLink }] }));
    setNewSocialLink('');
  }

  function removeSocial(index) {
    setUser(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));
  }

  function handleImage(field, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateField(field, e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleFileInput(e, field) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    updateField(field + 'File', file);   // ← BU ÖNEMLİ
    handleImage(field, file);
  }

  function inputStyle() {
    return {
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #e6e9ee',
      outline: 'none'
    };
  }

  function fileLabelStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 10,
      borderRadius: 8,
      background: '#ffffff',
      border: '1px dashed #e6e9ee',
      textAlign: 'center',
      cursor: 'pointer'
    };
  }


  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('jobTitle', user.jobTitle);
      formData.append('department', user.department);
      formData.append('companyName', user.companyName);
      formData.append('email', user.email);
      formData.append('phone', user.phone);
      formData.append('companyUrl', user.website);
      if (user.companyLogoFile) formData.append('companyLogo', user.companyLogoFile);
      if (user.profilePictureFile) formData.append('profilePicture', user.profilePictureFile);
      if (user.coverPhotoFile) formData.append('coverPhoto', user.coverPhotoFile);
      formData.append('socialLinks', JSON.stringify(user.socialLinks));

      // fetch (await ekle)
      const res = await fetch('/api/users/upload', { // eğer Vite proxy kullanıyorsan /api; doğrudan backend ise tam url yaz
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      console.log('Response:', data);

      // backend'in döndüğü hashId'i al
      // backend hashId anahtarı farklıysa uyarlayabilirsin (ör. data.hash_id, data.data.hashId vb.)
      const hashId = data.hashId || data.hash_id || (data.id ? String(data.id) : null);

      if (!hashId) {
        // Eğer backend hashId döndürmüyorsa, opsiyonel: client-side HashID üretebilirsin (aşağıda opsiyon var)
        console.warn('No hashId returned from backend. QR not generated automatically.');
        alert('Saved but no HashID returned. QR not generated.');
        setIsSaving(false);
        return;
      }

      // hedef URL — production domain'ini burada ayarla
      const domain = window.location.origin.replace(/:\d+$/, '') || 'http://localhost:3000';
      const targetUrl = `${domain}/view-my-card/${encodeURIComponent(hashId)}`;

      // qrserver API ile görsel URL'i oluştur
      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;

      setQrUrl(qrApi);

      alert('Card created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create card: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      padding: 24,
      boxSizing: 'border-box',
      background: '#f8fafc'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Left: Preview (fixed look, non-editable) */}
        <div style={{ flex: '0 0 380px' }}>
          {!qrUrl ? (
            <CardPreview user={user} />
          ) : (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <p>QR Has been created successfully!</p>
              <h4 style={{ marginBottom: 8 }}>Your QR (scan to open)</h4>
              <img
                src={qrUrl}
                alt="QR Code"
                style={{
                  width: 200,
                  height: 200,
                  display: 'block',
                  margin: '0 auto',
                  background: 'white',
                  padding: 8,
                  borderRadius: 8,
                }}
              />
              <div style={{ marginTop: 8 }}>
                <a
                  href={qrUrl}
                  download={`card-${Date.now()}.png`}
                  style={{
                    marginRight: 8,
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: '#10b981',
                    color: 'white',
                  }}
                >
                  Download QR
                </a>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/card/?hashId=${encodeURIComponent(
                        qrUrl.split('data=')[1] || ''
                      )}`
                    )
                  }
                >
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Right: Form */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 8px 30px rgba(2,6,23,0.08)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <h2 style={{ marginTop: 0 }}>Create NFC Card</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <IconCircle><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" /></svg></IconCircle>
            <input placeholder="Full name" value={user.name} onChange={e => updateField('name', e.target.value)} style={inputStyle()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <IconCircle><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4v16h16z" /></svg></IconCircle>
            <input placeholder="Job title" value={user.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} style={inputStyle()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <IconCircle><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm4 0h14v-2H7v2zM7 9h14V7H7v2z" /></svg></IconCircle>
            <input placeholder="Department" value={user.department} onChange={e => updateField('department', e.target.value)} style={inputStyle()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <IconCircle><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v4H3zM3 10h18v11H3z" /></svg></IconCircle>
            <input placeholder="Company" value={user.companyName} onChange={e => updateField('companyName', e.target.value)} style={inputStyle()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <IconCircle><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4v16h16z" /></svg></IconCircle>
            <input placeholder="Email" value={user.email} onChange={e => updateField('email', e.target.value)} style={inputStyle()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <IconCircle><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.58 3.55 1 1 0 01-.26 1.11z" /></svg></IconCircle>
            <input placeholder="Phone" value={user.phone} onChange={e => updateField('phone', e.target.value)} style={inputStyle()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <IconCircle><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg></IconCircle>
            <input placeholder="Website" value={user.website} onChange={e => updateField('website', e.target.value)} style={inputStyle()} />
          </div>

          <div style={{ margin: '12px 0', padding: 12, borderRadius: 8, background: '#f1f5f9' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <select value={newSocialPlatform} onChange={e => setNewSocialPlatform(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, flex: '0 0 160px' }}>
                {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input placeholder="Social URL" value={newSocialLink} onChange={e => setNewSocialLink(e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: 8 }} />
              <button onClick={addSocial} style={{ padding: '8px 12px', borderRadius: 8, background: '#10b981', color: 'white', border: 'none' }}>Add</button>
            </div>

            <div>
              {user.socialLinks.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: '#111827', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.platform[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, fontSize: 14, color: '#111827' }}>{s.platform} — {s.link}</div>
                  <button onClick={() => removeSocial(i)} style={{ background: 'transparent', border: 'none', color: '#ef4444' }}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={fileLabelStyle()}>
              Company Logo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileInput(e, 'companyLogo')} />
            </label>

            <label style={fileLabelStyle()}>
              Profile Picture
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileInput(e, 'profilePicture')} />
            </label>

            <label style={{ ...fileLabelStyle(), gridColumn: '1 / -1' }}>
              Cover Photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileInput(e, 'coverPhoto')} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <button
              style={{ padding: '8px 12px', borderRadius: 8, background: '#2563eb', color: 'white', border: 'none' }}
              onClick={handleSubmit}
            >
              Save Contact
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}