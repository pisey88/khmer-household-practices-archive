-- Create the entries table for the Khmer Household Practices Archive
-- This table stores archival items with the following columns:
--   id: UUID (primary key, auto-generated)
--   created_at: TIMESTAMPTZ (timestamp with time zone, auto-generated)
--   owner: UUID (references auth.users, not null)
--   title: TEXT (required)
--   khmer_title: TEXT (optional)
--   category: TEXT (required)
--   province: TEXT (required)
--   description: TEXT (required)
--   photo_url: TEXT (optional)
--   contributor_name: TEXT (optional)

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
-- Row Level Security policies
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read entries (public read)
CREATE POLICY "anyone can read entries"
    ON public.entries
    FOR SELECT USING (TRUE);

-- Policy: owners can only insert their own entries
CREATE POLICY "owners add their own entries"
    ON public.entries
    FOR INSERT
    USING (auth.uid() = owner);

-- Policy: owners can only update their own entries
CREATE POLICY "owners edit their own entries"
    ON public.entries
    FOR UPDATE
    USING (auth.uid() = owner);

-- Policy: owners can only delete their own entries
CREATE POLICY "owners delete their own entries"
    ON public.entries
    FOR DELETE
    USING (auth.uid() = owner);

-- Indexes for common queries to keep database lookups fast
CREATE INDEX idx_entries_owner ON public.entries (owner);
CREATE INDEX idx_entries_category ON public.entries (category);
CREATE INDEX idx_entries_created_at ON public.entries (created_at);
