"use strict";

// Source of truth field names (from dataDerivers.js):
// topVip:             { name, tapCount, hoursAgo, firstAction, score, prevScore, mode }
// pipelineDelta:      { pipelineDelta, newVipCount }
// marketplaceTraffic: { trafficDelta, anonVisitors, topUnit }
// alerts:             { atRisk, hotLeadsNew, followUpsOverdue }

function pluralize(count, singular, plural) {
  const n = Number(count);
  return Number.isFinite(n) && n === 1 ? singular : plural;
}

const HOURS_LABEL = {
  en: (n) => `${n} ${pluralize(n, "hour", "hours")}`,
  ar: (n) => `${n} ${pluralize(n, "ساعة", "ساعات")}`,
  es: (n) => `${n} ${pluralize(n, "hora", "horas")}`,
  fr: (n) => `${n} ${pluralize(n, "heure", "heures")}`,
};

const DAYS_LABEL = {
  en: (n) => `${n} ${pluralize(n, "day", "days")}`,
  ar: (n) => `${n} ${pluralize(n, "يوم", "أيام")}`,
  es: (n) => `${n} ${pluralize(n, "día", "días")}`,
  fr: (n) => `${n} ${pluralize(n, "jour", "jours")}`,
};

const TAPS_LABEL = {
  en: (n) => `${n} ${pluralize(n, "tap", "taps")}`,
  ar: (n) => `${n} ${pluralize(n, "نقرة", "نقرات")}`,
  es: (n) => `${n} ${pluralize(n, "toque", "toques")}`,
  fr: (n) => `${n} ${pluralize(n, "interaction", "interactions")}`,
};

const VIP_SIGNAL_TEMPLATES = {
  en: {
    rising:
      "<span class=\"vip-name\">{name}</span> tapped {tapsLabel} in the last {hoursLabel} — {firstAction}. <span class=\"score-change\">Score now {score}</span> (was {prevScore} yesterday). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> has gone {daysLabel} without engagement. Last action: {lastAction}. <span class=\"score-change\">Score dropped from {prevScore} to {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> continues steady engagement — {tapsLabel} this week, no new behavioral signals. <span class=\"score-change\">Score holding at {score}</span>.",
  },
  ar: {
    rising:
      "<span class=\"vip-name\">{name}</span> قام بالنقر {tapsLabel} خلال آخر {hoursLabel} — {firstAction}. <span class=\"score-change\">الدرجة الآن {score}</span> (كانت {prevScore} أمس). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> لم يُظهر أي تفاعل منذ {daysLabel}. آخر إجراء: {lastAction}. <span class=\"score-change\">انخفضت الدرجة من {prevScore} إلى {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> يواصل تفاعلًا ثابتًا — {tapsLabel} هذا الأسبوع دون إشارات سلوكية جديدة. <span class=\"score-change\">الدرجة مستقرة عند {score}</span>.",
  },
  es: {
    rising:
      "<span class=\"vip-name\">{name}</span> realizó {tapsLabel} en las últimas {hoursLabel} — {firstAction}. <span class=\"score-change\">Score ahora {score}</span> (ayer {prevScore}). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> lleva {daysLabel} sin interacción. Última acción: {lastAction}. <span class=\"score-change\">El score cayó de {prevScore} a {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> mantiene una interacción estable — {tapsLabel} esta semana sin señales nuevas. <span class=\"score-change\">Score estable en {score}</span>.",
  },
  fr: {
    rising:
      "<span class=\"vip-name\">{name}</span> a effectué {tapsLabel} au cours des {hoursLabel} dernières — {firstAction}. <span class=\"score-change\">Score maintenant {score}</span> (contre {prevScore} hier). {tone}",
    cooling:
      "<span class=\"vip-name\">{name}</span> est sans engagement depuis {daysLabel}. Dernière action: {lastAction}. <span class=\"score-change\">Le score est passé de {prevScore} à {score}</span>. {tone}",
    plateau:
      "<span class=\"vip-name\">{name}</span> garde un engagement stable — {tapsLabel} cette semaine, sans nouveau signal. <span class=\"score-change\">Score maintenu à {score}</span>.",
  },
};

