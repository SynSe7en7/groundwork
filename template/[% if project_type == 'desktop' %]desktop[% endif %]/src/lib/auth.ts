"use client";

import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { openUrl } from "@tauri-apps/plugin-opener";
import { supabase } from "@/lib/supabase";

// Deep-link OAuth for a packaged app: there is no localhost callback inside the
// webview, so we open the provider in the system browser and let the OS hand
// the result back via the app's registered URL scheme (see tauri.conf.json
// `plugins.deep-link.desktop.schemes`). The default scheme is the fixed literal
// "app", which must stay identical to the scheme registered in tauri.conf.json.
// Override both in lockstep via NEXT_PUBLIC_DEEP_LINK_SCHEME plus the conf entry
// if you need a project-unique scheme.
const SCHEME = process.env.NEXT_PUBLIC_DEEP_LINK_SCHEME ?? "app";
const REDIRECT_TO = `${SCHEME}://auth-callback`;

export async function signInWithOAuth(provider: "google" | "github") {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: REDIRECT_TO, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (data?.url) await openUrl(data.url);
}

// Call once at startup to complete the round trip when the OS reopens the app
// with the callback URL. Exchanges the returned code for a session.
export async function registerDeepLinkAuthHandler() {
  if (!supabase) return () => {};
  return onOpenUrl(async (urls) => {
    for (const raw of urls) {
      if (!raw.startsWith(`${SCHEME}://`)) continue;
      const url = new URL(raw);
      const code = url.searchParams.get("code");
      if (code) await supabase!.auth.exchangeCodeForSession(code);
    }
  });
}
