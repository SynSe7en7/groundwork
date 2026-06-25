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
      // Reanimated 4 moved its Babel plugin into react-native-worklets. This
      // entry must stay last in the plugin list.
      'react-native-worklets/plugin',
    ],
  };
};
