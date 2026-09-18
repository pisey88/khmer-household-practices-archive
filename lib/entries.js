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
    title: { en: "Cooking with a Charcoal Stove", km: "ការដាំស្លដោយចង្ក្រានធ្យូង" },
    khmerName: "ចង្រ្កានដី",
    description: { en: "How Khmer families cooked meals using charcoal, including the stove, fuel, cooking process, and types of food prepared.", km: "របៀបគ្រួសារខ្មែរដាំស្លដោយប្រើធ្យូង រួមមានចង្ក្រាន ឥន្ធនៈ ដំណើរការដាំស្ល និងប្រភេទម្ហូបដែលបានរៀបចំ។" },
    source: { en: "Grandma SAY NAI", km: "លោកយាយ​ សាយណៃ" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/cooking-stove.jpg",
  },
  {
    id: 2,
    slug: "oil-lamps",
    category: "Lighting",
    title: { en: "Lighting the House with Oil Lamps", km: "បំភ្លឺផ្ទះដោយចង្កៀងប្រេង" },
    khmerName: "ចង្កៀង",
    description: { en: "How households lit their homes at night before electricity and electric lights became common.", km: "របៀបគ្រួសារបំភ្លឺផ្ទះនៅពេលយប់ មុនពេលអគ្គិសនី និងអំពូលអគ្គិសនីក្លាយជារឿងទូទៅ។" },
    source: { en: "Grandpa OU LY", km: "លោកតា​​ អ៊ូ​លី" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/kerosene-lamp.jpg",
  },
  {
    id: 3,
    slug: "rice-flour-machine",
    category: "Food Preparation",
    title: { en: "Making Rice Flour with a Traditional Khmer Machine", km: "កិនម្សៅអង្ករដោយម៉ាស៊ីនខ្មែរបុរាណ" },
    khmerName: "ត្បាល់កិនម្សៅ",
    description: { en: "How rice was prepared and processed into flour using a traditional machine, including the steps and tools involved.", km: "របៀបរៀបចំ និងកែច្នៃអង្ករទៅជាម្សៅដោយប្រើម៉ាស៊ីនបុរាណ រួមទាំងជំហាន និងឧបករណ៍ដែលពាក់ព័ន្ធ។" },
    source: { en: "Grandma SAY NAI", km: "លោកយាយ សាយណៃ" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/rice-flour-machine.jpg",
  },
  {
    id: 4,
    slug: "winnowing-rice",
    category: "Rice Processing",
    title: { en: "Winnowing Rice by Basket", km: "បក់អង្ករដោយចង្អេរ" },
    khmerName: "ចង្អេរ",
    description: { en: "How people separated rice grains from husks and unwanted material using traditional hand-winnowing techniques.", km: "របៀបបំបែកគ្រាប់អង្ករចេញពីអង្កាម និងវត្ថុមិនត្រូវការដោយប្រើបច្ចេកទេសបក់ដោយដៃបែបបុរាណ។" },
    source: { en: "Grandma SAY NAI", km: "លោកយាយ សាយណៃ" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/winnowing-rice.jpg",
  },
  {
    id: 5,
    slug: "charcoal-iron",
    category: "Clothing Care",
    title: { en: "Ironing Clothes with a Charcoal Iron", km: "អ៊ុតសម្លៀកបំពាក់ដោយធ្យុងធ្យូង" },
    khmerName: "ឆ្នាំងអុតធ្យុង",
    description: { en: "How clothes were ironed using a traditional charcoal iron, including how it was heated and used safely.", km: "របៀបអ៊ុតសម្លៀកបំពាក់ដោយប្រើធ្យុងធ្យូងបុរាណ រួមទាំងការដុតកម្ដៅ និងការប្រើប្រាស់ដោយសុវត្ថិភាព។" },
    source: { en: "Grandma SAY NAI", km: "លោកយាយ សាយណៃ" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/charcoal-iron.jpg",
  },
  {
    id: 6,
    slug: "hand-dug-ring-well",
    category: "Water Management",
    title: { en: "Hand-dug Ring Well", km: "អណ្ដូងមូលជីកដោយដៃ" },
    khmerName: "អណ្ដូងទឹក",
    description: { en: "How Cambodian households hauled fresh groundwater every morning using a wooden pulley (Rokhah) and stone-weighted bucket from shared village wells.", km: "របៀបគ្រួសារកម្ពុជាដងទឹកក្រោមដីស្រស់រាល់ព្រឹក ដោយប្រើរ៉កឈើ និងធុងមានដុំថ្មពីអណ្ដូងរួមក្នុងភូមិ។" },
    source: { en: "Oum KHOM SOTHEA", km: "អ៊ុំ​ ខុម​​សុធា" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/hand-dug-ring-well.jpg"
  },
  {
    id: 7,
    slug: "handwoven-reed-mat",
    category: "Household Crafts",
    title: { en: "Handwoven Reed Mat", km: "កន្ទេលត្បាញដោយដៃ" },
    khmerName: "កន្ទេល",
    description: { en: "How rural families harvested, dried, and handwove local wild reeds (Kramanh) on ground looms to craft multi-purpose mats for dining, sleeping, and receiving guests.", km: "របៀបគ្រួសារជនបទប្រមូល ហាលស្ងួត និងត្បាញស្មៅព្រៃក្នុងតំបន់ដោយដៃលើកីដី ដើម្បីធ្វើកន្ទេលសម្រាប់បរិភោគអាហារ ដេក និងទទួលភ្ញៀវ។" },
    source: { en: "Local Weavers", km: "អ្នកត្បាញ" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/handwoven-reed-mat.jpg"
  },
  {
    id: 8,
    slug: "traditional-rice-noodle-press",
    category: "Food Preparation",
    title: { en: "Traditional Rice Noodle Press", km: "ម៉ាស៊ីនចុចនំបញ្ចុកបុរាណ" },
    khmerName: "ប៉ែននំបញ្ចុក",
    description: { en: "How neighbors collaborated to press fermented rice dough through a suspended wooden lever press (Paen) into boiling cauldrons to make fresh Nom Banh Chhok.", km: "របៀបអ្នកជិតខាងសហការគ្នាចុចម្សៅអង្ករដែលបានជ្រក់តាមម៉ាស៊ីនចុចដងឈើព្យួរ ចូលក្នុងឆ្នាំងទឹកពុះ ដើម្បីធ្វើនំបញ្ចុកថ្មីៗ។" },
    source: { en: "អ្នកស្រី កែវច័ន្ទបូរណ៍", km: "អ្នកស្រី កែវច័ន្ទបូរណ៍" },
    place: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
    media: { en: "News", km: "ព័ត៌មាន" },
    image: "/images/entries/traditional-rice-noodle-press.jpg"
  }
];
