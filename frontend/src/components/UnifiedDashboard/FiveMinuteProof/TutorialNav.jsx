import { useTranslation } from "../../../i18n";

function withTokens(template, values) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => values?.[key] ?? "");
}

export default function TutorialNav({ currentStep, totalSteps, onBack, onNext, onFinish }) {
  const t = useTranslation("fiveMinuteProof");

  return (
    <div className="fmp-nav">
      <div className="fmp-nav__dots">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isVisited = step <= currentStep;
          const isCurrent = step === currentStep;
          return (
            <button
              key={step}
              type="button"
              className={`fmp-nav__dot ${isVisited ? "fmp-nav__dot--active" : ""} ${isCurrent ? "fmp-nav__dot--current" : ""}`}
              aria-label={withTokens(t("progress"), { current: step, total: totalSteps })}
              aria-current={isCurrent ? "step" : undefined}
              tabIndex={-1}
            />
          );
        })}
      </div>

      <div className="fmp-nav__actions">
        <button type="button" className="fmp-nav__back" disabled={currentStep === 1} onClick={onBack}>
          {t("back")}
        </button>
        {currentStep < totalSteps ? (
          <button type="button" className="fmp-nav__next" onClick={onNext}>
            {t("next")} -&gt;
          </button>
        ) : (
          <button type="button" className="fmp-nav__finish" onClick={onFinish}>
            {t("finish")}
          </button>
        )}
      </div>
    </div>
  );
}
