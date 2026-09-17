"use client";

// components/layout/Navigation.js
//
// Archive and About are anchor links to homepage sections, since the
// homepage IS the collection (no separate /archive route). Sources isn't
// built yet, so it's left out of the nav for now rather than linking to
// an empty page — add it back once a Sources page/section exists.

import { collectionConfig } from "../../collection.config.js";
import { useLanguage } from "../common/LanguageProvider.js";
import LanguageToggle from "../common/LanguageToggle.js";
import { useState, useEffect, useCallback } from "react";

const SECTIONS = [
  { id: "archive", labelKey: "Archive" },
  { id: "about", labelKey: "About" },
];

export default function Navigation() {
  const { t, pick } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const handleLinkClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = document.querySelector(".nav")?.offsetHeight ?? 0;
    const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-70% 0px -30% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`nav ${menuOpen ? "nav--open" : ""}`}>
      <span className="nav-title">{pick(collectionConfig.siteTitle)}</span>

      {/* Hamburger toggle for mobile */}
      <button
        className="nav-hamburger"
        type="button"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="nav-hamburger-bar" />
        <span className="nav-hamburger-bar" />
        <span className="nav-hamburger-bar" />
      </button>

      <div className={`nav-right ${menuOpen ? "nav-right--open" : ""}`}>
        <nav className="nav-links">
          {SECTIONS.map(({ id, labelKey }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link ${activeSection === id ? "nav-link--active" : ""}`}
              onClick={(e) => handleLinkClick(e, id)}
            >
              {t(labelKey)}
            </a>
          ))}
        </nav>
        <LanguageToggle />
      </div>
    </header>
  );
}