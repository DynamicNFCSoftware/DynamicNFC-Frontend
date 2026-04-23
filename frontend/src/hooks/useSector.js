// src/hooks/useSector.js
// ═══════════════════════════════════════════════════════════════
// SECTOR CONTEXT — Provides sector config to dashboard components
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, useEffect, createElement } from 'react';
import { getSectorConfig, getAvailableSectors, t as sectorT } from '../config/sectorConfig';
import { useLanguage } from '../i18n';
import { normalizeSectorId, toPublicSectorId } from '../utils/sectorId';

const SectorContext = createContext(null);
const STORAGE_KEY = "dynamicnfc.activeSector";
const LEGACY_STORAGE_KEY = "ud-sector";

/**
 * SectorProvider wraps dashboard pages.
 * Determines sector from:
 * 1. URL path (e.g., /automotive/dashboard → 'automotive')
 * 2. Props (explicit sectorId)
 * 3. Default: 'real_estate'
 */
export function SectorProvider({ sectorId: propSectorId, children }) {
  const [sectorId, setSectorId] = useState(
    () => normalizeSectorId(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || propSectorId || 'real_estate')
  );
  const config = getSectorConfig(sectorId);
  const { lang } = useLanguage();

  // Localized text helper that uses current language
  const st = useCallback((bilingualObj) => sectorT(bilingualObj, lang), [lang]);

  const switchSector = useCallback((newSectorId) => {
    const normalizedSector = normalizeSectorId(newSectorId);
    setSectorId(normalizedSector);
    localStorage.setItem(LEGACY_STORAGE_KEY, normalizedSector);
    localStorage.setItem(STORAGE_KEY, toPublicSectorId(normalizedSector));
  }, []);

  useEffect(() => {
    // Keep both keys in sync during migration period.
    localStorage.setItem(LEGACY_STORAGE_KEY, sectorId);
    localStorage.setItem(STORAGE_KEY, toPublicSectorId(sectorId));
  }, [sectorId]);

  const activeSectorId = toPublicSectorId(sectorId);
  const availableSectors = getAvailableSectors().map((sector) => ({
    ...sector,
    id: toPublicSectorId(sector.id),
    enabled: true,
  }));

  const value = {
    sectorId,
    activeSectorId,
    setActiveSectorId: switchSector,
    availableSectors,
    config,
    switchSector,
    sectors: getAvailableSectors(),
    st, // sector translate: st(config.identity.sectorLabel) → "Real Estate"
  };

  return createElement(SectorContext.Provider, { value }, children);
}

/**
 * Hook to access sector config in any child component
 *
 * Usage:
 *   const { config, st, sectorId } = useSector();
 *   <h1>{st(config.identity.dashboardTitle)}</h1>
 *   // Real Estate → "CRM Intelligence Center"
 *   // Automotive → "Dealer Intelligence Center"
 */
export function useSector() {
  const context = useContext(SectorContext);
  if (!context) {
    throw new Error('useSector must be used within a SectorProvider');
  }
  return context;
}

export default useSector;
