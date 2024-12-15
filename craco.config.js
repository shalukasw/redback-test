module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        (warning) => {
          if (
            warning.message &&
            warning.message.includes('source-map-loader')
          ) {
            return true;
          }
          return false;
        },
      ],
    },
  },
};
