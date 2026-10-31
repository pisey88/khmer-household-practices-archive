// components/archive/AboutCollection.js
//
// About page for the Khmer Living Archive.
// Museum-grade dark editorial layout, fully bilingual via useLanguage().
//
// Structure (top → bottom):
//   1. Hero header — amber eyebrow pill + serif title
//   2. Mission statement — glassmorphic hero card
//   3. Core objectives — 2×2 card grid with numbered badges
//   4. Kampong Speu roots — gradient feature callout with gold left border
//   5. Methodology — clean documentation standards grid
//   6. Call to action — full-width banner with glowing amber button

"use client";

import { useLanguage } from "../common/LanguageProvider.js";
import RevealOnScroll from "../common/RevealOnScroll.js";

export default function AboutCollection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="about">
      {/* ── 1. Hero Header ── */}
      <RevealOnScroll>
        <div className="about__hero">
          <span className="about__eyebrow" aria-hidden="true">
            {t("aboutBadge")}
          </span>
          <h1 className="about__title">{t("aboutHeading")}</h1>
        </div>
      </RevealOnScroll>

      {/* ── 2. Mission — Glassmorphic Card ── */}
      <RevealOnScroll>
        <div className="about__mission">
          <p>{t("aboutMission")}</p>
        </div>
      </RevealOnScroll>

      {/* ── 3. Core Objectives — 2×2 Grid ── */}
      <RevealOnScroll>
        <div className="about__objectives">
          {t("aboutObjectives").map((obj, idx) => (
            <article key={idx} className="about__objective">
              <span className="about__objective-number" aria-hidden="true">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p>{obj}</p>
            </article>
          ))}
        </div>
      </RevealOnScroll>

      {/* ── 4. Rooted in Tradition — Feature Callout ── */}
      <RevealOnScroll>
        <div className="about__callout">
          <p>{t("aboutRootedTradition")}</p>
        </div>
      </RevealOnScroll>

      {/* ── 5. Methodology & Documentation Standards ── */}
      <RevealOnScroll>
        <div className="about__methodology">
          <p className="about__methodology-intro">{t("aboutMethodology")}</p>
          <dl className="about__methodology-grid">
            <div className="about__methodology-row">
              <dt>{t("methodologyDetail1")}</dt>
              <dd>{t("methodologyDetail2")}</dd>
            </div>
            <div className="about__methodology-row">
              <dt>{t("methodologyDetail3")}</dt>
              <dd>{t("methodologyDetail4")}</dd>
            </div>
            <div className="about__methodology-row">
              <dt>{t("methodologyDetail5")}</dt>
              <dd>{t("methodologyDetail6")}</dd>
            </div>
          </dl>
        </div>
      </RevealOnScroll>

      {/* ── 6. Call to Action — Full-width Banner ── */}
      <RevealOnScroll>
        <div className="about__cta">
          <p>{t("aboutCallToAction")}</p>
          <a
            href="/contribute"
            className="about__cta-button"
            aria-label={t("navContribute")}
          >
            <span>{t("contributeCtaButton")}</span>
            <span className="about__cta-arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </RevealOnScroll>
    </section>
  );
}
