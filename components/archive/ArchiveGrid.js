"use client";

// components/archive/ArchiveGrid.js
//
// Owns all search/filter state for the archive:
//  - query/activeCategory are the "live" values the input reflects instantly
//  - debouncedQuery is what's actually used to filter, so fast typing
//    doesn't recompute the list on every keystroke
//  - state round-trips to the URL (?q=...&category=...) via
//    history.replaceState, so a filtered view can be bookmarked/shared and
//    survives a refresh, without pulling in useSearchParams/Suspense
//    machinery for what's still a small, fully client-side dataset.

import { useEffect, useMemo, useState } from "react";
import { entries } from "../../lib/entries.js";
import { useDebouncedValue } from "../../lib/useDebouncedValue.js";
import EntryCard from "./EntryCard";
import SearchFilter from "./SearchFilter";

function readInitialStateFromURL() {
  if (typeof window === "undefined") return { query: "", category: "All" };
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "All",
  };
}

export default function ArchiveGrid() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hydrated, setHydrated] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 150);

  // Read ?q= and ?category= once on mount (client-only — avoids SSR/CSR
  // markup mismatches, since the server doesn't see the URL's query string).
  useEffect(() => {
    const initial = readInitialStateFromURL();
    setQuery(initial.query);
    setActiveCategory(initial.category);
    setHydrated(true);
  }, []);

  // Keep the URL in sync as filters change, without adding history entries
  // for every keystroke.
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (activeCategory !== "All") params.set("category", activeCategory);
    const search = params.toString();
    const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, "", url + window.location.hash);
  }, [debouncedQuery, activeCategory, hydrated]);

  const categories = useMemo(() => {
    const unique = new Set(entries.map((e) => e.category));
    return Array.from(unique).sort();
  }, []);

  const categoryCounts = useMemo(() => {
    return entries.reduce((counts, entry) => {
      counts[entry.category] = (counts[entry.category] ?? 0) + 1;
      return counts;
    }, {});
  }, []);

  const filteredEntries = useMemo(() => {
    const q = debouncedQuery.trim().normalize("NFC").toLowerCase();

    return entries.filter((entry) => {
      const matchesCategory =
        activeCategory === "All" || entry.category === activeCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const haystack = [
        entry.title,
        entry.khmerName,
        entry.description,
        entry.source,
        entry.place,
      ]
        .filter(Boolean)
        .map((field) => field.normalize("NFC"))
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [debouncedQuery, activeCategory]);

  return (
    <section id="archive" className="archive-grid">
      <SearchFilter
        categories={categories}
        categoryCounts={categoryCounts}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        query={query}
        onQueryChange={setQuery}
        resultCount={filteredEntries.length}
        totalCount={entries.length}
      />

      {filteredEntries.length === 0 ? (
        <p className="archive-grid__empty">
          No entries match your search. Try a different term or category. / មិនមានលទ្ធផលដែលផ្គូរដោយការស្វែងរក សូមពន្យាយពីត្រឹមត្រូវចំណាត់ចំណាតឬចំណាត់ថ្មី។
        </p>
      ) : (
        <div className="archive-grid__grid">
          {filteredEntries.map((entry, index) => (
            <EntryCard key={entry.id} entry={entry} reverse={index % 2 === 1} />
          ))}
        </div>
      )}
    </section>
  );
}
