// Metro config for Expo Router (native plus React Native Web static export).
// The default Expo resolver needs no custom transformer for this stack.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow .css and .mjs sources so the React Native Web bundle can resolve them.
config.resolver.sourceExts = [...config.resolver.sourceExts, 'css', 'mjs'];

module.exports = config;
