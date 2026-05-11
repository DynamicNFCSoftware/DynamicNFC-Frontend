import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../i18n";
import { useRegion } from "../../../hooks/useRegion";
import { useSector } from "../../../hooks/useSector";
import { useDashboard } from "../../../pages/UnifiedDashboard/useDashboard";
import { trackDashboardEvent } from "../../../services/firestoreTracking";
import { detectTriggers } from "./triggerRules";
import "./SalesTriggerPanel.css";
function toPanelSectorId(rawSectorId) {
  const normalized = String(rawSectorId || "").toLowerCase();
  if (normalized === "real_estate" || normalized === "realestate") return "realEstate";
  if (normalized === "automotive") return "automotive";
  if (normalized === "yacht") return "yacht";
  return "realEstate";
}
function resolveSectorString(entry, sectorId) {
  if (entry == null) return "";
  if (typeof entry === "string") return entry;
  return entry[sectorId] || entry.realEstate || "";
}
function ageString(ms, tr, sectorId) {
  if (ms < 60_000) return resolveSectorString(tr("stpAgeNow"), sectorId);
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}${resolveSectorString(tr("stpAgeMinute"), sectorId)}`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}${resolveSectorString(tr("stpAgeHour"), sectorId)}`;
  return `${Math.floor(hr / 24)}${resolveSectorString(tr("stpAgeDay"), sectorId)}`;
}
function formatSignal(trigger, tr, sectorId) {
  let key = trigger.signalKey;
  if (key === "stpSignalRepeatView" && !trigger.signalArgs?.item) {
    key = "stpSignalRepeatViewGeneric";
  }
  const base = resolveSectorString(tr(key), sectorId);
  if (!base) return "";
  const args = trigger.signalArgs || {};
  return base
    .replace("{item}", args.item ?? "")
    .replace("{count}", args.count ?? "")
    .replace("{hours}", args.hours ?? "")
    .replace("{value}", args.value ? Number(args.value).toLocaleString() : "")
    .replace("{competitorCount}", args.competitorCount ?? "");
}
const EN_FALLBACK = {
  stpTitle: { realEstate: "Sales Triggers", automotive: "Sales Triggers", yacht: "Sales Triggers" },
  stpSub: {
    realEstate: "Named VIPs acting right now — open their profile and reach out.",
    automotive: "Named buyers acting right now — open their profile and reach out.",
    yacht: "Named clients acting right now — open their profile and reach out.",
  },
  stpEmpty: {
    realEstate: "No active triggers. Triggers appear when an invited VIP shows intent.",
    automotive: "No active triggers. Triggers appear when an invited buyer shows intent.",
    yacht: "No active triggers. Triggers appear when an invited client shows intent.",
  },
  stpOpenProfile: { realEstate: "Open profile", automotive: "Open profile", yacht: "Open profile" },
  stpUrgencyHot: { realEstate: "Hot", automotive: "Hot", yacht: "Hot" },
  stpUrgencyWarm: { realEstate: "Warm", automotive: "Warm", yacht: "Warm" },
  stpDividerWarm: { realEstate: "Watch list", automotive: "Watch list", yacht: "Watch list" },
  stpAgeNow: { realEstate: "just now", automotive: "just now", yacht: "just now" },
  stpAgeMinute: { realEstate: "m ago", automotive: "m ago", yacht: "m ago" },
  stpAgeHour: { realEstate: "h ago", automotive: "h ago", yacht: "h ago" },
  stpAgeDay: { realEstate: "d ago", automotive: "d ago", yacht: "d ago" },
  stpSignalRepeatView: {
    realEstate: "Viewed {item} {count}× in 15 min",
    automotive: "Configured {item} {count}× in 15 min",
    yacht: "Explored {item} {count}× in 15 min",
  },
  stpSignalRepeatViewGeneric: {
    realEstate: "Viewed the same unit {count}× in 15 min",
    automotive: "Configured the same vehicle {count}× in 15 min",
    yacht: "Explored the same yacht {count}× in 15 min",
  },
  stpSignalPricing: { realEstate: "Requested pricing", automotive: "Requested pricing", yacht: "Requested pricing" },
  stpSignalBrochure: {
    realEstate: "Downloaded brochure",
    automotive: "Downloaded spec sheet",
    yacht: "Downloaded yacht profile",
  },
  stpSignalBooking: {
    realEstate: "Requested viewing",
    automotive: "Requested test drive",
    yacht: "Requested boarding tour",
  },
  stpSignalReEngage: {
    realEstate: "Returned after {hours}h idle",
    automotive: "Returned after {hours}h idle",
    yacht: "Returned after {hours}h idle",
  },
  stpSignalContact: {
    realEstate: "Contacted advisor",
    automotive: "Contacted advisor",
    yacht: "Contacted broker",
  },
  stpSignalRoiCompleted: {
    realEstate: "Ran ROI calculator",
    automotive: "Ran TCO calculator",
    yacht: "Ran ROI calculator",
  },
  stpSignalIdleDeal: {
    realEstate: "High-value deal idle 48h+",
    automotive: "High-value deal idle 48h+",
    yacht: "High-value deal idle 48h+",
  },
  stpSignalCompeting: {
    realEstate: "Competing — {competitorCount} other VIP(s) viewing {item}",
    automotive: "Competing — {competitorCount} other buyer(s) viewing {item}",
    yacht: "Competing — {competitorCount} other client(s) viewing {item}",
  },
};

