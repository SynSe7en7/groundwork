// Expo SDK 54 Babel config. babel-preset-expo covers expo-router, the New
// Architecture, and react-native-reanimated. The Tamagui plugin optimizes the
// shared design-system components so native and web compile from one config.
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui', '@PROJECT_SLUG_PLACEHOLDER/ui'],
          config: '../../packages/ui/src/tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
    ],
  }
}
