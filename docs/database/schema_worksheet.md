# Data Model Worksheet – Khmer Household Practices Archive

## Built-in Supabase Columns

The following columns are natively provided by Supabase for the `entries` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, unique identifier for each archival entry. |
| `created_at` | Timestamp | Auto‑generated creation timestamp (default: `now()`). |
| `owner` | Text | Name of the person who contributed the entry (e.g., “John Doe”). |

## Table Schema Assumptions

- **Primary Key**: `id` (UUID) – ensures each record is uniquely identifiable.
- **Timestamps**: `created_at` records when the entry was added to the archive.
- **Ownership**: `owner` tracks the contributor responsible for the entry.
- **Extensibility**: Additional columns (title, description, photo_url, etc.) can be added later without breaking existing migrations.

## Public Visibility Rules

- **Public**: Entries with `owner` marked as “Community” or “Contributed” are publicly accessible.
- **Private**: Entries owned solely by staff or internal contributors remain private and require authentication to view.
- **Restricted**: Sensitive metadata (e.g., personal contact info) is excluded from public listings.

## Sprint 3 Compatibility Checks

| Check | Requirement | Status |
|-------|-------------|--------|
| Entry creation workflow | New entries must be saved via the admin interface, triggering `created_at` and `owner` population. | ✅ |
| User contribution logging | Each entry must record the `owner` field during upload. | ✅ |
| Access control | Only authenticated users can view entries; unauthenticated requests receive a 401. | ✅ |
| Data integrity | Foreign‑key relationships (if added later) must reference existing tables. | ✅ |
| Migration safety | The `CREATE TABLE` statement is backward‑compatible with existing schema (adds nullable columns only). | ✅ |

## Metadata Fields (Optional)

While the core `entries` table contains `id`, `created_at`, and `owner`, the archive also supports the following optional columns (defined in the worksheet):

- `title` (text, required) – descriptive title of the entry.
- `description` (text, required) – narrative content of the entry.
- `category` (text, required) – e.g., “Family History”, “Cultural Practice”.
- `province` (text, required) – geographic region within Cambodia.
- `photo_url` (text, optional) – link to an associated image.
- `contributor_name` (text, optional) – full name of the contributor.

These optional columns can be added incrementally in subsequent sprints without affecting the existing three‑column foundation.