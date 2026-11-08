"use client";

import { useEffect, useState } from "react";
import { collectionConfig } from "../collection.config.js";
import { createClient, isSupabaseConfigured } from "../lib/supabase/client.js";
import ArchiveGrid from "../components/archive/ArchiveGrid.js";
import { useLanguage } from "../components/common/LanguageProvider.js";
import Footer from "../components/layout/Footer.js";

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
        .select("*", { count: "exact", head: true })
        .eq("status", "published");

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
            <a href="/archive" className="category-card">
              <span className="category-card__number">01</span>
              <h3>{t("homeCategoryFood")}</h3>
              <p>{t("homeCategoryFoodDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="/archive" className="category-card">
              <span className="category-card__number">02</span>
              <h3>{t("homeCategoryLighting")}</h3>
              <p>{t("homeCategoryLightingDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="/archive" className="category-card">
              <span className="category-card__number">03</span>
              <h3>{t("homeCategoryRice")}</h3>
              <p>{t("homeCategoryRiceDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="/archive" className="category-card">
              <span className="category-card__number">04</span>
              <h3>{t("homeCategoryCrafts")}</h3>
              <p>{t("homeCategoryCraftsDescription")}</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section id="archive" className="home-archive-preview" aria-labelledby="home-archive-heading">
          <div className="section-heading">
            <div>
              <p className="label">{t("homeExploreHeading")}</p>
              <h2 id="home-archive-heading">{t("homeArchivePreviewHeading")}</h2>
            </div>
          </div>
          <ArchiveGrid previewLimit={4} />
          <div className="home-archive-preview__action">
            <a href="/archive" className="landing-button landing-button--primary">
              {t("homeSeeMoreArchive")} <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="contributor-cta" aria-labelledby="contributor-heading">
          <div>
            <p className="label contributor-cta__label">{t("homeCtaEyebrow")}</p>
            <h2 id="contributor-heading">{t("homeCtaTitle")}</h2>
            <p>{t("homeCtaDescription")}</p>
          </div>
          <a href="/contribute" className="landing-button landing-button--primary contributor-cta__button">{t("homeBecomeContributor")} <span aria-hidden="true">→</span></a>
        </section>
      </main>
      <Footer />
    </>
  );
}