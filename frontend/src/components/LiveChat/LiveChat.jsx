import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TAWK_PROPERTY_ID = 'default'; // Replace with your Tawk.to property ID
const TAWK_WIDGET_ID = 'default';   // Replace with your Tawk.to widget ID

export default function LiveChat() {
  const { pathname } = useLocation();

  // Hide on card/admin/login pages
  const hidden = pathname.startsWith('/card') || pathname.startsWith('/c/') ||
    pathname.startsWith('/admin') || pathname === '/login';

  useEffect(() => {
    // Skip if no real Tawk IDs configured
    if (TAWK_PROPERTY_ID === 'default') return;

    if (hidden) {
      if (window.Tawk_API?.hideWidget) window.Tawk_API.hideWidget();
      return;
    }

    // Load Tawk.to script once
    if (!document.getElementById('tawk-script')) {
      const s = document.createElement('script');
      s.id = 'tawk-script';
      s.async = true;
      s.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      s.charset = 'UTF-8';
      s.setAttribute('crossorigin', '*');
      document.head.appendChild(s);
    } else if (window.Tawk_API?.showWidget) {
      window.Tawk_API.showWidget();
    }
  }, [hidden]);

  return null;
}
