const translations = {};

export function registerTranslations(namespace, data) {
  translations[namespace] = data;
}

export function useTranslation(namespace) {
  const lang = typeof document !== 'undefined' && document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const ns = translations[namespace] || {};
  const strings = ns[lang] || ns['en'] || {};

  function t(key) {
    const keys = key.split('.');
    let val = strings;
    for (const k of keys) {
      if (val && typeof val === 'object') val = val[k];
      else return key;
    }
    return typeof val === 'string' ? val : key;
  }

  return { t, language: lang };
}

export function useLanguage() {
  const lang = typeof document !== 'undefined' && document.documentElement.lang === 'ar' ? 'ar' : 'en';
  return { language: lang, setLanguage: () => {}, dir: lang === 'ar' ? 'rtl' : 'ltr' };
}
