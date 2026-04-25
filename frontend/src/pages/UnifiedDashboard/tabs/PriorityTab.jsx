import { useCallback, useMemo, useState } from "react";
import { useLanguage, useTranslation } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { useDashboard } from "../useDashboard";
import AiBadge from "../components/AiBadge";
import LeadBadge from "../components/LeadBadge";
import { SkeletonTable } from "../components/LoadingSkeleton";

const UI = {
  en: {
    section: "Priority VIP List",
    rank: "#",
    name: "Name",
    score: "Score",
    triggers: "Triggers",
    idle: "Idle",
    action: "Action",
    call: "Call",
    closeDetail: "Close",
    aiAdvice: "AI Recommendation",
    whyNow: "Why act now?",
    behaviorSummary: "Behavior Summary",
    sessions: "Sessions",
    events: "Events",
    topInterest: "Top Interest",
    riskLevel: "Risk Level",
    highRisk: "High Risk",
    mediumRisk: "Medium Risk",
    lowRisk: "Low Risk",
    suggestedScript: "Suggested Script",
    reachOut: "Reach Out",
    viewProfile: "View Full Profile",
  },
  ar: {
    section: "قائمة VIP ذات الأولوية",
    rank: "#",
    name: "الاسم",
    score: "الدرجة",
    triggers: "المحفزات",
    idle: "خمول",
    action: "الإجراء",
    call: "اتصال",
    closeDetail: "إغلاق",
    aiAdvice: "توصية ذكية",
    whyNow: "لماذا التصرف الآن؟",
    behaviorSummary: "ملخص السلوك",
    sessions: "جلسات",
    events: "تفاعلات",
    topInterest: "أعلى اهتمام",
    riskLevel: "مستوى المخاطر",
    highRisk: "مخاطر عالية",
    mediumRisk: "مخاطر متوسطة",
    lowRisk: "مخاطر منخفضة",
    suggestedScript: "نص مقترح",
    reachOut: "تواصل",
    viewProfile: "عرض الملف الكامل",
  },
  es: {
    section: "Lista VIP prioritaria",
    rank: "#",
    name: "Nombre",
    score: "Score",
    triggers: "Triggers",
    idle: "Inactivo",
    action: "Accion",
    call: "Llamar",
    closeDetail: "Cerrar",
    aiAdvice: "Recomendacion IA",
    whyNow: "Por que actuar ahora?",
    behaviorSummary: "Resumen de comportamiento",
    sessions: "Sesiones",
    events: "Eventos",
    topInterest: "Interes principal",
    riskLevel: "Nivel de riesgo",
    highRisk: "Alto riesgo",
    mediumRisk: "Riesgo medio",
    lowRisk: "Bajo riesgo",
    suggestedScript: "Guion sugerido",
    reachOut: "Contactar",
    viewProfile: "Ver perfil completo",
  },
  fr: {
    section: "Liste VIP prioritaire",
    rank: "#",
    name: "Nom",
    score: "Score",
    triggers: "Déclencheurs",
    idle: "Inactif",
    action: "Action",
    call: "Appeler",
    closeDetail: "Fermer",
    aiAdvice: "Recommandation IA",
    whyNow: "Pourquoi agir maintenant ?",
    behaviorSummary: "Résumé comportemental",
    sessions: "Sessions",
    events: "Événements",
    topInterest: "Intérêt principal",
    riskLevel: "Niveau de risque",
    highRisk: "Risque élevé",
    mediumRisk: "Risque moyen",
    lowRisk: "Risque faible",
    suggestedScript: "Script suggéré",
    reachOut: "Contacter",
    viewProfile: "Voir le profil complet",
  },
};

