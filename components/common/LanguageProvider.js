// components/common/LanguageProvider.js
//
// Basic fallback implementation to prevent runtime errors

import { createContext, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const t = (key) => {
    // Simple translation mapping
    const translations = {
      navArchive: "Archive",
      navAbout: "About",
      navSources: "Sources"
    };
    return translations[key] || key;
  };

  const pick = (obj) => {
    // Simple picker for multilingual strings
    if (typeof obj === 'string') return obj;
    if (obj?.en) return obj.en;
    if (obj?.km) return obj.km;
    return '';
  };

  return (
    <LanguageContext.Provider value={{ t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if context is not available
    return {
      t: (key) => key,
      pick: (obj) => typeof obj === 'string' ? obj : (obj?.en || obj?.km || '')
    };
  }
  return context;
}
