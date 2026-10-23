"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client.js";
import { CATEGORIES } from "../../lib/constants.js";
import { CAMBODIAN_PROVINCES } from "../../lib/provinces.js";
import { useLanguage } from "../common/LanguageProvider.js";

const actionButtonStyle = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  padding: "0.45rem 0.8rem",
  background: "var(--color-card-bg)",
  color: "var(--color-brown)",
  cursor: "pointer",
};

export default function EntryCard({
  entry,
  reverse = false,
  onEntryDeleted,
  onEntryUpdated,
}) {
  const { language, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState({
    title: entry?.title || "",
    khmer_title: entry?.khmer_title || "",
    description: entry?.description || "",
    category: entry?.category || CATEGORIES[0],
  });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return undefined;

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Unable to read the current session:", error);
        return;
      }
      if (active) setCurrentUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setDraft({
      title: entry?.title || "",
      khmer_title: entry?.khmer_title || "",
      description: entry?.description || "",
      category: entry?.category || CATEGORIES[0],
    });
  }, [entry]);

  if (!entry) return null;

  const photoUrl = entry?.photo_url;
  const title = entry?.title || entry?.khmer_title || "";
  const khmerTitle = entry?.khmer_title;
  const category = entry?.category || "";
  const categoryKey = `category${category.replace(/\s/g, "")}`;
  const categoryLabel = t(categoryKey) === categoryKey ? category : t(categoryKey);
  const description = entry?.description;
  const contributorName = entry?.contributor_name;
  const contributorNameKhmer = entry?.contributor_name_km;
  const province = entry?.province;
  const displayProvince =
    language === "km"
      ? CAMBODIAN_PROVINCES.find(
          (item) => item.en === province || item.km === province
        )?.km || province
      : province;
  const displayContributor =
    language === "km"
      ? contributorNameKhmer || contributorName
      : contributorName || contributorNameKhmer;
  const isOwner = Boolean(
    currentUser?.id &&
      (currentUser.id === entry.owner || currentUser.id === entry.user_id)
  );

  const handleDelete = async () => {
    const supabase = createClient();
    if (!supabase) {
      window.alert("Delete failed: Supabase is not configured.");
      return;
    }

    const { data, error } = await supabase
      .from("entries")
      .delete()
      .eq("id", entry.id)
      .select();

    if (error) {
      window.alert("Delete failed: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      window.alert("Unauthorized: You do not have permission to delete this entry.");
      return;
    }

    onEntryDeleted?.(entry.id);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) {
      window.alert("Update failed: Supabase is not configured.");
      return;
    }

    setIsSaving(true);

    // Check if the current user is a reviewer; if not, reset status back to
    // pending so a curator must re-approve the updated content.
    let isReviewer = false;
    try {
      const { data: reviewerData, error: reviewerError } = await supabase
        .rpc("is_reviewer");
      isReviewer = !reviewerError && reviewerData === true;
    } catch {
      // RPC not available — safely default to non-reviewer.
    }

    const updatePayload = {
      title: draft.title,
      khmer_title: draft.khmer_title,
      description: draft.description,
      category: draft.category,
    };

    if (!isReviewer) {
      updatePayload.status = "pending";
    }

    const { data, error } = await supabase
      .from("entries")
      .update(updatePayload)
      .eq("id", entry.id)
      .select();
    setIsSaving(false);

    if (error) {
      window.alert("Update failed: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      window.alert("Unauthorized: You do not have permission to update this entry.");
      return;
    }

    onEntryUpdated?.(data[0]);
    setIsEditing(false);
  };

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
          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: "grid", gap: "0.6rem" }}>
              <label>
                Title
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Khmer title
                <input
                  lang="km"
                  value={draft.khmer_title}
                  onChange={(event) =>
                    setDraft({ ...draft, khmer_title: event.target.value })
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                />
              </label>
              <label>
                Category
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({ ...draft, category: event.target.value })
                  }
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" disabled={isSaving} style={actionButtonStyle}>
                  {isSaving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  style={actionButtonStyle}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="entry-title">{title}</h3>

              {khmerTitle && title !== khmerTitle && (
                <p className="entry-khmer" lang="km">
                  {khmerTitle}
                </p>
              )}

              {description && (
                <p className="entry-description">{description}</p>
              )}
            </>
          )}
        </div>

        {!isEditing && (
          <dl className="entry-meta">
            <div className="entry-meta__item">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
              <dt>{t("cardContributor")}</dt>
              <dd>
                {displayContributor || t("cardAnonymous")}
                {language !== "km" && contributorName && contributorNameKhmer && (
                  <span lang="km"> ({contributorNameKhmer})</span>
                )}
              </dd>
            </div>
            <div className="entry-meta__item">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <dt>{t("cardProvince")}</dt>
              <dd>{displayProvince || t("cardNotAvailable")}</dd>
            </div>
          </dl>
        )}

        {isOwner && !isEditing && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              style={actionButtonStyle}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={actionButtonStyle}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}