const TONE_PHRASES = {
  en: {
    rising: ["Strong buying signal, no rep contact yet.", "Concentrated interest pattern.", "Engagement accelerating."],
    cooling: ["Cooling rapidly — re-engagement needed.", "Interest fading, intervention recommended."],
    plateau: ["Stable interest profile.", "Steady consideration mode."],
  },
  ar: {
    rising: ["إشارة شراء قوية دون تواصل من المندوب حتى الآن.", "نمط اهتمام مركز.", "التفاعل يتسارع."],
    cooling: ["الاهتمام يبرد بسرعة — يلزم إعادة التفاعل.", "الاهتمام يتلاشى ويوصى بالتدخل."],
    plateau: ["ملف اهتمام مستقر.", "نمط دراسة ثابت."],
  },
  es: {
    rising: ["Señal de compra fuerte sin contacto comercial todavía.", "Patrón de interés concentrado.", "El interés se acelera."],
    cooling: ["Enfriamiento rápido; se requiere reactivación.", "El interés se está perdiendo, se recomienda intervenir."],
    plateau: ["Perfil de interés estable.", "Modo de consideración constante."],
  },
  fr: {
    rising: ["Signal d'achat fort sans contact commercial pour le moment.", "Pattern d'intérêt concentré.", "L'engagement s'accélère."],
    cooling: ["Refroidissement rapide — relance nécessaire.", "L'intérêt diminue, intervention recommandée."],
    plateau: ["Profil d'intérêt stable.", "Mode de considération stable."],
  },
};

const PIPELINE_DELTA_TEMPLATES = {
  en: "Pipeline added <strong>{pipelineDelta}</strong> in qualified value today across {newVipCount} new VIPs. Marketplace traffic up {trafficDelta}% — {anonVisitors} anonymous visitors spent >3min on {topUnit}.",
  ar: "أضاف خط الأنابيب <strong>{pipelineDelta}</strong> من القيمة المؤهلة اليوم عبر {newVipCount} من كبار الشخصيات الجدد. ارتفعت زيارات السوق بنسبة {trafficDelta}% — وقضى {anonVisitors} زائرًا مجهولًا أكثر من 3 دقائق على {topUnit}.",
  es: "El pipeline agregó <strong>{pipelineDelta}</strong> en valor calificado hoy con {newVipCount} VIP nuevos. El tráfico del marketplace subió {trafficDelta}% — {anonVisitors} visitantes anónimos pasaron más de 3 min en {topUnit}.",
  fr: "Le pipeline a ajouté <strong>{pipelineDelta}</strong> de valeur qualifiée aujourd'hui avec {newVipCount} nouveaux VIP. Le trafic marketplace a augmenté de {trafficDelta}% — {anonVisitors} visiteurs anonymes ont passé plus de 3 min sur {topUnit}.",
};

const ZERO_STATE_TEMPLATES = {
  en: {
    paragraph1:
      "Your private buyer experiences are warming up. The first VIP signals will appear here as soon as buyers tap their invitations and start exploring.",
    paragraph2:
      "Pipeline movement and marketplace activity refresh every cycle — once today's first interactions land, this brief will narrate them in real time.",
  },
  ar: {
    paragraph1:
      "تجارب المشترين الخاصة بك في طور الإحماء. ستظهر هنا أولى إشارات كبار الشخصيات بمجرد تفاعلهم مع دعواتهم.",
    paragraph2:
      "تتحدّث حركة خط الأنابيب ونشاط السوق في كل دورة — فور وصول أولى التفاعلات اليوم سيسرد هذا الموجز ذلك في الوقت الفعلي.",
  },
  es: {
    paragraph1:
      "Tus experiencias privadas para compradores se están calentando. Las primeras señales VIP aparecerán aquí en cuanto los compradores activen sus invitaciones.",
    paragraph2:
      "El movimiento del pipeline y la actividad del marketplace se refrescan cada ciclo — en cuanto lleguen las primeras interacciones de hoy, este resumen las narrará en tiempo real.",
  },
  fr: {
    paragraph1:
      "Vos expériences acheteurs privées montent en température. Les premiers signaux VIP apparaîtront ici dès que les acheteurs activeront leurs invitations.",
    paragraph2:
      "Le pipeline et l'activité du marketplace se rafraîchissent à chaque cycle — dès les premières interactions du jour, ce résumé les racontera en temps réel.",
  },
};

