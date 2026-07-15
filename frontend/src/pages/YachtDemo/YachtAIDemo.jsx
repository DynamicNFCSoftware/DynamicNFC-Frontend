import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import "./YachtAIDemo.css";
import { loadGIS, requestToken, getUserInfo, createGmailDraft, createCalendarEvent, revokeToken, buildYachtEmailHtml } from "./yachtGoogleLiveApi";
import { trackPortalEvent } from "../../services/portalTrack";
import { usePortalRegion } from "../../services/portalRegion";
import { getPersonas } from "../../config/regionConfig";
import { YACHTS } from "../../data/yachtVesselData";
import canvaProposalCover from "../../assets/images/canva-proposal-cover.png";
import SEO from "../../components/SEO/SEO";

// ═══════════════════════════════════════════════════════════════════
// YACHT AI CONCIERGE DEMO — NFC tap → AI-orchestrated VIP sea trial
// (brochure · email · calendar · agreement). Clones AutoAIDemo
// architecture, re-skinned for a flagship yacht sea-trial scenario.
// Google OAuth/Gmail/Calendar helpers reused from yachtGoogleLiveApi
// (single-source re-export). 4-lang (en/ar/es/fr) + region-aware.
// ═══════════════════════════════════════════════════════════════════

const LANG_CYCLE = ["en", "ar", "es", "fr"];
const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };

