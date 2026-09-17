"use client";

import { useLanguage } from "./LanguageProvider.js";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="language-toggle" aria-label={t("languageToggleLabel")}>
      <button
        type="button"
        className={`language-toggle__btn ${language === "en" ? "active" : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`language-toggle__btn ${language === "km" ? "active" : ""}`}
        onClick={() => setLanguage("km")}
      >
        ខ្មែរ
      </button>
    </div>
  );
}