"use client";

import { useLanguage } from "./LanguageProvider.js";
import { useTheme } from "./ThemeProvider.js";

export default function ThemeToggle() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="nav-control theme-toggle"
      aria-label={t(theme === "dark" ? "switchToLightTheme" : "switchToDarkTheme")}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      )}
    </button>
  );
}
