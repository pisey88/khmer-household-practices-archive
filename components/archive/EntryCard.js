// components/archive/EntryCard.js
import React from 'react';

export default function EntryCard({ entry, reverse = false }) {
  if (!entry) return null;

  return (
    <article className={`entry-card${reverse ? ' entry-card-reverse' : ''}${entry.photo_url ? '' : ' entry-card--no-image'}`}>
      {entry.photo_url && (
        <div className="entry-image-wrap">
          <img
            src={entry.photo_url}
            alt={entry.title || entry.khmer_title || ''}
            className="entry-image"
          />
        </div>
      )}

      <div className="entry-content">
        <div className="entry-card__body">
          <p className="entry-eyebrow">{entry.category}</p>
          <h3 className="entry-title">{entry.title || entry.khmer_title}</h3>

          {entry.khmer_title && entry.title !== entry.khmer_title && (
            <p className="entry-khmer" lang="km">{entry.khmer_title}</p>
          )}

          {entry.description && (
            <p className="entry-description">{entry.description}</p>
          )}
        </div>

        <dl className="entry-meta">
          <div className="entry-meta__item">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
            <dt>Contributor:</dt>
            <dd>{entry.contributor_name || 'Anonymous'}</dd>
          </div>
          <div className="entry-meta__item">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <dt>Province:</dt>
            <dd>{entry.province || 'N/A'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}