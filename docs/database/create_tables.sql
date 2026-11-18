-- Create the entries table for the Khmer Household Practices Archive
CREATE TABLE public.entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    owner UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    khmer_title TEXT,
    category TEXT NOT NULL,
    province TEXT NOT NULL,
    description TEXT NOT NULL,
    description_km TEXT,
    photo_url TEXT,
    contributor_name TEXT,
    contributor_name_km TEXT
);

-- Reviewer notes are kept separate from public entry data.
CREATE TABLE public.entry_review_feedback (
    entry_id UUID PRIMARY KEY REFERENCES public.entries(id) ON DELETE CASCADE,
    feedback TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add the nullable field to entries tables created before bilingual names were supported.
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS contributor_name_km TEXT;

-- Add the optional Khmer description to entries created before bilingual descriptions were supported.
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS description_km TEXT;

-- Enable Row Level Security (RLS)
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_review_feedback ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.entry_review_feedback FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.entry_review_feedback TO authenticated;

CREATE POLICY "entry owners and reviewers can read feedback"
  ON public.entry_review_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.entries
      WHERE public.entries.id = entry_review_feedback.entry_id
        AND public.entries.owner = auth.uid()
    )
    OR public.is_reviewer() IS TRUE
  );

-- 1. Anyone can read entries
CREATE POLICY "anyone can read entries"
  ON public.entries FOR SELECT 
  USING (true);

-- 2. Owners add their own entries
CREATE POLICY "owners add their own entries"
  ON public.entries FOR INSERT 
  WITH CHECK (auth.uid() = owner);

-- 3. Owners edit their own entries
CREATE POLICY "owners edit their own entries"
  ON public.entries FOR UPDATE 
  USING (auth.uid() = owner);

-- 4. Owners delete their own entries
CREATE POLICY "owners delete their own entries"
  ON public.entries FOR DELETE 
  USING (auth.uid() = owner);

-- Performance Indexes
CREATE INDEX idx_entries_owner ON public.entries (owner);
CREATE INDEX idx_entries_category ON public.entries (category);
CREATE INDEX idx_entries_created_at ON public.entries (created_at);