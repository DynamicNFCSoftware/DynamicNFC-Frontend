import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const LanguageContext = createContext();

const STORAGE_KEY = "dnfc_lang";
const SUPPORTED_LANGS = ["en", "ar", "es", "fr"];

function detectBrowserLang() {
  const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  if (nav.startsWith("ar")) return "ar";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("fr")) return "fr";
  return "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
      return detectBrowserLang();
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((l) => {
    if (SUPPORTED_LANGS.includes(l)) {
      setLangState(l);
      try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "ar" : lang === "ar" ? "es" : "en");
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, isAr: lang === "ar", isEs: lang === "es", supportedLangs: SUPPORTED_LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
