import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

export default function IndustriesDropdown({ lang = "en", triggerClassName = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);
  const isAr = lang === "ar";

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Clean up timer on unmount ── */
  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  /* ── Hover open: cancel any pending close, then open ── */
  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  /* ── Hover leave: delay 400ms before closing ── */
  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 400);
  }, []);

  const T = {
    en: {
      label: "Industries",
      groupSales: "Sales velocity for",
      groupPlatform: "Platform",
      reDev: "Real Estate Developers & Agents",
      reAgent: "Real Estate Agents",
      auto: "Automotive",
      yacht: "Yacht Brokerage",
      yachtNew: "NEW",
      enterprise: "Enterprise Overview",
      devHub: "Developer Hub",
    },
    ar: {
      label: "القطاعات",
      groupSales: "تسريع المبيعات لـ",
      groupPlatform: "المنصة",
      reDev: "مطوّرو ووكلاء العقارات",
      reAgent: "وكلاء العقارات",
      auto: "قطاع السيارات",
      yacht: "وساطة اليخوت",
      yachtNew: "جديد",
      enterprise: "نظرة عامة للمؤسسات",
      devHub: "مركز المطوّرين",
    },
  };
  const t = (k) => (T[isAr ? "ar" : "en"] || T.en)[k] || k;

  const AnchorIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="5" r="2.5" /><path d="M12 7.5v12.5" /><path d="M7 12h10" /><path d="M5 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
    </svg>
  );

  const BuildingIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-6h6v6" /><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </svg>
  );
  const CarIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 17h14v-5l-1.5-4.5A2 2 0 0 0 15.6 6H8.4a2 2 0 0 0-1.9 1.5L5 12v5z" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
  const OfficeIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 21v-6h6v6M9 8h.01M15 8h.01M9 12h.01M15 12h.01" />
    </svg>
  );

  const items = [
    { type: "label", text: t("groupSales") },
    { icon: BuildingIcon, label: t("reDev"), to: "/developers" },
    { icon: CarIcon, label: t("auto"), to: "/automotive" },
    { icon: AnchorIcon, label: t("yacht"), to: "/yacht/demo", badge: t("yachtNew") },
    { type: "sep" },
    { type: "label", text: t("groupPlatform") },
    { icon: OfficeIcon, label: t("enterprise"), to: "/enterprise" },
  ];

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={triggerClassName || undefined}
        onClick={() => setOpen((o) => !o)}
        title={t("label")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "inherit",
          ...(triggerClassName
            ? {}
            : {
                font: "inherit",
                padding: "4px 0",
                fontSize: "inherit",
                fontWeight: "inherit",
                fontFamily: "inherit",
              }),
        }}
      >
        {t("label")}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            [isAr ? "right" : "left"]: "-12px",
            paddingTop: "8px",        /* ← invisible bridge replaces marginTop */
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "12px",
              padding: "8px 0",
              minWidth: "240px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              animation: "ddFadeIn 0.15s ease-out",
            }}
          >
            {items.map((item, i) => {
              if (item.type === "sep")
                return (
                  <div
                    key={i}
                    style={{
                      height: "1px",
                      background: "rgba(0,0,0,0.06)",
                      margin: "6px 0",
                    }}
                  />
                );
              if (item.type === "label")
                return (
                  <div
                    key={i}
                    style={{
                      padding: "6px 16px 4px",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      color: "#9ca3af",
                      fontWeight: 600,
                    }}
                  >
                    {item.text}
                  </div>
                );
              return (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  title={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 16px",
                    fontSize: "13px",
                    color: "#1a1a1f",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(0,0,0,0.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      background: "rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "rgba(230,57,70,0.1)",
                        color: "#e63946",
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes ddFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
