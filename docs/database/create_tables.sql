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
    photo_url TEXT,
    contributor_name TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

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