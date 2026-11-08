"use client";

import { useLanguage } from "../common/LanguageProvider.js";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="landing-footer">
      <span className="landing-footer__watermark" aria-hidden="true">
        បណ្ណសារប្រពៃណីគ្រួសារខ្មែរ
      </span>
      <div className="landing-footer__main">
        <div className="landing-footer__brand">
          <p className="landing-footer__title">{t("siteTitle")}</p>
          <p className="landing-footer__mission">{t("footerMission")}</p>
          <span className="landing-footer__status">🟢 {t("footerStatus")}</span>
        </div>

        <nav className="landing-footer__column" aria-label={t("homeExploreNavigationLabel")}>
          <p className="landing-footer__heading">{t("footerExplore")}</p>
          <a href="/#top">{t("navHome")}</a>
          <a href="/archive">{t("footerArchiveCollection")}</a>
          <a href="/#categories-heading">{t("footerCategories")}</a>
          <a href="/about">{t("navAbout")}</a>
        </nav>

        <nav className="landing-footer__column" aria-label={t("homeContributeNavigationLabel")}>
          <p className="landing-footer__heading">{t("footerContribute")}</p>
          <a href="/signup">{t("footerSubmitPractice")}</a>
          <a href="/#contributor-heading">{t("footerContributorGuide")}</a>
          <a href="/login">{t("navLogin")}</a>
          <a href="/signup">{t("navSignup")}</a>
        </nav>

        <blockquote className="landing-footer__quote">
          {t("footerQuote")}
        </blockquote>
      </div>

      <div className="landing-footer__bottom">
        <p>{t("footerCopyright")}</p>
        <div className="landing-footer__badges" aria-label={t("homeTechnologyLabel")}>
          <span>{t("footerNextJs")}</span>
          <span>{t("footerSupabase")}</span>
        </div>
      </div>
    </footer>
  );
}
