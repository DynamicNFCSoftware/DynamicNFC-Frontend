import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './EmailCapture.css';

const DISMISS_KEY = 'dnfc_newsletter_dismissed';
const MIN_DELAY_MS = 300_000; // 5 minutes
const SCROLL_THRESHOLD = 0.5; // 50% of page

export default function EmailCapture() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Rule 3: Never show on demo pages
  const isDemo = pathname.startsWith('/enterprise/crmdemo') || pathname.startsWith('/automotive/demo');

  // Only show on public marketing pages
  const allowed = !isDemo && (
    pathname === '/' || pathname === '/nfc-cards' || pathname === '/enterprise' ||
    pathname === '/real-estate' || pathname === '/automotive' || pathname === '/developers' ||
    pathname === '/pricing' || pathname === '/blog'
  );

  // Rule 2: Persist dismiss in localStorage (survives sessions)
  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, 'true'); } catch {}
  }, []);

  useEffect(() => {
    if (!allowed || dismissed) return;
    // Rule 2: If previously dismissed, never show again
    try { if (localStorage.getItem(DISMISS_KEY) === 'true') return; } catch {}
    try { if (localStorage.getItem('dnfc_email_subscribed')) return; } catch {}

    let ready = false;
    let scrollFired = false;

    const activate = () => {
      if (ready) return;
      ready = true;
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleShowOnScroll, { passive: true });
      if (scrollFired) setVisible(true);
    };

    const delayTimer = setTimeout(() => {
      activate();
    }, MIN_DELAY_MS);

    const handleScrollGate = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (scrollPct >= SCROLL_THRESHOLD) {
        scrollFired = true;
        activate();
        window.removeEventListener('scroll', handleScrollGate);
      }
    };

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) setVisible(true);
    };

    const handleShowOnScroll = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (scrollPct > 0.6) setVisible(true);
    };

    window.addEventListener('scroll', handleScrollGate, { passive: true });

    return () => {
      clearTimeout(delayTimer);
      window.removeEventListener('scroll', handleScrollGate);
      window.removeEventListener('scroll', handleShowOnScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [allowed, dismissed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email.trim().toLowerCase(),
        source: pathname,
        subscribedAt: serverTimestamp(),
      });
      setSubmitted(true);
      try { localStorage.setItem('dnfc_email_subscribed', '1'); } catch {}
      setTimeout(dismiss, 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  if (!visible || !allowed) return null;

  return (
    <div className="ec-overlay" onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      <div className="ec-modal">
        <button className="ec-close" onClick={dismiss}>×</button>
        {submitted ? (
          <div className="ec-success">
            <div className="ec-check">✓</div>
            <h3>You're in!</h3>
            <p>Thank you for subscribing. We'll keep you updated.</p>
          </div>
        ) : (
          <>
            <h3 className="ec-title">Stay Ahead of the Curve</h3>
            <p className="ec-desc">Get exclusive insights on NFC technology, digital business cards, and sales intelligence — delivered to your inbox.</p>
            <form className="ec-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="ec-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoFocus
              />
              <button type="submit" className="ec-submit">Subscribe</button>
            </form>
            {error && <p className="ec-error">{error}</p>}
            <p className="ec-note">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}