// AI-driven advice engine — generates contextual recommendations per VIP
function generateAdvice(vip, lang) {
  const advice = [];
  const name = vip.name?.split(" ")[0] || "VIP";

  if (vip.atRisk) {
    advice.push({
      icon: "🚨",
      severity: "high",
      text: {
        en: `${name} has been inactive for ${vip.velocity?.idleDays || 0} days and is at risk of churning. Immediate personal outreach recommended — reference their interest in ${vip.topItem || "your top unit"}.`,
        ar: `${name} غير نشط منذ ${vip.velocity?.idleDays || 0} يوم ومعرض لخطر الفقدان. يُنصح بالتواصل الشخصي الفوري — اذكر اهتمامه بـ${vip.topItem || "الوحدة المميزة"}.`,
        es: `${name} lleva ${vip.velocity?.idleDays || 0} dias inactivo y esta en riesgo. Se recomienda contacto personal inmediato — menciona su interes en ${vip.topItem || "la unidad principal"}.`,
        fr: `${name} est inactif depuis ${vip.velocity?.idleDays || 0} jours et risque de partir. Contact personnel immédiat recommandé — mentionnez son intérêt pour ${vip.topItem || "l'unité principale"}.`,
      }[lang] || `${name} is at risk. Immediate outreach recommended.`,
    });
  }

  if (vip.triggers?.some((t) => t.type === "pricing_3x")) {
    advice.push({
      icon: "💰",
      severity: "high",
      text: {
        en: `${name} viewed pricing 3+ times — strong purchase intent. Send a personalized payment plan with urgency incentive (limited availability or price lock).`,
        ar: `${name} شاهد التسعير أكثر من 3 مرات — نية شراء قوية. أرسل خطة دفع مخصصة مع حافز عاجل.`,
        es: `${name} vio precios mas de 3 veces — alta intencion de compra. Envia un plan de pago personalizado con incentivo de urgencia.`,
        fr: `${name} a consulté les prix plus de 3 fois — forte intention d'achat. Envoyez un plan de paiement personnalisé avec incitation à l'urgence.`,
      }[lang] || `${name} shows strong purchase intent. Send payment plan.`,
    });
  }

  if (vip.triggers?.some((t) => t.type === "booking_request")) {
    advice.push({
      icon: "📋",
      severity: "medium",
      text: {
        en: `${name} requested a viewing/booking. Confirm within 2 hours to maintain momentum. Prepare unit-specific materials in advance.`,
        ar: `${name} طلب معاينة/حجز. أكد خلال ساعتين للحفاظ على الزخم. جهّز مواد خاصة بالوحدة مسبقاً.`,
        es: `${name} solicito una visita. Confirma en 2 horas para mantener el impulso. Prepara materiales especificos.`,
        fr: `${name} a demandé une visite. Confirmez sous 2 heures pour maintenir l'élan. Préparez les documents spécifiques.`,
      }[lang] || `${name} booked a viewing. Confirm promptly.`,
    });
  }

  if (vip.triggers?.some((t) => t.type === "idle_warning")) {
    advice.push({
      icon: "⏰",
      severity: "medium",
      text: {
        en: `${name} has gone quiet after initial interest. Send a "thinking of you" touchpoint — new project update, market insight, or exclusive preview.`,
        ar: `${name} توقف عن التفاعل بعد اهتمام أولي. أرسل رسالة "نفكر بك" — تحديث مشروع، رؤية سوقية، أو معاينة حصرية.`,
        es: `${name} dejo de interactuar tras interes inicial. Envia un mensaje de seguimiento — actualizacion, insight de mercado o vista previa exclusiva.`,
        fr: `${name} s'est tu après un intérêt initial. Envoyez un message de suivi — mise à jour, aperçu exclusif ou étude de marché.`,
      }[lang] || `${name} went quiet. Send a touchpoint.`,
    });
  }

  if (vip.score >= 80 && advice.length === 0) {
    advice.push({
      icon: "🔥",
      severity: "high",
      text: {
        en: `${name} is a hot lead (score ${vip.score}). They're highly engaged — prioritize direct contact. Consider VIP-exclusive offer or private viewing.`,
        ar: `${name} عميل ساخن (درجة ${vip.score}). مشاركة عالية — أولوية التواصل المباشر. فكر بعرض حصري أو معاينة خاصة.`,
        es: `${name} es un lead caliente (score ${vip.score}). Alta participacion — prioriza contacto directo. Considera oferta VIP exclusiva.`,
        fr: `${name} est un lead chaud (score ${vip.score}). Très engagé — priorisez le contact direct. Envisagez une offre VIP exclusive.`,
      }[lang] || `${name} is highly engaged. Prioritize contact.`,
    });
  }

  if (advice.length === 0) {
    advice.push({
      icon: "📊",
      severity: "low",
      text: {
        en: `${name} is in monitoring mode. Continue nurturing with relevant content. Watch for engagement spikes.`,
        ar: `${name} في وضع المراقبة. استمر بالرعاية بمحتوى ذي صلة. راقب أي ارتفاع في التفاعل.`,
        es: `${name} esta en modo monitoreo. Continua nutriendo con contenido relevante. Observa picos de actividad.`,
        fr: `${name} est en mode surveillance. Continuez à nourrir avec du contenu pertinent. Surveillez les pics d'engagement.`,
      }[lang] || `${name} is in monitoring mode.`,
    });
  }

  return advice;
}

