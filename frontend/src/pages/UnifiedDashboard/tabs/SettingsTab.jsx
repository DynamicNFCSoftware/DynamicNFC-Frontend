import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { useDashboard } from "../DashboardDataProvider";
import SectorSwitcher from "../components/SectorSwitcher";
import { getTenantSettings, resetToDemo, updateLastActivity, updateTenantSettings } from "../../../services/tenantService";

export default function SettingsTab() {
  const { config, st, sectorId } = useSector();
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();
  const { vips, events, dataMode, refresh, thresholds, updateThresholds } = useDashboard();

  const [hotThreshold, setHotThreshold] = useState(config.scoring.thresholds.hot);
  const [warmThreshold, setWarmThreshold] = useState(config.scoring.thresholds.warm);
  const [theme, setTheme] = useState(() => localStorage.getItem("ud-theme") || "light");
  const [notifications, setNotifications] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetError, setResetError] = useState("");
  const resetButtonRef = useRef(null);
  const confirmDialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const effectiveThresholds = thresholds || { hot: hotThreshold, warm: warmThreshold };
  const t = (labels, fallback = "") => labels?.[lang] || labels?.en || fallback;
  const isAr = lang === "ar";
  const isEn = lang === "en";
  const isEs = lang === "es";

  const onHotThresholdChange = (nextHot) => {
    const safeHot = Number(nextHot);
    const adjustedWarm = Math.min(effectiveThresholds.warm, safeHot - 5);
    if (typeof updateThresholds === "function" && thresholds) {
      updateThresholds({ ...effectiveThresholds, hot: safeHot, warm: adjustedWarm });
      return;
    }
    setHotThreshold(safeHot);
    setWarmThreshold(adjustedWarm);
  };

  const onWarmThresholdChange = (nextWarm) => {
    const safeWarm = Number(nextWarm);
    if (typeof updateThresholds === "function" && thresholds) {
      updateThresholds({ ...effectiveThresholds, warm: safeWarm });
      return;
    }
    setWarmThreshold(safeWarm);
  };

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    getTenantSettings(user.uid)
      .then((settings) => {
        if (cancelled) return;
        if (settings.language && settings.language !== lang) setLang(settings.language);
        if (settings.theme) {
          setTheme(settings.theme);
          localStorage.setItem("ud-theme", settings.theme);
        }
        setNotifications(settings.notifications !== false);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang, setLang, user]);

  const savePreferences = async (updates) => {
    if (!user?.uid) return;
    await updateTenantSettings(user.uid, updates);
    await updateLastActivity(user.uid);
  };

  const handleLanguageChange = async (next) => {
    setLang(next);
    await savePreferences({ language: next });
  };

  const handleThemeChange = async (next) => {
    setTheme(next);
    localStorage.setItem("ud-theme", next);
    // Sync with UnifiedLayout's theme state via storage event
    window.dispatchEvent(new StorageEvent("storage", { key: "ud-theme", newValue: next }));
    await savePreferences({ theme: next });
  };

  const handleNotifications = async (next) => {
    setNotifications(next);
    await savePreferences({ notifications: next });
  };

  const executeResetDemo = async () => {
    if (!user?.uid || busy) return;
    setBusy(true);
    setResetError("");
    try {
      await resetToDemo(user.uid, user);
      await refresh();
      setToast({
        type: "success",
        message: t({
          en: "Demo data restored successfully.",
          ar: "تمت إعادة بيانات العرض التجريبي بنجاح.",
          es: "Datos demo restaurados correctamente.",
          fr: "Données démo restaurées avec succès.",
        }),
      });
      setShowResetConfirm(false);
    } catch (err) {
      setResetError(err?.message || t({
        en: "Reset failed. Please try again.",
        ar: "فشلت إعادة التهيئة. حاول مرة أخرى.",
        es: "Fallo el reinicio. Intenta de nuevo.",
        fr: "La réinitialisation a échoué. Veuillez réessayer.",
      }));
      setToast({
        type: "error",
        message: t({
          en: "Reset failed. Please try again.",
          ar: "فشلت إعادة التهيئة. حاول مرة أخرى.",
          es: "Fallo el reinicio. Intenta de nuevo.",
          fr: "La réinitialisation a échoué. Veuillez réessayer.",
        }),
      });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!showResetConfirm) return undefined;
    previousFocusRef.current = document.activeElement;
    const timer = setTimeout(() => {
      confirmDialogRef.current?.querySelector("button")?.focus();
    }, 40);
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy) setShowResetConfirm(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [busy, showResetConfirm]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Score", "Top Item", "Last Seen", "Status"];
    const rows = vips.map((v) => [
      v.name,
      v.email,
      v.score,
      v.topItem || "",
      v.lastSeen instanceof Date ? v.lastSeen.toISOString() : "",
      v.atRisk ? "At Risk" : "Active",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dynamicnfc-vips-${sectorId}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({
      type: "success",
      message: t({
        en: "CSV exported successfully.",
        ar: "تم تصدير CSV بنجاح.",
        es: "CSV exportado correctamente.",
        fr: "CSV exporté avec succès.",
      }),
    });
  };

  return (
    <div>
      <div className="ud-section-label">{t({ en: "Settings", ar: "الإعدادات", es: "Configuracion", fr: "Paramètres" })}</div>

      <div className="ud-card" style={{ marginBottom: 16 }}>
        <div className="ud-card-title">{t({ en: "Profile", ar: "الملف الشخصي", es: "Perfil", fr: "Profil" })}</div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--ud-text-muted)" }}>Email</span>
            <span style={{ color: "var(--ud-text)" }}>{user?.email || "admin@dynamicnfc.ca"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--ud-text-muted)" }}>{t({ en: "Sector", ar: "القطاع", es: "Sector", fr: "Secteur" })}</span>
            <span style={{ color: "var(--ud-text)" }}>{st(config.identity.sectorLabel)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--ud-text-muted)" }}>{t({ en: "Project", ar: "المشروع", es: "Proyecto", fr: "Projet" })}</span>
            <span style={{ color: "var(--ud-text)" }}>{st(config.identity.defaultProject.name)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--ud-text-muted)" }}>{t({ en: "Data Mode", ar: "وضع البيانات", es: "Modo de datos", fr: "Mode de données" })}</span>
            <span style={{ color: dataMode === "tenant" ? "#22c55e" : "#eab308", fontWeight: 500, fontSize: 12 }}>
              {dataMode === "tenant"
                ? t({ en: "Tenant Data", ar: "بيانات المستأجر", es: "Datos del tenant", fr: "Données locataire" })
                : t({ en: "Demo Data", ar: "بيانات تجريبية", es: "Datos demo", fr: "Données démo" })}
            </span>
          </div>
        </div>
      </div>

      <div className="ud-card" style={{ marginBottom: 16 }}>
        <div className="ud-card-title">{t({ en: "Account Preferences", ar: "تفضيلات الحساب", es: "Preferencias de cuenta", fr: "Préférences du compte" })}</div>
        <div className="ud-card-subtitle">{t({ en: "Saved to Firestore preferences", ar: "يتم الحفظ تلقائياً في Firestore", es: "Guardado en preferencias de Firestore", fr: "Enregistré dans les préférences Firestore" })}</div>
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--ud-text-secondary)" }}>{t({ en: "Language", ar: "اللغة", es: "Idioma", fr: "Langue" })}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => handleLanguageChange("en")} className="ud-btn-theme" style={{ border: isEn ? "1px solid #457b9d" : undefined }}>EN</button>
              <button type="button" onClick={() => handleLanguageChange("ar")} className="ud-btn-theme" style={{ border: isAr ? "1px solid #457b9d" : undefined }}>AR</button>
              <button type="button" onClick={() => handleLanguageChange("es")} className="ud-btn-theme" style={{ border: isEs ? "1px solid #457b9d" : undefined }}>ES</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--ud-text-secondary)" }}>{t({ en: "Theme", ar: "المظهر", es: "Tema", fr: "Thème" })}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => handleThemeChange("light")} className="ud-btn-theme" style={{ border: theme === "light" ? "1px solid #457b9d" : undefined }}>{t({ en: "Light", ar: "فاتح", es: "Claro", fr: "Clair" })}</button>
              <button type="button" onClick={() => handleThemeChange("dark")} className="ud-btn-theme" style={{ border: theme === "dark" ? "1px solid #457b9d" : undefined }}>{t({ en: "Dark", ar: "داكن", es: "Oscuro", fr: "Sombre" })}</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--ud-text-secondary)" }}>{t({ en: "Notifications", ar: "الإشعارات", es: "Notificaciones", fr: "Notifications" })}</span>
            <button type="button" className="ud-btn-theme" onClick={() => handleNotifications(!notifications)}>
              {notifications
                ? t({ en: "Enabled", ar: "مفعلة", es: "Activadas", fr: "Active" })
                : t({ en: "Disabled", ar: "متوقفة", es: "Desactivadas", fr: "Désactivé" })}
            </button>
          </div>
        </div>
      </div>

      <div className="ud-card" style={{ marginBottom: 16 }}>
        <div className="ud-card-title">{t({ en: "Switch Sector", ar: "تبديل القطاع", es: "Cambiar sector", fr: "Changer de secteur" })}</div>
        <div className="ud-card-subtitle">{t({ en: "Switch between Real Estate and Automotive", ar: "تبديل بين العقارات والسيارات", es: "Cambiar entre Real Estate y Automotive", fr: "Basculer entre immobilier et automobile" })}</div>
        <SectorSwitcher />
      </div>

      <div className="ud-card" style={{ marginBottom: 16 }}>
        <div className="ud-card-title">{t({ en: "Scoring Configuration", ar: "إعدادات التسجيل", es: "Configuracion de scoring", fr: "Configuration du scoring" })}</div>
        <div className="ud-card-subtitle">{t({ en: "Adjust lead classification thresholds", ar: "تعديل عتبات تصنيف العملاء", es: "Ajustar umbrales de clasificacion de leads", fr: "Ajuster les seuils de classification des leads" })}</div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--ud-text-secondary)" }}>🔥 {t({ en: "Hot threshold", ar: "عتبة ساخن", es: "Umbral caliente", fr: "Seuil chaud" })}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e63946" }}>{effectiveThresholds.hot}</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={effectiveThresholds.hot}
            onChange={(e) => onHotThresholdChange(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "#e63946" }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--ud-text-secondary)" }}>🟡 {t({ en: "Warm threshold", ar: "عتبة دافئ", es: "Umbral tibio", fr: "Seuil tiède" })}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#eab308" }}>{effectiveThresholds.warm}</span>
          </div>
          <input
            type="range"
            min="20"
            max={effectiveThresholds.hot - 5}
            value={effectiveThresholds.warm}
            onChange={(e) => onWarmThresholdChange(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "#eab308" }}
          />
        </div>

        <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: "var(--ud-bg-secondary)", fontSize: 12, color: "var(--ud-text-muted)" }}>
          {t({
            en: `≥${effectiveThresholds.hot} = Hot | ${effectiveThresholds.warm}-${effectiveThresholds.hot - 1} = Warm | <${effectiveThresholds.warm} = Cold`,
            ar: `≥${effectiveThresholds.hot} = ساخن | ${effectiveThresholds.warm}-${effectiveThresholds.hot - 1} = دافئ | <${effectiveThresholds.warm} = بارد`,
            es: `≥${effectiveThresholds.hot} = Caliente | ${effectiveThresholds.warm}-${effectiveThresholds.hot - 1} = Tibio | <${effectiveThresholds.warm} = Frio`,
            fr: `≥${effectiveThresholds.hot} = Chaud | ${effectiveThresholds.warm}-${effectiveThresholds.hot - 1} = Tiède | <${effectiveThresholds.warm} = Froid`,
          })}
        </div>
      </div>

      <div className="ud-card" style={{ marginBottom: 16 }}>
        <div className="ud-card-title">{t({ en: "Data Export", ar: "تصدير البيانات", es: "Exportar datos", fr: "Export de données" })}</div>
        <div className="ud-card-subtitle">
          {t({
            en: `${vips.length} VIPs, ${events.length} events`,
            ar: `${vips.length} VIP، ${events.length} حدث`,
            es: `${vips.length} VIP, ${events.length} eventos`,
            fr: `${vips.length} VIP, ${events.length} événements`,
          })}
        </div>
        <button
          onClick={handleExportCSV}
          style={{
            all: "unset",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            padding: "8px 14px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            color: "#457b9d",
            border: "1px solid rgba(69,123,157,0.2)",
            transition: "all 0.15s",
          }}
          type="button"
        >
          📊 {t({ en: "Export VIPs as CSV", ar: "تصدير VIP كـ CSV", es: "Exportar VIPs como CSV", fr: "Exporter les VIP en CSV" })}
        </button>
      </div>

      <div className="ud-card">
        <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, background: "rgba(69,123,157,0.12)", border: "1px solid rgba(69,123,157,0.25)", fontSize: 12, color: "var(--ud-text-secondary)" }}>
          {t({
            en: "Retention policy: tenant data is marked after 15 days of inactivity, then permanently deleted after an extra 1-day grace period.",
            ar: "سياسة الاحتفاظ: بعد 15 يوماً بدون نشاط يتم وضع الحساب بانتظار الحذف، ثم يُحذف نهائياً بعد يوم إضافي (فترة سماح).",
            es: "Politica de retencion: los datos del tenant se marcan tras 15 dias sin actividad y se eliminan definitivamente tras 1 dia de gracia.",
            fr: "Politique de rétention : les données locataire sont marquées après 15 jours d'inactivité puis supprimées définitivement après 1 jour de grâce.",
          })}
        </div>
        <button
          type="button"
          disabled={busy}
          ref={resetButtonRef}
          onClick={() => {
            setResetError("");
            setShowResetConfirm(true);
          }}
          style={{
            all: "unset",
            cursor: busy ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            color: "#e63946",
            border: "1px solid rgba(230,57,70,0.25)",
            opacity: busy ? 0.5 : 1,
            transition: "all 0.15s",
          }}
        >
          🔄 {t({ en: "Reset to Demo Data", ar: "إعادة التهيئة للعرض التجريبي", es: "Reiniciar datos demo", fr: "Réinitialiser les données démo" })}
        </button>
        {resetError && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#e63946" }}>{resetError}</div>
        )}
      </div>

      {showResetConfirm && (
        <div className="ud-modal-overlay" onClick={() => !busy && setShowResetConfirm(false)}>
          <div
            className="ud-modal"
            ref={confirmDialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-confirm-title"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400 }}
          >
            <div className="ud-modal-header">
              <h3 className="ud-modal-title" id="reset-confirm-title">
                {t({ en: "Confirm Reset", ar: "تأكيد إعادة التهيئة", es: "Confirmar reinicio", fr: "Confirmer la réinitialisation" })}
              </h3>
            </div>
            <div className="ud-modal-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 13, color: "var(--ud-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {t({
                  en: "This will replace all your current data with fresh demo data. This action cannot be undone.",
                  ar: "سيؤدي هذا إلى استبدال جميع بياناتك الحالية ببيانات تجريبية جديدة. لا يمكن التراجع عن هذا الإجراء.",
                  es: "Esto reemplazara todos tus datos actuales con datos demo nuevos. Esta accion no se puede deshacer.",
                  fr: "Cela remplacera toutes vos données actuelles par de nouvelles données démo. Cette action est irréversible.",
                })}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", padding: "12px 20px", borderTop: "1px solid var(--ud-border)" }}>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="ud-btn-secondary"
                style={{ fontSize: 12 }}
              >
                {({ en: "Cancel", ar: "إلغاء", es: "Cancelar", fr: "Annuler" }[lang] || "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleResetDemo}
                className="ud-btn-danger"
                style={{ fontSize: 12 }}
              >
                {({ en: "Reset", ar: "إعادة تعيين", es: "Resetear", fr: "Réinitialiser" }[lang] || "Reset")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}