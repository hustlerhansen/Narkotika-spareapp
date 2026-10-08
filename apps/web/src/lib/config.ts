/** Public (browser-safe) configuration. Never put secrets in NEXT_PUBLIC_* variables. */
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

/** Cloud accounts are optional. Without configuration the app is fully local. */
export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
