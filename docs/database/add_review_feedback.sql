-- Keep reviewer feedback separate from publicly readable entry data.
CREATE TABLE IF NOT EXISTS public.entry_review_feedback (
  entry_id UUID PRIMARY KEY REFERENCES public.entries(id) ON DELETE CASCADE,
  feedback TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.entry_review_feedback ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.entry_review_feedback FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.entry_review_feedback TO authenticated;

DROP POLICY IF EXISTS "entry owners and reviewers can read feedback"
  ON public.entry_review_feedback;
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

-- Return a pending entry and save its required feedback atomically.
CREATE OR REPLACE FUNCTION public.return_entry_with_feedback(
  p_entry_id UUID,
  p_feedback TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF public.is_reviewer() IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Not authorized to return entries'
      USING ERRCODE = '42501';
  END IF;

  IF p_feedback IS NULL OR btrim(p_feedback) = '' THEN
    RAISE EXCEPTION 'Feedback is required'
      USING ERRCODE = '22023';
  END IF;

  UPDATE public.entries
  SET status = 'returned'
  WHERE id = p_entry_id
    AND status = 'pending';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.entry_review_feedback (entry_id, feedback, updated_at)
  VALUES (p_entry_id, btrim(p_feedback), now())
  ON CONFLICT (entry_id)
  DO UPDATE SET
    feedback = EXCLUDED.feedback,
    updated_at = EXCLUDED.updated_at;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.return_entry_with_feedback(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.return_entry_with_feedback(UUID, TEXT) TO authenticated;

NOTIFY pgrst, 'reload schema';
