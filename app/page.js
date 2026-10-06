"use client";

import { useEffect, useState } from "react";
import { collectionConfig } from "../collection.config.js";
import { createClient, isSupabaseConfigured } from "../lib/supabase/client.js";
import ArchiveGrid from "../components/archive/ArchiveGrid.js";
import { useLanguage } from "../components/common/LanguageProvider.js";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [entryCount, setEntryCount] = useState(collectionConfig.entryCount);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch the live entry count from Supabase; fall back to the static
  // config count if Supabase isn't configured or the fetch fails.
  useEffect(() => {
    async function fetchEntryCount() {
      if (!isSupabaseConfigured()) {
        setStatsLoading(false);
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setStatsLoading(false);
        return;
      }

      const { count, error } = await supabase
        .from("entries")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setEntryCount(count);
      }
      setStatsLoading(false);
    }

    fetchEntryCount();
  }, []);

  const displayCount = statsLoading ? collectionConfig.entryCount : entryCount;

  return (
    <>
      <main id="top" className="archive-page">
        <section className="landing-hero">
          <div className="landing-hero__glow" aria-hidden="true" />
          <div className="landing-hero__content">
            <p className="landing-badge">✦ {t("homeBadge")}</p>
            <h1>{t("homeTitle")}</h1>
            <p className="landing-hero__description">
              {language === "km" ? t("homeDescription") : `${collectionConfig.description} ${t("homeDescription")}`}
            </p>
            <div className="landing-actions">
              <a href="#archive" className="landing-button landing-button--primary">
                {t("homeExploreCollection")} <span aria-hidden="true">↓</span>
              </a>
              <a href="/contribute" className="landing-button landing-button--secondary">
                {t("homeSubmitPractice")} <span aria-hidden="true">+</span>
              </a>
            </div>
          </div>
        </section>

        <section className="landing-stats" aria-label={t("homeArchiveStatsLabel")}>
          <div className="landing-stat">
            <span className="landing-stat__value">{String(displayCount).padStart(2, "0")}</span>
            <span className="landing-stat__label">{t("homePracticesArchived")}</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat__value landing-stat__value--region">{collectionConfig.province}</span>
            <span className="landing-stat__label">{t("homePrimaryRegion")}</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat__value">100%</span>
            <span className="landing-stat__label">{t("homeCommunitySourced")}</span>
          </div>
        </section>

        <section className="categories-section" aria-labelledby="categories-heading">
          <div className="section-heading">
            <p className="label">{t("homeExploreHeading")}</p>
            <h2 id="categories-heading">{t("homeCategoriesHeading")}</h2>
          </div>
          <div className="categories-grid">
            <a href="#archive" className="category-card">
              <span className="category-card__number">01</span>
              <h3>{t("homeCategoryFood")}</h3>
              <p>{t("homeCategoryFoodDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="#archive" className="category-card">
              <span className="category-card__number">02</span>
              <h3>{t("homeCategoryLighting")}</h3>
              <p>{t("homeCategoryLightingDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="#archive" className="category-card">
              <span className="category-card__number">03</span>
              <h3>{t("homeCategoryRice")}</h3>
              <p>{t("homeCategoryRiceDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="#archive" className="category-card">
              <span className="category-card__number">04</span>
              <h3>{t("homeCategoryCrafts")}</h3>
              <p>{t("homeCategoryCraftsDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <ArchiveGrid />

        <section className="contributor-cta" aria-labelledby="contributor-heading">
          <div>
            <p className="label contributor-cta__label">{t("homeCtaEyebrow")}</p>
            <h2 id="contributor-heading">{t("homeCtaTitle")}</h2>
            <p>{t("homeCtaDescription")}</p>
          </div>
          <a href="/contribute" className="landing-button landing-button--primary contributor-cta__button">{t("homeBecomeContributor")} <span aria-hidden="true">→</span></a>
        </section>
      </main>
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
            <a href="#top">{t("navHome")}</a>
            <a href="#archive">{t("footerArchiveCollection")}</a>
            <a href="#categories-heading">{t("footerCategories")}</a>
            <a href="#about">{t("navAbout")}</a>
          </nav>

          <nav className="landing-footer__column" aria-label={t("homeContributeNavigationLabel")}>
            <p className="landing-footer__heading">{t("footerContribute")}</p>
            <a href="/signup">{t("footerSubmitPractice")}</a>
            <a href="#contributor-heading">{t("footerContributorGuide")}</a>
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
    </>
  );
}