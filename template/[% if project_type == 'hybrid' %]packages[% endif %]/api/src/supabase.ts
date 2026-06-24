import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@PROJECT_SLUG_PLACEHOLDER/types'

// Reads the same client-safe values on both runtimes: web exposes NEXT_PUBLIC_*
// and native exposes EXPO_PUBLIC_*. The publishable key is safe in a client
// bundle and respects row-level security. The sb_secret_* key is server-only
// and must never be referenced here.
function readEnv(): { url: string; publishableKey: string } {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    ''
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ''
  return { url, publishableKey }
}

let client: SupabaseClient<Database> | null = null

// Lazy singleton so importing this module never throws when env values are
// absent (for example during a type-check or an early build step).
export function createSupabaseClient(): SupabaseClient<Database> {
  if (client) return client
  const { url, publishableKey } = readEnv()
  client = createClient<Database>(url, publishableKey)
  return client
}
