// lib/supabase/client.js
// Browser client for @supabase/ssr with Next.js 15 App Router

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    token: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}