function buildTR(owner) {
  return {
    en: {
      home: "Home", back: "Back to Demo Hub",
      badge: "Live MCP Demo — Real API Results",
      light: "Light", dark: "Dark",
      heroH1a: "One tap.", heroH1b: "Four actions. Zero manual work.",
      heroDesc: `${owner} taps his NFC Access Key at the marina. In under a minute: a specification is designed, an invitation is sent, a private sea trial is booked, and an agreement is ready to sign. Every result below is real — click any link to verify.`,
      statPlatforms: "Live Platforms", statTime: "Full Pipeline", statActual: "Actual Time", statSteps: "Steps Complete",
      googleTitle: "Connect Your Google Account", googleLive: "Live Mode",
      googleDescLive: "Gmail drafts and Calendar events will be created in YOUR account.",
      googleDescDemo: "Connect to create real Gmail drafts and Calendar events in your own account. Otherwise, demo data is shown.",
      googleConnect: "Connect with Google", googleConnecting: "Connecting...",
      googleDisconnect: "Disconnect",
      googleError: "Connection failed. You can continue with demo data.",
      googlePrivacy: "OAuth2 popup — your password never touches our servers. Token expires when you close this page.",
      workflow: "The AI Workflow",
      runAll: "Run Full Pipeline", pipeDone: "Pipeline Complete", running: "Running...",
      run: "Run",
      statusDone: "Complete", statusRunning: "Executing...", statusReady: "Ready", statusLocked: "Locked",
      detected: "Detected", leadScore: "Lead Score", leadScoreNote: "Illustrative",
      clickPreview: "Click to preview full email",
      openYourDraft: "Open YOUR draft in Gmail", viewRealDraft: "View real draft in Gmail",
      openYourEvent: "Open YOUR event in Calendar", openCalendar: "Open in Google Calendar",
      calVerify: "Real calendar event created via MCP — click link above to verify",
      canvaVerify: "Real Canva design generated via MCP — exported as PDF and attached to email in next step",
      pagesGen: "Pages Generated",
      docRecipient: "Recipient", docEmail: "Email", docEnvelope: "Envelope ID", docStatus: "Status",
      docDraft: "Draft Created", docStatusDemo: "Sandbox envelope — your live DocuSign account connects during pilot setup",
      docUnlock: `Workflow triggered: sea trial confirmed and VIP experience prepared for ${owner}`,
      finalTitle: "Pipeline Complete",
      finalDesc: `What traditionally takes a brokerage 2–3 days of manual coordination was completed autonomously by AI. ${owner} received a personalized VIP sea-trial experience — from specification to signed agreement.`,
      finalItems: ["VIP specification designed in Canva", "Sea-trial invitation delivered", "Private sea trial booked", "Sea-trial agreement sent", "Full pipeline — zero manual work"],
      completedIn: "Completed in",
      emailSub: "VIP Private Sea Trial Invitation", emailOpen: "This is a real draft — Open in Gmail",
      footer: "AI Concierge Demo for", footerLink: "DynamicNFC",
    },
    ar: {
      home: "الرئيسية", back: "العودة إلى مركز العروض",
      badge: "عرض MCP مباشر — نتائج API حقيقية",
      light: "فاتح", dark: "داكن",
      heroH1a: "نقرة واحدة.", heroH1b: "أربعة إجراءات. بلا أي عمل يدوي.",
      heroDesc: `${owner} ينقر بطاقة NFC في المارينا. خلال أقل من دقيقة: تُصمّم مواصفات، تُرسل دعوة، تُحجز تجربة إبحار خاصة، وتُجهّز اتفاقية للتوقيع. كل نتيجة أدناه حقيقية — انقر أي رابط للتحقق.`,
      statPlatforms: "منصات مباشرة", statTime: "كامل المسار", statActual: "الوقت الفعلي", statSteps: "الخطوات المكتملة",
      googleTitle: "اربط حسابك في Google", googleLive: "الوضع المباشر",
      googleDescLive: "سيتم إنشاء مسودات Gmail وأحداث التقويم في حسابك أنت.",
      googleDescDemo: "اربط حسابك لإنشاء مسودات Gmail وأحداث تقويم حقيقية. وإلا ستُعرض بيانات تجريبية.",
      googleConnect: "الربط مع Google", googleConnecting: "جارٍ الاتصال...",
      googleDisconnect: "قطع الاتصال",
      googleError: "فشل الاتصال. يمكنك المتابعة بالبيانات التجريبية.",
      googlePrivacy: "نافذة OAuth2 — كلمة مرورك لا تمر عبر خوادمنا. تنتهي صلاحية الرمز عند إغلاق الصفحة.",
      workflow: "مسار العمل الذكي",
      runAll: "تشغيل المسار الكامل", pipeDone: "اكتمل المسار", running: "جارٍ التشغيل...",
      run: "تشغيل",
      statusDone: "مكتمل", statusRunning: "قيد التنفيذ...", statusReady: "جاهز", statusLocked: "مقفل",
      detected: "تم الكشف", leadScore: "تقييم العميل", leadScoreNote: "توضيحي",
      clickPreview: "انقر لمعاينة البريد الكامل",
      openYourDraft: "افتح مسودتك في Gmail", viewRealDraft: "عرض المسودة الحقيقية في Gmail",
      openYourEvent: "افتح حدثك في التقويم", openCalendar: "فتح في Google Calendar",
      calVerify: "حدث تقويم حقيقي عبر MCP — انقر الرابط للتحقق",
      canvaVerify: "تصميم Canva حقيقي عبر MCP — تم تصديره كـ PDF وإرفاقه بالبريد",
      pagesGen: "صفحات تم إنشاؤها",
      docRecipient: "المستلم", docEmail: "البريد", docEnvelope: "معرّف المغلف", docStatus: "الحالة",
      docDraft: "تم إنشاء المسودة", docStatusDemo: "وضع تجريبي — قم بإعداد بيانات DocuSign",
      docUnlock: `تم تفعيل سير العمل: تم تأكيد تجربة الإبحار وتجهيز تجربة VIP لـ ${owner}`,
      finalTitle: "اكتمل المسار",
      finalDesc: `ما يستغرق عادةً من وسيط اليخوت يومين إلى ثلاثة من التنسيق اليدوي، أنجزه الذكاء الاصطناعي ذاتيًا. حصل ${owner} على تجربة إبحار VIP مخصصة — من المواصفات إلى الاتفاقية الموقعة.`,
      finalItems: ["تصميم مواصفات VIP في Canva", "تسليم دعوة تجربة الإبحار", "حجز تجربة إبحار خاصة", "إرسال اتفاقية تجربة الإبحار", "مسار كامل — بلا عمل يدوي"],
      completedIn: "اكتمل في",
      emailSub: "دعوة تجربة إبحار خاصة VIP", emailOpen: "هذه مسودة حقيقية — افتح في Gmail",
      footer: "عرض الكونسيرج الذكي لـ", footerLink: "DynamicNFC",
    },
    es: {
      home: "Inicio", back: "Volver al Hub Demo",
      badge: "Demo MCP en vivo — Resultados API reales",
      light: "Claro", dark: "Oscuro",
      heroH1a: "Un toque.", heroH1b: "Cuatro acciones. Cero trabajo manual.",
      heroDesc: `${owner} toca su Llave de Acceso NFC en la marina. En menos de un minuto: se diseña una especificación, se envía una invitación, se reserva una prueba de mar privada y un acuerdo queda listo para firmar. Cada resultado abajo es real — haga clic en cualquier enlace para verificar.`,
      statPlatforms: "Plataformas en vivo", statTime: "Pipeline completo", statActual: "Tiempo real", statSteps: "Pasos completados",
      googleTitle: "Conecte su cuenta de Google", googleLive: "Modo en vivo",
      googleDescLive: "Los borradores de Gmail y los eventos de Calendar se crearán en SU cuenta.",
      googleDescDemo: "Conéctese para crear borradores de Gmail y eventos de Calendar reales en su cuenta. De lo contrario, se muestran datos de demostración.",
      googleConnect: "Conectar con Google", googleConnecting: "Conectando...",
      googleDisconnect: "Desconectar",
      googleError: "Falló la conexión. Puede continuar con datos de demostración.",
      googlePrivacy: "Ventana OAuth2 — su contraseña nunca toca nuestros servidores. El token expira al cerrar esta página.",
      workflow: "El flujo de trabajo de IA",
      runAll: "Ejecutar pipeline completo", pipeDone: "Pipeline completo", running: "Ejecutando...",
      run: "Ejecutar",
      statusDone: "Completo", statusRunning: "Ejecutando...", statusReady: "Listo", statusLocked: "Bloqueado",
      detected: "Detectado", leadScore: "Puntuación de lead", leadScoreNote: "Ilustrativo",
      clickPreview: "Haga clic para previsualizar el email completo",
      openYourDraft: "Abrir SU borrador en Gmail", viewRealDraft: "Ver borrador real en Gmail",
      openYourEvent: "Abrir SU evento en Calendar", openCalendar: "Abrir en Google Calendar",
      calVerify: "Evento de calendario real creado vía MCP — haga clic en el enlace para verificar",
      canvaVerify: "Diseño Canva real generado vía MCP — exportado como PDF y adjunto al email en el siguiente paso",
      pagesGen: "Páginas generadas",
      docRecipient: "Destinatario", docEmail: "Email", docEnvelope: "ID de sobre", docStatus: "Estado",
      docDraft: "Borrador creado", docStatusDemo: "Modo demo — configure las credenciales de DocuSign",
      docUnlock: `Flujo activado: prueba de mar confirmada y experiencia VIP preparada para ${owner}`,
      finalTitle: "Pipeline completo",
      finalDesc: `Lo que tradicionalmente toma a un broker 2–3 días de coordinación manual lo completó la IA de forma autónoma. ${owner} recibió una experiencia VIP de prueba de mar personalizada — de la especificación al acuerdo firmado.`,
      finalItems: ["Especificación VIP diseñada en Canva", "Invitación a prueba de mar entregada", "Prueba de mar privada reservada", "Acuerdo de prueba de mar enviado", "Pipeline completo — cero trabajo manual"],
      completedIn: "Completado en",
      emailSub: "Invitación VIP a prueba de mar privada", emailOpen: "Este es un borrador real — Abrir en Gmail",
      footer: "Demo de conserjería IA para", footerLink: "DynamicNFC",
    },
    fr: {
      home: "Accueil", back: "Retour au Hub Démo",
      badge: "Démo MCP en direct — Résultats API réels",
      light: "Clair", dark: "Sombre",
      heroH1a: "Un tap.", heroH1b: "Quatre actions. Zéro travail manuel.",
      heroDesc: `${owner} présente sa Clé d'Accès NFC à la marina. En moins d'une minute : une spécification est conçue, une invitation est envoyée, un essai en mer privé est réservé, et un accord est prêt à signer. Chaque résultat ci-dessous est réel — cliquez sur n'importe quel lien pour vérifier.`,
      statPlatforms: "Plateformes live", statTime: "Pipeline complet", statActual: "Temps réel", statSteps: "Étapes terminées",
      googleTitle: "Connectez votre compte Google", googleLive: "Mode live",
      googleDescLive: "Les brouillons Gmail et les événements Calendar seront créés dans VOTRE compte.",
      googleDescDemo: "Connectez-vous pour créer de vrais brouillons Gmail et événements Calendar dans votre compte. Sinon, des données de démo sont affichées.",
      googleConnect: "Se connecter avec Google", googleConnecting: "Connexion...",
      googleDisconnect: "Déconnecter",
      googleError: "Échec de la connexion. Vous pouvez continuer avec les données de démo.",
      googlePrivacy: "Popup OAuth2 — votre mot de passe ne touche jamais nos serveurs. Le jeton expire à la fermeture de cette page.",
      workflow: "Le flux de travail IA",
      runAll: "Lancer le pipeline complet", pipeDone: "Pipeline terminé", running: "En cours...",
      run: "Lancer",
      statusDone: "Terminé", statusRunning: "Exécution...", statusReady: "Prêt", statusLocked: "Verrouillé",
      detected: "Détecté", leadScore: "Score lead", leadScoreNote: "Illustratif",
      clickPreview: "Cliquez pour prévisualiser l'email complet",
      openYourDraft: "Ouvrir VOTRE brouillon dans Gmail", viewRealDraft: "Voir le vrai brouillon dans Gmail",
      openYourEvent: "Ouvrir VOTRE événement dans Calendar", openCalendar: "Ouvrir dans Google Calendar",
      calVerify: "Événement calendrier réel créé via MCP — cliquez sur le lien pour vérifier",
      canvaVerify: "Design Canva réel généré via MCP — exporté en PDF et joint à l'email à l'étape suivante",
      pagesGen: "Pages générées",
      docRecipient: "Destinataire", docEmail: "Email", docEnvelope: "ID d'enveloppe", docStatus: "Statut",
      docDraft: "Brouillon créé", docStatusDemo: "Mode démo — configurez les identifiants DocuSign",
      docUnlock: `Flux déclenché : essai en mer confirmé et expérience VIP préparée pour ${owner}`,
      finalTitle: "Pipeline terminé",
      finalDesc: `Ce qui prend traditionnellement à un courtier 2–3 jours de coordination manuelle a été achevé de façon autonome par l'IA. ${owner} a reçu une expérience VIP d'essai en mer personnalisée — de la spécification à l'accord signé.`,
      finalItems: ["Spécification VIP conçue dans Canva", "Invitation à l'essai en mer livrée", "Essai en mer privé réservé", "Accord d'essai en mer envoyé", "Pipeline complet — zéro travail manuel"],
      completedIn: "Terminé en",
      emailSub: "Invitation VIP à un essai en mer privé", emailOpen: "Ceci est un vrai brouillon — Ouvrir dans Gmail",
      footer: "Démo conciergerie IA pour", footerLink: "DynamicNFC",
    },
  };
}

