// Centralized access to public runtime config. Only EXPO_PUBLIC_* vars are
// readable on the device; never reference a server-only secret here.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var ${name}. Set it in your .env file.`);
  }
  return value;
}

export const env = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'develop',
  supabaseUrl: required('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabasePublishableKey: required(
    'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ),
} as const;

export const isProd = env.appEnv === 'prod';
