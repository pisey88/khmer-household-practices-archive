"use client";

import { useLanguage } from "./LanguageProvider.js";
import flagEnglish from "../my-entries/Flag_of_the_United_States.svg.webp";
import flagKhmer from "../my-entries/Flag_of_Cambodia.svg.webp";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "en" ? "km" : "en";
  const activeFlag = language === "en" ? flagEnglish : flagKhmer;
  const activeFlagAlt = language === "en" ? "English" : "Khmer";

  return (
    <button
      type="button"
      className="nav-control language-toggle"
      aria-label={t(nextLanguage === "km" ? "switchToKhmer" : "switchToEnglish")}
      onClick={() => setLanguage(nextLanguage)}
    >
      <img
        src={activeFlag.src}
        alt={activeFlagAlt}
        style={{
          width: "1.25rem",
          height: "1.25rem",
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </button>
  );
}
