import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../../../i18n";
import "../../../i18n/portals/fiveMinuteProof";
import TutorialStep from "./TutorialStep";
import TutorialNav from "./TutorialNav";
import "./FiveMinuteProof.css";

function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

export default function FiveMinuteProof({
  tutorialState,
  tutorialLoaded,
  onDismiss,
  onComplete,
  regionId,
  lang,
}) {
  const t = useTranslation("fiveMinuteProof");
  const [expanded, setExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  useEffect(() => {
    if (!tutorialLoaded) return;
    const isFirstTime = !tutorialState;
    const isPending = tutorialState && !tutorialState.dismissed && !tutorialState.completedAt;
    if (isFirstTime || isPending) {
      setExpanded(true);
      setCurrentStep(1);
    }
  }, [tutorialLoaded, tutorialState]);

  const cardSubtitle = useMemo(() => t("card.subtitle"), [t, lang]);

  const openTutorial = () => {
    setCurrentStep(1);
    setExpanded(true);
  };

  const handleClose = async () => {
    await onDismiss?.();
    setExpanded(false);
    setCurrentStep(1);
  };

  const handleFinish = async () => {
    await onComplete?.();
    setExpanded(false);
    setCurrentStep(1);
  };

  return (
    <div className="fmp-root">
      {!expanded ? (
        <button type="button" className="fmp-banner" onClick={openTutorial}>
          <span className="fmp-banner__meta">
            <EyeIcon className="fmp-banner__icon" aria-hidden="true" />
            <span className="fmp-banner__title">{t("banner.title")}</span>
          </span>
          <span className="fmp-banner__cta">{t("banner.cta")} -&gt;</span>
        </button>
      ) : (
        <div className="fmp-card-wrap">
          <div className="fmp-card" data-region={regionId}>
            <div className="fmp-card__header">
              <div>
                <h3 className="fmp-card__title">{t("card.title")}</h3>
                <p className="fmp-card__subtitle">{cardSubtitle}</p>
              </div>
              <button type="button" className="fmp-card__close" aria-label={t("card.closeAria")} onClick={handleClose}>
                <CloseIcon width="16" height="16" />
              </button>
            </div>

            <div className="fmp-card__body">
              <TutorialStep
                stepNumber={currentStep}
                totalSteps={totalSteps}
                regionId={regionId}
              />
              <TutorialNav
                currentStep={currentStep}
                totalSteps={totalSteps}
                onBack={() => setCurrentStep((s) => Math.max(1, s - 1))}
                onNext={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
                onFinish={handleFinish}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
