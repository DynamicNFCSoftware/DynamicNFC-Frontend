import { useEffect, useRef, useState } from "react";
import { useSector } from "../../../hooks/useSector";
import { useLanguage } from "../../../i18n";

export default function OutreachModal({ vip, onClose }) {
  const [activeTab, setActiveTab] = useState("call");
  const [toast, setToast] = useState(null);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const { config, st } = useSector();
  const { lang } = useLanguage();

  if (!vip) return null;

  const projectName = st(config.identity.defaultProject.name);

  const scripts = {
    call: {
      en: `Hello ${vip.name}, this is [Your Name] from ${projectName}. I noticed you've been exploring ${vip.topItem || "our collection"} — I'd love to walk you through some exclusive options we have available. Would you have 10 minutes this week for a quick call?`,
      ar: `مرحباً ${vip.name}، أنا [اسمك] من ${projectName}. لاحظت اهتمامك بـ ${vip.topItem || "مجموعتنا"} — أود أن أطلعك على بعض الخيارات الحصرية المتاحة. هل لديك 10 دقائق هذا الأسبوع لمكالمة سريعة؟`,
      es: `Hola ${vip.name}, soy [Tu Nombre] de ${projectName}. Vi que estuviste revisando ${vip.topItem || "nuestra coleccion"} y quiero compartirte opciones exclusivas. Tienes 10 minutos esta semana para una llamada rapida?`,
      fr: `Bonjour ${vip.name}, je suis [Votre Nom] de ${projectName}. J'ai remarqué votre intérêt pour ${vip.topItem || "notre collection"} — je peux vous présenter des options exclusives disponibles. Avez-vous 10 minutes cette semaine pour un appel rapide ?`,
    },
    email: {
      en: `Subject: Exclusive Access — ${vip.topItem || projectName}\n\nDear ${vip.name},\n\nThank you for your interest in ${projectName}. Based on your preferences, I've prepared a personalized selection that I believe matches your criteria.\n\nWould you be available for a private viewing this week?\n\nBest regards,\n[Your Name]`,
      ar: `الموضوع: وصول حصري — ${vip.topItem || projectName}\n\nعزيزي ${vip.name}،\n\nشكراً لاهتمامك بـ ${projectName}. بناءً على تفضيلاتك، أعددت مجموعة مخصصة أعتقد أنها تناسب معاييرك.\n\nهل أنت متاح لمعاينة خاصة هذا الأسبوع؟\n\nمع أطيب التحيات،\n[اسمك]`,
      es: `Asunto: Acceso exclusivo — ${vip.topItem || projectName}\n\nHola ${vip.name},\n\nGracias por tu interes en ${projectName}. Segun tus preferencias, prepare una seleccion personalizada para ti.\n\nTe gustaria una visita privada esta semana?\n\nSaludos,\n[Tu Nombre]`,
      fr: `Objet : Accès exclusif — ${vip.topItem || projectName}\n\nBonjour ${vip.name},\n\nMerci pour votre intérêt pour ${projectName}. Selon vos préférences, j'ai préparé une sélection personnalisée qui correspond à vos critères.\n\nSeriez-vous disponible pour une visite privée cette semaine ?\n\nCordialement,\n[Votre Nom]`,
    },
    whatsapp: {
      en: `Hi ${vip.name} 👋 This is [Your Name] from ${projectName}. I see you've been looking at ${vip.topItem || "our options"} — great taste! I have some VIP-only availability I'd love to share. When works best for a quick chat?`,
      ar: `مرحباً ${vip.name} 👋 أنا [اسمك] من ${projectName}. رأيت اهتمامك بـ ${vip.topItem || "خياراتنا"} — ذوق رفيع! لدي بعض الفرص الحصرية لكبار العملاء أود مشاركتها. متى يناسبك محادثة سريعة؟`,
      es: `Hola ${vip.name} 👋 Soy [Tu Nombre] de ${projectName}. Vi tu interes en ${vip.topItem || "nuestras opciones"} — excelente gusto. Tengo disponibilidad VIP para compartir contigo. Cuando te viene bien una charla rapida?`,
      fr: `Bonjour ${vip.name} 👋 Je suis [Votre Nom] de ${projectName}. J'ai vu votre intérêt pour ${vip.topItem || "nos options"} — excellent choix ! J'ai des disponibilités réservées VIP à vous proposer. Quel moment vous convient pour un échange rapide ?`,
    },
  };

  const tabs = [
    { id: "call", label: ({ ar: "اتصال", es: "Llamada", en: "Call Script", fr: "Script d'appel" }[lang] || "Call Script"), icon: "📞" },
    { id: "email", label: ({ ar: "بريد", es: "Correo", en: "Email", fr: "E-mail" }[lang] || "Email"), icon: "✉️" },
    { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  ];

  const activeScript = scripts[activeTab]?.[lang] || scripts[activeTab]?.en;
  const demoPhone = "+966 50 123 4567";

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector("button, a, input, textarea, select")?.focus();
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
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleCall = () => {
    showToast(({ ar: "وضع تجريبي: تمت محاكاة المكالمة", es: "Modo demo: llamada simulada", en: "Demo mode: call simulated", fr: "Mode démo : appel simulé" }[lang] || "Demo mode: call simulated"));
  };

  const handleWhatsApp = () => {
    showToast(({ ar: "وضع تجريبي: تمت محاكاة الرسالة", es: "Modo demo: WhatsApp simulado", en: "Demo mode: WhatsApp simulated", fr: "Mode démo : WhatsApp simulé" }[lang] || "Demo mode: WhatsApp simulated"));
  };

  return (
    <div className="ud-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="ud-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="outreach-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ud-modal-header">
          <h3 id="outreach-modal-title" className="ud-modal-title">
            {({ ar: "التواصل مع", es: "Contactar a", en: "Reach out to", fr: "Contacter" }[lang] || "Reach out to")} {vip.name}
          </h3>
          <button className="ud-modal-close" onClick={onClose} type="button" aria-label={lang === "ar" ? "إغلاق" : lang === "es" ? "Cerrar" : lang === "fr" ? "Fermer" : "Close"}>
            ×
          </button>
        </div>

        <div className="ud-modal-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`ud-modal-tab ${activeTab === tab.id ? "ud-modal-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="ud-modal-body">
          <div style={{ fontSize: 12, color: "var(--ud-text-muted)", marginBottom: 8 }}>
            {({ ar: "رقم التواصل التجريبي", es: "Numero de contacto demo", en: "Demo contact number", fr: "Numéro de contact démo" }[lang] || "Demo contact number")}: {demoPhone}
          </div>
          <pre className="ud-script-text">{activeScript}</pre>
          <button
            className="ud-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(activeScript);
              showToast(({ ar: "تم نسخ النص", es: "Texto copiado", en: "Copied to clipboard", fr: "Copié dans le presse-papiers" }[lang] || "Copied to clipboard"));
            }}
            type="button"
          >
            {({ ar: "نسخ", es: "Copiar", en: "Copy", fr: "Copier" }[lang] || "Copy")}
          </button>
        </div>

        <div className="ud-modal-actions" style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button type="button" className="ud-btn-secondary" onClick={onClose}>
            {({ ar: "إغلاق", es: "Cerrar", en: "Close", fr: "Fermer" }[lang] || "Close")}
          </button>
        </div>
      </div>
      {toast && <div className="ud-toast">{toast}</div>}
    </div>
  );
}