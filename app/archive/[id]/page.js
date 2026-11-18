"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../../lib/supabase/client.js";
import { CAMBODIAN_PROVINCES } from "../../../lib/provinces.js";
import { useLanguage } from "../../../components/common/LanguageProvider.js";
import Footer from "../../../components/layout/Footer.js";

function getTitlePreview(entry, language) {
  if (!entry) return null;

  if (language === "km" && entry.khmer_title) {
    return { text: entry.khmer_title, language: "km" };
  }
  if (language === "en" && entry.title) {
    return { text: entry.title, language: "en" };
  }
  if (entry.title) return { text: entry.title, language: "en" };
  if (entry.khmer_title) return { text: entry.khmer_title, language: "km" };
  return null;
}

export default function EntryDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { language, t } = useLanguage();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [adjacentEntries, setAdjacentEntries] = useState({
    previous: null,
    next: null,
  });
  const [navigationError, setNavigationError] = useState(false);
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchEntry() {
      setLoading(true);
      setEntry(null);
      setLoadError(null);
      setAdjacentEntries({ previous: null, next: null });
      setNavigationError(false);
      setImageUnavailable(false);

      if (!id) {
        setLoading(false);
        return;
      }
      if (!isSupabaseConfigured()) {
        setLoadError("archiveSupabaseNotConfigured");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setLoadError("archiveClientError");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("id", id)
          .eq("status", "published")
          .maybeSingle();

        if (cancelled) return;
        if (error) {
          console.error("Failed to fetch archive entry:", error.message);
          setLoadError(error.message || "entryLoadError");
        } else {
          setEntry(data);

          if (data) {
            try {
              const [previousResult, nextResult] = await Promise.all([
                supabase
                  .from("entries")
                  .select("id, title, khmer_title")
                  .eq("status", "published")
                  .gt("id", id)
                  .order("id", { ascending: true })
                  .limit(1)
                  .maybeSingle(),
                supabase
                  .from("entries")
                  .select("id, title, khmer_title")
                  .eq("status", "published")
                  .lt("id", id)
                  .order("id", { ascending: false })
                  .limit(1)
                  .maybeSingle(),
              ]);

              if (cancelled) return;

              if (previousResult.error || nextResult.error) {
                if (previousResult.error) {
                  console.error(
                    "Failed to fetch previous archive entry:",
                    previousResult.error.message
                  );
                }
                if (nextResult.error) {
                  console.error(
                    "Failed to fetch next archive entry:",
                    nextResult.error.message
                  );
                }
                setNavigationError(true);
              } else {
                setAdjacentEntries({
                  previous: previousResult.data,
                  next: nextResult.data,
                });
              }
            } catch (error) {
              if (cancelled) return;
              console.error("Failed to fetch adjacent archive entries:", error);
              setNavigationError(true);
            }
          }
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to fetch archive entry:", error);
        setLoadError("entryLoadError");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEntry();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const backLink = (
    <Link href="/archive" className="entry-detail__back" lang={language}>
      {t("entryBackToArchive")}
    </Link>
  );

  let pageContent;
  if (loading) {
    pageContent = (
      <div className="entry-detail__message">
        {backLink}
        <p>{t("archiveLoading")}</p>
      </div>
    );
  } else if (loadError) {
    pageContent = (
      <div className="entry-detail__message" role="alert">
        {backLink}
        <p>{t(loadError)}</p>
      </div>
    );
  } else if (!entry) {
    pageContent = (
      <div className="entry-detail__message">
        {backLink}
        <h1>{t("entryNotFound")}</h1>
      </div>
    );
  } else {
    const englishTitle = entry.title || "";
    const khmerTitle = entry.khmer_title || "";
    const title =
      language === "km"
        ? khmerTitle || englishTitle || t("cardNotAvailable")
        : englishTitle || khmerTitle || t("cardNotAvailable");
    const titleLanguage =
      language === "km" && khmerTitle
        ? "km"
        : englishTitle
          ? "en"
          : khmerTitle
            ? "km"
            : language;
    const description =
      language === "km"
        ? entry.description_km || entry.description
        : entry.description || entry.description_km;
    const descriptionLanguage =
      language === "km" && entry.description_km
        ? "km"
        : entry.description
          ? "en"
          : entry.description_km
            ? "km"
            : language;
    const contributorName =
      language === "km"
        ? entry.contributor_name_km || entry.contributor_name
        : entry.contributor_name || entry.contributor_name_km;
    const contributorLanguage =
      language === "km" && entry.contributor_name_km
        ? "km"
        : entry.contributor_name
          ? "en"
          : entry.contributor_name_km
            ? "km"
            : language;
    const category = entry.category || "";
    const categoryKey = `category${category.replace(/\s/g, "")}`;
    const categoryLabel = category
      ? t(categoryKey) === categoryKey
        ? category
        : t(categoryKey)
      : t("cardNotAvailable");
    const province = CAMBODIAN_PROVINCES.find(
      (item) => item.en === entry.province || item.km === entry.province
    );
    const displayProvince =
      language === "km"
        ? province?.km || entry.province
        : province?.en || entry.province;
    const photoUrl = entry.photo_url || entry.image_url;
    const previousTitle = getTitlePreview(adjacentEntries.previous, language);
    const nextTitle = getTitlePreview(adjacentEntries.next, language);

    pageContent = (
      <article className="entry-detail">
        <div className="entry-detail__topbar">
          {backLink}
          <nav
            className="entry-detail__breadcrumb"
            lang={language}
            aria-label={t("entryCollectionNavigation")}
          >
            <Link href="/archive">{t("archivePageTitle")}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{categoryLabel}</span>
          </nav>
        </div>

        <header className="entry-detail__content">
          <div className="entry-detail__tags">
            <span className="entry-detail__category" lang={language}>
              {categoryLabel}
            </span>
            <span className="entry-detail__province" lang={language}>
              {displayProvince || t("cardNotAvailable")}
            </span>
          </div>
          <h1 lang={titleLanguage}>{title}</h1>

          <dl className="entry-detail__contributor">
            <div>
              <dt lang={language}>{t("cardContributor")}</dt>
              <dd>
                <span lang={contributorLanguage}>
                  {contributorName || t("cardAnonymous")}
                </span>
              </dd>
            </div>
          </dl>
        </header>

        <figure className="entry-detail__photo-frame">
          {photoUrl && !imageUnavailable ? (
            <img
              src={photoUrl}
              alt={title}
              onError={() => setImageUnavailable(true)}
            />
          ) : (
            <div
              className="entry-detail__photo-fallback"
              role="img"
              aria-label={t("homeShowcaseImageUnavailable")}
            >
              <span aria-hidden="true">✦</span>
              <p>{t("homeShowcaseImageUnavailable")}</p>
            </div>
          )}
        </figure>

        <div className="entry-detail__stories">
          <section
            className="entry-detail__story"
            lang={descriptionLanguage}
          >
            <span className="entry-detail__story-index" aria-hidden="true">
              01
            </span>
            <h2 lang={language}>
              {t(
                descriptionLanguage === "km"
                  ? "contributeDescriptionKhmer"
                  : "contributeDescriptionEnglish"
              )}
            </h2>
            <p>{description || t("entryDescriptionUnavailable")}</p>
          </section>
        </div>
        {(adjacentEntries.previous ||
          adjacentEntries.next ||
          navigationError) && (
          <nav
            className={`entry-detail__navigation${
              !adjacentEntries.previous && adjacentEntries.next
                ? " entry-detail__navigation--next-only"
                : ""
            }`}
            aria-label={t("entryCollectionNavigation")}
          >
            {navigationError && (
              <p
                className="entry-detail__navigation-error"
                lang={language}
                role="status"
              >
                {t("entryNavigationError")}
              </p>
            )}
            {adjacentEntries.previous && (
              <Link
                href={`/archive/${adjacentEntries.previous.id}`}
                className="entry-detail__navigation-link entry-detail__navigation-link--previous"
              >
                <span className="entry-detail__navigation-label" lang={language}>
                  <span aria-hidden="true">←</span>
                  {t("entryPrevious")}
                </span>
                {previousTitle && (
                  <span
                    className="entry-detail__navigation-title"
                    lang={previousTitle.language}
                  >
                    {previousTitle.text}
                  </span>
                )}
              </Link>
            )}
            {adjacentEntries.next && (
              <Link
                href={`/archive/${adjacentEntries.next.id}`}
                className="entry-detail__navigation-link entry-detail__navigation-link--next"
              >
                <span className="entry-detail__navigation-label" lang={language}>
                  {t("entryNext")}
                  <span aria-hidden="true">→</span>
                </span>
                {nextTitle && (
                  <span
                    className="entry-detail__navigation-title"
                    lang={nextTitle.language}
                  >
                    {nextTitle.text}
                  </span>
                )}
              </Link>
            )}
          </nav>
        )}
      </article>
    );
  }

  return (
    <>
      <main className="archive-page entry-detail-page">{pageContent}</main>
      <Footer />
    </>
  );
}