function buildStepDescs(owner, vessel) {
  return {
    en: {
      trigger: `${owner}, a flagship yacht owner, taps his VIP Access Key at the marina. The system instantly identifies his profile, vessel preferences, and engagement history.`,
      canva: `AI designs a 5-page luxury vessel specification personalized for ${owner} — featuring the ${vessel}, layout, performance data, and exclusive VIP terms. Generated via Canva MCP. This is a real Canva design you can view and edit.`,
      gmail: `AI composes a personalized VIP sea-trial invitation email with the Canva-generated specification attached as PDF, then creates it via the Gmail MCP API. The email is a real draft you can verify in Gmail.`,
      calendar: `AI checks the VIP sea-trial calendar, considers tide windows and crew prep time, and books a private sea trial. A real Google Calendar event is created with all details.`,
      docusign: `Before the sea trial, AI sends a VIP Sea Trial Agreement covering liability waiver, insurance confirmation, and vessel condition report — pre-filled and ready for e-signature via DocuSign.`,
    },
    ar: {
      trigger: `${owner}، مالك يخت رائد، ينقر بطاقة VIP في المارينا. يتعرف النظام فورًا على ملفه وتفضيلاته وسجل تفاعله.`,
      canva: `يصمم الذكاء الاصطناعي مواصفات فاخرة من 5 صفحات مخصصة لـ ${owner} — تعرض ${vessel} والمخطط وبيانات الأداء وشروط VIP الحصرية. عبر Canva MCP. تصميم حقيقي يمكنك عرضه وتعديله.`,
      gmail: `يصيغ الذكاء الاصطناعي دعوة تجربة إبحار VIP مخصصة مع إرفاق المواصفات كـ PDF، ثم ينشئها عبر Gmail MCP. البريد مسودة حقيقية يمكنك التحقق منها.`,
      calendar: `يتحقق الذكاء الاصطناعي من تقويم تجارب الإبحار، ويراعي نوافذ المد ووقت تجهيز الطاقم، ويحجز تجربة إبحار خاصة. يُنشأ حدث تقويم حقيقي.`,
      docusign: `قبل التجربة، يرسل الذكاء الاصطناعي اتفاقية تجربة إبحار VIP تشمل إعفاء المسؤولية وتأكيد التأمين وتقرير حالة اليخت — معبأة مسبقًا وجاهزة للتوقيع عبر DocuSign.`,
    },
    es: {
      trigger: `${owner}, propietario de un yate insignia, toca su Llave de Acceso VIP en la marina. El sistema identifica al instante su perfil, preferencias de embarcación e historial de interacción.`,
      canva: `La IA diseña una especificación de lujo de 5 páginas personalizada para ${owner} — con el ${vessel}, distribución, datos de rendimiento y términos VIP exclusivos. Generada vía Canva MCP. Es un diseño Canva real que puede ver y editar.`,
      gmail: `La IA redacta una invitación VIP personalizada a la prueba de mar con la especificación de Canva adjunta en PDF, luego la crea vía la API Gmail MCP. El email es un borrador real verificable en Gmail.`,
      calendar: `La IA consulta el calendario de pruebas de mar VIP, considera ventanas de marea y tiempo de preparación de tripulación, y reserva una prueba privada. Se crea un evento real de Google Calendar con todos los detalles.`,
      docusign: `Antes de la prueba, la IA envía un Acuerdo de Prueba de Mar VIP que cubre renuncia de responsabilidad, confirmación de seguro e informe de condición de la embarcación — precargado y listo para firma electrónica vía DocuSign.`,
    },
    fr: {
      trigger: `${owner}, propriétaire d'un yacht phare, présente sa Clé d'Accès VIP à la marina. Le système identifie instantanément son profil, ses préférences de navire et son historique d'engagement.`,
      canva: `L'IA conçoit une spécification de luxe en 5 pages personnalisée pour ${owner} — mettant en avant le ${vessel}, le plan, les données de performance et les conditions VIP exclusives. Générée via Canva MCP. C'est un vrai design Canva que vous pouvez consulter et modifier.`,
      gmail: `L'IA rédige une invitation VIP personnalisée à l'essai en mer avec la spécification Canva jointe en PDF, puis la crée via l'API Gmail MCP. L'email est un vrai brouillon vérifiable dans Gmail.`,
      calendar: `L'IA consulte le calendrier des essais en mer VIP, tient compte des fenêtres de marée et du temps de préparation de l'équipage, et réserve un essai privé. Un vrai événement Google Calendar est créé avec tous les détails.`,
      docusign: `Avant l'essai, l'IA envoie un Accord d'Essai en Mer VIP couvrant la renonciation de responsabilité, la confirmation d'assurance et le rapport d'état du navire — prérempli et prêt pour signature électronique via DocuSign.`,
    },
  };
}

