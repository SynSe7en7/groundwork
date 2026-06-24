import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client bound to the request cookie store.
 * cookies() is async in Next.js 15 and 16, so this helper is async too.
 * Uses the publishable key so Row Level Security still applies. For
 * privileged server work that must bypass RLS, build a separate client
 * with the sb_secret_* key and never expose it to the browser.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll was called from a Server Component. This can be ignored
            // when middleware refreshes the session on every request.
          }
        },
      },
    },
  );
}
