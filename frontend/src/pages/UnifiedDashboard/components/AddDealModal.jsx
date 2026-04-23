import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";

export default function AddDealModal({ currency = "AED", campaigns = [], dealStages = [], onClose, onSubmit, onSave }) {
  const { config, st } = useSector();
  const { lang } = useLanguage();
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const stageOptions = useMemo(() => {
    if (!Array.isArray(dealStages) || dealStages.length === 0) return config.pipeline.stages;
    const stageSet = new Set(dealStages);
    const filtered = config.pipeline.stages.filter((stage) => stageSet.has(stage.id));
    return filtered.length > 0 ? filtered : config.pipeline.stages;
  }, [config.pipeline.stages, dealStages]);
  const [form, setForm] = useState({
    name: "",
    item: "",
    value: "",
    stage: stageOptions[0]?.id || "new_lead",
    campaignId: "",
  });
  const closeLabel = (
    {
      en: "Close",
      ar: "إغلاق",
      es: "Cerrar",
      fr: "Fermer",
    }[lang] || "Close"
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const submitHandler = onSubmit || onSave;
    if (!submitHandler) return;
    submitHandler({
      ...form,
      id: `d${Date.now()}`,
      value: parseInt(form.value, 10) || 0,
      score: 0,
    });
    onClose();
  };

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector("button, input, select")?.focus();
    }, 40);
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    if (!stageOptions.some((stage) => stage.id === form.stage)) {
      setForm((prev) => ({ ...prev, stage: stageOptions[0]?.id || "new_lead" }));
    }
  }, [form.stage, stageOptions]);

  return (
    <div className="ud-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="ud-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-deal-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ud-modal-header">
          <h3 id="add-deal-modal-title" className="ud-modal-title">
            {({ en: "Add New Deal", ar: "إضافة صفقة جديدة", es: "Agregar nuevo trato", fr: "Ajouter une affaire" }[lang] || "Add New Deal")}
          </h3>
          <button className="ud-modal-close" onClick={onClose} type="button" aria-label={closeLabel}>
            ×
          </button>
        </div>

        <div className="ud-modal-body">
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "var(--ud-text-secondary)", display: "block", marginBottom: 4 }}>
              {({ en: "Client Name", ar: "اسم العميل", es: "Nombre del cliente", fr: "Nom du client" }[lang] || "Client Name")} <span style={{ color: "#e63946" }}>*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--ud-border)",
                background: "var(--ud-bg-secondary)",
                color: "var(--ud-text)",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "var(--ud-text-secondary)", display: "block", marginBottom: 4 }}>{st(config.inventory.itemLabel)}</label>
            <input
              type="text"
              value={form.item}
              onChange={(e) => handleChange("item", e.target.value)}
              placeholder={`e.g. ${config.inventory?.categories?.[0]?.name?.en || (config.id === "automotive" ? "AMG GT 63 S" : "Penthouse A-1201")}`}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--ud-border)",
                background: "var(--ud-bg-secondary)",
                color: "var(--ud-text)",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "var(--ud-text-secondary)", display: "block", marginBottom: 4 }}>
              {({ en: "Value", ar: "القيمة", es: "Valor", fr: "Valeur" }[lang] || "Value")} ({currency})
            </label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--ud-border)",
                background: "var(--ud-bg-secondary)",
                color: "var(--ud-text)",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "var(--ud-text-secondary)", display: "block", marginBottom: 4 }}>
              {({ en: "Stage", ar: "المرحلة", es: "Etapa", fr: "Étape" }[lang] || "Stage")}
            </label>
            <select
              value={form.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--ud-border)",
                background: "var(--ud-bg-secondary)",
                color: "var(--ud-text)",
                fontSize: 13,
              }}
            >
              {stageOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {st(s.label)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "var(--ud-text-secondary)", display: "block", marginBottom: 4 }}>
              {({ en: "Campaign", ar: "الحملة", es: "Campaña", fr: "Campagne" }[lang] || "Campaign")}
            </label>
            <select
              value={form.campaignId}
              onChange={(e) => handleChange("campaignId", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--ud-border)",
                background: "var(--ud-bg-secondary)",
                color: "var(--ud-text)",
                fontSize: 13,
              }}
            >
              <option value="">
                {({ en: "— No Campaign —", ar: "— بدون حملة —", es: "— Sin Campaña —", fr: "— Sans Campagne —" }[lang] || "— No Campaign —")}
              </option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ud-modal-footer">
          <button
            className="ud-modal-btn ud-modal-btn--secondary"
            onClick={onClose}
            type="button"
          >
            {({ en: "Cancel", ar: "إلغاء", es: "Cancelar", fr: "Annuler" }[lang] || "Cancel")}
          </button>
          <button
            className="ud-modal-btn ud-modal-btn--primary"
            onClick={handleSubmit}
            type="button"
            disabled={!form.name.trim()}
          >
            {({ en: "Create Deal", ar: "إنشاء صفقة", es: "Crear trato", fr: "Créer une affaire" }[lang] || "Create Deal")}
          </button>
        </div>
      </div>
    </div>
  );
}
