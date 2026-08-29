// components/EntryList.js

import EntryCard from "./EntryCard.js";
import RevealOnScroll from "./RevealOnScroll.js";
import { entries } from "../data/entries.js";

export default function EntryList() {
  return (
    <section id="entries" className="entry-list">
      {entries.map((entry, index) => (
        <RevealOnScroll key={entry.id}>
          <EntryCard entry={entry} reverse={index % 2 === 1} />
        </RevealOnScroll>
      ))}
    </section>
  );
}