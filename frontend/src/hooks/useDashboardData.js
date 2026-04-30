import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "../firebase";
import { useSector } from "./useSector";
import { useAuth } from "../contexts/AuthContext";
import { useRegion } from "./useRegion";
import { getPersonas } from "../config/regionConfig";
import { calculateDecayedScore, calculateVelocity, detectSalesTriggers, getSectorConfig } from "../config/sectorConfig";
import { checkTenantExists, seedTenantData, updateLastActivity } from "../services/tenantService";
import { normalizeSectorId } from "../utils/sectorId";

const HEARTBEAT_MS = 12 * 60 * 60 * 1000;
const CAMPAIGNS_PAGE_SIZE = 20;
const DATA_MODE_KEY = "ud_data_mode";
const EVENT_ALIAS = {
  comparison_view: "compare_units",
  explore_payment_plan: "payment_plan_viewed",
  contact_sales: "contact_agent",
  contact_advisor: "contact_agent",
  roi_calculator_click: "roi_calculator",
  view_floorplan: "view_floor_plan",
  floorplan_view: "view_floor_plan",
  floorplan_download: "download_brochure",
  unit_view: "view_unit",
  unit_compare: "compare_units",
  portal_open: "portal_opened",
  request_payment: "payment_plan_viewed",
  request_payment_plan: "payment_plan_viewed",
  request_quote: "request_pricing",
  pricing_request: "request_pricing",
  brochure_download: "download_brochure",
  quote_request: "request_pricing",
  test_drive_request: "book_viewing",
  book_test_drive: "book_viewing",
  compare_add: "compare_units",
  comparison_add: "compare_units",
};

const SECTOR_EVENT_ALIAS = {
  automotive: {
    portal_opened: "auto_portal_entry",
    showroom_visit: "auto_portal_entry",
    view_unit: "vehicle_view",
    unit_view: "vehicle_view",
    view_vehicle: "vehicle_view",
    request_pricing: "request_quote",
    pricing_request: "request_quote",
    quote_request: "request_quote",
    download_brochure: "download_brochure",
    book_viewing: "test_drive_request",
    book_test_drive: "test_drive_request",
    test_drive_request: "test_drive_request",
    roi_calculator: "finance_calculator",
    roi_calculator_click: "finance_calculator",
    payment_plan_viewed: "lease_plan_viewed",
    explore_payment_plan: "lease_plan_viewed",
    compare_units: "compare_vehicles",
    compare_add: "compare_vehicles",
    comparison_add: "compare_vehicles",
    view_floor_plan: "view_specs",
    save_configuration: "save_configuration",
    config_save: "save_configuration",
  },
};

const safeDate = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

const toType = (eventName, sectorId) => {
  const normalized = EVENT_ALIAS[eventName] || eventName || "unknown_event";
  return SECTOR_EVENT_ALIAS[sectorId]?.[normalized] || normalized;
};
const toPersonKey = (event) => event.vipName || event.userName || event.leadName || event.sessionId || "anon";
const WALK_IN_CANDIDATE_ID = "walk-in-prospect";

