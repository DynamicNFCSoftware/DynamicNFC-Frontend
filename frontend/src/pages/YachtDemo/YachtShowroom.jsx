import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { trackPortalEvent } from "../../services/portalTrack";
import { usePortalRegion } from "../../services/portalRegion";
import { usePortalYachts } from "../../hooks/usePortalYachts";
import { TYPE_LABELS } from "../../data/yachtVesselData";
import YachtSilhouette from "./YachtSilhouette";
import SEO from "../../components/SEO/SEO";
import "./YachtShowroom.css";

// ═══════════════════════════════════════════════════════════════════
// YACHT MARINA SHOWROOM — anonymous browse (region-aware, 4 langs)
// All 8 vessels · type filter chips · charter pricing · progressive
// lead capture. Every interaction tracked (behaviors dual-write).
// ═══════════════════════════════════════════════════════════════════

const _sessionId = (() => {
  let sid = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("dnfc_session") : null;
  if (!sid) { sid = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`; try { sessionStorage.setItem("dnfc_session", sid); } catch (e) { /* ignore */ } }
  return sid;
})();

const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };

const LANG = {
  en: {
    nav: { back: "Demo Hub", register: "Register Interest" },
    hero: { badge: "Marina Showcase", title: "Explore the Fleet", sub: "Browse our curated marina — motor yachts, sport cruisers, explorers and more. Ownership and charter, one marina.", cta: "Browse Fleet" },
    filters: { all: "All Vessels" },
    card: { from: "From", charter: "Charter", perWeek: "/week", guests: "Guests", cabins: "Cabins", details: "View Details" },
    lead: { title: "Register Your Interest", sub: "Unlock full specifications, charter availability and a private marina advisor.", name: "Name", email: "Email", phone: "Phone", submit: "Request Access", note: "Your information is protected. No spam, ever.", success: "You're on the list", successDesc: "A marina advisor will reach out shortly.", close: "Close" },
    detail: { overview: "Overview", features: "Signature Features", type: "Type", marina: "Home Marina", feature: "Signature", close: "Close" },
    footer: "Marina showcase. Anonymous browsing — every vessel, one marina.", poweredBy: "Powered by",
  },
  ar: {
    nav: { back: "مركز العرض", register: "سجّل اهتمامك" },
    hero: { badge: "عرض المارينا", title: "استكشف الأسطول", sub: "تصفح مارينا مختارة — يخوت موتور، سفن رياضية، يخوت استكشافية والمزيد. تملّك واستئجار، مارينا واحدة.", cta: "تصفح الأسطول" },
    filters: { all: "كل اليخوت" },
    card: { from: "يبدأ من", charter: "استئجار", perWeek: "/أسبوع", guests: "ضيوف", cabins: "كبائن", details: "عرض التفاصيل" },
    lead: { title: "سجّل اهتمامك", sub: "افتح المواصفات الكاملة وتوافر الاستئجار ومستشار مارينا خاص.", name: "الاسم", email: "البريد", phone: "الهاتف", submit: "اطلب الوصول", note: "معلوماتك محمية. بلا رسائل مزعجة أبداً.", success: "أنت على القائمة", successDesc: "سيتواصل معك مستشار المارينا قريباً.", close: "إغلاق" },
    detail: { overview: "نظرة عامة", features: "المميزات البارزة", type: "النوع", marina: "المارينا", feature: "المميز", close: "إغلاق" },
    footer: "عرض المارينا. تصفح مجهول — كل يخت، مارينا واحدة.", poweredBy: "مدعوم من",
  },
  es: {
    nav: { back: "Centro Demo", register: "Registrar Interés" },
    hero: { badge: "Vitrina Marina", title: "Explore la Flota", sub: "Navegue por nuestra marina curada — yates a motor, cruceros deportivos, exploradores y más. Propiedad y chárter, una marina.", cta: "Ver Flota" },
    filters: { all: "Todas" },
    card: { from: "Desde", charter: "Chárter", perWeek: "/semana", guests: "Invitados", cabins: "Camarotes", details: "Ver Detalles" },
    lead: { title: "Registre su Interés", sub: "Desbloquee especificaciones completas, disponibilidad de chárter y un asesor de marina privado.", name: "Nombre", email: "Email", phone: "Teléfono", submit: "Solicitar Acceso", note: "Su información está protegida. Sin spam, nunca.", success: "Está en la lista", successDesc: "Un asesor de marina se pondrá en contacto pronto.", close: "Cerrar" },
    detail: { overview: "Resumen", features: "Características Distintivas", type: "Tipo", marina: "Marina", feature: "Distintivo", close: "Cerrar" },
    footer: "Vitrina marina. Navegación anónima — cada embarcación, una marina.", poweredBy: "Impulsado por",
  },
  fr: {
    nav: { back: "Hub Démo", register: "Enregistrer l'Intérêt" },
    hero: { badge: "Vitrine Marina", title: "Explorez la Flotte", sub: "Parcourez notre marina sélectionnée — yachts à moteur, croiseurs sport, explorers et plus. Propriété et affrètement, une seule marina.", cta: "Voir la Flotte" },
    filters: { all: "Tous" },
    card: { from: "À partir de", charter: "Affrètement", perWeek: "/semaine", guests: "Invités", cabins: "Cabines", details: "Voir les Détails" },
    lead: { title: "Enregistrez votre Intérêt", sub: "Débloquez les spécifications complètes, la disponibilité d'affrètement et un conseiller de marina privé.", name: "Nom", email: "Email", phone: "Téléphone", submit: "Demander l'Accès", note: "Vos informations sont protégées. Jamais de spam.", success: "Vous êtes sur la liste", successDesc: "Un conseiller de marina vous contactera sous peu.", close: "Fermer" },
    detail: { overview: "Aperçu", features: "Caractéristiques Signature", type: "Type", marina: "Marina", feature: "Signature", close: "Fermer" },
    footer: "Vitrine marina. Navigation anonyme — chaque navire, une seule marina.", poweredBy: "Propulsé par",
  },
};

export default function YachtShowroom() {
  const [lang, setLang] = useState("en");
  const { projectName, fmtCurrency, regionId, region } = usePortalRegion("yacht", lang);
  const accent = region?.sidebarAccent || "#457b9d";
  const yachts = usePortalYachts("showroom");

  const [lead, setLead] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [scrolled, setScrolled] = useState(false);

  const fleetRef = useRef(null);
  const t = LANG[lang] || LANG.en;
  const isRtl = lang === "ar";

  const trackEvent = useCallback(
    (event, data = {}) => trackPortalEvent(
      lead ? "lead" : "anonymous",
      null,
      event,
      {
        sessionId: _sessionId,
        portal: "yacht",
        source: "direct",
        ...(lead ? { leadName: lead.name, leadEmail: lead.email } : {}),
        ...data,
      }
    ),
    [lead]
  );

  const toggleLang = () => {
    const langs = region?.languages || ["en"];
    const n = langs.find((l) => l !== lang) || langs[0];
    setLang(n);
    document.documentElement.lang = n;
    document.documentElement.dir = n === "ar" ? "rtl" : "ltr";
    trackEvent("language_switch", { to: n });
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { trackEvent("marketplace_visit", { language: lang }); }, []);

  // Only render type chips for types present in the active region's fleet.
  const types = useMemo(() => {
    const present = [...new Set(yachts.map((y) => y.type))];
    return ["all", ...present];
  }, [yachts]);

  const shown = filter === "all" ? yachts : yachts.filter((y) => y.type === filter);

  const setFilterTracked = (f) => {
    setFilter(f);
    trackEvent("filter_units", { filter: f });
  };

  const openDetail = (y) => {
    setSelected(y);
    trackEvent("view_unit", { unitName: y.name, unitType: y.type, tower: y.marina, value: y.price });
  };

  const openLead = () => {
    setLeadOpen(true);
    trackEvent("lead_form_shown", { trigger: "register_interest" });
  };

  const submitLead = (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return;
    setLead({ name: leadForm.name, email: leadForm.email });
    trackEvent("lead_captured", { portalType: "lead", leadName: leadForm.name, leadEmail: leadForm.email });
  };

  const scrollToFleet = () => { fleetRef.current?.scrollIntoView({ behavior: "smooth" }); trackEvent("cta_browse", {}); };

  return (
    <div className="ysh" dir={isRtl ? "rtl" : "ltr"} style={{ "--ysh-accent": accent }}>
      <SEO title="Marina Showcase — Yacht Demo" description="Browse the full marina fleet — motor yachts, sport cruisers and explorers, with charter pricing." path="/yacht/demo/showroom" />

      <nav className={`ysh-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="ysh-nav-inner">
          <Link to="/yacht/demo" className="ysh-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isRtl ? "M5 12h14M12 5l7 7-7 7" : "M19 12H5M12 19l-7-7 7-7"} /></svg>
            {t.nav.back}
          </Link>
          <span className="ysh-brand">{projectName(lang)}</span>
          <div className="ysh-nav-right">
            <button className="ysh-lang" onClick={toggleLang}>{LANG_LABEL[region?.languages?.find((l) => l !== lang) || "en"]}</button>
            <button className="ysh-register" onClick={openLead}>{t.nav.register}</button>
          </div>
        </div>
      </nav>

      <header className="ysh-hero">
        <div className="ysh-hero-bg" />
        <div className="ysh-hero-inner">
          <span className="ysh-hero-badge">{t.hero.badge}</span>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.sub}</p>
          <button className="ysh-hero-cta" onClick={scrollToFleet}>{t.hero.cta}</button>
        </div>
      </header>

      <section className="ysh-fleet" ref={fleetRef}>
        <div className="ysh-chips">
          {types.map((ty) => (
            <button key={ty} className={`ysh-chip ${filter === ty ? "active" : ""}`} onClick={() => setFilterTracked(ty)}>
              {ty === "all" ? t.filters.all : ((TYPE_LABELS[ty] || TYPE_LABELS.motor)[lang] || TYPE_LABELS[ty]?.en)}
            </button>
          ))}
        </div>

        <div className="ysh-grid">
          {shown.map((y) => (
            <button key={y.id} className="ysh-card" onClick={() => openDetail(y)}>
              <div className={`ysh-card-media type-${y.type}`}>
                <YachtSilhouette type={y.type} className="ysh-silhouette" />
                <span className="ysh-type-badge">{(TYPE_LABELS[y.type] || TYPE_LABELS.motor)[lang] || TYPE_LABELS[y.type]?.en}</span>
              </div>
              <div className="ysh-card-body">
                <h3>{y.name}</h3>
                <p className="ysh-card-marina">{y.marina}</p>
                <div className="ysh-card-price">
                  <span className="ysh-card-from">{t.card.from}</span>
                  <span className="ysh-card-amt">{fmtCurrency(y.price)}</span>
                </div>
                {y.charterWeekly > 0 && (
                  <p className="ysh-card-charter">{t.card.charter}: <strong>{fmtCurrency(y.charterWeekly)}</strong><em>{t.card.perWeek}</em></p>
                )}
                <div className="ysh-card-specs">
                  <span>{y.specs.guests} {t.card.guests}</span>
                  {y.specs.cabins > 0 && <span>{y.specs.cabins} {t.card.cabins}</span>}
                  <span>{y.specs.feature[lang] || y.specs.feature.en}</span>
                </div>
                <span className="ysh-card-view">{t.card.details} {isRtl ? "\u2190" : "\u2192"}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div className="ysh-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ysh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ysh-modal-close" onClick={() => setSelected(null)} aria-label={t.detail.close}>×</button>
            <div className={`ysh-modal-media type-${selected.type}`}>
              <YachtSilhouette type={selected.type} className="ysh-modal-silhouette" />
              <span className="ysh-type-badge">{(TYPE_LABELS[selected.type] || TYPE_LABELS.motor)[lang] || TYPE_LABELS[selected.type]?.en}</span>
            </div>
            <div className="ysh-modal-body">
              <h3>{selected.name}</h3>
              <p className="ysh-modal-marina">{selected.marina}</p>
              <div className="ysh-modal-price">
                <span>{fmtCurrency(selected.price)}</span>
                {selected.charterWeekly > 0 && <span className="ysh-modal-charter">{t.card.charter} {fmtCurrency(selected.charterWeekly)}{t.card.perWeek}</span>}
              </div>
              <h4>{t.detail.overview}</h4>
              <p className="ysh-modal-desc">{selected.desc[lang] || selected.desc.en}</p>
              <h4>{t.detail.features}</h4>
              <ul className="ysh-features">
                {selected.features.map((f, i) => (
                  <li key={i}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    {f[lang] || f.en}
                  </li>
                ))}
              </ul>
              <button className="ysh-modal-cta" onClick={() => { setSelected(null); openLead(); }}>{t.nav.register}</button>
            </div>
          </div>
        </div>
      )}

      {leadOpen && (
        <div className="ysh-modal-overlay" onClick={() => setLeadOpen(false)}>
          <div className="ysh-lead" onClick={(e) => e.stopPropagation()}>
            <button className="ysh-modal-close" onClick={() => setLeadOpen(false)} aria-label={t.lead.close}>×</button>
            {lead ? (
              <div className="ysh-lead-ok">
                <div className="ysh-lead-check">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3>{t.lead.success}</h3>
                <p>{t.lead.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={submitLead}>
                <h3>{t.lead.title}</h3>
                <p className="ysh-lead-sub">{t.lead.sub}</p>
                <input placeholder={t.lead.name} value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
                <input type="email" placeholder={t.lead.email} value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} required />
                <input placeholder={t.lead.phone} value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
                <button type="submit" className="ysh-lead-submit">{t.lead.submit}</button>
                <p className="ysh-lead-note">{t.lead.note}</p>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="ysh-footer">
        <p>{t.footer}</p>
        <p className="ysh-footer-brand">{t.poweredBy} <strong>Dynamic NFC</strong></p>
      </footer>
    </div>
  );
}
