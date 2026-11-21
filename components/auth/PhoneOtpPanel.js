"use client";

// components/auth/PhoneOtpPanel.js
//
// SMS one-time-code step. Used when a phone signup needs confirmation or when
// a contributor chooses to log in with a one-time code instead of a password.

import { useLanguage } from "../common/LanguageProvider.js";
import { OTP_CODE_LENGTH } from "../../lib/auth.js";

export default function PhoneOtpPanel({
  phone,
  code,
  onCodeChange,
  onVerify,
  onResend,
  loading,
  resending,
}) {
  const { t } = useLanguage();

  return (
    <div className="auth-otp">
      <p className="auth-otp__message">{t("authOtpSent", { phone })}</p>

      <div className="auth-field">
        <label htmlFor="otp-code">{t("authOtpCode")}</label>
        <input
          id="otp-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={OTP_CODE_LENGTH}
          value={code}
          onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, ""))}
          placeholder={t("authOtpCodePlaceholder")}
        />
      </div>

      <button
        type="button"
        className="auth-submit"
        onClick={onVerify}
        disabled={loading || code.length < OTP_CODE_LENGTH}
      >
        {loading ? t("authVerifying") : t("authVerifyOtp")}
      </button>

      <button
        type="button"
        className="auth-resend"
        onClick={onResend}
        disabled={resending}
      >
        {resending ? t("authSendingCode") : t("authResendCode")}
      </button>
    </div>
  );
}
