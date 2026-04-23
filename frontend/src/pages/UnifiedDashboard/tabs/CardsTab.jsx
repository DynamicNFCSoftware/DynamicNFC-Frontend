import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { getSectorSchema } from "../../../config/developerThemes";
import { useAuth } from "../../../contexts/AuthContext";
import { useDashboard } from "../DashboardDataProvider";
import { SkeletonTable } from "../components/LoadingSkeleton";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { updateCardAssignment, updateCardStatus } from "../../../services/tenantService";

/* ═══ i18n ═══ */
const UI = {
  en: {
    section: "Card Intelligence",
    cardId: "Card",
    assignedTo: "Owner",
    status: "Status",
    taps: "Taps",
    views: "Views",
    pricing: "Pricing",
    bookings: "Bookings",
    trend: "7d",
    vipSignals: "VIP Signals",
    actions: "Actions",
    lastTap: "Last Tap",
    demo: "(demo data)",
    empty: "No card interaction data yet.",
    emptyCta: "Launch a campaign to start collecting data.",
    search: "Search cards...",
    allStatus: "All",
    active: "Active",
    cooling: "Cooling",
    dormant: "Dormant",
    paused: "Paused",
    sortBy: "Sort",
    clearKpiFilter: "Clear KPI",
    // KPIs
    kpiTotalTaps: "Total Taps (7d)",
    kpiActiveCards: "Active Cards",
    kpiMostViewed: "Most Viewed",
    kpiAtRisk: "Reactivation Needed",
    // Detail
    detailTitle: "Card Detail",
    engagement: "Engagement Mix",
    downloads: "Downloads",
    interestedVips: "Interested VIPs",
    linkedDeals: "Linked Deals",
    noVips: "No VIP interest yet",
    noDeals: "No linked deals",
    createDeal: "Create Deal",
    funnel: "Conversion Funnel",
    funnelTaps: "Taps",
    funnelViews: "Views",
    funnelPricing: "Pricing",
    funnelBookings: "Bookings",
    convRate: "Conv. Rate",
    // Suggestions
    suggestDeal: "Hot lead — Create deal",
    suggestReactivate: "Dormant — Reactivation needed",
    suggestFollowUp: "Booking interest — Priority follow-up",
    noSuggestion: "",
    close: "Close",
    tower: "Tower",
    type: "Type",
    lastActivity: "Last Activity",
    allTowers: "All Towers",
    reassignRep: "Reassign Rep",
    selectRep: "Select rep",
    saveAssignment: "Save Assignment",
    bulkPause: "Pause Card",
    bulkResume: "Resume Card",
    bulkLaunch: "Launch Campaign",
    bulkExport: "Export CSV",
    campaignNameLabel: "Campaign Name",
    campaignNamePlaceholder: "Enter campaign name",
    campaignNameRequired: "Campaign name is required",
    confirmLaunchDesc: "Set a campaign name before creating from selected cards.",
    selected: "selected",
    bulkActions: "Bulk Actions",
    selectedPreview: "Selected cards",
    moreSelected: "more",
    clearSelection: "Clear",
    assignmentSaved: "Assignment saved",
    assignmentFailed: "Assignment failed",
    bulkUpdateFailed: "Bulk update failed",
    cardPaused: "Card paused",
    cardResumed: "Card resumed",
    statusFailed: "Status update failed",
    bulkFailed: "Bulk action failed",
    campaignNameTooShort: "Campaign name must be at least 3 characters",
    bulkCampaignCreated: "Campaign created",
    bulkCampaignFailed: "Campaign creation failed",
    pauseCard: "Pause Card",
    resumeCard: "Resume Card",
    confirm: "Confirm",
    cancel: "Cancel",
    confirmBulkTitle: "Confirm Bulk Action",
    confirmBulkDesc: "This action will apply to selected cards.",
  },
  ar: {
    section: "ذكاء البطاقات",
    cardId: "البطاقة",
    assignedTo: "المالك",
    status: "الحالة",
    taps: "نقرات",
    views: "مشاهدات",
    pricing: "تسعير",
    bookings: "حجوزات",
    trend: "7 أيام",
    vipSignals: "إشارات VIP",
    actions: "إجراءات",
    lastTap: "آخر نقرة",
    demo: "(بيانات تجريبية)",
    empty: "لا توجد بيانات تفاعل بطاقات بعد.",
    emptyCta: "أطلق حملة لبدء جمع البيانات.",
    search: "بحث في البطاقات...",
    allStatus: "الكل",
    active: "نشط",
    cooling: "يبرد",
    dormant: "خامل",
    paused: "متوقف",
    sortBy: "ترتيب",
    clearKpiFilter: "مسح KPI",
    kpiTotalTaps: "إجمالي النقرات (7 أيام)",
    kpiActiveCards: "بطاقات نشطة",
    kpiMostViewed: "الأكثر مشاهدة",
    kpiAtRisk: "تحتاج إعادة تفعيل",
    detailTitle: "تفاصيل البطاقة",
    engagement: "مزيج التفاعل",
    downloads: "تنزيلات",
    interestedVips: "VIP مهتمون",
    linkedDeals: "صفقات مرتبطة",
    noVips: "لا يوجد اهتمام VIP بعد",
    noDeals: "لا توجد صفقات مرتبطة",
    createDeal: "إنشاء صفقة",
    funnel: "قمع التحويل",
    funnelTaps: "نقرات",
    funnelViews: "مشاهدات",
    funnelPricing: "تسعير",
    funnelBookings: "حجوزات",
    convRate: "معدل التحويل",
    suggestDeal: "عميل ساخن — أنشئ صفقة",
    suggestReactivate: "خامل — يحتاج إعادة تنشيط",
    suggestFollowUp: "اهتمام بالحجز — متابعة عاجلة",
    noSuggestion: "",
    close: "إغلاق",
    tower: "برج",
    type: "نوع",
    lastActivity: "آخر نشاط",
    allTowers: "كل الأبراج",
    reassignRep: "إعادة تعيين المندوب",
    selectRep: "اختر المندوب",
    saveAssignment: "حفظ التعيين",
    bulkPause: "إيقاف البطاقات",
    bulkResume: "استئناف البطاقات",
    bulkLaunch: "إطلاق حملة",
    bulkExport: "تصدير CSV",
    campaignNameLabel: "اسم الحملة",
    campaignNamePlaceholder: "أدخل اسم الحملة",
    campaignNameRequired: "اسم الحملة مطلوب",
    confirmLaunchDesc: "حدّد اسم الحملة قبل الإنشاء من البطاقات المحددة.",
    selected: "محدد",
    bulkActions: "إجراءات جماعية",
    selectedPreview: "البطاقات المحددة",
    moreSelected: "إضافية",
    clearSelection: "مسح",
    assignmentSaved: "تم حفظ التعيين",
    assignmentFailed: "فشل حفظ التعيين",
    bulkUpdateFailed: "فشل التحديث الجماعي",
    cardPaused: "تم إيقاف البطاقة",
    cardResumed: "تم استئناف البطاقة",
    statusFailed: "فشل تحديث الحالة",
    bulkFailed: "فشل الإجراء الجماعي",
    campaignNameTooShort: "يجب أن يكون اسم الحملة 3 أحرف على الأقل",
    bulkCampaignCreated: "تم إنشاء الحملة",
    bulkCampaignFailed: "فشل إنشاء الحملة",
    pauseCard: "إيقاف البطاقة",
    resumeCard: "استئناف البطاقة",
    confirm: "تأكيد",
    cancel: "إلغاء",
    confirmBulkTitle: "تأكيد الإجراء الجماعي",
    confirmBulkDesc: "سيتم تطبيق هذا الإجراء على البطاقات المحددة.",
  },
  es: {
    section: "Inteligencia de Tarjetas",
    cardId: "Tarjeta",
    assignedTo: "Propietario",
    status: "Estado",
    taps: "Toques",
    views: "Vistas",
    pricing: "Precios",
    bookings: "Reservas",
    trend: "7d",
    vipSignals: "Señales VIP",
    actions: "Acciones",
    lastTap: "Último toque",
    demo: "(datos demo)",
    empty: "Aún no hay datos de interacción.",
    emptyCta: "Lanza una campaña para empezar.",
    search: "Buscar tarjetas...",
    allStatus: "Todos",
    active: "Activo",
    cooling: "Enfriando",
    dormant: "Inactivo",
    paused: "Pausado",
    sortBy: "Ordenar",
    clearKpiFilter: "Limpiar KPI",
    kpiTotalTaps: "Toques Totales (7d)",
    kpiActiveCards: "Tarjetas Activas",
    kpiMostViewed: "Más Vista",
    kpiAtRisk: "Necesita Reactivación",
    detailTitle: "Detalle de Tarjeta",
    engagement: "Mezcla de Interacción",
    downloads: "Descargas",
    interestedVips: "VIPs Interesados",
    linkedDeals: "Tratos Vinculados",
    noVips: "Sin interés VIP aún",
    noDeals: "Sin tratos vinculados",
    createDeal: "Crear Trato",
    funnel: "Embudo de Conversión",
    funnelTaps: "Toques",
    funnelViews: "Vistas",
    funnelPricing: "Precios",
    funnelBookings: "Reservas",
    convRate: "Tasa Conv.",
    suggestDeal: "Lead caliente — Crear trato",
    suggestReactivate: "Inactivo — Necesita reactivación",
    suggestFollowUp: "Interés en reserva — Seguimiento urgente",
    noSuggestion: "",
    close: "Cerrar",
    tower: "Torre",
    type: "Tipo",
    lastActivity: "Última actividad",
    allTowers: "Todas las Torres",
    reassignRep: "Reasignar asesor",
    selectRep: "Seleccionar asesor",
    saveAssignment: "Guardar asignación",
    bulkPause: "Pausar tarjetas",
    bulkResume: "Reanudar tarjetas",
    bulkLaunch: "Lanzar campaña",
    bulkExport: "Exportar CSV",
    campaignNameLabel: "Nombre de campaña",
    campaignNamePlaceholder: "Escribe el nombre de la campaña",
    campaignNameRequired: "El nombre de la campaña es obligatorio",
    confirmLaunchDesc: "Define un nombre antes de crear la campaña desde las tarjetas seleccionadas.",
    selected: "seleccionadas",
    bulkActions: "Acciones masivas",
    selectedPreview: "Tarjetas seleccionadas",
    moreSelected: "más",
    clearSelection: "Limpiar",
    assignmentSaved: "Asignación guardada",
    assignmentFailed: "Error al guardar asignación",
    bulkUpdateFailed: "Error en actualización masiva",
    cardPaused: "Tarjeta pausada",
    cardResumed: "Tarjeta reanudada",
    statusFailed: "Error al actualizar estado",
    bulkFailed: "Error en acción masiva",
    campaignNameTooShort: "El nombre de la campaña debe tener al menos 3 caracteres",
    bulkCampaignCreated: "Campaña creada",
    bulkCampaignFailed: "Error al crear la campaña",
    pauseCard: "Pausar tarjeta",
    resumeCard: "Reanudar tarjeta",
    confirm: "Confirmar",
    cancel: "Cancelar",
    confirmBulkTitle: "Confirmar acción masiva",
    confirmBulkDesc: "Esta acción se aplicará a las tarjetas seleccionadas.",
  },
  fr: {
    section: "Intelligence des Cartes",
    cardId: "Carte",
    assignedTo: "Propriétaire",
    status: "Statut",
    taps: "Taps",
    views: "Vues",
    pricing: "Tarifs",
    bookings: "Réservations",
    trend: "7j",
    vipSignals: "Signaux VIP",
    actions: "Actions",
    lastTap: "Dernier tap",
    demo: "(données démo)",
    empty: "Aucune donnée d'interaction pour le moment.",
    emptyCta: "Lancez une campagne pour commencer.",
    search: "Rechercher...",
    allStatus: "Tous",
    active: "Actif",
    cooling: "Refroidit",
    dormant: "Dormant",
    paused: "En pause",
    sortBy: "Trier",
    clearKpiFilter: "Effacer KPI",
    kpiTotalTaps: "Taps Totaux (7j)",
    kpiActiveCards: "Cartes Actives",
    kpiMostViewed: "Plus Vue",
    kpiAtRisk: "Réactivation Requise",
    detailTitle: "Détail Carte",
    engagement: "Mix d'Engagement",
    downloads: "Téléchargements",
    interestedVips: "VIPs Intéressés",
    linkedDeals: "Affaires Liées",
    noVips: "Pas d'intérêt VIP",
    noDeals: "Aucune affaire liée",
    createDeal: "Créer Affaire",
    funnel: "Entonnoir de Conversion",
    funnelTaps: "Taps",
    funnelViews: "Vues",
    funnelPricing: "Tarifs",
    funnelBookings: "Réservations",
    convRate: "Taux Conv.",
    suggestDeal: "Lead chaud — Créer affaire",
    suggestReactivate: "Dormant — Réactivation nécessaire",
    suggestFollowUp: "Intérêt réservation — Suivi prioritaire",
    noSuggestion: "",
    close: "Fermer",
    tower: "Tour",
    type: "Type",
    lastActivity: "Dernière activité",
    allTowers: "Toutes les Tours",
    reassignRep: "Réaffecter le conseiller",
    selectRep: "Choisir un conseiller",
    saveAssignment: "Enregistrer l'affectation",
    bulkPause: "Mettre en pause",
    bulkResume: "Réactiver carte",
    bulkLaunch: "Lancer campagne",
    bulkExport: "Exporter CSV",
    campaignNameLabel: "Nom de la campagne",
    campaignNamePlaceholder: "Entrez le nom de la campagne",
    campaignNameRequired: "Le nom de la campagne est requis",
    confirmLaunchDesc: "Définissez un nom avant de créer la campagne depuis les cartes sélectionnées.",
    selected: "sélectionnées",
    bulkActions: "Actions groupées",
    selectedPreview: "Cartes sélectionnées",
    moreSelected: "en plus",
    clearSelection: "Effacer",
    assignmentSaved: "Affectation enregistrée",
    assignmentFailed: "Échec de l'affectation",
    bulkUpdateFailed: "Échec de la mise à jour groupée",
    cardPaused: "Carte mise en pause",
    cardResumed: "Carte réactivée",
    statusFailed: "Échec de la mise à jour du statut",
    bulkFailed: "Échec de l'action groupée",
    campaignNameTooShort: "Le nom de la campagne doit contenir au moins 3 caractères",
    bulkCampaignCreated: "Campagne créée",
    bulkCampaignFailed: "Échec de la création de la campagne",
    pauseCard: "Mettre en pause",
    resumeCard: "Réactiver la carte",
    confirm: "Confirmer",
    cancel: "Annuler",
    confirmBulkTitle: "Confirmer l'action groupée",
    confirmBulkDesc: "Cette action sera appliquée aux cartes sélectionnées.",
  },
};

