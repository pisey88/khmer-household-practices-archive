// components/archive/Hero.js

"use client";

import { collectionConfig } from "../../collection.config.js";
import { useLanguage } from "../common/LanguageProvider.js";
import RevealOnScroll from "../common/RevealOnScroll.js";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <RevealOnScroll>
        <p className="label">{t("heroBadge")}</p>
        <h1>{t("heroTitle")}</h1>
        <p className="hero-description">{t("heroSubtitle")}</p>
        <p className="label hero-meta">
          {t("heroStatPractices", {
            count: String(collectionConfig.entryCount).padStart(2, "0"),
          })} · {t("heroStatProvince")} · {t("heroStatCountry")}
        </p>
        <a href="#archive" className="hero-cta">
          {t("exploreCollection")} <span aria-hidden="true">↓</span>
        </a>
      </RevealOnScroll>
    </section>
  );
}