function generateScript(vip, lang) {
  const name = vip.name?.split(" ")[0] || "VIP";
  const unit = vip.topItem || "";
  if (vip.atRisk) {
    return {
      en: `"Hi ${name}, I noticed it's been a while since we connected. I wanted to personally share some exciting updates about ${unit || "our latest offerings"}. Would you have 10 minutes this week for a quick call?"`,
      ar: `"مرحباً ${name}، لاحظت أنه مر وقت منذ آخر تواصل. أردت أن أشاركك شخصياً بعض التحديثات المثيرة حول ${unit || "أحدث عروضنا"}. هل لديك 10 دقائق هذا الأسبوع لمكالمة سريعة؟"`,
      es: `"Hola ${name}, note que ha pasado un tiempo desde nuestra ultima conversacion. Queria compartir personalmente algunas novedades sobre ${unit || "nuestras ultimas ofertas"}. Tienes 10 minutos esta semana?"`,
      fr: `"Bonjour ${name}, j'ai remarqué que cela fait un moment que nous n'avons pas échangé. Je souhaitais vous partager personnellement des nouveautés sur ${unit || "nos dernières offres"}. Auriez-vous 10 minutes cette semaine ?"`,
    }[lang] || `"Hi ${name}, I'd like to share some updates about ${unit}. Do you have 10 minutes this week?"`;
  }
  if (vip.score >= 70) {
    return {
      en: `"${name}, based on your interest in ${unit}, I've prepared an exclusive overview just for you — including availability, payment options, and a virtual walkthrough. When would be a good time to walk you through it?"`,
      ar: `"${name}، بناءً على اهتمامك بـ${unit}، أعددت نظرة عامة حصرية لك — تشمل التوفر وخيارات الدفع وجولة افتراضية. متى يناسبك لنستعرضها معاً؟"`,
      es: `"${name}, basado en tu interes en ${unit}, prepare una vista exclusiva para ti — incluyendo disponibilidad, opciones de pago y recorrido virtual. Cuando te conviene revisarlo?"`,
      fr: `"${name}, suite à votre intérêt pour ${unit}, j'ai préparé un aperçu exclusif — disponibilité, options de paiement et visite virtuelle. Quand souhaitez-vous en discuter ?"`,
    }[lang] || `"${name}, I've prepared an exclusive overview of ${unit} for you."`;
  }
  return {
    en: `"Hi ${name}, I wanted to check in and see if there's anything I can help with regarding your search. We have some new options that might interest you."`,
    ar: `"مرحباً ${name}، أردت الاطمئنان ومعرفة إن كان بإمكاني مساعدتك في بحثك. لدينا بعض الخيارات الجديدة التي قد تهمك."`,
    es: `"Hola ${name}, queria saber si puedo ayudarte con tu busqueda. Tenemos nuevas opciones que podrian interesarte."`,
    fr: `"Bonjour ${name}, je souhaitais prendre de vos nouvelles. Nous avons de nouvelles options qui pourraient vous intéresser."`,
  }[lang] || `"Hi ${name}, checking in with some new options for you."`;
}

