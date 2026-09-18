// lib/supabase/server.js
// Server client for @supabase/ssr with Next.js 15 App Router.
// Use in Server Components and Route Handlers where cookies are available.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    token: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    cookieOptions: {
      cookieStore,
    },
  });
}