export default function useDashboardData() {
  const { sectorId: legacySectorId, activeSectorId } = useSector();
  const sectorId = useMemo(() => normalizeSectorId(activeSectorId || legacySectorId), [activeSectorId, legacySectorId]);
  const { user } = useAuth();
  const { regionId, region, locale, currencySymbol } = useRegion();
  const sectorEvents = useMemo(() => getSectorConfig(sectorId).events, [sectorId]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataMode, setDataModeState] = useState(() => {
    const stored = localStorage.getItem(DATA_MODE_KEY);
    return stored === "mock" ? "mock" : "tenant";
  });
  const [seedingInProgress, setSeedingInProgress] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFamilyBuyers, _setShowFamilyBuyers] = useState(() => {
    try { return localStorage.getItem("ud:vip:showFamily") === "1"; }
    catch { return false; }
  });
  const setShowFamilyBuyers = (next) => {
    _setShowFamilyBuyers((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem("ud:vip:showFamily", value ? "1" : "0"); }
      catch {}
      return value;
    });
  };

  // FIX R2-5: Scoring thresholds (persisted in localStorage)
  const [thresholds, setThresholds] = useState({
    hot: parseInt(localStorage.getItem("ud-threshold-hot") || "75", 10),
    warm: parseInt(localStorage.getItem("ud-threshold-warm") || "50", 10),
  });
  const updateThresholds = useCallback((next) => {
    setThresholds(next);
    localStorage.setItem("ud-threshold-hot", String(next.hot));
    localStorage.setItem("ud-threshold-warm", String(next.warm));
  }, []);

  const [rawEvents, setRawEvents] = useState([]);
  const [rawLeads, setRawLeads] = useState([]);
  const [rawDeals, setRawDeals] = useState([]);
  const [rawCards, setRawCards] = useState([]);
  const [rawCampaigns, setRawCampaigns] = useState([]);
  const [rawSettings, setRawSettings] = useState(null);
  const seedingRef = useRef(false);
  const campaignsCursorRef = useRef(null);
  const campaignPagesLoadedRef = useRef(false);
  const [campaignsHasMore, setCampaignsHasMore] = useState(true);
  const [campaignsLoadingMore, setCampaignsLoadingMore] = useState(false);
  const filterBySectorAndRegion = useCallback(
    (rows = []) =>
      rows.filter((row) => {
        const sectorMatch = normalizeSectorId(row?.sector) === sectorId;
        if (!sectorMatch) return false;
        const rowRegion = String(row?.region || "").toLowerCase().trim();
        if (!rowRegion) return false;
        return rowRegion === String(regionId || "").toLowerCase().trim();
      }),
    [sectorId, regionId]
  );

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    let started = 0;
    let ready = 0;

    const markReady = () => {
      ready += 1;
      if (!cancelled && ready >= started) setLoading(false);
    };

    const unsubscribers = [];
    setLoading(true);
    setError(null);
    setCampaignsHasMore(true);
    setCampaignsLoadingMore(false);
    campaignsCursorRef.current = null;
    campaignPagesLoadedRef.current = false;

    const init = async () => {
      if (seedingRef.current) {
        return;
      }
      seedingRef.current = true;
      try {
        const tenant = await checkTenantExists(user.uid, regionId);
        if (tenant.needsSeed) {
          setSeedingInProgress(true);
          await seedTenantData(user.uid, user, regionId);
          if (cancelled) return;
          setSeedingInProgress(false);
        }

        await updateLastActivity(user.uid, { force: true });
        if (cancelled) return;

        const eventsQ = query(
          collection(db, "tenants", user.uid, "events"),
          orderBy("timestamp", "desc"),
          limit(500)
        );
        started += 1;
        unsubscribers.push(
          onSnapshot(
            eventsQ,
            (snap) => {
              setRawEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
              markReady();
            },
            (err) => {
              setError(err.message || "Failed loading events");
              markReady();
            }
          )
        );

        started += 1;
        unsubscribers.push(
          onSnapshot(
            collection(db, "tenants", user.uid, "leads"),
            (snap) => {
              setRawLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
              markReady();
            },
            (err) => {
              setError(err.message || "Failed loading leads");
              markReady();
            }
          )
        );

        started += 1;
        unsubscribers.push(
          onSnapshot(
            collection(db, "tenants", user.uid, "deals"),
            (snap) => {
              setRawDeals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
              markReady();
            },
            (err) => {
              setError(err.message || "Failed loading deals");
              markReady();
            }
          )
        );

        started += 1;
        unsubscribers.push(
          onSnapshot(
            collection(db, "tenants", user.uid, "cards"),
            (snap) => {
              setRawCards(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
              markReady();
            },
            (err) => {
              setError(err.message || "Failed loading cards");
              markReady();
            }
          )
        );

        started += 1;
        unsubscribers.push(
          onSnapshot(
            query(
              collection(db, "tenants", user.uid, "campaigns"),
              orderBy("createdAt", "desc"),
              limit(CAMPAIGNS_PAGE_SIZE)
            ),
            (snap) => {
              const firstPageRows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
              const firstPageIds = new Set(firstPageRows.map((row) => row.id));
              setRawCampaigns((prev) => {
                const tailRows = prev.filter((row) => !firstPageIds.has(row.id));
                return [...firstPageRows, ...tailRows];
              });
              if (!campaignPagesLoadedRef.current) {
                campaignsCursorRef.current = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
                setCampaignsHasMore(snap.docs.length === CAMPAIGNS_PAGE_SIZE);
              }
              markReady();
            },
            (err) => {
              setError(err.message || "Failed loading campaigns");
              markReady();
            }
          )
        );

        started += 1;
        unsubscribers.push(
          onSnapshot(
            doc(db, "tenants", user.uid, "settings", "preferences"),
            (snap) => {
              setRawSettings(snap.exists() ? snap.data() : null);
              markReady();
            },
            (err) => {
              setError(err.message || "Failed loading settings");
              markReady();
            }
          )
        );
      } catch (err) {
        if (!cancelled) {
          setSeedingInProgress(false);
          setLoading(false);
          setError(err.message || "Failed to initialize tenant workspace");
        }
      } finally {
        if (cancelled) {
          seedingRef.current = false;
        }
      }
    };

    init();
    return () => {
      cancelled = true;
      seedingRef.current = false;
      unsubscribers.forEach((u) => u?.());
    };
  }, [refreshKey, user, regionId]);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const id = window.setInterval(() => {
      updateLastActivity(user.uid).catch(() => {});
    }, HEARTBEAT_MS);
    return () => window.clearInterval(id);
  }, [user]);

  const sectorRawEvents = useMemo(() => filterBySectorAndRegion(rawEvents), [rawEvents, filterBySectorAndRegion]);
  const sectorRawLeads = useMemo(() => filterBySectorAndRegion(rawLeads), [rawLeads, filterBySectorAndRegion]);
  const sectorRawDeals = useMemo(() => filterBySectorAndRegion(rawDeals), [rawDeals, filterBySectorAndRegion]);
  const sectorRawCards = useMemo(() => filterBySectorAndRegion(rawCards), [rawCards, filterBySectorAndRegion]);
  const sectorRawCampaigns = useMemo(() => filterBySectorAndRegion(rawCampaigns), [rawCampaigns, filterBySectorAndRegion]);

  const normalizedEvents = useMemo(() => {
    const config = getSectorConfig(sectorId);
    const allowed = new Set(Object.values(config.events));
    return sectorRawEvents
      .map((row) => {
        const mappedType = toType(row.event || row.type, sectorId);
        const actor = row.vipName || row.userName || row.leadName || row.sessionId || "Visitor";
        const item =
          row.unitName ||
          row.item ||
          row.vehicleName ||
          row.metadata?.unitName ||
          row.metadata?.vehicleName ||
          row.details?.unitName ||
          row.details?.vehicleName ||
          row.details?.unitId ||
          row.vehicleId ||
          row.unitId ||
          null;
        const ts = safeDate(row.timestamp);
        return {
          id: row.id,
          event: mappedType,
          rawEvent: row.event || row.type || null,
          type: mappedType,
          portalType: row.portalType || "anonymous",
          vipName: row.vipName || null,
          userName: row.userName || null,
          leadName: row.leadName || null,
          sessionId: row.sessionId || null,
          unitName: item,
          unitType: row.unitType || null,
          tower: row.tower || null,
          deviceType: row.deviceType || null,
          source: row.source || null,
          metadata: row.metadata || null,
          timestamp: ts,
          personName: actor,
          item,
          isVip: row.portalType === "vip",
          description: item ? `${actor} - ${mappedType.replace(/_/g, " ")} -> ${item}` : `${actor} - ${mappedType.replace(/_/g, " ")}`,
        };
      })
      .filter((e) => allowed.has(e.type) || e.portalType === "lead" || e.portalType === "registered" || e.portalType === "anonymous")
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [sectorRawEvents, sectorId]);
  // Alias for backward compat
  const events = normalizedEvents || [];

  const scoredVips = useMemo(() => {
    const vipEvents = normalizedEvents.filter((e) => e.portalType === "vip" && !!e.vipName);
    const byVip = {};
    vipEvents.forEach((evt) => {
      const key = evt.vipName;
      if (!byVip[key]) byVip[key] = [];
      byVip[key].push(evt);
    });
    return Object.entries(byVip)
      .map(([name, rows]) => {
        const sorted = [...rows].sort((a, b) => b.timestamp - a.timestamp);
        const lead = sectorRawLeads.find((l) => (l.name || "").toLowerCase() === name.toLowerCase());
        const topCount = {};
        sorted.forEach((e) => {
          if (!e.unitName) return;
          topCount[e.unitName] = (topCount[e.unitName] || 0) + 1;
        });
        const topItem = Object.entries(topCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
        const score = calculateDecayedScore(
          sorted.map((e) => ({ type: e.type, timestamp: e.timestamp })),
          sectorId
        );
        const triggers = detectSalesTriggers(
          sorted.map((e) => ({ type: e.type, timestamp: e.timestamp })),
          sectorId
        );
        const velocity = calculateVelocity(
          sorted.map((e) => ({ type: e.type, timestamp: e.timestamp })),
          sectorId
        );
        return {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          email: lead?.email || "",
          score,
          lastSeen: sorted[0]?.timestamp || null,
          topItem,
          events: sorted.map((e) => ({ type: e.type, timestamp: e.timestamp, item: e.unitName || null })),
          alert: triggers[0]?.type || null,
          alerts: triggers.map((t) => t.type),
          triggers,
          trigger: triggers[0]?.message?.en || "",
          velocity,
          atRisk: (velocity?.idleDays || 0) >= 5,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [normalizedEvents, sectorRawLeads, sectorId]);

  const familyPersonas = useMemo(
    () => (getPersonas(sectorId, regionId) || []).filter((persona) => persona?.type === "family"),
    [sectorId, regionId]
  );
  const familyBuyerCount = familyPersonas.length;

  const vips = useMemo(() => {
    if (!showFamilyBuyers) return scoredVips;
    const existingNames = new Set(scoredVips.map((vip) => String(vip?.name || "").toLowerCase()));
    const familyRows = familyPersonas
      .filter((persona) => !existingNames.has(String(persona?.name || "").toLowerCase()))
      .map((persona, index) => ({
        id: `family-${persona.id || index}`,
        name: persona.name,
        email: persona.email || "",
        score: 0,
        lastSeen: null,
        topItem: null,
        events: [],
        alert: null,
        alerts: [],
        triggers: [],
        trigger: "",
        velocity: { idleDays: 0, totalSessions: 0, eventsPerDay: 0 },
        atRisk: false,
        isFamily: true,
      }));
    return [...scoredVips, ...familyRows];
  }, [scoredVips, showFamilyBuyers, familyPersonas]);

  // Build a name→VIP lookup so deals can pull real intent scores
  const vipByName = useMemo(() => {
    const map = {};
    scoredVips.forEach((v) => { if (v.name) map[v.name.toLowerCase()] = v; });
    return map;
  }, [scoredVips]);

  const deals = useMemo(
    () =>
      sectorRawDeals.map((d) => {
        const leadName = d.leadName || "";
        const matchedVip = vipByName[leadName.toLowerCase()] || null;
        const probScore = Math.round(Number(d.probability || 0) * 100);
        // Prefer real VIP intent score when available; fall back to probability-based
        const intentScore = matchedVip?.score ?? null;
        const finalScore = intentScore !== null ? intentScore : probScore;
        return {
          id: d.id,
          name: d.title || `${leadName || "Lead"} - ${d.unitName || "Unit"}`,
          leadName,
          item: d.unitName || "",
          categoryId: d.categoryId || "",
          categoryName: d.categoryName || "",
          value: Number(d.value || 0),
          stage: d.stage || "inquiry",
          probability: Number(d.probability || 0),
          score: finalScore,
          intentScore,
          probScore,
          assignedRep: d.assignedRep || "",
          createdAt: d.createdAt || null,
          updatedAt: d.updatedAt || null,
          expectedCloseAt: d.expectedCloseAt || null,
          // Enrichment from matched VIP
          vipLinked: !!matchedVip,
          velocity: matchedVip?.velocity || null,
          triggers: matchedVip?.triggers || [],
          lastSeen: matchedVip?.lastSeen || null,
          atRisk: matchedVip?.atRisk || false,
        };
      }),
    [sectorRawDeals, vipByName]
  );

  // Auto-suggested deals: VIPs with hot triggers who don't already have a deal
  const suggestedDeals = useMemo(() => {
    const dealLeadNames = new Set(deals.map((d) => (d.leadName || "").toLowerCase()));
    const DEAL_TRIGGERS = ["pricing_3x", "booking_request", "quote_requested", "test_drive"];
    return scoredVips
      .filter((v) => {
        if (dealLeadNames.has((v.name || "").toLowerCase())) return false;
        const hasTrigger = (v.triggers || []).some((t) => DEAL_TRIGGERS.includes(t.type));
        return hasTrigger || v.score >= 70;
      })
      .map((v) => ({
        vipId: v.id,
        name: v.name,
        score: v.score,
        topItem: v.topItem || "",
        triggers: v.triggers || [],
        velocity: v.velocity,
        suggestedStage: (v.triggers || []).some((t) => t.type === "booking_request" || t.type === "test_drive")
          ? "viewing_scheduled"
          : v.score >= 75
            ? "contacted"
            : "new_lead",
      }));
  }, [scoredVips, deals]);

  // Auto-advance: check existing deals against VIP events and sectorConfig rules
  const pendingAdvances = useMemo(() => {
    const config = getSectorConfig(sectorId);
    const rules = config.pipeline?.autoAdvanceRules || [];
    if (rules.length === 0 || deals.length === 0) return [];

    const stageOrder = (config.pipeline?.stages || []).map((s) => s.id);
    const stageIdx = (id) => stageOrder.indexOf(id);
    const now = Date.now();
    const advances = [];

    deals.forEach((deal) => {
      if (!deal.vipLinked || !deal.leadName) return;
      const vip = vipByName[(deal.leadName || "").toLowerCase()];
      if (!vip) return;

      const vipEvents = normalizedEvents.filter(
        (e) => e.vipName === vip.name || e.personName === vip.name
      );

      for (const rule of rules) {
        // Only advance forward
        if (rule.onlyForward && stageIdx(rule.targetStage) <= stageIdx(deal.stage)) continue;

        // Count matching events in window
        const windowMs = (rule.windowHours || 168) * 3600000;
        const matchCount = vipEvents.filter((e) => {
          const ts = safeDate(e.timestamp).getTime();
          return rule.events.includes(e.type) && (now - ts) < windowMs;
        }).length;

        if (matchCount >= (rule.minCount || 1)) {
          advances.push({
            dealId: deal.id,
            dealName: deal.name,
            leadName: deal.leadName,
            currentStage: deal.stage,
            targetStage: rule.targetStage,
            targetLabel: (config.pipeline?.stages || []).find((s) => s.id === rule.targetStage)?.label || { en: rule.targetStage },
            reason: rule.events.join(" + "),
            matchCount,
          });
          break; // One advance per deal (highest priority rule first)
        }
      }
    });

    return advances;
  }, [deals, normalizedEvents, sectorId, vipByName]);

  const cards = useMemo(() => {
    const byUnit = {};
    const now = Date.now();
    const norm = (v) => String(v || "").trim().toLowerCase();
    normalizedEvents.forEach((e) => {
      const unitName = e.unitName || "Unknown Unit";
      const key = norm(unitName);
      if (!byUnit[key]) {
        byUnit[key] = {
          id: unitName.toLowerCase().replace(/\s+/g, "-"),
          name: unitName,
          views: 0,
          downloads: 0,
          pricing: 0,
          bookings: 0,
          tower: e.tower || "-",
          type: e.unitType || "-",
          status: "active",
          totalTaps: 0,
          lastTapAt: e.timestamp,
          assignedName: "",
          // 7-day sparkline per unit
          sparkline: new Array(7).fill(0),
          // VIP names who interacted with this unit
          _vipNames: new Set(),
        };
      }
      byUnit[key].totalTaps += 1;
      byUnit[key].lastTapAt = e.timestamp > byUnit[key].lastTapAt ? e.timestamp : byUnit[key].lastTapAt;
      if (e.type === sectorEvents.itemView || e.type === sectorEvents.itemDetail) byUnit[key].views += 1;
      if (e.type === sectorEvents.brochureDownload) byUnit[key].downloads += 1;
      if (e.type === sectorEvents.pricingRequest) byUnit[key].pricing += 1;
      if (e.type === sectorEvents.booking) byUnit[key].bookings += 1;
      // Sparkline: day bucket (0=6 days ago, 6=today)
      const dayAge = Math.floor((now - new Date(e.timestamp).getTime()) / 86400000);
      if (dayAge >= 0 && dayAge < 7) byUnit[key].sparkline[6 - dayAge] += 1;
      // VIP linking
      if (e.portalType === "vip" && e.vipName) byUnit[key]._vipNames.add(e.vipName);
    });

    const enrichAggregate = (u) => {
      const vipNames = [...(u._vipNames || [])];
      const interestedVips = vipNames
        .map((n) => {
          const v = vipByName[n.toLowerCase()];
          return v ? { name: v.name, score: v.score, id: v.id } : { name: n, score: 0, id: n };
        })
        .sort((a, b) => b.score - a.score);
      const linkedDeals = deals.filter((d) => (d.item || "").toLowerCase() === (u.name || "").toLowerCase());
      return { ...u, interestedVips, linkedDeals, linkedDealCount: linkedDeals.length };
    };

    const aggregateCards = Object.values(byUnit).map((u) => {
      const base = enrichAggregate(u);
      delete base._vipNames;
      return base;
    });

    // Prefer real tenant card docs when available, then enrich with event aggregates.
    const cardsFromDocs = (sectorRawCards || []).map((docCard) => {
      const nameKey = norm(docCard.unitName || docCard.name || docCard.id);
      const altKey = norm(String(docCard.id || "").replace(/-/g, " "));
      const agg = byUnit[nameKey] || byUnit[altKey] || null;
      const aggregate = agg ? enrichAggregate(agg) : null;
      return {
        id: docCard.id,
        name: docCard.name || docCard.unitName || aggregate?.name || docCard.id,
        views: aggregate?.views || 0,
        downloads: aggregate?.downloads || 0,
        pricing: aggregate?.pricing || 0,
        bookings: aggregate?.bookings || 0,
        tower: docCard.tower || aggregate?.tower || "-",
        type: docCard.type || aggregate?.type || "-",
        status: docCard.status || aggregate?.status || "active",
        totalTaps: aggregate?.totalTaps || 0,
        lastTapAt: aggregate?.lastTapAt || docCard.updatedAt || docCard.createdAt || null,
        assignedRepId: docCard.assignedRepId || "",
        assignedRepName: docCard.assignedRepName || "",
        assignedName: docCard.assignedRepName || "",
        sparkline: aggregate?.sparkline || new Array(7).fill(0),
        interestedVips: aggregate?.interestedVips || [],
        linkedDeals: aggregate?.linkedDeals || [],
        linkedDealCount: aggregate?.linkedDealCount || 0,
      };
    });

    if ((sectorRawCards || []).length === 0) {
      return aggregateCards.sort((a, b) => b.views - a.views);
    }

    const docNames = new Set(cardsFromDocs.map((c) => norm(c.name)));
    const aggregateRemainder = aggregateCards.filter((c) => !docNames.has(norm(c.name)));
    return [...cardsFromDocs, ...aggregateRemainder].sort((a, b) => b.views - a.views);
  }, [normalizedEvents, sectorEvents, vipByName, deals, sectorRawCards]);

  const campaigns = useMemo(() => sectorRawCampaigns.map((c) => ({ id: c.id, ...c })), [sectorRawCampaigns]);

  // Campaign benchmark: avg conversion rate across all active campaigns
  const campaignBenchmark = useMemo(() => {
    const active = campaigns.filter((c) => c.status === "active");
    if (active.length === 0) return { avgConvRate: 0, totalActive: 0 };
    const totalTaps = active.reduce((s, c) => s + Number(c.sent || c.totalCards || 0), 0);
    const totalConv = active.reduce((s, c) => s + Number(c.converted || 0), 0);
    return {
      avgConvRate: totalTaps > 0 ? Math.round((totalConv / totalTaps) * 1000) / 10 : 0,
      totalActive: active.length,
    };
  }, [campaigns]);

  // Expiring campaigns: endDate set and < 7 days away or already expired
  const expiringCampaigns = useMemo(() => {
    const now = Date.now();
    const SEVEN_DAYS = 7 * 86400000;
    return campaigns
      .filter((c) => {
        if (!c.endDate || c.status === "archived") return false;
        const end = c.endDate.toDate ? c.endDate.toDate().getTime() : new Date(c.endDate).getTime();
        return !isNaN(end) && (end - now) < SEVEN_DAYS;
      })
      .map((c) => {
        const end = c.endDate.toDate ? c.endDate.toDate().getTime() : new Date(c.endDate).getTime();
        const daysLeft = Math.ceil((end - now) / 86400000);
        return { ...c, daysLeft, expired: daysLeft < 0 };
      });
  }, [campaigns]);

  const loadMoreCampaigns = useCallback(async () => {
    if (!user?.uid || campaignsLoadingMore || !campaignsHasMore || !campaignsCursorRef.current) return;
    setCampaignsLoadingMore(true);
    try {
      const nextQ = query(
        collection(db, "tenants", user.uid, "campaigns"),
        orderBy("createdAt", "desc"),
        startAfter(campaignsCursorRef.current),
        limit(CAMPAIGNS_PAGE_SIZE)
      );
      const snap = await getDocs(nextQ);
      const nextRows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (nextRows.length === 0) {
        setCampaignsHasMore(false);
        return;
      }
      setRawCampaigns((prev) => {
        const prevIds = new Set(prev.map((row) => row.id));
        const deduped = nextRows.filter((row) => !prevIds.has(row.id));
        return [...prev, ...deduped];
      });
      campaignsCursorRef.current = snap.docs[snap.docs.length - 1];
      campaignPagesLoadedRef.current = true;
      setCampaignsHasMore(snap.docs.length === CAMPAIGNS_PAGE_SIZE);
    } catch (err) {
      setError(err.message || "Failed loading more campaigns");
    } finally {
      setCampaignsLoadingMore(false);
    }
  }, [user, campaignsLoadingMore, campaignsHasMore]);

  const analytics = useMemo(() => {
    const config = getSectorConfig(sectorId);
    const categoryInterest = {};
    // Initialize all category IDs from sectorConfig with 0
    (config.inventory?.categories || []).forEach((cat) => {
      categoryInterest[cat.id] = 0;
    });
    // Map event tower/category/collection to cat.id
    const catNames = (config.inventory?.categories || []).map((c) => ({
      id: c.id,
      en: (c.name?.en || "").toLowerCase(),
    }));
    normalizedEvents.forEach((e) => {
      const raw = (e.tower || e.category || e.collection || "").toLowerCase();
      if (!raw) return;
      const matched = catNames.find(
        (c) => c.id === raw || c.id === raw.replace(/\s+/g, "_") || c.en === raw || raw.includes(c.en) || c.en.includes(raw)
      );
      if (matched) categoryInterest[matched.id] = (categoryInterest[matched.id] || 0) + 1;
    });

    const weeklyTrend = Array(7).fill(0);
    const now = Date.now();
    normalizedEvents.forEach((e) => {
      const d = Math.floor((now - safeDate(e.timestamp).getTime()) / 86400000);
      if (d >= 0 && d < 7) weeklyTrend[6 - d] += 1;
    });

    const convActions = Array.from(
      new Set([
        sectorEvents.itemView,
        sectorEvents.pricingRequest,
        sectorEvents.brochureDownload,
        sectorEvents.booking,
        sectorEvents.comparison,
        sectorEvents.paymentPlan,
        sectorEvents.contactAgent,
        "contact_agent",
      ])
    );
    const conv = convActions.reduce((acc, action) => {
      const bucket = normalizedEvents.filter((e) => e.type === action || e.event === action);
      acc[action] = {
        vip: bucket.filter((e) => e.portalType === "vip").length,
        std: bucket.filter((e) => e.portalType !== "vip").length,
      };
      return acc;
    }, {});

    const peopleMap = normalizedEvents.reduce((acc, e) => {
      const key = toPersonKey(e);
      const row = acc[key] || { name: e.vipName || e.userName || e.leadName || key, events: [] };
      row.events.push({ type: e.type, timestamp: e.timestamp });
      acc[key] = row;
      return acc;
    }, {});
    const people = Object.values(peopleMap)
      .map((p) => ({
        name: p.name,
        decayedScore: calculateDecayedScore(p.events, sectorId),
        events: p.events.length,
      }))
      .sort((a, b) => b.decayedScore - a.decayedScore);

    const vipHeatMap = {};
    normalizedEvents
      .filter((e) => e.portalType === "vip" && e.vipName)
      .forEach((e) => {
        const key = e.vipName;
        vipHeatMap[key] = vipHeatMap[key] || { name: key, ph: 0, br3: 0, br2: 0, br1: 0 };
        if (e.unitType === "penthouse") vipHeatMap[key].ph += 1;
        if (e.unitType === "3br") vipHeatMap[key].br3 += 1;
        if (e.unitType === "2br") vipHeatMap[key].br2 += 1;
        if (e.unitType === "1br" || e.unitType === "studio") vipHeatMap[key].br1 += 1;
      });
    const vipHeat = Object.values(vipHeatMap);

    const funnelData = {
      opened: normalizedEvents.filter((e) => e.type === sectorEvents.portalEntry).length,
      viewed: normalizedEvents.filter((e) => e.type === sectorEvents.itemView || e.type === sectorEvents.itemDetail).length,
      priced: normalizedEvents.filter((e) => e.type === sectorEvents.pricingRequest).length,
      booked: normalizedEvents.filter((e) => e.type === sectorEvents.booking).length,
    };

    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    normalizedEvents.forEach((e) => {
      if (!e.deviceType) return;
      const d = e.deviceType.toLowerCase();
      if (d.includes("mobile")) deviceCounts.mobile += 1;
      else if (d.includes("tablet")) deviceCounts.tablet += 1;
      else deviceCounts.desktop += 1;
    });
    const totalDevices = deviceCounts.mobile + deviceCounts.desktop + deviceCounts.tablet;
    const deviceBreakdown = totalDevices > 0 ? {
      mobile: Math.round((deviceCounts.mobile / totalDevices) * 100),
      desktop: Math.round((deviceCounts.desktop / totalDevices) * 100),
      tablet: Math.round((deviceCounts.tablet / totalDevices) * 100),
    } : null;

    const sourceCounts = { nfc: 0, direct: 0, referral: 0 };
    normalizedEvents.forEach((e) => {
      if (!e.source) return;
      const s = e.source.toLowerCase();
      if (s === "nfc") sourceCounts.nfc += 1;
      else if (s === "referral") sourceCounts.referral += 1;
      else sourceCounts.direct += 1;
    });
    const totalSources = sourceCounts.nfc + sourceCounts.direct + sourceCounts.referral;
    const trafficSources = totalSources > 0 ? {
      nfc: Math.round((sourceCounts.nfc / totalSources) * 100),
      direct: Math.round((sourceCounts.direct / totalSources) * 100),
      referral: Math.round((sourceCounts.referral / totalSources) * 100),
    } : null;

    return {
      weeklyTrend,
      deviceBreakdown,
      categoryInterest,
      trafficSources,
      // Inventory availability per category — derived from total events + category count
      inventoryAvailable: Object.fromEntries(
        (config.inventory?.categories || []).map((cat) => {
          const catCount = config.inventory?.categories?.length || 3;
          const totalPerCat = sectorId === "automotive" ? 5 : Math.ceil(18 / catCount);
          const interest = categoryInterest[cat.id] || 0;
          return [cat.id, { total: totalPerCat, available: Math.max(0, totalPerCat - Math.min(interest, totalPerCat)) }];
        })
      ),
      scoreDist: [
        { band: "0-20", count: scoredVips.filter((v) => v.score <= 20).length, color: "#6ba3c7" },
        { band: "21-40", count: scoredVips.filter((v) => v.score > 20 && v.score <= 40).length, color: "#457b9d" },
        { band: "41-60", count: scoredVips.filter((v) => v.score > 40 && v.score <= 60).length, color: "#eab308" },
        { band: "61-80", count: scoredVips.filter((v) => v.score > 60 && v.score <= 80).length, color: "#f97316" },
        { band: "81-100", count: scoredVips.filter((v) => v.score > 80).length, color: "#e63946" },
      ],
      conv,
      vipHeat,
      people,
      funnelData,
    };
  }, [normalizedEvents, sectorId, sectorEvents, scoredVips]);

  const kpis = useMemo(() => {
    const activeVips = new Set(normalizedEvents.filter((e) => e.portalType === "vip").map((e) => e.vipName).filter(Boolean)).size;
    const registeredSessions = new Set(
      normalizedEvents.filter((e) => e.portalType === "registered").map((e) => e.userName).filter(Boolean)
    ).size;
    const anonSessions = new Set(
      normalizedEvents.filter((e) => e.portalType === "anonymous").map((e) => e.sessionId).filter(Boolean)
    ).size;
    const totalEvents = normalizedEvents.length;
    const pipelineValue = deals.reduce((sum, d) => sum + Number(d.value || 0), 0);

    const grouped = normalizedEvents.reduce((acc, e) => {
      const key = toPersonKey(e);
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    }, {});

    const ttfas = [];
    const velocities = [];
    Object.values(grouped).forEach((rows) => {
      const sorted = [...rows].sort((a, b) => a.timestamp - b.timestamp);
      const opened = sorted.find((r) => r.type === sectorEvents.portalEntry);
      const firstAction = sorted.find((r) => r.type !== sectorEvents.portalEntry);
      if (opened && firstAction) ttfas.push(Math.max(0, Math.round((firstAction.timestamp - opened.timestamp) / 60000)));
      if (sorted.length > 1) velocities.push(Math.max(1, Math.round((sorted[sorted.length - 1].timestamp - sorted[0].timestamp) / 86400000)));
    });

    const bookings = normalizedEvents.filter((e) => e.type === sectorEvents.booking).length;
    const vipBookings = normalizedEvents.filter((e) => e.portalType === "vip" && e.type === sectorEvents.booking).length;
    const standardBookings = Math.max(0, bookings - vipBookings);
    const vipRate = vipBookings / Math.max(activeVips, 1);
    const stdRate = standardBookings / Math.max(registeredSessions + anonSessions, 1);
    const conversionLift = Number((vipRate / Math.max(stdRate, 0.01)).toFixed(1));

    return {
      activeVips,
      registeredSessions,
      anonSessions,
      totalEvents,
      avgTTFA: ttfas.length ? Math.round(ttfas.reduce((a, b) => a + b, 0) / ttfas.length) : null,
      avgVel: velocities.length ? Math.round(velocities.reduce((a, b) => a + b, 0) / velocities.length) : null,
      pipelineValue,
      vip_sessions: activeVips,
      website_visitors: registeredSessions + anonSessions,
      bookings,
      conversion_lift: Number.isFinite(conversionLift) ? conversionLift : 0,
    };
  }, [deals, normalizedEvents, sectorEvents]);

  // FIX R2-2: Alerts computed from VIP data + thresholds
  const alerts = useMemo(() => {
    const hotLeads = scoredVips.filter((v) => v.score >= thresholds.hot).length;
    const activeAlerts = scoredVips.filter((v) => v.triggers && v.triggers.length > 0).length;
    const avgScore = scoredVips.length > 0 ? Math.round(scoredVips.reduce((s, v) => s + v.score, 0) / scoredVips.length) : 0;
    return { hotLeads, activeAlerts, avgScore };
  }, [scoredVips, thresholds]);

  // CC-3: KPI sparklines — 7-day daily counts per KPI
  const sparklines = useMemo(() => {
    const spark = (subset) => {
      const days = new Array(7).fill(0);
      const now = Date.now();
      subset.forEach((e) => {
        const d = Math.floor((now - safeDate(e.timestamp).getTime()) / 86400000);
        if (d >= 0 && d < 7) days[6 - d]++;
      });
      return days;
    };
    return {
      vip_sessions: spark(normalizedEvents.filter((e) => e.portalType === "vip")),
      website_visitors: spark(normalizedEvents),
      bookings: spark(normalizedEvents.filter((e) => e.type === sectorEvents.booking)),
      conversion_lift: new Array(7).fill(0),
    };
  }, [normalizedEvents, sectorEvents]);

  // CC-4: Feed counts by portal type
  const feedCounts = useMemo(() => {
    const c = { all: normalizedEvents.length, vip: 0, registered: 0, lead: 0, anonymous: 0 };
    normalizedEvents.forEach((e) => {
      const p = e.portalType || "anonymous";
      if (p === "vip") c.vip++;
      else if (p === "registered" || p === "family") c.registered++;
      else if (p === "lead") c.lead++;
      else c.anonymous++;
    });
    return c;
  }, [normalizedEvents]);

  // CC-5: Call queue — VIPs with triggers, sorted by score
  const callQueue = useMemo(() => {
    return scoredVips
      .filter((v) => v.triggers && v.triggers.length > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5)
      .map((v) => ({
        id: v.id,
        name: v.name,
        score: v.score || 0,
        triggerReason: (v.triggers[0]?.type || "activity").replace(/_/g, " "),
        triggerIcon: v.triggers[0]?.icon || "📞",
        triggerSeverity: v.triggers[0]?.severity || "medium",
        topItem: v.topItem,
        idleDays: v.velocity?.idleDays || 0,
      }));
  }, [scoredVips]);

  // CC-6: Funnel data with drop-off
  const funnelData = useMemo(() => {
    const config = getSectorConfig(sectorId);
    const funnelMap = {
      visit: [sectorEvents.portalEntry],
      browse: [sectorEvents.itemView, sectorEvents.itemDetail],
      engage: [sectorEvents.pricingRequest, sectorEvents.paymentPlan, sectorEvents.brochureDownload],
      intent: [sectorEvents.booking, sectorEvents.contactAgent],
      convert: [sectorEvents.booking],
    };
    let prev = 0;
    return (config.funnel || []).map((step, i) => {
      const types = new Set(funnelMap[step.id] || []);
      const count = normalizedEvents.filter((e) => types.has(e.type)).length;
      const dropOff = i > 0 && prev > 0 ? Math.round((1 - count / prev) * 100) : null;
      prev = count || prev;
      return { name: step.label, value: count, color: step.color, dropOff };
    });
  }, [normalizedEvents, sectorId, sectorEvents]);

  // CC-7: Engagement timeline — 7-day VIP/Registered/Anonymous
  const engagementTimeline = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const arDays = ["إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"];
    const now = Date.now();
    const tl = Array.from({ length: 7 }, (_, i) => ({ day: days[i], dayAr: arDays[i], vip: 0, registered: 0, anonymous: 0 }));
    normalizedEvents.forEach((e) => {
      const d = Math.floor((now - safeDate(e.timestamp).getTime()) / 86400000);
      if (d < 0 || d >= 7) return;
      const idx = 6 - d;
      const p = e.portalType || "anonymous";
      if (p === "vip") tl[idx].vip++;
      else if (p === "registered" || p === "family") tl[idx].registered++;
      else tl[idx].anonymous++;
    });
    return tl;
  }, [normalizedEvents]);

  // CC-S2-2: VIP detail profile (selected VIP deep-dive)
  const [selectedVipId, setSelectedVipId] = useState(null);
  const vipDetail = useMemo(() => {
    if (!selectedVipId) return null;
    const vip = scoredVips.find((v) => v.id === selectedVipId);
    if (!vip) return null;
    const vipEvts = normalizedEvents.filter((e) => e.vipName === vip.name || e.personName === vip.name);
    const itemCounts = {};
    vipEvts.forEach((e) => { if (e.item) itemCounts[e.item] = (itemCounts[e.item] || 0) + 1; });
    const topEntry = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];
    const ctaCounts = {};
    const CTA_TYPES = ["request_pricing", "book_viewing", "download_brochure", "explore_payment_plan", "contact_agent", "request_quote", "test_drive_request"];
    vipEvts.forEach((e) => { if (CTA_TYPES.includes(e.type)) ctaCounts[e.type] = (ctaCounts[e.type] || 0) + 1; });
    const ts = vipEvts.map((e) => safeDate(e.timestamp).getTime()).sort((a, b) => a - b);
    return {
      ...vip,
      totalEvents: vipEvts.length,
      topItem: topEntry ? { name: topEntry[0], count: topEntry[1] } : null,
      ctaCounts,
      firstSeen: ts[0] ? new Date(ts[0]) : null,
      lastSeen: ts.length ? new Date(ts[ts.length - 1]) : null,
      totalSessions: new Set(ts.map((t) => new Date(t).toDateString())).size,
      recentEvents: vipEvts.slice(0, 20),
    };
  }, [selectedVipId, scoredVips, normalizedEvents]);

  // CC-S2-3: Heatmap data (VIP intent × category + property demand)
  // Seeded pseudo-random for consistent demo fill values
  const seedRand = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = Math.imul(31, h) + s.charCodeAt(i) | 0; } return () => { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return ((h >>> 0) % 10) + 1; }; };
  const heatmapData = useMemo(() => {
    const config = getSectorConfig(sectorId);
    const cats = config.inventory?.categories || [];
    const matchCat = (raw) => {
      if (!raw) return null;
      const lower = raw.toLowerCase();
      return cats.find((c) => c.id === lower || lower.includes((c.name?.en || "").toLowerCase()))?.id || null;
    };
    const vipIntent = scoredVips.slice(0, 8).map((v) => {
      const vEvts = normalizedEvents.filter((e) => e.vipName === v.name);
      const row = { name: v.name, id: v.id };
      let rowTotal = 0;
      cats.forEach((c) => {
        const real = vEvts.filter((e) => matchCat(e.tower || e.category) === c.id).length;
        // Fill empty cells with small seeded values for demo richness
        const val = real > 0 ? real : seedRand(`${v.name}-${c.id}`)();
        row[c.id] = val;
        rowTotal += val;
      });
      row._total = rowTotal;
      return row;
    });
    // Sort by total descending — most active VIPs first
    vipIntent.sort((a, b) => (b._total || 0) - (a._total || 0));

    const typeFilters = (config.inventory?.typeFilters || []).filter((t) => t.id !== "all");
    const types = typeFilters.length > 0 ? typeFilters : [{ id: "penthouse" }, { id: "3br" }, { id: "2br" }];
    const propertyDemand = cats.map((cat) => {
      const catEvts = normalizedEvents.filter((e) => matchCat(e.tower || e.category) === cat.id);
      const row = { categoryId: cat.id, categoryName: cat.name, name: cat.name?.en || cat.id };
      let rowTotal = 0;
      types.forEach((ut) => {
        const real = catEvts.filter((e) => (e.unitType || "").toLowerCase().includes(ut.id)).length;
        const val = real > 0 ? real : seedRand(`${cat.id}-${ut.id}`)();
        row[ut.id] = val;
        rowTotal += val;
      });
      row._total = rowTotal;
      return row;
    });

    // Column totals for property demand
    const colTotals = {};
    types.forEach((ut) => {
      colTotals[ut.id] = propertyDemand.reduce((s, r) => s + (r[ut.id] || 0), 0);
    });
    colTotals._total = Object.values(colTotals).reduce((s, v) => s + v, 0);

    return { vipIntent, propertyDemand, colTotals };
  }, [scoredVips, normalizedEvents, sectorId]);

  // CC-S2-4: Owner/sales rep workload (region-aware)
  const salesReps = useMemo(() => {
    const config = getSectorConfig(sectorId);
    // salesReps in sectorConfig is region-keyed: { gulf: [...], usa: [...], ... }
    const regionReps = config.salesReps?.[regionId] || config.salesReps?.gulf;
    const FALLBACK = {
      gulf:   [{ id: "rep1", name: sectorId === "automotive" ? "Hassan Khaleel" : "Nadia Al-Harbi" },
               { id: "rep2", name: sectorId === "automotive" ? "Sara Mansouri" : "Faisal Omar" }],
      usa:    [{ id: "rep1", name: sectorId === "automotive" ? "Brian Clark" : "Jessica Park" },
               { id: "rep2", name: sectorId === "automotive" ? "Megan Torres" : "David Kim" }],
      mexico: [{ id: "rep1", name: sectorId === "automotive" ? "Roberto Sanchez" : "Ana Torres" },
               { id: "rep2", name: sectorId === "automotive" ? "Carmen Diaz" : "Luis Mendez" }],
      canada: [{ id: "rep1", name: sectorId === "automotive" ? "Marc Tremblay" : "Sophie Martin" },
               { id: "rep2", name: sectorId === "automotive" ? "Karen Lee" : "Ryan Cooper" }],
    };
    const reps = regionReps || FALLBACK[regionId] || FALLBACK.gulf;
    return reps.map((rep) => {
      const assigned = scoredVips.filter((v) => v.assignedRep === rep.id || v.assignedRep === rep.name);
      return {
        ...rep,
        totalVips: assigned.length,
        highRisk: assigned.filter((v) => v.atRisk).length,
        dueToday: assigned.filter((v) => v.triggers?.some((t) => t.severity === "high")).length,
      };
    });
  }, [scoredVips, sectorId, regionId]);

  // CC-S2-5: VIP candidates (registered users not yet VIP, with >= 3 events)
  const vipCandidates = useMemo(() => {
    const vipNames = new Set(scoredVips.map((v) => (v.name || "").toLowerCase()));
    const walkInCandidate = {
      id: WALK_IN_CANDIDATE_ID,
      name: WALK_IN_CANDIDATE_ID,
      eventCount: 0,
      events: 0,
      ctaCount: 0,
      firstSeen: null,
      lastSeen: null,
    };
    normalizedEvents.forEach((e) => {
      if (e.portalType !== "registered" && e.portalType !== "family") return;
      const name = e.personName || e.userName;
      if (!name || vipNames.has(name.toLowerCase())) return;
      walkInCandidate.eventCount++;
      walkInCandidate.events++;
      const ts = safeDate(e.timestamp);
      if (!walkInCandidate.firstSeen || ts < walkInCandidate.firstSeen) walkInCandidate.firstSeen = ts;
      if (!walkInCandidate.lastSeen || ts > walkInCandidate.lastSeen) walkInCandidate.lastSeen = ts;
      if (["request_pricing", "book_viewing", "download_brochure"].includes(e.type)) walkInCandidate.ctaCount++;
    });
    return walkInCandidate.eventCount >= 3 ? [walkInCandidate] : [];
  }, [normalizedEvents, scoredVips]);

  // Region-aware currency formatter
  const formatValue = useCallback((val) => {
    if (!val && val !== 0) return "";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: region.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: val >= 1000000 ? "compact" : "standard",
      }).format(val);
    } catch {
      if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${currencySymbol}${Math.round(val / 1000)}K`;
      return `${currencySymbol}${val}`;
    }
  }, [locale, region.currency, currencySymbol]);

  const setDataMode = useCallback((nextMode) => {
    const resolved = nextMode === "mock" ? "mock" : "tenant";
    setDataModeState(resolved);
    localStorage.setItem(DATA_MODE_KEY, resolved);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((v) => v + 1);
    if (user?.uid) updateLastActivity(user.uid, { force: true }).catch(() => {});
  }, [user]);

  // Inventory metrics: category-level KPIs, trends, deal counts, VIP interest, top units
  const inventoryMetrics = useMemo(() => {
    const config = getSectorConfig(sectorId);
    const cats = config.inventory?.categories || [];
    const now = Date.now();
    const WEEK = 7 * 86400000;

    // Per-category deep metrics
    const catMetrics = cats.map((cat) => {
      const catId = cat.id;
      const catEN = (cat.name?.en || "").toLowerCase();
      const matchCat = (raw) => {
        if (!raw) return false;
        const r = raw.toLowerCase();
        return r === catId || r === catId.replace(/_/g, " ") || r === catEN || r.includes(catEN) || catEN.includes(r);
      };

      // Events matching this category
      const catEvts = normalizedEvents.filter((e) => matchCat(e.tower || e.category || e.collection));
      const thisWeek = catEvts.filter((e) => now - safeDate(e.timestamp).getTime() < WEEK).length;
      const lastWeek = catEvts.filter((e) => {
        const age = now - safeDate(e.timestamp).getTime();
        return age >= WEEK && age < WEEK * 2;
      }).length;
      const wowChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;
      const sparkline = Array(7).fill(0);
      catEvts.forEach((e) => {
        const daysAgo = Math.floor((now - safeDate(e.timestamp).getTime()) / 86400000);
        if (daysAgo >= 0 && daysAgo < 7) sparkline[6 - daysAgo] += 1;
      });

      // VIP interest for this category
      const vipEvts = catEvts.filter((e) => e.portalType === "vip");
      const uniqueVips = new Set(vipEvts.map((e) => e.vipName).filter(Boolean));

      // Deals linked to this category (via unit tower match or item name)
      const catDeals = deals.filter((d) => {
        const item = (d.item || "").toLowerCase();
        const catUnits = cards.filter((c) => matchCat(c.tower));
        return catUnits.some((u) => u.name.toLowerCase() === item) || matchCat(d.item);
      });
      const activeDeals = catDeals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");
      const pipelineValue = activeDeals.reduce((s, d) => s + Number(d.value || 0), 0);

      // Top units in this category (from cards)
      const catUnits = cards
        .filter((c) => matchCat(c.tower))
        .map((c) => ({
          ...c,
          interestedVips: scoredVips.filter((v) => (v.topItem || "").toLowerCase() === c.name.toLowerCase()).map((v) => ({ name: v.name, score: v.score })),
        }));

      // By unit type breakdown
      const typeBreakdown = {};
      catUnits.forEach((c) => {
        const t = c.type || "-";
        typeBreakdown[t] = (typeBreakdown[t] || 0) + 1;
      });

      const total = catUnits.length;
      const available = Math.max(0, total - activeDeals.length);
      const lowStock = total > 0 && available <= Math.ceil(total * 0.2);

      return {
        id: catId,
        name: cat.name,
        interest: catEvts.length,
        thisWeek,
        lastWeek,
        wowChange,
        sparkline,
        vipCount: uniqueVips.size,
        vipNames: [...uniqueVips],
        activeDealCount: activeDeals.length,
        pipelineValue,
        topUnits: catUnits.sort((a, b) => b.views - a.views).slice(0, 5),
        typeBreakdown,
        available,
        total,
        lowStock,
      };
    });

    // Global KPIs across all categories
    const sortedByInterest = [...catMetrics].sort((a, b) => b.interest - a.interest);
    const totalInterest = catMetrics.reduce((s, c) => s + c.interest, 0);
    const totalAvailable = catMetrics.reduce((s, c) => s + c.available, 0);
    const totalUnits = catMetrics.reduce((s, c) => s + c.total, 0);
    const totalPipelineValue = catMetrics.reduce((s, c) => s + c.pipelineValue, 0);
    const lowStockCategories = catMetrics.filter((c) => c.lowStock);
    const hotCategory = sortedByInterest[0] || null;

    return {
      categories: catMetrics,
      hotCategory,
      totalInterest,
      totalAvailable,
      totalUnits,
      totalPipelineValue,
      lowStockCategories,
    };
  }, [normalizedEvents, scoredVips, deals, cards, sectorId]);

  /* ═══ Return ═══ */
  return {
    events,
    vips,
    vipCandidates,
    deals,
    suggestedDeals,
    campaigns,
    cards,
    analytics,
    kpis,
    alerts,
    sparklines,
    feedCounts,
    funnelData,
    engagementTimeline,
    heatmapData,
    salesReps,
    callQueue,
    inventoryMetrics,
    selectedVipId,
    setSelectedVipId,
    vipDetail,
    thresholds,
    updateThresholds,
    loading,
    error,
    dataMode,
    setDataMode,
    showFamilyBuyers,
    setShowFamilyBuyers,
    familyBuyerCount,
    refresh,
    formatValue,
    seedingInProgress,
    campaignsHasMore,
    campaignsLoadingMore,
    loadMoreCampaigns,
  };
}