export default function SalesTriggerPanel() {
  const { events, vips, deals } = useDashboard();
  const { regionId } = useRegion();
  const { config: sectorCfg } = useSector();
  const tr = useTranslation("dashboard");
  const navigate = useNavigate();
  const sectorId = toPanelSectorId(sectorCfg?.id);
  const buckets = useMemo(
    () => detectTriggers(events || [], vips || [], deals || [], { region: regionId, sector: sectorId }),
    [events, vips, deals, regionId, sectorId]
  );
  const now = Date.now();
  const hasAny = buckets.hot.length + buckets.warm.length > 0;
  const text = (key) => {
    const translated = tr(key);
    if (translated === key) return resolveSectorString(EN_FALLBACK[key], sectorId);
    return resolveSectorString(translated, sectorId);
  };
  const handleOpen = (trigger) => {
    // Fire-and-forget — helper swallows its own errors, does not block navigation.
    trackDashboardEvent("trigger_acted_on", {
      vipId: trigger.vipId,
      ruleType: trigger.ruleType,
      urgency: trigger.urgency,
      triggerAgeMs: Date.now() - trigger.lastEventAt,
      signalKey: trigger.signalKey,
    });
    navigate("/unified/vip-crm", { state: { vipId: trigger.vipId } });
  };
  const renderRow = (trigger) => (
    <li key={trigger.id} className="stp-row" data-urgency={trigger.urgency}>
      <span className={`stp-dot stp-dot--${trigger.urgency}`} aria-hidden="true" />
      <div className="stp-row__main">
        <div className="stp-row__name">
          {trigger.vipName}
          {trigger.score != null ? <span className="stp-score">{trigger.score}</span> : null}
          <span className={`stp-chip stp-chip--${trigger.urgency}`}>
            {text(trigger.urgency === "hot" ? "stpUrgencyHot" : "stpUrgencyWarm")}
          </span>
        </div>
        <div className="stp-row__signal">{formatSignal(trigger, tr, sectorId)}</div>
      </div>
      <div className="stp-row__age">{ageString(now - trigger.lastEventAt, tr, sectorId)}</div>
      <button type="button" className="stp-row__cta" onClick={() => handleOpen(trigger)}>
        {text("stpOpenProfile")}
      </button>
    </li>
  );

  return (
    <section className="stp-panel ud-card" data-region={regionId} aria-label={text("stpTitle")}>
      <header className="stp-header">
        <div>
          <div className="ud-card-title">{text("stpTitle")}</div>
          <div className="ud-card-subtitle">{text("stpSub")}</div>
        </div>
      </header>

      {!hasAny ? (
        <div className="stp-empty">{text("stpEmpty")}</div>
      ) : (
        <ul className="stp-list" role="list">
          {buckets.hot.map(renderRow)}
          {buckets.warm.length > 0 && buckets.hot.length > 0 ? (
            <li className="stp-divider" aria-hidden="true">
              <span>{text("stpDividerWarm")}</span>
            </li>
          ) : null}
          {buckets.warm.map(renderRow)}
        </ul>
      )}
    </section>
  );
}
