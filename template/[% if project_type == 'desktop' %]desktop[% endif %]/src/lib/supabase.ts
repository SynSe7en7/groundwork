import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client only. A packaged Tauri app has no Node server, so the SSR /
// middleware Supabase helpers do not apply here. Only the publishable key is
// ever shipped in the bundle. The secret key (sb_secret_*) bypasses RLS and
// must never reach the webview; server-only work goes through the web tier or
// a Supabase Edge Function.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Null when env is absent so the app still renders during local bring-up.
export const supabase: SupabaseClient | null =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // The webview has no server callback route. OAuth returns through a
          // registered deep link; see signInWithOAuth in lib/auth.ts.
          detectSessionInUrl: false,
        },
      })
    : null;
