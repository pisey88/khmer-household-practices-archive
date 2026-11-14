"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collectionConfig } from "../collection.config.js";
import { createClient, isSupabaseConfigured } from "../lib/supabase/client.js";
import ArchiveGrid from "../components/archive/ArchiveGrid.js";
import { useLanguage } from "../components/common/LanguageProvider.js";
import Footer from "../components/layout/Footer.js";
import { CAMBODIAN_PROVINCES } from "../lib/provinces.js";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [entryCount, setEntryCount] = useState(collectionConfig.entryCount);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showcaseEntries, setShowcaseEntries] = useState([]);
  const [showcaseLoading, setShowcaseLoading] = useState(true);
  const [showcaseError, setShowcaseError] = useState(false);
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);

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

  useEffect(() => {
    let cancelled = false;

    async function fetchShowcaseEntries() {
      if (!isSupabaseConfigured()) {
        setShowcaseError(true);
        setShowcaseLoading(false);
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setShowcaseError(true);
        setShowcaseLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(6);

        if (cancelled) return;

        if (error) {
          console.error("Failed to fetch homepage showcase entries:", error.message);
          setShowcaseError(true);
          return;
        }

        setShowcaseEntries(data ?? []);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to fetch homepage showcase entries:", error);
        setShowcaseError(true);
      } finally {
        if (!cancelled) setShowcaseLoading(false);
      }
    }

    fetchShowcaseEntries();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (showcaseEntries.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveShowcaseIndex((index) => (index + 1) % showcaseEntries.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [showcaseEntries.length]);

  const displayCount = statsLoading ? collectionConfig.entryCount : entryCount;
  const activeEntry = showcaseEntries[activeShowcaseIndex];
  const provinceName = activeEntry?.province || collectionConfig.province;
  const activeProvince =
    language === "km"
      ? CAMBODIAN_PROVINCES.find(
          (province) =>
            province.en === provinceName || province.km === provinceName
        )?.km || provinceName
      : provinceName;
  const activeCategoryKey = activeEntry?.category
    ? `category${activeEntry.category.replace(/\s/g, "")}`
    : "";
  const activeCategory = activeCategoryKey
    ? t(activeCategoryKey) === activeCategoryKey
      ? activeEntry.category
      : t(activeCategoryKey)
    : "";
  const activeTitle =
    language === "km"
      ? activeEntry?.khmer_title || activeEntry?.title
      : activeEntry?.title || activeEntry?.khmer_title;
  const activeDescription =
    language === "km"
      ? activeEntry?.description_km || activeEntry?.description
      : activeEntry?.description || activeEntry?.description_km;
  const activeDescriptionLanguage =
    language === "km"
      ? activeEntry?.description_km
        ? "km"
        : "en"
      : activeEntry?.description
        ? "en"
        : "km";

  return (
    <>
      <main id="top" className="archive-page">
        <section className="landing-hero">
          <div className="landing-hero__glow" aria-hidden="true" />
          <div className="landing-hero__layout">
            <div className="landing-hero__content">
              <p className="landing-badge">
                <span lang="km">បណ្ណសារប្រពៃណីគ្រួសារខ្មែរ</span>
                <span aria-hidden="true">•</span>
                <span lang="en">KHMER HERITAGE ARCHIVE</span>
              </p>
              <h1 lang={language}>{t("homeTitle")}</h1>
              <p className="landing-hero__description" lang={language}>
                {t("homeDescription")}
              </p>
              <div className="landing-actions">
                <Link href="/archive" className="landing-button landing-button--primary">
                  {t("homeExploreCollection")} <span aria-hidden="true">→</span>
                </Link>
                <Link href="/contribute" className="landing-button landing-button--secondary">
                  {t("homeSubmitPractice")} <span aria-hidden="true">+</span>
                </Link>
              </div>
              <section className="landing-hero__stats" aria-label={t("homeArchiveStatsLabel")}>
                <div className="landing-hero__stat">
                  <span className="landing-hero__stat-value">25</span>
                  <span className="landing-hero__stat-label">{t("homeProvincesLabel")}</span>
                </div>
                <div className="landing-hero__stat">
                  <span className="landing-hero__stat-value">{displayCount}</span>
                  <span className="landing-hero__stat-label">{t("homePracticesArchived")}</span>
                </div>
              </section>
            </div>

            <div className="landing-showcase">
              {activeEntry ? (
                <>
                  <Link href="/archive" className="landing-showcase__image-link">
                    <div className="landing-showcase__frame">
                      {activeEntry.photo_url ? (
                        <img
                          key={activeEntry.id}
                          className="landing-showcase__image"
                          src={activeEntry.photo_url}
                          alt={activeTitle || ""}
                        />
                      ) : (
                        <div
                          key={activeEntry.id}
                          className="landing-showcase__image landing-showcase__image--placeholder"
                          role="img"
                          aria-label={t("homeShowcaseImageUnavailable")}
                        >
                          <span aria-hidden="true">✦</span>
                        </div>
                      )}
                      {activeCategory && (
                        <span className="landing-showcase__category" lang={language}>
                          {activeCategory}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="landing-showcase__meta">
                    <div className="landing-showcase__eyebrow-row">
                      <Link href="/archive" className="landing-showcase__eyebrow-link">
                        <p className="landing-showcase__eyebrow" lang={language}>
                          {t("homeFeaturedEntry")} <span aria-hidden="true">•</span> {activeProvince}
                        </p>
                      </Link>
                      <div
                        className="landing-showcase__dots"
                        role="group"
                        aria-label={t("homeShowcaseNavigation")}
                      >
                        {showcaseEntries.map((entry, index) => (
                          <button
                            key={entry.id}
                            type="button"
                            className={`landing-showcase__dot${index === activeShowcaseIndex ? " landing-showcase__dot--active" : ""}`}
                            aria-label={t("homeShowcaseEntry", { number: index + 1 })}
                            aria-current={index === activeShowcaseIndex ? "true" : undefined}
                            onClick={() => setActiveShowcaseIndex(index)}
                          />
                        ))}
                      </div>
                    </div>
                    <Link href="/archive" className="landing-showcase__text-link">
                      <h2
                        lang={
                          activeTitle === activeEntry.khmer_title && activeEntry.khmer_title
                            ? "km"
                            : language
                        }
                      >
                        {activeTitle}
                      </h2>
                      {activeEntry.title &&
                        activeEntry.khmer_title &&
                        activeEntry.title !== activeTitle && (
                          <p
                            className="landing-showcase__secondary-title"
                            lang={language === "km" ? "en" : "km"}
                          >
                            {language === "km" ? activeEntry.title : activeEntry.khmer_title}
                          </p>
                        )}
                      {activeDescription && (
                        <p
                          className="landing-showcase__excerpt"
                          lang={activeDescriptionLanguage}
                        >
                          {activeDescription}
                        </p>
                      )}
                    </Link>
                  </div>
                </>
              ) : (
                <div className="landing-showcase__empty">
                  <span className="landing-showcase__empty-mark" aria-hidden="true">✦</span>
                  <p lang={language}>
                    {t(
                      showcaseLoading
                        ? "homeShowcaseLoading"
                        : showcaseError
                          ? "homeShowcaseUnavailable"
                          : "homeShowcaseEmpty"
                    )}
                  </p>
                  <Link href="/archive" className="landing-button landing-button--secondary">
                    {t("homeSeeMoreArchive")} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </div>
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
          <ArchiveGrid previewLimit={4} showOwnerActions={false} />
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