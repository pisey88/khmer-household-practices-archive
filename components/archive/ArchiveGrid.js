"use client";

// components/archive/ArchiveGrid.js
//
// Owns all search/filter state for the archive:
//  - entries are fetched from Supabase on mount; a loading spinner and
//    error state are shown while the fetch is in flight or if it fails.
//  - query/activeCategory are the "live" values the input reflects instantly
//  - debouncedQuery is what's actually used to filter, so fast typing
//    doesn't recompute the list on every keystroke
//  - state round-trips to the URL (?q=...&category=...) via
//    history.replaceState, so a filtered view can be bookmarked/shared and
//    survives a refresh, without pulling in useSearchParams/Suspense
//    machinery for what's still a small dataset.

import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client.js";
import { useDebouncedValue } from "../../lib/useDebouncedValue.js";
import { useLanguage } from "../common/LanguageProvider.js";
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
  const { language, pick, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hydrated, setHydrated] = useState(false);

  // Supabase data states
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebouncedValue(query, 150);

  // Fetch entries from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchEntries() {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setError("Failed to create Supabase client.");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("entries")
        .select("*")
        .order("id", { ascending: false });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setEntries(data ?? []);
      setLoading(false);
    }

    fetchEntries();

    return () => {
      cancelled = true;
    };
  }, []);

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
  }, [entries]);

  const categoryCounts = useMemo(() => {
    return entries.reduce((counts, entry) => {
      counts[entry.category] = (counts[entry.category] ?? 0) + 1;
      return counts;
    }, {});
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = debouncedQuery
      .trim()
      .replace(/^("|')([\s\S]*)\1$/, "$2")
      .trim()
      .normalize("NFC")
      .toLowerCase();

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
        .map((field) => pick(field).normalize("NFC"))
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [debouncedQuery, activeCategory, entries, language, pick]);

  // --- Loading state ---
  if (loading) {
    return (
      <section id="archive" className="archive-grid">
        <p className="archive-grid__empty" style={{ textAlign: "center", padding: "3rem 0" }}>
          Loading entries…
        </p>
      </section>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <section id="archive" className="archive-grid">
        <p className="archive-grid__empty" style={{ textAlign: "center", padding: "3rem 0", color: "#b91c1c" }}>
          {error}
        </p>
      </section>
    );
  }

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
          {t("noResults")}
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
