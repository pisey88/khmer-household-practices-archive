// components/AboutCollection.js

import { collectionConfig } from "../collection.config.js";

export default function AboutCollection() {
  const entryCount = String(collectionConfig.entryCount).padStart(2, "0");

  return (
    <section id="about" className="about">
      <div className="about-text">
        <h2>About the Collection</h2>
        <p>
          This archive documents traditional household practices in{" "}
          {collectionConfig.province} Province before modern appliances
          became common. It preserves everyday knowledge about cooking,
          lighting, food preparation, rice processing, and clothing care
          through memories shared by grandparents and older community
          members.
        </p>
      </div>

      <div className="about-stats">
        <div className="stat stat-primary">
          <span className="stat-number">{entryCount}</span>
          <span className="label">Archive Entries</span>
        </div>
        <div className="stat">
          <span className="stat-number stat-number-sm">01</span>
          <span className="label">Province</span>
        </div>
        <div className="stat stat-phrase">
          <span className="stat-phrase-text">Generations of Memory</span>
        </div>
      </div>
    </section>
  );
}