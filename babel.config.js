module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
<<<<<<< HEAD
=======
    plugins: ['react-native-reanimated/plugin'],
    // plugins: ['react-native-worklets-core/plugin']
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
  };
};