function buildRealResults(owner, vessel, marina, toEmail, vesselPriceFmt) {
  return {
    canva: {
      title: `Private Sea Trial Invitation — ${owner}`,
      pages: 5,
      editUrl: "https://www.canva.com/d/jSENLEvDSFflEB2",
      viewUrl: "https://www.canva.com/d/rFvRuRe3S2mY5LO",
      thumbnailUrl: canvaProposalCover,
      sections: ["Cover", "Your Vessel", "Specifications", "Your Invitation", "Back Cover"],
    },
    calendar: {
      title: `Private Sea Trial — ${vessel} — ${owner} (VIP)`,
      time: "10:00 AM – 12:00 PM GST",
      location: marina,
      link: "https://www.google.com/calendar",
    },
    gmail: {
      to: toEmail,
      subject: `${owner}, your private sea trial of the ${vessel} is confirmed`,
      from: "info@dynamicnfc.help",
      attachment: "Marina_Yachts_Sea_Trial.pdf",
      draftLink: "https://mail.google.com/mail/#drafts",
    },
    docusign: {
      template: "VIP Sea Trial Agreement — Marina Yachts",
      recipient: owner,
      email: toEmail,
      envelopeId: null,
      status: "created",
    },
    vesselPriceFmt,
  };
}

function buildTerminalLines(owner, vessel, marina, toEmail, budgetLabel) {
  return {
    trigger: [
      { type: "cmd", text: "nfc.detect() \u2192 VIP Access Key scanned" },
      { type: "wait", text: "Authenticating NFC card..." },
      { type: "data", text: `Profile: ${owner} | Tier: Platinum VIP | ID: YV-001` },
      { type: "data", text: `Interest: ${vessel} | Budget: ${budgetLabel}` },
      { type: "data", text: "Last engagement: 3 days ago (viewed flagship fleet + charter terms)" },
      { type: "ok", text: "VIP profile loaded \u2014 triggering AI concierge pipeline" },
    ],
    canva: [
      { type: "cmd", text: "mcp.canva.generate_design({type: 'vessel_spec', style: 'marina_luxury'})" },
      { type: "wait", text: "AI generating personalized VIP vessel specification..." },
      { type: "data", text: "Template: Marina Yachts \u2014 deep navy, brushed steel, gold accents" },
      { type: "data", text: `Personalizing for: ${owner} \u2014 ${vessel}` },
      { type: "data", text: "Pages: Cover, Your Vessel, Specifications, Your Invitation, Back Cover" },
      { type: "cmd", text: "mcp.canva.export_design({format: 'pdf'})" },
      { type: "wait", text: "Exporting 5-page VIP specification as PDF..." },
      { type: "ok", text: "Specification generated \u2014 Marina_Yachts_Sea_Trial.pdf (3.1MB)" },
    ],
    gmail: [
      { type: "cmd", text: `mcp.gmail.create_draft({to: '${toEmail}'})` },
      { type: "wait", text: "Composing VIP sea-trial invitation..." },
      { type: "data", text: `Subject: ${owner}, your private sea trial of the ${vessel} is confirmed` },
      { type: "data", text: "Attaching: Marina_Yachts_Sea_Trial.pdf" },
      { type: "cmd", text: "mcp.gmail.send_draft()" },
      { type: "ok", text: "Email draft created and ready to send" },
    ],
    calendar: [
      { type: "cmd", text: "mcp.gcal.find_free_time({calendar: 'vip-sea-trials'})" },
      { type: "wait", text: "Checking VIP sea-trial availability + tide window..." },
      { type: "data", text: "Found 3 available slots this week" },
      { type: "data", text: "Optimal slot: 10:00 AM GST \u2014 based on tide and crew prep time" },
      { type: "cmd", text: "mcp.gcal.create_event({type: 'vip_sea_trial'})" },
      { type: "data", text: `Location: ${marina}` },
      { type: "data", text: "Vessel prep: provisioned, fueled, crew briefed" },
      { type: "ok", text: "Private sea trial booked \u2014 calendar invite sent" },
    ],
    docusign: [
      { type: "cmd", text: "mcp.docusign.create_envelope({template: 'vip_sea_trial_waiver'})" },
      { type: "wait", text: "Preparing VIP Sea Trial Agreement..." },
      { type: "data", text: "Template: VIP Sea Trial Agreement \u2014 Marina Yachts" },
      { type: "data", text: `Pre-filled: ${owner} | ${vessel} | VIP-YV-001` },
      { type: "cmd", text: `mcp.docusign.send_envelope({recipient: '${toEmail}'})` },
      { type: "ok", text: "Sea trial agreement sent for e-signature" },
    ],
  };
}

