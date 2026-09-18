// components/layout/Navigation.js
//
// Archive and About are anchor links to homepage sections, since the
// homepage IS the collection (no separate /archive route). Sources isn't
// built yet, so it's left out of the nav for now rather than linking to
// an empty page — add it back once a Sources page/section exists.

"use client";

import { useLanguage } from "../common/LanguageProvider.js";
import LanguageToggle from "../common/LanguageToggle.js";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client.js";
import { useState, useEffect, useRef } from "react";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

export default function Navigation() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const handleHomeClick = (event) => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthError(true);
      return;
    }

    const supabase = createClient();
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    setNavOpen(false);
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "A";

  return (
    <header className="nav">
      <a href="/" className="nav-title" onClick={handleHomeClick}>
        {t("siteTitle")}
      </a>
      <button
        type="button"
        className="nav-hamburger"
        aria-label={t("navMenuLabel")}
        aria-expanded={navOpen}
        aria-controls="mobile-navigation"
        onClick={() => setNavOpen((isOpen) => !isOpen)}
      >
        <HamburgerIcon />
      </button>
      <div id="mobile-navigation" className={`nav-right ${navOpen ? "nav-right--open" : ""}`}>
        <nav className="nav-links">
          <a href="/" className="nav-link nav-link--active" onClick={(event) => { handleHomeClick(event); setNavOpen(false); }}>{t("navHome")}</a>
          <a href="#archive" className="nav-link" onClick={() => setNavOpen(false)}>{t("navArchive")}</a>
          <a href="#about" className="nav-link" onClick={() => setNavOpen(false)}>{t("navAbout")}</a>
          {authError ? (
            <span className="nav-auth-error">{t("navAuthUnavailable")}</span>
          ) : user ? (
            <div className="nav-profile" ref={profileRef}>
              <button
                type="button"
                className="nav-avatar"
                aria-label={t("profileMenuLabel")}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span>{userInitial}</span>
                <ChevronIcon />
              </button>
              {profileOpen && (
                <div className="nav-profile-menu" role="menu">
                  <p className="nav-profile-email">{user.email}</p>
                  <div className="nav-profile-divider" />
                  <button type="button" className="nav-profile-logout" onClick={handleLogout} role="menuitem">
                    {t("navLogout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-links">
              <a href="/login" className="nav-auth-link">{t("navLogin")}</a>
              <a href="/signup" className="nav-signup-link">{t("navSignup")}</a>
            </div>
          )}
        </nav>
        <div className="nav-actions-divider" aria-hidden="true" />
        <LanguageToggle />
      </div>
    </header>
  );
}