import { useEffect, useState } from "react";
import { createClient } from "./supabase/client.js";

/**
 * Provides the currently authenticated user (ID) to components.
 * Uses Supabase's browser client to fetch the signed-in user.
 */
export function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!createClient) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.onAuthStateChange(({ user }) => {
      setUser(user?.user ?? null);
    });
  }, []);

  return user;
}

export default useCurrentUser;