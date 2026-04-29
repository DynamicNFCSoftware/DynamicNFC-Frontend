import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage, useTranslation } from "../../../i18n";
import { getEventLabel } from "../../../i18n/eventDisplayMap";
import { useSector } from "../../../hooks/useSector";
import { useRegion } from "../../../hooks/useRegion";
import { useDashboard } from "../useDashboard";
import BehavioralTimeline from "../components/BehavioralTimeline";
import CreateVipModal from "../components/CreateVipModal";
import OutreachModal from "../components/OutreachModal";
import { SkeletonCard } from "../components/LoadingSkeleton";

const UI = {
  en: {
    section: "VIP CRM",
    search: "Search VIPs...",
    addVip: "Add VIP",
    vipCount: "VIPs",
    sessions: "Sessions",
    events: "Events",
    topUnit: "Top unit",
    idle: "Idle",
    why: "Why call now?",
    cta: "CTA breakdown",
    timeline: "Behavioral timeline",
    select: "Select a VIP to view their profile",
    candidates: "VIP candidates",
    promote: "Promote →",
    reachOut: "Reach out",
    reissue: "Reissue link",
    eventsLabel: "events",
    noTriggers: "No active trigger yet",
    noCta: "No CTA activity yet",
    noResults: "No matching VIPs",
    notAvailable: "—",
    trigger_booking_request: "Booking request",
    trigger_high_velocity: "High velocity",
    trigger_repeat_visitor: "Repeat visitor",
    trigger_pricing_3x: "Pricing viewed x3",
    trigger_pricing_viewed_3x: "Pricing viewed x3",
    trigger_idle_warning: "Idle warning",
    cta_contact_agent: "Contact agent",
    cta_book_viewing: "Book viewing",
    cta_request_pricing: "Request pricing",
    cta_download_brochure: "Download brochure",
    cta_request_quote: "Request quote",
    leadScore: "LEAD SCORE",
    high: "HIGH",
    collapseList: "Collapse list",
    expandList: "Expand list",
    walkInProspect: "Walk-in Prospect",
    promoteFirst: "Promote first to view full profile",
    cancel: "Cancel",
    promoteWalkInTitle: "Promote Walk-in to VIP?",
    promoteWalkInBody: "This will move the candidate to your VIP list. The lead will be tagged for priority follow-up.",
    promoteConfirm: "Promote",
    vipPromotedSuccess: "VIP promoted successfully - Walk-in Prospect added to your VIP list",
  },
  ar: {
    section: "إدارة VIP",
    search: "بحث VIP...",
    addVip: "إضافة VIP",
    vipCount: "عملاء VIP",
    sessions: "جلسات",
    events: "تفاعلات",
    topUnit: "أعلى وحدة",
    idle: "خمول",
    why: "لماذا الاتصال الآن؟",
    cta: "توزيع الإجراءات",
    timeline: "الخط الزمني للسلوك",
    select: "اختر VIP من القائمة",
    candidates: "مرشحون للترقية",
    promote: "ترقية →",
    reachOut: "تواصل",
    reissue: "إعادة إصدار الرابط",
    eventsLabel: "تفاعل",
    noTriggers: "لا توجد محفزات نشطة",
    noCta: "لا توجد نشاطات CTA بعد",
    noResults: "لا توجد نتائج مطابقة",
    notAvailable: "—",
    trigger_booking_request: "طلب حجز",
    trigger_high_velocity: "سرعة تفاعل عالية",
    trigger_repeat_visitor: "زائر متكرر",
    trigger_pricing_3x: "مشاهدة السعر 3 مرات",
    trigger_pricing_viewed_3x: "مشاهدة السعر 3 مرات",
    trigger_idle_warning: "تنبيه خمول",
    cta_contact_agent: "التواصل مع الوكيل",
    cta_book_viewing: "حجز معاينة",
    cta_request_pricing: "طلب تسعير",
    cta_download_brochure: "تحميل البروشور",
    cta_request_quote: "طلب عرض سعر",
    leadScore: "نقاط الاهتمام",
    high: "مرتفع",
    collapseList: "طي القائمة",
    expandList: "توسيع القائمة",
    walkInProspect: "عميل محتمل زائر",
    promoteFirst: "قم بالترقية أولاً لعرض الملف الكامل",
    cancel: "إلغاء",
    promoteWalkInTitle: "ترقية الزائر إلى VIP؟",
    promoteWalkInBody: "سيؤدي ذلك إلى نقل المرشح إلى قائمة VIP الخاصة بك مع وسمه بمتابعة ذات أولوية.",
    promoteConfirm: "ترقية",
    vipPromotedSuccess: "تمت الترقية بنجاح - تمت إضافة الزائر إلى قائمة VIP",
  },
  es: {
    section: "CRM VIP",
    search: "Buscar VIP...",
    addVip: "Agregar VIP",
    vipCount: "VIPs",
    sessions: "Sesiones",
    events: "Eventos",
    topUnit: "Unidad top",
    idle: "Inactivo",
    why: "Por que llamar ahora?",
    cta: "Desglose de CTA",
    timeline: "Timeline de comportamiento",
    select: "Selecciona un VIP para ver su perfil",
    candidates: "Candidatos VIP",
    promote: "Promover →",
    reachOut: "Contactar",
    reissue: "Reemitir enlace",
    eventsLabel: "eventos",
    noTriggers: "Sin triggers activos",
    noCta: "Sin actividad CTA aun",
    noResults: "No hay coincidencias",
    notAvailable: "—",
    trigger_booking_request: "Solicitud de visita",
    trigger_high_velocity: "Alta velocidad",
    trigger_repeat_visitor: "Visitante recurrente",
    trigger_pricing_3x: "Precio visto x3",
    trigger_pricing_viewed_3x: "Precio visto x3",
    trigger_idle_warning: "Alerta de inactividad",
    cta_contact_agent: "Contactar asesor",
    cta_book_viewing: "Reservar visita",
    cta_request_pricing: "Solicitar precio",
    cta_download_brochure: "Descargar brochure",
    cta_request_quote: "Solicitar cotizacion",
    leadScore: "PUNTAJE LEAD",
    high: "ALTO",
    collapseList: "Colapsar lista",
    expandList: "Expandir lista",
    walkInProspect: "Prospecto de visita",
    promoteFirst: "Promociona primero para ver el perfil completo",
    cancel: "Cancelar",
    promoteWalkInTitle: "¿Promover visitante a VIP?",
    promoteWalkInBody: "Esto movera al candidato a tu lista VIP y se marcara para seguimiento prioritario.",
    promoteConfirm: "Promover",
    vipPromotedSuccess: "VIP promovido correctamente - Prospecto espontaneo agregado a la lista VIP",
  },
  fr: {
    section: "CRM VIP",
    search: "Rechercher des VIP...",
    addVip: "Ajouter VIP",
    vipCount: "VIP",
    sessions: "Sessions",
    events: "Evenements",
    topUnit: "Unite principale",
    idle: "Inactif",
    why: "Pourquoi appeler maintenant ?",
    cta: "Repartition des CTA",
    timeline: "Chronologie comportementale",
    select: "Selectionnez un VIP pour afficher son profil",
    candidates: "Candidats VIP",
    promote: "Promouvoir →",
    reachOut: "Contacter",
    reissue: "Reemettre le lien",
    eventsLabel: "evenements",
    noTriggers: "Aucun declencheur actif",
    noCta: "Aucune activite CTA",
    noResults: "Aucun VIP correspondant",
    notAvailable: "—",
    trigger_booking_request: "Demande de visite",
    trigger_high_velocity: "Velocite elevee",
    trigger_repeat_visitor: "Visiteur recurrent",
    trigger_pricing_3x: "Prix consulte x3",
    trigger_pricing_viewed_3x: "Prix consulte x3",
    trigger_idle_warning: "Alerte inactivite",
    cta_contact_agent: "Contacter conseiller",
    cta_book_viewing: "Reserver visite",
    cta_request_pricing: "Demande de prix",
    cta_download_brochure: "Telecharger brochure",
    cta_request_quote: "Demande de devis",
    leadScore: "SCORE PROSPECT",
    high: "ELEVE",
    collapseList: "Reduire la liste",
    expandList: "Afficher la liste",
    walkInProspect: "Prospect spontané",
    promoteFirst: "Promouvoir d'abord pour voir le profil complet",
    cancel: "Annuler",
    promoteWalkInTitle: "Promouvoir le visiteur en VIP ?",
    promoteWalkInBody: "Cette action déplacera le candidat vers votre liste VIP avec un suivi prioritaire.",
    promoteConfirm: "Promouvoir",
    vipPromotedSuccess: "VIP promu avec succès - Prospect spontané ajouté à votre liste VIP",
  },
};

