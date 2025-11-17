import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { FiGlobe, FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin, FiUser, FiBriefcase, FiAward, FiHome } from 'react-icons/fi';

function ViewMyCard() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Icons for different fields - same as CreateMyCard
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

    // Social media icons
    const icons = {
        linkedin: <FiLinkedin size={16} />,
        twitter: <FiTwitter size={16} />,
        facebook: <FiFacebook size={16} />,
        instagram: <FiInstagram size={16} />,
        website: <FiGlobe size={16} />
    };

    const [qrUrl, setQrUrl] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                console.log('Fetching user data for ID:', id);
                console.log('API URL:', `${API_BASE_URL}/users/${id}`);
                const response = await axios.get(`${API_BASE_URL}/users/${id}`);
                console.log('API Response:', response.data);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                console.error('Error details:', error.response?.data, error.response?.status);
                setError('Card information not found.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    // Generate QR code when user data is loaded
    useEffect(() => {
        if (user && (user.hashId || user.id)) {
            // Öncelikle hashId kullan, yoksa ID'ye fallback yap
            const cardId = user.hashId || user.id;
            const qrTarget = `${window.location.origin}/view-my-card/${cardId}`;
            const qrService = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrTarget)}`;
            setQrUrl(qrService);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading card information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container" style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '40px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="error-message" style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 16,
                    padding: 40,
                    textAlign: 'center',
                    maxWidth: 500,
                    width: '100%'
                }}>
                    <h2 style={{ color: '#e74c3c', marginBottom: 20 }}>⚠️ Error</h2>
                    <p style={{ fontSize: 16, marginBottom: 20, color: '#333' }}>{error}</p>
                    <p style={{ fontSize: 14, color: '#666', marginBottom: 30 }}>Requested ID: <strong>{id}</strong></p>
                    <button 
                        onClick={() => window.location.href = '/'} 
                        style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            padding: '12px 24px',
                            fontSize: 16,
                            cursor: 'pointer'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h2>🔍 Card Not Found</h2>
                    <p>Card with ID: {id} not found.</p>
                    <button onClick={() => window.location.href = '/'}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
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

    // Prepare display data (same format as CreateMyCard)
    const displayUser = user ? {
        name: user.name || user.fullName,
        jobTitle: user.jobTitle,
        companyName: user.companyName || user.company,
        email: user.email,
        phone: user.phone,
        companyUrl: user.companyUrl || user.website,
        profilePicture: user.profilePicture ? user.profilePicture : null,
        coverPhoto: user.coverPhoto ? user.coverPhoto : null,
        companyLogo: user.companyLogo ? user.companyLogo : null,
        backgroundColor: user.backgroundColor || '#FFFFFF', // Default to white if no background color
        socialLinks: user.socialLinks || []
    } : null;

    return (
        <div className="view-my-card" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Digital Business Card Title */}
            <h1 style={{ 
                color: 'white', 
                fontSize: 36, 
                marginBottom: 40, 
                textAlign: 'center',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
                Digital Business Card
            </h1>

            {/* QR Code Section */}
            {user && (user.hashId || user.id) && (
                <div style={{ 
                    marginBottom: 40, 
                    textAlign: 'center', 
                    background: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)', 
                    borderRadius: 16, 
                    padding: 30,
                    maxWidth: 400,
                    width: '100%'
                }}>
                    <h4 style={{ margin: '0 0 20px 0', color: 'white', fontSize: 18 }}>QR Code (scan with phone)</h4>
                    {qrUrl ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={qrUrl} alt={`QR for ${user.hashId || user.id}`} style={{ width: 220, height: 220, borderRadius: 8, background: '#fff', padding: 8 }} />
                        </div>
                    ) : (
                        <div style={{ color: 'rgba(255,255,255,0.7)' }}>Generating QR code…</div>
                    )}
                    <div style={{ marginTop: 15, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Point your phone camera at the QR code to open the page.</div>
                </div>
            )}

            {/* Card Preview - Exactly same as CreateMyCard */}
            {displayUser && (
                <div className="card-preview" style={{ 
                    width: 360, 
                    borderRadius: 14, 
                    background: displayUser.backgroundColor || '#fff', 
                    boxShadow: '0 8px 24px rgba(12,12,16,0.08)', 
                    overflow: 'hidden',
                    marginBottom: 40
                }}>
                    {/* cover */}
                    <div style={{ position: 'relative', height: 160, background: '#f6f7f8' }}>
                        {displayUser.coverPhoto ? (
                            <img src={displayUser.coverPhoto} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                        )}

                        {/* company badge at top-right */}
                        {displayUser.companyName && (
                            <div style={{ position: 'absolute', right: 16, top: 16, background: '#F77', color: '#fff', padding: '10px 14px', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'center', boxShadow: '0 6px 18px rgba(247,119,119,0.18)' }}>
                                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: 8, overflow: 'hidden' }}>
                                    {displayUser.companyLogo ? (
                                        <img src={displayUser.companyLogo} alt="company logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icons.companyLogo || icons.website}</div>
                                    )}
                                </div>
                                <div style={{ fontWeight: 600 }}>{displayUser.companyName}</div>
                            </div>
                        )}

                        {/* circular avatar overlapping bottom-left */}
                        {displayUser.profilePicture && (
                            <img src={displayUser.profilePicture} alt="profile" style={{ position: 'absolute', left: 18, bottom: -36, width: 92, height: 92, objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }} />
                        )}
                    </div>

                    <div style={{ padding: '56px 24px 24px 24px' }}>
                        <h2 style={{ margin: 0, fontSize: 22 }}>{displayUser.name}</h2>
                        <div style={{ color: '#333', marginTop: 6, fontWeight: 500 }}>{displayUser.jobTitle}</div>
                        <div style={{ color: '#777', marginTop: 6 }}>{displayUser.companyName}</div>

                        {/* contact rows */}
                        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 12 }}>
                            {displayUser.email && (
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fieldIcons.email}</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{displayUser.email}</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>Email</div>
                                    </div>
                                </div>
                            )}

                            {displayUser.phone && (
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fieldIcons.phone}</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{displayUser.phone}</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>Cell phone</div>
                                    </div>
                                </div>
                            )}

                            {displayUser.companyUrl && (
                                <a href={formatSocialUrl(displayUser.companyUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fieldIcons.companyUrl}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#0b57d0' }}>{displayUser.companyUrl}</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>Website</div>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                    
                    {/* Social Links */}
                    {displayUser.socialLinks && displayUser.socialLinks.length > 0 && (
                        <div className="social-links" style={{ marginTop: 10, marginLeft: 12, paddingBottom: 24 }}>
                            <h5 style={{ margin: '8px 0' }}>Social</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {displayUser.socialLinks.map((s, i) => (
                                    <a key={i} href={formatSocialUrl(s.link)} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: '#0b57d0', textDecoration: 'none' }}>
                                        <span style={{ width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icons[s.platform] || icons.website}</span>
                                        <span style={{ fontSize: 13 }}>{s.platform}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Contact Actions */}
            <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)', 
                borderRadius: 16, 
                padding: 30,
                maxWidth: 500,
                width: '100%'
            }}>
                <h3 style={{ color: 'white', marginBottom: 20, fontSize: 20, textAlign: 'center' }}>Contact Actions</h3>
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button 
                        style={{
                            background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 12,
                            padding: '15px 20px',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'transform 0.2s',
                            flex: '1 1 150px',
                            minWidth: '130px'
                        }}
                        onClick={() => {
                            if (user.phone) {
                                window.location.href = `tel:${user.phone}`;
                            } else if (user.email) {
                                window.location.href = `mailto:${user.email}`;
                            }
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        📞 Contact Now
                    </button>
                    
                    {user.email && (
                        <button 
                            style={{
                                background: 'linear-gradient(135deg, #4ECDC4, #6EDBD7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 12,
                                padding: '15px 20px',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                transition: 'transform 0.2s',
                                flex: '1 1 150px',
                                minWidth: '130px'
                            }}
                            onClick={() => window.location.href = `mailto:${user.email}`}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            📧 Send Email
                        </button>
                    )}

                    <button 
                        style={{
                            background: 'linear-gradient(135deg, #A8E6CF, #7FCDCD)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 12,
                            padding: '15px 20px',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'transform 0.2s',
                            flex: '1 1 150px',
                            minWidth: '130px'
                        }}
                        onClick={() => {
                            // VCard format
                            const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name || user.fullName}
${user.email ? `EMAIL:${user.email}` : ''}
${user.phone ? `TEL:${user.phone}` : ''}
${user.companyName || user.company ? `ORG:${user.companyName || user.company}` : ''}
${user.jobTitle ? `TITLE:${user.jobTitle}` : ''}
${user.companyUrl || user.website ? `URL:${user.companyUrl || user.website}` : ''}
${user.address ? `ADR:;;${user.address};;;` : ''}
END:VCARD`;
                            
                            const blob = new Blob([vcard], { type: 'text/vcard' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${user.name || user.fullName}.vcf`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        💾 Save to Contacts
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewMyCard;