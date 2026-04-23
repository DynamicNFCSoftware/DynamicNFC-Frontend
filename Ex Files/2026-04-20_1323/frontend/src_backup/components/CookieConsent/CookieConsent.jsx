import { useState, useEffect } from 'react';
import './CookieConsent.css';

const CONSENT_KEY = 'dnfc_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      enableAnalytics();
    } else if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const enableAnalytics = () => {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
      gtag('event', 'page_view');
    }
  };

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    enableAnalytics();
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cc-banner">
      <div className="cc-content">
        <div className="cc-text">
          <strong>We value your privacy</strong>
          <p>We use cookies to analyze site traffic and improve your experience. No personal data is sold or shared with third parties.</p>
        </div>
        <div className="cc-actions">
          <button className="cc-btn cc-accept" onClick={handleAccept}>Accept</button>
          <button className="cc-btn cc-decline" onClick={handleDecline}>Decline</button>
        </div>
      </div>
    </div>
  );
}
