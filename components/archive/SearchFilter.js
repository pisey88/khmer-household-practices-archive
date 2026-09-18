"use client";

import { useLanguage } from "../common/LanguageProvider.js";

// components/archive/SearchFilter.js
//
// Presentational search + category-chip controls. ArchiveGrid owns all
// state (query, category, debouncing, URL sync) and passes it down —
// this component only renders and reports user input.

export default function SearchFilter({
  categories,
  categoryCounts,
  activeCategory,
  onCategoryChange,
  query,
  onQueryChange,
  resultCount,
  totalCount,
}) {
  const { t } = useLanguage();
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && query) {
      onQueryChange("");
    }
  };

  return (
    <div className="search-filter">
      <div className="search-filter__row">
        <input
          type="text"
          className="search-filter__input"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={t("searchAriaLabel")}
        />
        {query && (
          <button
            type="button"
            className="search-filter__clear"
            onClick={() => onQueryChange("")}
            aria-label={t("clearAriaLabel")}
          >
            ✕
          </button>
        )}
      </div>

      <div className="search-filter__chips" role="group" aria-label={t("filterAriaLabel")}>
        <button
          type="button"
          className={
            "search-filter__chip" + (activeCategory === "All" ? " search-filter__chip--active" : "")
          }
          onClick={() => onCategoryChange("All")}
        >
          {t("categoryAll")} <span className="search-filter__chip-count">({totalCount})</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={
              "search-filter__chip" +
              (activeCategory === cat ? " search-filter__chip--active" : "")
            }
            onClick={() => onCategoryChange(cat)}
          >
            {t(`category${cat.replace(/\s/g, "")}`)} <span className="search-filter__chip-count">({categoryCounts[cat] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* aria-live so screen reader users hear the result count update as
          they type or switch category, without needing to re-focus anything */}
      <p className="search-filter__count" aria-live="polite">
        {t("resultsFound", {
          count: resultCount,
          entries: resultCount === 1 ? "entry" : "entries",
        })}
      </p>
    </div>
  );
}
