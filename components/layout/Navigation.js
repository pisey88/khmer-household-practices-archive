// components/layout/Navigation.js
//
// Archive and About are anchor links to homepage sections, since the
// homepage IS the collection (no separate /archive route). Sources isn't
// built yet, so it's left out of the nav for now rather than linking to
// an empty page — add it back once a Sources page/section exists.

"use client";

import { collectionConfig } from "../../collection.config.js";
import { useLanguage } from "../common/LanguageProvider.js";
import LanguageToggle from "../common/LanguageToggle.js";

export default function Navigation() {
  const { t, pick } = useLanguage();

  return (
    <header className="nav">
      <span className="nav-title">{pick(collectionConfig.siteTitle)}</span>
      <div className="nav-right">
        <nav className="nav-links">
          <a href="#archive" className="nav-link">{t("navArchive")}</a>
          <a href="#about" className="nav-link">{t("navAbout")}</a>
        </nav>
        <LanguageToggle />
      </div>
    </header>
  );
}