# Khmer Household Archive (បណ្ណសារប្រពៃណីគ្រួសារខ្មែរ)

A bilingual digital archive documenting pre-electrification traditional household tools, domestic crafts, and rural practices across Cambodia, anchored in Kampong Speu Province and open to community contributions from all 25 provinces.

---

## 1. What this is

The **Khmer Household Archive** (Khmer Heritage Archive / បណ្ណសារប្រពៃណីគ្រួសារខ្មែរ) is a community-driven digital repository dedicated to preserving traditional household tools, cooking apparatus, agricultural gear, and oral heritage from before the electrical era. Sourced from local artisans, elders, and family collections, the platform allows visitors to explore authenticated artifacts—such as traditional ox carts (*Roteh Ko*), clay cooking pots (*Chhnang Dei*), and handwoven dish racks (*Reav Chan*)—while enabling contributors to submit their own regional practices through a secure review workflow[cite: 1].

---

## 2. Who it's for

Built for Cambodian families, students, cultural researchers, and educators, the platform integrates specific design and cultural considerations:
* **Khmer First:** Full support for bilingual exploration (`en` and `km`), utilizing Unicode NFC normalization and clean typography (`Noto_Sans_Khmer`) across cards, navigation, and review queues.
* **Phones First:** Fully responsive mobile-first layouts designed for users exploring archive collections or submitting entries directly from smartphones[cite: 1].
* **Slow Connections:** Lightweight Next.js 15 App Router architecture deployed on Vercel edge delivery, ensuring fast load speeds on constrained networks.
* **Named Sources & Respectful Attribution:** Every published practice includes dedicated fields for contributor names and provinces of origin to honor local memory and community ownership.

---

## 3. How it works

The web application runs on **Next.js 15 (App Router, JavaScript)** hosted on **Vercel**, with **Supabase (PostgreSQL)** handling cookie-based SSR authentication (`@supabase/ssr`), relational data storage, and media file uploads (`archive-media` bucket).

