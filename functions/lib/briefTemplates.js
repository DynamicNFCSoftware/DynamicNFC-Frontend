"use strict";

const VIP_SIGNAL_TEMPLATES = {
  en: {
    rising:
      "{name} tapped {tapCount} times in the last {hoursAgo} hours - {firstAction}. Score now {score} (was {prevScore} yesterday). {tone}",
    cooling:
      "{name} has gone {silentDays} days without activity. Last action: {lastAction}. Score dropped from {prevScore} to {score}. {tone}",
    plateau:
      "{name} continues steady activity - {tapCount} taps this week with no major behavior change. Score remains {score}.",
  },
  ar: {
    rising:
      "{name} قام بالنقر {tapCount} مرات خلال آخر {hoursAgo} ساعات - {firstAction}. الدرجة الآن {score} (كانت {prevScore} أمس). {tone}",
    cooling:
      "{name} لم يظهر نشاطًا منذ {silentDays} أيام. آخر إجراء: {lastAction}. انخفضت الدرجة من {prevScore} إلى {score}. {tone}",
    plateau:
      "{name} يحافظ على نشاط ثابت - {tapCount} نقرات هذا الأسبوع بدون تغيّر سلوكي كبير. الدرجة مستقرة عند {score}.",
  },
  es: {
    rising:
      "{name} realizó {tapCount} toques en las últimas {hoursAgo} horas - {firstAction}. Su score ahora es {score} (ayer era {prevScore}). {tone}",
    cooling:
      "{name} lleva {silentDays} días sin actividad. Última acción: {lastAction}. El score bajó de {prevScore} a {score}. {tone}",
    plateau:
      "{name} mantiene actividad estable - {tapCount} toques esta semana sin nuevas señales clave. El score se mantiene en {score}.",
  },
  fr: {
    rising:
      "{name} a effectué {tapCount} interactions au cours des {hoursAgo} dernières heures - {firstAction}. Le score est à {score} (contre {prevScore} hier). {tone}",
    cooling:
      "{name} est sans activité depuis {silentDays} jours. Dernière action: {lastAction}. Le score est passé de {prevScore} à {score}. {tone}",
    plateau:
      "{name} maintient une activité stable - {tapCount} interactions cette semaine sans nouveau signal majeur. Score maintenu à {score}.",
  },
};

const TONE_PHRASES = {
  en: {
    rising: ["Strong buying signal, no rep contact yet.", "Concentrated interest pattern.", "Interest velocity is accelerating."],
    cooling: ["Cooling rapidly - re-engagement needed.", "Interest is fading, intervention recommended."],
    plateau: ["Stable interest profile.", "Steady consideration mode."],
  },
  ar: {
    rising: ["إشارة شراء قوية دون تواصل من المندوب حتى الآن.", "نمط اهتمام مركز وواضح.", "سرعة الاهتمام تتسارع."],
    cooling: ["الاهتمام يبرد بسرعة - يلزم إعادة التفاعل.", "الاهتمام يتراجع ويوصى بالتدخل."],
    plateau: ["ملف اهتمام مستقر.", "نمط دراسة ثابت."],
  },
  es: {
    rising: ["Señal de compra fuerte sin contacto comercial todavía.", "Patrón de interés concentrado.", "La velocidad de interés está aumentando."],
    cooling: ["El interés se enfría rápido; se requiere reactivación.", "El interés se está perdiendo, se recomienda intervención."],
    plateau: ["Perfil de interés estable.", "Modo de evaluación constante."],
  },
  fr: {
    rising: ["Signal d'achat fort sans contact commercial pour le moment.", "Pattern d'intérêt concentré.", "La vitesse d'intérêt s'accélère."],
    cooling: ["Refroidissement rapide - relance recommandée.", "L'intérêt diminue, une intervention est recommandée."],
    plateau: ["Profil d'intérêt stable.", "Mode d'évaluation constant."],
  },
};

