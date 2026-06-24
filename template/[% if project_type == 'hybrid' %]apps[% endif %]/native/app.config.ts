import type { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'Native',
  slug: 'native',
  scheme: 'app',
  version: '0.1.0',
  orientation: 'portrait',
  newArchEnabled: true,
  experiments: {
    typedRoutes: true,
  },
  plugins: ['expo-router'],
  ios: {
    supportsTablet: true,
  },
  android: {
    edgeToEdgeEnabled: true,
  },
  extra: {
    appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  },
}

export default config
