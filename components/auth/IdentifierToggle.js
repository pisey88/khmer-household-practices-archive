"use client";

// components/auth/IdentifierToggle.js
//
// Email / Phone tabs shared by the Log In and Sign Up pages. Purely
// presentational — the parent owns the selected value.

import { useLanguage } from "../common/LanguageProvider.js";
import { IDENTIFIER_EMAIL, IDENTIFIER_PHONE } from "../../lib/auth.js";

const OPTIONS = [
  { id: IDENTIFIER_EMAIL, labelKey: "authEmail" },
  { id: IDENTIFIER_PHONE, labelKey: "authPhone" },
];

export default function IdentifierToggle({ value, onChange }) {
  const { t } = useLanguage();

  return (
    <div
      className="auth-toggle"
      role="group"
      aria-label={t("authIdentifierLabel")}
    >
      {OPTIONS.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            className={`auth-toggle__option${active ? " auth-toggle__option--active" : ""}`}
            onClick={() => onChange(option.id)}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