/* ═══ Helpers ═══ */
function timeAgo(ts) {
  if (!ts) return "-";
  const d = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(d / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function daysAgo(ts) {
  if (!ts) return 999;
  return Math.floor((Date.now() - new Date(ts).getTime()) / 86400000);
}

function healthStatus(card) {
  const manualStatus = String(card?.status || "").toLowerCase();
  if (manualStatus === "paused") return "paused";
  const d = daysAgo(card.lastTapAt);
  if (d <= 3) return "active";
  if (d <= 7) return "cooling";
  return "dormant";
}

function suggestion(card) {
  if (card.pricing >= 3 && card.linkedDealCount === 0) return "deal";
  if (daysAgo(card.lastTapAt) > 7) return "reactivate";
  if (card.bookings > 0) return "followup";
  return null;
}

/* ═══ Mini Sparkline (SVG) ═══ */
function Spark({ data = [], w = 64, h = 18, color = "#457b9d" }) {
  if (!data || data.length < 2 || data.every((v) => v === 0)) return <span className="ud-ci-spark-empty">{"-"}</span>;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 3) - 1.5}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="ud-ci-spark">
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ═══ Mini Funnel ═══ */
function MiniFunnel({ card, tx }) {
  const steps = [
    { label: tx.funnelTaps, value: card.totalTaps, color: "#457b9d" },
    { label: tx.funnelViews, value: card.views, color: "#6ba3c7" },
    { label: tx.funnelPricing, value: card.pricing, color: "#eab308" },
    { label: tx.funnelBookings, value: card.bookings, color: "#22c55e" },
  ];
  const maxVal = Math.max(card.totalTaps, 1);
  return (
    <div className="ud-ci-funnel">
      {steps.map((s) => (
        <div key={s.label} className="ud-ci-funnel__step">
          <div className="ud-ci-funnel__bar-bg">
            <div
              className="ud-ci-funnel__bar-fill"
              style={{ width: `${Math.max((s.value / maxVal) * 100, 4)}%`, background: s.color }}
            />
          </div>
          <span className="ud-ci-funnel__label">{s.label}</span>
          <span className="ud-ci-funnel__val">{s.value}</span>
        </div>
      ))}
      {card.totalTaps > 0 && (
        <div className="ud-ci-funnel__rate">
          {tx.convRate}: {Math.round((card.bookings / card.totalTaps) * 100)}%
        </div>
      )}
    </div>
  );
}

function EngagementPie({ card, tx }) {
  const data = [
    { name: tx.views, value: card.views || 0, color: "#457b9d" },
    { name: tx.pricing, value: card.pricing || 0, color: "#eab308" },
    { name: tx.bookings, value: card.bookings || 0, color: "#22c55e" },
    { name: tx.downloads, value: card.downloads || 0, color: "#8b5cf6" },
  ].filter((d) => d.value > 0);
  if (data.length === 0) return <div className="ud-ci-detail__empty-hint">—</div>;
  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={36} outerRadius={62} paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══ KPI Card ═══ */
function KpiCard({ icon, label, value, sub, accent, sparkData, onClick, isActive = false }) {
  return (
    <div
      className={`ud-ci-kpi ${onClick ? "ud-ci-kpi--clickable" : ""} ${isActive ? "ud-ci-kpi--active" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="ud-ci-kpi__icon" style={accent ? { background: accent } : undefined}>{icon}</div>
      <div className="ud-ci-kpi__body">
        <div className="ud-ci-kpi__label">{label}</div>
        <div className="ud-ci-kpi__value">{value}</div>
        {sub && <div className="ud-ci-kpi__sub">{sub}</div>}
      </div>
      {sparkData && (
        <div className="ud-ci-kpi__spark">
          <Spark data={sparkData} w={56} h={20} />
        </div>
      )}
    </div>
  );
}

function ConfirmDialog({ title, description, onCancel, onConfirm, confirmLabel, cancelLabel, busy, children }) {
  return (
    <div className="ud-ci-confirm-backdrop" onClick={() => !busy && onCancel?.()}>
      <div className="ud-ci-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="ud-ci-confirm__title">{title}</div>
        <div className="ud-ci-confirm__desc">{description}</div>
        {children}
        <div className="ud-ci-confirm__actions">
          <button className="ud-ci-bulk-btn ud-ci-bulk-btn--ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button className="ud-ci-bulk-btn ud-ci-bulk-btn--primary" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Expanded Card Detail ═══ */
function CardDetail({ card, tx, onCreateDeal, onClose, salesReps = [], onReassign, busy, onToggleStatus, statusBusy, parentLabel }) {
  const [repId, setRepId] = useState(card?.assignedRepId || "");
  if (!card) return null;
  const health = healthStatus(card);
  const sug = suggestion(card);
  const selectedRep = (salesReps || []).find((r) => r.id === repId);
  return (
    <div className="ud-ci-detail-backdrop" onClick={onClose}>
      <div className="ud-ci-detail" onClick={(e) => e.stopPropagation()}>
        <div className="ud-ci-detail__header">
          <div>
            <span className="ud-ci-detail__title">{card.name}</span>
            <span className={`ud-ci-health ud-ci-health--${health}`}>{tx[health]}</span>
          </div>
          <button className="ud-ci-detail__close" onClick={onClose}>{"✕"}</button>
        </div>

        {/* Quick stats */}
        <div className="ud-ci-detail__stats">
          <div className="ud-ci-detail__stat"><span className="ud-ci-detail__stat-val">{card.totalTaps}</span><span className="ud-ci-detail__stat-lbl">{tx.taps}</span></div>
          <div className="ud-ci-detail__stat"><span className="ud-ci-detail__stat-val">{card.views}</span><span className="ud-ci-detail__stat-lbl">{tx.views}</span></div>
          <div className="ud-ci-detail__stat"><span className="ud-ci-detail__stat-val">{card.pricing}</span><span className="ud-ci-detail__stat-lbl">{tx.pricing}</span></div>
          <div className="ud-ci-detail__stat"><span className="ud-ci-detail__stat-val">{card.bookings}</span><span className="ud-ci-detail__stat-lbl">{tx.bookings}</span></div>
          <div className="ud-ci-detail__stat"><span className="ud-ci-detail__stat-val">{card.downloads}</span><span className="ud-ci-detail__stat-lbl">{tx.downloads}</span></div>
        </div>

        {/* Meta */}
        <div className="ud-ci-detail__meta">
          <span>{parentLabel}: <b>{card.tower}</b></span>
          <span>{tx.type}: <b>{card.type !== "-" ? card.type : "—"}</b></span>
          <span>{tx.lastActivity}: <b>{timeAgo(card.lastTapAt)}</b></span>
        </div>

        {/* Sparkline */}
        <div className="ud-ci-detail__spark-row">
          <span className="ud-ci-detail__spark-label">{tx.trend}</span>
          <Spark data={card.sparkline} w={220} h={32} />
        </div>

        {/* Funnel */}
        <div className="ud-ci-detail__section-title">{tx.funnel}</div>
        <MiniFunnel card={card} tx={tx} />
        <div className="ud-ci-detail__section-title">{tx.engagement}</div>
        <EngagementPie card={card} tx={tx} />

        <div className="ud-ci-detail__section-title">{tx.reassignRep}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <select
            className="ud-ci-select"
            value={repId}
            onChange={(e) => setRepId(e.target.value)}
            style={{ minWidth: 220 }}
          >
            <option value="">{tx.selectRep}</option>
            {(salesReps || []).map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name}
              </option>
            ))}
          </select>
          <button
            className="ud-ci-detail__cta"
            style={{ width: "auto", padding: "8px 12px" }}
            disabled={busy}
            onClick={() => onReassign?.(card, { assignedRepId: repId, assignedRepName: selectedRep?.name || "" })}
          >
            {tx.saveAssignment}
          </button>
          <button
            className="ud-ci-detail__cta"
            style={{ width: "auto", padding: "8px 12px" }}
            disabled={statusBusy}
            onClick={() => onToggleStatus?.(card, String(card.status || "").toLowerCase() === "paused" ? "active" : "paused")}
          >
            {String(card.status || "").toLowerCase() === "paused" ? tx.resumeCard : tx.pauseCard}
          </button>
        </div>

        {/* VIPs */}
        <div className="ud-ci-detail__section-title">{tx.interestedVips}</div>
        {card.interestedVips && card.interestedVips.length > 0 ? (
          <div className="ud-ci-detail__vip-chips">
            {card.interestedVips.slice(0, 8).map((v) => (
              <span key={v.name || v.id} className="ud-ci-vip-chip">{v.name} ({v.score})</span>
            ))}
          </div>
        ) : (
          <div className="ud-ci-detail__empty-hint">{tx.noVips}</div>
        )}

        {/* Linked Deals */}
        <div className="ud-ci-detail__section-title">{tx.linkedDeals}</div>
        {card.linkedDealCount > 0 ? (
          <div className="ud-ci-detail__deal-list">
            {card.linkedDeals.slice(0, 5).map((d) => (
              <div key={d.id} className="ud-ci-detail__deal-row">
                <span className="ud-ci-detail__deal-name">{d.name}</span>
                <span className="ud-ci-detail__deal-stage">{d.stage?.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="ud-ci-detail__empty-hint">{tx.noDeals}</div>
        )}

        {/* Smart suggestion */}
        {sug && (
          <div className={`ud-ci-suggestion ud-ci-suggestion--${sug}`}>
            {sug === "deal" && tx.suggestDeal}
            {sug === "reactivate" && tx.suggestReactivate}
            {sug === "followup" && tx.suggestFollowUp}
          </div>
        )}

        {/* CTA */}
        <button className="ud-ci-detail__cta" onClick={() => onCreateDeal(card)}>
          {tx.createDeal}
        </button>
      </div>
    </div>
  );
}

/* ═══ Sort options ═══ */
const SORT_OPTS = [
  { id: "taps", label: { en: "Taps", ar: "نقرات", es: "Toques", fr: "Taps" } },
  { id: "views", label: { en: "Views", ar: "مشاهدات", es: "Vistas", fr: "Vues" } },
  { id: "recent", label: { en: "Recent", ar: "الأحدث", es: "Reciente", fr: "Récent" } },
  { id: "vips", label: { en: "VIPs", ar: "VIP", es: "VIPs", fr: "VIPs" } },
];

/* ═══════════════════ MAIN ═══════════════════ */
export default function CardsTab() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { sectorId, activeSectorId } = useSector();
  const navigate = useNavigate();
  const { cards, loading, dataMode, salesReps } = useDashboard();
  const tx = useMemo(() => ({ ...UI.en, ...(UI[lang] || {}) }), [lang]);
  const schema = useMemo(() => getSectorSchema(activeSectorId || sectorId, lang), [activeSectorId, sectorId, lang]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [towerFilter, setTowerFilter] = useState("all");
  const [sortKey, setSortKey] = useState("taps");
  const [kpiFilter, setKpiFilter] = useState("none");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [toolbarBusy, setToolbarBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [bulkCampaignName, setBulkCampaignName] = useState("");
  const [bulkNameError, setBulkNameError] = useState("");

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!selectedCard?.id) return;
    const latest = cards.find((c) => c.id === selectedCard.id);
    if (latest) setSelectedCard((prev) => ({ ...prev, ...latest }));
  }, [cards, selectedCard?.id]);

  // Unique towers for filter
  const towers = useMemo(() => {
    const set = new Set(cards.map((c) => c.tower).filter((t) => t && t !== "-"));
    return [...set].sort();
  }, [cards]);

  // Enriched + filtered + sorted cards
  const filtered = useMemo(() => {
    let list = cards.map((c) => ({ ...c, health: healthStatus(c), sug: suggestion(c) }));

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.tower || "").toLowerCase().includes(q) ||
          (c.assignedName || "").toLowerCase().includes(q)
      );
    }

    // status filter
    if (statusFilter !== "all") list = list.filter((c) => c.health === statusFilter);

    // tower filter
    if (towerFilter !== "all") list = list.filter((c) => c.tower === towerFilter);

    // KPI filter
    if (kpiFilter === "active") list = list.filter((c) => c.health === "active");
    else if (kpiFilter === "atRisk") list = list.filter((c) => c.health === "dormant");
    else if (kpiFilter === "mostViewed") list = [...list].sort((a, b) => b.views - a.views);

    // sort
    if (sortKey === "taps") list.sort((a, b) => b.totalTaps - a.totalTaps);
    else if (sortKey === "views") list.sort((a, b) => b.views - a.views);
    else if (sortKey === "recent") list.sort((a, b) => new Date(b.lastTapAt || 0) - new Date(a.lastTapAt || 0));
    else if (sortKey === "vips") list.sort((a, b) => (b.interestedVips?.length || 0) - (a.interestedVips?.length || 0));

    return list;
  }, [cards, search, statusFilter, towerFilter, sortKey, kpiFilter]);

  // KPI values
  const kpis = useMemo(() => {
    const totalTaps7d = cards.reduce((s, c) => s + (c.sparkline || []).reduce((a, b) => a + b, 0), 0);
    const activeCards = cards.filter((c) => healthStatus(c) === "active").length;
    const mostViewed = cards.length > 0 ? [...cards].sort((a, b) => b.views - a.views)[0] : null;
    const atRisk = cards.filter((c) => healthStatus(c) === "dormant").length;
    return { totalTaps7d, activeCards, mostViewed, atRisk };
  }, [cards]);

  const handleCreateDeal = useCallback(
    (card) => {
      navigate("/unified/pipeline", {
        state: {
          inventoryDeal: {
            requestId: `ci-${card.id}-${Date.now()}`,
            name: `${card.name} Lead`,
            item: card.name,
            value: 0,
            stage: "new_lead",
            source: "cards_tab",
            categoryId: card.tower || "",
            categoryName: card.tower || "",
            campaignId: card.campaignId || card.linkedCampaignId || "",
          },
        },
      });
    },
    [navigate]
  );

  const handleReassign = useCallback(
    async (card, assignment) => {
      if (!user?.uid || !card?.id) return;
      setSavingAssignment(true);
      try {
        await updateCardAssignment(user.uid, card.id, assignment);
        showToast(tx.assignmentSaved || "Assignment saved", "success");
      } catch (err) {
        showToast(tx.assignmentFailed || "Assignment failed", "error");
        console.error("[CardsTab] reassign failed", err);
      } finally {
        setSavingAssignment(false);
      }
    },
    [user, tx, showToast]
  );

  const handleToggleStatus = useCallback(
    async (card, newStatus) => {
      if (!user?.uid || !card?.id) return;
      setStatusBusy(true);
      try {
        await updateCardStatus(user.uid, card.id, newStatus);
        showToast(newStatus === "paused" ? (tx.cardPaused || "Card paused") : (tx.cardResumed || "Card resumed"), "success");
      } catch (err) {
        showToast(tx.statusFailed || "Status update failed", "error");
        console.error("[CardsTab] toggle status failed", err);
      } finally {
        setStatusBusy(false);
      }
    },
    [user, tx, showToast]
  );

  // Bulk actions
  const toggleSelect = useCallback(
    (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    []
  );
  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => (prev.length === filtered.length ? [] : filtered.map((c) => c.id)));
  }, [filtered]);

  const handleBulkStatusChange = useCallback(
    async (newStatus) => {
      if (!user?.uid || selectedIds.length === 0) return;
      setToolbarBusy(true);
      try {
        await Promise.all(selectedIds.map((id) => updateCardStatus(user.uid, id, newStatus)));
        showToast(`${selectedIds.length} cards ${newStatus === "paused" ? "paused" : "resumed"}`, "success");
        setSelectedIds([]);
        setConfirmAction(null);
      } catch (err) {
        showToast(tx.bulkFailed || "Bulk action failed", "error");
        console.error("[CardsTab] bulk status failed", err);
      } finally {
        setToolbarBusy(false);
      }
    },
    [user, selectedIds, tx, showToast]
  );

  const handleBulkCampaign = useCallback(async () => {
    const name = bulkCampaignName.trim();
    if (!name || name.length < 3) {
      setBulkNameError(tx.campaignNameTooShort || "Min 3 characters");
      return;
    }
    if (!user?.uid || selectedIds.length === 0) return;
    setToolbarBusy(true);
    try {
      const { createTenantCampaign } = await import("../../../services/tenantService");
      await createTenantCampaign(user.uid, {
        name,
        status: "draft",
        source: "cards_tab_bulk",
        totalCards: selectedIds.length,
        activeCards: selectedIds.length,
        cardIds: selectedIds,
      });
      showToast(tx.bulkCampaignCreated || "Campaign created", "success");
      setSelectedIds([]);
      setBulkCampaignName("");
      setConfirmAction(null);
    } catch (err) {
      showToast(tx.bulkCampaignFailed || "Campaign creation failed", "error");
      console.error("[CardsTab] bulk campaign failed", err);
    } finally {
      setToolbarBusy(false);
    }
  }, [user, selectedIds, bulkCampaignName, tx, showToast]);

  if (loading) return <SkeletonTable />;

  return (
    <div className="ud-ci-root">
      {/* Toast */}
      {toast && <div className={`ud-ci-toast ud-ci-toast--${toast.type}`}>{toast.message}</div>}

      {/* KPI Band */}
      <div className="ud-ci-kpis">
        <KpiCard
          icon="📊"
          label={tx.kpiTotalTaps}
          value={kpis.totalTaps7d}
          accent="#457b9d"
          onClick={() => setKpiFilter((p) => (p === "none" ? "none" : "none"))}
        />
        <KpiCard
          icon="✅"
          label={tx.kpiActiveCards}
          value={kpis.activeCards}
          accent="#2a9d8f"
          sub={`/ ${cards.length}`}
          onClick={() => setKpiFilter((p) => (p === "active" ? "none" : "active"))}
        />
        <KpiCard
          icon="👁"
          label={tx.kpiMostViewed}
          value={kpis.mostViewed?.name || "—"}
          accent="#e9c46a"
          sub={kpis.mostViewed ? `${kpis.mostViewed.views} ${tx.views}` : ""}
          onClick={() => setKpiFilter((p) => (p === "mostViewed" ? "none" : "mostViewed"))}
        />
        <KpiCard
          icon="♻️"
          label={tx.kpiAtRisk}
          value={kpis.atRisk}
          accent="#b8860b"
          onClick={() => setKpiFilter((p) => (p === "atRisk" ? "none" : "atRisk"))}
        />
      </div>

      {kpiFilter !== "none" && (
        <button className="ud-ci-clear-kpi" onClick={() => setKpiFilter("none")}>{tx.clearKpiFilter}</button>
      )}

      {/* Search + Filter Bar */}
      <div className="ud-ci-toolbar">
        <input
          className="ud-ci-search"
          placeholder={tx.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="ud-ci-filters">
          {["all", "active", "cooling", "dormant"].map((s) => (
            <button
              key={s}
              className={`ud-ci-chip${statusFilter === s ? ` ud-ci-chip--${s}` : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {tx[s === "all" ? "allStatus" : s]}
            </button>
          ))}
        </div>
        <select className="ud-ci-select" value={towerFilter} onChange={(e) => setTowerFilter(e.target.value)}>
          <option value="all">{tx.allTowers}</option>
          {towers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="ud-ci-sorts">
          <span className="ud-ci-sort-label">{tx.sortBy}:</span>
          {SORT_OPTS.map((o) => (
            <button
              key={o.id}
              className={`ud-ci-sort-btn${sortKey === o.id ? " ud-ci-sort-btn--active" : ""}`}
              onClick={() => setSortKey(o.id)}
            >
              {o.label[lang] || o.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="ud-ci-bulk-bar">
          <span className="ud-ci-bulk-count">{selectedIds.length} selected</span>
          <button className="ud-ci-bulk-btn" onClick={() => setConfirmAction("pause")}>{tx.bulkPause}</button>
          <button className="ud-ci-bulk-btn" onClick={() => setConfirmAction("resume")}>{tx.bulkResume}</button>
          <button className="ud-ci-bulk-btn ud-ci-bulk-btn--primary" onClick={() => setConfirmAction("campaign")}>{tx.bulkLaunch}</button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="ud-ci-empty">
          <div className="ud-ci-empty__text">{schema.emptyState}</div>
          <div className="ud-ci-empty__sub">{tx.emptyCta}</div>
        </div>
      ) : (
        <div className="ud-ci-table-wrap">
          <table className="ud-ci-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}>
                  <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                </th>
                <th>{tx.cardId}</th>
                <th>{tx.taps}</th>
                <th>{tx.views}</th>
                <th>{tx.pricing}</th>
                <th>{tx.bookings}</th>
                <th>{tx.trend}</th>
                <th>{tx.vipSignals}</th>
                <th>{tx.status}</th>
                <th>{tx.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={`ud-ci-row ud-ci-row--${c.health}`} onClick={() => setSelectedCard(c)}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                  </td>
                  <td>
                    <div className="ud-ci-card-name">{c.name}</div>
                    <div className="ud-ci-card-meta">{c.tower}{c.type !== "-" ? ` · ${c.type}` : ""}</div>
                  </td>
                  <td className="ud-ci-hot">{c.totalTaps}</td>
                  <td>{c.views}</td>
                  <td>{c.pricing}</td>
                  <td>{c.bookings}</td>
                  <td><Spark data={c.sparkline} w={48} h={16} /></td>
                  <td>
                    {c.interestedVips && c.interestedVips.length > 0 ? (
                      <div className="ud-ci-vip-chips">
                        {c.interestedVips.slice(0, 2).map((v) => (
                          <span key={v.name || v.id} className="ud-ci-vip-chip">{v.name}</span>
                        ))}
                        {c.interestedVips.length > 2 && <span className="ud-ci-vip-more">+{c.interestedVips.length - 2}</span>}
                      </div>
                    ) : (
                      <span className="ud-ci-no-signal">—</span>
                    )}
                  </td>
                  <td><span className={`ud-ci-health ud-ci-health--${c.health}`}>{tx[c.health]}</span></td>
                  <td>
                    {c.sug === "deal" && (
                      <button
                        className="ud-ci-action-btn ud-ci-action-btn--deal"
                        onClick={(e) => { e.stopPropagation(); handleCreateDeal(c); }}
                      >
                        {tx.createDeal}
                      </button>
                    )}
                    {c.sug === "reactivate" && <span className="ud-ci-action-tag ud-ci-action-tag--reactivate">{tx.suggestReactivate}</span>}
                    {c.sug === "followup" && <span className="ud-ci-action-tag ud-ci-action-tag--followup">{tx.suggestFollowUp}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dataMode === "tenant" && <div className="ud-ci-demo-tag">{tx.demo}</div>}

      {/* Detail Drawer */}
      <CardDetail
        key={selectedCard?.id || "empty-card-detail"}
        card={selectedCard}
        tx={tx}
        onCreateDeal={handleCreateDeal}
        onClose={() => setSelectedCard(null)}
        salesReps={salesReps}
        onReassign={handleReassign}
        busy={savingAssignment}
        onToggleStatus={handleToggleStatus}
        statusBusy={statusBusy}
        parentLabel={schema.parentLabel}
      />

      {/* Confirm Dialogs */}
      {confirmAction === "pause" && (
        <ConfirmDialog
          title={tx.bulkPause}
          description={`${selectedIds.length} cards will be paused.`}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => handleBulkStatusChange("paused")}
          confirmLabel={tx.bulkPause}
          cancelLabel={tx.cancel || "Cancel"}
          busy={toolbarBusy}
        />
      )}
      {confirmAction === "resume" && (
        <ConfirmDialog
          title={tx.bulkResume}
          description={`${selectedIds.length} cards will be resumed.`}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => handleBulkStatusChange("active")}
          confirmLabel={tx.bulkResume}
          cancelLabel={tx.cancel || "Cancel"}
          busy={toolbarBusy}
        />
      )}
      {confirmAction === "campaign" && (
        <ConfirmDialog
          title={tx.bulkLaunch}
          description={`Create a draft campaign from ${selectedIds.length} cards.`}
          onCancel={() => { setConfirmAction(null); setBulkCampaignName(""); setBulkNameError(""); }}
          onConfirm={handleBulkCampaign}
          confirmLabel={tx.bulkLaunch}
          cancelLabel={tx.cancel || "Cancel"}
          busy={toolbarBusy}
        >
          <div style={{ margin: "8px 0" }}>
            <input
              className="ud-ci-search"
              placeholder={tx.campaignNamePlaceholder || "Campaign name"}
              value={bulkCampaignName}
              onChange={(e) => { setBulkCampaignName(e.target.value); setBulkNameError(""); }}
              style={{ width: "100%" }}
            />
            {bulkNameError && <div style={{ color: "#e63946", fontSize: 11, marginTop: 4 }}>{bulkNameError}</div>}
          </div>
        </ConfirmDialog>
      )}
    </div>
  );
}