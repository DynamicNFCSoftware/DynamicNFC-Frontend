import { useEffect, useRef } from "react";
import { useLanguage } from "../../i18n";
import { useRegion } from "../../hooks/useRegion";
import { getPersonas, REGION_LIST } from "../../config/regionConfig";
import "./YachtGateway.css";
import SEO from "../../components/SEO/SEO";

// ═══════════════════════════════════════════════════════════════════
// YACHT DEMO GATEWAY — portal selector (mirrors AutoGateway layout)
// Dark editorial luxury. Qualitative stats only — NO fake metrics.
// ═══════════════════════════════════════════════════════════════════

const REGION_CODE = { gulf: "KSA", usa: "USA", mexico: "MEX", canada: "CAN" };
const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };

const T = {
  en: {
    badge: "Live Demo Environment",
    tagline: "Dynamic NFC Yacht Brokerage Technology Demo",
    title: "Private Buyer Experiences", title2: "Powered by NFC",
    desc: "Experience how Dynamic NFC transforms yacht brokerage with identity-first, private marina portals. Each tap opens a curated experience shaped by the owner, the vessel, and the moment.",
    stat1v: "Named", stat1l: "Every Owner",
    stat2v: "Real-Time", stat2l: "Intent Signals",
    stat3v: "Zero", stat3l: "Guesswork",
    sectionPortals: "Demo Portals",
    b1: "VIP Owner", c1d: "Private marina portal for the flagship owner — curated fleet, ownership vs charter, and private sea-trial booking.",
    c1tags: ["Flagship Fleet", "Ownership / Charter", "Sea Trial"],
    b2: "Marina Showcase", c2t: "Anonymous Marina Showcase",
    c2d: "Anonymous browsing of the full marina fleet with charter pricing, vessel filters, and progressive lead capture.",
    c2tags: ["Anonymous Browse", "Charter Pricing", "Lead Capture"],
    b3: "AI Concierge", c3t: "AI-Orchestrated Sea Trial",
    c3d: "Watch AI coordinate a complete VIP sea-trial experience — brochure, invitation, calendar, and agreement — from NFC tap to signature.",
    c3tags: ["Canva", "Gmail", "Google Calendar", "DocuSign"],
    b4: "Analytics", c4t: "Unified Dashboard — Marina Intelligence",
    c4d: "Real-time behavioral analytics and CRM across every region and sector, including the yacht fleet — lead scoring, intent heatmaps, and VIP funnels.",
    c4tags: ["Real-time Analytics", "Lead Scoring", "VIP Intelligence"],
    howTitle: "How Dynamic NFC Works",
    howDesc: "Turn every marina touchpoint into a private, tracked experience",
    s1t: "Tap to Connect", s1d: "An owner taps their VIP Access Key at the marina, a viewing, or on a private invitation.",
    s2t: "Instant Recognition", s2d: "The system identifies returning owners or captures new interest, routing them to a private portal.",
    s3t: "Tailored Marina", s3d: "Content adapts to the owner — relevant vessels, ownership or charter terms, and the right offer.",
    s4t: "Track & Optimize", s4d: "Every interaction feeds the dashboard, so brokers act with context, timing, and zero guesswork.",
    tech1: "NFC Technology", tech2: "QR Code Fallback", tech3: "AI Personalization", tech4: "CRM Integration",
    footer: "Demo environment for", footerLink: "Dynamic NFC",
    footerEnd: "yacht brokerage technology showcase. No tracking on this gateway page.",
    homeBtn: "Home",
  },
  ar: {
    badge: "بيئة العرض المباشر",
    tagline: "عرض تقنية وساطة اليخوت لدى Dynamic NFC",
    title: "تجارب مشترٍ خاصة", title2: "مدعوم بتقنية NFC",
    desc: "اختبر كيف تحوّل Dynamic NFC وساطة اليخوت عبر بوابات مارينا خاصة تبدأ من الهوية. كل نقرة تفتح تجربة مصمّمة حسب المالك واليخت واللحظة.",
    stat1v: "بالاسم", stat1l: "كل مالك",
    stat2v: "فوري", stat2l: "إشارات النية",
    stat3v: "صفر", stat3l: "تخمين",
    sectionPortals: "بوابات العرض التجريبي",
    b1: "مالك VIP", c1d: "بوابة مارينا خاصة لمالك السفينة الرائدة — أسطول مختار، تملّك أو استئجار، وحجز تجربة إبحار خاصة.",
    c1tags: ["أسطول رائد", "تملّك / استئجار", "تجربة إبحار"],
    b2: "عرض المارينا", c2t: "عرض مارينا مجهول",
    c2d: "تصفح مجهول لكامل أسطول المارينا مع أسعار الاستئجار، ومرشحات اليخوت، والتقاط تدريجي للعملاء.",
    c2tags: ["تصفح مجهول", "أسعار الاستئجار", "التقاط العملاء"],
    b3: "الكونسيرج الذكي", c3t: "تجربة إبحار منسّقة بالذكاء الاصطناعي",
    c3d: "شاهد الذكاء الاصطناعي ينسّق تجربة إبحار VIP كاملة — كتيب، دعوة، تقويم، واتفاقية — من نقرة NFC إلى التوقيع.",
    c3tags: ["Canva", "Gmail", "تقويم Google", "DocuSign"],
    b4: "التحليلات", c4t: "اللوحة الموحدة — ذكاء المارينا",
    c4d: "تحليلات سلوكية فورية وإدارة علاقات عملاء عبر كل المناطق والقطاعات، بما فيها أسطول اليخوت — تقييم العملاء وخرائط النية ومسارات VIP.",
    c4tags: ["تحليلات فورية", "تقييم العملاء", "ذكاء VIP"],
    howTitle: "كيف تعمل Dynamic NFC",
    howDesc: "حوّل كل نقطة تواصل في المارينا إلى تجربة خاصة ومتتبَّعة",
    s1t: "انقر للاتصال", s1d: "ينقر المالك بطاقة VIP في المارينا أو أثناء معاينة أو على دعوة خاصة.",
    s2t: "التعرف الفوري", s2d: "يتعرف النظام على المالكين العائدين أو يلتقط اهتماماً جديداً، ويوجّههم إلى بوابة خاصة.",
    s3t: "مارينا مخصصة", s3d: "يتكيّف المحتوى مع المالك — اليخوت المناسبة، شروط التملّك أو الاستئجار، والعرض الصحيح.",
    s4t: "التتبع والتحسين", s4d: "كل تفاعل يغذّي اللوحة، فيتحرك الوسطاء بسياق وتوقيت وبلا أي تخمين.",
    tech1: "تقنية NFC", tech2: "خيار QR", tech3: "تخصيص بالذكاء الاصطناعي", tech4: "تكامل CRM",
    footer: "بيئة العرض التجريبي لـ", footerLink: "Dynamic NFC",
    footerEnd: "عرض تقنية وساطة اليخوت. لا يوجد تتبع على هذه الصفحة.",
    homeBtn: "الرئيسية",
  },
  es: {
    badge: "Entorno de Demo en Vivo",
    tagline: "Demo de Tecnología de Corretaje de Yates de Dynamic NFC",
    title: "Experiencias Privadas de Comprador", title2: "Impulsadas por NFC",
    desc: "Descubra cómo Dynamic NFC transforma el corretaje de yates con portales de marina privados centrados en la identidad. Cada toque abre una experiencia curada según el propietario, la embarcación y el momento.",
    stat1v: "Con Nombre", stat1l: "Cada Propietario",
    stat2v: "Tiempo Real", stat2l: "Señales de Interés",
    stat3v: "Cero", stat3l: "Conjeturas",
    sectionPortals: "Portales Demo",
    b1: "Propietario VIP", c1d: "Portal de marina privado para el propietario insignia: flota curada, propiedad o chárter y reserva de prueba de mar privada.",
    c1tags: ["Flota Insignia", "Propiedad / Chárter", "Prueba de Mar"],
    b2: "Vitrina Marina", c2t: "Vitrina Marina Anónima",
    c2d: "Navegación anónima de toda la flota de la marina con precios de chárter, filtros de embarcación y captura progresiva de leads.",
    c2tags: ["Navegación Anónima", "Precio Chárter", "Captura de Leads"],
    b3: "Conserje IA", c3t: "Prueba de Mar Orquestada por IA",
    c3d: "Vea a la IA coordinar una experiencia completa de prueba de mar VIP — folleto, invitación, calendario y acuerdo — del toque NFC a la firma.",
    c3tags: ["Canva", "Gmail", "Google Calendar", "DocuSign"],
    b4: "Analítica", c4t: "Panel Unificado — Inteligencia de Marina",
    c4d: "Analítica de comportamiento en tiempo real y CRM en todas las regiones y sectores, incluida la flota de yates: scoring de leads, mapas de interés y embudos VIP.",
    c4tags: ["Analítica en Tiempo Real", "Scoring de Leads", "Inteligencia VIP"],
    howTitle: "Cómo Funciona Dynamic NFC",
    howDesc: "Convierta cada punto de contacto de la marina en una experiencia privada y rastreada",
    s1t: "Toque para Conectar", s1d: "Un propietario toca su Llave de Acceso VIP en la marina, una visita o una invitación privada.",
    s2t: "Reconocimiento Instantáneo", s2d: "El sistema identifica a propietarios que regresan o capta nuevo interés, y los dirige a un portal privado.",
    s3t: "Marina a Medida", s3d: "El contenido se adapta al propietario: embarcaciones relevantes, términos de propiedad o chárter y la oferta adecuada.",
    s4t: "Medir y Optimizar", s4d: "Cada interacción alimenta el panel, para que los brokers actúen con contexto, oportunidad y sin conjeturas.",
    tech1: "Tecnología NFC", tech2: "Alternativa QR", tech3: "Personalización IA", tech4: "Integración CRM",
    footer: "Entorno de demo para", footerLink: "Dynamic NFC",
    footerEnd: "muestra de tecnología de corretaje de yates. Sin rastreo en esta página.",
    homeBtn: "Inicio",
  },
  fr: {
    badge: "Environnement de Démo en Direct",
    tagline: "Démo Technologique de Courtage de Yachts Dynamic NFC",
    title: "Expériences Acheteur Privées", title2: "Propulsées par NFC",
    desc: "Découvrez comment Dynamic NFC transforme le courtage de yachts avec des portails de marina privés centrés sur l'identité. Chaque tap ouvre une expérience façonnée par le propriétaire, le navire et l'instant.",
    stat1v: "Nommé", stat1l: "Chaque Propriétaire",
    stat2v: "Temps Réel", stat2l: "Signaux d'Intention",
    stat3v: "Zéro", stat3l: "Approximation",
    sectionPortals: "Portails Démo",
    b1: "Propriétaire VIP", c1d: "Portail de marina privé pour le propriétaire amiral — flotte sélectionnée, propriété ou affrètement, et réservation d'essai en mer privé.",
    c1tags: ["Flotte Amirale", "Propriété / Affrètement", "Essai en Mer"],
    b2: "Vitrine Marina", c2t: "Vitrine Marina Anonyme",
    c2d: "Navigation anonyme de toute la flotte de la marina avec tarifs d'affrètement, filtres de navire et capture progressive de leads.",
    c2tags: ["Navigation Anonyme", "Tarif Affrètement", "Capture de Leads"],
    b3: "Concierge IA", c3t: "Essai en Mer Orchestré par IA",
    c3d: "Regardez l'IA coordonner une expérience complète d'essai en mer VIP — brochure, invitation, calendrier et accord — du tap NFC à la signature.",
    c3tags: ["Canva", "Gmail", "Google Calendar", "DocuSign"],
    b4: "Analytique", c4t: "Tableau de Bord Unifié — Intelligence Marina",
    c4d: "Analytique comportementale en temps réel et CRM sur toutes les régions et secteurs, y compris la flotte de yachts : scoring de leads, cartes d'intention et tunnels VIP.",
    c4tags: ["Analytique Temps Réel", "Scoring de Leads", "Intelligence VIP"],
    howTitle: "Comment Fonctionne Dynamic NFC",
    howDesc: "Transformez chaque point de contact de la marina en expérience privée et suivie",
    s1t: "Tapez pour Connecter", s1d: "Un propriétaire tape sa Clé d'Accès VIP à la marina, lors d'une visite ou sur une invitation privée.",
    s2t: "Reconnaissance Instantanée", s2d: "Le système identifie les propriétaires fidèles ou capte un nouvel intérêt, et les dirige vers un portail privé.",
    s3t: "Marina sur Mesure", s3d: "Le contenu s'adapte au propriétaire : navires pertinents, conditions de propriété ou d'affrètement, et la bonne offre.",
    s4t: "Suivre et Optimiser", s4d: "Chaque interaction alimente le tableau de bord, pour que les courtiers agissent avec contexte, timing et sans approximation.",
    tech1: "Technologie NFC", tech2: "Repli QR Code", tech3: "Personnalisation IA", tech4: "Intégration CRM",
    footer: "Environnement de démo pour", footerLink: "Dynamic NFC",
    footerEnd: "vitrine technologique de courtage de yachts. Aucun suivi sur cette page.",
    homeBtn: "Accueil",
  },
};

