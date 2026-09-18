export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "km"];

export const TRANSLATIONS = {
  en: {
    // Header & Navigation
    siteTitle: "Khmer Household Archive",
    navHome: "Home",
    navArchive: "Archive",
    navAbout: "About",
    languageToggleLabel: "Language",

    // Hero Section
    heroBadge: "Traditional Household Practices",
    heroTitle: "Before Modern Appliances",
    heroSubtitle: "Everyday knowledge, tools, and memories from households in Kampong Speu Province, Cambodia.",
    heroStatPractices: "{count} PRACTICES",
    heroStatProvince: "KAMPONG SPEU​ PROVINCE",
    heroStatCountry: "CAMBODIA",
    exploreCollection: "Explore the Collection ↓",

    // About Section
    aboutHeading: "About the Collection",
    aboutBody: "This archive documents traditional household practices in Kampong Speu Province before modern appliances became common. It preserves everyday knowledge about cooking, lighting, food preparation, rice processing, and clothing care through memories shared by grandparents and older community members.",
    statArchiveEntries: "Archive Entries",
    statProvince: "Province",
    statGenerations: "Generations of Memory",

    // Search & Filter
    searchPlaceholder: "Search entries (title, Khmer name, description)…",
    searchAriaLabel: "Search archive entries",
    clearAriaLabel: "Clear search",
    filterAriaLabel: "Filter by category",
    categoryAll: "All",
    categoryCooking: "Cooking",
    categoryLighting: "Lighting",
    categoryFoodPreparation: "Food Preparation",
    categoryRiceProcessing: "Rice Processing",
    categoryClothingCare: "Clothing Care",
    categoryWaterManagement: "Water Management",
    categoryHouseholdCrafts: "Household Crafts",
    resultsFound: "{count} {entries} found",
    noResults: "No entries match your search. Try a different term or category.",

    // Entry Card Labels
    cardSource: "Source",
    cardPlace: "Place",
    cardMedia: "Media",

    // Footer
    footerTagline: "Preserving everyday household knowledge from Kampong Speu, Cambodia, one memory at a time.",
  },

  km: {
    // Header & Navigation
    siteTitle: "បណ្ណសារគ្រួសារខ្មែរ",
    navHome: "ទំព័រដើម",
    navArchive: "បណ្ណសារ",
    navAbout: "អំពី",
    languageToggleLabel: "ភាសា",

    // Hero Section
    heroBadge: "ទំនៀមទម្លាប់ប្រចាំគ្រួសារតាមបែបបុរាណ",
    heroTitle: "មុនសម័យគ្រឿងបរិក្ខារទំនើប",
    heroSubtitle: "ចំណេះដឹងប្រចាំថ្ងៃ ឧបករណ៍ និងការចងចាំពីគ្រួសារក្នុងខេត្តកំពង់ស្ពឺនៃប្រទេសកម្ពុជា។",
    heroStatPractices: "{count} ប្រតិបត្តិការ",
    heroStatProvince: "ខេត្តកំពង់ស្ពឺ",
    heroStatCountry: "ប្រទេសកម្ពុជា",
    exploreCollection: "ស្វែករកបណ្ណសារ ↓",

    // About Section
    aboutHeading: "អំពីបណ្ណសារ",
    aboutBody: "បណ្ណសារនេះកត់ត្រានូវទំនៀមទម្លាប់ប្រចាំគ្រួសារបុរាណក្នុងខេត្តកំពង់ស្ពឺ មុនពេលគ្រឿងបរិក្ខារទំនើបក្លាយជាទូទៅ។ វាថែរក្សាចំណេះដឹងប្រចាំថ្ងៃអំពីការដាំស្ល ពន្លឺ ការរៀបចំអាហារ ការកែច្នៃស្រូវ និងការថែទាំសម្លៀកបំពាក់តាមរយៈការចងចាំរបស់លោកតា លោកយាយ និងសមាជិកសហគមន៍ចាស់ៗ។",
    statArchiveEntries: "ទិន្នន័យបណ្ណសារ",
    statProvince: "ខេត្ត",
    statGenerations: "ការចងចាំតជំនាន់",

    // Search & Filter
    searchPlaceholder: "ស្វែងរកបណ្ណសារ (ចំណងជើង, ឈ្មោះខេមរភាសា, ការពិពណ៌នា)…",
    searchAriaLabel: "ស្វែងរកទិន្នន័យបណ្ណសារ",
    clearAriaLabel: "លុបការស្វែងរក",
    filterAriaLabel: "តម្រៀបតាមប្រភេទ",
    categoryAll: "ទាំងអស់",
    categoryCooking: "ការដាំស្ល",
    categoryLighting: "ការបំភ្លឺ",
    categoryFoodPreparation: "ការរៀបចំអាហារ",
    categoryRiceProcessing: "ការកែច្នៃស្រូវ",
    categoryClothingCare: "ការថែទាំសម្លៀកបំពាក់",
    categoryWaterManagement: "ការគ្រប់គ្រងទឹក",
    categoryHouseholdCrafts: "សិប្បកម្មប្រចាំគ្រួសារ",
    resultsFound: "រកឃើញ {count} លទ្ធផល",
    noResults: "មិនមានលទ្ធផលដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។ សូមព្យាយាមពាក្យផ្សេង ឬជំពូកផ្សេង។",

    // Entry Card Labels
    cardSource: "ប្រភព",
    cardPlace: "ទីតាំង",
    cardMedia: "រូបភាព",

    // Footer
    footerTagline: "រក្សាចំណេះដឹងប្រចាំថ្ងៃពីខេត្តកំពង់ស្ពឺ ប្រទេសកម្ពុជា ម្ដងមួយការចងចាំ។",
  },
};

export function pick(field, language) {
  if (typeof field === "string") return field;
  if (field && typeof field === "object") {
    return field[language] ?? field[DEFAULT_LANGUAGE] ?? "";
  }
  return field;
}

export function t(language, key, vars = {}) {
  const value =
    TRANSLATIONS[language]?.[key] ?? TRANSLATIONS[DEFAULT_LANGUAGE]?.[key] ?? key;
  if (typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);
}