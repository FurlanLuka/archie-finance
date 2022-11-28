const nxWebpack = require('@nrwl/react/plugins/webpack');
const { merge } = require('webpack-merge');

module.exports = (config, context) => {
  const newConfig = nxWebpack(config, context);

  config.optimization = {};

  return merge(newConfig, {
    output: {
      libraryTarget: 'commonjs',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.?ts$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript', '@babel/preset-env'],
            },
          },
        },
      ],
    },
  });
};
