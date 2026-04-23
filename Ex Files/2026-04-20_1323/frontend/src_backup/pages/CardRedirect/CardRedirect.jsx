import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CardRedirect() {
  const { cardId } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!cardId) return;

    async function redirect() {
      try {
        console.log('CardRedirect: looking up cardId:', cardId);
        const cardDoc = await getDoc(doc(db, 'smartcards', cardId));
        console.log('CardRedirect: doc exists?', cardDoc.exists(), cardDoc.data());

        if (!cardDoc.exists() || cardDoc.data().status !== 'active') {
          setError(true);
          setTimeout(() => window.location.href = '/', 2000);
          return;
        }

        const card = cardDoc.data();

        const ua = navigator.userAgent || '';
        const deviceType = /mobile|android|iphone|ipad/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop';

        try {
          await addDoc(collection(db, 'taps'), {
            cardId,
            timestamp: serverTimestamp(),
            userAgent: ua.substring(0, 500),
            deviceType,
            referrer: document.referrer || '',
            campaignId: card.campaignId || null,
            assignedTo: card.assignedTo || null,
          });
        } catch (e) {
          console.warn('Tap log failed:', e);
        }

        // Update tap count (don't wait for this)
        updateDoc(doc(db, 'smartcards', cardId), {
          totalTaps: increment(1),
          lastTapAt: serverTimestamp(),
        }).catch(() => {});

        // Small delay to ensure updateDoc starts
        await new Promise(r => setTimeout(r, 200));

        // NOW redirect
        window.location.href = card.redirectUrl;
      } catch (err) {
        console.error('CardRedirect FULL error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        setError(true);
        setTimeout(() => window.location.href = '/', 2000);
      }
    }

    redirect();
  }, [cardId]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0f1118', color: '#fff',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {error ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Card not found. Redirecting...</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#e63946', borderRadius: '50%',
            animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem'
          }} />
          <p style={{ fontSize: '1rem', opacity: 0.5 }}>Loading your experience...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
    </div>
  );
}
