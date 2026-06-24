import type { ExpoConfig, ConfigContext } from 'expo/config';

// Dynamic config. App identity comes from app.json values below; runtime wiring
// (Supabase URL, env badge) is read from EXPO_PUBLIC_* vars at build time.
// Expo SDK 55 ships the New Architecture only; there is no newArchEnabled flag.

const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'develop';
const SCHEME = process.env.EXPO_PUBLIC_SCHEME ?? 'app';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.EXPO_PUBLIC_APP_NAME ?? 'App',
  slug: config.slug ?? 'app',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: SCHEME,
  userInterfaceStyle: 'automatic',
  // Surface the active environment so native and OTA channels can branch on it.
  extra: {
    appEnv: APP_ENV,
    ...(config.extra ?? {}),
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? 'com.example.app',
  },
  android: {
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.example.app',
  },
  // React Native Web target via Expo Router static rendering, deployed to Vercel.
  web: {
    bundler: 'metro',
    output: 'static',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
});
