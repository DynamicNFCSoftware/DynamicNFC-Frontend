import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { trackPortalEvent } from "../../services/portalTrack";
import { usePortalRegion } from "../../services/portalRegion";
import { usePortalYachts } from "../../hooks/usePortalYachts";
import { TYPE_LABELS } from "../../data/yachtVesselData";
import YachtSilhouette from "./YachtSilhouette";
import SEO from "../../components/SEO/SEO";
import "./YachtVIPPortal.css";

// ═══════════════════════════════════════════════════════════════════
// YACHT VIP OWNER PORTAL — private marina experience (region-aware)
// Dark editorial luxury · fleet grid · detail modal (Overview / Specs /
// Ownership vs Charter toggle) · sea-trial CTAs. Compare dropped for
// simplicity (Code Simplicity Mandate) — see PR notes.
// ═══════════════════════════════════════════════════════════════════

const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };

const LANG = {
  en: {
    nav: { back: "Demo Hub" },
    hero: { badge: "Private Marina", welcomeMale: "Welcome,", welcomeFemale: "Welcome,",
      title: "Your Private Fleet Awaits", sub: "A curated selection of exceptional vessels, reserved for owners who expect the extraordinary — at anchor and under way.", cta: "Explore Fleet" },
    fleet: { title: "The Fleet", sub: "Curated for You", hint: "Select any vessel to explore full details" },
    card: { from: "From", guests: "Guests", cabins: "Cabins", view: "View Details" },
    detail: { overview: "Overview", specs: "Specifications", ownership: "Ownership", charter: "Charter",
      guests: "Guests", cabins: "Cabins", type: "Type", marina: "Home Marina", feature: "Signature",
      purchase: "Purchase Price", charterWeek: "Charter", perWeek: "/week", features: "Signature Features" },
    cta: { trial: "Book Private Sea Trial", pricing: "Request Pricing", spec: "Download Specification", advisor: "Contact Advisor" },
    book: { title: "Book a Private Sea Trial", name: "Name", email: "Email", phone: "Phone", vessel: "Vessel", date: "Preferred Date", notes: "Requests", submit: "Request Sea Trial", note: "Your information is protected. Your advisor will confirm within 24 hours.", success: "Request Sent", successDesc: "Your marina advisor will confirm within 24 hours.", successRef: "Reference", close: "Close" },
    toast: { brochure: "Specification downloaded", pricing: "Pricing request sent", advisor: "Advisor notified", trial: "Sea trial requested" },
    footer: "Private marina experience. Curated for your exclusive access.", poweredBy: "Powered by",
  },
  ar: {
    nav: { back: "مركز العرض" },
    hero: { badge: "مارينا خاصة", welcomeMale: "مرحبًا،", welcomeFemale: "مرحبًا،",
      title: "أسطولك الخاص بانتظارك", sub: "مجموعة مختارة من اليخوت الاستثنائية، محجوزة لملاك يتوقعون ما هو استثنائي — عند الرسو وأثناء الإبحار.", cta: "استكشف الأسطول" },
    fleet: { title: "الأسطول", sub: "مختار لك", hint: "اختر أي يخت لاستكشاف كامل التفاصيل" },
    card: { from: "يبدأ من", guests: "ضيوف", cabins: "كبائن", view: "عرض التفاصيل" },
    detail: { overview: "نظرة عامة", specs: "المواصفات", ownership: "تملّك", charter: "استئجار",
      guests: "ضيوف", cabins: "كبائن", type: "النوع", marina: "المارينا", feature: "المميز",
      purchase: "سعر الشراء", charterWeek: "الاستئجار", perWeek: "/أسبوع", features: "المميزات البارزة" },
    cta: { trial: "احجز تجربة إبحار خاصة", pricing: "اطلب السعر", spec: "تنزيل المواصفات", advisor: "تواصل مع المستشار" },
    book: { title: "احجز تجربة إبحار خاصة", name: "الاسم", email: "البريد", phone: "الهاتف", vessel: "اليخت", date: "التاريخ المفضل", notes: "الطلبات", submit: "اطلب تجربة إبحار", note: "معلوماتك محمية. سيؤكد مستشارك خلال ٢٤ ساعة.", success: "تم الإرسال", successDesc: "سيؤكد مستشار المارينا خلال ٢٤ ساعة.", successRef: "المرجع", close: "إغلاق" },
    toast: { brochure: "تم تنزيل المواصفات", pricing: "تم إرسال طلب السعر", advisor: "تم إبلاغ المستشار", trial: "تم طلب تجربة الإبحار" },
    footer: "تجربة مارينا خاصة. مصممة لوصولك الحصري.", poweredBy: "مدعوم من",
  },
  es: {
    nav: { back: "Centro Demo" },
    hero: { badge: "Marina Privada", welcomeMale: "Bienvenido,", welcomeFemale: "Bienvenida,",
      title: "Su Flota Privada le Espera", sub: "Una selección curada de embarcaciones excepcionales, reservada para propietarios que esperan lo extraordinario — al ancla y en navegación.", cta: "Explorar Flota" },
    fleet: { title: "La Flota", sub: "Curada para Usted", hint: "Seleccione cualquier embarcación para ver todos los detalles" },
    card: { from: "Desde", guests: "Invitados", cabins: "Camarotes", view: "Ver Detalles" },
    detail: { overview: "Resumen", specs: "Especificaciones", ownership: "Propiedad", charter: "Chárter",
      guests: "Invitados", cabins: "Camarotes", type: "Tipo", marina: "Marina", feature: "Distintivo",
      purchase: "Precio de Compra", charterWeek: "Chárter", perWeek: "/semana", features: "Características Distintivas" },
    cta: { trial: "Reservar Prueba de Mar Privada", pricing: "Solicitar Precio", spec: "Descargar Ficha", advisor: "Contactar Asesor" },
    book: { title: "Reservar una Prueba de Mar Privada", name: "Nombre", email: "Email", phone: "Teléfono", vessel: "Embarcación", date: "Fecha Preferida", notes: "Solicitudes", submit: "Solicitar Prueba de Mar", note: "Su información está protegida. Su asesor confirmará en 24 horas.", success: "Solicitud Enviada", successDesc: "Su asesor de marina confirmará en 24 horas.", successRef: "Referencia", close: "Cerrar" },
    toast: { brochure: "Ficha descargada", pricing: "Solicitud de precio enviada", advisor: "Asesor notificado", trial: "Prueba de mar solicitada" },
    footer: "Experiencia de marina privada. Curada para su acceso exclusivo.", poweredBy: "Impulsado por",
  },
  fr: {
    nav: { back: "Hub Démo" },
    hero: { badge: "Marina Privée", welcomeMale: "Bienvenue,", welcomeFemale: "Bienvenue,",
      title: "Votre Flotte Privée Vous Attend", sub: "Une sélection choisie de navires d'exception, réservée aux propriétaires qui attendent l'extraordinaire — au mouillage comme en navigation.", cta: "Explorer la Flotte" },
    fleet: { title: "La Flotte", sub: "Sélectionnée pour Vous", hint: "Sélectionnez un navire pour voir tous les détails" },
    card: { from: "À partir de", guests: "Invités", cabins: "Cabines", view: "Voir les Détails" },
    detail: { overview: "Aperçu", specs: "Spécifications", ownership: "Propriété", charter: "Affrètement",
      guests: "Invités", cabins: "Cabines", type: "Type", marina: "Marina", feature: "Signature",
      purchase: "Prix d'Achat", charterWeek: "Affrètement", perWeek: "/semaine", features: "Caractéristiques Signature" },
    cta: { trial: "Réserver un Essai en Mer Privé", pricing: "Demander le Prix", spec: "Télécharger la Fiche", advisor: "Contacter le Conseiller" },
    book: { title: "Réserver un Essai en Mer Privé", name: "Nom", email: "Email", phone: "Téléphone", vessel: "Navire", date: "Date Préférée", notes: "Demandes", submit: "Demander un Essai en Mer", note: "Vos informations sont protégées. Votre conseiller confirmera sous 24 h.", success: "Demande Envoyée", successDesc: "Votre conseiller de marina confirmera sous 24 h.", successRef: "Référence", close: "Fermer" },
    toast: { brochure: "Fiche téléchargée", pricing: "Demande de prix envoyée", advisor: "Conseiller notifié", trial: "Essai en mer demandé" },
    footer: "Expérience de marina privée. Conçue pour votre accès exclusif.", poweredBy: "Propulsé par",
  },
};

