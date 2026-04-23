import { useState, useEffect } from "react";

const PAGES = [
  { path: "/", label: "Home", labelAr: "الرئيسية" },
  { path: "/enterprise", label: "Enterprise", labelAr: "المؤسسات" },
  { path: "/developers", label: "Developers", labelAr: "المطورين" },
  { path: "/enterprise/crmdemo/khalid", label: "Khalid VIP Portal", labelAr: "بوابة خالد VIP" },
  { path: "/enterprise/crmdemo/ahmed", label: "Ahmed Family Portal", labelAr: "بوابة أحمد العائلية" },
  { path: "/enterprise/crmdemo/marketplace", label: "Marketplace", labelAr: "السوق" },
  { path: "/enterprise/crmdemo/dashboard", label: "Dashboard", labelAr: "لوحة التحكم" },
  { path: "/nfc-cards", label: "NFC Cards", labelAr: "بطاقات NFC" },
  { path: "/contact-sales", label: "Contact Sales", labelAr: "المبيعات" },
];

function getMessageContext(pathname, lang) {
  const isAr = lang === "ar";
  if (pathname.includes("/crmdemo/khalid")) return { message: isAr ? "مرحباً، أنا أتصفح بوابة خالد الراشد VIP — مهتم بمجموعة البنتهاوس في النور ريزيدنسز. أرغب في حجز معاينة خاصة." : "Hi, I'm browsing the Khalid Al-Rashid VIP Portal — interested in the Penthouse Collection at Al Noor Residences. I'd like to schedule a private viewing.", badge: isAr ? "VIP — خالد الراشد" : "VIP — Khalid Portal", intent: "vip" };
  if (pathname.includes("/crmdemo/ahmed")) return { message: isAr ? "مرحباً، أنا أتصفح بوابة أحمد الفهد العائلية — مهتم بشقق 3 غرف نوم في النور ريزيدنسز." : "Hi, I'm browsing the Ahmed Al-Fahad Family Portal — interested in 3BR family units at Al Noor Residences. Can I book a viewing?", badge: isAr ? "عائلي — أحمد الفهد" : "Family — Ahmed Portal", intent: "vip" };
  if (pathname.includes("/crmdemo/marketplace")) return { message: isAr ? "مرحباً، أتصفح سوق النور ريزيدنسز وأرغب في معرفة المزيد عن الوحدات المتاحة." : "Hi, I'm browsing the Al Noor Residences Marketplace and would like to learn more about available units.", badge: isAr ? "السوق" : "Marketplace", intent: "lead" };
  if (pathname.includes("/crmdemo/dashboard")) return { message: isAr ? "مرحباً، أنا أراجع لوحة التحكم التحليلية — أريد مناقشة كيف يمكن لهذا النظام أن يعمل لمشروعي." : "Hi, I'm reviewing the DynamicNFC Analytics Dashboard — I'd like to discuss how this system could work for my project.", badge: isAr ? "لوحة التحكم" : "Dashboard", intent: "sales" };
  if (pathname.includes("/crmdemo")) return { message: isAr ? "مرحباً، أنا أتصفح عرض CRM التجريبي لـ DynamicNFC." : "Hi, I'm exploring the DynamicNFC CRM Demo — I'd like to learn more about the Sales Velocity Platform.", badge: isAr ? "عرض تجريبي" : "CRM Demo", intent: "sales" };
  if (pathname.includes("/enterprise")) return { message: isAr ? "مرحباً، أنا مهتم بمنصة DynamicNFC للمؤسسات — أرغب في مناقشة برنامج تجريبي." : "Hi, I'm interested in the DynamicNFC Enterprise platform — I'd like to discuss a pilot program for our real estate project.", badge: isAr ? "المؤسسات" : "Enterprise", intent: "sales" };
  if (pathname.includes("/developers")) return { message: isAr ? "مرحباً، أنا مطور عقاري مهتم بحلول DynamicNFC." : "Hi, I'm a real estate developer interested in DynamicNFC solutions — can we arrange a discovery call?", badge: isAr ? "المطورين" : "Developers", intent: "sales" };
  if (pathname.includes("/nfc-cards")) return { message: isAr ? "مرحباً، أريد الاستفسار عن طلب بطاقات NFC مخصصة لأعمالي." : "Hi, I'd like to inquire about ordering custom NFC cards for my business.", badge: isAr ? "بطاقات NFC" : "NFC Cards", intent: "order" };
  if (pathname.includes("/contact-sales")) return { message: isAr ? "مرحباً، أريد التواصل مع فريق المبيعات." : "Hi, I'd like to connect with the DynamicNFC sales team.", badge: isAr ? "المبيعات" : "Sales", intent: "sales" };
  return { message: isAr ? "مرحباً، أنا مهتم بمنصة DynamicNFC لتسريع المبيعات." : "Hi, I'm interested in the DynamicNFC Sales Velocity Platform — I'd like to learn more.", badge: null, intent: "general" };
}

