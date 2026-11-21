"use client";

// components/auth/PhoneField.js
//
// Phone input with format guidance. Shows the E.164 number that will actually
// be sent to Supabase whenever it differs from what the user typed (for
// example a local Cambodian 0… number being converted to +855…).

import { useLanguage } from "../common/LanguageProvider.js";
import { normalizePhone } from "../../lib/auth.js";

export default function PhoneField({
  value,
  onChange,
  disabled = false,
  id = "phone",
}) {
  const { t } = useLanguage();
  const normalized = normalizePhone(value);
  const showNormalized = Boolean(normalized) && normalized !== value.trim();

  return (
    <div className="auth-field">
      <label htmlFor={id}>{t("authPhone")}</label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required
        autoComplete="tel"
        placeholder={t("authPhonePlaceholder")}
        aria-describedby={`${id}-hint`}
      />
      <p className="auth-hint" id={`${id}-hint`}>
        {t("authPhoneHint")}
      </p>
      {showNormalized && (
        <p className="auth-hint auth-hint--value">
          {t("authPhoneNormalized", { phone: normalized })}
        </p>
      )}
    </div>
  );
}
