"use client";

import { useLanguage } from "../common/LanguageProvider.js";

export default function EntryCard({ entry, reverse = false }) {
  if (!entry) return null;

  const { t } = useLanguage();
  const photoUrl = entry?.photo_url;
  const title = entry?.title || entry?.khmer_title || "";
  const khmerTitle = entry?.khmer_title;
  const category = entry?.category || "";
  const categoryKey = `category${category.replace(/\s/g, "")}`;
  const categoryLabel = t(categoryKey) === categoryKey ? category : t(categoryKey);
  const description = entry?.description;
  const contributorName = entry?.contributor_name;
  const province = entry?.province;

  return (
    <article
      className={`entry-card${reverse ? " entry-card-reverse" : ""}${
        photoUrl ? "" : " entry-card--no-image"
      }`}
    >
      {photoUrl && (
        <div className="entry-image-wrap">
          <img
            src={photoUrl}
            alt={title}
            className="entry-image"
          />
        </div>
      )}

      <div className="entry-content">
        <div className="entry-card__body">
          <p className="entry-eyebrow">{categoryLabel}</p>
          <h3 className="entry-title">{title}</h3>

          {khmerTitle && title !== khmerTitle && (
            <p className="entry-khmer" lang="km">
              {khmerTitle}
            </p>
          )}

          {description && (
            <p className="entry-description">{description}</p>
          )}
        </div>

        <dl className="entry-meta">
          <div className="entry-meta__item">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
            <dt>{t("cardContributor")}</dt>
            <dd>{contributorName || t("cardAnonymous")}</dd>
          </div>
          <div className="entry-meta__item">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <dt>{t("cardProvince")}</dt>
            <dd>{province || t("cardNotAvailable")}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}