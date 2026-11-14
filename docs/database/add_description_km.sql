-- Add a separate Khmer description to existing entries.
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS description_km TEXT;

-- Make the new column visible to the Supabase API without waiting for a cache refresh.
NOTIFY pgrst, 'reload schema';
