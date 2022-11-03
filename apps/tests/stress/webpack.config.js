const webpack = require('webpack');
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
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.?ts$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript'],
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  });
};
