module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-worklets/plugin must stay last (used by Reanimated).
    plugins: ['react-native-worklets/plugin'],
  };
};
