import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

import { env } from './env';
import { secureStorage } from './secure-storage';

// On native we persist the session through the encrypted AsyncStorage adapter.
// On web there is no SecureStore, so supabase-js falls back to its default
// browser storage and we skip the custom adapter.
const isNative = Platform.OS !== 'web';

export const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey, {
  auth: {
    ...(isNative ? { storage: secureStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    // URL session detection is a browser concern; disable on native.
    detectSessionInUrl: !isNative,
  },
});
