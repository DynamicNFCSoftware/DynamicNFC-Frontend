import { useEffect } from "react";

export default function HelpModal({ open, onClose, tx }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ud-modal-overlay" onClick={onClose}>
      <div className="ud-modal ud-help-modal" onClick={(event) => event.stopPropagation()}>
        <div className="ud-modal-header">
          <h3 className="ud-modal-title">{tx.helpTitle}</h3>
          <button type="button" className="ud-modal-close" onClick={onClose} aria-label={tx.close}>
            ×
          </button>
        </div>
        <div className="ud-modal-body">
          <div className="ud-help-modal-section">
            <div className="ud-help-modal-heading">{tx.helpVipHeading}</div>
            <p className="ud-help-modal-text">{tx.helpVipBody}</p>
          </div>
          <div className="ud-help-modal-section">
            <div className="ud-help-modal-heading">{tx.helpStandardHeading}</div>
            <p className="ud-help-modal-text">{tx.helpStandardBody}</p>
          </div>
          <div className="ud-help-modal-section ud-help-modal-section--rule">
            <div className="ud-help-modal-heading">{tx.helpRuleHeading}</div>
            <p className="ud-help-modal-text">{tx.helpRuleBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