export default function PriorityTab() {
  const { config, st } = useSector();
  const { lang } = useLanguage();
  const [ownerFilter, setOwnerFilter] = useState(null);
  const [expandedVipId, setExpandedVipId] = useState(null);
  const { vips, loading, salesReps, thresholds } = useDashboard();
  const tx = { ...UI.en, ...(UI[lang] || {}) };
  const tEventDisplay = useTranslation("eventDisplay");
  const fromEventDisplay = (code) => {
    const key = `eventDisplay.${code}`;
    const translated = tEventDisplay(key);
    return translated === key ? String(code || "").replace(/_/g, " ") : translated;
  };

  const getNextAction = (vip) => {
    if (vip.atRisk) return ({ ar: "اتصل فوراً — خطر فقدان", es: "Llamar ahora — alto riesgo", en: "Call now — at risk of losing", fr: "Appeler maintenant — risque de perte" }[lang] || "Call now — at risk of losing");
    if (vip.triggers?.some((t) => t.type === "pricing_3x")) return ({ ar: "أرسل خطة دفع", es: "Enviar plan de pago", en: "Send payment plan", fr: "Envoyer le plan de paiement" }[lang] || "Send payment plan");
    if (vip.triggers?.some((t) => t.type === "booking_request")) return ({ ar: "أكد الموعد", es: "Confirmar cita", en: "Confirm appointment", fr: "Confirmer le rendez-vous" }[lang] || "Confirm appointment");
    if ((vip.velocity?.idleDays || 0) >= 3) return ({ ar: "أرسل تذكير", es: "Enviar recordatorio", en: "Send reminder", fr: "Envoyer un rappel" }[lang] || "Send reminder");
    return ({ ar: "راقب", es: "Monitorear", en: "Monitor", fr: "Surveiller" }[lang] || "Monitor");
  };

  const filteredVips = useMemo(() => {
    if (!ownerFilter) return vips || [];
    const rep = (salesReps || []).find((r) => r.id === ownerFilter);
    return (vips || []).filter((vip) => vip.assignedRep === ownerFilter || vip.assignedRep === rep?.name);
  }, [ownerFilter, salesReps, vips]);

  const formatDate = (ts) => {
    if (!ts) return "-";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString(lang === "ar" ? "ar-SA" : lang === "es" ? "es-MX" : lang === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleExpand = useCallback((vipId) => {
    setExpandedVipId((prev) => (prev === vipId ? null : vipId));
  }, []);

  if (loading) {
    return <SkeletonTable rows={6} />;
  }

  return (
    <div className="ud-pv">
      {/* Header bar */}
      <div className="ud-pv-header">
        <div className="ud-section-label" style={{ margin: 0 }}>{tx.section}</div>
        <AiBadge text={({ ar: "ترتيب ذكي", es: "Ranking IA", en: "AI-ranked", fr: "Classement IA" }[lang] || "AI-ranked")} />
      </div>

      {/* Owner filter chips */}
      <div className="ud-pv-chips">
        <button onClick={() => setOwnerFilter(null)} className={`ud-pv-chip ${!ownerFilter ? "ud-pv-chip--on" : ""}`} type="button">
          {({ ar: "الكل", es: "Todos", en: "All", fr: "Tous" }[lang] || "All")}
        </button>
        {(salesReps || []).map((rep) => (
          <button
            key={rep.id || rep.name}
            onClick={() => setOwnerFilter(rep.id)}
            className={`ud-pv-chip ${ownerFilter === rep.id ? "ud-pv-chip--on" : ""}`}
            type="button"
          >
            {rep.name}
            <span className="ud-pv-chip__count">{rep.totalVips || 0}</span>
            {(rep.highRisk || 0) > 0 && <span className="ud-pv-chip__risk">{rep.highRisk}</span>}
          </button>
        ))}
      </div>

      {/* List card */}
      <div className="ud-card ud-pv-list">
        {/* Column headers */}
        <div className="ud-pv-colhead" role="row">
          <span className="ud-pv-col ud-pv-col--rank">{tx.rank}</span>
          <span className="ud-pv-col ud-pv-col--name">{tx.name}</span>
          <span className="ud-pv-col ud-pv-col--score">{tx.score}</span>
          <span className="ud-pv-col ud-pv-col--unit">{st(config.vipProfile.topItem)}</span>
          <span className="ud-pv-col ud-pv-col--trigger">{tx.triggers}</span>
          <span className="ud-pv-col ud-pv-col--seen">{st(config.vipProfile.lastSeen)}</span>
          <span className="ud-pv-col ud-pv-col--idle">{tx.idle}</span>
          <span className="ud-pv-col ud-pv-col--next">{({ ar: "الإجراء التالي", es: "Siguiente accion", en: "Next action", fr: "Prochaine action" }[lang] || "Next action")}</span>
          <span className="ud-pv-col ud-pv-col--action">{tx.action}</span>
        </div>

        {/* VIP rows */}
        {filteredVips.length === 0 && (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--ud-text-muted)", fontSize: 13 }}>
            {({ en: "No VIPs found", ar: "لا يوجد VIP", es: "Sin VIPs", fr: "Aucun VIP trouvé" }[lang] || "No VIPs found")}
          </div>
        )}

        {filteredVips.map((vip, i) => {
          const isExpanded = expandedVipId === vip.id;
          const advice = isExpanded ? generateAdvice(vip, lang) : [];
          const script = isExpanded ? generateScript(vip, lang) : "";
          const riskLevel = vip.atRisk ? "high" : vip.score >= 50 ? "medium" : "low";

          return (
            <div key={vip.id} className={`ud-pv-item ${isExpanded ? "ud-pv-item--open" : ""}`}>
              {/* Clickable row */}
              <div
                className="ud-pv-row"
                onClick={() => toggleExpand(vip.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpand(vip.id); } }}
              >
                <span className="ud-pv-col ud-pv-col--rank" style={i === 0 ? { color: "#e63946", fontWeight: 800 } : undefined}>{i + 1}</span>
                <span className="ud-pv-col ud-pv-col--name">{vip.name}</span>
                <span className="ud-pv-col ud-pv-col--score"><LeadBadge score={vip.score} thresholds={thresholds} /></span>
                <span className="ud-pv-col ud-pv-col--unit">{vip.topItem || "-"}</span>
                <span className="ud-pv-col ud-pv-col--trigger">
                  {vip.triggers && vip.triggers.length > 0 ? (
                    <span className={`ud-pv-trigger ud-pv-trigger--${vip.triggers[0].severity || "med"}`}>
                      {vip.triggers[0].icon} {fromEventDisplay(vip.triggers[0].type)}
                    </span>
                  ) : <span style={{ color: "var(--ud-text-muted)" }}>—</span>}
                </span>
                <span className="ud-pv-col ud-pv-col--seen">{formatDate(vip.lastSeen)}</span>
                <span className={`ud-pv-col ud-pv-col--idle ${vip.atRisk ? "ud-pv-col--danger" : ""}`}>
                  {vip.velocity?.idleDays || 0}{lang === "ar" ? " يوم" : lang === "fr" ? " j" : lang === "es" ? " d" : "d"}
                  {vip.atRisk && " ⚠️"}
                </span>
                <span className={`ud-pv-col ud-pv-col--next ${vip.atRisk ? "ud-pv-col--danger" : ""}`}>{getNextAction(vip)}</span>
                <span className="ud-pv-col ud-pv-col--action">
                  <button type="button" className="ud-pv-call-btn" onClick={(e) => e.stopPropagation()}>{tx.call}</button>
                </span>
              </div>

              {/* Expandable detail panel */}
              {isExpanded && (
                <div className="ud-pv-detail">
                  <div className="ud-pv-detail__grid">
                    {/* Left column — AI advice + script */}
                    <div className="ud-pv-detail__left">
                      <div className="ud-pv-detail__heading"><AiBadge text={tx.aiAdvice} /></div>
                      <div className="ud-pv-detail__label">{tx.whyNow}</div>
                      <div className="ud-pv-advice-list">
                        {advice.map((a, ai) => (
                          <div key={ai} className={`ud-pv-advice ud-pv-advice--${a.severity}`}>
                            <span className="ud-pv-advice__icon">{a.icon}</span>
                            <span className="ud-pv-advice__text">{a.text}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ud-pv-detail__label" style={{ marginTop: 16 }}>{tx.suggestedScript}</div>
                      <div className="ud-pv-script">
                        <p className="ud-pv-script__text">{script}</p>
                        <button type="button" className="ud-copy-btn" onClick={() => navigator.clipboard?.writeText(script)}>
                          {({ en: "Copy", ar: "نسخ", es: "Copiar", fr: "Copier" }[lang] || "Copy")}
                        </button>
                      </div>
                    </div>

                    {/* Right column — behavior + triggers + actions */}
                    <div className="ud-pv-detail__right">
                      <div className="ud-pv-detail__heading">{tx.behaviorSummary}</div>
                      <div className="ud-pv-stats">
                        <div className="ud-pv-stat">
                          <div className="ud-pv-stat__val">{vip.sessions ?? vip.velocity?.totalSessions ?? "-"}</div>
                          <div className="ud-pv-stat__label">{tx.sessions}</div>
                        </div>
                        <div className="ud-pv-stat">
                          <div className="ud-pv-stat__val">{vip.eventCount ?? "-"}</div>
                          <div className="ud-pv-stat__label">{tx.events}</div>
                        </div>
                        <div className="ud-pv-stat">
                          <div className="ud-pv-stat__val">{vip.topItem || "-"}</div>
                          <div className="ud-pv-stat__label">{tx.topInterest}</div>
                        </div>
                        <div className="ud-pv-stat">
                          <div className={`ud-pv-stat__val ud-risk-${riskLevel}`}>
                            {riskLevel === "high" ? tx.highRisk : riskLevel === "medium" ? tx.mediumRisk : tx.lowRisk}
                          </div>
                          <div className="ud-pv-stat__label">{tx.riskLevel}</div>
                        </div>
                      </div>

                      {vip.triggers && vip.triggers.length > 0 && (
                        <div style={{ marginTop: 14 }}>
                          <div className="ud-pv-detail__label">{tx.triggers}</div>
                          <div className="ud-pv-trigger-wrap">
                            {vip.triggers.map((t, ti) => (
                              <span key={ti} className={`ud-pv-trigger ud-pv-trigger--${t.severity || "med"}`}>
                                {t.icon} {fromEventDisplay(t.type)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="ud-pv-detail__actions">
                        <button type="button" className="ud-btn-theme">{tx.reachOut}</button>
                        <button type="button" className="ud-btn-secondary">{tx.viewProfile}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
