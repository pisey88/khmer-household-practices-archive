"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client.js";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../components/common/LanguageProvider.js";
import { collectionConfig } from "../../collection.config.js";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    if (!supabase) {
      setLoading(false);
      setError(t("contributeAuthNotConfigured"));
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <a href="/" className="auth-back-link">
          {t("authBackHome")}
        </a>
        <div className="auth-brand" aria-label={collectionConfig.siteTitle}>
          <span className="auth-brand__mark" aria-hidden="true">✦</span>
          <span>{collectionConfig.siteTitle}</span>
        </div>
        <h1 className="auth-title">{t("authSignupTitle")}</h1>

        <div className="auth-field">
          <label htmlFor="email">
            {t("authEmail")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder={t("authEmailPlaceholder")}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">
            {t("authPassword")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder={t("authSignupPasswordPlaceholder")}
          />
        </div>

        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? t("authSignupLoading") : t("authSignupTitle")}
        </button>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <p className="auth-switch">
          {t("authLoginPrompt")}{' '}
          <a href="/login">{t("authLoginLink")}</a>
        </p>
      </form>
    </main>
  );
}
