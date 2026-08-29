// components/Navigation.js
//
// Archive and About are anchor links to homepage sections, since the
// homepage IS the collection (no separate /archive route). Sources isn't
// built yet, so it's left out of the nav for now rather than linking to
// an empty page — add it back once a Sources page/section exists.

import { collectionConfig } from "../collection.config.js";

export default function Navigation() {
  return (
    <header className="nav">
      <span className="nav-title">{collectionConfig.siteTitle}</span>
      <nav className="nav-links">
        <a href="#entries" className="nav-link">
          Archive
        </a>
        <a href="#about" className="nav-link">
          About
        </a>
      </nav>
    </header>
  );
}