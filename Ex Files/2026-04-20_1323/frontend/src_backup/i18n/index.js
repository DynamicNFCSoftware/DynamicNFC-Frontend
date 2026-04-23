import { useCallback } from "react";
import { useLanguage } from "./LanguageContext";
import { common } from "./common";

export { LanguageProvider, useLanguage } from "./LanguageContext";

// Registry of page translation modules
const pageModules = {};

/**
 * Register a page's translations. Called once per page module.
 * @param {string} page - page key, e.g. "home", "enterprise"
 * @param {{ en: object, ar: object }} translations
 */
export function registerTranslations(page, translations) {
  pageModules[page] = translations;
}

/**
 * Hook: returns a `t(key)` function that resolves:
 *   1. Page-specific translation
 *   2. Common translation
 *   3. Falls back to the key itself
 *
 * Usage:
 *   const t = useTranslation("home");
 *   <h1>{t("heroTitle")}</h1>
 */
export function useTranslation(page) {
  const { lang } = useLanguage();

  const t = useCallback(
    (key) => {
      const pm = pageModules[page];
      // Check page-specific first
      if (pm && pm[lang] && pm[lang][key] !== undefined) return pm[lang][key];
      if (pm && pm.en && pm.en[key] !== undefined && lang === "en") return pm.en[key];
      // Then common
      if (common[lang] && common[lang][key] !== undefined) return common[lang][key];
      if (common.en && common.en[key] !== undefined) return common.en[key];
      // Fallback
      return key;
    },
    [lang, page]
  );

  return t;
}

/**
 * Non-hook version for use outside React components.
 * Pass lang explicitly.
 */
export function translate(page, lang, key) {
  const pm = pageModules[page];
  if (pm && pm[lang] && pm[lang][key] !== undefined) return pm[lang][key];
  if (common[lang] && common[lang][key] !== undefined) return common[lang][key];
  if (common.en && common.en[key] !== undefined) return common.en[key];
  return key;
}
