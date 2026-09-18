// components/archive/EntryCard.js
//
// Renders one entry. `reverse` flips image/text sides — ArchiveGrid sets
// this by index so consecutive entries alternate direction.

"use client";

import Image from "next/image";
import RevealOnScroll from "../common/RevealOnScroll.js";
import { useLanguage } from "../common/LanguageProvider.js";

export default function EntryCard({ entry, reverse }) {
  const { t, pick } = useLanguage();
  const number = String(entry.id).padStart(2, "0");
  const categoryKey = `category${entry.category.replace(/\s/g, "")}`;

  return (
    <RevealOnScroll>
      <article className={`entry-card ${reverse ? "entry-card-reverse" : ""}`}>
        <div className="entry-image-wrap">
          <Image
            src={entry.image}
            alt={pick(entry.title)}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, 50vw"
            className="entry-image"
          />
        </div>

        <div className="entry-content">
          <p className="label entry-eyebrow">
            {number} / {t(categoryKey)}
          </p>
          <h3>{pick(entry.title)}</h3>
          <p className="entry-khmer">{pick(entry.khmerName)}</p>
          <p className="entry-description">{pick(entry.description)}</p>

          <dl className="entry-meta">
            <div>
              <dt className="label">{t("cardSource")}</dt>
              <dd>{pick(entry.source)}</dd>
            </div>
            <div>
              <dt className="label">{t("cardPlace")}</dt>
              <dd>{pick(entry.place)}</dd>
            </div>
            <div>
              <dt className="label">{t("cardMedia")}</dt>
              <dd>{pick(entry.media)}</dd>
            </div>
          </dl>
        </div>
      </article>
    </RevealOnScroll>
  );
}