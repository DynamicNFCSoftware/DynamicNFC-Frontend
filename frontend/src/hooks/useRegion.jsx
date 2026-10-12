import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { REGIONS, REGION_LIST, detectRegion, getRegion } from '../config/regionConfig';

const RegionContext = createContext(null);

export function RegionProvider({ children }) {
  // A saved region counts only while it is still offered; otherwise pick one from the browser.
  const [regionId, setRegionId] = useState(() => {
    const saved = localStorage.getItem('ud-region');
    return REGION_LIST.some((r) => r.id === saved) ? saved : detectRegion();
  });

  const switchRegion = useCallback((newRegionId) => {
    if (REGIONS[newRegionId]) setRegionId(newRegionId);
  }, []);

  // Always save the active region: tracking (portalTracking, tenantService) reads 'ud-region' directly.
  useEffect(() => { localStorage.setItem('ud-region', regionId); }, [regionId]);

  const region = useMemo(() => getRegion(regionId), [regionId]);

  const value = useMemo(() => ({
    regionId,
    region,
    switchRegion,
    currency: region.currency,
    currencySymbol: region.currencySymbol,
    locale: region.locale,
    languages: region.languages,
    defaultLang: region.defaultLang,
    isRtl: (lang) => region.rtl[lang] || false,
    sidebarAccent: region.sidebarAccent,
  }), [regionId, region, switchRegion]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error('useRegion must be inside RegionProvider');
  return ctx;
}