export default function YachtGateway() {
  const { lang, setLang } = useLanguage();
  const { regionId, sidebarAccent, switchRegion, languages } = useRegion();
  const langs = languages?.length ? languages : ["en"];
  const nextL = langs[(langs.indexOf(lang) + 1) % langs.length] || "en";
  const t = T[lang] || T.en;
  const particlesRef = useRef(null);

  const vip1 = getPersonas("yacht", regionId).find((p) => p.id === "vip1");
  const accent = sidebarAccent || "#457b9d";

  useEffect(() => {
    if (!particlesRef.current) return;
    particlesRef.current.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "ygw-particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 20 + "s";
      p.style.animationDuration = (15 + Math.random() * 10) + "s";
      particlesRef.current.appendChild(p);
    }
  }, []);

  const portals = [
    { id: "vip", path: "/yacht/demo/vip", badge: t.b1, badgeCls: "gold", avatar: "V", avatarCls: "gold", title: `${vip1?.name || "VIP Owner"}`, desc: t.c1d, tags: t.c1tags },
    { id: "showroom", path: "/yacht/demo/showroom", badge: t.b2, badgeCls: "teal", icon: "\u2693", title: t.c2t, desc: t.c2d, tags: t.c2tags },
    { id: "ai", path: "/yacht/demo/ai", badge: t.b3, badgeCls: "purple", icon: "\u26A1", title: t.c3t, desc: t.c3d, tags: t.c3tags, featured: true },
    { id: "analytics", path: "/unified", badge: t.b4, badgeCls: "teal", icon: "\uD83D\uDCCA", title: t.c4t, desc: t.c4d, tags: t.c4tags, featured: true },
  ];

  return (
    <div className="ygw" dir={lang === "ar" ? "rtl" : "ltr"} style={{ "--ygw-accent": accent }}>
      <SEO title="Yacht Demo Gateway" description="Explore private, identity-first yacht brokerage experiences powered by NFC technology." path="/yacht/demo" />
      <div className="ygw-bg" />
      <div className="ygw-particles" ref={particlesRef} />

      <header className="ygw-hd">
        <div className="ygw-logo" aria-label="DynamicNFC">
          <span className="ygw-logo-dyn">Dynamic</span>
          <span className="ygw-logo-nfc">NFC</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6ba3c7" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M8 9a6 6 0 0 1 0 6" /><path d="M12 6.5a10 10 0 0 1 0 11" /><path d="M16 4a14 14 0 0 1 0 16" />
          </svg>
        </div>
        <div className="ygw-badge"><span>{t.badge}</span></div>
        <div className="ygw-hd-right">
          <div className="ygw-region" role="group" aria-label="Region">
            {REGION_LIST.map((r) => (
              <button
                key={r.id}
                className={`ygw-region-btn${regionId === r.id ? " act" : ""}`}
                onClick={() => switchRegion(r.id)}
                aria-pressed={regionId === r.id}
                title={r.label[lang] || r.label.en}
              >
                {REGION_CODE[r.id]}
              </button>
            ))}
          </div>
          <button className="ygw-lang" onClick={() => setLang(nextL)} aria-label={`Language — ${LANG_LABEL[nextL]}`}>
            {LANG_LABEL[nextL]}
          </button>
          <a href="/" className="ygw-home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            {t.homeBtn}
          </a>
        </div>
      </header>

      <main className="ygw-main">
        <section className="ygw-hero">
          <div className="ygw-nfc">
            <div className="ygw-nfc-waves"><div className="ygw-nfc-wave" /><div className="ygw-nfc-wave" /><div className="ygw-nfc-wave" /></div>
            <div className="ygw-nfc-card">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--ygw-accent)" }}>
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" />
              </svg>
            </div>
          </div>
          <div className="ygw-tagline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            {t.tagline}
          </div>
          <h1>{t.title}<br />{t.title2}</h1>
          <p>{t.desc}</p>
          <div className="ygw-stats">
            <div className="ygw-stat"><span className="ygw-stat-v">{t.stat1v}</span><span className="ygw-stat-l">{t.stat1l}</span></div>
            <div className="ygw-stat"><span className="ygw-stat-v">{t.stat2v}</span><span className="ygw-stat-l">{t.stat2l}</span></div>
            <div className="ygw-stat"><span className="ygw-stat-v">{t.stat3v}</span><span className="ygw-stat-l">{t.stat3l}</span></div>
          </div>
        </section>

        <div className="ygw-sh"><h2>{t.sectionPortals}</h2><div className="ygw-sh-line" /></div>
        <div className="ygw-grid">
          {portals.map((p) => (
            <a key={p.id} href={p.path} target="_blank" rel="noopener noreferrer" className={`ygw-card ${p.featured ? "featured" : ""}`}>
              <div className={`ygw-card-badge ${p.badgeCls}`}>{p.badge}</div>
              {p.avatar ? (
                <div className={`ygw-card-avatar ${p.avatarCls}`}>{p.avatar}</div>
              ) : (
                <div className="ygw-card-icon">{p.icon}</div>
              )}
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="ygw-card-tags">{p.tags.map((tag, i) => (<span className="ygw-tag" key={i}>{tag}</span>))}</div>
              <div className="ygw-card-arrow">{lang === "ar" ? "\u2190" : "\u2192"}</div>
            </a>
          ))}
        </div>

        <section className="ygw-how">
          <h2>{t.howTitle}</h2>
          <p>{t.howDesc}</p>
          <div className="ygw-steps">
            {[{ n: "1", t: t.s1t, d: t.s1d }, { n: "2", t: t.s2t, d: t.s2d }, { n: "3", t: t.s3t, d: t.s3d }, { n: "4", t: t.s4t, d: t.s4d }].map((s, i) => (
              <div className="ygw-step" key={i}><div className="ygw-step-n">{s.n}</div><h4>{s.t}</h4><p>{s.d}</p></div>
            ))}
          </div>
          <div className="ygw-tech">
            {[{ e: "\uD83D\uDCE1", l: t.tech1 }, { e: "\uD83D\uDCF1", l: t.tech2 }, { e: "\uD83E\uDD16", l: t.tech3 }, { e: "\uD83D\uDD17", l: t.tech4 }].map((item, i) => (
              <div className="ygw-tech-item" key={i}><span>{item.e}</span>{item.l}</div>
            ))}
          </div>
        </section>
      </main>

      <footer className="ygw-ft">
        <p>{t.footer} <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">{t.footerLink}</a> {t.footerEnd}</p>
      </footer>
    </div>
  );
}
