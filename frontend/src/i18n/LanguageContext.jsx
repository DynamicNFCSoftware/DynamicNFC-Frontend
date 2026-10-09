import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const LanguageContext = createContext();

const STORAGE_KEY = "dnfc_lang";
const SUPPORTED_LANGS = ["en", "it", "fr", "es", "ar"];

function detectBrowserLang() {
  const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  return SUPPORTED_LANGS.find((l) => nav.startsWith(l)) || "en";
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
      try { localStorage.setItem(STORAGE_KEY, l); } catch { /* storage unavailable */ }
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isAr: lang === "ar", isEs: lang === "es", supportedLangs: SUPPORTED_LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
