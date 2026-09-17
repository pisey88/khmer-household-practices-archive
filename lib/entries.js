// lib/entries.js
//
// All archive entries. Every field here is required — the UI (EntryCard)
// assumes each one is present. Province is intentionally NOT repeated here
// since every entry is from the same province — that lives in
// collection.config.js instead.

export const entries = [
  {
    id: 1,
    slug: "cooking-with-charcoal-wood-stove",
    category: "Cooking",
    title: "Cooking with a Charcoal/Wood Stove",
    khmerName: "ចង្រ្កានដី",
    description:
      "How Khmer families cooked meals using charcoal or firewood, including the stove, fuel, cooking process, and types of food prepared.",
    source: "Village Elder",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/cooking-stove.jpg",
  },
  {
    id: 2,
    slug: "oil-lamps",
    category: "Lighting",
    title: "Lighting the House with Oil Lamps",
    khmerName: "ចង្កៀង",
    description:
      "How households lit their homes at night before electricity and electric lights became common.",
    source: "Village Elder",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/kerosene-lamp.jpg",
  },
  {
    id: 3,
    slug: "rice-flour-machine",
    category: "Food Preparation",
    title: "Making Rice Flour with a Traditional Khmer Machine",
    khmerName: "ត្បាល់កិនម្សៅ",
    description:
      "How rice was prepared and processed into flour using a traditional machine, including the steps and tools involved.",
    source: "Grandma",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/rice-flour-machine.jpg",
  },
  {
    id: 4,
    slug: "winnowing-rice",
    category: "Rice Processing",
    title: "Winnowing Rice by Basket",
    khmerName: "ចង្អេរ",
    description:
      "How people separated rice grains from husks and unwanted material using traditional hand-winnowing techniques.",
    source: "Grandparents",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/winnowing-rice.jpg",
  },
  {
    id: 5,
    slug: "charcoal-iron",
    category: "Clothing Care",
    title: "Ironing Clothes with a Charcoal Iron",
    khmerName: "ឆ្នាំងអុតធ្យុង",
    description:
      "How clothes were ironed using a traditional charcoal iron, including how it was heated and used safely.",
    source: "Grandma",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/charcoal-iron.jpg",
  },
  {
    id: 6,
    slug: "hand-dug-ring-well",
    category: "Water Management",
    title: "Hand-dug Ring Well",
    khmerName: "អណ្ដូងទឹក",
    description: "How Cambodian households hauled fresh groundwater every morning using a wooden pulley (Rokhah) and stone-weighted bucket from shared village wells.",
    source: "Village Elders",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/hand-dug-ring-well.jpg"
  },
  {
    id: 7,
    slug: "handwoven-reed-mat",
    category: "Household Crafts",
    title: "Handwoven Reed Mat",
    khmerName: "កន្ទេល",
    description: "How rural families harvested, dried, and handwove local wild reeds (Kramanh) on ground looms to craft multi-purpose mats for dining, sleeping, and receiving guests.",
    source: "Grandparents & Local Weavers",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/handwoven-reed-mat.jpg"
  },
  {
    id: 8,
    slug: "traditional-rice-noodle-press",
    category: "Food Preparation",
    title: "Traditional Rice Noodle Press",
    khmerName: "ប៉ែននំបញ្ចុក",
    description: "How neighbors collaborated to press fermented rice dough through a suspended wooden lever press (Paen) into boiling cauldrons to make fresh Nom Banh Chhok.",
    source: "អ្នកស្រី កែវច័ន្ទបូរណ៍",
    place: "Kampong Speu",
    media: "Photography",
    image: "/images/entries/traditional-rice-noodle-press.jpg"
  }
];