const CHIP_LABELS = {
  en: {
    atRisk: "{count} alerts at risk",
    hotLeadsNew: "{count} hot leads new",
    followUpsOverdue: "{count} follow-up overdue",
  },
  ar: {
    atRisk: "{count} تنبيهات معرضة للخطر",
    hotLeadsNew: "{count} عملاء ساخنون جدد",
    followUpsOverdue: "{count} متابعة متأخرة",
  },
  es: {
    atRisk: "{count} alertas en riesgo",
    hotLeadsNew: "{count} leads calientes nuevos",
    followUpsOverdue: "{count} seguimientos atrasados",
  },
  fr: {
    atRisk: "{count} alertes à risque",
    hotLeadsNew: "{count} leads chauds nouveaux",
    followUpsOverdue: "{count} suivis en retard",
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
  if (hotLeadsNew > 0) chips.push({ label: fill(dict.hotLeadsNew, { count: hotLeadsNew }), tone: "green" });
  if (followUpsOverdue > 0) chips.push({ label: fill(dict.followUpsOverdue, { count: followUpsOverdue }), tone: "amber" });
  return chips;
}

function isZeroState({ topVip = {}, pipelineDelta = {}, marketplaceTraffic = {} }) {
  const tapCount = Number(topVip.tapCount || 0);
  const newVipCount = Number(pipelineDelta.newVipCount || 0);
  const trafficDelta = Number(marketplaceTraffic.trafficDelta || 0);
  const anonVisitors = Number(marketplaceTraffic.anonVisitors || 0);
  const pipelineValue = String(pipelineDelta.pipelineDelta || "").replace(/[^0-9.-]/g, "");
  return (
    tapCount === 0 &&
    newVipCount === 0 &&
    trafficDelta === 0 &&
    anonVisitors === 0 &&
    (pipelineValue === "" || Number(pipelineValue) === 0)
  );
}

function generateBriefFromTemplate({ topVip = {}, pipelineDelta = {}, marketplaceTraffic = {}, alerts = {}, lang = "en" }) {
  const language = VIP_SIGNAL_TEMPLATES[lang] ? lang : "en";

  // Zero-state branch — empty tenant, no demo data yet
  if (isZeroState({ topVip, pipelineDelta, marketplaceTraffic })) {
    const zero = ZERO_STATE_TEMPLATES[language] || ZERO_STATE_TEMPLATES.en;
    return {
      paragraph1: zero.paragraph1,
      paragraph2: zero.paragraph2,
      chips: computeChips({ alerts, lang: language }),
      source: "template",
      generatedAt: Date.now(),
      lang: language,
    };
  }

  const mode = topVip.mode || "plateau";
  const vipTemplate = VIP_SIGNAL_TEMPLATES[language][mode] || VIP_SIGNAL_TEMPLATES.en.plateau;
  const pipelineTemplate = PIPELINE_DELTA_TEMPLATES[language] || PIPELINE_DELTA_TEMPLATES.en;

  const tapCount = Number(topVip.tapCount ?? 0);
  const hoursAgo = Number(topVip.hoursAgo ?? 24);
  const silentDays = Number(topVip.silentDays ?? 0);

  const paragraph1 = fill(vipTemplate, {
    name: topVip.name || "Top VIP",
    tapsLabel: TAPS_LABEL[language](tapCount),
    hoursLabel: HOURS_LABEL[language](hoursAgo),
    daysLabel: DAYS_LABEL[language](silentDays),
    firstAction: topVip.firstAction || "reviewed premium listing details",
    score: topVip.score ?? 0,
    prevScore: topVip.prevScore ?? 0,
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
