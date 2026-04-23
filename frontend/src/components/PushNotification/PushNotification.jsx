import { useState, useEffect } from 'react';
import './PushNotification.css';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export default function PushNotification() {
  const [permission, setPermission] = useState('default');
  const [subscribed, setSubscribed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (localStorage.getItem('push_dismissed') || localStorage.getItem('push_subscribed')) return;

    setPermission(Notification.permission);
    if (Notification.permission === 'granted') {
      checkExistingSubscription();
      return;
    }

    const timer = setTimeout(() => setShow(true), 45000);
    return () => clearTimeout(timer);
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        setSubscribed(true);
        localStorage.setItem('push_subscribed', '1');
      }
    } catch {}
  };

  const subscribe = async () => {
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        // Permission denied or dismissed — hide banner, don't ask again
        setShow(false);
        localStorage.setItem('push_dismissed', '1');
        return;
      }

      if (!VAPID_PUBLIC_KEY) {
        console.warn('VAPID public key not configured — permission granted but no VAPID key');
        setSubscribed(true);
        localStorage.setItem('push_subscribed', '1');
        setShow(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Subscription ready — send to backend when endpoint configured
      setSubscribed(true);
      localStorage.setItem('push_subscribed', '1');
      setShow(false);
    } catch (err) {
      console.error('Push subscription failed:', err);
      // Still hide banner on error to avoid stuck UI
      setShow(false);
      localStorage.setItem('push_dismissed', '1');
    }
  };

  const dismiss = () => {
    setDismissed(true);
    setShow(false);
    localStorage.setItem('push_dismissed', '1');
  };

  if (!show || subscribed || dismissed) return null;
  if (!('PushManager' in window)) return null;

  return (
    <div className="pn-banner">
      <div className="pn-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <div className="pn-content">
        <span className="pn-title">Stay Updated</span>
        <span className="pn-text">Get notified about new card taps and VIP activity.</span>
      </div>
      <div className="pn-actions">
        <button onClick={subscribe} className="pn-allow">Enable</button>
        <button onClick={dismiss} className="pn-dismiss">Not now</button>
      </div>
    </div>
  );
}