const PIPELINE_DELTA_TEMPLATES = {
  en: "Pipeline added {pipelineDelta} in qualified value today across {newVipCount} new VIPs. Marketplace traffic moved {trafficDelta}% and {anonVisitors} anonymous visitors spent meaningful time on {topUnit}.",
  ar: "أضاف خط الأنابيب اليوم قيمة مؤهلة قدرها {pipelineDelta} عبر {newVipCount} من كبار الشخصيات الجدد. تحركت زيارات السوق بنسبة {trafficDelta}% وقضى {anonVisitors} زائرًا مجهولًا وقتًا ملحوظًا على {topUnit}.",
  es: "El pipeline añadió hoy {pipelineDelta} en valor calificado con {newVipCount} nuevos VIP. El tráfico del marketplace varió {trafficDelta}% y {anonVisitors} visitantes anónimos pasaron tiempo relevante en {topUnit}.",
  fr: "Le pipeline a ajouté aujourd'hui {pipelineDelta} de valeur qualifiée avec {newVipCount} nouveaux VIP. Le trafic marketplace a évolué de {trafficDelta}% et {anonVisitors} visiteurs anonymes ont passé du temps qualifié sur {topUnit}.",
};

const CHIP_LABELS = {
  en: {
    atRisk: "{count} alerts at risk",
    hotLeads: "{count} hot leads new",
    overdue: "{count} follow-up overdue",
  },
  ar: {
    atRisk: "{count} تنبيهات معرضة للخطر",
    hotLeads: "{count} عملاء ساخنون جدد",
    overdue: "{count} متابعات متأخرة",
  },
  es: {
    atRisk: "{count} alertas en riesgo",
    hotLeads: "{count} leads calientes nuevos",
    overdue: "{count} seguimientos vencidos",
  },
  fr: {
    atRisk: "{count} alertes à risque",
    hotLeads: "{count} leads chauds nouveaux",
    overdue: "{count} suivis en retard",
  },
};

function fill(template, payload) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(payload[key] ?? ""));
}

function chooseTone(mode, lang) {
  const pool = TONE_PHRASES[lang]?.[mode] || TONE_PHRASES.en[mode] || [""];
  return pool[0] || "";
}

function computeChips({ alerts = {}, lang = "en" }) {
  const dictionary = CHIP_LABELS[lang] || CHIP_LABELS.en;
  const chips = [];
  if ((alerts.atRisk || 0) > 0) {
    chips.push({ label: fill(dictionary.atRisk, { count: alerts.atRisk }), tone: "red" });
  }
  if ((alerts.hotLeadsNew || 0) > 0) {
    chips.push({ label: fill(dictionary.hotLeads, { count: alerts.hotLeadsNew }), tone: "green" });
  }
  if ((alerts.followUpsOverdue || 0) > 0) {
    chips.push({ label: fill(dictionary.overdue, { count: alerts.followUpsOverdue }), tone: "amber" });
  }
  return chips;
}

function generateBriefFromTemplate({ topVip = {}, pipelineDelta = {}, marketplaceTraffic = {}, alerts = {}, lang = "en" }) {
  const language = VIP_SIGNAL_TEMPLATES[lang] ? lang : "en";
  const mode = topVip.mode || "plateau";
  const vipTemplate = VIP_SIGNAL_TEMPLATES[language][mode] || VIP_SIGNAL_TEMPLATES.en.plateau;
  const pipelineTemplate = PIPELINE_DELTA_TEMPLATES[language] || PIPELINE_DELTA_TEMPLATES.en;

  const paragraph1 = fill(vipTemplate, {
    name: topVip.name || "Top VIP",
    tapCount: topVip.tapCount ?? 0,
    hoursAgo: topVip.hoursAgo ?? 24,
    firstAction: topVip.firstAction || "reviewed premium listing details",
    score: topVip.score ?? 0,
    prevScore: topVip.prevScore ?? 0,
    silentDays: topVip.silentDays ?? 0,
    lastAction: topVip.lastAction || "none",
    tone: chooseTone(mode, language),
  });

  const paragraph2 = fill(pipelineTemplate, {
    pipelineDelta: pipelineDelta.pipelineDelta || "$0",
    newVipCount: pipelineDelta.newVipCount ?? 0,
    trafficDelta: marketplaceTraffic.trafficDelta ?? 0,
    anonVisitors: marketplaceTraffic.anonVisitors ?? 0,
    topUnit: marketplaceTraffic.topUnit || "your top listing",
  });

  return {
    paragraph1,
    paragraph2,
    chips: computeChips({ alerts, lang: language }),
    source: "template",
    generatedAt: Date.now(),
    lang: language,
  };
}

