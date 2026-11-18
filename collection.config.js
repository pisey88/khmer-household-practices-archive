// collection.config.js
//
// Site-wide / collection-level info — things that describe the archive as
// a whole, not any single entry. The entry count is a hardcoded fallback
// used when Supabase isn't configured or the live fetch fails; the real
// count is fetched dynamically on the homepage.

export const collectionConfig = {
  siteTitle: "Khmer Household Archive",
  tagline: "Before Modern Appliances",
  description:
    "Everyday knowledge, tools, and memories from households in Kampong Speu Province, Cambodia.",

  province: "Kampong Speu",
  country: "Cambodia",

  // Fallback count — overridden by live Supabase fetch on the homepage.
  // Update this manually when the static entry count changes.
  entryCount: 5,
};