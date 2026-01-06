module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Hapus sementara semua plugins
    // plugins: ['react-native-reanimated/plugin'],
  };
};
