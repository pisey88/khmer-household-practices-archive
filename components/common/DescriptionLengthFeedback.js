"use client";

import { useLanguage } from "./LanguageProvider.js";
import { TRANSLATIONS } from "../../lib/i18n.js";
import {
  getTrimmedDescriptionLength,
  MIN_DESCRIPTION_LENGTH,
} from "../../lib/description.js";

function toKhmerNumerals(value) {
  const khmerDigits = "០១២៣៤៥៦៧៨៩";
  return String(value).replace(/\d/g, (digit) => khmerDigits[Number(digit)]);
}

export default function DescriptionLengthFeedback({ value, language: fieldLanguage }) {
  const { language, t } = useLanguage();
  const displayLanguage = fieldLanguage ?? language;
  const characterCount = getTrimmedDescriptionLength(value);
  const count = displayLanguage === "km" ? toKhmerNumerals(characterCount) : characterCount;
  const countLabel = fieldLanguage
    ? TRANSLATIONS[displayLanguage].descriptionCharacterCount.replace("{count}", count)
    : t("descriptionCharacterCount", { count });

  return (
    <p
      className={`description-character-count${characterCount >= MIN_DESCRIPTION_LENGTH ? " description-character-count--complete" : ""}`}
      lang={displayLanguage}
    >
      {countLabel}
    </p>
  );
}
