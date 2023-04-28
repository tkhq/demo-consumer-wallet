const config = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("readable-stream"),
      events: require.resolve("events"),
    },
  },
};

module.exports = config;
