"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";
import { getBrowserSupabase } from "./supabase/client";

export function useAuthUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    getBrowserSupabase().then((supabase) => {
      if (!supabase || cancelled) return;
      supabase.auth.getUser().then(({ data }) => {
        if (cancelled) return;
        setUser(data.user);
        setLoading(false);
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);
  return { user, loading };
}
