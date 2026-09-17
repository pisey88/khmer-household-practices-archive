"use client";
// components/common/LanguageProvider.js
//
// Language context provider with Khmer/English support.
// Handles language state, localStorage persistence, and translation helpers.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, pick, t } from "../../lib/i18n.js";

const STORAGE_KEY = "khmer-archive-language";
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  // Load saved language on mount
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  // Persist language changes and update document lang
  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (next) => {
    if (SUPPORTED_LANGUAGES.includes(next)) setLanguageState(next);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key, vars) => t(language, key, vars),
      pick: (field) => pick(field, language),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback if context is not available
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key) => key,
      pick: (obj) => (typeof obj === "string" ? obj : obj?.[DEFAULT_LANGUAGE] ?? ""),
    };
  }
  return ctx;
}