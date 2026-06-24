// Generated Supabase types live in database.ts. Regenerate with:
//   supabase gen types typescript --linked > packages/types/src/database.ts
export type { Database } from './database'

// Shared domain types that are not tied to the database schema go here.
export interface AppUser {
  id: string
  email: string
  displayName: string
}
