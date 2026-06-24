module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Tamagui compile-time optimizer. Reads tamagui.config.ts via the config
      // option so style props are flattened at build time on native and web.
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],
      // react-native-reanimated must stay last in the plugin list.
      'react-native-reanimated/plugin',
    ],
  };
};
