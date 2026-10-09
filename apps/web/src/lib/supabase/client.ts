"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseConfig } from "../config";

let client: Promise<SupabaseClient> | null = null;

/**
 * Browser Supabase client (anon key + RLS), loaded on demand so people who never use an account
 * never download the Supabase library. Resolves to null when cloud accounts are not configured.
 */
export function getBrowserSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  client ??= import("@supabase/ssr").then(({ createBrowserClient }) => createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey));
  return client;
}
