"use client";

import ArchiveGrid from "../../components/archive/ArchiveGrid.js";
import Footer from "../../components/layout/Footer.js";
import { useLanguage } from "../../components/common/LanguageProvider.js";

export default function ArchivePage() {
  const { t } = useLanguage();

  return (
    <>
      <main className="archive-page archive-route">
        <header className="archive-route__heading">
          <p className="label">{t("homeExploreHeading")}</p>
          <h1>{t("archivePageTitle")}</h1>
          <p>{t("archivePageDescription")}</p>
        </header>
        <ArchiveGrid />
      </main>
      <Footer />
    </>
  );
}