export default function YachtVIPPortal() {
  const [lang, setLang] = useState("en");
  const { projectName, fmtCurrency, regionId, region, vipPersona } = usePortalRegion("yacht", lang);
  const accent = region?.sidebarAccent || "#457b9d";
  const yachts = usePortalYachts("vip");
  const vipName = vipPersona?.name || "VIP Owner";

  const trackEvent = useCallback(
    (event, data) => trackPortalEvent(
      "vip",
      { id: `${regionId}-yacht-vip`, name: vipName },
      event,
      { portal: "yacht", ...data }
    ),
    [regionId, vipName]
  );

  const [scrolled, setScrolled] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("overview");
  const [mode, setMode] = useState("ownership"); // ownership | charter
  const [booking, setBooking] = useState(false);
  const [bookingOk, setBookingOk] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", notes: "" });
  const [toast, setToast] = useState(null);

  const fleetRef = useRef(null);
  const t = LANG[lang] || LANG.en;
  const isRtl = lang === "ar";

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

  useEffect(() => { trackEvent("portal_opened", { language: lang }); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const openDetail = (yacht) => {
    setSelected(yacht);
    setTab("overview");
    setMode("ownership");
    trackEvent("view_unit", { unitName: yacht.name, unitType: yacht.type, tower: yacht.marina, value: yacht.price });
  };

  const closeDetail = () => setSelected(null);

  const switchMode = (m) => {
    if (m === mode) return;
    setMode(m);
    if (selected) trackEvent("explore_payment_plan", { unitName: selected.name, unitType: selected.type, tower: selected.marina, plan: m });
  };

  const onCta = (kind) => {
    const y = selected;
    const base = y ? { unitName: y.name, unitType: y.type, tower: y.marina, value: y.price } : {};
    if (kind === "pricing") { trackEvent("request_pricing", base); showToast(t.toast.pricing); }
    else if (kind === "spec") { trackEvent("download_brochure", base); showToast(t.toast.brochure); }
    else if (kind === "advisor") { trackEvent("contact_advisor", base); showToast(t.toast.advisor); }
    else if (kind === "trial") { setBooking(true); trackEvent("cta_booking", base); }
  };

  const submitBooking = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const ref = "SEA-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setBookingRef(ref);
    setBookingOk(true);
    trackEvent("book_viewing", {
      unitName: selected?.name, unitType: selected?.type, tower: selected?.marina,
      value: selected?.price, ref, leadName: form.name, leadEmail: form.email,
    });
  };

  const scrollToFleet = () => { fleetRef.current?.scrollIntoView({ behavior: "smooth" }); trackEvent("cta_explore", {}); };

  return (
    <div className="yvp" dir={isRtl ? "rtl" : "ltr"} style={{ "--yvp-accent": accent }}>
      <SEO title="VIP Owner Portal — Yacht Demo" description="A private, identity-first marina experience for flagship yacht owners." path="/yacht/demo/vip" />

      <nav className={`yvp-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="yvp-nav-inner">
          <Link to="/yacht/demo" className="yvp-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isRtl ? "M5 12h14M12 5l7 7-7 7" : "M19 12H5M12 19l-7-7 7-7"} /></svg>
            {t.nav.back}
          </Link>
          <span className="yvp-brand">{projectName(lang)}</span>
          <button className="yvp-lang" onClick={toggleLang}>{LANG_LABEL[region?.languages?.find((l) => l !== lang) || "en"]}</button>
        </div>
      </nav>

      <header className="yvp-hero">
        <div className="yvp-hero-bg" />
        <div className="yvp-nfc-waves"><span /><span /><span /></div>
        <div className="yvp-hero-inner">
          <span className="yvp-hero-badge">{t.hero.badge}</span>
          <p className="yvp-greet">{t.hero[vipPersona?.gender === "female" ? "welcomeFemale" : "welcomeMale"]} <span>{vipName}</span></p>
          <h1 className="yvp-hero-title">{t.hero.title}</h1>
          <p className="yvp-hero-sub">{t.hero.sub}</p>
          <button className="yvp-hero-cta" onClick={scrollToFleet}>{t.hero.cta}</button>
        </div>
      </header>

      <section className="yvp-fleet" ref={fleetRef}>
        <div className="yvp-sec-head">
          <span className="yvp-sec-kicker">{t.fleet.sub}</span>
          <h2>{t.fleet.title}</h2>
          <p>{t.fleet.hint}</p>
        </div>
        <div className="yvp-grid">
          {yachts.map((y) => (
            <button key={y.id} className="yvp-card" onClick={() => openDetail(y)}>
              <div className={`yvp-card-media type-${y.type}`}>
                <YachtSilhouette type={y.type} className="yvp-silhouette" />
                <span className="yvp-type-badge">{(TYPE_LABELS[y.type] || TYPE_LABELS.motor)[lang] || TYPE_LABELS[y.type]?.en}</span>
              </div>
              <div className="yvp-card-body">
                <h3>{y.name}</h3>
                <p className="yvp-card-marina">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {y.marina}
                </p>
                <div className="yvp-card-price">
                  <span className="yvp-card-from">{t.card.from}</span>
                  <span className="yvp-card-amt">{fmtCurrency(y.price)}</span>
                </div>
                <div className="yvp-card-specs">
                  <span>{y.specs.guests} {t.card.guests}</span>
                  {y.specs.cabins > 0 && <span>{y.specs.cabins} {t.card.cabins}</span>}
                  <span>{(y.specs.feature[lang] || y.specs.feature.en)}</span>
                </div>
                <span className="yvp-card-view">{t.card.view} {isRtl ? "\u2190" : "\u2192"}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div className="yvp-modal-overlay" onClick={closeDetail}>
          <div className="yvp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="yvp-modal-close" onClick={closeDetail} aria-label={t.book.close}>×</button>
            <div className={`yvp-modal-media type-${selected.type}`}>
              <YachtSilhouette type={selected.type} className="yvp-modal-silhouette" />
              <span className="yvp-type-badge">{(TYPE_LABELS[selected.type] || TYPE_LABELS.motor)[lang] || TYPE_LABELS[selected.type]?.en}</span>
            </div>
            <div className="yvp-modal-head">
              <h3>{selected.name}</h3>
              <p>{selected.marina}</p>
            </div>
            <div className="yvp-tabs">
              {["overview", "specs", "pricing"].map((k) => (
                <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>
                  {k === "overview" ? t.detail.overview : k === "specs" ? t.detail.specs : `${t.detail.ownership} / ${t.detail.charter}`}
                </button>
              ))}
            </div>

            <div className="yvp-tab-body">
              {tab === "overview" && (
                <div className="yvp-overview">
                  <p className="yvp-desc">{selected.desc[lang] || selected.desc.en}</p>
                  <h4>{t.detail.features}</h4>
                  <ul className="yvp-features">
                    {selected.features.map((f, i) => (
                      <li key={i}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                        {f[lang] || f.en}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "specs" && (
                <div className="yvp-specs">
                  <div className="yvp-spec"><span>{t.detail.guests}</span><strong>{selected.specs.guests}</strong></div>
                  {selected.specs.cabins > 0 && <div className="yvp-spec"><span>{t.detail.cabins}</span><strong>{selected.specs.cabins}</strong></div>}
                  <div className="yvp-spec"><span>{t.detail.type}</span><strong>{(TYPE_LABELS[selected.type] || TYPE_LABELS.motor)[lang] || TYPE_LABELS[selected.type]?.en}</strong></div>
                  <div className="yvp-spec"><span>{t.detail.marina}</span><strong>{selected.marina}</strong></div>
                  <div className="yvp-spec"><span>{t.detail.feature}</span><strong>{selected.specs.feature[lang] || selected.specs.feature.en}</strong></div>
                </div>
              )}

              {tab === "pricing" && (
                <div className="yvp-pricing">
                  <div className="yvp-mode-toggle">
                    <button className={mode === "ownership" ? "active" : ""} onClick={() => switchMode("ownership")}>{t.detail.ownership}</button>
                    <button className={mode === "charter" ? "active" : ""} onClick={() => switchMode("charter")}>{t.detail.charter}</button>
                  </div>
                  {mode === "ownership" ? (
                    <div className="yvp-price-block">
                      <span className="yvp-price-label">{t.detail.purchase}</span>
                      <span className="yvp-price-value">{fmtCurrency(selected.price)}</span>
                    </div>
                  ) : (
                    <div className="yvp-price-block">
                      <span className="yvp-price-label">{t.detail.charterWeek}</span>
                      <span className="yvp-price-value">{fmtCurrency(selected.charterWeekly)}<em>{t.detail.perWeek}</em></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="yvp-cta-row">
              <button className="yvp-cta primary" onClick={() => onCta("trial")}>{t.cta.trial}</button>
              <button className="yvp-cta" onClick={() => onCta("pricing")}>{t.cta.pricing}</button>
              <button className="yvp-cta" onClick={() => onCta("spec")}>{t.cta.spec}</button>
              <button className="yvp-cta" onClick={() => onCta("advisor")}>{t.cta.advisor}</button>
            </div>
          </div>
        </div>
      )}

      {booking && (
        <div className="yvp-modal-overlay" onClick={() => { setBooking(false); setBookingOk(false); }}>
          <div className="yvp-book" onClick={(e) => e.stopPropagation()}>
            <button className="yvp-modal-close" onClick={() => { setBooking(false); setBookingOk(false); }} aria-label={t.book.close}>×</button>
            {bookingOk ? (
              <div className="yvp-book-ok">
                <div className="yvp-book-check">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3>{t.book.success}</h3>
                <p>{t.book.successDesc}</p>
                <span className="yvp-book-ref">{t.book.successRef}: {bookingRef}</span>
              </div>
            ) : (
              <form onSubmit={submitBooking}>
                <h3>{t.book.title}</h3>
                {selected && <p className="yvp-book-vessel">{t.book.vessel}: {selected.name}</p>}
                <input placeholder={t.book.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input type="email" placeholder={t.book.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <input placeholder={t.book.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input type="date" placeholder={t.book.date} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <textarea placeholder={t.book.notes} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button type="submit" className="yvp-cta primary yvp-book-submit">{t.book.submit}</button>
                <p className="yvp-book-note">{t.book.note}</p>
              </form>
            )}
          </div>
        </div>
      )}

      {toast && <div className="yvp-toast">{toast}</div>}

      <footer className="yvp-footer">
        <p>{t.footer}</p>
        <p className="yvp-footer-brand">{t.poweredBy} <strong>Dynamic NFC</strong></p>
      </footer>
    </div>
  );
}
