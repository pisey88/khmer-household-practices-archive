// components/archive/AboutCollection.js
//
// Enhanced About page with glassmorphism cards, 2×2 objectives grid,
// gold-left-border feature callout, scannable methodology table,
// and a prominent full-width CTA block.

"use client";

import { useLanguage } from "../common/LanguageProvider.js";
import RevealOnScroll from "../common/RevealOnScroll.js";

export default function AboutCollection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="about">
      {/* ── Hero Header ── */}
      <RevealOnScroll>
        <div className="about__hero-header">
          <h2 className="about__hero-heading">{t("aboutHeading")}</h2>
          <span className="about__badge">{t("aboutBadge")}</span>
        </div>
      </RevealOnScroll>

      {/* ── Glassmorphism Mission Card ── */}
      <RevealOnScroll>
        <div className="about__mission-glass">
          <p>{t("aboutMission")}</p>
        </div>
      </RevealOnScroll>

      {/* ── 2×2 Core Objectives Grid ── */}
      <RevealOnScroll>
        <div className="about__objectives-grid">
          {t("aboutObjectives").map((obj, idx) => (
            <div key={idx} className="about__objective-card">
              <span className="about__objective-number" aria-hidden="true">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p>{obj}</p>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      {/* ── Rooted in Tradition — Feature Callout ── */}
      <RevealOnScroll>
        <div className="about__callout-feature">
          <p>{t("aboutRootedTradition")}</p>
        </div>
      </RevealOnScroll>

      {/* ── Methodology Section ── */}
      <RevealOnScroll>
        <p className="about__methodology-header">{t("aboutMethodology")}</p>
        <table className="about__methodology-table">
          <thead>
            <tr>
              <th scope="col">{t("methodologyComponent1")}</th>
              <th scope="col">{t("methodologyComponent2")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("methodologyDetail1")}</td>
              <td>{t("methodologyDetail2")}</td>
            </tr>
            <tr>
              <td>{t("methodologyDetail3")}</td>
              <td>{t("methodologyDetail4")}</td>
            </tr>
            <tr>
              <td>{t("methodologyDetail5")}</td>
              <td>{t("methodologyDetail6")}</td>
            </tr>
          </tbody>
        </table>
      </RevealOnScroll>

      {/* ── Call to Action — Full-width CTA ── */}
      <RevealOnScroll>
        <div className="about__cta-card">
          <p>{t("aboutCallToAction")}</p>
          <a
            href="/contribute"
            className="about__cta-button"
            aria-label={t("navContribute")}
            rel="noopener noreferrer"
          >
            <span>Contribute an Entry</span>
            <span className="arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </RevealOnScroll>
    </section>
  );
}
