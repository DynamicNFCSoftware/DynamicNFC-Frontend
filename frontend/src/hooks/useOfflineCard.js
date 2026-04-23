import { useEffect, useCallback } from 'react';

/**
 * Cache card data for offline viewing via Service Worker.
 * Call cacheCard(cardId, data) after fetching from Firestore.
 * Call getCachedCard(cardId) when offline to retrieve stored data.
 */
export function useOfflineCard() {
  const cacheCard = useCallback((cardId, cardData) => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_CARD',
      cardId,
      cardData,
    });
  }, []);

  const getCachedCard = useCallback((cardId) => {
    return new Promise((resolve) => {
      if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
        resolve(null);
        return;
      }

      const handler = (event) => {
        if (event.data?.type === 'CACHED_CARD_DATA' && event.data.cardId === cardId) {
          navigator.serviceWorker.removeEventListener('message', handler);
          resolve(event.data.cardData);
        }
      };

      navigator.serviceWorker.addEventListener('message', handler);
      navigator.serviceWorker.controller.postMessage({
        type: 'GET_CACHED_CARD',
        cardId,
      });

      // Timeout after 2s
      setTimeout(() => {
        navigator.serviceWorker.removeEventListener('message', handler);
        resolve(null);
      }, 2000);
    });
  }, []);

  return { cacheCard, getCachedCard };
}
