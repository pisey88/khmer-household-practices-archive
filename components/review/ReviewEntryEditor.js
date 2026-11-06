"use client";

import { useState } from "react";
import { CATEGORIES } from "../../lib/constants.js";
import { CAMBODIAN_PROVINCES } from "../../lib/provinces.js";
import { useLanguage } from "../common/LanguageProvider.js";

export default function ReviewEntryEditor({ entry, busy, onCancel, onSave }) {
  const { language, t } = useLanguage();
  const province = CAMBODIAN_PROVINCES.find(
    (item) => item.en === entry.province || item.km === entry.province
  )?.en;
  const [draft, setDraft] = useState({
    title: entry.title || "",
    khmer_title: entry.khmer_title || "",
    description: entry.description || "",
    category: entry.category || CATEGORIES[0],
    province: province || entry.province || "",
  });

  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (await onSave(entry, draft)) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="entry-edit-form">
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
        />
      </label>
      <label className="entry-edit-field">
        <span>{t("reviewDescriptionLabel")}</span>
        <textarea
          value={draft.description}
          onChange={(event) => updateField("description", event.target.value)}
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
      <div className="entry-edit-actions">
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
