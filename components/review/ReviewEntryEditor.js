"use client";

import { useState } from "react";
import { CATEGORIES } from "../../lib/constants.js";
import { CAMBODIAN_PROVINCES } from "../../lib/provinces.js";
import { useLanguage } from "../common/LanguageProvider.js";
import DescriptionLengthFeedback from "../common/DescriptionLengthFeedback.js";
import {
  getTrimmedDescriptionLength,
  MIN_DESCRIPTION_LENGTH,
} from "../../lib/description.js";

export default function ReviewEntryEditor({ entry, busy, onCancel, onSave }) {
  const { language, t } = useLanguage();
  const existingPhotoUrl = entry.photo_url || entry.image_url || null;
  const province = CAMBODIAN_PROVINCES.find(
    (item) => item.en === entry.province || item.km === entry.province
  )?.en;
  const [draft, setDraft] = useState({
    title: entry.title || "",
    khmer_title: entry.khmer_title || "",
    description: entry.description || "",
    description_km: entry.description_km || "",
    contributor_name: entry.contributor_name || "",
    contributor_name_km: entry.contributor_name_km || "",
    category: entry.category || CATEGORIES[0],
    province: province || entry.province || "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    const errorResolved =
      (validationError === "entryTitleRequired" &&
        field === "title" &&
        value.trim()) ||
      (validationError === "entryKhmerTitleRequired" &&
        field === "khmer_title" &&
        value.trim()) ||
      (validationError === "englishDescriptionTooShort" &&
        field === "description" &&
        getTrimmedDescriptionLength(value) >= MIN_DESCRIPTION_LENGTH) ||
      (validationError === "khmerDescriptionTooShort" &&
        field === "description_km" &&
        getTrimmedDescriptionLength(value) >= MIN_DESCRIPTION_LENGTH) ||
      (validationError === "entryProvinceRequired" &&
        field === "province" &&
        value.trim());
    if (errorResolved) setValidationError(null);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setPhotoFile(null);
      setPhotoError(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoFile(null);
      setPhotoError("contributeImageInvalidType");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoFile(null);
      setPhotoError("contributeImageTooLarge");
      event.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhotoError(null);
    if (validationError === "missingPhoto") setValidationError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let nextValidationError = null;
    if (!draft.title.trim()) {
      nextValidationError = "entryTitleRequired";
    } else if (!draft.khmer_title.trim()) {
      nextValidationError = "entryKhmerTitleRequired";
    } else if (getTrimmedDescriptionLength(draft.description) < MIN_DESCRIPTION_LENGTH) {
      nextValidationError = "englishDescriptionTooShort";
    } else if (
      getTrimmedDescriptionLength(draft.description_km) < MIN_DESCRIPTION_LENGTH
    ) {
      nextValidationError = "khmerDescriptionTooShort";
    } else if (!draft.province.trim()) {
      nextValidationError = "entryProvinceRequired";
    } else if (!photoFile && !existingPhotoUrl) {
      nextValidationError = "missingPhoto";
    }

    setValidationError(nextValidationError);
    if (nextValidationError || photoError) return;
    if (await onSave(entry, draft, photoFile)) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="entry-edit-form" noValidate>
      {validationError && (
        <p className="contribute-error" role="alert">
          {t(validationError)}
        </p>
      )}
      <label className="entry-edit-field">
        <span>{t("contributeTitleEnglish")}</span>
        <input
          value={draft.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
        />
      </label>
      <label className="entry-edit-field">
        <span>{t("reviewTitleKhmer")}</span>
        <input
          lang="km"
          value={draft.khmer_title}
          onChange={(event) => updateField("khmer_title", event.target.value)}
          required
        />
      </label>
      <div className="entry-edit-field entry-edit-field--description">
        <label htmlFor="review-description">
          <span>{t("contributeDescriptionEnglish")}</span>
        </label>
        <textarea
          id="review-description"
          value={draft.description}
          required
          minLength={MIN_DESCRIPTION_LENGTH}
          onChange={(event) => updateField("description", event.target.value)}
        />
        <DescriptionLengthFeedback value={draft.description} />
      </div>
      <div className="entry-edit-field entry-edit-field--description">
        <label htmlFor="review-description-km">
          <span>{t("contributeDescriptionKhmer")}</span>
        </label>
        <textarea
          id="review-description-km"
          lang="km"
          value={draft.description_km}
          required
          minLength={MIN_DESCRIPTION_LENGTH}
          onChange={(event) => updateField("description_km", event.target.value)}
        />
        <DescriptionLengthFeedback value={draft.description_km} />
      </div>
      <label className="entry-edit-field">
        <span>{t("contributeNameEnglish")}</span>
        <input
          value={draft.contributor_name}
          onChange={(event) => updateField("contributor_name", event.target.value)}
        />
      </label>
      <label className="entry-edit-field">
        <span>{t("contributeNameKhmer")}</span>
        <input
          lang="km"
          value={draft.contributor_name_km}
          onChange={(event) => updateField("contributor_name_km", event.target.value)}
        />
      </label>
      <label className="entry-edit-field">
        <span>{t("reviewCategoryLabel")}</span>
        <select
          value={draft.category}
          onChange={(event) => updateField("category", event.target.value)}
        >
          {!CATEGORIES.includes(draft.category) && (
            <option value={draft.category}>{draft.category}</option>
          )}
          {CATEGORIES.map((category) => {
            const key = `category${category.replace(/\s/g, "")}`;
            const label = t(key);
            return (
              <option key={category} value={category}>
                {label === key ? category : label}
              </option>
            );
          })}
        </select>
      </label>
      <label className="entry-edit-field">
        <span>{t("reviewProvinceLabel")}</span>
        <select
          value={draft.province}
          onChange={(event) => updateField("province", event.target.value)}
          required
        >
          <option value="" disabled>
            {t("reviewSelectProvince")}
          </option>
          {draft.province &&
            !CAMBODIAN_PROVINCES.some((item) => item.en === draft.province) && (
              <option value={draft.province}>{draft.province}</option>
            )}
          {CAMBODIAN_PROVINCES.map((item) => (
            <option key={item.en} value={item.en}>
              {language === "km" ? item.km : item.en}
            </option>
          ))}
        </select>
      </label>
      <div className="entry-edit-field entry-edit-field--photo">
        <span>{t("contributePhoto")}</span>
        {existingPhotoUrl && (
          <img
            src={existingPhotoUrl}
            alt=""
            className="my-entries__edit-photo-image"
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          disabled={busy}
        />
        {photoError && (
          <p className="description-length-error" role="alert">
            {t(photoError)}
          </p>
        )}
      </div>
      <div className="entry-edit-actions entry-edit-actions--full">
        <button
          type="submit"
          disabled={busy}
          className="entry-action-button entry-action-button--save"
        >
          {busy ? t("reviewSavingEdits") : t("reviewSaveEdits")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="entry-action-button entry-action-button--cancel"
        >
          {t("reviewCancelEdit")}
        </button>
      </div>
    </form>
  );
}
