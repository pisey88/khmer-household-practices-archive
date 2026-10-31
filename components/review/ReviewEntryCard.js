// components/review/ReviewEntryCard.js
//
// One pending entry in the review queue. Displays everything a reviewer
// needs to decide, plus the Publish / Return buttons. Decisions are made by
// the parent (ReviewQueue) through the review_entry RPC — this card never
// touches the entries table itself.

"use client";

import { CAMBODIAN_PROVINCES } from "../../lib/provinces.js";
import { useLanguage } from "../common/LanguageProvider.js";

function formatSubmittedDate(value, language) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const locale = language === "km" ? "km-KH" : "en-US";
  // UTC keeps the server render and the browser render identical, so
  // hydration never sees a different date string.
  return date.toLocaleDateString(locale, {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReviewEntryCard({ entry, busy, onDecision }) {
  const { language, t } = useLanguage();

  const title = entry.title || entry.khmer_title || "";
  const khmerTitle = entry.khmer_title;
  const province = entry.province;
  const displayProvince =
    language === "km"
      ? CAMBODIAN_PROVINCES.find(
          (item) => item.en === province || item.km === province
        )?.km || province
      : province;

  return (
    <article className="review-card">
      {entry.photo_url && (
        <div className="review-card__media">
          <img
            src={entry.photo_url}
            alt={title}
            className="review-card__photo"
          />
        </div>
      )}

      <div className="review-card__body">
        <h2 className="review-card__title">{title}</h2>
        {khmerTitle && khmerTitle !== title && (
          <p className="review-card__khmer" lang="km">
            {khmerTitle}
          </p>
        )}

        {entry.description && (
          <p className="review-card__description">{entry.description}</p>
        )}

        <dl className="review-card__meta">
          <div className="review-card__meta-item">
            <dt>{t("reviewCategoryLabel")}</dt>
            <dd>{entry.category || t("cardNotAvailable")}</dd>
          </div>
          <div className="review-card__meta-item">
            <dt>{t("reviewProvinceLabel")}</dt>
            <dd>{displayProvince || t("cardNotAvailable")}</dd>
          </div>
          <div className="review-card__meta-item">
            <dt>{t("reviewAudioLabel")}</dt>
            <dd>
              {entry.audio_url ? (
                <audio controls preload="none" src={entry.audio_url}>
                  {t("reviewNoAudio")}
                </audio>
              ) : (
                t("reviewNoAudio")
              )}
            </dd>
          </div>
          <div className="review-card__meta-item">
            <dt>{t("reviewSubmittedLabel")}</dt>
            <dd>{formatSubmittedDate(entry.created_at, language)}</dd>
          </div>
        </dl>

        <div className="review-card__actions">
          <button
            type="button"
            className="review-button review-button--publish"
            disabled={busy}
            onClick={() => onDecision(entry, "published")}
          >
            {t("reviewPublish")}
          </button>
          <button
            type="button"
            className="review-button review-button--return"
            disabled={busy}
            onClick={() => onDecision(entry, "returned")}
          >
            {t("reviewReturn")}
          </button>
        </div>
      </div>
    </article>
  );
}