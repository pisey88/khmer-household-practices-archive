// components/review/ReviewQueue.js
//
// Client component that owns the review queue state. Decisions go through the
// review_entry RPC — the entries table is never updated directly here. The
// sort control re-fetches the pending queue through the same RLS-protected
// client, ordered by created_at in the chosen direction.

"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client.js";
import { useLanguage } from "../common/LanguageProvider.js";
import ReviewEntryCard from "./ReviewEntryCard.js";

// The two allowed sort directions for the pending queue. "asc" is the
// default and matches the server's initial fetch on app/review/page.js.
const SORT_OPTIONS = [
  { value: "asc", labelKey: "reviewSortOldestEntry" },
  { value: "desc", labelKey: "reviewSortNewestEntry" },
];

export default function ReviewQueue({ initialEntries }) {
  const { t } = useLanguage();
  const [entries, setEntries] = useState(initialEntries || []);
  const [sortOrder, setSortOrder] = useState("asc"); // asc = oldest first
  const [isOpen, setIsOpen] = useState(false); // dropdown visibility
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const latestRequest = useRef(0);
  const dropdownRef = useRef(null);

  // Re-fetch the pending queue from Supabase with the requested order, so the
  // list reflects the live queue (other reviewers may have decided entries in
  // between) rather than a local re-sort of the initial snapshot.
  const fetchPendingEntries = async (order) => {
    const requestId = ++latestRequest.current;
    setActionError(null);

    if (!isSupabaseConfigured()) {
      if (requestId === latestRequest.current) setActionError(t("reviewFailed"));
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      if (requestId === latestRequest.current) setActionError(t("reviewFailed"));
      return;
    }

    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: order === "asc" });

    // Ignore stale responses if the reviewer switched sort again mid-flight.
    if (requestId !== latestRequest.current) return;

    if (error) {
      setActionError(t("reviewFailed"));
      return;
    }

    setEntries(data ?? []);
  };

  // Close the dropdown when clicking anywhere outside of it.
  useEffect(() => {
    function handleClickOutside(event) {
      if (!isOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSortChange = (order) => {
    if (order === sortOrder) return;
    setSortOrder(order);
    setIsOpen(false);
    fetchPendingEntries(order);
  };

  const handleDecision = async (entry, decision) => {
    setActionError(null);

    if (!isSupabaseConfigured()) {
      setActionError(t("reviewFailed"));
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setActionError(t("reviewFailed"));
      return;
    }

    setBusyId(entry.id);

    const { data, error } = await supabase.rpc("review_entry", {
      entry_id: entry.id,
      decision,
    });

    setBusyId(null);

    if (error || data !== true) {
      setActionError(t("reviewFailed"));
      return;
    }

    setEntries((current) => current.filter((item) => item.id !== entry.id));
  };

  return (
    <main className="review-page">
      <h1 className="review-title">{t("reviewTitle")}</h1>

      {actionError && (
        <p className="review-error" role="alert">
          {actionError}
        </p>
      )}

      {entries.length === 0 ? (
        <p className="review-empty">{t("reviewEmpty")}</p>
      ) : (
        <>
          <div
            className="review-sort"
            role="group"
            aria-label={t("reviewSortAriaLabel")}
            ref={dropdownRef}
          >
            <button
              type="button"
              className="review-sort__trigger"
              aria-haspopup="true"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{t("reviewSortBy")}</span>
              <svg
                className="review-sort__icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 9l9 7 9-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="review-sort__dropdown" role="menu">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      "review-sort__option" +
                      (sortOrder === option.value ? " review-sort__option--active" : "")
                    }
                    role="menuitemradio"
                    aria-checked={sortOrder === option.value}
                    onClick={() => handleSortChange(option.value)}
                  >
                    <span className="review-sort__option-label">
                      {t(option.labelKey)}
                    </span>
                    {sortOrder === option.value && (
                      <svg
                        className="review-sort__check"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="review-list">
            {entries.map((entry) => (
              <ReviewEntryCard
                key={entry.id}
                entry={entry}
                busy={busyId === entry.id}
                onDecision={handleDecision}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}