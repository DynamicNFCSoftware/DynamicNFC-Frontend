import { useMemo } from "react";
import { useTranslation } from "../../../i18n";
import { getPersonas } from "../../../config/regionConfig";
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

  const steps = t("steps");
  const step = Array.isArray(steps) ? steps[stepNumber - 1] : null;
  const Illustration = STEP_ILLUSTRATIONS[stepNumber] || Step1Identity;
  const progressText = withTokens(t("progress"), { current: stepNumber, total: totalSteps });
  const stepLabel = step?.label || "";
  const stepBody = withTokens(step?.body, { persona: personaName });

  return (
    <div className="fmp-step fmp-step-enter">
      <div className="fmp-illustration">
        <Illustration />
      </div>
      <div className="fmp-step__label">{progressText} - {stepLabel}</div>
      <p className="fmp-step__body">{stepBody}</p>
    </div>
  );
}
