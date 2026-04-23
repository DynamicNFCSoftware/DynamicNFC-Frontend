import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { REGIONS, DEFAULT_REGION, getRegion } from '../config/regionConfig';

const RegionContext = createContext(null);

export function RegionProvider({ children }) {
  const [regionId, setRegionId] = useState(
    () => localStorage.getItem('ud-region') || DEFAULT_REGION
  );

  const switchRegion = useCallback((newRegionId) => {
    if (REGIONS[newRegionId]) {
      setRegionId(newRegionId);
      localStorage.setItem('ud-region', newRegionId);
    }
  }, []);

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