module.exports = { generateBriefFromTemplate, computeChips };
"use strict";

const VIP_SIGNAL_TEMPLATES = {
  en: {
    rising: "{name} tapped {tapCount} times in the last {hoursAgo} hours. Score moved to {score} from {prevScore}. {tone}",
    cooling: "{name} has been silent for {silentDays} days. Last action was {lastAction}. Score moved from {prevScore} to {score}. {tone}",
    plateau: "{name} shows steady activity with {tapCount} taps this week. Score is stable at {score}. {tone}",
    fallbackName: "Top VIP",
  },
  ar: {
    rising: "{name} قام بالنقر {tapCount} مرات خلال آخر {hoursAgo} ساعات. ارتفعت الدرجة إلى {score} بعد أن كانت {prevScore}. {tone}",
    cooling: "{name} بدون تفاعل منذ {silentDays} أيام. آخر إجراء: {lastAction}. تراجعت الدرجة من {prevScore} إلى {score}. {tone}",
    plateau: "{name} يحافظ على تفاعل ثابت مع {tapCount} نقرات هذا الأسبوع. الدرجة مستقرة عند {score}. {tone}",
    fallbackName: "أعلى عميل VIP",
  },
  es: {
    rising: "{name} registró {tapCount} toques en las últimas {hoursAgo} horas. El score subió a {score} desde {prevScore}. {tone}",
    cooling: "{name} lleva {silentDays} días sin actividad. Última acción: {lastAction}. El score bajó de {prevScore} a {score}. {tone}",
    plateau: "{name} mantiene actividad estable con {tapCount} toques esta semana. El score se mantiene en {score}. {tone}",
    fallbackName: "VIP principal",
  },
  fr: {
    rising: "{name} a effectué {tapCount} interactions au cours des {hoursAgo} dernières heures. Le score est passé à {score} depuis {prevScore}. {tone}",
    cooling: "{name} est inactif depuis {silentDays} jours. Dernière action: {lastAction}. Le score est passé de {prevScore} à {score}. {tone}",
    plateau: "{name} garde une activité régulière avec {tapCount} interactions cette semaine. Le score reste à {score}. {tone}",
    fallbackName: "VIP principal",
  },
};

const TONE_PHRASES = {
  en: { rising: ["Strong buying signal with no rep touch yet.", "Interest is accelerating.", "Concentrated intent pattern."], cooling: ["Re-engagement is recommended now.", "Signal is cooling rapidly."], plateau: ["Signal remains stable.", "Buyer is still in consideration mode."] },
  ar: { rising: ["إشارة شراء قوية بدون تواصل من المندوب حتى الآن.", "الاهتمام يتسارع.", "نمط نية مركّز."], cooling: ["يفضّل إعادة التفاعل الآن.", "الإشارة تبرد بسرعة."], plateau: ["الإشارة مستقرة.", "المشتري ما زال في مرحلة المقارنة."] },
  es: { rising: ["Señal de compra fuerte sin contacto del asesor.", "El interés está acelerando.", "Patrón de intención concentrada."], cooling: ["Se recomienda reactivar ahora.", "La señal se está enfriando rápido."], plateau: ["La señal se mantiene estable.", "El comprador sigue en fase de evaluación."] },
  fr: { rising: ["Signal d'achat fort sans contact commercial.", "L'intérêt accélère.", "Schéma d'intention concentré."], cooling: ["Une relance est recommandée maintenant.", "Le signal refroidit rapidement."], plateau: ["Le signal reste stable.", "L'acheteur reste en phase d'évaluation."] },
};

