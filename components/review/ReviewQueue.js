// components/review/ReviewQueue.js
//
// Client component that owns the review queue state. Decisions go through the
// review_entry RPC. Reviewer edits are validated with is_reviewer and saved
// through the RLS-protected client. Sorting fetches pending entries in order.

"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client.js";
import { useLanguage } from "../common/LanguageProvider.js";
import {
  getTrimmedDescriptionLength,
  MIN_DESCRIPTION_LENGTH,
} from "../../lib/description.js";
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

  const handleDecision = async (entry, decision, feedback = "") => {
    setActionError(null);

    if (
      decision === "published" &&
      (!entry.title?.trim() ||
        !entry.khmer_title?.trim() ||
        getTrimmedDescriptionLength(entry.description || "") < MIN_DESCRIPTION_LENGTH ||
        getTrimmedDescriptionLength(entry.description_km || "") < MIN_DESCRIPTION_LENGTH)
    ) {
      setActionError(t("reviewTranslationsRequired"));
      return false;
    }

    if (decision === "returned" && !feedback.trim()) {
      setActionError(t("reviewFeedbackRequired"));
      return false;
    }

    if (!isSupabaseConfigured()) {
      setActionError(t("reviewFailed"));
      return false;
    }

    const supabase = createClient();
    if (!supabase) {
      setActionError(t("reviewFailed"));
      return false;
    }

    setBusyId(entry.id);

    try {
      const { data, error } =
        decision === "returned"
          ? await supabase.rpc("return_entry_with_feedback", {
              p_entry_id: entry.id,
              p_feedback: feedback.trim(),
            })
          : await supabase.rpc("review_entry", {
              entry_id: entry.id,
              decision,
            });

      if (error || data !== true) {
        setActionError(t("reviewFailed"));
        return false;
      }

      setEntries((current) => current.filter((item) => item.id !== entry.id));
      return true;
    } catch (error) {
      console.error("Failed to process review decision:", error);
      setActionError(t("reviewFailed"));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleEdit = async (entry, draft, photoFile) => {
    setActionError(null);

    if (getTrimmedDescriptionLength(draft.description) < MIN_DESCRIPTION_LENGTH) {
      setActionError(t("englishDescriptionTooShort"));
      return false;
    }
    if (!draft.khmer_title.trim()) {
      setActionError(t("entryKhmerTitleRequired"));
      return false;
    }
    if (
      getTrimmedDescriptionLength(draft.description_km) < MIN_DESCRIPTION_LENGTH
    ) {
      setActionError(t("khmerDescriptionTooShort"));
      return false;
    }
    if (!photoFile && !entry.photo_url && !entry.image_url) {
      setActionError(t("missingPhoto"));
      return false;
    }

    if (!isSupabaseConfigured()) {
      setActionError(t("reviewEditFailed"));
      return false;
    }

    const supabase = createClient();
    if (!supabase) {
      setActionError(t("reviewEditFailed"));
      return false;
    }

    setBusyId(entry.id);
    try {
      const { data: isReviewer, error: reviewerError } = await supabase.rpc(
        "is_reviewer"
      );
      if (reviewerError) {
        console.error("Unable to verify reviewer access for entry edit:", reviewerError);
        setActionError(t("reviewEditFailed"));
        return false;
      }
      if (isReviewer !== true) {
        setActionError(t("reviewEditUnauthorized"));
        return false;
      }

      const updatePayload = {
        title: draft.title.trim(),
        khmer_title: draft.khmer_title.trim(),
        description: draft.description.trim(),
        description_km: draft.description_km.trim() || null,
        contributor_name: draft.contributor_name.trim() || null,
        contributor_name_km: draft.contributor_name_km.trim() || null,
        category: draft.category,
        province: draft.province,
      };

      if (photoFile) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Unable to verify reviewer before uploading photo:", userError);
          setActionError(t("reviewEditFailed"));
          return false;
        }

        const extensionByType = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        };
        const filePath = `${user.id}/${crypto.randomUUID()}.${extensionByType[photoFile.type]}`;
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, photoFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);
        if (!publicUrlData?.publicUrl) {
          throw new Error("Unable to retrieve the public URL.");
        }
        updatePayload.photo_url = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("entries")
        .update(updatePayload)
        .eq("id", entry.id)
        .eq("status", "pending")
        .select();

      if (error) {
        console.error("Failed to save reviewer edits:", error);
        setActionError(t("reviewEditFailed"));
        return false;
      }
      if (!data || data.length === 0) {
        setActionError(t("reviewEditFailed"));
        return false;
      }

      setEntries((current) =>
        current.map((item) => (item.id === entry.id ? data[0] : item))
      );
      return true;
    } catch (error) {
      console.error("Failed to save reviewer edits:", error);
      setActionError(t("reviewEditFailed"));
      return false;
    } finally {
      setBusyId(null);
    }
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
        <div className="review-empty-state">
          <span className="review-empty-state__icon" aria-hidden="true">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          <p className="review-empty">{t("reviewEmpty")}</p>
          <a
            href="/my-entries"
            className="landing-button landing-button--primary review-empty-state__link"
          >
            {t("reviewAllEntries")}
            <span aria-hidden="true">→</span>
          </a>
        </div>
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
                onSaveEdit={handleEdit}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}