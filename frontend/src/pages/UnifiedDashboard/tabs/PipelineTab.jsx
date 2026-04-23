import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { getSectorSchema } from "../../../config/developerThemes";
import { useDashboard } from "../DashboardDataProvider";
import { useAuth } from "../../../contexts/AuthContext";
import AddDealModal from "../components/AddDealModal";
import KanbanBoard from "../components/KanbanBoard";
import { SkeletonCard } from "../components/LoadingSkeleton";
import { createTenantDeal, updateTenantDealStage } from "../../../services/tenantService";

export default function PipelineTab() {
  const { config, st, sectorId, activeSectorId } = useSector();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { deals: hookDeals, campaigns, suggestedDeals, analytics, loading, thresholds } = useDashboard();
  const [localDeals, setLocalDeals] = useState([]);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [pipelineError, setPipelineError] = useState("");
  const handledInventoryRequestRef = useRef("");
  const currency = analytics?.settings?.currency || "AED";
  const schema = useMemo(() => getSectorSchema(activeSectorId || sectorId, lang), [activeSectorId, sectorId, lang]);

  useEffect(() => {
    setLocalDeals((prev) => prev.filter((ld) => !hookDeals.some((hd) => hd.id === ld.id)));
  }, [hookDeals]);

  useEffect(() => {
    const pending = location.state?.inventoryDeal;
    if (!pending || !user?.uid) return;
    const requestId = String(pending.requestId || "");
    if (!requestId || handledInventoryRequestRef.current === requestId) return;
    handledInventoryRequestRef.current = requestId;

    const createFromInventory = async () => {
      try {
        setPipelineError("");
        const payload = {
          name: pending.name || "Inventory Lead",
          item: pending.item || pending.categoryName || "",
          value: Number(pending.value || 0),
          stage: pending.stage || "new_lead",
          source: pending.source || "inventory_tab",
          categoryId: pending.categoryId || "",
          categoryName: pending.categoryName || "",
          campaignId: pending.campaignId || "",
        };
        const tempId = `temp-${Date.now()}`;
        setLocalDeals((prev) => [...prev, { ...payload, id: tempId }]);
        await createTenantDeal(user.uid, payload);
        setLocalDeals((prev) => prev.filter((d) => d.id !== tempId));
      } catch {
        setLocalDeals((prev) => prev.filter((d) => !String(d.id || "").startsWith("temp-")));
        setPipelineError(
          ({ en: "Inventory deal auto-create failed. Please try again.", ar: "فشل إنشاء صفقة المخزون تلقائياً. حاول مرة أخرى.", es: "No se pudo crear el trato de inventario automáticamente.", fr: "La création automatique de l’affaire inventaire a échoué." }[lang] ||
            "Inventory deal auto-create failed. Please try again.")
        );
      } finally {
        navigate(location.pathname, { replace: true, state: null });
      }
    };

    createFromInventory();
  }, [location.pathname, location.state, navigate, user, lang]);

  const allDeals = [...hookDeals, ...localDeals];

  /* Accept an AI-suggested deal — auto-create in Firestore */
  const handleAcceptSuggestion = async (suggestion) => {
    if (!user?.uid) return;
    try {
      setPipelineError("");
      const deal = {
        name: suggestion.name,
        item: suggestion.topItem || "",
        value: 0,
        stage: suggestion.suggestedStage || "new_lead",
        score: suggestion.score || 0,
        source: "ai_suggestion",
      };
      const tempId = `temp-${Date.now()}`;
      setLocalDeals((prev) => [...prev, { ...deal, id: tempId }]);
      await createTenantDeal(user.uid, deal);
      setLocalDeals((prev) => prev.filter((d) => d.id !== tempId));
    } catch (error) {
      setLocalDeals((prev) => prev.filter((d) => !String(d.id || "").startsWith("temp-")));
      setPipelineError(
        ({ en: "Could not create suggested deal.", ar: "\u062a\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0635\u0641\u0642\u0629 \u0627\u0644\u0645\u0642\u062a\u0631\u062d\u0629.", es: "No se pudo crear el trato sugerido.", fr: "\u00c9chec de la cr\u00e9ation de l\u2019affaire sugg\u00e9r\u00e9e." }[lang] || "Could not create suggested deal.")
      );
      console.error("[PIPELINE] Suggestion accept failed", error);
    }
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="ud-section-label" style={{ margin: 0 }}>
          {st(config.pipeline.stageLabel)}
        </div>
        <button
          onClick={() => setShowAddDeal(true)}
          style={{
            all: "unset",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "#457b9d",
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid rgba(69,123,157,0.2)",
          }}
          type="button"
        >
          + {({ en: "Add Deal", ar: "\u0625\u0636\u0627\u0641\u0629 \u0635\u0641\u0642\u0629", es: "Agregar trato", fr: "Ajouter une affaire" }[lang] || "Add Deal")}
        </button>
      </div>
      <div className="ud-card-subtitle" style={{ marginBottom: 10 }}>
        {({ en: "Pipeline updates sync to tenant workspace in real-time.", ar: "\u062a\u062d\u062f\u064a\u062b\u0627\u062a \u062e\u0637 \u0627\u0644\u0623\u0646\u0627\u0628\u064a\u0628 \u062a\u062a\u0645 \u0645\u0632\u0627\u0645\u0646\u062a\u0647\u0627 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0639 \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0633\u062a\u0623\u062c\u0631.", es: "Las actualizaciones del pipeline se sincronizan en tiempo real con tu tenant.", fr: "Les mises \u00e0 jour du pipeline sont synchronis\u00e9es en temps r\u00e9el avec votre espace locataire." }[lang] || "Pipeline updates sync to tenant workspace in real-time.")}
      </div>
      {pipelineError ? (
        <div
          style={{
            marginBottom: 10,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(230,57,70,0.25)",
            background: "rgba(230,57,70,0.08)",
            color: "#e63946",
            fontSize: 12,
          }}
        >
          {pipelineError}
        </div>
      ) : null}
      <KanbanBoard
        deals={allDeals}
        suggestedDeals={suggestedDeals}
        currency={currency}
        dealStages={schema.dealStages}
        thresholds={thresholds}
        onAcceptSuggestion={handleAcceptSuggestion}
        onStageChange={async (dealId, stage, fromStage) => {
          if (!user?.uid) return;
          try {
            setPipelineError("");
            await updateTenantDealStage(user.uid, dealId, stage, fromStage);
          } catch (error) {
            setPipelineError(
              ({ en: "Stage update failed.", ar: "فشل تحديث المرحلة.", es: "Error al actualizar la etapa.", fr: "Échec de la mise à jour de l'étape." }[lang] || "Stage update failed.")
            );
            console.error("[PIPELINE] Stage change failed", error);
            throw error; // Re-throw for KanbanBoard rollback
          }
        }}
      />
      {showAddDeal && (
        <AddDealModal
          campaigns={(campaigns || []).filter((c) => String(c.status || "").toLowerCase() !== "archived")}
          dealStages={schema.dealStages}
          onClose={() => setShowAddDeal(false)}
          onSave={async (deal) => {
            if (!user?.uid) return;
            try {
              await createTenantDeal(user.uid, deal);
              setShowAddDeal(false);
            } catch (error) {
              setPipelineError(
                ({ en: "Could not create deal.", ar: "تعذر إنشاء الصفقة.", es: "No se pudo crear el trato.", fr: "Impossible de créer l'affaire." }[lang] || "Could not create deal.")
              );
              console.error("[PIPELINE] Add deal failed", error);
            }
          }}
        />
      )}
    </div>
  );
}