const scoreStroke = 188.5;
const IDLE_SUFFIX = {
  en: "d idle",
  ar: "يوم",
  es: "d inactivo",
  fr: "j inactif",
};

export default function VIPCrmTab() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { config } = useSector();
  const { regionId } = useRegion();
  const tx = UI[lang] || UI.en;
  const tEventDisplay = useTranslation("eventDisplay");
  const normalizeEventCode = (value) => (
    String(value || "")
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[\s-]+/g, "_")
      .toLowerCase()
  );
  const displayEvent = (rawCode) => {
    const eventCode = normalizeEventCode(rawCode);
    return getEventLabel(eventCode, lang, config.id);
  };
  const fromEventDisplay = (code) => {
    const key = `eventDisplay.${code}`;
    const translated = tEventDisplay(key);
    return translated === key ? String(code || "").replace(/_/g, " ") : translated;
  };
  const [showCreateVip, setShowCreateVip] = useState(false);
  const [outreachVip, setOutreachVip] = useState(null);
  const [search, setSearch] = useState("");
  const [listCollapsed, setListCollapsed] = useState(false);
  const [dismissedCandidates, setDismissedCandidates] = useState([]);
  const [promotedCandidates, setPromotedCandidates] = useState([]);
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false);
  const [pendingCandidate, setPendingCandidate] = useState(null);
  const [promoteToast, setPromoteToast] = useState("");
  const { vips, vipCandidates, selectedVipId, setSelectedVipId, vipDetail, loading } = useDashboard();
  const effectiveVips = useMemo(() => {
    const baseVips = vips || [];
    const existingNames = new Set(baseVips.map((vip) => String(vip?.name || "").toLowerCase()));
    const localPromotedVips = promotedCandidates
      .filter(() => !existingNames.has(String(tx.walkInProspect || "").toLowerCase()))
      .map((candidateId) => ({
        id: `local-promoted-${candidateId || "vip"}`,
        name: tx.walkInProspect,
        score: 0,
        velocity: { idleDays: 0 },
        triggers: [],
        __localPromoted: true,
      }));
    return [...baseVips, ...localPromotedVips];
  }, [promotedCandidates, tx.walkInProspect, vips]);

  const filteredVips = useMemo(() => (
    effectiveVips.filter((vip) => (vip.name || "").toLowerCase().includes(search.toLowerCase()))
  ), [effectiveVips, search]);

  const visibleCandidates = useMemo(() => (
    (vipCandidates || []).filter((c) => !dismissedCandidates.includes(c.id || c.name))
  ), [vipCandidates, dismissedCandidates]);

  useEffect(() => {
    if (!location.state?.openCreateVip) return;
    setShowCreateVip(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    setSelectedVipId?.(null);
    setDismissedCandidates([]);
    setPromotedCandidates([]);
    setShowPromoteConfirm(false);
    setPendingCandidate(null);
    setPromoteToast("");
  }, [config.id, regionId, setSelectedVipId]);

  const handlePromote = (candidate) => {
    const candidateId = candidate?.id || candidate?.name;
    if (!candidateId) return;
    setDismissedCandidates((prev) => (prev.includes(candidateId) ? prev : [...prev, candidateId]));
    setPromotedCandidates((prev) => (prev.includes(candidateId) ? prev : [...prev, candidateId]));
  };
  const onPromoteClick = (candidate) => {
    // Keep a single sector-agnostic flow: click -> confirm modal -> promote.
    setPendingCandidate(candidate);
    setShowPromoteConfirm(true);
  };
  const confirmPromoteWalkIn = () => {
    if (!pendingCandidate) return;
    handlePromote(pendingCandidate);
    setShowPromoteConfirm(false);
    setPendingCandidate(null);
    setPromoteToast(tx.vipPromotedSuccess);
  };
  const closePromoteModal = () => {
    setShowPromoteConfirm(false);
    setPendingCandidate(null);
  };

  const topItemName = vipDetail?.topItem?.name || vipDetail?.topItem || tx.notAvailable;
  const triggerList = vipDetail?.triggers || [];
  const ctaEntries = Object.entries(vipDetail?.ctaCounts || {}).filter(([, count]) => (count || 0) > 0);
  const triggerLabel = (type) => {
    const key = `trigger_${String(type || "").toLowerCase()}`;
    return tx[key] || displayEvent(type) || fromEventDisplay(String(type || "").toLowerCase());
  };
  const ctaLabel = (key) => tx[`cta_${key}`] || displayEvent(key) || fromEventDisplay(key);
  const ctaMax = Math.max(...ctaEntries.map(([, count]) => Number(count) || 0), 1);
  const timelineEvents = (vipDetail?.recentEvents || []).map((evt) => ({
    ...evt,
    type: normalizeEventCode(evt?.type || evt?.action || evt?.event || evt?.label),
    label: displayEvent(evt?.type || evt?.action || evt?.event || evt?.label),
  }));

  if (loading) {
    return (
      <div className="ud-grid-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className={`ud-vip-tab ud-vip-lang-${lang} ${lang === "ar" ? "ud-vip-rtl" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="ud-section-label">{tx.section}</div>
      {promoteToast ? (
        <div className="ud-card" style={{ marginBottom: 10, borderColor: "rgba(42,157,143,0.35)", background: "rgba(42,157,143,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#2a9d8f" }}>{promoteToast}</span>
            <button type="button" className="ud-btn-theme" onClick={() => setPromoteToast("")}>×</button>
          </div>
        </div>
      ) : null}
      <div className="ud-card ud-vip-crm-card">
        <div className="ud-vip-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <input
            type="text"
            placeholder={`🔍 ${tx.search}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 340,
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid var(--ud-border)",
              background: "var(--ud-bg-secondary)",
              color: "var(--ud-text)",
              fontSize: 12,
            }}
          />
          <button
            onClick={() => setListCollapsed((prev) => !prev)}
            className="ud-btn-theme"
            type="button"
            disabled={!vipDetail}
            title={listCollapsed ? tx.expandList : tx.collapseList}
          >
            {listCollapsed ? "⟷" : "⟸"}
          </button>
          <button
            onClick={() => setShowCreateVip(true)}
            className="ud-btn-theme"
            type="button"
          >
            + {tx.addVip}
          </button>
          <span className="ud-vip-count-chip" title={`${tx.vipCount}: ${effectiveVips.length}`}>
            {tx.vipCount}: {effectiveVips.length}
          </span>
        </div>

        <div className={`ud-vip-split ${listCollapsed ? "ud-vip-split--collapsed" : ""}`}>
          {!listCollapsed ? (
            <div className="ud-vip-list">
              {filteredVips.map((vip) => (
                <button
                  key={vip.id}
                  className={`ud-vip-list-item ${selectedVipId === vip.id ? "ud-vip-selected" : ""}`}
                  onClick={() => setSelectedVipId?.(vip.id)}
                  type="button"
                >
                  <div className="ud-vip-avatar">{vip.name?.charAt(0) || "V"}</div>
                  <div className="ud-vip-list-info">
                    <div className="ud-vip-list-name">
                      {vip.name}
                      {vip.__localPromoted ? (
                        <span style={{ marginInlineStart: 6, fontSize: 10, color: "var(--ud-accent)" }}>• local</span>
                      ) : null}
                    </div>
                    <div className="ud-vip-list-meta">
                      <span
                        className="ud-vip-score-badge"
                        style={{
                          background: vip.score >= 70 ? "rgba(230,57,70,0.1)" : "rgba(69,123,157,0.1)",
                          color: vip.score >= 70 ? "#e63946" : "#457b9d",
                        }}
                      >
                        {vip.score}
                      </span>
                      {vip.velocity?.idleDays > 0 ? (
                        <span style={{ fontSize: 11, color: vip.atRisk ? "#e63946" : "var(--ud-text-muted)" }}>
                          {vip.velocity.idleDays} {IDLE_SUFFIX[lang] || IDLE_SUFFIX.en}
                        </span>
                      ) : null}
                      {vip.triggers?.[0] ? <span style={{ fontSize: 10 }}>{vip.triggers[0].icon}</span> : null}
                    </div>
                  </div>
                </button>
              ))}

              {filteredVips.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--ud-text-muted)", padding: "8px 4px" }}>
                  {tx.noResults}
                </div>
              ) : null}

              {visibleCandidates.length > 0 ? (
                <>
                  <div className="ud-vip-list-divider">{tx.candidates}</div>
                  {visibleCandidates.map((c) => {
                    return (
                      <div
                        key={c.id || c.name}
                        className="ud-vip-list-item ud-vip-candidate ud-vip-candidate--disabled"
                        title={tx.promoteFirst}
                      >
                        <div className="ud-vip-avatar" style={{ opacity: 0.6 }}>{tx.walkInProspect?.charAt(0) || "W"}</div>
                        <div className="ud-vip-list-info">
                          <div className="ud-vip-list-name">{tx.walkInProspect}</div>
                          <div className="ud-vip-list-meta" style={{ justifyContent: "space-between", width: "100%" }}>
                            <span style={{ fontSize: 11, color: "var(--ud-text-muted)" }}>
                              {(c.eventCount || c.events || 0)} {tx.eventsLabel}
                            </span>
                            <button
                              className="ud-btn-promote"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPromoteClick(c);
                              }}
                              type="button"
                            >
                              {tx.promote}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}
            </div>
          ) : (
            <div className="ud-vip-list-collapsed">
              <button
                type="button"
                className="ud-vip-list-expand-btn"
                onClick={() => setListCollapsed(false)}
                title={tx.expandList}
                aria-label={tx.expandList}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}

          {vipDetail ? (
            <div className="ud-vip-detail">
              <div className="ud-vip-detail-header">
                <div className="ud-vip-detail-avatar">{vipDetail.name?.charAt(0) || "V"}</div>
                <div className="ud-vip-detail-identity">
                  <h3 className="ud-vip-detail-name">{vipDetail.name}</h3>
                  <div className="ud-vip-detail-meta">
                    {vipDetail.email ? <span>{vipDetail.email}</span> : null}
                    {vipDetail.cardId ? <span className="mono">{vipDetail.cardId}</span> : null}
                  </div>
                </div>
                <div className="ud-vip-score-gauge">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <defs>
                      <linearGradient id={`vip-score-grad-${vipDetail.id || "main"}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={vipDetail.score >= 70 ? "#e63946" : "#457b9d"} />
                        <stop offset="100%" stopColor={vipDetail.score >= 70 ? "#b8860b" : "#6ba3c7"} />
                      </linearGradient>
                    </defs>
                    <circle cx="36" cy="36" r="30" fill="none" stroke="var(--ud-gauge-track)" strokeWidth="3.5" />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke={`url(#vip-score-grad-${vipDetail.id || "main"})`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={`${(Number(vipDetail.score || 0) / 100) * scoreStroke} ${scoreStroke}`}
                      transform="rotate(-90 36 36)"
                    />
                    <text x="36" y="38" textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--ud-text)">
                      {vipDetail.score || 0}
                    </text>
                    <text x="36" y="50" textAnchor="middle" fontSize="7" fill="var(--ud-text-muted)" letterSpacing="0.5">
                      {tx.leadScore}
                    </text>
                  </svg>
                </div>
                <div className="ud-vip-header-actions">
                  <button className="ud-btn-primary ud-btn-sm" onClick={() => setOutreachVip(vipDetail)} type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {tx.reachOut}
                  </button>
                </div>
              </div>

              <div className="ud-vip-stats-row">
                <div className="ud-vip-stat">
                  <div className="ud-vip-stat-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="ud-vip-stat-val">{vipDetail.totalSessions ?? vipDetail.sessionCount ?? 0}</div>
                  <div className="ud-vip-stat-label">{tx.sessions}</div>
                  {vipDetail.sessionDelta ? (
                    <div className={`ud-vip-stat-trend ${vipDetail.sessionDelta > 0 ? "up" : "down"}`}>
                      {vipDetail.sessionDelta > 0 ? "↑" : "↓"} {Math.abs(vipDetail.sessionDelta)}
                    </div>
                  ) : null}
                </div>
                <div className="ud-vip-stat">
                  <div className="ud-vip-stat-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="ud-vip-stat-val">{vipDetail.totalEvents ?? 0}</div>
                  <div className="ud-vip-stat-label">{tx.events}</div>
                  {vipDetail.eventsDelta ? (
                    <div className={`ud-vip-stat-trend ${vipDetail.eventsDelta > 0 ? "up" : "down"}`}>
                      {vipDetail.eventsDelta > 0 ? "↑" : "↓"} {Math.abs(vipDetail.eventsDelta)}
                    </div>
                  ) : null}
                </div>
                <div className="ud-vip-stat">
                  <div className="ud-vip-stat-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12l9-9 9 9" />
                      <path d="M5 10v10h14V10" />
                    </svg>
                  </div>
                  <div className="ud-vip-stat-val" style={{ fontSize: 13 }}>{topItemName}</div>
                  <div className="ud-vip-stat-label">{tx.topUnit}</div>
                </div>
                <div className="ud-vip-stat">
                  <div className="ud-vip-stat-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="10" y1="9" x2="10" y2="15" />
                      <line x1="14" y1="9" x2="14" y2="15" />
                    </svg>
                  </div>
                  <div className="ud-vip-stat-val">
                    {vipDetail.velocity?.idleDays || 0} {IDLE_SUFFIX[lang] || IDLE_SUFFIX.en}
                  </div>
                  <div className="ud-vip-stat-label">{tx.idle}</div>
                </div>
              </div>

              <div className="ud-vip-triggers ud-vip-panel">
                <h4 className="ud-vip-section-title">{tx.why}</h4>
                {triggerList.length > 0 ? (
                  <div className="ud-trigger-chips">
                    {triggerList.map((t, i) => (
                      <div
                        key={`${t.type}-${i}`}
                        className={`ud-trigger-chip ud-trigger-chip--${String(t.severity || "medium").toLowerCase()}`}
                      >
                        <span className="ud-trigger-chip-dot" />
                        <span className="ud-trigger-chip-label">{triggerLabel(t.type)}</span>
                        {String(t.severity || "").toLowerCase() === "high" ? (
                          <span className="ud-trigger-chip-badge">{tx.high}</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ud-empty-hint">{tx.noTriggers}</div>
                )}
              </div>

              <div className="ud-vip-cta-section ud-vip-panel">
                <h4 className="ud-vip-section-title">{tx.cta}</h4>
                {ctaEntries.length > 0 ? (
                  <div className="ud-cta-bars">
                    {ctaEntries.map(([key, count]) => (
                      <div key={key} className="ud-cta-bar-row">
                        <div className="ud-cta-bar-header">
                          <span className="ud-cta-bar-label">{ctaLabel(key)}</span>
                          <span className="ud-cta-bar-count">{count}</span>
                        </div>
                        <div className="ud-cta-bar-track">
                          <div className="ud-cta-bar-fill" style={{ width: `${((Number(count) || 0) / ctaMax) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ud-empty-hint">{tx.noCta}</div>
                )}
              </div>

              <div className="ud-vip-panel" style={{ marginTop: 12 }}>
                <BehavioralTimeline title={tx.timeline} events={timelineEvents} />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="ud-btn-primary" onClick={() => setOutreachVip(vipDetail)} type="button">
                  {tx.reachOut}
                </button>
                <button className="ud-btn-theme" type="button" onClick={() => window.open(vipDetail.portalUrl || "/enterprise/crmdemo", "_blank")}>
                  {tx.reissue}
                </button>
              </div>
            </div>
          ) : (
            <div className="ud-vip-detail-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ud-text-muted)" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
              </svg>
              <p>{tx.select}</p>
            </div>
          )}
        </div>
      </div>

      {outreachVip ? <OutreachModal vip={outreachVip} onClose={() => setOutreachVip(null)} /> : null}
      {showPromoteConfirm ? (
        <div className="ud-modal-overlay" onClick={closePromoteModal}>
          <div className="ud-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal-header">
              <h3 className="ud-modal-title">{tx.promoteWalkInTitle}</h3>
            </div>
            <div className="ud-modal-body" style={{ padding: "16px 20px" }}>
              <p style={{ margin: 0, fontSize: 13, color: "var(--ud-text-secondary)" }}>{tx.promoteWalkInBody}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 20px 16px" }}>
              <button type="button" className="ud-btn-ghost" onClick={closePromoteModal}>
                {tx.cancel}
              </button>
              <button type="button" className="ud-btn-primary ud-btn-primary--danger" onClick={confirmPromoteWalkIn}>
                {tx.promoteConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showCreateVip ? (
        <CreateVipModal
          onClose={() => setShowCreateVip(false)}
          onSubmit={(data) => {
            if (data?.fullName) setSearch(data.fullName);
          }}
        />
      ) : null}
    </div>
  );
}
