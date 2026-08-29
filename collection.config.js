// collection.config.js
//
// Site-wide / collection-level info — things that describe the archive as
// a whole, not any single entry. Keeping this separate from entries.js
// means the About section's stats stay in sync automatically instead of
// being hand-typed numbers that can drift out of date.

import { entries } from "./data/entries.js";

export const collectionConfig = {
  siteTitle: "Khmer Household Archive",
  tagline: "Before Modern Appliances",
  description:
    "Everyday knowledge, tools, and memories from households in Kampong Speu Province, Cambodia.",

  province: "Kampong Speu",
  country: "Cambodia",

  // Derived, not hand-typed — always accurate even as entries are added.
  entryCount: entries.length,
};