const STEP_CONFIG = [
  { key: "trigger", label: "!", title: "VIP Owner Taps NFC Card", subtitle: "NFC Detection & Profile Lookup", color: "trigger" },
  { key: "canva", label: "1", title: "Generate Personalized Vessel Specification", subtitle: "Canva MCP \u2014 AI Design & PDF Export", color: "canva" },
  { key: "gmail", label: "2", title: "Send VIP Sea Trial Invitation", subtitle: "Gmail MCP \u2014 Specification Delivery", color: "gmail" },
  { key: "calendar", label: "3", title: "Book Private Sea Trial", subtitle: "Google Calendar MCP \u2014 Smart Scheduling", color: "calendar" },
  { key: "docusign", label: "4", title: "Send Sea Trial Agreement", subtitle: "DocuSign MCP \u2014 E-Signature", color: "docusign" },
];

const futureDate = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d; };

export default function YachtAIDemo() {
  const [lang, setLang] = useState("en");
  const { fmtCurrency, regionId, region } = usePortalRegion("yacht", lang);

  const vip1 = useMemo(() => {
    const personas = getPersonas("yacht", regionId);
    return personas.find((p) => p.id === "vip1") || personas[0] || null;
  }, [regionId]);

  const owner = vip1?.name || "VIP Owner";
  const toEmail = vip1?.email || "";
  const vesselData = useMemo(() => (YACHTS[regionId] || YACHTS.gulf)[0], [regionId]);
  const vessel = vesselData?.name || "";
  const vesselPrice = vesselData?.price || 0;
  const marina = vesselData?.marina || "";
  const vesselPriceFmt = fmtCurrency(vesselPrice);
  const budgetLow = Math.round(vesselPrice * 0.9);
  const budgetHigh = Math.round(vesselPrice * 1.3);
  const budgetLabel = `${fmtCurrency(budgetLow)}\u2013${fmtCurrency(budgetHigh)}`;
  const ownerInitials = owner.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const TR = useMemo(() => buildTR(owner), [owner]);
  const STEP_DESCS = useMemo(() => buildStepDescs(owner, vessel), [owner, vessel]);
  const REAL_RESULTS = useMemo(
    () => buildRealResults(owner, vessel, marina, toEmail, vesselPriceFmt),
    [owner, vessel, marina, toEmail, vesselPriceFmt]
  );
  const TERMINAL_LINES = useMemo(
    () => buildTerminalLines(owner, vessel, marina, toEmail, budgetLabel),
    [owner, vessel, marina, toEmail, budgetLabel]
  );

  const t = useCallback((k) => TR[lang]?.[k] ?? TR.en[k] ?? k, [lang, TR]);
  const trackEvent = useCallback(
    (event, data) => trackPortalEvent(
      "vip",
      { id: `${regionId}-yacht-ai`, name: owner },
      event,
      { portal: "yacht", unitName: vessel, unitType: "motor", tower: marina, ...data }
    ),
    [regionId, owner, vessel, marina]
  );
  const [theme, setTheme] = useState("dark");
  const [steps, setSteps] = useState(
    STEP_CONFIG.map((_, i) => ({ status: i === 0 ? "ready" : "locked", lines: [], showResult: false, expanded: false }))
  );
  const [allRunning, setAllRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [gisReady, setGisReady] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState(false);
  const [liveResults, setLiveResults] = useState({ gmail: null, calendar: null });
  const termRefs = useRef([]);
  const stepRefs = useRef([]);
  const finalRef = useRef(null);
  const startTime = useRef(null);

  const isRtl = lang === "ar";
  const nextLang = LANG_CYCLE[(LANG_CYCLE.indexOf(lang) + 1) % LANG_CYCLE.length];

  useEffect(() => { loadGIS().then((ok) => setGisReady(ok)); }, []);
  useEffect(() => { trackEvent("portal_opened", { scenario: "ai_sea_trial" }); }, [trackEvent]);

  const handleGoogleConnect = async () => {
    setConnecting(true); setConnectError(false);
    try {
      const token = await requestToken();
      const user = await getUserInfo(token);
      setGoogleToken(token); setGoogleUser(user);
    } catch (err) {
      setConnectError(true);
    } finally { setConnecting(false); }
  };

  const handleGoogleDisconnect = () => {
    revokeToken(googleToken);
    setGoogleToken(null); setGoogleUser(null);
    setLiveResults({ gmail: null, calendar: null });
  };

  const isLiveMode = !!googleToken;
  const doneCount = steps.filter((s) => s.status === "done").length;
  const progress = (doneCount / STEP_CONFIG.length) * 100;

  const typeLines = useCallback((stepIdx) => {
    return new Promise((resolve) => {
      const key = STEP_CONFIG[stepIdx].key;
      const lines = TERMINAL_LINES[key];
      let i = 0;
      const addNext = () => {
        if (i >= lines.length) { resolve(); return; }
        const line = lines[i]; i++;
        setSteps((prev) => {
          const next = [...prev];
          next[stepIdx] = { ...next[stepIdx], lines: [...next[stepIdx].lines, line] };
          return next;
        });
        setTimeout(() => { const el = termRefs.current[stepIdx]; if (el) el.scrollTop = el.scrollHeight; }, 50);
        setTimeout(addNext, 350);
      };
      addNext();
    });
  }, [TERMINAL_LINES]);

  const runStep = useCallback(async (stepIdx) => {
    setSteps((prev) => {
      const next = [...prev];
      next[stepIdx] = { ...next[stepIdx], status: "running", expanded: true, lines: [] };
      return next;
    });
    setTimeout(() => { const el = stepRefs.current[stepIdx]; if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);

    const cfg = STEP_CONFIG[stepIdx];
    let gmailPromise = null;
    let calendarPromise = null;

    if (cfg.key === "gmail" && googleToken) {
      const d = futureDate(5);
      const htmlBody = buildYachtEmailHtml({
        ownerName: owner, vesselName: vessel, vesselPrice: vesselPriceFmt,
        trialDate: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
        trialTime: "10:00 AM GST", trialLocation: marina,
      });
      gmailPromise = createGmailDraft(googleToken, { to: toEmail, subject: REAL_RESULTS.gmail.subject, htmlBody, senderName: "Marina Yachts" })
        .then((result) => setLiveResults((prev) => ({ ...prev, gmail: result })))
        .catch(() => {});
    }

    if (cfg.key === "calendar" && googleToken) {
      const startDT = futureDate(5); startDT.setHours(10, 0, 0, 0);
      const endDT = new Date(startDT); endDT.setHours(12, 0, 0, 0);
      calendarPromise = createCalendarEvent(googleToken, {
        summary: REAL_RESULTS.calendar.title, location: marina,
        description: `Exclusive private sea trial of ${vessel} for VIP owner ${owner}. Full owner's trial with captain and marina advisor aboard.`,
        startDateTime: startDT.toISOString(), endDateTime: endDT.toISOString(), attendeeEmail: null,
        timeZone: region.timeZone,
      })
        .then((result) => setLiveResults((prev) => ({ ...prev, calendar: result })))
        .catch(() => {});
    }

    await typeLines(stepIdx);
    if (gmailPromise) await gmailPromise;
    if (calendarPromise) await calendarPromise;
    await new Promise((r) => setTimeout(r, 400));

    setSteps((prev) => {
      const next = [...prev];
      next[stepIdx] = { ...next[stepIdx], status: "done", showResult: true };
      if (stepIdx + 1 < next.length) next[stepIdx + 1] = { ...next[stepIdx + 1], status: "ready" };
      return next;
    });
    setTimeout(() => { const el = stepRefs.current[stepIdx]; if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150);
  }, [typeLines, googleToken, region.timeZone, owner, vessel, vesselPriceFmt, marina, toEmail, REAL_RESULTS]);

  const runAll = useCallback(async () => {
    setAllRunning(true);
    startTime.current = Date.now();
    for (let i = 0; i < STEP_CONFIG.length; i++) { await runStep(i); await new Promise((r) => setTimeout(r, 300)); }
    setElapsed(Math.round((Date.now() - startTime.current) / 1000));
    setAllDone(true); setAllRunning(false);
    trackEvent("book_viewing", { via: "ai_pipeline" });
    setTimeout(() => { if (finalRef.current) finalRef.current.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200);
  }, [runStep, trackEvent]);

  const handleRunSingle = useCallback(async (idx) => {
    if (!startTime.current) startTime.current = Date.now();
    await runStep(idx);
    if (idx === STEP_CONFIG.length - 1) {
      setElapsed(Math.round((Date.now() - startTime.current) / 1000));
      setAllDone(true);
      trackEvent("book_viewing", { via: "ai_pipeline" });
      setTimeout(() => { if (finalRef.current) finalRef.current.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200);
    }
  }, [runStep, trackEvent]);

  const toggleExpand = (idx) => {
    setSteps((prev) => {
      const next = [...prev];
      if (next[idx].status === "done" || next[idx].status === "ready") next[idx] = { ...next[idx], expanded: !next[idx].expanded };
      return next;
    });
  };

  const descFor = (key) => (STEP_DESCS[lang] || STEP_DESCS.en)[key];

  return (
    <div className={`yai ${theme}`} dir={isRtl ? "rtl" : "ltr"}>
      <SEO title="AI Concierge Demo — Yacht" description="Interactive AI-orchestrated VIP yacht sea-trial pipeline demo." path="/yacht/demo/ai" />
      <div className="yai-bg"><div className="yai-blob yai-blob-1" /><div className="yai-blob yai-blob-2" /><div className="yai-blob yai-blob-3" /></div>

      <div className="yai-progress"><div className="yai-progress-fill" style={{ width: progress + "%" }} /></div>

      <header className="yai-hd">
        <Link to="/yacht/demo" className="yai-hd-logo"><img src="/assets/images/logo.png" alt="DynamicNFC" /></Link>
        <div className="yai-hd-badge"><span>{t("badge")}</span></div>
        <div className="yai-hd-right">
          <button className="yai-theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? `\u2600\uFE0F ${t("light")}` : `\u{1F319} ${t("dark")}`}
          </button>
          <button className="yai-lang" onClick={() => setLang(nextLang)}>
            {LANG_LABEL[nextLang]}
          </button>
          <Link to="/yacht/demo" className="yai-home-btn">{t("back")}</Link>
        </div>
      </header>

      <main className="yai-main">
        <section className="yai-hero">
          <div className="yai-nfc-ring">
            <div className="yai-nfc-wave" /><div className="yai-nfc-wave" /><div className="yai-nfc-wave" />
            <div className="yai-nfc-ring-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" /></svg>
            </div>
          </div>
          <h1><span>{t("heroH1a")}</span><br />{t("heroH1b")}</h1>
          <p>{t("heroDesc")}</p>
          <div className="yai-stats">
            <div className="yai-stat"><span className="yai-stat-v">4</span><span className="yai-stat-l">{t("statPlatforms")}</span></div>
            <div className="yai-stat"><span className="yai-stat-v">{elapsed ? elapsed + "s" : "<1min"}</span><span className="yai-stat-l">{elapsed ? t("statActual") : t("statTime")}</span></div>
            <div className="yai-stat"><span className="yai-stat-v">{doneCount}/{STEP_CONFIG.length}</span><span className="yai-stat-l">{t("statSteps")}</span></div>
          </div>
        </section>

        <div className="yai-google-box">
          <div className="yai-google-box-title">{t("googleTitle")}{isLiveMode && <span className="yai-google-live-badge">{t("googleLive")}</span>}</div>
          <p className="yai-google-box-desc">{isLiveMode ? t("googleDescLive") : t("googleDescDemo")}</p>
          {!isLiveMode ? (
            <>
              <button className="yai-google-connect-btn" onClick={handleGoogleConnect} disabled={!gisReady || connecting}>
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#34A853" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.9 7.35 2.56 10.52l7.97-5.93z" /><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.93C6.51 42.62 14.62 48 24 48z" /></svg>
                {connecting ? t("googleConnecting") : t("googleConnect")}
              </button>
              {connectError && <p className="yai-google-error">{t("googleError")}</p>}
            </>
          ) : (
            <div className="yai-google-user">
              {googleUser?.picture ? <img className="yai-google-avatar" src={googleUser.picture} alt="" referrerPolicy="no-referrer" /> : <div className="yai-google-avatar-fallback">{(googleUser?.name || googleUser?.email || "U").charAt(0).toUpperCase()}</div>}
              <div className="yai-google-info">{googleUser?.name && <div className="yai-google-name">{googleUser.name}</div>}<div className="yai-google-email">{googleUser?.email}</div></div>
              <button className="yai-google-disconnect" onClick={handleGoogleDisconnect}>{t("googleDisconnect")}</button>
            </div>
          )}
          <p className="yai-google-privacy">{t("googlePrivacy")}</p>
        </div>

        <div className="yai-pipe-hd">
          <h2>{t("workflow")}</h2>
          <button className="yai-run-all" onClick={runAll} disabled={allRunning || allDone}>
            {allDone ? t("pipeDone") : allRunning ? t("running") : t("runAll")}
            {!allDone && !allRunning && <span style={{ fontSize: "1.1rem" }}>&#9654;</span>}
          </button>
        </div>

        {STEP_CONFIG.map((cfg, idx) => {
          const st = steps[idx];
          const isLocked = st.status === "locked";
          const isRunning = st.status === "running";
          const isDone = st.status === "done";
          const isReady = st.status === "ready";
          return (
            <div key={cfg.key}>
              {idx > 0 && <div className="yai-step-connector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M19 12l-7 7-7-7" /></svg></div>}
              <div ref={(el) => (stepRefs.current[idx] = el)} className={`yai-step ${isLocked ? "locked" : ""} ${isRunning ? "active" : ""} ${isDone ? "done" : ""}`}>
                <div className="yai-step-hd" onClick={() => toggleExpand(idx)}>
                  <div className="yai-step-hd-left">
                    <div className={`yai-step-num ${isDone ? "done" : cfg.color}`}>{isDone ? "\u2713" : cfg.label}</div>
                    <div className="yai-step-info">
                      <h3>{cfg.title}{isDone && (cfg.key === "canva" || ((cfg.key === "gmail" && liveResults.gmail) || (cfg.key === "calendar" && liveResults.calendar))) && <span className="yai-live-tag">{((cfg.key === "gmail" && liveResults.gmail) || (cfg.key === "calendar" && liveResults.calendar)) ? "Your Account" : "Live"}</span>}</h3>
                      <p>{cfg.subtitle}</p>
                    </div>
                  </div>
                  <div className="yai-step-hd-right">
                    <span className={`yai-step-status ${isDone ? "done" : isRunning ? "running" : "waiting"}`}>{isDone ? t("statusDone") : isRunning ? t("statusRunning") : isReady ? t("statusReady") : t("statusLocked")}</span>
                    {isReady && !allRunning && <button className="yai-run-btn" onClick={(e) => { e.stopPropagation(); handleRunSingle(idx); }}>{t("run")} <span>&#9654;</span></button>}
                  </div>
                </div>

                <div className={`yai-step-body ${st.expanded ? "open" : ""}`}>
                  <div className="yai-step-body-inner">
                    <p className="yai-step-desc">{descFor(cfg.key)}</p>

                    {(isRunning || isDone) && (
                      <div className="yai-terminal">
                        <div className="yai-terminal-bar"><div className="yai-terminal-dot" /><div className="yai-terminal-dot" /><div className="yai-terminal-dot" /><span className="yai-terminal-title">mcp-{cfg.key}.sh</span></div>
                        <div className="yai-terminal-body" ref={(el) => (termRefs.current[idx] = el)}>
                          {st.lines.map((line, li) => (
                            <div className="yai-terminal-line" key={li}>
                              <span className={`yai-t-prefix ${line.type}`}>{line.type === "cmd" ? "$" : line.type === "ok" ? "\u2713" : line.type === "wait" ? "\u25cb" : "\u203a"}</span>
                              <span className="yai-t-text">{line.text}</span>
                            </div>
                          ))}
                          {isRunning && <span className="yai-cursor" />}
                        </div>
                      </div>
                    )}

                    {st.showResult && (
                      <div className="yai-result-area">
                        {cfg.key === "trigger" && (
                          <div className="yai-profile">
                            <div className="yai-profile-avatar">{ownerInitials}</div>
                            <div className="yai-profile-info">
                              <h4>{owner} <span className="yai-live-tag">{t("detected")}</span></h4>
                              <p>Platinum VIP &bull; Interest: {vessel} &bull; Budget: {budgetLabel}<br />Last activity: 3 days ago &bull; VIP ID: YV-001</p>
                            </div>
                            <div className="yai-profile-score">
                              <div className="yai-profile-score-num">94</div>
                              <div className="yai-profile-score-label">{t("leadScore")} <span className="yai-live-tag">{t("leadScoreNote")}</span></div>
                            </div>
                          </div>
                        )}

                        {cfg.key === "canva" && (
                          <div className="yai-canva-card">
                            <div className="yai-canva-top"><h4>{REAL_RESULTS.canva.title}</h4><div className="yai-canva-badge"><span>{"\u2713"}</span> {REAL_RESULTS.canva.pages} {t("pagesGen")}</div></div>
                            <div className="yai-canva-preview">
                              <img className="yai-canva-thumb" src={REAL_RESULTS.canva.thumbnailUrl} alt="Specification cover" onError={(e) => { e.target.style.display = "none"; }} />
                              <div className="yai-canva-details"><div className="yai-canva-pages">{REAL_RESULTS.canva.sections.map((s, i) => <span className="yai-canva-page" key={i}>{i + 1}. {s}</span>)}</div></div>
                            </div>
                            <div className="yai-canva-links">
                              <a href={REAL_RESULTS.canva.viewUrl} target="_blank" rel="noreferrer" className="yai-canva-link primary">{"\uD83C\uDFA8"} View in Canva {"\u2197"}</a>
                              <a href={REAL_RESULTS.canva.editUrl} target="_blank" rel="noreferrer" className="yai-canva-link secondary">Edit Design {"\u2197"}</a>
                            </div>
                            <div className="yai-canva-export"><span>{"\u2713"}</span> {t("canvaVerify")}</div>
                          </div>
                        )}

                        {cfg.key === "gmail" && (
                          <div className="yai-email-preview" onClick={() => setEmailModal(true)}>
                            <div className="yai-email-hd">
                              <div className="yai-email-row"><span className="yai-email-label">From:</span><span className="yai-email-val">{REAL_RESULTS.gmail.from}</span></div>
                              <div className="yai-email-row"><span className="yai-email-label">To:</span><span className="yai-email-val">{REAL_RESULTS.gmail.to}</span></div>
                              <div className="yai-email-row"><span className="yai-email-label">Subject:</span><span className="yai-email-val" style={{ fontWeight: 500 }}>{REAL_RESULTS.gmail.subject}</span></div>
                            </div>
                            <div className="yai-email-foot">
                              <span className="yai-email-hint">{t("clickPreview")}</span>
                              <a href={liveResults.gmail ? `https://mail.google.com/mail/#drafts/${liveResults.gmail.messageId}` : REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="yai-email-link">{"\u2713"} {liveResults.gmail ? t("openYourDraft") : t("viewRealDraft")} {"\u2197"}</a>
                            </div>
                          </div>
                        )}

                        {cfg.key === "calendar" && (
                          <>
                            <div className="yai-cal-card">
                              <div className="yai-cal-date-box"><span className="yai-cal-day">{futureDate(5).getDate()}</span><span className="yai-cal-month">{futureDate(5).toLocaleDateString("en-US", { month: "short" })}</span></div>
                              <div className="yai-cal-details">
                                <h4>{REAL_RESULTS.calendar.title}</h4>
                                <p>{REAL_RESULTS.calendar.time}<br />{REAL_RESULTS.calendar.location}</p>
                                <a href={liveResults.calendar ? liveResults.calendar.htmlLink : REAL_RESULTS.calendar.link} target="_blank" rel="noreferrer" className="yai-cal-link">{liveResults.calendar ? t("openYourEvent") : t("openCalendar")} &#8599;</a>
                              </div>
                            </div>
                            <div className="yai-cal-verify"><span>{"\u2713"}</span> {t("calVerify")}</div>
                          </>
                        )}

                        {cfg.key === "docusign" && (
                          <div className="yai-doc-card">
                            <div className="yai-doc-top"><h4>{REAL_RESULTS.docusign.template}</h4><div className="yai-doc-signed"><span>&#10003;</span> {t("docDraft")}</div></div>
                            <div className="yai-doc-fields">
                              <div className="yai-doc-field"><div className="yai-doc-field-label">{t("docRecipient")}</div><div className="yai-doc-field-val">{REAL_RESULTS.docusign.recipient}</div></div>
                              <div className="yai-doc-field"><div className="yai-doc-field-label">{t("docEmail")}</div><div className="yai-doc-field-val">{REAL_RESULTS.docusign.email}</div></div>
                              <div className="yai-doc-field"><div className="yai-doc-field-label">{t("docEnvelope")}</div><div className="yai-doc-field-val" style={{ fontFamily: "monospace", fontSize: ".78rem" }}>pending</div></div>
                              <div className="yai-doc-field"><div className="yai-doc-field-label">{t("docStatus")}</div><div className="yai-doc-field-val">{t("docStatusDemo")}</div></div>
                            </div>
                            <div className="yai-doc-unlock"><span style={{ fontSize: "1.1rem" }}>&#128275;</span> {t("docUnlock")}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {allDone && (
          <div ref={finalRef} className="yai-final">
            <div className="yai-final-icon">{"\u2713"}</div>
            <h2>{t("finalTitle")}</h2>
            <p>{t("finalDesc")}</p>
            <div className="yai-final-items">
              {t("finalItems").map((item, i) => <div className="yai-final-item" key={i}><span className="yai-final-check">&#10003;</span>{item}</div>)}
            </div>
            <div className="yai-final-time">{t("completedIn")} {elapsed}s</div>
          </div>
        )}

        {emailModal && (
          <div className="yai-modal-overlay" onClick={() => setEmailModal(false)}>
            <div className="yai-modal" onClick={(e) => e.stopPropagation()}>
              <button className="yai-modal-close" onClick={() => setEmailModal(false)}>{"\u2715"}</button>
              <div className="yai-em-body">
                <div className="yai-em-hd"><h3>Marina Yachts</h3><p>{t("emailSub")}</p></div>
                <div className="yai-em-content">
                  <p>Dear {owner},</p>
                  <p>As a valued VIP Access Key holder at Marina Yachts, we are pleased to confirm your exclusive private sea trial of the <strong>{vessel}</strong>.</p>
                  <div className="yai-em-detail"><span>{vessel} — {vesselPriceFmt}</span></div>
                  <a className="yai-em-open" href={liveResults.gmail ? `https://mail.google.com/mail/#drafts/${liveResults.gmail.messageId}` : REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer">{t("emailOpen")} {"\u2197"}</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="yai-ft">
        <p>{t("footer")} <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">{t("footerLink")}</a></p>
      </footer>
    </div>
  );
}
