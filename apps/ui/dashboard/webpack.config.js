const nxWebpack = require('@nrwl/react/plugins/webpack');
const { merge } = require('webpack-merge');

module.exports = (config, context) => {
  const newConfig = nxWebpack(config, context);

  newConfig.module.rules = newConfig.module.rules.filter((rule) => {
    // remove svg rules, so we can add our own config
    return !rule.test.toString().includes('.svg');
  });

  return merge(newConfig, {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: [
            { loader: '@svgr/webpack', options: { SVGO: true } },
            { loader: 'url-loader' },
          ],
        },
      ],
    },
  });
};
