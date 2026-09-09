// components/archive/EntryCard.js
//
// Renders one entry. `reverse` flips image/text sides — ArchiveGrid sets
// this by index so consecutive entries alternate direction.

import Image from "next/image";
import RevealOnScroll from "../common/RevealOnScroll.js";

export default function EntryCard({ entry, reverse }) {
  const number = String(entry.id).padStart(2, "0");

  return (
    <RevealOnScroll>
      <article className={`entry-card ${reverse ? "entry-card-reverse" : ""}`}>
        <div className="entry-image-wrap">
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="entry-image"
          />
        </div>

        <div className="entry-content">
          <p className="label entry-eyebrow">
            {number} / {entry.category}
          </p>
          <h3>{entry.title}</h3>
          <p className="entry-khmer">{entry.khmerName}</p>
          <p className="entry-description">{entry.description}</p>

          <dl className="entry-meta">
            <div>
              <dt className="label">Source</dt>
              <dd>{entry.source}</dd>
            </div>
            <div>
              <dt className="label">Place</dt>
              <dd>{entry.place}</dd>
            </div>
            <div>
              <dt className="label">Media</dt>
              <dd>{entry.media}</dd>
            </div>
          </dl>
        </div>
      </article>
    </RevealOnScroll>
  );
}
