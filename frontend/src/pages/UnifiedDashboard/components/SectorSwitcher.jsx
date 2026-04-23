import { useLanguage } from "../../../i18n";
import { t } from "../../../config/sectorConfig";
import { useSector } from "../../../hooks/useSector";

export default function SectorSwitcher() {
  const { sectorId, switchSector, sectors } = useSector();
  const { lang } = useLanguage();

  return (
    <div className="ud-sector-switcher">
      {sectors.map((sector) => {
        const label = t(sector.label, lang);
        return (
          <button
            key={sector.id}
            className={`ud-sector-btn ${sectorId === sector.id ? "ud-sector-active" : ""}`}
            onClick={() => switchSector(sector.id)}
            data-tooltip={label}
            aria-label={label}
            type="button"
          >
            {sector.id === "real_estate" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            )}
            {sector.id === "automotive" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9l2.5-5h13L21 9v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0" />
              </svg>
            )}
            {sector.id === "yacht" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 20l2-2h16l2 2" />
                <path d="M4 18V12l8-6 8 6v6" />
                <path d="M12 6V2" />
              </svg>
            )}
            <span className="ud-sector-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}