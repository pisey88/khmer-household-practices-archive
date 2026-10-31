// app/review/page.js
//
// Server component. The is_reviewer check runs on the server with the
// session cookie, so a non-reviewer only ever sees the access-denied message
// and never the queue. Pending entries are fetched through the same server
// client (RLS applies) and passed to the interactive client queue.

import { createClient } from "../../lib/supabase/server.js";
import { TRANSLATIONS } from "../../lib/i18n.js";
import ReviewQueue from "../../components/review/ReviewQueue.js";

export default async function ReviewPage() {
  // Avoid crashing when the environment isn't configured; treat it as
  // "not a reviewer" so only the access-denied message is shown.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return (
      <main className="review-page">
        <p className="review-denied">{TRANSLATIONS.en.reviewAccessDenied}</p>
      </main>
    );
  }

  const supabase = await createClient();

  const { data: isReviewer } = await supabase.rpc("is_reviewer");

  if (isReviewer !== true) {
    return (
      <main className="review-page">
        <p className="review-denied">{TRANSLATIONS.en.reviewAccessDenied}</p>
      </main>
    );
  }

  const { data: entries, error } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="review-page">
        <p className="review-denied">{TRANSLATIONS.en.reviewFailed}</p>
      </main>
    );
  }

  return <ReviewQueue initialEntries={entries ?? []} />;
}