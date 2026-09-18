// components/archive/AboutCollection.js

"use client";

import { collectionConfig } from "../../collection.config.js";
import { useLanguage } from "../common/LanguageProvider.js";
import RevealOnScroll from "../common/RevealOnScroll.js";

export default function AboutCollection() {
  const { t } = useLanguage();
  const entryCount = String(collectionConfig.entryCount).padStart(2, "0");

  return (
    <section id="about" className="about">
      <RevealOnScroll>
        <div className="about-text">
          <h2>{t("aboutHeading")}</h2>
          <p>{t("aboutBody")}</p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="about-stats">
          <div className="stat stat-primary">
            <span className="stat-number">{entryCount}</span>
            <span className="label">{t("statArchiveEntries")}</span>
          </div>
          <div className="stat">
            <span className="stat-number stat-number-sm">01</span>
            <span className="label">{t("statProvince")}</span>
          </div>
          <div className="stat stat-phrase">
            <span className="stat-phrase-text">{t("statGenerations")}</span>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
