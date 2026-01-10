// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Tambahkan isCSSEnabled: true
const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: false,
});