export default function WhatsAppPreview() {
  const [currentPage, setCurrentPage] = useState("/");
  const [lang, setLang] = useState("en");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isAr = lang === "ar";
  const ctx = getMessageContext(currentPage, lang);

  useEffect(() => {
    setIsExpanded(false);
    setShowTooltip(false);
    const t = setTimeout(() => setShowTooltip(true), 1500);
    return () => clearTimeout(t);
  }, [currentPage, lang]);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#fff", fontFamily: "'Outfit', 'Inter', system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      {/* Controls */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Simulate Page:</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {PAGES.map(p => (
            <button key={p.path} onClick={() => setCurrentPage(p.path)} style={{ padding: "0.35rem 0.7rem", borderRadius: "6px", border: currentPage === p.path ? "1px solid #25D366" : "1px solid rgba(255,255,255,0.15)", background: currentPage === p.path ? "rgba(37,211,102,0.15)" : "rgba(255,255,255,0.05)", color: currentPage === p.path ? "#25D366" : "rgba(255,255,255,0.7)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>
              {isAr ? p.labelAr : p.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.3rem", marginInlineStart: "auto" }}>
          <button onClick={() => setLang("en")} style={{ padding: "0.3rem 0.6rem", borderRadius: "4px", border: "none", background: lang === "en" ? "#457b9d" : "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>EN</button>
          <button onClick={() => setLang("ar")} style={{ padding: "0.3rem 0.6rem", borderRadius: "4px", border: "none", background: lang === "ar" ? "#457b9d" : "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>ع</button>
        </div>
      </div>

      {/* Page simulation */}
      <div style={{ padding: "3rem 2rem", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>Current Page</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 500, marginBottom: "0.5rem", color: "#fff" }}>
          {PAGES.find(p => p.path === currentPage)?.[isAr ? "labelAr" : "label"]}
        </h1>
        <code style={{ fontSize: "0.85rem", color: "#25D366", background: "rgba(37,211,102,0.1)", padding: "0.3rem 0.8rem", borderRadius: "6px" }}>{currentPage}</code>

        <div style={{ marginTop: "2rem", padding: "1.25rem", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "500px", width: "100%" }}>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Pre-filled WhatsApp Message</div>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>{ctx.message}</p>
          {ctx.badge && <span style={{ display: "inline-block", marginTop: "0.75rem", padding: "0.2rem 0.6rem", background: ctx.intent === "vip" ? "rgba(184,134,13,0.2)" : "rgba(230,57,70,0.15)", color: ctx.intent === "vip" ? "#d4a017" : "#e63946", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{ctx.badge}</span>}
        </div>

        <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
          {isAr ? "← انقر على الزر الأخضر في الأسفل لمعاينة التجربة" : "Click the green button below to preview the experience →"}
        </p>
      </div>

      {/* WhatsApp Button */}
      <div style={{ position: "fixed", bottom: "1.5rem", [isAr ? "left" : "right"]: "1.5rem", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: isAr ? "flex-start" : "flex-end", gap: "0.75rem" }}>
        {/* Tooltip */}
        {showTooltip && !isExpanded && (
          <div onClick={() => { setShowTooltip(false); setIsExpanded(true); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1rem", background: "#fff", color: "#1a1a1f", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", animation: "slideUp 0.4s ease-out", whiteSpace: "nowrap" }}>
            <span>{isAr ? "تحدث معنا عبر واتساب" : "Chat with us on WhatsApp"}</span>
            <button onClick={e => { e.stopPropagation(); setShowTooltip(false); }} style={{ background: "none", border: "none", color: "#999", fontSize: "1.1rem", cursor: "pointer", padding: "0 0.15rem", lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Expanded Panel */}
        {isExpanded && (
          <div style={{ width: 340, maxWidth: "calc(100vw - 2rem)", background: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", overflow: "hidden", animation: "slideUp 0.35s ease-out", direction: isAr ? "rtl" : "ltr" }}>
            {/* Header */}
            <div style={{ background: "#075E54", color: "#fff", padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.245 0-4.327-.734-6.012-1.975l-.42-.31-2.69.877.895-2.647-.34-.437A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: "block", fontWeight: 600, fontSize: "0.95rem" }}>DynamicNFC</span>
                <span style={{ display: "block", fontSize: "0.75rem", opacity: 0.8 }}>{isAr ? "عادة يرد خلال دقائق" : "Typically replies in minutes"}</span>
              </div>
              <button onClick={() => setIsExpanded(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "1.4rem", cursor: "pointer" }}>×</button>
            </div>
            {/* Body */}
            <div style={{ padding: "1rem", background: "#ECE5DD" }}>
              <div style={{ background: "#fff", borderRadius: isAr ? "12px 0 12px 12px" : "0 12px 12px 12px", padding: "0.75rem 1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.08)", marginBottom: "0.75rem", maxWidth: "85%" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#1a1a1f", lineHeight: 1.5 }}>{isAr ? "مرحباً! 👋 كيف يمكننا مساعدتك؟" : "Hi there! 👋 How can we help you?"}</p>
              </div>
              {ctx.badge && <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", background: ctx.intent === "vip" ? "rgba(184,134,13,0.15)" : "rgba(230,57,70,0.1)", color: ctx.intent === "vip" ? "#b8860b" : "#e63946", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "0.5rem" }}>{ctx.badge}</span>}
              <p style={{ fontSize: "0.75rem", color: "#888", margin: "0 0 0.35rem" }}>{isAr ? "رسالتك المعبأة مسبقاً:" : "Your pre-filled message:"}</p>
              <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "0.6rem 0.75rem", fontSize: "0.82rem", color: "#555", lineHeight: 1.5, maxHeight: 80, overflowY: "auto" }}>{ctx.message}</div>
            </div>
            {/* Send */}
            <button onClick={() => alert("Would open: wa.me/971XXXXXXXXX")} style={{ width: "100%", padding: "0.85rem", background: "#25D366", color: "#fff", border: "none", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.245 0-4.327-.734-6.012-1.975l-.42-.31-2.69.877.895-2.647-.34-.437A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
              {isAr ? "افتح واتساب" : "Open WhatsApp"}
            </button>
          </div>
        )}

        {/* FAB */}
        <button onClick={() => setIsExpanded(!isExpanded)} style={{ width: 60, height: 60, borderRadius: "50%", border: "none", background: "#25D366", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: ctx.intent === "vip" ? "0 4px 20px rgba(37,211,102,0.4), 0 0 0 3px rgba(184,134,13,0.4)" : "0 4px 20px rgba(37,211,102,0.4), 0 2px 8px rgba(0,0,0,0.15)", transition: "all 0.3s ease" }}>
          {isExpanded ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.245 0-4.327-.734-6.012-1.975l-.42-.31-2.69.877.895-2.647-.34-.437A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
          )}
        </button>
      </div>

      <style>{`
        /* Font loading moved to index.html for performance */
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
