"use client";

import { useLanguage } from "./LanguageProvider.js";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "en" ? "km" : "en";

  return (
    <button
      type="button"
      className="nav-control language-toggle"
      aria-label={t(nextLanguage === "km" ? "switchToKhmer" : "switchToEnglish")}
      onClick={() => setLanguage(nextLanguage)}
    >
      {language === "en" ? "🇬🇧" : "🇰🇭"}
    </button>
  );
}