"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client.js";
import { useLanguage } from "../../components/common/LanguageProvider.js";
import { CAMBODIAN_PROVINCES } from "../../lib/provinces.js";
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
              {entries.map((entry) => {
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

                return (
                  <article key={entry.id} className="my-entries__card">
                    <div className="my-entries__card-body">
                      <h2 className="my-entries__card-title">{title}</h2>
                      {khmerTitle && title !== khmerTitle && (
                        <p className="my-entries__card-khmer" lang="km">
                          {khmerTitle}
                        </p>
                      )}
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
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}