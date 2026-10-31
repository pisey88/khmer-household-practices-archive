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

const actionButtonStyle = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  padding: "0.45rem 0.8rem",
  background: "var(--color-card-bg)",
  color: "var(--color-brown)",
  cursor: "pointer",
};

const MyEntriesCard = ({ entry, onEntryUpdated, onEntryDeleted }) => {
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: isReviewerData, error: reviewerError } = await supabase
      .rpc("is_reviewer");
    const isReviewer = !reviewerError && isReviewerData === true;

    const updatePayload = {
      title: draft.title.trim(),
      khmer_title: draft.khmer_title.trim(),
      category: draft.category,
      description: draft.description.trim(),
    };

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

    supabase
      .from("entries")
      .select("*")
      .eq("owner", user.id)
      .order("id", { ascending: false })
      .then(({ data: refreshedData, error: fetchError }) => {
        if (fetchError) {
          console.error("Failed to refresh entries:", fetchError);
        } else {
          onEntryUpdated(refreshedData ?? []);
        }
        setIsEditing(false);
        setIsSaving(false);
      });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("entries")
      .delete()
      .eq("id", entry.id)
      .select();

    if (error) {
      window.alert("Delete failed: " + error.message);
      return;
    }

    supabase
      .from("entries")
      .select("*")
      .eq("owner", user.id)
      .order("id", { ascending: false })
      .then(({ data: refreshedData, error: fetchError }) => {
        if (fetchError) {
          console.error("Failed to refresh entries:", fetchError);
        } else {
          onEntryDeleted(refreshedData ?? []);
        }
      });
  };

  const handleCancel = () => {
    setDraft({
      title: entry.title || "",
      khmer_title: entry.khmer_title || "",
      description: entry.description || "",
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
                <label htmlFor="edit-description">{t("cardDescription")}</label>
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
              {entry.photo_url && (
                <div className="my-entries__edit-photo">
                  <p className="my-entries__edit-photo-label">
                    {t("cardCurrentPhoto")}
                  </p>
                  <img
                    src={entry.photo_url}
                    alt=""
                    className="my-entries__edit-photo-image"
                  />
                </div>
              )}
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
      {isOwner && (
        <div className="my-entries__card-actions">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            style={actionButtonStyle}
          >
            {t("myEntriesEdit")}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={actionButtonStyle}
          >
            {t("myEntriesDelete")}
          </button>
        </div>
      )}
    </article>
  );
}

export default function MyEntriesPage() {
  const { language, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError("contributeAuthNotConfigured");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser ?? null);

      if (!sessionUser) {
        setLoading(false);
        return;
      }

      supabase
        .from("entries")
        .select("*")
        .eq("owner", sessionUser.id)
        .order("id", { ascending: false })
        .then(({ data: entriesData, error: fetchError }) => {
          if (fetchError) {
            setError(fetchError.message);
          } else {
            setEntries(entriesData ?? []);
          }
          setLoading(false);
        });
    });
  }, []);

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
            <h1 className="my-entries__title">{t("myEntriesTitle")}</h1>
            <p className="my-entries__empty" style={{ textAlign: "center", padding: "3rem 0" }}>
              <a href="/login" style={{ color: "#c86243" }}>{t("navLogin")}</a>
            </p>
          </>
        ) : entries.length === 0 ? (
          <>
            <h1 className="my-entries__title">{t("myEntriesTitle")}</h1>
            <p className="my-entries__empty" style={{ textAlign: "center", padding: "3rem 0" }}>
              {t("myEntriesEmpty")}
            </p>
          </>
        ) : (
          <>
            <h1 className="my-entries__title">{t("myEntriesTitle")}</h1>
            <div className="my-entries__grid">
              {entries.map((entry) => (
                <MyEntriesCard
                  key={entry.id}
                  entry={entry}
                  onEntryUpdated={setEntries}
                  onEntryDeleted={setEntries}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}