-- Add Khmer contributor names to existing entries tables.
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS contributor_name_km TEXT;

-- Make the new column visible to the Supabase API without waiting for a cache refresh.
NOTIFY pgrst, 'reload schema';
