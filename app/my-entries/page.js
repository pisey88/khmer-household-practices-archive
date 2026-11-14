"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client.js";
import { useLanguage } from "../../components/common/LanguageProvider.js";
import { CAMBODIAN_PROVINCES } from "../../lib/provinces.js";
import { CATEGORIES } from "../../lib/constants.js";
import { TRANSLATIONS } from "../../lib/i18n.js";

const STATUS_STYLES = {
  pending: {
    color: "#b8935a",
    background: "rgba(184, 147, 90, 0.15)",
  },
  published: {
    color: "#4ade80",
    background: "rgba(74, 222, 128, 0.12)",
  },
  returned: {
    color: "#f87171",
    background: "rgba(248, 113, 113, 0.12)",
  },
};

function bilingualStatusLabel(status) {
  const key = `status${status.charAt(0).toUpperCase()}${status.slice(1)}`;
  const en = TRANSLATIONS.en[key] || status;
  const km = TRANSLATIONS.km[key] || status;
  return `${en} / ${km}`;
}

const MyEntriesCard = ({
  entry,
  canManageEntry,
  onEntryUpdated,
  onEntryDeleted,
}) => {
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [draft, setDraft] = useState({
    title: entry?.title || "",
    khmer_title: entry?.khmer_title || "",
    description: entry?.description || "",
    description_km: entry?.description_km || "",
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

  const title = entry?.title || entry?.khmer_title || "";
  const khmerTitle = entry?.khmer_title;
  const status = entry?.status || "pending";
  const st = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const category = entry?.category || "";
  const province = entry?.province;
  const displayProvince =
    language === "km"
      ? CAMBODIAN_PROVINCES.find(
          (item) => item.en === province || item.km === province
        )?.km || province
      : province;

  const isOwner = Boolean(
    currentUser?.id && (currentUser.id === entry.owner || currentUser.id === entry.user_id)
  );

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setPhotoFile(null);
      setPhotoError(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoFile(null);
      setPhotoError("contributeImageTooLarge");
      event.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoFile(null);
      setPhotoError("contributeImageInvalidType");
      event.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhotoError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (photoError) return;
    setIsSaving(true);

    const supabase = createClient();
    if (!supabase) {
      window.alert("Update failed: Supabase is not configured.");
      setIsSaving(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.alert("Update failed: Unable to verify the current user.");
      setIsSaving(false);
      return;
    }

    const { data: isReviewerData, error: reviewerError } = await supabase
      .rpc("is_reviewer");
    if (reviewerError) {
      console.error("Unable to check reviewer access:", reviewerError);
    }
    const isReviewer = !reviewerError && isReviewerData === true;

    if (user.id !== entry.owner && !isReviewer) {
      window.alert("Update failed: You do not have permission to edit this entry.");
      setIsSaving(false);
      return;
    }

    const updatePayload = {
      title: draft.title.trim(),
      khmer_title: draft.khmer_title.trim(),
      category: draft.category,
      description: draft.description.trim(),
      description_km: draft.description_km.trim() || null,
      photo_url: entry.photo_url || null,
    };

    if (photoFile) {
      try {
        const filePath = `${user.id}/${Date.now()}_${photoFile.name}`;
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
      } catch (uploadError) {
        console.error("Failed to upload replacement photo:", uploadError);
        window.alert(
          "Photo upload failed: " +
            (uploadError.message || "Please try again.")
        );
        setIsSaving(false);
        return;
      }
    }

    if (!isReviewer) {
      updatePayload.status = "pending";
    }

    const { data, error } = await supabase
      .from("entries")
      .update(updatePayload)
      .eq("id", entry.id)
      .select();

    if (error) {
      window.alert("Update failed: " + error.message);
      setIsSaving(false);
      return;
    }

    if (!data || data.length === 0) {
      window.alert("Update failed: No row was updated.");
      setIsSaving(false);
      return;
    }

    await onEntryUpdated();
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    const supabase = createClient();
    if (!supabase) {
      window.alert("Delete failed: Supabase is not configured.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      window.alert("Delete failed: Unable to verify the current user.");
      return;
    }

    const { data: reviewerData, error: reviewerError } =
      await supabase.rpc("is_reviewer");
    if (reviewerError) {
      console.error("Unable to check reviewer access:", reviewerError);
    }
    const isReviewer = !reviewerError && reviewerData === true;

    if (user.id !== entry.owner && !isReviewer) {
      window.alert("Delete failed: You do not have permission to delete this entry.");
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
      window.alert(
        "Delete failed: No row was deleted. Your database permissions may not allow this action."
      );
      return;
    }

    await onEntryDeleted();
  };

  const handleCancel = () => {
    setPhotoFile(null);
    setPhotoError(null);
    setDraft({
      title: entry.title || "",
      khmer_title: entry.khmer_title || "",
      description: entry.description || "",
      description_km: entry.description_km || "",
      category: entry.category || CATEGORIES[0],
    });
    setIsEditing(false);
  };

  if (!entry) return null;

  return (
    <article key={entry.id} className="my-entries__card">
      <div className="my-entries__card-body">
        <h2 className="my-entries__card-title">{title}</h2>
        {khmerTitle && title !== khmerTitle && (
          <p className="my-entries__card-khmer" lang="km">
            {khmerTitle}
          </p>
        )}
        {isEditing ? (
          <form onSubmit={handleSave} className="my-entries__edit-form">
            <div className="my-entries__edit-fields">
              <div className="my-entries__edit-field">
                <label htmlFor="edit-title">{t("cardTitle")}</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  required
                />
              </div>
              <div className="my-entries__edit-field">
                <label htmlFor="edit-khmer-title">{t("cardKhmerTitle")}</label>
                <input
                  type="text"
                  id="edit-khmer-title"
                  name="khmer_title"
                  lang="km"
                  value={draft.khmer_title}
                  onChange={(e) =>
                    setDraft({ ...draft, khmer_title: e.target.value })
                  }
                />
              </div>
              <div className="my-entries__edit-field">
                <label htmlFor="edit-category">{t("cardCategory")}</label>
                <select
                  id="edit-category"
                  name="category"
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-entries__edit-field">
                <label htmlFor="edit-description">{t("contributeDescriptionEnglish")}</label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                />
              </div>
              <div className="my-entries__edit-field">
                <label htmlFor="edit-description-km">{t("contributeDescriptionKhmer")}</label>
                <textarea
                  id="edit-description-km"
                  name="description_km"
                  lang="km"
                  rows={3}
                  value={draft.description_km}
                  onChange={(e) =>
                    setDraft({ ...draft, description_km: e.target.value })
                  }
                />
              </div>
              <div className="my-entries__edit-photo">
                {entry.photo_url && (
                  <>
                    <p className="my-entries__edit-photo-label">
                      {t("cardCurrentPhoto")}
                    </p>
                    <img
                      src={entry.photo_url}
                      alt=""
                      className="my-entries__edit-photo-image"
                    />
                  </>
                )}
                <div className="my-entries__edit-field my-entries__photo-field">
                  <label htmlFor={`edit-photo-${entry.id}`}>
                    {t("contributePhoto")}
                  </label>
                  <input
                    id={`edit-photo-${entry.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    disabled={isSaving}
                  />
                  <span className="my-entries__photo-hint">
                    {t("contributePhotoHint")}
                  </span>
                  {photoError && (
                    <span className="my-entries__photo-error" role="alert">
                      {t(photoError)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="my-entries__edit-actions">
              <button
                type="submit"
                disabled={isSaving}
                className="entry-action-button entry-action-button--save"
              >
                {isSaving ? t("myEntriesSaving") : t("myEntriesSave")}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="entry-action-button entry-action-button--cancel"
              >
                {t("myEntriesCancel")}
              </button>
            </div>
          </form>
        ) : (
          <>
            <dl className="my-entries__card-meta">
              <div className="my-entries__card-meta-item">
                <dt>{t("myEntriesStatus")}</dt>
                <dd>
                  <span
                    className="my-entries__status-badge"
                    style={{
                      color: st.color,
                      background: st.background,
                    }}
                  >
                    {bilingualStatusLabel(status)}
                  </span>
                </dd>
              </div>
              <div className="my-entries__card-meta-item">
                <dt>{t("cardCategory")}</dt>
                <dd>{category}</dd>
              </div>
              <div className="my-entries__card-meta-item">
                <dt>{t("cardProvince")}</dt>
                <dd>{displayProvince}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
      {(isOwner || canManageEntry) && (
        <div className="my-entries__card-actions">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="my-entries__action-button"
          >
            {t("myEntriesEdit")}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="my-entries__action-button my-entries__action-button--delete"
          >
            {t("myEntriesDelete")}
          </button>
        </div>
      )}
    </article>
  );
}

export default function MyEntriesPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [isReviewer, setIsReviewer] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured()) {
      setError("contributeAuthNotConfigured");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const supabase = createClient();

    const loadEntries = async () => {
      setLoading(true);
      setError(null);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Unable to read the current session:", sessionError);
        if (active) {
          setError(sessionError.message);
          setLoading(false);
        }
        return;
      }

      const sessionUser = sessionData.session?.user ?? null;
      if (active) setUser(sessionUser);
      if (!sessionUser) {
        if (active) {
          setIsReviewer(false);
          setShowAllEntries(false);
          setEntries([]);
          setLoading(false);
        }
        return;
      }

      const { data: reviewerData, error: reviewerError } =
        await supabase.rpc("is_reviewer");
      if (reviewerError) {
        console.error("Unable to check reviewer access:", reviewerError);
      }
      const reviewer = !reviewerError && reviewerData === true;
      if (active) {
        setIsReviewer(reviewer);
        if (!reviewer && showAllEntries) setShowAllEntries(false);
      }

      let query = supabase.from("entries").select("*");
      if (!(reviewer && showAllEntries)) {
        query = query.eq("owner", sessionUser.id);
      }

      const { data: entriesData, error: fetchError } = await query.order(
        "created_at",
        { ascending: false }
      );

      if (!active) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setEntries(entriesData ?? []);
      }
      setLoading(false);
    };

    loadEntries().catch((loadError) => {
      console.error("Failed to load entries:", loadError);
      if (active) {
        setError(loadError.message || "Unable to load entries.");
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [showAllEntries]);

  const refreshEntries = async () => {
    const supabase = createClient();
    if (!supabase) {
      setError("contributeAuthNotConfigured");
      return;
    }

    const {
      data: { user: sessionUser },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !sessionUser) {
      setError(userError?.message || "Unable to verify the current user.");
      return;
    }

    const { data: reviewerData, error: reviewerError } =
      await supabase.rpc("is_reviewer");
    if (reviewerError) {
      console.error("Unable to check reviewer access:", reviewerError);
    }
    const reviewer = !reviewerError && reviewerData === true;
    setIsReviewer(reviewer);
    if (!reviewer && showAllEntries) setShowAllEntries(false);

    let query = supabase.from("entries").select("*");
    if (!(reviewer && showAllEntries)) {
      query = query.eq("owner", sessionUser.id);
    }

    const { data: entriesData, error: fetchError } = await query.order(
      "created_at",
      { ascending: false }
    );
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEntries(entriesData ?? []);
      setError(null);
    }
  };

  const publishedCount = entries.filter((entry) => entry.status === "published").length;
  const pendingCount = entries.filter((entry) => entry.status === "pending").length;

  return (
    <main className="archive-page">
      <section className="my-entries">
        {loading ? (
          <p className="my-entries__empty" style={{ textAlign: "center", padding: "3rem 0" }}>
            {t("archiveLoading")}
          </p>
        ) : error ? (
          <p className="my-entries__empty" style={{ textAlign: "center", padding: "3rem 0", color: "#b91c1c" }}>
            {t(error)}
          </p>
        ) : !user ? (
          <>
            <header className="my-entries__header">
              <div>
                <h1 className="my-entries__title">{t("myEntriesTitle")}</h1>
                <p className="my-entries__description">{t("myEntriesDescription")}</p>
              </div>
            </header>
            <p className="my-entries__empty">
              <a href="/login" className="my-entries__login-link">{t("navLogin")}</a>
            </p>
          </>
        ) : (
          <>
            <header className="my-entries__header">
              <div>
                <h1 className="my-entries__title">
                  {t(showAllEntries ? "allEntriesTitle" : "myEntriesTitle")}
                </h1>
                <p className="my-entries__description">
                  {t(showAllEntries ? "allEntriesDescription" : "myEntriesDescription")}
                </p>
              </div>
              <div className="my-entries__header-actions">
                {isReviewer && (
                  <button
                    type="button"
                    className="my-entries__view-toggle"
                    aria-pressed={showAllEntries}
                    onClick={() => setShowAllEntries((showingAll) => !showingAll)}
                  >
                    {t(showAllEntries ? "myEntriesTitle" : "allEntriesTitle")}
                  </button>
                )}
                <a href="/contribute" className="landing-button landing-button--primary my-entries__add-button">
                  {t("navContribute")} <span aria-hidden="true">+</span>
                </a>
              </div>
            </header>

            <div className="my-entries__stats" aria-label={t("myEntriesSummary")}>
              <div className="my-entries__stat">
                <span className="my-entries__stat-value">{entries.length}</span>
                <span className="my-entries__stat-label">
                  {t(showAllEntries ? "allEntriesTotal" : "myEntriesTotal")}
                </span>
              </div>
              <div className="my-entries__stat">
                <span className="my-entries__stat-value">{publishedCount}</span>
                <span className="my-entries__stat-label">{t("statusPublished")}</span>
              </div>
              <div className="my-entries__stat">
                <span className="my-entries__stat-value">{pendingCount}</span>
                <span className="my-entries__stat-label">{t("statusPending")}</span>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className="my-entries__empty">
                <p>{t(showAllEntries ? "allEntriesEmpty" : "myEntriesEmpty")}</p>
                <a href="/contribute" className="landing-button landing-button--secondary">
                  {t("navContribute")} <span aria-hidden="true">→</span>
                </a>
              </div>
            ) : (
              <div className="my-entries__grid">
                {entries.map((entry) => (
                  <MyEntriesCard
                    key={entry.id}
                    entry={entry}
                    canManageEntry={isReviewer && showAllEntries}
                    onEntryUpdated={refreshEntries}
                    onEntryDeleted={refreshEntries}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}