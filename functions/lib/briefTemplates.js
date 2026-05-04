"use strict";

const VIP_SIGNAL_TEMPLATES = {
  en: {
    rising:
      "<span class=\"vip-name\">{name}</span> tapped {tapCount} times in the last {hoursAgo} hours - {firstAction}. <span class=\"score-change\">Score now {score}</span> (was {prevScore} yesterday). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> has gone {silentDays} days without engagement. Last action: {lastAction}. <span class=\"score-change\">Score dropped from {prevScore} to {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> continues steady engagement - {tapCount} taps this week, no new behavioral signals. <span class=\"score-change\">Score holding at {score}</span>.",
  },
  ar: {
    rising:
      "<span class=\"vip-name\">{name}</span> قام بالنقر {tapCount} مرات خلال آخر {hoursAgo} ساعات - {firstAction}. <span class=\"score-change\">الدرجة الآن {score}</span> (كانت {prevScore} أمس). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> لم يُظهر أي تفاعل منذ {silentDays} أيام. آخر إجراء: {lastAction}. <span class=\"score-change\">انخفضت الدرجة من {prevScore} إلى {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> يواصل تفاعلًا ثابتًا - {tapCount} نقرات هذا الأسبوع دون إشارات سلوكية جديدة. <span class=\"score-change\">الدرجة مستقرة عند {score}</span>.",
  },
  es: {
    rising:
      "<span class=\"vip-name\">{name}</span> realizó {tapCount} toques en las últimas {hoursAgo} horas - {firstAction}. <span class=\"score-change\">Score ahora {score}</span> (ayer {prevScore}). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> lleva {silentDays} días sin interacción. Última acción: {lastAction}. <span class=\"score-change\">El score cayó de {prevScore} a {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> mantiene una interacción estable - {tapCount} toques esta semana sin señales nuevas. <span class=\"score-change\">Score estable en {score}</span>.",
  },
  fr: {
    rising:
      "<span class=\"vip-name\">{name}</span> a effectué {tapCount} interactions au cours des {hoursAgo} dernières heures - {firstAction}. <span class=\"score-change\">Score maintenant {score}</span> (contre {prevScore} hier). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> est sans engagement depuis {silentDays} jours. Dernière action: {lastAction}. <span class=\"score-change\">Le score est passé de {prevScore} à {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> garde un engagement stable - {tapCount} interactions cette semaine, sans nouveau signal. <span class=\"score-change\">Score maintenu à {score}</span>.",
  },
};

const TONE_PHRASES = {
  en: {
    rising: ["Strong buying signal, no rep contact yet.", "Concentrated interest pattern.", "Engagement accelerating."],
    cooling: ["Cooling rapidly - re-engagement needed.", "Interest fading, intervention recommended."],
    plateau: ["Stable interest profile.", "Steady consideration mode."],
  },
  ar: {
    rising: ["إشارة شراء قوية دون تواصل من المندوب حتى الآن.", "نمط اهتمام مركز.", "التفاعل يتسارع."],
    cooling: ["الاهتمام يبرد بسرعة - يلزم إعادة التفاعل.", "الاهتمام يتلاشى ويوصى بالتدخل."],
    plateau: ["ملف اهتمام مستقر.", "نمط دراسة ثابت."],
  },
  es: {
    rising: ["Señal de compra fuerte sin contacto comercial todavía.", "Patrón de interés concentrado.", "El interés se acelera."],
    cooling: ["Enfriamiento rápido; se requiere reactivación.", "El interés se está perdiendo, se recomienda intervenir."],
    plateau: ["Perfil de interés estable.", "Modo de consideración constante."],
  },
  fr: {
    rising: ["Signal d'achat fort sans contact commercial pour le moment.", "Pattern d'intérêt concentré.", "L'engagement s'accélère."],
    cooling: ["Refroidissement rapide - relance nécessaire.", "L'intérêt diminue, intervention recommandée."],
    plateau: ["Profil d'intérêt stable.", "Mode de considération stable."],
  },
};

const PIPELINE_DELTA_TEMPLATES = {
  en: "Pipeline added <strong>{pipelineDelta}</strong> in qualified value today across {newVipCount} new VIPs. Marketplace traffic up {trafficDelta}% - {anonVisitors} anonymous visitors spent >3min on {topUnit}.",
  ar: "أضاف خط الأنابيب <strong>{pipelineDelta}</strong> من القيمة المؤهلة اليوم عبر {newVipCount} من كبار الشخصيات الجدد. ارتفعت زيارات السوق بنسبة {trafficDelta}% - وقضى {anonVisitors} زائرًا مجهولًا أكثر من 3 دقائق على {topUnit}.",
  es: "El pipeline agregó <strong>{pipelineDelta}</strong> en valor calificado hoy con {newVipCount} VIP nuevos. El tráfico del marketplace subió {trafficDelta}% - {anonVisitors} visitantes anónimos pasaron más de 3 min en {topUnit}.",
  fr: "Le pipeline a ajouté <strong>{pipelineDelta}</strong> de valeur qualifiée aujourd'hui avec {newVipCount} nouveaux VIP. Le trafic marketplace a augmenté de {trafficDelta}% - {anonVisitors} visiteurs anonymes ont passé plus de 3 min sur {topUnit}.",
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
    overdue: "{count} متابعة متأخرة",
  },
  es: {
    atRisk: "{count} alertas en riesgo",
    hotLeads: "{count} leads calientes nuevos",
    overdue: "{count} seguimientos atrasados",
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
  const dict = CHIP_LABELS[lang] || CHIP_LABELS.en;
  const chips = [];
  const atRisk = Number(alerts.atRisk || 0);
  const hotLeadsNew = Number(alerts.hotLeadsNew || 0);
  const followUpsOverdue = Number(alerts.followUpsOverdue || 0);
  if (atRisk > 0) chips.push({ label: fill(dict.atRisk, { count: atRisk }), tone: "red" });
  if (hotLeadsNew > 0) chips.push({ label: fill(dict.hotLeads, { count: hotLeadsNew }), tone: "green" });
  if (followUpsOverdue > 0) chips.push({ label: fill(dict.overdue, { count: followUpsOverdue }), tone: "amber" });
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
    topUnit: marketplaceTraffic.topUnit || "top unit",
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
