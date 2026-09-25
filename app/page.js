"use client";

import { useEffect, useState } from "react";
import { collectionConfig } from "../collection.config.js";
import { createClient, isSupabaseConfigured } from "../lib/supabase/client.js";
import ArchiveGrid from "../components/archive/ArchiveGrid.js";
import { useLanguage } from "../components/common/LanguageProvider.js";

export default function HomePage() {
  const { t } = useLanguage();
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
            <p className="landing-badge">✦ KHMER HERITAGE ARCHIVE</p>
            <h1>Preserving Household Wisdom Before the Electrical Era</h1>
            <p className="landing-hero__description">
              {collectionConfig.description} We document the tools, techniques,
              and memories that made everyday life possible.
            </p>
            <div className="landing-actions">
              <a href="#archive" className="landing-button landing-button--primary">
                Explore Collection <span aria-hidden="true">↓</span>
              </a>
              <a href="/signup" className="landing-button landing-button--secondary">
                Submit a Practice <span aria-hidden="true">+</span>
              </a>
            </div>
          </div>
        </section>

        <section className="landing-stats" aria-label="Archive statistics">
          <div className="landing-stat">
            <span className="landing-stat__value">{String(displayCount).padStart(2, "0")}</span>
            <span className="landing-stat__label">Practices Archived</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat__value landing-stat__value--region">{collectionConfig.province}</span>
            <span className="landing-stat__label">Primary Region</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat__value">100%</span>
            <span className="landing-stat__label">Community Sourced</span>
          </div>
        </section>

        <section className="categories-section" aria-labelledby="categories-heading">
          <div className="section-heading">
            <p className="label">Explore the collection</p>
            <h2 id="categories-heading">Archive Categories</h2>
          </div>
          <div className="categories-grid">
            <a href="#archive" className="category-card">
              <span className="category-card__number">01</span>
              <h3>Food &amp; Cooking</h3>
              <p>Clay stoves, bamboo steamers, palm sugar processing</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="#archive" className="category-card">
              <span className="category-card__number">02</span>
              <h3>Lighting &amp; Energy</h3>
              <p>Resin torches, oil lamps, hearth upkeep</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="#archive" className="category-card">
              <span className="category-card__number">03</span>
              <h3>Rice &amp; Agriculture</h3>
              <p>Wooden mortars, grain storage, hand mills</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
            <a href="#archive" className="category-card">
              <span className="category-card__number">04</span>
              <h3>Crafts &amp; Tools</h3>
              <p>Rattan weaving, water jugs, bamboo traps</p>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <ArchiveGrid />

        <section className="contributor-cta" aria-labelledby="contributor-heading">
          <div>
            <p className="label contributor-cta__label">Keep the record alive</p>
            <h2 id="contributor-heading">Your household has a story worth keeping.</h2>
            <p>Help future generations understand the knowledge held in everyday things.</p>
          </div>
          <a href="/signup" className="landing-button landing-button--primary contributor-cta__button">Become a contributor <span aria-hidden="true">→</span></a>
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

          <nav className="landing-footer__column" aria-label="Explore">
            <p className="landing-footer__heading">{t("footerExplore")}</p>
            <a href="#top">{t("navHome")}</a>
            <a href="#archive">{t("footerArchiveCollection")}</a>
            <a href="#categories-heading">{t("footerCategories")}</a>
            <a href="#about">{t("navAbout")}</a>
          </nav>

          <nav className="landing-footer__column" aria-label="Contribute">
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
          <div className="landing-footer__badges" aria-label="Technology used">
            <span>{t("footerNextJs")}</span>
            <span>{t("footerSupabase")}</span>
          </div>
        </div>
      </footer>
    </>
  );
}