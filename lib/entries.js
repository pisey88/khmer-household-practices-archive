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
     slug: "rice-pounding-mortar",
     category: "Cooking",
     title: "Pounding Rice with a Mortar and Pestle",
     khmerName: "ស្វាគមន៍",
     description:
       "How Khmer families pounded rice using a large stone mortar and wooden pestle, a daily task before modern mills became common.",
     source: "Village Elder",
     place: "Kampong Speu",
     media: "Photography",
     image: "/images/entries/cooking-stove.jpg",
   },
   {
     id: 7,
     slug: "traditional-fish-sauce",
     category: "Food Preparation",
     title: "Making Traditional Fish Sauce",
     khmerName: "ទឹកត្រី",
     description:
       "How families fermented fish with salt over months to produce fish sauce, a staple condiment in every Khmer kitchen.",
     source: "Grandmother",
     place: "Kampong Speu",
     media: "Photography",
     image: "/images/entries/kerosene-lamp.jpg",
   },
   {
     id: 8,
     slug: "bamboo-basket-weaving",
     category: "Household Crafts",
     title: "Bamboo Basket Weaving",
     khmerName: "ប្រធាត់",
     description:
       "How villagers wove bamboo baskets for storing rice, carrying harvests, and daily household use.",
     source: "Local Craftsman",
     place: "Kampong Speu",
     media: "Photography",
     image: "/images/entries/rice-flour-machine.jpg",
   },
   {
     id: 9,
     slug: "clay-pot-cooking",
     category: "Cooking",
     title: "Cooking in Clay Pots",
     khmerName: "តុចាម",
     description:
       "How Khmer households cooked stews and soups in traditional clay pots over charcoal fires, a practice that shaped the flavor of everyday meals.",
     source: "Village Elder",
     place: "Kampong Speu",
     media: "Photography",
     image: "/images/entries/winnowing-rice.jpg",
   },
];
