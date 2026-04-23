const CACHE_NAME = 'dynamicnfc-v2';
const CARD_CACHE = 'dynamicnfc-cards-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keep = [CACHE_NAME, CARD_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => !keep.includes(key)).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* ── Push Notifications (#30) ── */
self.addEventListener('push', (event) => {
  let data = { title: 'DynamicNFC', body: 'You have a new notification', url: '/' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/' },
      vibrate: [100, 50, 100],
      actions: [{ action: 'open', title: 'Open' }],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});

/* ── Card offline caching message handler (#32) ── */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_CARD') {
    const { cardId, cardData } = event.data;
    caches.open(CARD_CACHE).then((cache) => {
      const response = new Response(JSON.stringify(cardData), {
        headers: { 'Content-Type': 'application/json' },
      });
      cache.put(`/api/card/${cardId}`, response);
    });
  }

  if (event.data?.type === 'GET_CACHED_CARD') {
    const { cardId } = event.data;
    caches.open(CARD_CACHE).then((cache) => {
      cache.match(`/api/card/${cardId}`).then((resp) => {
        if (resp) {
          resp.json().then((data) => {
            event.source.postMessage({ type: 'CACHED_CARD_DATA', cardId, cardData: data });
          });
        } else {
          event.source.postMessage({ type: 'CACHED_CARD_DATA', cardId, cardData: null });
        }
      });
    });
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('chrome-extension') ||
      event.request.url.includes('googletagmanager') ||
      event.request.url.includes('google-analytics') ||
      event.request.url.includes('firestore.googleapis')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
