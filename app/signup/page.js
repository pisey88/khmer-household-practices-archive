"use client";

import { useLanguage } from "../../components/common/LanguageProvider.js";
import { collectionConfig } from "../../collection.config.js";
import IdentifierToggle from "../../components/auth/IdentifierToggle.js";
import PhoneField from "../../components/auth/PhoneField.js";
import PhoneOtpPanel from "../../components/auth/PhoneOtpPanel.js";
import { useAuthForm } from "../../lib/useAuthForm.js";

export default function SignUpPage() {
  const { t } = useLanguage();
  const form = useAuthForm("signup");

  return (
    <main className="auth-page">
      <form onSubmit={form.submit} className="auth-card">
        <a href="/" className="auth-back-link">
          {t("authBackHome")}
        </a>
        <div className="auth-brand" aria-label={collectionConfig.siteTitle}>
          <span className="auth-brand__mark" aria-hidden="true">✦</span>
          <span>{collectionConfig.siteTitle}</span>
        </div>
        <h1 className="auth-title">{t("authSignupTitle")}</h1>

        <IdentifierToggle value={form.identifier} onChange={form.changeIdentifier} />

        {form.isEmail ? (
          <div className="auth-field">
            <label htmlFor="email">{t("authEmail")}</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder={t("authSignupEmailPlaceholder")}
            />
          </div>
        ) : (
          <PhoneField
            value={form.phone}
            onChange={form.setPhone}
            disabled={form.showOtp}
          />
        )}

        {form.showPassword && (
          <div className="auth-field">
            <label htmlFor="password">{t("authPassword")}</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder={t("authSignupPasswordPlaceholder")}
            />
          </div>
        )}

        {form.showOtp ? (
          <PhoneOtpPanel
            phone={form.otpPhone}
            code={form.otpCode}
            onCodeChange={form.setOtpCode}
            onVerify={form.verifyOtp}
            onResend={form.resendOtp}
            loading={form.loading}
            resending={form.resending}
          />
        ) : (
          <button type="submit" disabled={form.loading} className="auth-submit">
            {form.loading ? t("authSignupLoading") : t("authSignupTitle")}
          </button>
        )}

        {form.errorKey && (
          <p className="auth-error" role="alert">{t(form.errorKey)}</p>
        )}
        {form.noticeKey && (
          <p className="auth-notice" role="status">{t(form.noticeKey)}</p>
        )}

        <p className="auth-switch">
          {t("authLoginPrompt")}{' '}
          <a href="/login">{t("authLoginLink")}</a>
        </p>
      </form>
    </main>
  );
}
