// Phase 2b.Auto — region-keyed automotive demo personas (4 regions × 2 roles)

export const AUTO_PERSONAS = {
  gulf: {
    vip: {
      name: { en: "Khalid Al-Mansouri", ar: "خالد المنصوري", es: "Khalid Al-Mansouri", fr: "Khalid Al-Mansouri" },
      title: { en: "Royal Family Advisor", ar: "مستشار العائلة المالكة", es: "Asesor de la Familia Real", fr: "Conseiller de la Famille Royale" },
    },
    secondary: {
      name: { en: "Sultan Al-Otaibi", ar: "سلطان العتيبي", es: "Sultan Al-Otaibi", fr: "Sultan Al-Otaibi" },
      title: { en: "Private Collector", ar: "جامع خاص", es: "Coleccionista Privado", fr: "Collectionneur Privé" },
    },
  },
  usa: {
    vip: {
      name: { en: "Marcus Sterling", ar: "ماركوس ستيرلينغ", es: "Marcus Sterling", fr: "Marcus Sterling" },
      title: { en: "Manhattan Capital Partners", ar: "شركاء مانهاتن كابيتال", es: "Manhattan Capital Partners", fr: "Manhattan Capital Partners" },
    },
    secondary: {
      name: { en: "James Carlisle", ar: "جيمس كارلايل", es: "James Carlisle", fr: "James Carlisle" },
      title: { en: "Hamptons Family Office", ar: "مكتب عائلة هامبتونز", es: "Oficina Familiar Hamptons", fr: "Family Office Hamptons" },
    },
  },
  mexico: {
    vip: {
      name: { en: "Don Eduardo Vargas", ar: "دون إدواردو فارغاس", es: "Don Eduardo Vargas", fr: "Don Eduardo Vargas" },
      title: { en: "Polanco Holdings", ar: "بولانكو هولدينغز", es: "Patrimonio Polanco", fr: "Patrimoine Polanco" },
    },
    secondary: {
      name: { en: "Diego Hernández", ar: "دييغو هيرنانديز", es: "Diego Hernández", fr: "Diego Hernández" },
      title: { en: "Monterrey Investments", ar: "استثمارات مونتيري", es: "Inversiones Monterrey", fr: "Investissements Monterrey" },
    },
  },
  canada: {
    vip: {
      name: { en: "Liam Beaumont", ar: "ليام بومونت", es: "Liam Beaumont", fr: "Liam Beaumont" },
      title: { en: "Vancouver Tech Capital", ar: "عاصمة التكنولوجيا فانكوفر", es: "Capital Tech Vancouver", fr: "Capital Tech Vancouver" },
    },
    secondary: {
      name: { en: "Olivia Chen", ar: "أوليفيا تشين", es: "Olivia Chen", fr: "Olivia Chen" },
      title: { en: "Yaletown Wealth", ar: "ثروة يالتون", es: "Patrimonio Yaletown", fr: "Patrimoine Yaletown" },
    },
  },
};

export function getAutoPersona(regionId, role) {
  return AUTO_PERSONAS[regionId]?.[role] || AUTO_PERSONAS.gulf[role];
}

export function getPersonaName(persona, lang) {
  return persona?.name?.[lang] ?? persona?.name?.en ?? "";
}

export function getPersonaTitle(persona, lang) {
  return persona?.title?.[lang] ?? persona?.title?.en ?? "";
}
