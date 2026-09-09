// components/archive/Hero.js

import { collectionConfig } from "../../collection.config.js";
import RevealOnScroll from "../common/RevealOnScroll.js";

export default function Hero() {
  return (
    <section className="hero">
      <RevealOnScroll>
        <p className="label">Traditional Household Practices</p>
        <h1>{collectionConfig.tagline}</h1>
        <p className="hero-description">{collectionConfig.description}</p>
        <p className="label hero-meta">
          {String(collectionConfig.entryCount).padStart(2, "0")} PRACTICES ·{" "}
          {collectionConfig.province.toUpperCase()} · {collectionConfig.country.toUpperCase()}
        </p>
        <a href="#archive" className="hero-cta">
          Explore the Collection <span aria-hidden="true">↓</span>
        </a>
      </RevealOnScroll>
    </section>
  );
}