const PIPELINE_DELTA_TEMPLATES = {
  en: "Pipeline added {pipelineDelta} in qualified value today across {newVipCount} new VIPs. Marketplace traffic moved {trafficDelta}% with {anonVisitors} anonymous visitors focused on {topUnit}.",
  ar: "أضاف خط الأنابيب اليوم {pipelineDelta} من القيمة المؤهلة عبر {newVipCount} عملاء VIP جدد. تغيّرت حركة السوق بنسبة {trafficDelta}% مع {anonVisitors} زائرًا مجهولًا ركزوا على {topUnit}.",
  es: "El pipeline agregó {pipelineDelta} en valor calificado hoy con {newVipCount} VIP nuevos. El tráfico del marketplace cambió {trafficDelta}% con {anonVisitors} visitantes anónimos enfocados en {topUnit}.",
  fr: "Le pipeline a ajouté {pipelineDelta} de valeur qualifiée aujourd'hui avec {newVipCount} nouveaux VIP. Le trafic marketplace a évolué de {trafficDelta}% avec {anonVisitors} visiteurs anonymes concentrés sur {topUnit}.",
};

const CHIP_LABELS = {
  en: { alertsAtRisk: "{count} alerts at risk", hotLeads: "{count} hot leads new", overdue: "{count} follow-up overdue" },
  ar: { alertsAtRisk: "{count} تنبيهات معرضة للخطر", hotLeads: "{count} عملاء ساخنون جدد", overdue: "{count} متابعات متأخرة" },
  es: { alertsAtRisk: "{count} alertas en riesgo", hotLeads: "{count} leads calientes nuevos", overdue: "{count} seguimientos vencidos" },
  fr: { alertsAtRisk: "{count} alertes à risque", hotLeads: "{count} leads chauds nouveaux", overdue: "{count} suivis en retard" },
};

function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function pickTone(lang, status) {
  const pool = TONE_PHRASES[lang]?.[status] || TONE_PHRASES.en[status] || [""];
  return pool[Math.floor(Math.random() * pool.length)];
}

function computeChips({ alerts = {}, lang = "en" }) {
  const dict = CHIP_LABELS[lang] || CHIP_LABELS.en;
  const atRisk = Number(alerts.atRisk || 0);
  const hot = Number(alerts.hotLeads || 0);
  const overdue = Number(alerts.overdue || 0);
  return [
    { label: fill(dict.alertsAtRisk, { count: atRisk }), tone: atRisk > 0 ? "red" : "green" },
    { label: fill(dict.hotLeads, { count: hot }), tone: hot > 0 ? "green" : "amber" },
    { label: fill(dict.overdue, { count: overdue }), tone: overdue > 0 ? "amber" : "green" },
  ];
}

function generateBriefFromTemplate({ topVip = {}, pipelineDelta = {}, marketplaceTraffic = {}, alerts = {}, lang = "en" }) {
  const language = VIP_SIGNAL_TEMPLATES[lang] ? lang : "en";
  const vipStatus = topVip.status || "plateau";
  const vipTemplate = VIP_SIGNAL_TEMPLATES[language][vipStatus] || VIP_SIGNAL_TEMPLATES[language].plateau;
  const paragraph1 = fill(vipTemplate, {
    name: topVip.name || VIP_SIGNAL_TEMPLATES[language].fallbackName,
    tapCount: Number(topVip.tapCount || 0),
    hoursAgo: Number(topVip.hoursAgo || 24),
    score: Number(topVip.score ?? 0),
    prevScore: Number(topVip.prevScore ?? 0),
    silentDays: Number(topVip.silentDays ?? 0),
    lastAction: topVip.lastAction || "—",
    tone: pickTone(language, vipStatus),
  });

  const paragraph2 = fill(PIPELINE_DELTA_TEMPLATES[language] || PIPELINE_DELTA_TEMPLATES.en, {
    pipelineDelta: pipelineDelta.formatted || pipelineDelta.value || "—",
    newVipCount: Number(pipelineDelta.newVipCount || 0),
    trafficDelta: Number(marketplaceTraffic.deltaPct || 0),
    anonVisitors: Number(marketplaceTraffic.anonVisitors || 0),
    topUnit: marketplaceTraffic.topUnit || "top unit",
  });

  return {
    paragraph1,
    paragraph2,
    chips: computeChips({ alerts, lang: language }),
    source: "template",
    generatedAt: Date.now(),
  };
}

module.exports = { generateBriefFromTemplate, computeChips };
