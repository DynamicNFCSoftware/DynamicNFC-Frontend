import { useMemo } from "react";
import { useTranslation } from "../../../i18n";
import { getPersonas } from "../../../config/regionConfig";
import { getRealEstateMapRegionData } from "../../../config/mapRegionConfig";
import Step1Identity from "./illustrations/Step1Identity";
import Step2Track from "./illustrations/Step2Track";
import Step3Score from "./illustrations/Step3Score";
import Step4Alert from "./illustrations/Step4Alert";
import Step5Close from "./illustrations/Step5Close";

const STEP_ILLUSTRATIONS = {
  1: Step1Identity,
  2: Step2Track,
  3: Step3Score,
  4: Step4Alert,
  5: Step5Close,
};

// Short labels for the NFC card foil-stamp + nameplate location.
// Card design uses ALL-CAPS letter-spaced labels — these are decorative
// elements, not user copy, so they stay in English across all languages.
const PROJECT_SHORT_LABEL = {
  canada: "VISTA · 2026",
  gulf: "AL NOOR · 2026",
  usa: "SKYLINE · 2026",
  mexico: "DEL SOL · 2026",
};

const COUNTRY_SHORT_LABEL = {
  canada: "CANADA",
  gulf: "KSA",
  usa: "USA",
  mexico: "MEXICO",
};

function withTokens(template, values) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => values?.[key] ?? "");
}

export default function TutorialStep({ stepNumber, totalSteps, regionId }) {
  const t = useTranslation("fiveMinuteProof");

  const personaName = useMemo(() => {
    const personas = getPersonas("real_estate", regionId);
    const vipInvestor = personas.find((person) => person.type === "vip") || personas[0];
    return vipInvestor?.name || "Khalid Al-Rashid";
  }, [regionId]);

  // City label from the same source RegionMorphLoader uses.
  // Falls back to "VANCOUVER · CANADA" so the SVG never renders empty.
  const { projectLabel, locationLabel } = useMemo(() => {
    const mapData = getRealEstateMapRegionData();
    const city = mapData[regionId]?.city || "Vancouver";
    const country = COUNTRY_SHORT_LABEL[regionId] || "CANADA";
    return {
      projectLabel: PROJECT_SHORT_LABEL[regionId] || PROJECT_SHORT_LABEL.canada,
      locationLabel: `${city.toUpperCase()} · ${country}`,
    };
  }, [regionId]);

  const steps = t("steps");
  const step = Array.isArray(steps) ? steps[stepNumber - 1] : null;
  const Illustration = STEP_ILLUSTRATIONS[stepNumber] || Step1Identity;
  const progressText = withTokens(t("progress"), { current: stepNumber, total: totalSteps });
  const stepLabel = step?.label || "";
  const stepBody = withTokens(step?.body, { persona: personaName });

  return (
    <div className="fmp-step fmp-step-enter">
      <div className="fmp-illustration">
        <Illustration
          personaName={personaName}
          projectLabel={projectLabel}
          locationLabel={locationLabel}
        />
      </div>
      <div className="fmp-step__label">{progressText} - {stepLabel}</div>
      <p className="fmp-step__body">{stepBody}</p>
    </div>
  );
}