### Database Schema & Tables
* **`public.entries`**: Stores core artifact records:
  * `id` (`UUID`, primary key, default `gen_random_uuid()`)
  * `created_at` (`TIMESTAMPTZ`, default `now()`)
  * `owner` (`UUID`, foreign key referencing `auth.users(id)`)
  * `title` & `khmer_title` (`TEXT`)
  * `category` (`TEXT` — e.g., *Food & Cooking*, *Lighting*, *Rice Processing*, *Crafts*)
  * `province` (`TEXT` — mapped across Cambodia's 25 provinces)
  * `description` & `description_km` (`TEXT`)
  * `photo_url` (`TEXT` — stores public Supabase Storage CDN links)
  * `contributor_name` & `contributor_name_km` (`TEXT`)
  * `status` (`TEXT` — moderation state: `pending`, `published`, `returned`)
* **Reviewers / Roles**: Managed via dedicated review permissions and the `is_reviewer()` RPC function in Supabase.
* **Reviewer feedback**: Stored separately from public entries and readable only by the entry owner and authorized reviewers.

### Entry Statuses & Security Policies
* **Statuses:** `pending` (awaiting moderation), `published` (live on public archive pages), and `returned` (sent back for contributor revisions).
* **Read Policies (RLS):** Public routes (`/`, `/archive`) query published entries only (`status = 'published'`), hiding pending and returned records from anonymous visitors.
* **Write Policies (RLS):** Contributors can insert new submissions (`auth.uid() = owner`) and edit or delete strictly their own rows (`auth.uid() = owner`). Direct client-side updates to the `status` column are blocked by database-level security policies.

---

## 4. Security decisions

* **The Review Gate (`review_entry`):** Publishing is executed securely via the server-side PostgreSQL RPC. Returning an entry requires reviewer feedback and uses the reviewer-authorized `return_entry_with_feedback` RPC to save the feedback and status atomically.
* **The Illusion of UI Protection:** Hiding action buttons on the front end only improves usability; real security relies on database-level Row-Level Security (RLS) rules that reject unauthorized API requests or console tampering.
* **Contributor Privacy & Workflows:** Signed-in contributors manage their submissions via a private dashboard (`/my-entries`), tracking `pending`, `published`, and `returned` statuses without exposing draft records to the public.

---

## 5. AI use

AI coding assistants and models were utilized during the development of this repository:

| Model / Tool | Task | Verdict & Action Taken |
| :--- | :--- | :--- |
| **DeepSeek V4.1 Flash (via Cline)** | Core architecture, Next.js component scaffolding (`EntryCard`, `ArchiveGrid`, `ReviewQueue`), and database schema drafting | **Kept with revisions:** Adopted structured components and database definitions, adding strict null safety and optional chaining (`entry?.title`) to prevent runtime render exceptions. |
| **GitHub Copilot Free** | Minor UI bug fixes and layout adjustments | **Kept as written:** Utilized for rapid syntax adjustments and component styling refinements. |
| **OpenRouter Free Model** | Small tasks and utility helpers from lab requirements | **Kept as written:** Integrated directly into utility components and helper scripts. |

---

## 6. Sources and credits

Entries document traditional household practices across Cambodian provinces (including Kampong Speu, Siem Reap, Svay Rieng, Kampong Cham, and Kep), with 15 published practices listed in the archive:
- Traveling by Roteh Ko (ការធ្វើដំណើរដោយរទេះគោ) — Crafts, Siem Reap; contributor: Thy Chan (ធី ចាន់).
- Kanjer (កញ្ជើ) — Crafts, Siem Reap; contributor: Ny Roth (នីរត្ធ).
- Handwoven Reed Mat (កន្ទេលត្បាញដោយដៃ) — Household Crafts, Kampong Speu; contributor: Local Weavers.
- Traditional Rice Noodle Press (ម៉ាស៊ីនកិននំបញ្ចុកបុរាណ) — Food Preparation, Kampong Speu; contributor: អ្នកស្រី កែវច័ន្ទបូរណ៍.
- Watering with a kettle (Kamsiev) (ការដាំទឹកដោយប្រើកំសៀវ) — Cooking, Kampong Speu; contributor: Om Sok (អ៊ុំ សុខ).
- Using clay pots (Chhnang Dei) for cooking (ការប្រើឆ្នាំងដីសម្រាប់ដាំស្ល) — Cooking, Kampong Cham; contributor: Don Dy (ដន ឌី).
- Winnowing Rice by Basket (បក់អង្ករដោយចង្អេរ) — Rice Processing, Kampong Speu; contributor: Grandma SAY NAI.
- Cooking with a Charcoal Stove (ការដាំស្លដោយចង្ក្រានធ្យូង) — Cooking, Kampong Speu; contributor: Grandma SAY NAI.
- Lighting the House with Oil Lamps (បំភ្លឺផ្ទះដោយចង្កៀងប្រេង) — Lighting, Kampong Speu; contributor: Grandpa OU LY.
- Using Tbal Thmor for grinding (ការប្រើប្រាស់ត្បាល់ថ្ម) — Food Preparation, Kampong Speu; contributor: Orm Jinh (អ៊ុំ ជីញ).
- Traditional fish trap woven from split bamboo (Angrut) (ឧបករណ៍ចាប់ត្រីបែបបុរាណអង្រុត) — Crafts, Kep; contributor: Meng Ly (ម៉េង លី).
- Making Rice Flour with a Traditional Khmer Machine (កិនម្សៅអង្ករដោយម៉ាស៊ីនខ្មែរបុរាណ) — Food Preparation, Kampong Speu; contributor: Grandma SAY NAI.
- Stoking Water in Water Tank (ការស្តុកទុកទឹកក្នុងពាងទឹក) — Water Management, Kampong Speu; contributor: Ou Ly.
- Woven Bamboo Dish Rack (រាវចាន) — Cooking, Svay Rieng; contributor: Sokha Chan (ចាន់ សុខា).
- Ironing Clothes with a Charcoal Iron (អ៊ុតសម្លៀកបំពាក់ដោយធ្យុងធ្យូង) — Clothing Care, Kampong Speu; contributor: Grandma SAY NAI.
- Photos / reference material: Sourced/referenced with permission and cultural context including `www.yosothor.org` (`UNSURE` of individual photo-by-photo credit lines where only contributor names were recorded).
  
* **Catalogued Artifacts:** Documented from traditional community knowledge across Cambodian provinces (including Kampong Speu, Siem Reap, Svay Rieng, Kampong Cham, and Battambang), featuring contributions from local elders, traditional makers, and community members such as *Thy Chan*, *Sokha Chan*, *Don Dy*, *Ny Roth*, *Grandma Say Nai*, *Grandpa Ou Ly*, and *Orm Jinh*[cite: 1].
* **Photography:** Visual assets and artifact photos are credited to: www.yosothor.org,

---

## 7. Running it locally

To run and test this repository locally, execute these commands in your terminal:

```bash
# Clone the repository
git clone [https://github.com/pisey88/khmer-household-practices-archive.git](https://github.com/pisey88/khmer-household-practices-archive.git)

# Navigate into the project directory
cd khmer-household-practices-archive

# Install dependencies
npm install

# Run the development server
npm run dev
 ```
Environment Variables
Create a .env.local file in the root directory containing the following variables by name only:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

(Note: The publishable Supabase key is public by design in client-side Next.js applications; data protection is enforced entirely via Supabase RLS security policies).

## 8. Submission checklist

Live URL loads logged out and shows published entries only: yes, https://khmer-household-practices-archive.vercel.app

A stranger cannot publish their own entry through the page or the console: yes, tested (November 15, 2026)

Logged out, the API returns nothing pending or returned: yes, tested (November 15, 2026)

Contributors can edit and delete only their own entries: yes

No secrets anywhere in the repo history: yes, checked with (git log -p and Supabase audit)

At least eight real entries, each with a credited source: yes, (15 published entries)

Khmer renders on every screen a user meets, including the queue: yes

Works at phone width: yes, tested on mobile viewports

No test entries, lorem ipsum or TODO comments in shipped pages: yes

No console errors on the main pages: yes

jesseorndorff is a collaborator on this repo: yes

Supabase project restored and awake on (November 15, 2026)

Demo video link opens in a private window: Yes, https://youtube.com/watch?v=Z0gQuC-gaaY&feature=youtu.be

Reflection pasted in the Canvas submission: yes

Posted in the Show Your Archive discussion: yes

Reflection pasted in the Canvas submission: yes

Posted in the Show Your Archive discussion: yes

Q&A slot booked for Fri 12/4/2026 9:35 AM - 9:40 AM
