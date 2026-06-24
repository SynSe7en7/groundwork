// Metro config for Expo Router (native plus React Native Web static export).
// Tamagui resolves through the default Expo resolver; no custom transformer is
// required for the v5 default config.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tamagui ships its styles as .css for the web bundle.
config.resolver.sourceExts = [...config.resolver.sourceExts, 'css', 'mjs'];

module.exports = config;
