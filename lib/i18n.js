// lib/i18n.js
//
// Minimal English/Khmer internationalization helpers for the archive UI.
// `pick` returns the language-appropriate value from a string-or-object field,
// and `t` looks up translated UI strings with optional {variable} replacement.

export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "km"];

export const TRANSLATIONS = {
  en: {
    Archive: "Archive",
    About: "About",
    languageToggleLabel: "Language",
  },
  km: {
    Archive: "បណ្ណសារ",
    About: "អំពី",
    languageToggleLabel: "ភាសា",
  },
};

export function pick(field, language) {
  if (typeof field === "string") return field;
  if (field && typeof field === "object") {
    return field[language] ?? field[DEFAULT_LANGUAGE] ?? "";
  }
  return field;
}

export function t(language, key, vars = {}) {
  const value =
    TRANSLATIONS[language]?.[key] ?? TRANSLATIONS[DEFAULT_LANGUAGE]?.[key] ?? key;
  if (typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);
}
