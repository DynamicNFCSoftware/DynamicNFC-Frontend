import { useLanguage } from "../../../i18n";
import { getLeadTemperature } from "../../../config/sectorConfig";
import { useSector } from "../../../hooks/useSector";

export default function LeadBadge({ score = 0, thresholds = null }) {
  const { sectorId } = useSector();
  const { lang } = useLanguage();
  const temp = getLeadTemperature(score, sectorId, lang, thresholds);

  return (
    <span
      className="ud-lead-badge"
      style={{
        background: `${temp.color}18`,
        color: temp.color,
        borderColor: `${temp.color}40`,
      }}
    >
      {score} - {temp.label}
    </span>
  );
}
