"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TRANSLATIONS, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../../lib/i18n.js";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("language");
    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (nextLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) {
      throw new Error(`Unsupported language: ${nextLanguage}`);
    }
    setLanguageState(nextLanguage);
    window.localStorage.setItem("language", nextLanguage);
  };

  const pick = (field) => {
    if (typeof field === "string") return field;
    if (field && typeof field === "object") {
      return field[language] ?? field[DEFAULT_LANGUAGE] ?? "";
    }
    return field ?? "";
  };

  const t = (key, vars = {}) => {
    const value =
      TRANSLATIONS[language]?.[key] ?? TRANSLATIONS[DEFAULT_LANGUAGE]?.[key] ?? key;
    if (typeof value !== "string") return value;
    return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}