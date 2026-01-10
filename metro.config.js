// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Untuk EAS Build, gunakan config yang lebih sederhana
module.exports = withNativeWind(config, {
  input: './global.css',
  // Coba tanpa inlineRem atau dengan nilai default
  // inlineRem: false,
});
