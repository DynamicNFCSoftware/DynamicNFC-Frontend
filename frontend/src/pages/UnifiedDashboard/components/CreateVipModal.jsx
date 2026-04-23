import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";

export default function CreateVipModal({ onClose, onSubmit }) {
  const { lang } = useLanguage();
  useSector();
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    campaign: "",
    cardId: "",
    notes: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.fullName.trim()) return;
    onSubmit(form);
    onClose();
  };

  const fields = [
    { key: "fullName", label: { en: "Full Name", ar: "الاسم الكامل", fr: "Nom complet" }, type: "text", required: true },
    { key: "email", label: { en: "Email", ar: "البريد الإلكتروني", fr: "E-mail" }, type: "email" },
    { key: "phone", label: { en: "Phone", ar: "الهاتف", fr: "Téléphone" }, type: "tel" },
    { key: "campaign", label: { en: "Campaign", ar: "الحملة", fr: "Campagne" }, type: "text" },
    { key: "cardId", label: { en: "Card ID", ar: "معرف البطاقة", fr: "ID carte" }, type: "text", placeholder: "e.g. VISTA005" },
    { key: "notes", label: { en: "Notes", ar: "ملاحظات", fr: "Notes" }, type: "textarea" },
  ];

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector("button, input, textarea, select")?.focus();
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

  return (
    <div className="ud-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="ud-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-vip-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ud-modal-header">
          <h3 id="create-vip-modal-title" className="ud-modal-title">
            {({ en: "Create New VIP", ar: "إنشاء VIP جديد", es: "Crear nuevo VIP", fr: "Créer un nouveau VIP" }[lang] || "Create New VIP")}
          </h3>
          <button className="ud-modal-close" onClick={onClose} type="button" aria-label={({ en: "Close", ar: "إغلاق", es: "Cerrar", fr: "Fermer" }[lang] || "Close")}>
            ×
          </button>
        </div>

        <div className="ud-modal-body">
          <p style={{ fontSize: 12, color: "var(--ud-text-muted)", marginBottom: 16 }}>
            {({
              en: "By issuing a VIP card, the client receives a premium invitation box signaling exclusive access. This supports consent and VIP status.",
              ar: "عن طريق إصدار بطاقة VIP، يتلقى العميل صندوق دعوة مميز يدعم الموافقة والمكانة المميزة.",
              es: "Al emitir una tarjeta VIP, el cliente recibe una caja de invitacion premium que senala acceso exclusivo. Esto respalda el consentimiento y el estado VIP.",
              fr: "En émettant une carte VIP, le client reçoit un coffret d'invitation premium signalant un accès exclusif. Cela renforce le consentement et le statut VIP.",
            }[lang] || "By issuing a VIP card, the client receives a premium invitation box signaling exclusive access. This supports consent and VIP status.")}
          </p>

          {fields.map((f) => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "var(--ud-text-secondary)", display: "block", marginBottom: 4 }}>
                {f.label[lang] || f.label.en}
                {f.required && <span style={{ color: "#e63946" }}> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--ud-border)",
                    background: "var(--ud-bg-secondary)",
                    color: "var(--ud-text)",
                    fontSize: 13,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              ) : (
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder || ""}
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
              )}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="ud-btn-theme"
            type="button"
            style={{ width: "100%", marginTop: 8 }}
          >
            {({ ar: "حفظ", es: "Guardar", en: "Save VIP", fr: "Enregistrer VIP" }[lang] || "Save VIP")}
          </button>
        </div>
      </div>
    </div>
  );
}